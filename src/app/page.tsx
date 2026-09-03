"use client";

import Link from "next/link";
import { Icon } from "@/components/icon";
import { SehatLogo } from "@/components/logo";
import { useState } from "react";

export default function SplashPage() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* Top Language Toggle */}
      <div className="flex justify-end px-margin-mobile pt-6">
        <button
          className="px-inset-sm py-inset-xs rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm flex items-center justify-center gap-1 active:scale-95 transition-transform"
          type="button"
        >
          <span className="font-bold">اردو</span>
          <span className="text-outline-variant font-normal">/</span>
          <span>ENG</span>
        </button>
      </div>

      {/* Center Logo & Branding */}
      <div className="flex flex-col items-center justify-center flex-1 px-margin-mobile gap-stack-lg">
        {/* Logo Emblem with Glow */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl scale-150" />
          <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-primary-container to-primary/20 flex items-center justify-center shadow-lg">
            <SehatLogo className="w-16 h-16" />
          </div>
        </div>

        {/* App Name */}
        <div className="flex flex-col items-center gap-1">
          <h1 className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface font-extrabold tracking-tight">
            Sehat AI
          </h1>
          <p className="font-headline-md text-headline-md text-primary font-bold" dir="rtl">
            صحت اے آئی
          </p>
        </div>

        {/* Audio Prompt Chip */}
        <button
          onClick={() => {
            setIsPlaying(!isPlaying);
            if (!isPlaying) {
              const utterance = new SpeechSynthesisUtterance(
                "خوش آمدید! صحت اے آئی میں آپ کا استقبال ہے۔ حاملہ خواتین کے لیے آپ کا ذاتی صحت کے معاون۔"
              );
              utterance.lang = "ur-PK";
              utterance.onend = () => setIsPlaying(false);
              speechSynthesis.speak(utterance);
            }
          }}
          className={`flex items-center gap-2 px-inset-md py-inset-sm rounded-full transition-all active:scale-95 ${
            isPlaying
              ? "bg-primary text-on-primary shadow-md"
              : "bg-surface-container-high text-primary"
          }`}
          type="button"
        >
          <Icon
            name={isPlaying ? "graphic_eq" : "volume_up"}
            className="text-body-lg"
          />
          <span className="font-label-md text-label-md font-semibold">
            {isPlaying ? "Playing..." : "Listen in Urdu • سنیں"}
          </span>
        </button>

        {/* Subtitle */}
        <div className="flex flex-col items-center text-center gap-1">
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Your AI Health Companion for a Safer Pregnancy
          </p>
          <p className="font-body-md text-body-md text-primary font-semibold" dir="rtl">
            آپ کی محفوظ حمل کی ذاتی اے آئی صحت رہنما
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 gap-2.5 w-full max-w-sm mt-2">
          {/* Mother & Infant Banner */}
          <div className="col-span-2 relative rounded-xl bg-gradient-to-r from-primary-container to-primary/30 p-inset-md overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-on-primary/15 flex items-center justify-center shrink-0">
                <Icon name="pregnant_woman" className="text-headline-md text-primary" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-label-md text-on-surface font-bold">
                  Mother & Baby Care
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant" dir="rtl">
                  ماں اور بچے کی مکمل نگہداشت
                </span>
              </div>
            </div>
          </div>

          {/* Voice First Card */}
          <div className="rounded-xl bg-surface-container-low p-inset-md flex flex-col items-center gap-2 text-center">
            <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center">
              <Icon name="mic" className="text-headline-sm text-tertiary" />
            </div>
            <span className="font-label-sm text-label-sm text-on-surface font-semibold">
              Voice First
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant" dir="rtl">
              آواز سے بات کریں
            </span>
          </div>

          {/* Tele-Doctor Card */}
          <div className="rounded-xl bg-surface-container-low p-inset-md flex flex-col items-center gap-2 text-center">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
              <Icon name="video_call" className="text-headline-sm text-secondary" />
            </div>
            <span className="font-label-sm text-label-sm text-on-surface font-semibold">
              Tele-Doctor
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant" dir="rtl">
              ڈاکٹر سے رابطہ
            </span>
          </div>
        </div>

        {/* Tagline Card */}
        <div className="w-full max-w-sm bg-surface-container-low rounded-xl p-inset-md text-center">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Trusted by Lady Health Workers across Punjab & Sindh
          </p>
          <p className="font-body-sm text-body-sm text-primary font-semibold mt-0.5" dir="rtl">
            پنجاب اور سندھ کی لیڈی ہیلتھ ورکرز کا اعتماد
          </p>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="px-margin-mobile pb-8 flex flex-col gap-3">
        <Link
          href="/onboarding"
          className="w-full min-h-touch-spacious bg-primary text-on-primary rounded-full font-label-lg text-label-lg shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <span>Start Journey</span>
          <span className="font-label-lg text-label-lg font-bold" dir="rtl">شروع کریں</span>
          <Icon name="arrow_forward" className="text-body-lg" />
        </Link>

        {/* Privacy Badge */}
        <div className="flex items-center justify-center gap-1.5 text-outline">
          <Icon name="verified_user" className="text-label-md" />
          <span className="font-label-sm text-label-sm">
            End-to-end encrypted • آپ کی معلومات محفوظ ہیں
          </span>
        </div>
      </div>
    </div>
  );
}
