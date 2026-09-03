import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Dr. Ayesha, an AI maternal health assistant for pregnant women in rural Pakistan. You provide clear, compassionate guidance in simple language.

IMPORTANT RULES:
- You are NOT a replacement for a real doctor. Always include disclaimers.
- If symptoms suggest an emergency (heavy bleeding, severe headache with vision changes, reduced fetal movement, severe abdominal pain), immediately advise the user to seek emergency care.
- Keep responses short and easy to understand.
- Use culturally appropriate language and examples.

RESPONSE FORMAT (always follow this structure):
1. **Patient Concern** — Brief summary of what the patient described
2. **Possible Explanation** — Simple explanation of what might be happening
3. **Recommended Action** — Clear steps the patient should take
4. **Warning Signs** — Symptoms that would mean the situation is getting worse
5. **When To Visit Doctor** — Specific guidance on timing for in-person care
6. **Medical Disclaimer** — Remind the patient this is AI guidance, not a medical diagnosis`;

export async function POST(req: NextRequest) {
  try {
    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const body = await req.json();
    const { messages, pregnancyWeek, language } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    const langInstruction =
      language === "urdu"
        ? "\nRespond in Urdu (Roman Urdu is acceptable). Use simple, warm language."
        : "\nRespond in simple English. Avoid medical jargon.";

    const contextNote = pregnancyWeek
      ? `\nThe patient is at week ${pregnancyWeek} of pregnancy.`
      : "";

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT + langInstruction + contextNote } as const,
        ...(messages as Array<{ role: "user" | "assistant" | "system"; content: string }>),
      ],
      temperature: 0.4,
      max_tokens: 800,
    });

    const reply = response.choices[0]?.message?.content ?? "I'm sorry, I couldn't process that. Please try again.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process your message. Please try again." },
      { status: 500 }
    );
  }
}
