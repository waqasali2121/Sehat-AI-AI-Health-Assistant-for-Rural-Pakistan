"use client";

import Link from "next/link";
import { Icon } from "@/components/icon";
import { SehatLogo } from "@/components/logo";
import { useState } from "react";

export default function ProfileSetupPage() {
  const [week, setWeek] = useState(24);
  const [firstPregnancy, setFirstPregnancy] = useState<boolean | null>(null);
  const [complications, setComplications] = useState<string[]>(["csection"]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const trimester =
    week <= 12 ? "1st Trimester • پہلا سہ ماہی" :
    week <= 26 ? "2nd Trimester • دوسرا سہ ماہی" :
    "3rd Trimester • تیسرا سہ ماہی";

  const babySize = week <= 12 ? "Lemon" : week <= 20 ? "Banana" : week <= 28 ? "Ear of Corn" : week <= 36 ? "Papaya" : "Watermelon";
  const babySizeUrdu = week <= 12 ? "لیموں" : week <= 20 ? "کیلا" : week <= 28 ? "بھٹا" : week <= 36 ? "پپیتا" : "تربوز";

  const toggleComplication = (val: string) => {
    setComplications((prev) =>
      prev.includes(val) ? prev.filter((c) => c !== val) : [...prev, val]
    );
  };

  const toggleCondition = (val: string) => {
    setConditions((prev) =>
      prev.includes(val) ? prev.filter((c) => c !== val) : [...prev, val]
    );
  };

  const playAudio = () => {
    setIsPlaying(true);
    const u = new SpeechSynthesisUtterance(
      "اپنے حمل کے بارے میں بتائیں۔ کون سا ہفتہ ہے، متوقع تاریخ پیدائش، اور پہلے حمل کی تفصیلات درج کریں۔"
    );
    u.lang = "ur-PK";
    u.onend = () => setIsPlaying(false);
    speechSynthesis.speak(u);
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-20 px-margin-mobile flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <SehatLogo className="h-8 w-auto" />
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-primary leading-tight">
                صحت Sehat AI
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium leading-none">
                Profile
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="Language Toggle"
              className="min-h-touch-min min-w-touch-min px-inset-sm py-inset-xs rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm flex items-center justify-center gap-1 active:scale-95 transition-transform"
              type="button"
            >
              <span className="font-bold">اردو</span>
              <span className="text-outline-variant font-normal">/</span>
              <span>ENG</span>
            </button>
            <a
              aria-label="Emergency SOS"
              className="min-h-touch-min min-w-touch-min px-inset-sm rounded-full bg-secondary text-on-secondary flex items-center justify-center gap-1 font-label-sm text-label-sm shadow-[0_4px_12px_rgba(185,5,56,0.25)] active:scale-95 transition-transform"
              href="tel:1122"
            >
              <Icon name="sos" className="text-body-lg" />
              <span className="hidden sm:inline font-bold">مدد</span>
            </a>
          </div>
        </div>
      </header>

      <main className="flex flex-col w-full pt-20 pb-28 min-h-screen">
        <div className="flex flex-col w-full px-margin-mobile gap-stack-lg max-w-lg mx-auto">
          {/* Step Badge + Title */}
          <section className="flex flex-col gap-stack-sm pt-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col">
                <span className="inline-flex items-center gap-1.5 px-inset-xs py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm w-max mb-1">
                  <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse" />
                  Step 2 of 3 • قدم ۲ از ۳
                </span>
                <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface leading-tight">
                  Tell Us About Your Pregnancy
                </h1>
                <p
                  className="font-body-md text-body-md text-on-surface-variant font-medium mt-0.5"
                  dir="rtl"
                >
                  اپنے حمل اور صحت کے بارے میں بتائیں
                </p>
              </div>
              <button
                onClick={playAudio}
                className="min-w-touch-min min-h-touch-min p-inset-xs rounded-full bg-surface-container-high text-primary flex items-center justify-center shadow-sm active:scale-95 transition-transform"
                type="button"
                aria-label="Listen in Urdu"
              >
                <Icon
                  name={isPlaying ? "graphic_eq" : "volume_up"}
                  className="text-headline-sm"
                />
              </button>
            </div>
          </section>

          {/* Baby Size Card */}
          <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-high shadow-md p-inset-md">
            <div className="flex items-center gap-stack-md">
              <div className="relative flex-shrink-0 w-20 h-20 rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-center overflow-hidden">
                <Icon name="pregnant_woman" className="text-[48px] text-primary" />
                <span className="absolute bottom-1 right-1 bg-tertiary text-on-tertiary rounded-full px-1.5 py-0.2 text-[10px] font-bold">
                  {week}w
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">
                  Baby Size Today • بچے کی جسامت
                </span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface leading-tight mt-0.5 truncate">
                  {babySize}
                </h2>
                <p
                  className="font-body-sm text-body-sm text-on-surface-variant leading-snug mt-0.5"
                  dir="rtl"
                >
                  ماشاءاللہ! آپ کا بچہ اس وقت تقریباً {babySizeUrdu} کے سائز جتنا ہے۔
                </p>
              </div>
            </div>
            <div className="mt-inset-sm pt-inset-xs flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
              <span className="flex items-center gap-1">
                <Icon name="monitor_weight" className="text-sm text-tertiary" />
                ~{Math.round(week * 25)}g
              </span>
              <span className="flex items-center gap-1">
                <Icon name="straighten" className="text-sm text-tertiary" />
                ~{Math.round(week * 1.2)}cm
              </span>
              <span className="flex items-center gap-1 text-primary">
                <Icon name="favorite" className="text-sm" />
                Strong Heartbeat
              </span>
            </div>
          </section>

          {/* Form */}
          <form
            className="flex flex-col gap-stack-lg"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* 1. Gestational Week */}
            <div className="flex flex-col gap-stack-sm p-inset-md rounded-xl bg-surface-container-lowest shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5">
                    <span>1. Current Week</span>
                    <span className="text-on-surface-variant font-normal">
                      / موجودہ ہفتہ
                    </span>
                  </label>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Slide to select your pregnancy week
                  </p>
                </div>
                <span className="px-inset-sm py-inset-xs rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm">
                  {trimester}
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 py-inset-xs bg-surface-container-low rounded-xl">
                <button
                  onClick={() => setWeek(Math.max(4, week - 1))}
                  className="w-10 h-10 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center shadow-sm active:scale-90 transition-transform"
                  type="button"
                  aria-label="Decrease week"
                >
                  <Icon name="remove" />
                </button>
                <div className="flex flex-col items-center px-stack-md">
                  <div className="flex items-baseline gap-1">
                    <span className="font-headline-xl-mobile text-headline-xl-mobile text-primary font-bold">
                      {week}
                    </span>
                    <span className="font-label-md text-label-md text-on-surface-variant">
                      Weeks (ہفتے)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setWeek(Math.min(42, week + 1))}
                  className="w-10 h-10 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center shadow-sm active:scale-90 transition-transform"
                  type="button"
                  aria-label="Increase week"
                >
                  <Icon name="add" />
                </button>
              </div>

              <input
                className="w-full accent-primary h-2 bg-surface-container-high rounded-lg cursor-pointer"
                max={42}
                min={4}
                type="range"
                value={week}
                onChange={(e) => setWeek(Number(e.target.value))}
              />
              <div className="flex justify-between text-outline text-label-sm font-label-sm px-1">
                <span>Week 4</span>
                <span>Week 24</span>
                <span>Week 40</span>
              </div>
            </div>

            {/* 2. Expected Delivery Date */}
            <div className="flex flex-col gap-stack-sm p-inset-md rounded-xl bg-surface-container-lowest shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <label className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5">
                    <span>2. Expected Delivery Date (EDD)</span>
                  </label>
                  <span
                    className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5"
                    dir="rtl"
                  >
                    متوقع تاریخ پیدائش
                  </span>
                </div>
              </div>
              <div className="relative flex items-center">
                <Icon
                  name="calendar_month"
                  className="absolute left-inset-md text-primary pointer-events-none"
                />
                <input
                  className="w-full h-touch-min pl-12 pr-inset-md rounded-xl bg-surface-container-low text-on-surface font-label-md text-label-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all"
                  type="date"
                  defaultValue="2025-11-18"
                />
              </div>
              <p className="font-label-sm text-label-sm text-tertiary flex items-center gap-1">
                <Icon name="check_circle" className="text-sm" />
                Estimated delivery in approx. {Math.max(0, (40 - week) * 7)} days
              </p>
            </div>

            {/* 3. First Pregnancy Toggle */}
            <div className="flex flex-col gap-stack-sm p-inset-md rounded-xl bg-surface-container-lowest shadow-sm">
              <div className="flex flex-col">
                <span className="font-label-lg text-label-lg text-on-surface">
                  3. Is this your first pregnancy?
                </span>
                <span
                  className="font-body-sm text-body-sm text-on-surface-variant"
                  dir="rtl"
                >
                  کیا یہ آپ کا پہلا حمل ہے؟
                </span>
              </div>
              <div
                className="grid grid-cols-2 gap-stack-sm mt-1"
                role="radiogroup"
              >
                <button
                  onClick={() => setFirstPregnancy(true)}
                  className={`min-h-touch-spacious p-inset-sm rounded-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 text-center ${
                    firstPregnancy === true
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container-low text-on-surface"
                  }`}
                  type="button"
                >
                  <span className="font-label-lg text-label-lg font-bold">
                    Yes (ہاں)
                  </span>
                  <span
                    className={`font-label-sm text-label-sm ${
                      firstPregnancy === true
                        ? "text-on-primary/80"
                        : "text-on-surface-variant"
                    }`}
                  >
                    First baby
                  </span>
                </button>
                <button
                  onClick={() => setFirstPregnancy(false)}
                  className={`min-h-touch-spacious p-inset-sm rounded-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 text-center ${
                    firstPregnancy === false
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container-low text-on-surface"
                  }`}
                  type="button"
                >
                  <span className="font-label-lg text-label-lg font-bold">
                    No (نہیں)
                  </span>
                  <span
                    className={`font-label-sm text-label-sm ${
                      firstPregnancy === false
                        ? "text-on-primary/80"
                        : "text-on-surface-variant"
                    }`}
                  >
                    Had baby before
                  </span>
                </button>
              </div>
            </div>

            {/* 4. Previous Complications */}
            {firstPregnancy === false && (
              <div className="flex flex-col gap-stack-sm p-inset-md rounded-xl bg-surface-container-lowest shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-label-lg text-label-lg text-on-surface">
                      4. Previous Complications
                    </span>
                    <p
                      className="font-body-sm text-body-sm text-on-surface-variant mt-0.5"
                      dir="rtl"
                    >
                      پچھلے حمل میں کوئی مسئلہ پیش آیا تھا؟
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 mt-1">
                  {[
                    { val: "none", icon: "sentiment_satisfied", iconColor: "text-primary", label: "None / No Issues", urdu: "کوئی پیچیدگی نہیں تھی" },
                    { val: "csection", icon: "medical_services", iconColor: "text-secondary", label: "Previous C-Section", urdu: "پہلا سی سیکشن" },
                    { val: "preeclampsia", icon: "vital_signs", iconColor: "text-secondary", label: "Pre-eclampsia / Fits", urdu: "حمل میں شدید بلڈ پریشر" },
                    { val: "miscarriage", icon: "heart_broken", iconColor: "text-outline", label: "Miscarriage", urdu: "حامل گرنا" },
                  ].map((item) => {
                    const checked = complications.includes(item.val);
                    return (
                      <label
                        key={item.val}
                        className={`flex items-center justify-between p-inset-md rounded-xl cursor-pointer active:scale-[0.98] transition-all ${
                          checked
                            ? "bg-surface-container-high"
                            : "bg-surface-container-low"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon name={item.icon} className={`${item.iconColor} text-headline-sm`} />
                          <div className="flex flex-col">
                            <span className="font-label-md text-label-md text-on-surface font-semibold">
                              {item.label}
                            </span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant" dir="rtl">
                              {item.urdu}
                            </span>
                          </div>
                        </div>
                        <input
                          checked={checked}
                          className="w-6 h-6 accent-primary rounded cursor-pointer"
                          onChange={() => toggleComplication(item.val)}
                          type="checkbox"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. Health Conditions */}
            <div className="flex flex-col gap-stack-sm p-inset-md rounded-xl bg-surface-container-lowest shadow-sm">
              <div>
                <span className="font-label-lg text-label-lg text-on-surface">
                  5. Existing Health Conditions
                </span>
                <p
                  className="font-body-sm text-body-sm text-on-surface-variant mt-0.5"
                  dir="rtl"
                >
                  موجودہ طبی مسائل (ایک یا زیادہ منتخب کریں)
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {[
                  { val: "anemia", icon: "water_drop", label: "Anemia", urdu: "خون کی کمی" },
                  { val: "diabetes", icon: "glucose", label: "Diabetes", urdu: "شوگر" },
                  { val: "hypertension", icon: "monitor_heart", label: "High BP", urdu: "بلڈ پریشر" },
                  { val: "other", icon: "medication", label: "Other", urdu: "دیگر" },
                ].map((item) => {
                  const checked = conditions.includes(item.val);
                  return (
                    <label
                      key={item.val}
                      className={`flex items-center gap-2.5 p-inset-sm rounded-xl cursor-pointer active:scale-[0.98] transition-all ${
                        checked
                          ? "bg-primary/10 ring-2 ring-primary"
                          : "bg-surface-container-low"
                      }`}
                    >
                      <Icon
                        name={item.icon}
                        className={`text-headline-sm ${
                          checked ? "text-primary" : "text-on-surface-variant"
                        }`}
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                          {item.label}
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant" dir="rtl">
                          {item.urdu}
                        </span>
                      </div>
                      <input
                        checked={checked}
                        className="sr-only"
                        onChange={() => toggleCondition(item.val)}
                        type="checkbox"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          </form>

          {/* LHW Sync Banner */}
          <div className="p-inset-md rounded-xl bg-tertiary/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-tertiary text-on-tertiary flex items-center justify-center shrink-0">
              <Icon name="sync" className="text-headline-sm" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-label-md text-on-surface font-bold">
                Syncs with your LHW
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant" dir="rtl">
                آپ کی لیڈی ہیلتھ ورکر کو یہ معلومات خودکار بھیج دی جائیں گی
              </span>
            </div>
          </div>

          {/* Sticky Save CTA */}
          <Link
            href="/dashboard"
            className="w-full min-h-touch-spacious bg-primary text-on-primary rounded-full font-label-lg text-label-lg shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all sticky bottom-4"
          >
            <span>Save & Continue</span>
            <span className="font-label-lg text-label-lg font-bold" dir="rtl">
              محفوظ کریں
            </span>
            <Icon name="arrow_forward" className="text-body-md" />
          </Link>
        </div>
      </main>
    </div>
  );
}
