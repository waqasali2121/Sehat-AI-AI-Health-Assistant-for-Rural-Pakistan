"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AppHeader } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { Icon } from "@/components/icon";
import { getPatientRecord, addChatRecord, getChatHistory } from "@/lib/patient-store";

type Role = "system" | "user" | "ai";

interface AiSection {
  label: string;
  urduLabel: string;
  body: string;
  urduBody?: string;
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

const SWELLING_REPLY: Omit<Message, "id" | "time"> = {
  role: "ai",
  text: "Swelling in the feet during pregnancy",
  sections: [
    {
      label: "Patient Concern",
      urduLabel: "مریض کی شکایت",
      body: "Swelling (oedema) in both feet, noticed more in the evening, at 24 weeks of pregnancy.",
      urduBody: "حمل کے چوبیسویں ہفتے میں دونوں پیروں میں سوجن، خاص طور پر شام کے وقت۔",
    },
    {
      label: "Possible Explanation",
      urduLabel: "ممکنہ وجہ",
      body:
        "Mild swelling of the feet and ankles is common after 20 weeks. Your body holds more fluid and the growing baby presses on the veins that return blood from your legs, so fluid collects in the lowest parts of the body.",
      urduBody:
        "بیس ہفتوں کے بعد پیروں اور ٹخنوں میں ہلکی سوجن عام بات ہے۔ جسم میں پانی بڑھ جاتا ہے اور بچہ رگوں پر دباؤ ڈالتا ہے۔",
    },
    {
      label: "Recommended Action",
      urduLabel: "تجویز کردہ اقدامات",
      body:
        "Rest with your legs raised on a pillow for 20 minutes, 3 times a day. Lie on your left side when sleeping. Avoid standing for long periods, wear loose slippers, drink 8-10 glasses of water and reduce salty foods and pickles.",
      urduBody:
        "دن میں تین بار بیس منٹ ٹانگیں تکیے پر اونچی رکھ کر آرام کریں۔ بائیں کروٹ سوئیں۔ نمک کم کریں اور آٹھ سے دس گلاس پانی پیئیں۔",
    },
  ],
  warnings: [
    { en: "Sudden swelling of the face, hands or around the eyes", ur: "چہرے، ہاتھوں یا آنکھوں کے گرد اچانک سوجن" },
    { en: "Severe headache or blurred vision", ur: "شدید سر درد یا نظر کا دھندلا پن" },
    { en: "Pain in the upper abdomen or under the ribs", ur: "پیٹ کے اوپری حصے یا پسلیوں کے نیچے درد" },
    { en: "Swelling in only one leg with pain or redness", ur: "صرف ایک ٹانگ میں سوجن، درد یا سرخی" },
  ],
  whenToVisit:
    "Visit your LHW or BHU within 48 hours to have your blood pressure and urine protein checked. Go immediately if any warning sign above appears — these can indicate pre-eclampsia.",
  disclaimer: DISCLAIMER,
  audioScript:
    "حمل کے دوران پیروں کی ہلکی سوجن عام بات ہے۔ ٹانگیں اونچی رکھ کر آرام کریں، بائیں کروٹ سوئیں، نمک کم کریں اور پانی زیادہ پیئیں۔ اگر چہرے پر سوجن، شدید سر درد یا نظر دھندلی ہو تو فوراً ڈاکٹر کے پاس جائیں۔",
};

function buildAiReply(prompt: string): Omit<Message, "id" | "time"> {
  const p = prompt.toLowerCase();

  if (p.includes("swell") || p.includes("feet") || p.includes("oedema") || p.includes("edema")) {
    return SWELLING_REPLY;
  }

  if (p.includes("move") || p.includes("movement") || p.includes("kick")) {
    return {
      role: "ai",
      text: "Reduced baby movement",
      sections: [
        {
          label: "Patient Concern",
          urduLabel: "مریض کی شکایت",
          body: "You feel your baby is moving less than usual today.",
          urduBody: "آپ محسوس کر رہی ہیں کہ بچہ آج کم حرکت کر رہا ہے۔",
        },
        {
          label: "Possible Explanation",
          urduLabel: "ممکنہ وجہ",
          body:
            "Babies have sleep cycles of 20-40 minutes and movements can feel weaker when you are busy or standing. However, a real reduction in movement always needs to be checked.",
          urduBody:
            "بچے بیس سے چالیس منٹ سوتے ہیں اور مصروفیت میں حرکت کم محسوس ہوتی ہے، لیکن حرکت میں حقیقی کمی کی جانچ ضروری ہے۔",
        },
        {
          label: "Recommended Action",
          urduLabel: "تجویز کردہ اقدامات",
          body:
            "Lie on your left side in a quiet room after eating something sweet and count movements for 2 hours. You should feel at least 10 movements. Do not wait until tomorrow if the count is low.",
          urduBody:
            "کچھ میٹھا کھا کر پرسکون کمرے میں بائیں کروٹ لیٹیں اور دو گھنٹے میں حرکتیں گنیں۔ کم از کم دس حرکتیں محسوس ہونی چاہیئں۔",
        },
      ],
      warnings: [
        { en: "Fewer than 10 movements in 2 hours", ur: "دو گھنٹوں میں دس سے کم حرکتیں" },
        { en: "No movement felt at all", ur: "کوئی حرکت محسوس نہ ہونا" },
        { en: "Sudden violent movement then stillness", ur: "اچانک تیز حرکت اور پھر خاموشی" },
      ],
      whenToVisit:
        "Go to the nearest BHU or hospital the same day for a fetal heart check or CTG. Reduced movement is never something to monitor at home overnight.",
      disclaimer: DISCLAIMER,
      audioScript:
        "بائیں کروٹ لیٹ کر دو گھنٹے میں بچے کی حرکتیں گنیں۔ اگر دس سے کم حرکتیں ہوں تو آج ہی قریبی مرکز صحت جائیں۔",
    };
  }

  if (p.includes("bleed") || p.includes("blood") || p.includes("spot")) {
    return {
      role: "ai",
      text: "Bleeding during pregnancy",
      sections: [
        {
          label: "Patient Concern",
          urduLabel: "مریض کی شکایت",
          body: "Vaginal bleeding or spotting during pregnancy.",
          urduBody: "حمل کے دوران خون یا داغ آنا۔",
        },
        {
          label: "Possible Explanation",
          urduLabel: "ممکنہ وجہ",
          body:
            "Light spotting can follow an examination or intercourse, but bleeding after 20 weeks may come from the placenta and is treated as an emergency until a doctor confirms otherwise.",
          urduBody:
            "ہلکا داغ معائنے کے بعد ہو سکتا ہے، مگر بیس ہفتوں کے بعد خون آنا آنول سے ہو سکتا ہے اور یہ ایمرجنسی سمجھا جاتا ہے۔",
        },
        {
          label: "Recommended Action",
          urduLabel: "تجویز کردہ اقدامات",
          body:
            "Stop all activity and lie down. Use a clean pad — never insert anything inside. Note how much blood and its colour. Arrange transport to a facility with delivery services now.",
          urduBody:
            "کام روک کر لیٹ جائیں، صاف پیڈ استعمال کریں، اندر کچھ نہ ڈالیں اور فوراً ہسپتال جانے کا بندوبست کریں۔",
        },
      ],
      warnings: [
        { en: "Heavy bleeding soaking a pad in one hour", ur: "ایک گھنٹے میں پیڈ بھر جانا" },
        { en: "Bleeding with abdominal pain or tight belly", ur: "خون کے ساتھ پیٹ میں درد یا سختی" },
        { en: "Dizziness, fainting or fast heartbeat", ur: "چکر، بےہوشی یا دل کی تیز دھڑکن" },
        { en: "Passing clots or tissue", ur: "خون کے لوتھڑے آنا" },
      ],
      whenToVisit:
        "Go to the nearest hospital immediately or call 1122. Do not wait for the bleeding to stop on its own.",
      disclaimer: DISCLAIMER,
      audioScript:
        "حمل میں خون آنا سنجیدہ علامت ہے۔ لیٹ جائیں، صاف پیڈ استعمال کریں اور فوراً ہسپتال جائیں یا ۱۱۲۲ پر کال کریں۔",
    };
  }

  if (p.includes("nutrition") || p.includes("food") || p.includes("diet") || p.includes("eat")) {
    return {
      role: "ai",
      text: "Nutrition in pregnancy",
      sections: [
        {
          label: "Patient Concern",
          urduLabel: "مریض کی شکایت",
          body: "Guidance on what to eat during pregnancy with a limited household budget.",
          urduBody: "کم خرچ میں حمل کے دوران کیا کھانا چاہیے۔",
        },
        {
          label: "Possible Explanation",
          urduLabel: "ممکنہ وجہ",
          body:
            "You need about 350 extra calories a day in the second trimester along with iron, calcium and folic acid to build your baby's blood, bones and brain.",
          urduBody:
            "دوسرے سہ ماہی میں روزانہ تقریباً ساڑھے تین سو اضافی کیلوریز، آئرن، کیلشیم اور فولک ایسڈ درکار ہوتے ہیں۔",
        },
        {
          label: "Recommended Action",
          urduLabel: "تجویز کردہ اقدامات",
          body:
            "Eat 5 small meals: dal or lobia daily for protein and iron, one seasonal fruit, palak or saag with a squeeze of lemon to absorb iron, one glass of milk or lassi, an egg if affordable, and take your iron and folic acid tablet after food.",
          urduBody:
            "دن میں پانچ چھوٹے کھانے: دال یا لوبیا، ایک موسمی پھل، پالک یا ساگ لیموں کے ساتھ، ایک گلاس دودھ یا لسی، اور کھانے کے بعد آئرن کی گولی۔",
        },
      ],
      warnings: [
        { en: "No weight gain for a month", ur: "ایک ماہ تک وزن نہ بڑھنا" },
        { en: "Extreme tiredness, pale palms or eyelids", ur: "شدید کمزوری، ہاتھوں یا آنکھوں کی زردی" },
        { en: "Unable to keep any food down", ur: "کھانا بالکل نہ ٹھہرنا" },
      ],
      whenToVisit:
        "Discuss your haemoglobin level at your next LHW visit. If your palms look pale or you feel breathless on light work, get a blood test this week.",
      disclaimer: DISCLAIMER,
      audioScript:
        "روزانہ دال، ایک پھل، پالک، دودھ یا لسی اور آئرن کی گولی لیں۔ دن میں پانچ چھوٹے کھانے کھائیں۔",
    };
  }

  return {
    role: "ai",
    text: `About: ${prompt}`,
    sections: [
      {
        label: "Patient Concern",
        urduLabel: "مریض کی شکایت",
        body: prompt,
      },
      {
        label: "Possible Explanation",
        urduLabel: "ممکنہ وجہ",
        body:
          "Many pregnancy symptoms are normal changes of the body, but some overlap with conditions such as anaemia, infection or high blood pressure. Your history at week 24 helps narrow this down.",
        urduBody:
          "حمل کی کئی علامات عام ہوتی ہیں، مگر کچھ خون کی کمی، انفیکشن یا بلڈ پریشر کی نشانی بھی ہو سکتی ہیں۔",
      },
      {
        label: "Recommended Action",
        urduLabel: "تجویز کردہ اقدامات",
        body:
          "Rest, drink 8-10 glasses of water, continue your iron and folic acid, and record when the symptom starts and how long it lasts. Share this record with your Lady Health Worker.",
        urduBody:
          "آرام کریں، آٹھ سے دس گلاس پانی پیئیں، آئرن اور فولک ایسڈ جاری رکھیں اور علامات کا وقت لکھ لیں۔",
      },
    ],
    warnings: [
      { en: "Severe or worsening pain", ur: "شدید یا بڑھتا ہوا درد" },
      { en: "Bleeding or fluid leaking", ur: "خون یا پانی آنا" },
      { en: "Fever above 100.4°F", ur: "بخار سو درجے سے زیادہ" },
      { en: "Reduced baby movement", ur: "بچے کی حرکت کم ہونا" },
    ],
    whenToVisit:
      "See your LHW within 2-3 days if the symptom continues, or go to the BHU today if any warning sign appears.",
    disclaimer: DISCLAIMER,
    audioScript:
      "آرام کریں، پانی زیادہ پیئیں اور علامات نوٹ کریں۔ اگر تکلیف بڑھے تو قریبی مرکز صحت جائیں۔",
  };
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
    const restoredMessages: Message[] = savedHistory.flatMap((chat) => [
      { id: chat.id + "-u", role: "user" as Role, text: chat.userMessage, time: new Date(chat.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) },
      { id: chat.id + "-a", role: "ai" as Role, text: chat.aiResponse, time: new Date(chat.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) },
    ]);

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

  const sendMessage = useCallback(async (raw: string) => {
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

    try {
      const apiMessages = [
        ...messages.filter((m) => m.role === "user" || m.role === "ai").slice(-6).map((m) => ({
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

      if (!res.ok) {
        throw new Error(`API returned HTTP status ${res.status}`);
      }

      const data = await res.json();
      if (!data.reply) {
        throw new Error("No reply returned from API");
      }

      const replyText = data.reply;

      const aiMessage: Message = {
        id: `a-${Date.now()}`,
        role: "ai",
        text: replyText,
        time: nowLabel(),
        sections: [{ label: "Response", urduLabel: "جواب", body: replyText }],
      };

      setMessages((prev) => [...prev, aiMessage]);

      addChatRecord({
        userMessage: content,
        aiResponse: replyText,
        riskFlag: detectRisk(replyText),
      });
    } catch {
      const fallback = buildAiReply(content);
      setMessages((prev) => [
        ...prev,
        { ...fallback, id: `a-${Date.now()}`, time: nowLabel() } as Message,
      ]);
      addChatRecord({
        userMessage: content,
        aiResponse: fallback.text,
        riskFlag: "LOW",
      });
    }

    setIsTyping(false);
  }, [messages, pregnancyWeek]);

  function detectRisk(reply: string): "LOW" | "MEDIUM" | "HIGH" {
    const lower = reply.toLowerCase();
    if (lower.includes("emergency") || lower.includes("go to the nearest hospital immediately") || lower.includes("call 1122")) return "HIGH";
    if (lower.includes("visit") || lower.includes("warning") || lower.includes("concern")) return "MEDIUM";
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
      message.sections?.map((s) => s.urduBody ?? s.body).join(" ") ??
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
                  <p className="font-label-lg text-label-lg text-on-surface font-bold leading-snug">
                    {message.text}
                  </p>
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
                    <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
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
                          <span
                            dir="rtl"
                            className="font-body-sm text-[12px] text-on-error-container/80 leading-snug"
                          >
                            {warning.ur}
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
