"use client";

import { useState } from "react";
import { AppHeader } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { Icon } from "@/components/icon";

const featuredFoods = [
  { icon: "water_full", label: "Milk / Yogurt", urdu: "دودھ، دہی" },
  { icon: "egg", label: "Egg", urdu: "انڈا" },
  { icon: "nutrition", label: "Spinach", urdu: "پالک" },
  { icon: "grain", label: "Lentils", urdu: "دال" },
];

interface Module {
  id: string;
  number: number;
  icon: string;
  title: string;
  urdu: string;
  description: string;
  tone: string;
  iconTone: string;
  urgency?: string;
  duration: string;
}

const modules: Module[] = [
  {
    id: "nutrition",
    number: 1,
    icon: "restaurant",
    title: "Nutrition & Wholesome Diet",
    urdu: "غذائیت اور بہترین خوراک",
    description:
      "Local, low-cost meals that build iron, calcium and protein for you and your baby.",
    tone: "bg-tertiary-container text-on-tertiary-container",
    iconTone: "bg-on-tertiary-container/15 text-on-tertiary-container",
    duration: "6 min audio",
  },
  {
    id: "growth",
    number: 2,
    icon: "child_care",
    title: "Baby Growth Milestones",
    urdu: "بچے کی نشوونما کے مراحل",
    description:
      "What is happening inside week by week — kicks, size, and healthy weight gain.",
    tone: "bg-primary-fixed text-on-primary-fixed",
    iconTone: "bg-on-primary-fixed/10 text-on-primary-fixed",
    duration: "5 min audio",
  },
  {
    id: "danger",
    number: 3,
    icon: "warning",
    title: "Urgent Danger Signs",
    urdu: "خطرے کی فوری علامات",
    description:
      "Bleeding, severe headache, reduced movement, water leakage — never wait at home.",
    tone: "bg-error-container text-on-error-container",
    iconTone: "bg-on-error-container/15 text-on-error-container",
    urgency: "HIGH",
    duration: "4 min audio",
  },
  {
    id: "posture",
    number: 4,
    icon: "self_improvement",
    title: "Daily Postures & Safe Movement",
    urdu: "روزمرہ حرکات اور محفوظ انداز",
    description:
      "Safe ways to lift, sleep, sit and walk while carrying farm or household work.",
    tone: "bg-surface-container-high text-on-surface",
    iconTone: "bg-primary-fixed text-on-primary-fixed",
    duration: "5 min audio",
  },
  {
    id: "medication",
    number: 5,
    icon: "medication",
    title: "Medications & Immunization",
    urdu: "ادویات اور حفاظتی ٹیکے",
    description:
      "Iron and folic acid routine, TT vaccine schedule, and medicines to avoid.",
    tone: "bg-tertiary-fixed text-on-tertiary-fixed",
    iconTone: "bg-on-tertiary-fixed/10 text-on-tertiary-fixed",
    duration: "7 min audio",
  },
];

function Waveform({ active, tone = "bg-primary" }: { active: boolean; tone?: string }) {
  const bars = [8, 16, 24, 14, 20, 10, 18];
  return (
    <span className="flex items-end gap-[3px]" aria-hidden="true">
      {bars.map((height, index) => (
        <span
          key={index}
          className={`w-[3px] rounded-full ${tone} ${active ? "animate-pulse" : "opacity-40"}`}
          style={{
            height: `${active ? height : Math.max(6, height / 2)}px`,
            animationDelay: `${index * 100}ms`,
          }}
        />
      ))}
    </span>
  );
}

export default function EducationPage() {
  const [bannerOpen, setBannerOpen] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const togglePlay = (id: string) =>
    setPlayingId((current) => (current === id ? null : id));

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <AppHeader subtitle="Education" />

      <main className="flex-1 w-full max-w-lg mx-auto pt-24 pb-40 px-margin-mobile flex flex-col gap-stack-md">
        {/* Audio banner */}
        <button
          type="button"
          onClick={() => setBannerOpen((open) => !open)}
          aria-expanded={bannerOpen}
          className="w-full min-h-touch-min flex items-center justify-between gap-inset-sm rounded-2xl bg-primary-fixed/60 px-inset-md py-inset-sm text-left active:scale-[0.99] transition-transform"
        >
          <span className="flex items-center gap-inset-sm">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
              <Icon name={bannerOpen ? "pause" : "volume_up"} className="text-body-lg" />
            </span>
            <span className="flex flex-col">
              <span className="font-label-md text-label-md font-bold text-on-primary-fixed leading-tight">
                Tap to hear this page
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant leading-tight">
                سننے کے لیے دبائیں — پڑھنا ضروری نہیں
              </span>
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-surface-container-lowest px-inset-sm py-1">
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75 ${
                  bannerOpen ? "animate-ping" : ""
                }`}
              />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-tertiary" />
            </span>
            <span className="font-label-sm text-label-sm font-bold text-tertiary">
              آڈیو فعال
            </span>
          </span>
        </button>

        {/* Title */}
        <header className="flex flex-col gap-1 px-inset-xs">
          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-tertiary-container px-inset-sm py-0.5 font-label-sm text-label-sm font-bold text-on-tertiary-container">
            <Icon name="verified" className="text-body-sm" />
            LHW Certified Knowledge
          </span>
          <h1 className="font-headline-lg text-headline-lg-mobile text-on-surface leading-tight">
            Maternal Health Education
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant leading-snug">
            زچگی کی صحت کی تعلیم — ہر سبق آواز میں بھی سنیں
          </p>
        </header>

        {/* Featured hero card */}
        <section
          aria-labelledby="featured-heading"
          className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-[0_4px_20px_rgba(19,27,46,0.08)]"
        >
          <div className="relative h-44 w-full bg-gradient-to-br from-tertiary via-primary to-on-primary-fixed-variant">
            {/* decorative food imagery */}
            <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-30" aria-hidden="true">
              <Icon name="restaurant_menu" className="text-[72px] text-on-primary" />
              <Icon name="nutrition" className="text-[96px] text-on-primary" />
              <Icon name="egg_alt" className="text-[64px] text-on-primary" />
            </div>
            {/* overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/85 via-on-surface/30 to-transparent" />
            <div className="absolute top-inset-md left-inset-md">
              <span className="rounded-full bg-secondary px-inset-sm py-1 font-label-sm text-label-sm font-bold text-on-secondary">
                Featured Lesson
              </span>
            </div>
            <div className="absolute bottom-inset-md left-inset-md right-inset-md">
              <h2
                id="featured-heading"
                className="font-headline-md text-headline-md text-white leading-tight"
              >
                5 Essential Foods Every Mother Needs
              </h2>
              <p className="font-body-sm text-body-sm text-white/85 leading-snug">
                ہر ماں کے لیے پانچ ضروری غذائیں
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-stack-sm p-inset-md">
            <div className="flex flex-wrap gap-inset-xs">
              {featuredFoods.map((food) => (
                <span
                  key={food.label}
                  className="inline-flex items-center gap-1 rounded-full bg-surface-container-low px-inset-sm py-1 font-label-sm text-label-sm font-semibold text-on-surface"
                >
                  <Icon name={food.icon} className="text-body-md text-tertiary" />
                  {food.label}
                  <span className="font-normal text-on-surface-variant">{food.urdu}</span>
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => togglePlay("featured")}
              aria-pressed={playingId === "featured"}
              aria-label="Play audio lesson: 5 Essential Foods Every Mother Needs"
              className="min-h-touch-min w-full flex items-center justify-between gap-inset-sm rounded-xl bg-primary px-inset-md text-on-primary active:scale-[0.98] transition-transform"
            >
              <span className="flex items-center gap-inset-sm">
                <Icon
                  name={playingId === "featured" ? "pause_circle" : "play_circle"}
                  className="text-headline-md"
                />
                <span className="flex flex-col text-left">
                  <span className="font-label-md text-label-md font-bold leading-tight">
                    {playingId === "featured" ? "Playing…" : "Listen in Urdu"}
                  </span>
                  <span className="font-body-sm text-[13px] text-on-primary/80 leading-tight">
                    3 min 40 sec
                  </span>
                </span>
              </span>
              <Waveform active={playingId === "featured"} tone="bg-on-primary" />
            </button>
          </div>
        </section>

        {/* Learning modules */}
        <section aria-labelledby="modules-heading" className="flex flex-col gap-stack-sm">
          <h2
            id="modules-heading"
            className="font-headline-sm text-headline-sm text-on-surface px-inset-xs"
          >
            Learning Modules
            <span className="block font-body-sm text-body-sm font-normal text-on-surface-variant">
              سیکھنے کے پانچ حصے
            </span>
          </h2>

          {modules.map((module) => (
            <article
              key={module.id}
              className={`rounded-2xl p-inset-md flex flex-col gap-stack-sm ${module.tone}`}
            >
              <div className="flex items-start gap-inset-md">
                <span
                  className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${module.iconTone}`}
                >
                  <Icon name={module.icon} className="text-headline-md" />
                  <span className="absolute -top-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-surface-container-lowest font-label-sm text-[11px] font-bold text-on-surface">
                    {module.number}
                  </span>
                </span>
                <div className="flex flex-1 flex-col gap-0.5">
                  <div className="flex items-start justify-between gap-inset-sm">
                    <h3 className="font-label-lg text-label-lg font-bold leading-tight">
                      {module.title}
                    </h3>
                    {module.urgency && (
                      <span className="shrink-0 rounded-full bg-error px-inset-sm py-0.5 font-label-sm text-[11px] font-bold text-on-error">
                        {module.urgency}
                      </span>
                    )}
                  </div>
                  <p className="font-body-md text-body-md opacity-90 leading-snug">
                    {module.urdu}
                  </p>
                  <p className="font-body-sm text-body-sm opacity-80 leading-snug">
                    {module.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => togglePlay(module.id)}
                aria-pressed={playingId === module.id}
                aria-label={`Play audio for ${module.title}`}
                className="min-h-touch-min w-full flex items-center justify-between gap-inset-sm rounded-xl bg-surface-container-lowest/80 px-inset-md text-on-surface active:scale-[0.98] transition-transform"
              >
                <span className="flex items-center gap-inset-sm">
                  <Icon
                    name={playingId === module.id ? "pause_circle" : "play_circle"}
                    className="text-headline-sm text-primary"
                  />
                  <span className="font-label-md text-label-md font-bold">
                    {playingId === module.id ? "سن رہی ہیں…" : "سنیں Listen"}
                  </span>
                </span>
                <span className="flex items-center gap-inset-sm">
                  <Waveform active={playingId === module.id} />
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {module.duration}
                  </span>
                </span>
              </button>
            </article>
          ))}
        </section>

        {/* Community banner */}
        <section className="rounded-2xl bg-surface-container-low p-inset-md flex items-start gap-inset-md">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-on-primary-fixed">
            <Icon name="groups" className="text-headline-md" />
          </span>
          <div className="flex flex-1 flex-col gap-inset-sm">
            <div className="flex flex-col">
              <p className="font-label-lg text-label-lg font-bold text-on-surface leading-tight">
                Have questions about your diet?
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                اپنی خوراک سے متعلق سوال پوچھیں — Nasreen Akhtar (LHW) replies to mothers of
                Chak 42-SB every evening.
              </p>
            </div>
            <a
              href="tel:03001234567"
              className="min-h-touch-min w-fit flex items-center gap-inset-xs rounded-full bg-primary px-inset-md font-label-md text-label-md font-bold text-on-primary active:scale-95 transition-transform"
            >
              <Icon name="call" className="text-body-lg" />
              Message your LHW
            </a>
          </div>
        </section>
      </main>

      {/* Voice assistant FAB */}
      <button
        type="button"
        aria-label="Ask a question by voice"
        className="fixed bottom-28 right-margin-mobile z-40 flex min-h-touch-spacious items-center gap-inset-sm rounded-full bg-secondary px-inset-md py-inset-sm text-on-secondary shadow-[0_8px_24px_rgba(185,5,56,0.35)] active:scale-95 transition-transform"
      >
        <span className="relative flex h-9 w-9 items-center justify-center">
          <span className="absolute inline-flex h-9 w-9 animate-ping rounded-full bg-on-secondary/40" />
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-on-secondary/20">
            <Icon name="mic" className="text-headline-sm" />
          </span>
        </span>
        <span className="flex flex-col text-left">
          <span className="font-label-md text-label-md font-bold leading-tight">
            Ask by Voice
          </span>
          <span className="font-body-sm text-[13px] leading-tight opacity-90">
            بول کر سوال پوچھیں
          </span>
        </span>
      </button>

      <BottomNav />
    </div>
  );
}
