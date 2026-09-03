"use client";

import { Icon } from "@/components/icon";
import { SehatLogo } from "@/components/logo";
import Link from "next/link";
import { useState } from "react";

const dangerSigns = [
  { icon: "error", label: "Sudden severe persistent headache", urdu: "شدید سر درد جو دوا یا آرام سے ٹھیک نہ ہو" },
  { icon: "visibility_off", label: "Vision changes, spots, or blurry vision", urdu: "آنکھوں کے آگے اندھیرا یا دھندلا پن آنا" },
  { icon: "cardiology", label: "Severe chest pain or difficulty breathing", urdu: "سینے میں درد یا سانس لینے میں شدید دشواری" },
  { icon: "pan_tool", label: "Severe pain right under the ribs", urdu: "پسلیوں کے عین نیچے دائیں جانب تیز درد" },
];

const actions = [
  {
    num: 1,
    title: "Elevate Legs & Rest",
    description: "Keep feet raised on pillows while seated or lying down. Avoid standing stationary for long periods.",
    urdu: "آرام کے وقت پاؤں اونچے رکھیں اور دیر تک کھڑے رہنے سے گریز کریں۔",
    highlight: false,
  },
  {
    num: 2,
    title: "Hydration & Low Salt Intake",
    description: "Drink at least 8-10 glasses of boiled or clean water. Strictly reduce raw table salt and salty pickles.",
    urdu: "صاف پانی وافر مقدار میں پئیں اور اوپر سے اضافی نمک کھانے سے پرہیز کریں۔",
    highlight: false,
  },
  {
    num: 3,
    title: "Clinic Check Within 24 Hours",
    description: "Visit nearest BHU clinic or call your registered Lady Health Worker to re-check blood pressure.",
    urdu: "اگلے 24 گھنٹوں میں قریبی بنیادی مرکزِ صحت سے بلڈ پریشر چیک کروائیں۔",
    highlight: true,
  },
];

export default function TriageResultPage() {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const toggleAudio = () => {
    setIsAudioPlaying(!isAudioPlaying);
    if (!isAudioPlaying) {
      const u = new SpeechSynthesisUtterance(
        "آپ کی رپورٹ: درمیانی خطرہ۔ بلڈ پریشر ہلکا بلند ہے۔ پاؤں کی سوجن درجہ ایک۔ اگلے 24 گھنٹوں میں کلینک چیک کروائیں۔"
      );
      u.lang = "ur-PK";
      u.onend = () => setIsAudioPlaying(false);
      speechSynthesis.speak(u);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* Back-button Header */}
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 px-margin-mobile flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              aria-label="Go Back"
              onClick={() => window.history.back()}
              className="min-h-touch-min min-w-touch-min flex items-center justify-center text-on-surface hover:text-primary rounded-full transition-colors active:scale-95"
              type="button"
            >
              <Icon name="arrow_back" className="text-headline-md" />
            </button>
            <SehatLogo className="h-7 w-auto" />
            <h1 className="font-headline-sm text-headline-sm text-on-surface truncate">
              Triage Result Detail
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAudio}
              aria-label="Audio Readout"
              className={`min-h-touch-min min-w-touch-min p-inset-xs rounded-full flex items-center justify-center transition-colors active:scale-95 ${
                isAudioPlaying
                  ? "bg-primary text-on-primary"
                  : "bg-primary-container text-on-primary-container"
              }`}
              type="button"
            >
              <Icon name={isAudioPlaying ? "graphic_eq" : "volume_up"} className="text-body-lg" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-col relative w-full pt-16 pb-safe bg-surface min-h-screen">
        <div className="flex flex-col w-full px-margin-mobile pb-inset-xl max-w-lg mx-auto">
          {/* Audio Overview Banner */}
          <div className="mt-stack-sm mb-stack-md bg-surface-container-low rounded-xl p-inset-md shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm">
                <Icon name="volume_up" className="text-headline-sm" />
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Audio Guidance • آواز کی رہنمائی
                </p>
                <p className="font-headline-sm text-headline-sm text-on-surface">
                  Listen to Result • رپورٹ سنیں
                </p>
              </div>
            </div>
            <button
              onClick={toggleAudio}
              className="h-11 px-inset-md rounded-full bg-surface-container text-primary font-label-md text-label-md flex items-center gap-1.5 active:scale-95 transition-transform"
              type="button"
            >
              <Icon name={isAudioPlaying ? "pause" : "play_arrow"} className="text-body-lg" />
              <span>{isAudioPlaying ? "Pause" : "Play"}</span>
            </button>
          </div>

          {/* Triage Summary Card (Medium Risk) */}
          <div className="bg-surface-container-lowest rounded-xl shadow-md p-inset-lg relative overflow-hidden mb-stack-lg">
            {/* Severity indicator bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary-fixed-dim via-primary-container to-primary" />

            <div className="flex items-start justify-between gap-3 mb-stack-sm">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-container/20 text-primary shadow-sm">
                <Icon name="shield" className="text-body-md text-primary" />
                <span className="font-label-md text-label-md uppercase font-bold">
                  Medium Risk • درمیانی خطرہ
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full">
                Week 31 • ہفتہ 31
              </span>
            </div>

            <div className="mb-stack-md">
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                Identified Symptoms & Triage
              </p>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface leading-snug">
                Pregnancy-Related Dependent Oedema & Mild Hypertension
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1 text-right leading-relaxed font-semibold" dir="rtl">
                حمل کے دوران پاؤں کی سوجن اور بلڈ پریشر کی کڑی نگرانی درکار ہے
              </p>
            </div>

            {/* Vital Stats */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <div className="bg-surface-container-low rounded-lg p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between text-on-surface-variant mb-1">
                  <span className="font-label-sm text-label-sm">Blood Pressure</span>
                  <Icon name="favorite" className="text-body-md text-secondary" />
                </div>
                <p className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  135/88 <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">mmHg</span>
                </p>
                <span className="font-label-sm text-label-sm text-primary font-semibold mt-0.5">
                  Mildly Elevated
                </span>
              </div>
              <div className="bg-surface-container-low rounded-lg p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between text-on-surface-variant mb-1">
                  <span className="font-label-sm text-label-sm">Swelling Index</span>
                  <Icon name="water_drop" className="text-body-md text-primary" />
                </div>
                <p className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Grade 1+ <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">Pitting</span>
                </p>
                <span className="font-label-sm text-label-sm text-primary font-semibold mt-0.5">
                  Feet & Ankles
                </span>
              </div>
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="mb-stack-lg">
            <div className="flex items-center justify-between mb-stack-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-6 bg-primary rounded-full" />
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  Recommended Actions
                </h3>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                ہدایات برائے نگہداشت
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {actions.map((action) => (
                <div
                  key={action.num}
                  className="bg-surface-container-lowest rounded-xl p-inset-md shadow-sm flex items-start gap-3.5"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-headline-sm text-headline-sm font-bold ${
                      action.highlight
                        ? "bg-secondary/10 text-secondary"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {action.num}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-label-lg text-label-lg text-on-surface">
                        {action.title}
                      </p>
                      {action.highlight && (
                        <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
                          Priority
                        </span>
                      )}
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      {action.description}
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant font-medium mt-1 text-right" dir="rtl">
                      {action.urdu}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Signs Card */}
          <div className="bg-error-container/40 rounded-xl p-inset-lg shadow-sm mb-stack-lg relative overflow-hidden">
            <div className="flex items-center gap-2.5 mb-stack-sm">
              <div className="w-8 h-8 rounded-full bg-error text-on-error flex items-center justify-center shadow-sm">
                <Icon name="warning" className="text-body-lg" />
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-error-container">
                  Danger Signs to Watch
                </h3>
                <p className="font-label-sm text-label-sm text-error font-semibold">
                  ہنگامی اور فوری خطرے کی علامات
                </p>
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-on-error-container mb-stack-sm">
              If you experience any of these signs, seek <strong>immediate emergency care</strong> without waiting:
            </p>
            <div className="space-y-2.5">
              {dangerSigns.map((sign) => (
                <div key={sign.icon} className="bg-surface-container-lowest/80 rounded-lg p-3 flex items-start gap-2.5">
                  <Icon name={sign.icon} className="text-error text-body-lg flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-label-md text-label-md text-on-surface">{sign.label}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant text-right" dir="rtl">
                      {sign.urdu}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Telemedicine Doctor Card */}
          <div className="bg-surface-container-lowest rounded-xl p-inset-md shadow-sm mb-stack-lg flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-12 h-12 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
                <Icon name="person" className="text-headline-sm text-primary" />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-tertiary ring-2 ring-surface-container-lowest" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-md text-label-md text-on-surface truncate">
                    Dr. Shazia Parveen
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-surface-container text-primary font-label-sm text-label-sm">
                    OB/GYN
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-tertiary font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-tertiary" />
                  Available for instant call
                </p>
              </div>
            </div>
            <Icon name="video_call" className="text-headline-sm text-primary" />
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-3">
            <button
              className="min-h-touch-spacious w-full rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all px-inset-md"
              type="button"
            >
              <Icon name="call" className="text-headline-sm" />
              <span>Contact Gynecologist</span>
              <span className="font-label-lg text-label-lg font-bold" dir="rtl">ماہر امراض سے رابطہ</span>
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
                className="min-h-touch-min rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                type="button"
              >
                <Icon name="save" className="text-body-md text-primary" />
                <span>Save Record</span>
              </button>
              <button
                className="min-h-touch-min rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                type="button"
              >
                <Icon name="share" className="text-body-md text-primary" />
                <span>Share / Download</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
