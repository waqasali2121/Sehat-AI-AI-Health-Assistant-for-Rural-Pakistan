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

    // 1. Attempt RAG Retrieval via pgvector if Supabase & OpenAI are connected
    if (openai && supabase && lastUserMessage) {
      try {
        const embedRes = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: lastUserMessage,
        });
        const queryEmbedding = embedRes.data[0]?.embedding;

        if (queryEmbedding) {
          const { data: matchedDocs, error: rpcError } = await supabase.rpc("match_documents", {
            query_embedding: queryEmbedding,
            match_threshold: 0.2,
            match_count: 4,
            filter: {},
          });

          if (!rpcError && matchedDocs && matchedDocs.length > 0) {
            contextText = matchedDocs
              .map(
                (doc: any, i: number) =>
                  `[Source ${i + 1}: ${doc.filename} - Category: ${
                    doc.metadata?.category || "General"
                  }]\n${doc.content}`
              )
              .join("\n\n");

            sources = matchedDocs.map((d: any) => ({
              source: d.filename,
              category: d.metadata?.category,
              topic: d.metadata?.topic,
              similarity: d.similarity ? Math.round(d.similarity * 1000) / 1000 : undefined,
            }));
          }
        }
      } catch (ragErr) {
        console.warn("RAG retrieval fallback to offline medical database:", ragErr);
      }
    }

    // Baseline offline knowledge context if RAG yields nothing
    if (!contextText) {
      contextText = getKnowledgeContext();
      sources = [{ source: "Sehat AI Offline Knowledge Base", category: "Maternal Clinical Guidelines" }];
    }

    // 2. Fallback execution if OpenAI key is invalid or client creation failed
    if (!openai) {
      console.warn("OpenAI API key missing or invalid. Utilizing Sehat AI local fallback engine.");
      const fallbackReply = generateStructuredFallback(lastUserMessage, pregnancyWeek || 20);
      return NextResponse.json({
        reply: fallbackReply,
        sources,
        isFallback: true,
      });
    }

    // 3. System Prompt Formulation
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
- You are NOT a replacement for a real doctor. Always include disclaimers.
- EMERGENCY RED FLAGS: If symptoms suggest an emergency (heavy vaginal bleeding, severe headache with vision changes, reduced/absent fetal movement, severe abdominal pain, high fever, collapse/fainting), IMMEDIATELY advise the patient to seek urgent emergency care at the nearest hospital/RHC.
- Keep responses warm, structured, reassuring, and clear.

EVIDENCE-BASED MEDICAL KNOWLEDGE CONTEXT:
${contextText}
${langInstruction}
${contextNote}

RESPONSE FORMAT (always structure your response with these exact bold headings):
1. **Patient Concern** — Brief summary acknowledging what the patient described
2. **Possible Explanation** — Simple, reassuring explanation of what might be happening
3. **Recommended Action** — Clear, actionable self-care or testing advice
4. **Warning Signs** — Symptoms that mean the situation is getting worse
5. **When To Visit Doctor** — Specific timing guidance for in-person medical care
6. **Medical Disclaimer** — Remind the patient this is AI guidance, not a formal medical diagnosis`;

    // 4. Generate OpenAI Response with Try/Catch Fallback
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
      console.error("OpenAI Execution Error, switching to offline fallback engine:", openaiErr);
      const fallbackReply = generateStructuredFallback(lastUserMessage, pregnancyWeek || 20);
      return NextResponse.json({
        reply: fallbackReply,
        sources,
        isFallback: true,
      });
    }
  } catch (error) {
    console.error("Chat API General Error:", error);
    const fallbackReply = generateStructuredFallback("General inquiry", 20);
    return NextResponse.json(
      {
        reply: fallbackReply,
        sources: [{ source: "Sehat AI Safety Engine", category: "Emergency Guidance" }],
        isFallback: true,
      },
      { status: 200 } // Return 200 with fallback content instead of 500 error page
    );
  }
}
