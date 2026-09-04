"use client";

import Link from "next/link";
import { useState } from "react";
import { AppHeader } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { Icon } from "@/components/icon";

const CURRENT_WEEK = 24;
const TOTAL_WEEKS = 40;
const DAYS_REMAINING = 112;
const RING_RADIUS = 52;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const GREETING_URDU =
  "السلام علیکم فاطمہ۔ آپ کا حمل کا چوبیسواں ہفتہ ہے۔ آپ کے بچے کے پھیپھڑے بن رہے ہیں۔ پانی زیادہ پیئیں اور آرام کریں۔";

const quickActions = [
  {
    href: "/chat",
    icon: "smart_toy",
    label: "AI Doctor",
    urdu: "اے آئی ڈاکٹر",
    caption: "Ask anything, anytime",
    tone: "bg-primary text-on-primary",
    iconTone: "bg-on-primary/15 text-on-primary",
  },
  {
    href: "/symptoms",
    icon: "stethoscope",
    label: "Symptom Checker",
    urdu: "علامات کی جانچ",
    caption: "Check how you feel",
    tone: "bg-surface-container-lowest text-on-surface",
    iconTone: "bg-secondary/10 text-secondary",
  },
  {
    href: "/profile-setup",
    icon: "pregnant_woman",
    label: "Pregnancy Tracker",
    urdu: "حمل کی نگرانی",
    caption: "Week by week guide",
    tone: "bg-surface-container-lowest text-on-surface",
    iconTone: "bg-tertiary/10 text-tertiary",
  },
  {
    href: "/consult",
    icon: "video_camera_front",
    label: "Consult Doctor",
    urdu: "ڈاکٹر سے مشورہ",
    caption: "Live video visit",
    tone: "bg-surface-container-lowest text-on-surface",
    iconTone: "bg-primary/10 text-primary",
  },
];

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

export default function DashboardPage() {
  const [waterGlasses, setWaterGlasses] = useState(5);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [medicationTaken, setMedicationTaken] = useState(false);

  const progress = CURRENT_WEEK / TOTAL_WEEKS;
  const dashOffset = RING_CIRCUMFERENCE * (1 - progress);

  const handleAudioGreeting = () => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    speakUrdu(GREETING_URDU, () => setIsSpeaking(false));
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <AppHeader subtitle="Home" />

      <main className="flex-1 pt-24 pb-32 px-margin-mobile max-w-lg w-full mx-auto flex flex-col gap-stack-lg">
        {/* Greeting */}
        <section className="flex items-start justify-between gap-inset-sm">
          <div className="flex flex-col gap-1">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-extrabold leading-tight">
              Assalam o Alaikum, Fatima!
            </h1>
            <p
              dir="rtl"
              className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed"
            >
              السلام علیکم فاطمہ
            </p>
            <div className="flex items-center gap-inset-sm mt-1">
              <span className="px-inset-sm py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-bold">
                Week {CURRENT_WEEK}
              </span>
              <span
                dir="rtl"
                className="px-inset-sm py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm"
              >
                ہفتہ ۲۴
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAudioGreeting}
            aria-label="Listen to greeting in Urdu"
            aria-pressed={isSpeaking}
            className={`min-h-touch-min min-w-touch-min shrink-0 rounded-full flex items-center justify-center shadow-[0_4px_14px_rgba(0,104,95,0.2)] transition-transform active:scale-95 ${
              isSpeaking
                ? "bg-primary text-on-primary animate-pulse"
                : "bg-primary-container text-on-primary-container"
            }`}
          >
            <Icon name={isSpeaking ? "graphic_eq" : "volume_up"} className="text-body-xl" />
          </button>
        </section>

        {/* Pregnancy hero card */}
        <section className="rounded-2xl bg-gradient-to-br from-primary to-primary-container text-on-primary p-inset-lg shadow-[0_10px_30px_rgba(0,104,95,0.22)]">
          <div className="flex items-center gap-inset-md">
            <div className="relative w-[112px] h-[112px] shrink-0">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle
                  cx="60"
                  cy="60"
                  r={RING_RADIUS}
                  fill="none"
                  strokeWidth="10"
                  className="stroke-on-primary/25"
                />
                <circle
                  cx="60"
                  cy="60"
                  r={RING_RADIUS}
                  fill="none"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={RING_CIRCUMFERENCE}
                  strokeDashoffset={dashOffset}
                  className="stroke-primary-fixed transition-[stroke-dashoffset] duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-headline-md text-headline-md font-extrabold leading-none">
                  {Math.round(progress * 100)}%
                </span>
                <span className="font-label-sm text-label-sm text-on-primary/80 leading-none mt-1">
                  Week {CURRENT_WEEK}/{TOTAL_WEEKS}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-stack-sm min-w-0">
              <div>
                <p className="font-label-sm text-label-sm text-on-primary/75 uppercase tracking-wide">
                  Baby size this week
                </p>
                <p className="font-headline-sm text-headline-sm font-bold leading-snug">
                  Ear of Sweet Corn
                </p>
                <p className="font-body-sm text-body-sm text-on-primary/85">~30 cm</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Icon name="hourglass_bottom" className="text-body-md text-primary-fixed" />
                <span className="font-body-sm text-body-sm text-on-primary/90">
                  Approx. {DAYS_REMAINING} days
                </span>
              </div>
              <p dir="rtl" className="font-body-sm text-body-sm text-on-primary/80">
                تقریباً ۱۱۲ دن باقی ہیں
              </p>
            </div>
          </div>
        </section>

        {/* Baby insight */}
        <section className="rounded-xl bg-tertiary/10 border border-tertiary/20 p-inset-md flex items-start gap-inset-sm">
          <div className="w-10 h-10 shrink-0 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center">
            <Icon name="pulmonology" className="text-body-lg" />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="font-label-sm text-label-sm text-tertiary font-bold uppercase tracking-wide">
              This week&apos;s insight
            </p>
            <p className="font-body-md text-body-md text-on-surface font-semibold leading-snug">
              Your baby&apos;s lungs are developing
            </p>
            <p dir="rtl" className="font-body-sm text-body-sm text-on-surface-variant">
              آپ کے بچے کے پھیپھڑے بن رہے ہیں
            </p>
          </div>
        </section>

        {/* LHW checkup banner */}
        <section className="rounded-xl bg-surface-container-lowest border border-outline-variant p-inset-md flex items-center gap-inset-sm shadow-[0_2px_10px_rgba(19,27,46,0.05)]">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Icon name="calendar_month" className="text-body-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-body-md text-body-md text-on-surface font-semibold leading-snug">
              Next LHV visit: Friday, Oct 18
            </p>
            <p dir="rtl" className="font-body-sm text-body-sm text-on-surface-variant">
              اگلی لیڈی ہیلتھ وزیٹر ملاقات: جمعہ ۱۸ اکتوبر
            </p>
          </div>
          <span className="px-inset-sm py-1 rounded-full bg-tertiary/10 text-tertiary font-label-sm text-label-sm font-bold shrink-0">
            3 days
          </span>
        </section>

        {/* Quick actions */}
        <section className="flex flex-col gap-stack-sm">
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            Quick Actions
            <span dir="rtl" className="ms-2 font-body-sm text-body-sm text-on-surface-variant font-normal">
              فوری سہولتیں
            </span>
          </h2>
          <div className="grid grid-cols-2 gap-stack-sm">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`rounded-2xl p-inset-md min-h-[132px] flex flex-col justify-between gap-stack-sm border border-outline-variant/50 shadow-[0_2px_10px_rgba(19,27,46,0.05)] transition-transform active:scale-[0.98] ${action.tone}`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center ${action.iconTone}`}
                >
                  <Icon name={action.icon} className="text-body-xl" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="font-label-lg text-label-lg font-bold leading-tight">
                    {action.label}
                  </p>
                  <p dir="rtl" className="font-body-sm text-body-sm opacity-80 leading-tight">
                    {action.urdu}
                  </p>
                  <p className="font-body-sm text-[12px] opacity-70 leading-tight">
                    {action.caption}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Vitals */}
        <section className="flex flex-col gap-stack-sm">
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            Today&apos;s Vitals
            <span dir="rtl" className="ms-2 font-body-sm text-body-sm text-on-surface-variant font-normal">
              آج کی علامات
            </span>
          </h2>
          <div className="grid grid-cols-2 gap-stack-sm">
            <div className="rounded-xl bg-surface-container-lowest border border-outline-variant p-inset-md flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-secondary">
                <Icon name="monitor_heart" className="text-body-md" />
                <span className="font-label-sm text-label-sm font-bold uppercase tracking-wide">
                  Blood Pressure
                </span>
              </div>
              <p className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                118/78
              </p>
              <p className="font-body-sm text-[12px] text-on-surface-variant">mmHg · Normal</p>
            </div>

            <div className="rounded-xl bg-surface-container-lowest border border-outline-variant p-inset-md flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-primary">
                <Icon name="monitor_weight" className="text-body-md" />
                <span className="font-label-sm text-label-sm font-bold uppercase tracking-wide">
                  Weight
                </span>
              </div>
              <p className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                62 kg
              </p>
              <p className="font-body-sm text-[12px] text-on-surface-variant">+0.4 kg this week</p>
            </div>

            <div className="col-span-2 rounded-xl bg-surface-container-lowest border border-outline-variant p-inset-md flex items-center gap-inset-sm">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-tertiary">
                  <Icon name="water_drop" className="text-body-md" />
                  <span className="font-label-sm text-label-sm font-bold uppercase tracking-wide">
                    Water Intake
                  </span>
                </div>
                <p className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                  {waterGlasses}{" "}
                  <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">
                    / 8 glasses
                  </span>
                </p>
                <p dir="rtl" className="font-body-sm text-[12px] text-on-surface-variant">
                  پانی کے گلاس
                </p>
              </div>
              <div className="flex items-center gap-inset-sm shrink-0">
                <button
                  type="button"
                  aria-label="Decrease water intake"
                  onClick={() => setWaterGlasses((g) => Math.max(0, g - 1))}
                  className="min-h-touch-min min-w-touch-min rounded-full bg-surface-container-high text-on-surface flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Icon name="remove" className="text-body-lg" />
                </button>
                <button
                  type="button"
                  aria-label="Increase water intake"
                  onClick={() => setWaterGlasses((g) => Math.min(12, g + 1))}
                  className="min-h-touch-min min-w-touch-min rounded-full bg-tertiary text-on-tertiary flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Icon name="add" className="text-body-lg" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Medication reminder */}
        <section className="rounded-xl bg-surface-container-low border border-outline-variant p-inset-md flex items-center gap-inset-sm">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
            <Icon name="medication" className="text-body-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-body-md text-body-md text-on-surface font-semibold leading-snug">
              Folic Acid — Daily
            </p>
            <p dir="rtl" className="font-body-sm text-body-sm text-on-surface-variant">
              فولک ایسڈ — روزانہ ایک گولی
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMedicationTaken((v) => !v)}
            aria-pressed={medicationTaken}
            className={`min-h-touch-min px-inset-md rounded-full font-label-sm text-label-sm font-bold flex items-center gap-1 shrink-0 active:scale-95 transition-transform ${
              medicationTaken
                ? "bg-tertiary text-on-tertiary"
                : "bg-surface-container-high text-primary"
            }`}
          >
            <Icon name={medicationTaken ? "check_circle" : "schedule"} className="text-body-md" />
            {medicationTaken ? "Taken" : "Mark"}
          </button>
        </section>

        {/* Nearby clinic */}
        <section className="rounded-xl bg-surface-container-lowest border border-outline-variant p-inset-md flex items-center gap-inset-sm shadow-[0_2px_10px_rgba(19,27,46,0.05)]">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Icon name="local_hospital" className="text-body-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">
              Nearest facility
            </p>
            <p className="font-body-md text-body-md text-on-surface font-semibold leading-snug truncate">
              BHU Chak 42-SB · 2.4 km
            </p>
            <p dir="rtl" className="font-body-sm text-body-sm text-on-surface-variant">
              بنیادی مرکز صحت چک ۴۲ ایس بی
            </p>
          </div>
          <Link
            href="/clinics"
            aria-label="View nearest clinic and map route"
            className="min-h-touch-min min-w-touch-min rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 active:scale-95 transition-transform"
          >
            <Icon name="directions" className="text-body-lg" />
          </Link>
        </section>

        {/* Emergency SOS */}
        <section className="rounded-2xl bg-secondary text-on-secondary p-inset-lg shadow-[0_8px_24px_rgba(185,5,56,0.28)] flex items-center gap-inset-md">
          <div className="w-12 h-12 shrink-0 rounded-full bg-on-secondary/15 flex items-center justify-center">
            <Icon name="emergency" className="text-body-xl" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-headline-sm text-headline-sm font-bold leading-snug">
              In case of emergency, call 1122
            </p>
            <p dir="rtl" className="font-body-sm text-body-sm text-on-secondary/85">
              ایمرجنسی میں ۱۱۲۲ پر کال کریں
            </p>
          </div>
          <a
            href="tel:1122"
            aria-label="Call emergency 1122"
            className="min-h-touch-min min-w-touch-min rounded-full bg-on-secondary text-secondary flex items-center justify-center shrink-0 active:scale-95 transition-transform"
          >
            <Icon name="call" className="text-body-xl" />
          </a>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
