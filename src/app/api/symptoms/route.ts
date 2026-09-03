import { NextRequest, NextResponse } from "next/server";

const TRIAGE_PROMPT = `You are a maternal health triage assistant. Given a list of symptoms, gestational week, severity, and duration, classify the risk level and provide structured guidance.

RISK CLASSIFICATION:
- LOW: Mild symptoms common in normal pregnancy. Self-care and monitoring advised.
- MEDIUM: Symptoms that need medical attention within 24-48 hours. Not immediately dangerous but should not be ignored.
- HIGH: Symptoms that require immediate medical attention. Possible emergency.

RESPONSE FORMAT (JSON):
{
  "riskLevel": "LOW" | "MEDIUM" | "HIGH",
  "summary": "Brief description of the assessment",
  "vitalSigns": [
    { "label": "string", "value": "string", "status": "Normal" | "Elevated" | "Concerning" }
  ],
  "recommendedActions": [
    { "action": "string", "priority": "routine" | "soon" | "urgent" }
  ],
  "dangerSigns": ["string — signs that mean the situation is worsening"],
  "whenToVisitDoctor": "Clear timing guidance"
}`;

export async function POST(req: NextRequest) {
  try {
    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const body = await req.json();
    const { symptoms, gestationalWeek, severity, duration, language } = body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return NextResponse.json({ error: "At least one symptom is required" }, { status: 400 });
    }

    const langInstruction =
      language === "urdu"
        ? "\nProvide the summary in simple Urdu (Roman Urdu acceptable)."
        : "\nProvide the summary in simple English.";

    const userMessage = `Symptoms: ${symptoms.join(", ")}
Gestational Week: ${gestationalWeek || "unknown"}
Severity: ${severity || "unknown"}
Duration: ${duration || "unknown"}${langInstruction}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: TRIAGE_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 600,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "No response generated" }, { status: 500 });
    }

    const triage = JSON.parse(content);
    return NextResponse.json(triage);
  } catch (error) {
    console.error("Symptoms API error:", error);
    return NextResponse.json(
      { error: "Failed to analyze symptoms. Please try again." },
      { status: 500 }
    );
  }
}
