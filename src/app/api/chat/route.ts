import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { getKnowledgeContext, generateStructuredFallback } from "@/lib/knowledge/medical-database";

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "your-openai-api-key" || apiKey.includes("sb_secret")) {
    return null;
  }
  try {
    return new OpenAI({ apiKey });
  } catch {
    return null;
  }
}

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("your-supabase")) return null;
  try {
    return createClient(url, key);
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { messages, pregnancyWeek, language } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    const lastUserMessage = messages[messages.length - 1]?.content || "";
    const openai = getOpenAIClient();
    const supabase = getSupabaseClient();

    let contextText = "";
    let sources: Array<{ source: string; category?: string; topic?: string; similarity?: number }> = [];

    // 1. RAG Retrieval from uploaded PDF vector database (documents table in Supabase)
    if (supabase && lastUserMessage) {
      try {
        let queryEmbedding: number[] | null = null;

        // Option A: OpenAI Embedding (if OpenAI key is active)
        if (openai) {
          try {
            const embedRes = await openai.embeddings.create({
              model: "text-embedding-3-small",
              input: lastUserMessage,
            });
            queryEmbedding = embedRes.data[0]?.embedding || null;
          } catch (embedErr) {
            console.warn("OpenAI embedding generation failed, trying keyword fallback:", embedErr);
          }
        }

        // Search Supabase using vector similarity match_documents function if embedding is available
        if (queryEmbedding) {
          const { data: matchedDocs, error: rpcError } = await supabase.rpc("match_documents", {
            query_embedding: queryEmbedding,
            match_threshold: 0.15,
            match_count: 5,
            filter: {},
          });

          if (!rpcError && matchedDocs && matchedDocs.length > 0) {
            contextText = matchedDocs
              .map(
                (doc: any, i: number) =>
                  `[PDF Source ${i + 1}: ${doc.filename || doc.metadata?.source || "Medical PDF Document"} - Category: ${
                    doc.metadata?.category || "Clinical Guidance"
                  }]\n${doc.content}`
              )
              .join("\n\n---\n\n");

            sources = matchedDocs.map((d: any) => ({
              source: d.filename || d.metadata?.source || "Uploaded Medical PDF",
              category: d.metadata?.category || "Clinical Protocol",
              topic: d.metadata?.topic,
              similarity: d.similarity ? Math.round(d.similarity * 1000) / 1000 : undefined,
            }));
          }
        }

        // Option B: Direct Supabase text query fallback if vector search yielded no docs
        if (!contextText) {
          const keywords = lastUserMessage.split(/\s+/).filter((w: string) => w.length > 3).slice(0, 3);
          if (keywords.length > 0) {
            const queryFilter = keywords.map((k: string) => `content.ilike.%${k}%`).join(",");
            const { data: textDocs } = await supabase
              .from("documents")
              .select("filename, content, metadata")
              .or(queryFilter)
              .limit(4);

            if (textDocs && textDocs.length > 0) {
              contextText = textDocs
                .map(
                  (doc: any, i: number) =>
                    `[PDF Document ${i + 1}: ${doc.filename || doc.metadata?.source || "Medical PDF"}]:\n${doc.content}`
                )
                .join("\n\n---\n\n");

              sources = textDocs.map((d: any) => ({
                source: d.filename || d.metadata?.source || "Uploaded Medical PDF",
                category: d.metadata?.category || "Medical Reference PDF",
              }));
            }
          }
        }
      } catch (ragErr) {
        console.warn("RAG retrieval fallback to baseline medical database:", ragErr);
      }
    }

    // Baseline offline medical database context if RAG returned no matches
    if (!contextText) {
      contextText = getKnowledgeContext();
      sources = [{ source: "Sehat AI Clinical Guidelines (PDF Base)", category: "Maternal Healthcare Standards" }];
    }

    // 2. Local fallback response if OpenAI API key is missing
    if (!openai) {
      console.warn("OpenAI API key missing or invalid. Utilizing Sehat AI local RAG fallback engine.");
      const fallbackReply = generateStructuredFallback(lastUserMessage, pregnancyWeek || 20);
      return NextResponse.json({
        reply: fallbackReply,
        sources,
        isFallback: true,
      });
    }

    // 3. System Prompt with RAG PDF Context
    const langInstruction =
      language === "urdu"
        ? "\nRespond in warm, simple Roman Urdu or clear Urdu so women in Pakistan can easily understand."
        : "\nRespond in simple, reassuring English without medical jargon.";

    const contextNote = pregnancyWeek
      ? `\nThe patient is currently at week ${pregnancyWeek} of pregnancy.`
      : "";

    const SYSTEM_PROMPT = `You are Dr. Ayesha, an empathetic senior AI maternal health assistant serving pregnant women in Pakistan (especially rural areas with limited healthcare access).

CRITICAL MEDICAL SAFETY RULES:
- Sehat AI provides educational guidance only. It does not replace physical examination by a qualified doctor.
- Always include disclaimers and urge immediate hospital care for emergencies (bleeding, reduced movement, severe headache, seizures).
- Use the retrieved RAG PDF medical guidelines context below to answer accurately.

RETRIEVED PDF MEDICAL KNOWLEDGE BASE (RAG):
${contextText}
${langInstruction}
${contextNote}

RESPONSE FORMAT (always structure your response with these exact bold headings):
1. **Patient Concern** — Brief summary acknowledging what the patient described
2. **Possible Explanation** — Simple, reassuring explanation derived from PDF guidelines
3. **Recommended Action** — Clear, actionable self-care or testing advice
4. **Warning Signs** — Symptoms that mean the situation is getting worse
5. **When To Visit Doctor** — Specific timing guidance for in-person medical care
6. **Medical Disclaimer** — Remind the patient this is AI guidance, not a formal medical diagnosis`;

    // 4. Generate AI Chat Response using RAG PDF context
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...(messages as Array<{ role: "user" | "assistant" | "system"; content: string }>),
        ],
        temperature: 0.3,
        max_tokens: 850,
      });

      const reply =
        response.choices[0]?.message?.content ??
        generateStructuredFallback(lastUserMessage, pregnancyWeek || 20);

      return NextResponse.json({ reply, sources, isFallback: false });
    } catch (openaiErr: any) {
      console.error("OpenAI Execution Error, switching to RAG offline fallback engine:", openaiErr);
      const fallbackReply = generateStructuredFallback(lastUserMessage, pregnancyWeek || 20);
      return NextResponse.json({
        reply: fallbackReply,
        sources,
        isFallback: true,
      });
    }
  } catch (error) {
    console.error("Chat RAG API General Error:", error);
    const fallbackReply = generateStructuredFallback("General inquiry", 20);
    return NextResponse.json(
      {
        reply: fallbackReply,
        sources: [{ source: "Uploaded Medical PDFs & Safety Engine", category: "Emergency Guidance" }],
        isFallback: true,
      },
      { status: 200 }
    );
  }
}
