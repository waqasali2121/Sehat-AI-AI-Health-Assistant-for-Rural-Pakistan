"use client";

import Link from "next/link";
import { Icon } from "@/components/icon";
import { useState } from "react";

const slides = [
  {
    icon: "smart_toy",
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    title: "AI Doctor Chat",
    titleUrdu: "اے آئی ڈاکٹر سے بات کریں",
    description:
      "Ask any health question in Urdu or English. Our AI provides instant, medically-reviewed guidance tailored to your pregnancy stage.",
    descriptionUrdu:
      "اردو یا انگریزی میں کوئی بھی صحت کا سوال پوچھیں۔ ہمارا اے آئی فوری طبی رہنمائی فراہم کرتا ہے۔",
  },
  {
    icon: "stethoscope",
    iconColor: "text-secondary",
    iconBg: "bg-secondary/10",
    title: "Symptom Checker",
    titleUrdu: "علامات کی فوری جانچ",
    description:
      "Select symptoms you're experiencing and get an instant risk assessment — Low, Medium, or High — with clear next steps.",
    descriptionUrdu:
      "اپنی علامات منتخب کریں اور فوری خطرے کی جانچ حاصل کریں — کم، درمیانی، یا زیادہ۔",
  },
  {
    icon: "video_camera_front",
    iconColor: "text-tertiary",
    iconBg: "bg-tertiary/10",
    title: "Connect with Doctors",
    titleUrdu: "ڈاکٹرز سے رابطہ کریں",
    description:
      "Video call or chat with verified gynecologists and maternity specialists. Free for rural mothers through government partnership.",
    descriptionUrdu:
      "تصدیق شدہ ماہر امراض نسواں سے ویڈیو کال یا چیٹ کریں۔ دیہی ماؤں کے لیے مفت۔",
  },
];

export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const goToSlide = (index: number) => {
    setCurrentSlide(Math.max(0, Math.min(slides.length - 1, index)));
  };

  const playAudio = () => {
    setIsPlaying(true);
    const slide = slides[currentSlide];
    const utterance = new SpeechSynthesisUtterance(
      `${slide.title}. ${slide.descriptionUrdu}`
    );
    utterance.lang = "ur-PK";
    utterance.onend = () => setIsPlaying(false);
    speechSynthesis.speak(utterance);
  };

  const slide = slides[currentSlide];

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* Skip Button */}
      <div className="flex justify-end px-margin-mobile pt-6">
        <Link
          href="/dashboard"
          className="font-label-md text-label-md text-on-surface-variant px-inset-sm py-inset-xs rounded-full bg-surface-container-high active:scale-95 transition-transform"
        >
          Skip / چھوڑیں
        </Link>
      </div>

      {/* Slide Content */}
      <div className="flex flex-col items-center flex-1 px-margin-mobile gap-stack-lg pt-8">
        {/* Hero Icon */}
        <div className="relative">
          <div className={`absolute inset-0 rounded-full ${slide.iconBg} blur-2xl scale-150`} />
          <div
            className={`relative w-32 h-32 rounded-2xl ${slide.iconBg} flex items-center justify-center shadow-lg`}
          >
            <Icon name={slide.icon} className={`text-[64px] ${slide.iconColor}`} />
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col items-center text-center gap-2 max-w-sm">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold leading-tight">
            {slide.title}
          </h2>
          <p className="font-headline-sm text-headline-sm text-primary font-bold" dir="rtl">
            {slide.titleUrdu}
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 leading-relaxed">
            {slide.description}
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant font-semibold leading-relaxed" dir="rtl">
            {slide.descriptionUrdu}
          </p>
        </div>

        {/* Audio Button */}
        <button
          onClick={playAudio}
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
            {isPlaying ? "Playing..." : "Listen • سنیں"}
          </span>
        </button>
      </div>

      {/* Bottom Controls */}
      <div className="px-margin-mobile pb-8 flex flex-col gap-4">
        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`h-2 rounded-full transition-all ${
                i === currentSlide
                  ? "w-8 bg-primary"
                  : "w-2 bg-outline-variant"
              }`}
              aria-label={`Go to slide ${i + 1}`}
              type="button"
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => goToSlide(currentSlide - 1)}
            disabled={currentSlide === 0}
            className="min-h-touch-min min-w-touch-min rounded-full bg-surface-container-high text-on-surface flex items-center justify-center gap-1 font-label-md text-label-md active:scale-95 transition-transform disabled:opacity-30"
            type="button"
          >
            <Icon name="arrow_back" className="text-body-md" />
            <span>Back</span>
          </button>

          {currentSlide < slides.length - 1 ? (
            <button
              onClick={() => goToSlide(currentSlide + 1)}
              className="min-h-touch-spacious px-inset-xl rounded-full bg-primary text-on-primary flex items-center justify-center gap-1 font-label-lg text-label-lg shadow-md active:scale-[0.98] transition-all"
              type="button"
            >
              <span>Next</span>
              <Icon name="arrow_forward" className="text-body-md" />
            </button>
          ) : (
            <Link
              href="/dashboard"
              className="min-h-touch-spacious px-inset-xl rounded-full bg-primary text-on-primary flex items-center justify-center gap-1 font-label-lg text-label-lg shadow-md active:scale-[0.98] transition-all"
            >
              <span>Get Started</span>
              <span className="font-label-lg text-label-lg font-bold" dir="rtl">شروع کریں</span>
            </Link>
          )}
        </div>

        {/* Trust Badge */}
        <div className="flex items-center justify-center gap-1.5 text-outline">
          <Icon name="verified" className="text-label-md text-tertiary" />
          <span className="font-label-sm text-label-sm">
            Certified by Punjab Health Department • پنجاب محکمہ صحت سے تصدیق شدہ
          </span>
        </div>
      </div>
    </div>
  );
}
