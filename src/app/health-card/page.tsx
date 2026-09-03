"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { BottomNav } from "@/components/bottom-nav";
import {
  getPatientRecord,
  getChatHistory,
  extractConditionsFromChat,
  getRiskLevel,
  type PatientData,
  type ChatRecord,
} from "@/lib/patient-store";

export default function HealthCardPage() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatRecord[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [riskLevel, setRiskLevel] = useState<"LOW" | "MEDIUM" | "HIGH">("LOW");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const record = getPatientRecord();
    setPatient(record.patient);
    const history = getChatHistory();
    setChatHistory(history);
    setConditions(extractConditionsFromChat(history));
    setRiskLevel(getRiskLevel(history));
  }, []);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `Sehat_AI_HealthCard_${patient?.fullName || "Patient"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    }
    setDownloading(false);
  };

  if (!patient) {
    return (
      <div className="flex flex-col min-h-screen bg-surface items-center justify-center">
        <Icon name="hourglass_empty" className="text-primary text-[48px] animate-spin" />
        <p className="mt-4 text-on-surface-variant font-body-md">Loading health record...</p>
      </div>
    );
  }

  const initials = patient.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const riskColor =
    riskLevel === "HIGH" ? "text-red-600" : riskLevel === "MEDIUM" ? "text-amber-600" : "text-green-600";
  const riskBg =
    riskLevel === "HIGH" ? "bg-red-50 border-red-200" : riskLevel === "MEDIUM" ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200";
  const riskBorder =
    riskLevel === "HIGH" ? "border-red-500" : riskLevel === "MEDIUM" ? "border-amber-400" : "border-green-400";

  const trimester =
    patient.gestationalWeek <= 12 ? "1st" : patient.gestationalWeek <= 26 ? "2nd" : "3rd";
  const progress = Math.round((patient.gestationalWeek / 40) * 100);

  const allConditions = [...new Set([...patient.healthConditions, ...conditions])];

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-xl border-b border-outline-variant/40">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/profile" className="flex items-center gap-2 text-on-surface">
            <Icon name="arrow_back" className="text-[22px]" />
            <span className="font-label-lg font-semibold">Back</span>
          </a>
          <h1 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            Health Card
          </h1>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="min-w-touch-min min-h-touch-min px-3 rounded-full bg-primary text-on-primary flex items-center gap-1.5 font-label-sm text-label-sm active:scale-95 transition-transform disabled:opacity-50"
          >
            <Icon name={downloading ? "hourglass_empty" : "download"} className="text-[18px]" />
            <span className="hidden sm:inline">{downloading ? "Saving..." : "Save"}</span>
          </button>
        </div>
      </header>

      <main className="flex-1 pb-24 px-4 pt-4 max-w-lg mx-auto w-full">
        {/* The Card */}
        <div
          ref={cardRef}
          className={`bg-white rounded-2xl overflow-hidden shadow-lg border-t-4 ${riskBorder}`}
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          {/* Card Header */}
          <div className="bg-gradient-to-r from-[#006B5F] to-[#00897B] px-5 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-lg font-bold">{initials || "P"}</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold leading-tight">{patient.fullName || "Patient"}</h2>
                  <p className="text-sm text-white/80">
                    Age: {patient.age || "--"} {patient.bloodGroup ? `| ${patient.bloodGroup}` : ""}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/70">Sehat AI</p>
                <p className="text-xs text-white/70">Health Card</p>
              </div>
            </div>
          </div>

          {/* Pregnancy Status */}
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <span className="text-pink-500">&#9829;</span>
                Pregnancy: Week {patient.gestationalWeek} / 40
              </span>
              <span className="text-xs font-medium text-gray-500">{trimester} Trimester</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#006B5F] to-[#4DB6AC] rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            {patient.expectedDueDate && (
              <p className="text-xs text-gray-500 mt-1.5">
                Due Date: {new Date(patient.expectedDueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            )}
          </div>

          {/* Health Conditions */}
          <div className="px-5 py-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1.5">
              <Icon name="medical_information" className="text-[16px] text-[#006B5F]" />
              Health Conditions
            </h3>
            {allConditions.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {allConditions.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-medium border border-red-100"
                  >
                    {c}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No conditions recorded yet</p>
            )}
          </div>

          {/* Risk Level */}
          <div className={`px-5 py-3 border-b border-gray-100 ${riskBg}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <Icon name="shield" className="text-[16px]" />
                Current Risk Level
              </span>
              <span className={`text-sm font-bold ${riskColor} flex items-center gap-1`}>
                <span className={`w-2.5 h-2.5 rounded-full ${riskLevel === "HIGH" ? "bg-red-500" : riskLevel === "MEDIUM" ? "bg-amber-500" : "bg-green-500"} animate-pulse`} />
                {riskLevel}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Based on {chatHistory.length} AI consultation{chatHistory.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Emergency Contacts */}
          <div className="px-5 py-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1.5">
              <Icon name="emergency" className="text-[16px] text-red-500" />
              Emergency Contacts
            </h3>
            <div className="flex flex-col gap-2">
              {patient.emergencyContactName && (
                <div className="flex items-center justify-between bg-red-50 rounded-lg px-3 py-2">
                  <div>
                    <p className="text-xs text-gray-500">Emergency (Family)</p>
                    <p className="text-sm font-semibold text-gray-800">{patient.emergencyContactName}</p>
                  </div>
                  {patient.emergencyContactPhone && (
                    <p className="text-sm font-mono font-bold text-red-600">{patient.emergencyContactPhone}</p>
                  )}
                </div>
              )}
              {patient.lhwName && (
                <div className="flex items-center justify-between bg-teal-50 rounded-lg px-3 py-2">
                  <div>
                    <p className="text-xs text-gray-500">Lady Health Worker</p>
                    <p className="text-sm font-semibold text-gray-800">{patient.lhwName}</p>
                  </div>
                  {patient.lhwPhone && (
                    <p className="text-sm font-mono font-bold text-[#006B5F]">{patient.lhwPhone}</p>
                  )}
                </div>
              )}
              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                <div>
                  <p className="text-xs text-gray-500">National Emergency</p>
                  <p className="text-sm font-semibold text-gray-800">Rescue 1122</p>
                </div>
                <p className="text-sm font-mono font-bold text-red-600">1122</p>
              </div>
            </div>
          </div>

          {/* Recent Consultations */}
          {chatHistory.length > 0 && (
            <div className="px-5 py-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                <Icon name="chat" className="text-[16px] text-[#006B5F]" />
                Recent Consultations ({chatHistory.length})
              </h3>
              <div className="flex flex-col gap-1.5">
                {chatHistory.slice(-5).reverse().map((chat) => (
                  <div key={chat.id} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 truncate flex-1 mr-2">
                      {chat.userMessage.slice(0, 50)}{chat.userMessage.length > 50 ? "..." : ""}
                    </span>
                    <span className={`shrink-0 px-1.5 py-0.5 rounded font-semibold ${
                      chat.riskFlag === "HIGH" ? "bg-red-100 text-red-700" :
                      chat.riskFlag === "MEDIUM" ? "bg-amber-100 text-amber-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {chat.riskFlag || "LOW"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Card Footer */}
          <div className="px-5 py-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-400">Generated by Sehat AI</p>
                <p className="text-[10px] text-gray-400">
                  {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400">NOT a medical document</p>
                <p className="text-[10px] text-gray-400">For reference only</p>
              </div>
            </div>
            {patient.village && (
              <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                <Icon name="location_on" className="text-[10px]" />
                {patient.village}
              </p>
            )}
          </div>
        </div>

        {/* Download hint */}
        <div className="mt-4 text-center">
          <p className="text-body-sm text-on-surface-variant">
            Tap <strong>Save</strong> to download this card as an image.
          </p>
          <p className="text-body-sm text-on-surface-variant mt-1" dir="rtl">
            کارڈ محفوظ کرنے کے لیے <strong>Save</strong> دبائیں
          </p>
        </div>

        {/* Chat summary stats */}
        <div className="mt-6 rounded-xl bg-surface-container-low p-4 flex flex-col gap-3">
          <h3 className="font-label-lg font-bold text-on-surface flex items-center gap-2">
            <Icon name="analytics" className="text-primary text-[20px]" />
            Health Summary
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-surface-container p-3 text-center">
              <p className="font-headline-sm font-bold text-primary">{chatHistory.length}</p>
              <p className="text-label-sm text-on-surface-variant">Consultations</p>
            </div>
            <div className="rounded-lg bg-surface-container p-3 text-center">
              <p className={`font-headline-sm font-bold ${riskColor}`}>{riskLevel}</p>
              <p className="text-label-sm text-on-surface-variant">Risk Level</p>
            </div>
            <div className="rounded-lg bg-surface-container p-3 text-center">
              <p className="font-headline-sm font-bold text-tertiary">{allConditions.length}</p>
              <p className="text-label-sm text-on-surface-variant">Conditions</p>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
