"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { Icon } from "@/components/icon";
import { getPatientRecord, savePatientData, saveSymptomFormSubmission } from "@/lib/patient-store";

export default function SymptomsPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSection, setActiveSection] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 1. Basic Information
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">(24);
  const [phone, setPhone] = useState("");
  const [trimester, setTrimester] = useState("13-27"); // 1-12, 13-27, 28+
  const [edd, setEdd] = useState("");
  const [bloodGroup, setBloodGroup] = useState("B+");

  // 2. Pregnancy Information
  const [isFirstPregnancy, setIsFirstPregnancy] = useState<boolean>(true);
  const [prevOutcomes, setPrevOutcomes] = useState<string[]>([]);

  // 3. Current Pregnancy Problems
  const [morningSickness, setMorningSickness] = useState("Mild vomiting");
  const [generalHealth, setGeneralHealth] = useState<string[]>(["Feeling normal"]);
  const [warningSigns, setWarningSigns] = useState<string[]>(["None of these"]);

  // 4. Blood Pressure
  const [checksBp, setChecksBp] = useState<boolean>(true);
  const [bpSystolic, setBpSystolic] = useState("120");
  const [bpDiastolic, setBpDiastolic] = useState("80");
  const [bpStatus, setBpStatus] = useState("Normal");
  const [bpSymptoms, setBpSymptoms] = useState<string[]>(["No problem"]);

  // 5. Weight Check
  const [currentWeight, setCurrentWeight] = useState("62");
  const [preWeight, setPreWeight] = useState("58");
  const [weightChange, setWeightChange] = useState("Normal increase");

  // 6. Baby Check
  const [ultrasoundDone, setUltrasoundDone] = useState<boolean>(true);
  const [babyHeartbeat, setBabyHeartbeat] = useState("Normal");
  const [babyGrowth, setBabyGrowth] = useState("Normal");
  const [babyMovement, setBabyMovement] = useState("Normal");
  const [placentaStatus, setPlacentaStatus] = useState("Normal");

  // 7. Blood Tests
  const [bloodTestsDone, setBloodTestsDone] = useState<boolean>(true);
  const [hemoglobin, setHemoglobin] = useState("Normal");
  const [bloodSugar, setBloodSugar] = useState("Normal");
  const [thyroidTest, setThyroidTest] = useState("Normal");
  const [bgTestDone, setBgTestDone] = useState<boolean>(true);
  const [infections, setInfections] = useState<string[]>(["Not checked"]);

  // 8. Urine Test
  const [urineTestDone, setUrineTestDone] = useState<boolean>(true);
  const [urineResult, setUrineResult] = useState("Normal");

  // 9. Vaginal Health
  const [vaginalSymptoms, setVaginalSymptoms] = useState<string[]>(["No discharge problem"]);

  // 10. Medical History
  const [medicalHistory, setMedicalHistory] = useState<string[]>(["No"]);

  // 11. Medicines & Supplements
  const [medicines, setMedicines] = useState<string[]>(["Folic Acid", "Iron Tablets"]);

  // 12. Food & Lifestyle
  const [dietaryHabits, setDietaryHabits] = useState<string[]>(["Healthy balanced food", "Drink enough water"]);
  const [foodProblems, setFoodProblems] = useState<string[]>([]);
  const [lifestyle, setLifestyle] = useState<string[]>(["Walking/exercise regularly", "Sleeping well", "No smoking", "Stress controlled"]);

  // 13. Vaccination
  const [vaccinations, setVaccinations] = useState<string[]>(["Tetanus vaccine"]);

  // 14. Pregnancy Risk Check
  const [highRiskConditions, setHighRiskConditions] = useState<string[]>(["No"]);

  // 15. Doctor Visit
  const [lastDoctorVisit, setLastDoctorVisit] = useState("");
  const [nextDoctorAppointment, setNextDoctorAppointment] = useState("");
  const [doctorAdvised, setDoctorAdvised] = useState<string[]>(["Continue medicines"]);

  // Preload patient info from local store
  useEffect(() => {
    const record = getPatientRecord();
    if (record?.patient) {
      if (record.patient.fullName) setName(record.patient.fullName);
      if (record.patient.age) setAge(record.patient.age);
      if (record.patient.phone) setPhone(record.patient.phone);
      if (record.patient.bloodGroup) setBloodGroup(record.patient.bloodGroup);
      if (record.patient.expectedDueDate) setEdd(record.patient.expectedDueDate);
      setIsFirstPregnancy(record.patient.isFirstPregnancy ?? true);
    }
    // Default dates
    const today = new Date();
    setLastDoctorVisit(today.toISOString().split("T")[0]);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 14);
    setNextDoctorAppointment(nextWeek.toISOString().split("T")[0]);
  }, []);

  const toggleArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, item: string, exclusiveNone?: string) => {
    setter((prev) => {
      if (exclusiveNone && item === exclusiveNone) {
        return [exclusiveNone];
      }
      const filtered = exclusiveNone ? prev.filter((i) => i !== exclusiveNone) : prev;
      if (filtered.includes(item)) {
        const next = filtered.filter((i) => i !== item);
        return next.length === 0 && exclusiveNone ? [exclusiveNone] : next;
      } else {
        return [...filtered, item];
      }
    });
  };

  const playVoice = () => {
    setIsPlaying(true);
    const u = new SpeechSynthesisUtterance(
      "برائے مہربانی اپنا حمل کا فارم پر کریں۔ تمام سوالات کے آسان جوابات دیں۔"
    );
    u.lang = "ur-PK";
    u.onend = () => setIsPlaying(false);
    speechSynthesis.speak(u);
  };

  // Detect emergency red flags
  const hasEmergency =
    warningSigns.some((w) => w !== "None of these") ||
    bpSymptoms.some((s) => s === "Severe headache" || s === "Blurred vision" || s === "Face swelling") ||
    highRiskConditions.some((h) => h === "High BP" || h === "Previous C-section" || h === "Placenta problem");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save snapshot to patient store
    const record = getPatientRecord();
    savePatientData({
      ...record.patient,
      fullName: name || record.patient.fullName,
      age: Number(age) || record.patient.age,
      phone: phone || record.patient.phone,
      bloodGroup: bloodGroup || record.patient.bloodGroup,
    });

    // Save 15-section form submission to central store for Admin inspection
    saveSymptomFormSubmission({
      patientName: name || record.patient.fullName || "Fatima Bibi",
      age: Number(age) || 24,
      phone: phone || "0300-1234567",
      trimester,
      edd,
      bloodGroup,
      isFirstPregnancy,
      prevOutcomes,
      morningSickness,
      generalHealth,
      warningSigns,
      bpSystolic,
      bpDiastolic,
      bpStatus,
      bpSymptoms,
      currentWeight,
      preWeight,
      weightChange,
      ultrasoundDone,
      babyHeartbeat,
      babyGrowth,
      babyMovement,
      placentaStatus,
      hemoglobin,
      bloodSugar,
      infections,
      urineResult,
      vaginalSymptoms,
      medicalHistory,
      medicines,
      dietaryHabits,
      lifestyle,
      vaccinations,
      highRiskConditions,
      lastDoctorVisit,
      nextDoctorAppointment,
      doctorAdvised,
      hasEmergency,
    });

    setIsSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <AppHeader subtitle="Pregnancy Symptom Checker" />

      <main className="flex-1 w-full max-w-lg mx-auto pt-24 pb-32 px-margin-mobile flex flex-col gap-stack-md">
        {/* Banner Header */}
        <div className="rounded-2xl bg-gradient-to-br from-primary-container to-primary-fixed p-inset-md border border-primary/20 flex flex-col gap-3 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-on-primary">
                <Icon name="assignment" className="text-headline-sm" />
              </span>
              <div>
                <h1 className="font-label-lg text-label-lg font-bold text-on-surface">
                  Pregnancy Symptom Checker Form
                </h1>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  حمل کی صحت اور علامات کی مکمل جانچ فارم
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={playVoice}
              className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 font-label-sm text-xs font-bold text-on-primary active:scale-95 transition-transform shrink-0"
            >
              <Icon name={isPlaying ? "graphic_eq" : "volume_up"} className="text-sm" />
              <span>سنیں Play</span>
            </button>
          </div>
          <p className="font-body-sm text-xs text-on-surface leading-snug">
            Fill out this easy 15-section health checker to receive immediate AI Triage analysis and guidance.
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
          {Array.from({ length: 15 }, (_, i) => i + 1).map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => setActiveSection(sec)}
              className={`flex h-8 w-8 items-center justify-center rounded-full font-label-sm text-xs font-bold shrink-0 transition-all ${
                activeSection === sec
                  ? "bg-primary text-on-primary ring-2 ring-primary/40 shadow-xs"
                  : "bg-surface-container-high text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {sec}
            </button>
          ))}
        </div>

        {/* Main Form Container */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-stack-md">
          {/* 1. Basic Information */}
          {activeSection === 1 && (
            <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 p-inset-md flex flex-col gap-3 shadow-xs">
              <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                  1
                </span>
                <h2 className="font-label-lg font-bold text-on-surface">1. Basic Information (بنیادی معلومات)</h2>
              </div>

              <div className="flex flex-col gap-2.5">
                <div>
                  <label className="block font-label-sm font-semibold text-on-surface text-xs mb-1">
                    Name (نام)
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Fatima Bibi"
                    className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-inset-md py-2 font-body-sm text-on-surface"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-label-sm font-semibold text-on-surface text-xs mb-1">
                      Age (عمر - سال)
                    </label>
                    <input
                      type="number"
                      required
                      min={13}
                      max={50}
                      value={age}
                      onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                      className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-inset-sm py-2 font-body-sm text-on-surface"
                    />
                  </div>
                  <div>
                    <label className="block font-label-sm font-semibold text-on-surface text-xs mb-1">
                      Phone (فون نمبر)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="03001234567"
                      className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-inset-sm py-2 font-body-sm text-on-surface"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-label-sm font-semibold text-on-surface text-xs mb-1">
                    Pregnancy Week / Trimester (حمل کا مرحلہ)
                  </label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {[
                      { id: "1-12", label: "1–12 weeks (First trimester / پہلا سہ ماہی)" },
                      { id: "13-27", label: "13–27 weeks (Second trimester / دوسرا سہ ماہی)" },
                      { id: "28+", label: "28+ weeks (Third trimester / تیسرا سہ ماہی)" },
                    ].map((t) => (
                      <label
                        key={t.id}
                        className={`flex items-center gap-2 rounded-xl p-2 border cursor-pointer font-body-sm text-xs ${
                          trimester === t.id
                            ? "border-primary bg-primary/10 font-semibold"
                            : "border-outline-variant/40 bg-surface-container-low"
                        }`}
                      >
                        <input
                          type="radio"
                          name="trimester"
                          checked={trimester === t.id}
                          onChange={() => setTrimester(t.id)}
                          className="accent-primary"
                        />
                        <span>{t.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-label-sm font-semibold text-on-surface text-xs mb-1">
                      Expected Due Date (EDD)
                    </label>
                    <input
                      type="date"
                      value={edd}
                      onChange={(e) => setEdd(e.target.value)}
                      className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-inset-sm py-2 font-body-sm text-on-surface"
                    />
                  </div>
                  <div>
                    <label className="block font-label-sm font-semibold text-on-surface text-xs mb-1">
                      Blood Group (بلڈ گروپ)
                    </label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-inset-sm py-2 font-body-sm text-on-surface"
                    >
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Pregnancy Information */}
          {activeSection === 2 && (
            <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 p-inset-md flex flex-col gap-3 shadow-xs">
              <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                  2
                </span>
                <h2 className="font-label-lg font-bold text-on-surface">2. Pregnancy Information (سابقة معلومات)</h2>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <label className="block font-label-sm font-semibold text-on-surface text-xs mb-1">
                    Is this your first pregnancy? (کیا یہ آپ کا پہلا حمل ہے؟)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsFirstPregnancy(true)}
                      className={`py-2 rounded-xl border font-label-md text-xs font-bold ${
                        isFirstPregnancy
                          ? "bg-primary text-on-primary border-primary"
                          : "bg-surface-container-low border-outline-variant text-on-surface"
                      }`}
                    >
                      Yes (جی ہاں)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsFirstPregnancy(false)}
                      className={`py-2 rounded-xl border font-label-md text-xs font-bold ${
                        !isFirstPregnancy
                          ? "bg-primary text-on-primary border-primary"
                          : "bg-surface-container-low border-outline-variant text-on-surface"
                      }`}
                    >
                      No (جی نہیں)
                    </button>
                  </div>
                </div>

                {!isFirstPregnancy && (
                  <div className="flex flex-col gap-1.5 border-t border-outline-variant/30 pt-2">
                    <label className="block font-label-sm font-semibold text-on-surface text-xs">
                      Previous pregnancy outcome (پچھلے حمل کی صورتحال):
                    </label>
                    {[
                      "Normal delivery (نارمل ولادت)",
                      "Cesarean delivery (سزارین / بڑا آپریشن)",
                      "Miscarriage (حمل ضائع ہونا)",
                      "Baby born early (وقت سے پہلے پیدائش)",
                      "Other problem (دیگر مسئلہ)",
                    ].map((outcome) => (
                      <label
                        key={outcome}
                        className="flex items-center gap-2 rounded-xl p-2 bg-surface-container-low border border-outline-variant/40 cursor-pointer font-body-sm text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={prevOutcomes.includes(outcome)}
                          onChange={() => toggleArrayItem(setPrevOutcomes, outcome)}
                          className="accent-primary rounded"
                        />
                        <span>{outcome}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. Current Pregnancy Problems */}
          {activeSection === 3 && (
            <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 p-inset-md flex flex-col gap-3 shadow-xs">
              <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                  3
                </span>
                <h2 className="font-label-lg font-bold text-on-surface">3. Current Pregnancy Problems (موجودہ مسائل)</h2>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <label className="block font-label-sm font-semibold text-on-surface text-xs mb-1">
                    Morning Sickness (متلی اور قے)
                  </label>
                  <select
                    value={morningSickness}
                    onChange={(e) => setMorningSickness(e.target.value)}
                    className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-inset-sm py-2 font-body-sm text-on-surface"
                  >
                    <option value="No vomiting">No vomiting (قے نہیں ہوتی)</option>
                    <option value="Mild vomiting">Mild vomiting (ہلکی قے)</option>
                    <option value="Severe vomiting">Severe vomiting (شدید قے)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="block font-label-sm font-semibold text-on-surface text-xs">
                    General Health (عمومی صحت)
                  </label>
                  {["Feeling normal", "Feeling very tired", "Dizziness", "Headache", "Fever"].map((gh) => (
                    <label
                      key={gh}
                      className="flex items-center gap-2 rounded-xl p-2 bg-surface-container-low border border-outline-variant/40 cursor-pointer font-body-sm text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={generalHealth.includes(gh)}
                        onChange={() => toggleArrayItem(setGeneralHealth, gh)}
                        className="accent-primary rounded"
                      />
                      <span>{gh}</span>
                    </label>
                  ))}
                </div>

                <div className="flex flex-col gap-1.5 border-t border-outline-variant/30 pt-2">
                  <label className="block font-label-sm font-semibold text-secondary text-xs font-bold">
                    ⚠️ Pregnancy Warning Signs (خطرے کی علامات)
                  </label>
                  {[
                    "Vaginal bleeding (خون آنا)",
                    "Severe stomach pain (شدید پیٹ درد)",
                    "Severe back pain (کمر کا شدید درد)",
                    "Water leakage (پانی کا اخراج)",
                    "Baby movement reduced (بچے کی حرکت کم)",
                    "Sudden swelling of face/hands (چہرے/ہاتھوں کی سوجن)",
                    "None of these",
                  ].map((ws) => (
                    <label
                      key={ws}
                      className={`flex items-center gap-2 rounded-xl p-2 border cursor-pointer font-body-sm text-xs ${
                        warningSigns.includes(ws) && ws !== "None of these"
                          ? "bg-secondary-container/20 border-secondary text-secondary font-bold"
                          : "bg-surface-container-low border-outline-variant/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={warningSigns.includes(ws)}
                        onChange={() => toggleArrayItem(setWarningSigns, ws, "None of these")}
                        className="accent-secondary rounded"
                      />
                      <span>{ws}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. Blood Pressure */}
          {activeSection === 4 && (
            <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 p-inset-md flex flex-col gap-3 shadow-xs">
              <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                  4
                </span>
                <h2 className="font-label-lg font-bold text-on-surface">4. Blood Pressure (بلڈ پریشر)</h2>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <label className="block font-label-sm font-semibold text-on-surface text-xs mb-1">
                    Do you check your blood pressure? (کیا بلڈ پریشر چیک کرتی ہیں؟)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setChecksBp(true)}
                      className={`py-2 rounded-xl border font-label-md text-xs font-bold ${
                        checksBp ? "bg-primary text-on-primary border-primary" : "bg-surface-container-low border-outline-variant"
                      }`}
                    >
                      Yes (جی ہاں)
                    </button>
                    <button
                      type="button"
                      onClick={() => setChecksBp(false)}
                      className={`py-2 rounded-xl border font-label-md text-xs font-bold ${
                        !checksBp ? "bg-primary text-on-primary border-primary" : "bg-surface-container-low border-outline-variant"
                      }`}
                    >
                      No (جی نہیں)
                    </button>
                  </div>
                </div>

                {checksBp && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-label-sm font-semibold text-on-surface text-xs mb-1">
                        Systolic (اوپر والا)
                      </label>
                      <input
                        type="number"
                        value={bpSystolic}
                        onChange={(e) => setBpSystolic(e.target.value)}
                        placeholder="120"
                        className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-inset-sm py-2 font-body-sm text-on-surface"
                      />
                    </div>
                    <div>
                      <label className="block font-label-sm font-semibold text-on-surface text-xs mb-1">
                        Diastolic (نیچے والا)
                      </label>
                      <input
                        type="number"
                        value={bpDiastolic}
                        onChange={(e) => setBpDiastolic(e.target.value)}
                        placeholder="80"
                        className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-inset-sm py-2 font-body-sm text-on-surface"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block font-label-sm font-semibold text-on-surface text-xs mb-1">
                    BP Status (حالت)
                  </label>
                  <select
                    value={bpStatus}
                    onChange={(e) => setBpStatus(e.target.value)}
                    className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-inset-sm py-2 font-body-sm text-on-surface"
                  >
                    <option value="Normal">Normal (نارمل)</option>
                    <option value="High">High (زیادہ / ہائی)</option>
                    <option value="Low">Low (کم / لو)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="block font-label-sm font-semibold text-on-surface text-xs">
                    BP Symptoms:
                  </label>
                  {["Severe headache", "Blurred vision", "Face swelling", "Upper stomach pain", "No problem"].map((s) => (
                    <label
                      key={s}
                      className="flex items-center gap-2 rounded-xl p-2 bg-surface-container-low border border-outline-variant/40 cursor-pointer font-body-sm text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={bpSymptoms.includes(s)}
                        onChange={() => toggleArrayItem(setBpSymptoms, s, "No problem")}
                        className="accent-primary rounded"
                      />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. Weight Check */}
          {activeSection === 5 && (
            <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 p-inset-md flex flex-col gap-3 shadow-xs">
              <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                  5
                </span>
                <h2 className="font-label-lg font-bold text-on-surface">5. Weight Check (وزن کا معائنہ)</h2>
              </div>

              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-label-sm font-semibold text-on-surface text-xs mb-1">
                      Current Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={currentWeight}
                      onChange={(e) => setCurrentWeight(e.target.value)}
                      className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-inset-sm py-2 font-body-sm text-on-surface"
                    />
                  </div>
                  <div>
                    <label className="block font-label-sm font-semibold text-on-surface text-xs mb-1">
                      Before Pregnancy (kg)
                    </label>
                    <input
                      type="number"
                      value={preWeight}
                      onChange={(e) => setPreWeight(e.target.value)}
                      className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-inset-sm py-2 font-body-sm text-on-surface"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-label-sm font-semibold text-on-surface text-xs mb-1">
                    Weight Change Status (وزن میں تبدیلی)
                  </label>
                  <select
                    value={weightChange}
                    onChange={(e) => setWeightChange(e.target.value)}
                    className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-inset-sm py-2 font-body-sm text-on-surface"
                  >
                    <option value="Normal increase">Normal increase (مناسب اضافہ)</option>
                    <option value="Too much increase">Too much increase (بہت زیادہ اضافہ)</option>
                    <option value="Not gaining enough weight">Not gaining enough weight (وزن نہ بڑھنا)</option>
                    <option value="Not sure">Not sure (معلوم نہیں)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 6. Baby Check */}
          {activeSection === 6 && (
            <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 p-inset-md flex flex-col gap-3 shadow-xs">
              <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                  6
                </span>
                <h2 className="font-label-lg font-bold text-on-surface">6. Baby Check (بچے کا الٹراساؤنڈ اور حرکت)</h2>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <label className="block font-label-sm font-semibold text-on-surface text-xs mb-1">
                    Ultrasound Done? (الٹراساؤنڈ ہوا؟)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setUltrasoundDone(true)}
                      className={`py-2 rounded-xl border font-label-md text-xs font-bold ${
                        ultrasoundDone ? "bg-primary text-on-primary border-primary" : "bg-surface-container-low border-outline-variant"
                      }`}
                    >
                      Yes (جی ہاں)
                    </button>
                    <button
                      type="button"
                      onClick={() => setUltrasoundDone(false)}
                      className={`py-2 rounded-xl border font-label-md text-xs font-bold ${
                        !ultrasoundDone ? "bg-primary text-on-primary border-primary" : "bg-surface-container-low border-outline-variant"
                      }`}
                    >
                      No (جی نہیں)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-label-sm font-semibold text-on-surface text-xs mb-1">
                      Baby Heartbeat
                    </label>
                    <select
                      value={babyHeartbeat}
                      onChange={(e) => setBabyHeartbeat(e.target.value)}
                      className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-inset-sm py-2 font-body-sm text-on-surface"
                    >
                      <option value="Normal">Normal (نارمل)</option>
                      <option value="Problem detected">Problem detected (مسئلہ)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-label-sm font-semibold text-on-surface text-xs mb-1">
                      Baby Movement
                    </label>
                    <select
                      value={babyMovement}
                      onChange={(e) => setBabyMovement(e.target.value)}
                      className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-inset-sm py-2 font-body-sm text-on-surface"
                    >
                      <option value="Normal">Normal (نارمل)</option>
                      <option value="Less movement">Less movement (کم)</option>
                      <option value="Not started yet">Not started yet (شروع نہیں)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-label-sm font-semibold text-on-surface text-xs mb-1">
                    Placenta Status (آنول کی صورتحال)
                  </label>
                  <select
                    value={placentaStatus}
                    onChange={(e) => setPlacentaStatus(e.target.value)}
                    className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-inset-sm py-2 font-body-sm text-on-surface"
                  >
                    <option value="Normal">Normal (نارمل)</option>
                    <option value="Low lying placenta">Low lying placenta (آنول نیچے ہے)</option>
                    <option value="Doctor advised monitoring">Doctor advised monitoring (نگرانی کا مشورہ)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 7. Blood Tests */}
          {activeSection === 7 && (
            <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 p-inset-md flex flex-col gap-3 shadow-xs">
              <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                  7
                </span>
                <h2 className="font-label-lg font-bold text-on-surface">7. Blood Tests (خون کے ٹیسٹ)</h2>
              </div>

              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-label-sm font-semibold text-on-surface text-xs mb-1">
                      Hemoglobin (Hb)
                    </label>
                    <select
                      value={hemoglobin}
                      onChange={(e) => setHemoglobin(e.target.value)}
                      className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-inset-sm py-2 font-body-sm text-on-surface"
                    >
                      <option value="Normal">Normal (نارمل)</option>
                      <option value="Low (Anemia)">Low / Anemia (خون کی کمی)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-label-sm font-semibold text-on-surface text-xs mb-1">
                      Blood Sugar
                    </label>
                    <select
                      value={bloodSugar}
                      onChange={(e) => setBloodSugar(e.target.value)}
                      className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-inset-sm py-2 font-body-sm text-on-surface"
                    >
                      <option value="Normal">Normal (نارمل)</option>
                      <option value="High">High (شوگر ہائی)</option>
                      <option value="Not checked">Not checked (چیک نہیں ہوا)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="block font-label-sm font-semibold text-on-surface text-xs">
                    Infection Screening Tests:
                  </label>
                  {["Hepatitis B", "Hepatitis C", "HIV", "Other infections", "Not checked"].map((inf) => (
                    <label
                      key={inf}
                      className="flex items-center gap-2 rounded-xl p-2 bg-surface-container-low border border-outline-variant/40 cursor-pointer font-body-sm text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={infections.includes(inf)}
                        onChange={() => toggleArrayItem(setInfections, inf, "Not checked")}
                        className="accent-primary rounded"
                      />
                      <span>{inf}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 8. Urine Test */}
          {activeSection === 8 && (
            <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 p-inset-md flex flex-col gap-3 shadow-xs">
              <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                  8
                </span>
                <h2 className="font-label-lg font-bold text-on-surface">8. Urine Test (پیشاب کا ٹیسٹ)</h2>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <label className="block font-label-sm font-semibold text-on-surface text-xs mb-1">
                    Urine test done? (ٹیسٹ ہوا؟)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setUrineTestDone(true)}
                      className={`py-2 rounded-xl border font-label-md text-xs font-bold ${
                        urineTestDone ? "bg-primary text-on-primary border-primary" : "bg-surface-container-low border-outline-variant"
                      }`}
                    >
                      Yes (جی ہاں)
                    </button>
                    <button
                      type="button"
                      onClick={() => setUrineTestDone(false)}
                      className={`py-2 rounded-xl border font-label-md text-xs font-bold ${
                        !urineTestDone ? "bg-primary text-on-primary border-primary" : "bg-surface-container-low border-outline-variant"
                      }`}
                    >
                      No (جی نہیں)
                    </button>
                  </div>
                </div>

                {urineTestDone && (
                  <div>
                    <label className="block font-label-sm font-semibold text-on-surface text-xs mb-1">
                      Result (نتیجہ)
                    </label>
                    <select
                      value={urineResult}
                      onChange={(e) => setUrineResult(e.target.value)}
                      className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-inset-sm py-2 font-body-sm text-on-surface"
                    >
                      <option value="Normal">Normal (نارمل)</option>
                      <option value="Infection">Infection (انفیکشن)</option>
                      <option value="Protein found">Protein found (پروٹین پایا گیا - Pre-eclampsia risk)</option>
                      <option value="Sugar found">Sugar found (شوگر)</option>
                      <option value="Don't know">Don&apos;t know (معلوم نہیں)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 9. Vaginal Health */}
          {activeSection === 9 && (
            <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 p-inset-md flex flex-col gap-3 shadow-xs">
              <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                  9
                </span>
                <h2 className="font-label-lg font-bold text-on-surface">9. Vaginal Health (زنانہ صحت)</h2>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="block font-label-sm font-semibold text-on-surface text-xs">
                  Symptoms (علامات):
                </label>
                {[
                  "No discharge problem",
                  "White discharge (سفید رطوبت)",
                  "Bad smell (بدبو)",
                  "Itching (خارش)",
                  "Burning sensation (جلن)",
                  "Pain (درد)",
                ].map((vs) => (
                  <label
                    key={vs}
                    className="flex items-center gap-2 rounded-xl p-2 bg-surface-container-low border border-outline-variant/40 cursor-pointer font-body-sm text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={vaginalSymptoms.includes(vs)}
                      onChange={() => toggleArrayItem(setVaginalSymptoms, vs, "No discharge problem")}
                      className="accent-primary rounded"
                    />
                    <span>{vs}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* 10. Medical History */}
          {activeSection === 10 && (
            <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 p-inset-md flex flex-col gap-3 shadow-xs">
              <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                  10
                </span>
                <h2 className="font-label-lg font-bold text-on-surface">10. Medical History (طبی ہسٹری)</h2>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="block font-label-sm font-semibold text-on-surface text-xs">
                  Existing Health Problems:
                </label>
                {[
                  "No",
                  "Diabetes (ذیابیطس)",
                  "High Blood Pressure (بلڈ پریشر)",
                  "Thyroid problem (تھائرائیڈ)",
                  "PCOS (پی سی او ایس)",
                  "Kidney problem (گردے کا مسئلہ)",
                  "Heart problem (دل کا عارضہ)",
                  "Asthma (دما / سانس)",
                  "Epilepsy (مرگی)",
                  "Previous surgery (سابقہ سرجری)",
                ].map((mh) => (
                  <label
                    key={mh}
                    className="flex items-center gap-2 rounded-xl p-2 bg-surface-container-low border border-outline-variant/40 cursor-pointer font-body-sm text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={medicalHistory.includes(mh)}
                      onChange={() => toggleArrayItem(setMedicalHistory, mh, "No")}
                      className="accent-primary rounded"
                    />
                    <span>{mh}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* 11. Medicines & Supplements */}
          {activeSection === 11 && (
            <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 p-inset-md flex flex-col gap-3 shadow-xs">
              <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                  11
                </span>
                <h2 className="font-label-lg font-bold text-on-surface">11. Medicines & Supplements (ادویات)</h2>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="block font-label-sm font-semibold text-on-surface text-xs">
                  Currently taking:
                </label>
                {[
                  "Folic Acid (فولک ایسڈ)",
                  "Iron Tablets (آئرن کی گولی)",
                  "Calcium Tablets (کیلشیم)",
                  "Vitamin D (وٹامن ڈی)",
                  "Thyroid Medicine",
                  "Blood Pressure Medicine",
                  "Diabetes Medicine",
                  "Other medicine",
                ].map((med) => (
                  <label
                    key={med}
                    className="flex items-center gap-2 rounded-xl p-2 bg-surface-container-low border border-outline-variant/40 cursor-pointer font-body-sm text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={medicines.includes(med)}
                      onChange={() => toggleArrayItem(setMedicines, med)}
                      className="accent-primary rounded"
                    />
                    <span>{med}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* 12. Food & Lifestyle */}
          {activeSection === 12 && (
            <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 p-inset-md flex flex-col gap-3 shadow-xs">
              <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                  12
                </span>
                <h2 className="font-label-lg font-bold text-on-surface">12. Food & Lifestyle (خوراک و لائف سٹائل)</h2>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="block font-label-sm font-semibold text-on-surface text-xs">
                    Dietary Habits:
                  </label>
                  {[
                    "Healthy balanced food",
                    "Fruits daily",
                    "Protein food (Egg/Milk/Dal)",
                    "Drink enough water (8-10 glasses)",
                  ].map((dh) => (
                    <label
                      key={dh}
                      className="flex items-center gap-2 rounded-xl p-2 bg-surface-container-low border border-outline-variant/40 cursor-pointer font-body-sm text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={dietaryHabits.includes(dh)}
                        onChange={() => toggleArrayItem(setDietaryHabits, dh)}
                        className="accent-primary rounded"
                      />
                      <span>{dh}</span>
                    </label>
                  ))}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="block font-label-sm font-semibold text-on-surface text-xs">
                    Lifestyle & Wellbeing:
                  </label>
                  {[
                    "Walking/exercise regularly",
                    "Sleeping well (8+ hours)",
                    "No smoking",
                    "Stress controlled",
                  ].map((ls) => (
                    <label
                      key={ls}
                      className="flex items-center gap-2 rounded-xl p-2 bg-surface-container-low border border-outline-variant/40 cursor-pointer font-body-sm text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={lifestyle.includes(ls)}
                        onChange={() => toggleArrayItem(setLifestyle, ls)}
                        className="accent-primary rounded"
                      />
                      <span>{ls}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 13. Vaccination */}
          {activeSection === 13 && (
            <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 p-inset-md flex flex-col gap-3 shadow-xs">
              <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                  13
                </span>
                <h2 className="font-label-lg font-bold text-on-surface">13. Vaccination (ٹیکے)</h2>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="block font-label-sm font-semibold text-on-surface text-xs">
                  Received Vaccinations:
                </label>
                {[
                  "Tetanus vaccine (ٹٹنس کا ٹیکہ)",
                  "Flu vaccine (فلو ویکسین)",
                  "COVID vaccine",
                  "Not sure (معلوم نہیں)",
                ].map((vac) => (
                  <label
                    key={vac}
                    className="flex items-center gap-2 rounded-xl p-2 bg-surface-container-low border border-outline-variant/40 cursor-pointer font-body-sm text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={vaccinations.includes(vac)}
                      onChange={() => toggleArrayItem(setVaccinations, vac, "Not sure (معلوم نہیں)")}
                      className="accent-primary rounded"
                    />
                    <span>{vac}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* 14. Pregnancy Risk Check */}
          {activeSection === 14 && (
            <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 p-inset-md flex flex-col gap-3 shadow-xs">
              <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                  14
                </span>
                <h2 className="font-label-lg font-bold text-on-surface">14. Pregnancy Risk Check (خطرہ چیک)</h2>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="block font-label-sm font-semibold text-on-surface text-xs">
                  High-risk conditions:
                </label>
                {[
                  "No",
                  "Age above 35 years",
                  "Previous C-section",
                  "Diabetes",
                  "High BP",
                  "Twins pregnancy",
                  "Previous pregnancy problem",
                  "Placenta problem",
                ].map((hr) => (
                  <label
                    key={hr}
                    className="flex items-center gap-2 rounded-xl p-2 bg-surface-container-low border border-outline-variant/40 cursor-pointer font-body-sm text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={highRiskConditions.includes(hr)}
                      onChange={() => toggleArrayItem(setHighRiskConditions, hr, "No")}
                      className="accent-primary rounded"
                    />
                    <span>{hr}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* 15. Doctor Visit */}
          {activeSection === 15 && (
            <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 p-inset-md flex flex-col gap-3 shadow-xs">
              <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                  15
                </span>
                <h2 className="font-label-lg font-bold text-on-surface">15. Doctor Visit & Delivery Plan</h2>
              </div>

              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-label-sm font-semibold text-on-surface text-xs mb-1">
                      Last Visit
                    </label>
                    <input
                      type="date"
                      value={lastDoctorVisit}
                      onChange={(e) => setLastDoctorVisit(e.target.value)}
                      className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-inset-sm py-2 font-body-sm text-on-surface"
                    />
                  </div>
                  <div>
                    <label className="block font-label-sm font-semibold text-on-surface text-xs mb-1">
                      Next Appointment
                    </label>
                    <input
                      type="date"
                      value={nextDoctorAppointment}
                      onChange={(e) => setNextDoctorAppointment(e.target.value)}
                      className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-inset-sm py-2 font-body-sm text-on-surface"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="block font-label-sm font-semibold text-on-surface text-xs">
                    Doctor Advised:
                  </label>
                  {[
                    "Continue medicines",
                    "Repeat tests",
                    "Ultrasound follow-up",
                    "Diet changes",
                    "Delivery planning",
                  ].map((da) => (
                    <label
                      key={da}
                      className="flex items-center gap-2 rounded-xl p-2 bg-surface-container-low border border-outline-variant/40 cursor-pointer font-body-sm text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={doctorAdvised.includes(da)}
                        onChange={() => toggleArrayItem(setDoctorAdvised, da)}
                        className="accent-primary rounded"
                      />
                      <span>{da}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Stepper controls */}
          <div className="flex items-center justify-between gap-2 pt-2">
            {activeSection > 1 ? (
              <button
                type="button"
                onClick={() => setActiveSection((s) => s - 1)}
                className="min-h-touch-min px-inset-md rounded-xl border border-outline-variant text-on-surface font-label-md text-xs font-bold"
              >
                ← Back
              </button>
            ) : <div />}

            {activeSection < 15 ? (
              <button
                type="button"
                onClick={() => setActiveSection((s) => s + 1)}
                className="min-h-touch-min px-inset-md rounded-xl bg-primary text-on-primary font-label-md text-xs font-bold ms-auto"
              >
                Next Section ({activeSection + 1}/15) →
              </button>
            ) : (
              <button
                type="submit"
                className="min-h-touch-min px-inset-md rounded-xl bg-tertiary text-on-tertiary font-label-md text-xs font-bold ms-auto"
              >
                Complete & Submit Form ✅
              </button>
            )}
          </div>
        </form>

        {/* Emergency Alert (AI Sehat Warning Card) */}
        {hasEmergency && (
          <div className="rounded-2xl bg-secondary text-on-secondary p-inset-md flex flex-col gap-2 shadow-md">
            <div className="flex items-center gap-2">
              <Icon name="warning" className="text-headline-sm" />
              <h3 className="font-headline-sm font-bold">Emergency Alert (AI Sehat Warning)</h3>
            </div>
            <p className="font-body-sm text-xs opacity-90 leading-snug">
              Seek medical help immediately at the nearest hospital/BHU if you experience: Heavy bleeding, severe abdominal pain, baby movement drop, water breakage, or sudden face swelling.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href="tel:1122"
                className="min-h-touch-min flex items-center justify-center gap-1 rounded-xl bg-on-secondary text-secondary font-label-md text-xs font-bold"
              >
                <Icon name="call" className="text-sm" />
                Call 1122
              </a>
              <Link
                href="/clinics?emergency=true"
                className="min-h-touch-min flex items-center justify-center gap-1 rounded-xl border border-on-secondary text-on-secondary font-label-md text-xs font-bold"
              >
                <Icon name="local_hospital" className="text-sm" />
                Nearest Hospital
              </Link>
            </div>
          </div>
        )}

        {/* Form Submission Success Modal */}
        {isSubmitted && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-inset-md">
            <div className="w-full max-w-lg bg-surface-container-lowest rounded-3xl p-inset-md flex flex-col gap-stack-md text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-tertiary text-on-tertiary mx-auto">
                <Icon name="check_circle" className="text-headline-lg" />
              </span>
              <h2 className="font-headline-sm font-bold text-on-surface">
                Symptom Form Submitted!
              </h2>
              <p className="font-body-sm text-on-surface-variant">
                آپ کے حمل کا فارم کامیابی سے محفوظ کر لیا گیا ہے۔ ایڈمن پورٹل پر یہ ریکارڈ دیکھا جا سکتا ہے۔
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/admin"
                  className="min-h-touch-min flex items-center justify-center gap-1 rounded-xl bg-primary text-on-primary font-label-md text-xs font-bold"
                >
                  View in Admin Portal
                </Link>
                <Link
                  href="/chat"
                  className="min-h-touch-min flex items-center justify-center gap-1 rounded-xl border border-primary text-primary font-label-md text-xs font-bold"
                >
                  Discuss with AI Doctor
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
