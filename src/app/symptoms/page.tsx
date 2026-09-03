"use client";

import { AppHeader } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { Icon } from "@/components/icon";
import Link from "next/link";
import { useState } from "react";

const symptoms = [
  { id: "bleeding", icon: "water_drop", iconColor: "text-secondary", iconBg: "bg-secondary-container/15", label: "Bleeding or Spotting", urdu: "خون آنا یا ہلکے دھبے", danger: true },
  { id: "abdominal", icon: "bolt", iconColor: "text-secondary", iconBg: "bg-secondary-container/15", label: "Severe Abdominal Pain", urdu: "پیٹ میں شدید درد یا اینٹھن", danger: true },
  { id: "movement", icon: "child_care", iconColor: "text-secondary", iconBg: "bg-secondary-fixed/50", label: "Reduced Baby Movement", urdu: "بچے کی حرکت میں نمایاں کمی", danger: true },
  { id: "water", icon: "opacity", iconColor: "text-primary", iconBg: "bg-primary/10", label: "Water Leakage / Discharge", urdu: "پانی کا اخراج یا رطوبت" },
  { id: "fever", icon: "device_thermostat", iconColor: "text-primary", iconBg: "bg-primary-container/15", label: "Fever / Chills", urdu: "تیز بخار یا کپکپی طاری ہونا" },
  { id: "headache", icon: "visibility_off", iconColor: "text-primary", iconBg: "bg-primary-container/15", label: "Headache / Blurred Vision", urdu: "شدید سر درد یا نظر میں دھندلا پن" },
  { id: "swelling", icon: "accessibility_new", iconColor: "text-primary", iconBg: "bg-primary-container/15", label: "Swelling in Feet or Face", urdu: "ہاتھ پاؤں یا چہرے پر سوجن" },
  { id: "vomiting", icon: "sick", iconColor: "text-primary", iconBg: "bg-primary-container/15", label: "Severe Vomiting", urdu: "شدید متلی یا قے" },
];

const durations = [
  { id: "today", label: "Today", urdu: "آج" },
  { id: "2-3days", label: "2-3 Days", urdu: "۲-۳ دن" },
  { id: "1week", label: "> 1 Week", urdu: "ایک ہفتے سے زیادہ" },
];

const severities = [
  { id: "mild", label: "Mild", urdu: "ہلکا", color: "text-tertiary" },
  { id: "moderate", label: "Moderate", urdu: "درمیانہ", color: "text-primary" },
  { id: "severe", label: "Severe", urdu: "شدید", color: "text-secondary" },
];

export default function SymptomsPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [duration, setDuration] = useState("today");
  const [severity, setSeverity] = useState("mild");
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleSymptom = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const playVoice = () => {
    setIsPlaying(true);
    const u = new SpeechSynthesisUtterance(
      "آج آپ جو علامات محسوس کر رہی ہیں ان کا انتخاب کریں۔"
    );
    u.lang = "ur-PK";
    u.onend = () => setIsPlaying(false);
    speechSynthesis.speak(u);
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <AppHeader subtitle="Symptoms" />

      <main className="flex flex-col relative w-full pt-20 pb-28 bg-surface min-h-screen">
        <div className="flex flex-col w-full px-margin-mobile gap-stack-md max-w-lg mx-auto">
          {/* Welcome Card */}
          <div className="flex flex-col rounded-xl bg-surface-container-low p-inset-md shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between gap-inset-sm">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                  <span className="font-label-sm text-label-sm text-primary tracking-wide uppercase">
                    AI Triage • فوری طبی جانچ
                  </span>
                </div>
                <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold leading-tight">
                  Check Your Symptoms
                  <br />
                  <span className="font-headline-md text-headline-md text-primary font-bold" dir="rtl">
                    علامات کی جانچ
                  </span>
                </h1>
              </div>
              <div className="relative flex-shrink-0 w-16 h-16 rounded-full overflow-hidden shadow-sm bg-surface-container-highest flex items-center justify-center">
                <Icon name="support_agent" className="text-[36px] text-primary" />
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
              Select any symptoms you are feeling today for an instant medical assessment.
              <span className="block text-primary font-semibold mt-0.5" dir="rtl">
                آج آپ جو علامات محسوس کر رہی ہیں ان کا انتخاب کریں۔
              </span>
            </p>

            {/* Voice Assistance Banner */}
            <div className="mt-3 flex items-center justify-between bg-primary-container/10 p-inset-sm rounded-lg">
              <div className="flex items-center gap-2 min-w-0">
                <Icon name="volume_up" className="text-primary text-headline-md" />
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                    Voice Assistance Available
                  </span>
                  <span className="font-body-sm text-[12px] text-primary leading-none" dir="rtl">
                    سوالات اردو میں سننے کے لیے اسپیکر دبائیں
                  </span>
                </div>
              </div>
              <button
                onClick={playVoice}
                className="min-h-touch-min px-inset-sm rounded-full bg-primary text-on-primary flex items-center justify-center gap-1 active:scale-95 transition-transform shadow-sm"
                type="button"
              >
                <Icon name={isPlaying ? "graphic_eq" : "play_arrow"} className="text-body-md" />
                <span className="font-label-sm text-label-sm font-bold">سنیں Play</span>
              </button>
            </div>
          </div>

          {/* Symptoms Multi-Select Grid */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5">
                <Icon name="checklist" className="text-primary" />
                <span>Current Symptoms (موجودہ علامات)</span>
              </h2>
              <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-bold">
                {selected.length} Selected
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {symptoms.map((s) => {
                const isSelected = selected.includes(s.id);
                return (
                  <div
                    key={s.id}
                    onClick={() => toggleSymptom(s.id)}
                    className={`group cursor-pointer flex items-center justify-between p-inset-sm rounded-xl shadow-sm active:scale-[0.98] transition-all ${
                      isSelected
                        ? "bg-primary/10 ring-2 ring-primary"
                        : "bg-surface-container-lowest"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-12 h-12 rounded-lg ${s.iconBg} flex items-center justify-center text-${isSelected ? "primary" : s.iconColor.replace("text-", "")} flex-shrink-0`}>
                        <Icon name={s.icon} className={`text-headline-sm ${isSelected ? "text-primary" : s.iconColor}`} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-md text-label-md text-on-surface font-bold truncate">
                          {s.label}
                        </span>
                        <span className={`font-body-sm text-body-sm ${s.danger ? "text-secondary" : "text-on-surface-variant"} font-medium`} dir="rtl">
                          {s.urdu}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-primary text-on-primary"
                            : "bg-surface-container-highest text-transparent"
                        }`}
                      >
                        <Icon name="check" className="text-body-md" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Duration Selector */}
          <div className="flex flex-col gap-2">
            <span className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5">
              <Icon name="schedule" className="text-primary" />
              <span>Duration (مدت)</span>
            </span>
            <div className="grid grid-cols-3 gap-2">
              {durations.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDuration(d.id)}
                  className={`min-h-touch-min p-inset-sm rounded-xl flex flex-col items-center gap-0.5 transition-all active:scale-95 ${
                    duration === d.id
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container-lowest text-on-surface"
                  }`}
                  type="button"
                >
                  <span className="font-label-md text-label-md font-bold">{d.label}</span>
                  <span className={`font-body-sm text-body-sm ${duration === d.id ? "text-on-primary/80" : "text-on-surface-variant"}`} dir="rtl">
                    {d.urdu}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Severity Tiles */}
          <div className="flex flex-col gap-2">
            <span className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5">
              <Icon name="signal_cellular_alt" className="text-primary" />
              <span>Severity (شدت)</span>
            </span>
            <div className="grid grid-cols-3 gap-2">
              {severities.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSeverity(s.id)}
                  className={`min-h-touch-min p-inset-sm rounded-xl flex flex-col items-center gap-0.5 transition-all active:scale-95 ${
                    severity === s.id
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container-lowest text-on-surface"
                  }`}
                  type="button"
                >
                  <span className={`font-label-md text-label-md font-bold ${severity === s.id ? "text-on-primary" : s.color}`}>
                    {s.label}
                  </span>
                  <span className={`font-body-sm text-body-sm ${severity === s.id ? "text-on-primary/80" : "text-on-surface-variant"}`} dir="rtl">
                    {s.urdu}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Safety Banner */}
          <div className="p-inset-md rounded-xl bg-surface-container-low flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Icon name="shield" className="text-headline-sm" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-label-md text-on-surface font-bold">
                AI-Powered Safety Check
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant" dir="rtl">
                آپ کی علامات کا اے آئی سے فوری جائزہ لیا جائے گا۔ یہ طبی مشورے کی جگہ نہیں لیتا۔
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Analyze CTA */}
      <div className="fixed bottom-20 left-0 right-0 px-margin-mobile pb-inset-sm bg-gradient-to-t from-surface via-surface to-transparent pt-4 z-40">
        <div className="max-w-lg mx-auto">
          <Link
            href="/triage-result"
            className="w-full min-h-touch-spacious bg-primary text-on-primary rounded-full font-label-lg text-label-lg shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <Icon name="analytics" className="text-body-lg" />
            <span>Analyze Symptoms with AI</span>
            <span className="font-label-lg text-label-lg font-bold" dir="rtl">تجزیہ کریں</span>
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
