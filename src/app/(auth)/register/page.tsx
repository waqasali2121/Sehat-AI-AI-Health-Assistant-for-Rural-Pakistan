"use client";

import Link from "next/link";
import { Icon } from "@/components/icon";
import { SehatLogo } from "@/components/logo";
import { useState } from "react";

const languages = [
  { id: "urdu", label: "اردو", sublabel: "Urdu", default: true },
  { id: "punjabi", label: "پنجابی", sublabel: "Punjabi" },
  { id: "sindhi", label: "سندھی", sublabel: "Sindhi" },
  { id: "pashto", label: "پشتو", sublabel: "Pashto" },
  { id: "english", label: "English", sublabel: "انگریزی" },
];

const villages = [
  "Chak 42-SB, Sargodha",
  "Village Rahim Yar Khan",
  "Mohalla Ghaziabad, Faisalabad",
  "Kot Momin, Sargodha",
  "Other / دیگر",
];

export default function RegisterPage() {
  const [age, setAge] = useState(24);
  const [selectedLangs, setSelectedLangs] = useState<string[]>(["urdu"]);
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleLang = (id: string) => {
    setSelectedLangs((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  const playGuide = () => {
    setIsPlaying(true);
    const u = new SpeechSynthesisUtterance(
      "خوش آمدید! اپنا نام، عمر، فون نمبر اور گاؤں درج کریں۔"
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
                Register
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
          {/* Voice Guide Banner */}
          <div className="flex items-center justify-between bg-primary-container/10 p-inset-sm rounded-xl mt-stack-md">
            <div className="flex items-center gap-2 min-w-0">
              <Icon
                name="volume_up"
                className="text-primary text-headline-md"
              />
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                  Voice Guidance Available
                </span>
                <span
                  className="font-body-sm text-[12px] text-primary leading-none"
                  dir="rtl"
                >
                  رجسٹریشن کے لیے آواز سے مدد لیں
                </span>
              </div>
            </div>
            <button
              onClick={playGuide}
              className="min-h-touch-min px-inset-sm rounded-full bg-primary text-on-primary flex items-center justify-center gap-1 active:scale-95 transition-transform shadow-sm"
              type="button"
            >
              <Icon
                name={isPlaying ? "graphic_eq" : "play_arrow"}
                className="text-body-md"
              />
              <span className="font-label-sm text-label-sm font-bold">
                سنیں
              </span>
            </button>
          </div>

          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold leading-tight">
                Create Your Account
              </h1>
              <p
                className="font-body-md text-body-md text-on-surface-variant font-semibold"
                dir="rtl"
              >
                اپنا اکاؤنٹ بنائیں
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-tertiary/10 text-tertiary font-label-sm text-label-sm flex items-center gap-1">
              <Icon name="verified" className="text-label-sm" />
              Verified
            </span>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-stack-md">
            {/* 1. Full Name */}
            <div className="flex flex-col gap-1.5 p-inset-md rounded-xl bg-surface-container-lowest shadow-sm">
              <label className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5">
                <span>1. Full Name</span>
                <span className="text-on-surface-variant font-normal" dir="rtl">
                  / مکمل نام
                </span>
              </label>
              <div className="relative flex items-center">
                <Icon
                  name="person"
                  className="absolute left-inset-md text-primary text-body-lg pointer-events-none"
                />
                <input
                  className="w-full h-touch-min pl-12 pr-14 rounded-xl bg-surface-container-low text-on-surface font-label-md text-label-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Fatima Bibi / فاطمہ بی بی"
                  type="text"
                />
                <button
                  onClick={() => setIsListening(!isListening)}
                  className={`absolute right-2 w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-all ${
                    isListening
                      ? "bg-secondary text-on-secondary animate-pulse"
                      : "bg-surface-container-high text-primary"
                  }`}
                  type="button"
                  aria-label="Voice dictation"
                >
                  <Icon name="mic" className="text-body-md" />
                </button>
              </div>
            </div>

            {/* 2. Age Stepper */}
            <div className="flex flex-col gap-1.5 p-inset-md rounded-xl bg-surface-container-lowest shadow-sm">
              <label className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5">
                <span>2. Age</span>
                <span
                  className="text-on-surface-variant font-normal"
                  dir="rtl"
                >
                  / عمر
                </span>
              </label>
              <div className="flex items-center justify-center gap-3 py-inset-xs">
                <button
                  onClick={() => setAge(Math.max(13, age - 1))}
                  className="w-12 h-12 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center shadow-sm active:scale-90 transition-transform"
                  type="button"
                  aria-label="Decrease age"
                >
                  <Icon name="remove" className="text-body-lg" />
                </button>
                <div className="flex flex-col items-center px-stack-lg">
                  <span className="font-headline-xl-mobile text-headline-xl-mobile text-primary font-bold">
                    {age}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Years / سال
                  </span>
                </div>
                <button
                  onClick={() => setAge(Math.min(50, age + 1))}
                  className="w-12 h-12 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center shadow-sm active:scale-90 transition-transform"
                  type="button"
                  aria-label="Increase age"
                >
                  <Icon name="add" className="text-body-lg" />
                </button>
              </div>
            </div>

            {/* 3. Phone Number */}
            <div className="flex flex-col gap-1.5 p-inset-md rounded-xl bg-surface-container-lowest shadow-sm">
              <label className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5">
                <span>3. Phone Number</span>
                <span
                  className="text-on-surface-variant font-normal"
                  dir="rtl"
                >
                  / فون نمبر
                </span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-inset-md text-primary font-label-md text-label-md font-bold pointer-events-none">
                  +92
                </span>
                <input
                  className="w-full h-touch-min pl-16 pr-12 rounded-xl bg-surface-container-low text-on-surface font-label-md text-label-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="300-1234567"
                  type="tel"
                />
                <span className="absolute right-inset-md text-outline font-label-sm text-label-sm pointer-events-none">
                  PK
                </span>
              </div>
            </div>

            {/* 4. Village / Tehsil */}
            <div className="flex flex-col gap-1.5 p-inset-md rounded-xl bg-surface-container-lowest shadow-sm">
              <label className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5">
                <span>4. Village / Tehsil</span>
                <span
                  className="text-on-surface-variant font-normal"
                  dir="rtl"
                >
                  / گاؤں یا تحصیل
                </span>
              </label>
              <div className="relative flex items-center">
                <Icon
                  name="location_on"
                  className="absolute left-inset-md text-primary text-body-lg pointer-events-none"
                />
                <select className="w-full h-touch-min pl-12 pr-inset-md rounded-xl bg-surface-container-low text-on-surface font-label-md text-label-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all appearance-none">
                  {villages.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                <Icon
                  name="expand_more"
                  className="absolute right-inset-md text-outline pointer-events-none"
                />
              </div>
            </div>

            {/* 5. Language Selection */}
            <div className="flex flex-col gap-1.5 p-inset-md rounded-xl bg-surface-container-lowest shadow-sm">
              <label className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5">
                <span>5. Preferred Language</span>
                <span
                  className="text-on-surface-variant font-normal"
                  dir="rtl"
                >
                  / زبان
                </span>
              </label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {languages.map((lang) => {
                  const isSelected = selectedLangs.includes(lang.id);
                  return (
                    <button
                      key={lang.id}
                      onClick={() => toggleLang(lang.id)}
                      className={`min-h-touch-min p-inset-sm rounded-xl flex flex-col items-center gap-0.5 transition-all active:scale-95 ${
                        isSelected
                          ? "bg-primary text-on-primary shadow-sm"
                          : "bg-surface-container-low text-on-surface"
                      }`}
                      type="button"
                    >
                      <span className="font-label-md text-label-md font-bold">
                        {lang.label}
                      </span>
                      <span
                        className={`font-body-sm text-body-sm ${
                          isSelected
                            ? "text-on-primary/80"
                            : "text-on-surface-variant"
                        }`}
                      >
                        {lang.sublabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Privacy Card */}
          <div className="p-inset-md rounded-xl bg-surface-container-low flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
              <Icon name="shield" className="text-headline-sm" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-label-md text-on-surface font-bold">
                Your Data is Safe
              </span>
              <span
                className="font-body-sm text-body-sm text-on-surface-variant"
                dir="rtl"
              >
                آپ کی معلومات مکمل طور پر محفوظ اور خفیہ ہیں۔ صرف آپ اور آپ کا
                ڈاکٹر دیکھ سکتے ہیں۔
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-2.5 pb-stack-md">
            <Link
              href="/profile-setup"
              className="w-full min-h-touch-spacious bg-primary text-on-primary rounded-full font-label-lg text-label-lg shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <span>Create Account</span>
              <span className="font-label-lg text-label-lg font-bold" dir="rtl">
                اکاؤنٹ بنائیں
              </span>
            </Link>
            <button
              className="w-full min-h-touch-min bg-surface-container-high text-on-surface rounded-full font-label-md text-label-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              type="button"
            >
              <Icon name="phone" className="text-body-md text-primary" />
              <span>Continue with Phone Number</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
