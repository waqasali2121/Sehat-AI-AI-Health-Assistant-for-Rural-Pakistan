"use client";

import { useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { Icon } from "@/components/icon";

const languages = ["اردو Urdu", "پنجابی Punjabi", "English"];

const consultationModes = [
  {
    id: "chat",
    href: "/chat",
    icon: "chat",
    title: "Start Live Chat",
    urdu: "تحریری مشورہ شروع کریں",
    hint: "Typed or voice notes • Replies in minutes",
    badge: null as string | null,
    highlighted: false,
  },
  {
    id: "video",
    href: "/consult#video",
    icon: "videocam",
    title: "Video Consultation",
    urdu: "ویڈیو پر ڈاکٹر سے بات کریں",
    hint: "Face-to-face review with Dr. Ayesha",
    badge: "Fastest",
    highlighted: true,
  },
  {
    id: "visit",
    href: "/consult#visit",
    icon: "calendar_month",
    title: "Book Clinic / BHU Visit",
    urdu: "بی ایچ یو میں وقت لیں",
    hint: "Reserve a slot at your nearest facility",
    badge: null as string | null,
    highlighted: false,
  },
];

export default function ConsultPage() {
  const [audioOpen, setAudioOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <AppHeader subtitle="Consult" />

      <main className="flex-1 w-full max-w-lg mx-auto pt-24 pb-32 px-margin-mobile flex flex-col gap-stack-md">
        {/* Context bar */}
        <div className="flex items-center justify-between gap-inset-sm rounded-xl bg-surface-container-low px-inset-md py-inset-sm">
          <div className="flex items-center gap-inset-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tertiary opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-tertiary" />
            </span>
            <span className="font-label-md text-label-md font-bold text-on-surface">
              Live Clinic Desk
            </span>
          </div>
          <button
            type="button"
            onClick={() => setAudioOpen((open) => !open)}
            aria-expanded={audioOpen}
            aria-label="Listen to page instructions"
            className={`min-h-touch-min flex items-center gap-1.5 rounded-full px-inset-md font-label-sm text-label-sm font-bold transition-colors active:scale-95 ${
              audioOpen
                ? "bg-primary text-on-primary"
                : "bg-primary-fixed text-on-primary-fixed"
            }`}
          >
            <Icon name={audioOpen ? "graphic_eq" : "volume_up"} className="text-body-lg" />
            <span>سنیں Listen</span>
          </button>
        </div>

        {/* Toggleable audio box */}
        {audioOpen && (
          <div className="rounded-2xl border border-primary/20 bg-primary-fixed/40 p-inset-md flex items-start gap-inset-sm">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
              <Icon name="hearing" className="text-body-lg" />
            </span>
            <div className="flex flex-col gap-1">
              <p className="font-label-md text-label-md font-bold text-on-primary-fixed">
                آڈیو ہدایات چل رہی ہیں
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                &ldquo;آپ گھر بیٹھے مفت ڈاکٹر سے بات کر سکتی ہیں۔ نیچے سے چیٹ، ویڈیو یا کلینک
                وزٹ منتخب کریں۔&rdquo;
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                You can speak to a doctor free of cost. Choose chat, video, or a clinic visit
                below.
              </p>
              <div className="mt-1 flex items-center gap-1" aria-hidden="true">
                {[10, 18, 26, 14, 22, 12, 20, 8].map((height, index) => (
                  <span
                    key={index}
                    className="w-1 rounded-full bg-primary animate-pulse"
                    style={{ height: `${height}px`, animationDelay: `${index * 90}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Specialist bento card */}
        <section
          aria-labelledby="specialist-heading"
          className="rounded-2xl bg-surface-container-lowest p-inset-md shadow-[0_2px_14px_rgba(19,27,46,0.06)] flex flex-col gap-stack-md"
        >
          <div className="flex items-start gap-inset-md">
            <div className="relative shrink-0">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-tertiary text-on-primary">
                <Icon name="stethoscope" className="text-headline-lg" />
              </div>
              <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-surface-container-lowest bg-tertiary" />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <h2
                id="specialist-heading"
                className="font-headline-sm text-headline-sm text-on-surface leading-tight"
              >
                Dr. Ayesha Khan
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                MBBS, FCPS (Gynecology)
              </p>
              <div className="flex flex-wrap items-center gap-inset-xs pt-0.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-tertiary-container px-inset-sm py-0.5 font-label-sm text-label-sm font-bold text-on-tertiary-container">
                  <Icon name="verified" className="text-body-sm" />
                  PMDC Verified
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-inset-sm py-0.5 font-label-sm text-label-sm font-bold text-on-surface">
                  <Icon name="star" className="text-body-sm text-secondary" />
                  4.9
                  <span className="font-normal text-on-surface-variant">(480+)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-2 gap-inset-sm">
            <div className="col-span-2 rounded-xl bg-primary-fixed/50 p-inset-sm">
              <p className="font-label-sm text-label-sm font-bold text-on-primary-fixed-variant uppercase tracking-wide">
                Specialization
              </p>
              <p className="font-body-md text-body-md font-semibold text-on-surface leading-snug">
                High-Risk Maternal Specialist
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                زچگی کی پیچیدہ صورتحال کی ماہر
              </p>
            </div>
            <div className="rounded-xl bg-surface-container-low p-inset-sm flex flex-col justify-center">
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">
                Experience
              </p>
              <p className="font-headline-sm text-headline-sm text-primary">10 Yrs</p>
            </div>
            <div className="rounded-xl bg-surface-container-low p-inset-sm flex flex-col justify-center gap-1">
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">
                Languages
              </p>
              <div className="flex flex-wrap gap-1">
                {languages.map((language) => (
                  <span
                    key={language}
                    className="rounded-full bg-surface-container-high px-2 py-0.5 font-label-sm text-[11px] font-semibold text-on-surface"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Subsidy banner */}
          <div className="flex items-center justify-between gap-inset-sm rounded-xl bg-tertiary px-inset-md py-inset-sm text-on-tertiary">
            <div className="flex items-center gap-inset-sm">
              <Icon name="volunteer_activism" className="text-headline-sm" />
              <div className="flex flex-col">
                <span className="font-label-md text-label-md font-bold leading-tight">
                  100% Free Rural Care
                </span>
                <span className="font-body-sm text-body-sm opacity-90 leading-tight">
                  دیہی خواتین کے لیے مکمل مفت
                </span>
              </div>
            </div>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-on-tertiary/20 px-inset-sm py-1 font-label-sm text-label-sm font-bold">
              <span className="h-2 w-2 rounded-full bg-tertiary-fixed animate-pulse" />
              Online
            </span>
          </div>
        </section>

        {/* Consultation modes */}
        <section aria-labelledby="modes-heading" className="flex flex-col gap-stack-sm">
          <h2
            id="modes-heading"
            className="font-headline-sm text-headline-sm text-on-surface px-inset-xs"
          >
            Choose how to consult
            <span className="block font-body-sm text-body-sm font-normal text-on-surface-variant">
              مشورہ کا طریقہ منتخب کریں
            </span>
          </h2>

          {consultationModes.map((mode) => (
            <Link
              key={mode.id}
              href={mode.href}
              className={`group flex min-h-touch-spacious items-center gap-inset-md rounded-2xl p-inset-md transition-transform active:scale-[0.98] ${
                mode.highlighted
                  ? "bg-primary text-on-primary shadow-[0_6px_20px_rgba(0,104,95,0.28)]"
                  : "bg-surface-container-lowest text-on-surface border border-outline-variant/60"
              }`}
            >
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                  mode.highlighted
                    ? "bg-on-primary/15 text-on-primary"
                    : "bg-primary-fixed text-on-primary-fixed"
                }`}
              >
                <Icon name={mode.icon} className="text-headline-md" />
              </span>
              <span className="flex flex-1 flex-col">
                <span className="flex items-center gap-inset-sm">
                  <span className="font-label-lg text-label-lg font-bold leading-tight">
                    {mode.title}
                  </span>
                  {mode.badge && (
                    <span className="rounded-full bg-secondary px-inset-sm py-0.5 font-label-sm text-[11px] font-bold text-on-secondary">
                      {mode.badge}
                    </span>
                  )}
                </span>
                <span
                  className={`font-body-sm text-body-sm leading-snug ${
                    mode.highlighted ? "text-on-primary/85" : "text-on-surface-variant"
                  }`}
                >
                  {mode.urdu}
                </span>
                <span
                  className={`font-body-sm text-[13px] leading-snug ${
                    mode.highlighted ? "text-on-primary/70" : "text-outline"
                  }`}
                >
                  {mode.hint}
                </span>
              </span>
              <Icon
                name="chevron_right"
                className={`text-headline-sm shrink-0 ${
                  mode.highlighted ? "text-on-primary" : "text-outline"
                }`}
              />
            </Link>
          ))}
        </section>

        {/* Affiliated facility */}
        <section
          aria-labelledby="facility-heading"
          className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 p-inset-md flex flex-col gap-stack-sm"
        >
          <div className="flex items-start gap-inset-md">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-tertiary-fixed text-on-tertiary-fixed">
              <Icon name="local_hospital" className="text-headline-md" />
            </span>
            <div className="flex flex-1 flex-col gap-0.5">
              <p className="font-label-sm text-label-sm font-bold uppercase tracking-wide text-on-surface-variant">
                Affiliated Facility
              </p>
              <h3
                id="facility-heading"
                className="font-label-lg text-label-lg font-bold text-on-surface leading-tight"
              >
                Tehsil Headquarter Hospital (THQ)
              </h3>
              <div className="flex flex-wrap items-center gap-inset-sm pt-1">
                <span className="inline-flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
                  <Icon name="bed" className="text-body-md text-primary" />
                  Ward 4 — Maternal
                </span>
                <span className="inline-flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
                  <Icon name="near_me" className="text-body-md text-primary" />
                  2.4 km away
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-inset-sm">
            <a
              href="tel:080012345"
              className="min-h-touch-min flex items-center justify-center gap-inset-xs rounded-xl bg-primary-container px-inset-sm font-label-md text-label-md font-bold text-on-primary-container active:scale-95 transition-transform"
            >
              <Icon name="call" className="text-body-lg" />
              Desk Call
            </a>
            <a
              href="tel:1122"
              className="min-h-touch-min flex items-center justify-center gap-inset-xs rounded-xl bg-secondary px-inset-sm font-label-md text-label-md font-bold text-on-secondary shadow-[0_4px_14px_rgba(185,5,56,0.25)] active:scale-95 transition-transform"
            >
              <Icon name="emergency" className="text-body-lg" />
              1122 ایمبولینس
            </a>
          </div>
        </section>

        {/* LHW endorsement strip */}
        <div className="flex items-center gap-inset-sm rounded-2xl bg-surface-container px-inset-md py-inset-sm">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-on-primary-fixed">
            <Icon name="workspace_premium" className="text-body-lg" />
          </span>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
            <span className="font-label-md text-label-md font-bold text-on-surface">
              Endorsed by your LHW
            </span>
            <br />
            Nasreen Akhtar (Lady Health Worker, Chak 42-SB) recommends this desk for all
            pregnancy check-ups.
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
