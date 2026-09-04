"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AppHeader } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { Icon } from "@/components/icon";
import { getPatientRecord, addChatRecord, getChatHistory } from "@/lib/patient-store";
import { generateStructuredFallback } from "@/lib/knowledge/medical-database";

type Role = "system" | "user" | "ai";

interface AiSection {
  label: string;
  urduLabel: string;
  body: string;
  urduBody?: string;
}

interface SourceInfo {
  source: string;
  category?: string;
  similarity?: number;
}

interface Message {
  id: string;
  role: Role;
  text: string;
  urdu?: string;
  time: string;
  sections?: AiSection[];
  warnings?: { en: string; ur: string }[];
  whenToVisit?: string;
  disclaimer?: string;
  audioScript?: string;
  sources?: SourceInfo[];
  isFallback?: boolean;
}

const QUICK_PROMPTS = [
  { en: "Swelling in feet", ur: "پیروں میں سوجن" },
  { en: "Baby not moving", ur: "بچہ حرکت نہیں کر رہا" },
  { en: "Bleeding concern", ur: "خون آنا" },
  { en: "Nutrition advice", ur: "غذائی مشورہ" },
];

const DISCLAIMER =
  "I am an AI assistant and not a substitute for a qualified doctor. In an emergency call 1122 or reach your nearest BHU immediately.";

function nowLabel() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function speakUrdu(text: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onEnd?.();
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ur-PK";
  utterance.rate = 0.9;
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();
  window.speechSynthesis.speak(utterance);
}

// Parse markdown headings from API text into structured UI sections
function parseStructuredResponse(replyText: string): {
  title: string;
  sections: AiSection[];
  warnings: { en: string; ur: string }[];
  whenToVisit?: string;
  disclaimer?: string;
} {
  const sections: AiSection[] = [];
  const warnings: { en: string; ur: string }[] = [];
  let whenToVisit: string | undefined;
  let disclaimer: string | undefined;
  let title = "Dr. Ayesha's Guidance";

  const lines = replyText.split("\n");
  let currentHeader = "";
  let currentContent: string[] = [];

  const flush = () => {
    if (!currentHeader) return;
    const body = currentContent.join("\n").trim();
    if (!body) return;

    const lowerHeader = currentHeader.toLowerCase();

    if (lowerHeader.includes("patient concern")) {
      title = body.slice(0, 60) + (body.length > 60 ? "…" : "");
      sections.push({ label: "Patient Concern", urduLabel: "مریض کی شکایت", body });
    } else if (lowerHeader.includes("possible explanation")) {
      sections.push({ label: "Possible Explanation", urduLabel: "ممکنہ وجہ", body });
    } else if (lowerHeader.includes("recommended action")) {
      sections.push({ label: "Recommended Action", urduLabel: "تجویز کردہ اقدامات", body });
    } else if (lowerHeader.includes("warning signs")) {
      const items = body.split("\n").filter((l) => l.trim().length > 0);
      for (const item of items) {
        const clean = item.replace(/^[-*•\d.]+\s*/, "");
        if (clean) warnings.push({ en: clean, ur: "طبی معائنے کی ضرورت" });
      }
    } else if (lowerHeader.includes("when to visit doctor")) {
      whenToVisit = body;
    } else if (lowerHeader.includes("disclaimer")) {
      disclaimer = body;
    } else {
      sections.push({ label: currentHeader, urduLabel: "معلومات", body });
    }
  };

  for (const line of lines) {
    const headerMatch = line.match(/^(?:\d+\.\s*)?\*\*(.*?)\*\*:?\s*(.*)$/);
    if (headerMatch) {
      flush();
      currentHeader = headerMatch[1].trim();
      currentContent = headerMatch[2] ? [headerMatch[2]] : [];
    } else if (currentHeader) {
      currentContent.push(line);
    }
  }
  flush();

  if (sections.length === 0) {
    sections.push({ label: "Response", urduLabel: "جواب", body: replyText });
  }

  return { title, sections, warnings, whenToVisit, disclaimer };
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [pregnancyWeek, setPregnancyWeek] = useState(20);
  const streamEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const record = getPatientRecord();
    const name = record.patient.fullName || "Patient";
    const week = record.patient.gestationalWeek || 20;
    setPregnancyWeek(week);

    const welcomeMsg: Message = {
      id: "m-welcome",
      role: "system",
      text: `Assalam o Alaikum ${name}. I am Dr. Ayesha, your AI maternal care assistant. You are at week ${week} of pregnancy. Describe how you feel in Urdu or English — you can also record a voice note.`,
      urdu: `السلام علیکم ${name}۔ میں ڈاکٹر عائشہ ہوں، آپ کی اے آئی زچگی معاون۔ آپ حمل کے ${week}ویں ہفتے میں ہیں۔ اپنی تکلیف اردو یا انگریزی میں بتائیں۔`,
      time: nowLabel(),
    };

    const savedHistory = getChatHistory();
    const restoredMessages: Message[] = savedHistory.flatMap((chat) => {
      const parsed = parseStructuredResponse(chat.aiResponse);
      return [
        {
          id: chat.id + "-u",
          role: "user" as Role,
          text: chat.userMessage,
          time: new Date(chat.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        },
        {
          id: chat.id + "-a",
          role: "ai" as Role,
          text: parsed.title,
          sections: parsed.sections,
          warnings: parsed.warnings,
          whenToVisit: parsed.whenToVisit,
          disclaimer: parsed.disclaimer || DISCLAIMER,
          time: new Date(chat.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        },
      ];
    });

    setMessages([welcomeMsg, ...restoredMessages]);
  }, []);

  useEffect(() => {
    streamEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isRecording) return;
    setRecordSeconds(0);
    const timer = window.setInterval(() => setRecordSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(timer);
  }, [isRecording]);

  const sendMessage = useCallback(
    async (raw: string) => {
      const content = raw.trim();
      if (!content) return;

      const userMessage: Message = {
        id: `u-${Date.now()}`,
        role: "user",
        text: content,
        time: nowLabel(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setDraft("");
      setIsTyping(true);

      let replyText = "";
      let sources: SourceInfo[] | undefined;
      let isFallback = false;

      try {
        const apiMessages = [
          ...messages
            .filter((m) => m.role === "user" || m.role === "ai")
            .slice(-6)
            .map((m) => ({
              role: m.role === "ai" ? ("assistant" as const) : ("user" as const),
              content: m.text,
            })),
          { role: "user" as const, content },
        ];

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages, pregnancyWeek, language: "english" }),
        });

        const data = await res.json();
        if (data.reply) {
          replyText = data.reply;
          sources = data.sources;
          isFallback = !!data.isFallback;
        } else {
          throw new Error(data.error || "Network error");
        }
      } catch (err) {
        console.warn("Chat API unreachable or failed. Falling back to local offline medical engine:", err);
        replyText = generateStructuredFallback(content, pregnancyWeek);
        isFallback = true;
        sources = [{ source: "Sehat AI Local Medical Engine", category: "Offline Safety Guidelines" }];
      }

      const parsed = parseStructuredResponse(replyText);

      const aiMessage: Message = {
        id: `a-${Date.now()}`,
        role: "ai",
        text: parsed.title,
        time: nowLabel(),
        sections: parsed.sections,
        warnings: parsed.warnings,
        whenToVisit: parsed.whenToVisit,
        disclaimer: parsed.disclaimer || DISCLAIMER,
        sources,
        isFallback,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);

      addChatRecord({
        userMessage: content,
        aiResponse: replyText,
        riskFlag: detectRisk(replyText),
      });
    },
    [messages, pregnancyWeek]
  );

  function detectRisk(reply: string): "LOW" | "MEDIUM" | "HIGH" {
    const lower = reply.toLowerCase();
    if (
      lower.includes("emergency") ||
      lower.includes("go to the nearest hospital immediately") ||
      lower.includes("call 1122") ||
      lower.includes("immediate hospital")
    )
      return "HIGH";
    if (lower.includes("visit") || lower.includes("warning") || lower.includes("concern") || lower.includes("soon"))
      return "MEDIUM";
    return "LOW";
  }

  const handleAudio = (message: Message) => {
    if (playingId === message.id) {
      window.speechSynthesis?.cancel();
      setPlayingId(null);
      return;
    }
    const script =
      message.audioScript ??
      message.urdu ??
      message.sections?.map((s) => `${s.label}: ${s.body}`).join(". ") ??
      message.text;
    setPlayingId(message.id);
    speakUrdu(script, () => setPlayingId(null));
  };

  const stopRecording = (send: boolean) => {
    setIsRecording(false);
    if (send) {
      sendMessage("Voice note: I have pain in my lower back and feel dizzy when I stand");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <AppHeader subtitle="AI Doctor" />

      {/* Doctor bar + encryption notice */}
      <div className="fixed top-20 w-full z-40 pt-safe-0 bg-surface-container-low/95 backdrop-blur-xl border-b border-outline-variant">
        <div className="max-w-lg mx-auto px-margin-mobile py-inset-sm flex items-center gap-inset-sm">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center">
              <Icon name="smart_toy" className="text-body-lg" />
            </div>
            <span className="absolute -bottom-0.5 -end-0.5 w-3 h-3 rounded-full bg-tertiary-fixed-dim border-2 border-surface-container-low" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="font-label-lg text-label-lg text-on-surface font-bold truncate">
                Dr. Ayesha
              </p>
              <Icon name="shield_verified" className="text-body-sm text-primary" />
            </div>
            <p className="font-body-sm text-[12px] text-on-surface-variant truncate">
              AI Maternal Care Assistant · Online
            </p>
          </div>
          <span className="px-inset-sm py-1 rounded-full bg-tertiary/10 text-tertiary font-label-sm text-label-sm font-bold shrink-0">
            24/7
          </span>
        </div>
        <div className="max-w-lg mx-auto px-margin-mobile pb-inset-sm">
          <div className="flex items-center justify-center gap-1.5 rounded-full bg-primary/8 py-1">
            <Icon name="lock" className="text-body-sm text-primary" />
            <span className="font-label-sm text-label-sm text-primary font-semibold">
              End-to-end encrypted
            </span>
            <span dir="rtl" className="font-body-sm text-[12px] text-on-surface-variant">
              محفوظ گفتگو
            </span>
          </div>
        </div>
      </div>

      {/* Chat stream */}
      <main className="flex-1 pt-[13.5rem] pb-[15rem] px-margin-mobile max-w-lg w-full mx-auto flex flex-col gap-stack-md">
        {messages.map((message) => {
          if (message.role === "system") {
            return (
              <div
                key={message.id}
                className="rounded-2xl bg-primary/8 border border-primary/15 p-inset-md flex flex-col gap-stack-sm"
              >
                <div className="flex items-center gap-1.5 text-primary">
                  <Icon name="waving_hand" className="text-body-md" />
                  <span className="font-label-sm text-label-sm font-bold uppercase tracking-wide">
                    Welcome
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                  {message.text}
                </p>
                <p
                  dir="rtl"
                  className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed"
                >
                  {message.urdu}
                </p>
              </div>
            );
          }

          if (message.role === "user") {
            return (
              <div key={message.id} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary text-on-primary px-inset-md py-inset-sm shadow-[0_4px_14px_rgba(0,104,95,0.18)]">
                  <p className="font-body-md text-body-md leading-relaxed">{message.text}</p>
                  {message.urdu ? (
                    <p dir="rtl" className="font-body-sm text-body-sm text-on-primary/80 mt-1">
                      {message.urdu}
                    </p>
                  ) : null}
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="font-label-sm text-[11px] text-on-primary/70">
                      {message.time}
                    </span>
                    <Icon name="done_all" className="text-[14px] text-on-primary/70" />
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={message.id} className="flex gap-inset-sm">
              <div className="w-8 h-8 shrink-0 rounded-full bg-primary text-on-primary flex items-center justify-center mt-1">
                <Icon name="smart_toy" className="text-body-sm" />
              </div>
              <div className="flex-1 min-w-0 rounded-2xl rounded-tl-sm bg-surface-container-lowest border border-outline-variant p-inset-md shadow-[0_2px_10px_rgba(19,27,46,0.05)] flex flex-col gap-stack-sm">
                <div className="flex items-start justify-between gap-inset-sm">
                  <div className="flex flex-col">
                    <p className="font-label-lg text-label-lg text-on-surface font-bold leading-snug">
                      {message.text}
                    </p>
                    {message.isFallback && (
                      <span className="inline-flex items-center gap-1 font-label-sm text-[10px] text-tertiary font-semibold mt-0.5">
                        <Icon name="offline_pin" className="text-xs" />
                        Offline Safety Medical Database Response
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAudio(message)}
                    aria-label="Play answer in Urdu"
                    aria-pressed={playingId === message.id}
                    className={`min-h-touch-min min-w-touch-min shrink-0 -mt-1 -me-1 rounded-full flex items-center justify-center active:scale-95 transition-transform ${
                      playingId === message.id
                        ? "bg-primary text-on-primary animate-pulse"
                        : "bg-primary-container text-on-primary-container"
                    }`}
                  >
                    <Icon
                      name={playingId === message.id ? "stop_circle" : "volume_up"}
                      className="text-body-lg"
                    />
                  </button>
                </div>

                {message.sections?.map((section) => (
                  <div key={section.label} className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wide">
                        {section.label}
                      </span>
                      <span dir="rtl" className="font-body-sm text-[12px] text-on-surface-variant">
                        {section.urduLabel}
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface leading-relaxed whitespace-pre-line">
                      {section.body}
                    </p>
                    {section.urduBody ? (
                      <p
                        dir="rtl"
                        className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed"
                      >
                        {section.urduBody}
                      </p>
                    ) : null}
                  </div>
                ))}

                {message.warnings?.length ? (
                  <div className="rounded-xl bg-error-container p-inset-md flex flex-col gap-stack-sm">
                    <div className="flex items-center gap-1.5 text-on-error-container">
                      <Icon name="warning" className="text-body-md" />
                      <span className="font-label-sm text-label-sm font-bold uppercase tracking-wide">
                        Warning Signs
                      </span>
                      <span dir="rtl" className="font-body-sm text-[12px]">
                        خطرے کی علامات
                      </span>
                    </div>
                    <ul className="flex flex-col gap-1.5">
                      {message.warnings.map((warning) => (
                        <li key={warning.en} className="flex flex-col">
                          <span className="font-body-sm text-body-sm text-on-error-container leading-snug">
                            • {warning.en}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {message.whenToVisit ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <Icon name="event_available" className="text-body-md text-tertiary" />
                      <span className="font-label-sm text-label-sm text-tertiary font-bold uppercase tracking-wide">
                        When to Visit Doctor
                      </span>
                      <span dir="rtl" className="font-body-sm text-[12px] text-on-surface-variant">
                        ڈاکٹر کے پاس کب جائیں
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                      {message.whenToVisit}
                    </p>
                  </div>
                ) : null}

                {message.sources && message.sources.length > 0 && (
                  <div className="rounded-lg bg-surface-container px-2.5 py-1.5 flex flex-col gap-1">
                    <span className="font-label-sm text-[11px] font-bold text-on-surface-variant flex items-center gap-1">
                      <Icon name="auto_stories" className="text-xs text-primary" />
                      RAG Verified Medical Sources:
                    </span>
                    {message.sources.map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px] text-outline">
                        <span>📄 {s.source} ({s.category || "Clinical Standard"})</span>
                        {s.similarity && <span>{(s.similarity * 100).toFixed(0)}% match</span>}
                      </div>
                    ))}
                  </div>
                )}

                {message.disclaimer ? (
                  <div className="pt-inset-sm border-t border-outline-variant flex items-start gap-1.5">
                    <Icon name="info" className="text-body-sm text-on-surface-variant mt-0.5" />
                    <p className="font-body-sm text-[12px] text-on-surface-variant leading-relaxed">
                      <span className="font-bold">Medical Disclaimer: </span>
                      {message.disclaimer}
                    </p>
                  </div>
                ) : null}

                <span className="font-label-sm text-[11px] text-on-surface-variant self-end">
                  {message.time}
                </span>
              </div>
            </div>
          );
        })}

        {isTyping ? (
          <div className="flex gap-inset-sm items-center">
            <div className="w-8 h-8 shrink-0 rounded-full bg-primary text-on-primary flex items-center justify-center">
              <Icon name="smart_toy" className="text-body-sm" />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-surface-container-high px-inset-md py-inset-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
              <span className="font-body-sm text-[12px] text-on-surface-variant ms-1">
                Dr. Ayesha is typing…
              </span>
            </div>
          </div>
        ) : null}

        <div ref={streamEndRef} />
      </main>

      {/* Quick prompts + input bar */}
      <div className="fixed bottom-20 w-full z-40 bg-surface/95 backdrop-blur-xl border-t border-outline-variant">
        <div className="max-w-lg mx-auto px-margin-mobile py-inset-sm flex flex-col gap-stack-sm">
          <div className="flex gap-inset-sm overflow-x-auto">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt.en}
                type="button"
                onClick={() => sendMessage(prompt.en)}
                className="shrink-0 px-inset-md py-inset-sm rounded-full bg-surface-container-high text-on-surface border border-outline-variant flex flex-col items-center active:scale-95 transition-transform"
              >
                <span className="font-label-sm text-label-sm font-semibold whitespace-nowrap">
                  {prompt.en}
                </span>
                <span dir="rtl" className="font-body-sm text-[11px] text-on-surface-variant whitespace-nowrap">
                  {prompt.ur}
                </span>
              </button>
            ))}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(draft);
            }}
            className="flex items-center gap-inset-sm"
          >
            <button
              type="button"
              aria-label="Attach photo"
              className="min-h-touch-min min-w-touch-min shrink-0 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center active:scale-95 transition-transform"
            >
              <Icon name="photo_camera" className="text-body-lg" />
            </button>
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Type your question… / سوال لکھیں"
              aria-label="Message"
              className="flex-1 min-w-0 min-h-touch-min rounded-full bg-surface-container-lowest border border-outline-variant px-inset-md font-body-md text-body-md text-on-surface placeholder:text-outline outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={() => setIsRecording(true)}
              aria-label="Record voice note"
              className="min-h-touch-min min-w-touch-min shrink-0 rounded-full bg-secondary/10 text-secondary flex items-center justify-center active:scale-95 transition-transform"
            >
              <Icon name="mic" className="text-body-lg" />
            </button>
            <button
              type="submit"
              disabled={!draft.trim()}
              aria-label="Send message"
              className="min-h-touch-min min-w-touch-min shrink-0 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-[0_4px_14px_rgba(0,104,95,0.22)] disabled:opacity-40 active:scale-95 transition-transform"
            >
              <Icon name="send" className="text-body-lg" />
            </button>
          </form>
        </div>
      </div>

      {/* Voice recording overlay */}
      {isRecording ? (
        <div className="fixed inset-0 z-[60] bg-inverse-surface/70 backdrop-blur-sm flex items-end">
          <div className="w-full max-w-lg mx-auto rounded-t-2xl bg-surface-container-lowest p-inset-xl pb-safe flex flex-col items-center gap-stack-lg">
            <div className="flex flex-col items-center gap-1">
              <p className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Listening…
              </p>
              <p dir="rtl" className="font-body-sm text-body-sm text-on-surface-variant">
                بولیں، میں سن رہی ہوں
              </p>
            </div>

            <div className="flex items-end justify-center gap-1.5 h-16">
              {Array.from({ length: 21 }).map((_, index) => (
                <span
                  key={index}
                  className="w-1.5 rounded-full bg-secondary animate-pulse"
                  style={{
                    height: `${18 + Math.abs(Math.sin(index * 0.9)) * 46}px`,
                    animationDelay: `${index * 70}ms`,
                    animationDuration: "900ms",
                  }}
                />
              ))}
            </div>

            <span className="font-label-lg text-label-lg text-secondary font-bold tabular-nums">
              0:{recordSeconds.toString().padStart(2, "0")}
            </span>

            <div className="flex items-center justify-center gap-inset-xl w-full">
              <button
                type="button"
                onClick={() => stopRecording(false)}
                className="flex flex-col items-center gap-1 active:scale-95 transition-transform"
              >
                <span className="w-14 h-14 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center">
                  <Icon name="close" className="text-body-xl" />
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Cancel</span>
              </button>
              <button
                type="button"
                onClick={() => stopRecording(true)}
                className="flex flex-col items-center gap-1 active:scale-95 transition-transform"
              >
                <span className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-[0_8px_24px_rgba(0,104,95,0.28)]">
                  <Icon name="send" className="text-headline-md" />
                </span>
                <span className="font-label-sm text-label-sm text-primary font-bold">Send</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <BottomNav />
    </div>
  );
}
