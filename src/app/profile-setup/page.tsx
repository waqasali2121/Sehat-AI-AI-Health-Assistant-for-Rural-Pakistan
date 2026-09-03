"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icon";
import { SehatLogo } from "@/components/logo";
import { useState } from "react";
import { savePatientData, type PatientData } from "@/lib/patient-store";

export default function ProfileSetupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [village, setVillage] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [lhwName, setLhwName] = useState("");
  const [lhwPhone, setLhwPhone] = useState("");
  const [week, setWeek] = useState(24);
  const [dueDate, setDueDate] = useState("2026-11-18");
  const [firstPregnancy, setFirstPregnancy] = useState<boolean | null>(null);
  const [complications, setComplications] = useState<string[]>(["csection"]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(1);

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
      "اپنا نام، عمر، گاؤں اور حمل کے بارے میں بتائیں۔"
    );
    u.lang = "ur-PK";
    u.onend = () => setIsPlaying(false);
    speechSynthesis.speak(u);
  };

  const handleSave = () => {
    const patient: PatientData = {
      fullName: fullName || "Patient",
      age: Number(age) || 25,
      phone,
      village,
      bloodGroup,
      gestationalWeek: week,
      expectedDueDate: dueDate,
      isFirstPregnancy: firstPregnancy ?? true,
      previousComplications: complications,
      healthConditions: conditions,
      emergencyContactName: emergencyName,
      emergencyContactPhone: emergencyPhone,
      lhwName,
      lhwPhone,
    };
    savePatientData(patient);
    router.push("/dashboard");
  };

  const step1Valid = fullName.trim() && age;

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
                Registration
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="Listen in Urdu"
              onClick={playAudio}
              className="min-h-touch-min min-w-touch-min p-inset-xs rounded-full bg-surface-container-high text-primary flex items-center justify-center active:scale-95 transition-transform"
              type="button"
            >
              <Icon name={isPlaying ? "graphic_eq" : "volume_up"} className="text-headline-sm" />
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
        {/* Step indicator */}
        <div className="flex gap-1 px-margin-mobile pb-2">
          <div className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-primary" : "bg-outline-variant"}`} />
          <div className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-primary" : "bg-outline-variant"}`} />
        </div>
      </header>

      <main className="flex flex-col w-full pt-24 pb-28 min-h-screen">
        <div className="flex flex-col w-full px-margin-mobile gap-stack-lg max-w-lg mx-auto">

          {step === 1 && (
            <>
              <section className="flex flex-col gap-stack-sm">
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1.5 px-inset-xs py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm">
                    <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse" />
                    Step 1 of 2 • قدم ۱ از ۲
                  </span>
                </div>
                <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface leading-tight">
                  Patient Information
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant font-medium" dir="rtl">
                  مریض کی ذاتی معلومات
                </p>
              </section>

              <form className="flex flex-col gap-stack-lg" onSubmit={(e) => { e.preventDefault(); if (step1Valid) setStep(2); }}>
                {/* Full Name */}
                <div className="flex flex-col gap-2 p-inset-md rounded-xl bg-surface-container-lowest shadow-sm">
                  <label className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5">
                    <Icon name="person" className="text-primary text-[20px]" />
                    Full Name <span className="text-on-surface-variant font-normal">/ پورا نام</span>
                  </label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Fatima Bibi"
                    className="w-full h-touch-min px-inset-md rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all"
                    required
                  />
                </div>

                {/* Age + Blood Group */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2 p-inset-md rounded-xl bg-surface-container-lowest shadow-sm">
                    <label className="font-label-md text-label-md text-on-surface flex items-center gap-1.5">
                      <Icon name="cake" className="text-primary text-[18px]" />
                      Age / عمر
                    </label>
                    <input
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      type="number"
                      min="13"
                      max="50"
                      placeholder="25"
                      className="w-full h-touch-min px-inset-md rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2 p-inset-md rounded-xl bg-surface-container-lowest shadow-sm">
                    <label className="font-label-md text-label-md text-on-surface flex items-center gap-1.5">
                      <Icon name="bloodtype" className="text-primary text-[18px]" />
                      Blood / خون
                    </label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full h-touch-min px-inset-md rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all"
                    >
                      <option value="">Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                {/* Phone + Village */}
                <div className="flex flex-col gap-2 p-inset-md rounded-xl bg-surface-container-lowest shadow-sm">
                  <label className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5">
                    <Icon name="phone" className="text-primary text-[20px]" />
                    Phone Number <span className="text-on-surface-variant font-normal">/ فون نمبر</span>
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03XX-XXXXXXX"
                    className="w-full h-touch-min px-inset-md rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2 p-inset-md rounded-xl bg-surface-container-lowest shadow-sm">
                  <label className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5">
                    <Icon name="location_on" className="text-primary text-[20px]" />
                    Village / Area <span className="text-on-surface-variant font-normal">/ گاؤں</span>
                  </label>
                  <input
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="e.g. Chak 42-SB, Sargodha"
                    className="w-full h-touch-min px-inset-md rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>

                {/* Emergency Contact */}
                <div className="flex flex-col gap-stack-sm p-inset-md rounded-xl bg-error-container/20 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Icon name="emergency" className="text-secondary text-[22px]" />
                    <span className="font-label-lg text-label-lg text-on-surface font-bold">
                      Emergency Contact <span className="font-normal text-on-surface-variant">/ ایمرجنسی رابطہ</span>
                    </span>
                  </div>
                  <input
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder="Name (e.g. Husband / شوہر)"
                    className="w-full h-touch-min px-inset-md rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary outline-none transition-all"
                  />
                  <input
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="Phone number / فون نمبر"
                    className="w-full h-touch-min px-inset-md rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary outline-none transition-all"
                  />
                </div>

                {/* LHW Contact */}
                <div className="flex flex-col gap-stack-sm p-inset-md rounded-xl bg-tertiary/10 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Icon name="medical_services" className="text-tertiary text-[22px]" />
                    <span className="font-label-lg text-label-lg text-on-surface font-bold">
                      Lady Health Worker <span className="font-normal text-on-surface-variant">/ لیڈی ہیلتھ ورکر</span>
                    </span>
                  </div>
                  <input
                    value={lhwName}
                    onChange={(e) => setLhwName(e.target.value)}
                    placeholder="LHW Name"
                    className="w-full h-touch-min px-inset-md rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-tertiary outline-none transition-all"
                  />
                  <input
                    value={lhwPhone}
                    onChange={(e) => setLhwPhone(e.target.value)}
                    placeholder="LHW Phone number"
                    className="w-full h-touch-min px-inset-md rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-tertiary outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!step1Valid}
                  className="w-full min-h-touch-spacious bg-primary text-on-primary rounded-full font-label-lg text-label-lg shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-40"
                >
                  <span>Next: Pregnancy Details</span>
                  <Icon name="arrow_forward" className="text-body-md" />
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <section className="flex flex-col gap-stack-sm">
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1.5 px-inset-xs py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm">
                    <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse" />
                    Step 2 of 2 • قدم ۲ از ۲
                  </span>
                </div>
                <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface leading-tight">
                  Pregnancy Details
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant font-medium" dir="rtl">
                  حمل کی تفصیلات
                </p>
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
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug mt-0.5" dir="rtl">
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

              <div className="flex flex-col gap-stack-lg">
                {/* Gestational Week */}
                <div className="flex flex-col gap-stack-sm p-inset-md rounded-xl bg-surface-container-lowest shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5">
                        <span>Current Week</span>
                        <span className="text-on-surface-variant font-normal">/ موجودہ ہفتہ</span>
                      </label>
                    </div>
                    <span className="px-inset-sm py-inset-xs rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm">
                      {trimester}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 py-inset-xs bg-surface-container-low rounded-xl">
                    <button onClick={() => setWeek(Math.max(4, week - 1))} className="w-10 h-10 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center shadow-sm active:scale-90 transition-transform" type="button">
                      <Icon name="remove" />
                    </button>
                    <span className="font-headline-xl-mobile text-headline-xl-mobile text-primary font-bold px-stack-md">
                      {week}
                    </span>
                    <button onClick={() => setWeek(Math.min(42, week + 1))} className="w-10 h-10 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center shadow-sm active:scale-90 transition-transform" type="button">
                      <Icon name="add" />
                    </button>
                  </div>
                  <input className="w-full accent-primary h-2 bg-surface-container-high rounded-lg cursor-pointer" max={42} min={4} type="range" value={week} onChange={(e) => setWeek(Number(e.target.value))} />
                </div>

                {/* Due Date */}
                <div className="flex flex-col gap-stack-sm p-inset-md rounded-xl bg-surface-container-lowest shadow-sm">
                  <label className="font-label-lg text-label-lg text-on-surface">
                    Expected Delivery Date <span className="text-on-surface-variant font-normal">/ متوقع تاریخ پیدائش</span>
                  </label>
                  <div className="relative flex items-center">
                    <Icon name="calendar_month" className="absolute left-inset-md text-primary pointer-events-none" />
                    <input
                      className="w-full h-touch-min pl-12 pr-inset-md rounded-xl bg-surface-container-low text-on-surface font-label-md text-label-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* First Pregnancy */}
                <div className="flex flex-col gap-stack-sm p-inset-md rounded-xl bg-surface-container-lowest shadow-sm">
                  <span className="font-label-lg text-label-lg text-on-surface">
                    First pregnancy? <span className="text-on-surface-variant font-normal">/ کیا یہ پہلا حمل ہے؟</span>
                  </span>
                  <div className="grid grid-cols-2 gap-stack-sm">
                    <button onClick={() => setFirstPregnancy(true)} className={`min-h-touch-spacious p-inset-sm rounded-xl flex flex-col items-center gap-1 transition-all active:scale-95 ${firstPregnancy === true ? "bg-primary text-on-primary shadow-sm" : "bg-surface-container-low text-on-surface"}`} type="button">
                      <span className="font-label-lg font-bold">Yes / ہاں</span>
                    </button>
                    <button onClick={() => setFirstPregnancy(false)} className={`min-h-touch-spacious p-inset-sm rounded-xl flex flex-col items-center gap-1 transition-all active:scale-95 ${firstPregnancy === false ? "bg-primary text-on-primary shadow-sm" : "bg-surface-container-low text-on-surface"}`} type="button">
                      <span className="font-label-lg font-bold">No / نہیں</span>
                    </button>
                  </div>
                </div>

                {/* Health Conditions */}
                <div className="flex flex-col gap-stack-sm p-inset-md rounded-xl bg-surface-container-lowest shadow-sm">
                  <span className="font-label-lg text-label-lg text-on-surface">
                    Health Conditions <span className="text-on-surface-variant font-normal" dir="rtl">/ طبی مسائل</span>
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { val: "anemia", icon: "water_drop", label: "Anemia", urdu: "خون کی کمی" },
                      { val: "diabetes", icon: "glucose", label: "Diabetes", urdu: "شوگر" },
                      { val: "hypertension", icon: "monitor_heart", label: "High BP", urdu: "بلڈ پریشر" },
                      { val: "other", icon: "medication", label: "Other", urdu: "دیگر" },
                    ].map((item) => {
                      const checked = conditions.includes(item.val);
                      return (
                        <label key={item.val} className={`flex items-center gap-2.5 p-inset-sm rounded-xl cursor-pointer active:scale-[0.98] transition-all ${checked ? "bg-primary/10 ring-2 ring-primary" : "bg-surface-container-low"}`}>
                          <Icon name={item.icon} className={`text-headline-sm ${checked ? "text-primary" : "text-on-surface-variant"}`} />
                          <div className="flex flex-col min-w-0">
                            <span className="font-label-md text-label-md text-on-surface font-semibold truncate">{item.label}</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant" dir="rtl">{item.urdu}</span>
                          </div>
                          <input checked={checked} className="sr-only" onChange={() => toggleCondition(item.val)} type="checkbox" />
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 min-h-touch-spacious border-2 border-outline-variant text-on-surface rounded-full font-label-lg text-label-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                >
                  <Icon name="arrow_back" className="text-body-md" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-[2] min-h-touch-spacious bg-primary text-on-primary rounded-full font-label-lg text-label-lg shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                >
                  <span>Save & Start</span>
                  <span className="font-bold" dir="rtl">محفوظ کریں</span>
                  <Icon name="check_circle" className="text-body-md" />
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
