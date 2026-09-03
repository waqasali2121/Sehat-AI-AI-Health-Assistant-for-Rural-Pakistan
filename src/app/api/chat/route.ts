import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { getKnowledgeContext } from "@/lib/knowledge/medical-database";

// Lazy-initialize client connections
function getOpenAIClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, pregnancyWeek, language } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    const openai = getOpenAIClient();
    const supabase = getSupabaseClient();

    const lastUserMessage = messages[messages.length - 1]?.content || "";
    let contextText = "";
    let sources: Array<{ source: string; category?: string; topic?: string; similarity?: number }> = [];

    // 1. Attempt RAG Retrieval via pgvector if Supabase is connected
    if (supabase && lastUserMessage) {
      try {
        let queryEmbedding: number[] | null = null;
        try {
          const { pipeline } = await import("@xenova/transformers");
          const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
          const output = await extractor(lastUserMessage, { pooling: "mean", normalize: true });
          queryEmbedding = Array.from(output.data);
        } catch {
          const embedRes = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: lastUserMessage,
          });
          queryEmbedding = embedRes.data[0]?.embedding;
        }

        if (queryEmbedding) {
          const { data: matchedDocs, error: rpcError } = await supabase.rpc("match_documents", {
            query_embedding: queryEmbedding,
            match_threshold: 0.2,
            match_count: 4,
            filter: {},
          });

          if (!rpcError && matchedDocs && matchedDocs.length > 0) {
            contextText = matchedDocs
              .map((doc: any, i: number) => `[Source ${i + 1}: ${doc.filename} - Category: ${doc.metadata?.category || "General"}]\n${doc.content}`)
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
        console.warn("RAG retrieval fallback to baseline database:", ragErr);
      }
    }

    // Fallback to offline medical database context if RAG returned no matches
    if (!contextText) {
      contextText = getKnowledgeContext();
    }

    // 2. System Prompt Formulation
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

    // 3. Generate OpenAI Chat Response
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
      "I'm sorry, I couldn't process your question right now. Please try again or seek medical guidance.";

    return NextResponse.json({ reply, sources });
  } catch (error) {
    console.error("Chat RAG API Error:", error);
    return NextResponse.json(
      { error: "Failed to process your medical query. Please try again." },
      { status: 500 }
    );
  }
}
