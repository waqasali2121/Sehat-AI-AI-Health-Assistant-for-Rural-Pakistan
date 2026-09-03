"use client";

import { useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { Icon } from "@/components/icon";

export default function ProfilePage() {
  const [expandedRecord, setExpandedRecord] = useState<string | null>("consultations");
  const [activeLang, setActiveLang] = useState("ur");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [lhwReminders, setLhwReminders] = useState(true);
  const [sehatSync, setSehatSync] = useState(false);

  return (
    <div className="flex flex-col flex-1 bg-surface">
      <AppHeader subtitle="Profile" />

      <main className="flex flex-col gap-6 pb-28 px-4 pt-4">
        {/* Health Identity Card */}
        <section className="rounded-2xl bg-surface-container-low p-5 flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center shrink-0">
              <span className="text-primary font-headline-lg font-bold">FB</span>
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <h2 className="font-headline-md font-bold text-on-surface">Fatima Bibi</h2>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-highest px-2.5 py-0.5 text-label-sm text-on-surface-variant">
                  Age: 26
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-fixed-dim/30 px-2.5 py-0.5 text-label-sm text-primary">
                  <Icon name="favorite" className="text-[14px]" />
                  B+
                </span>
              </div>
            </div>
            <Link href="/register" className="text-label-sm text-primary font-semibold shrink-0">
              Edit
            </Link>
          </div>

          {/* Gestational Progress */}
          <div className="rounded-xl bg-surface-container p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-label-md text-on-surface-variant">Pregnancy Progress</span>
              <span className="text-label-md font-semibold text-primary">Week 24 / 40</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-surface-container-highest overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-fixed-dim to-primary transition-all"
                style={{ width: "60%" }}
              />
            </div>
            <div className="flex items-center justify-between text-label-sm">
              <span className="text-on-surface-variant">2nd Trimester</span>
              <span className="text-on-surface-variant font-medium">60% complete</span>
            </div>
          </div>

          {/* Due Date & Contacts */}
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 rounded-xl bg-surface-container p-3">
              <div className="w-9 h-9 rounded-lg bg-tertiary-container flex items-center justify-center shrink-0">
                <Icon name="event" className="text-tertiary text-[20px]" />
              </div>
              <div className="flex flex-col">
                <span className="text-label-sm text-on-surface-variant">Expected Due Date</span>
                <span className="text-label-md font-semibold text-on-surface">15 March 2027</span>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-surface-container p-3">
              <div className="w-9 h-9 rounded-lg bg-secondary-container flex items-center justify-center shrink-0">
                <Icon name="medical_services" className="text-secondary text-[20px]" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-label-sm text-on-surface-variant">LHW / Lady Health Worker</span>
                <span className="text-label-md font-semibold text-on-surface">Nazia Begum</span>
              </div>
              <a href="tel:+923001234567" className="shrink-0">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                  <Icon name="call" className="text-on-primary text-[18px]" />
                </div>
              </a>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-surface-container p-3">
              <div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0">
                <Icon name="person" className="text-on-surface-variant text-[20px]" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-label-sm text-on-surface-variant">Emergency Contact (Husband)</span>
                <span className="text-label-md font-semibold text-on-surface">Muhammad Ashraf</span>
              </div>
              <a href="tel:+923009876543" className="shrink-0">
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                  <Icon name="call" className="text-on-secondary text-[18px]" />
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Health Records */}
        <section className="flex flex-col gap-3">
          <h3 className="font-headline-sm font-bold text-on-surface px-1">Health Records</h3>

          {/* AI Consultations Accordion */}
          <div className="rounded-2xl bg-surface-container-low overflow-hidden">
            <button
              onClick={() => setExpandedRecord(expandedRecord === "consultations" ? null : "consultations")}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center">
                  <Icon name="chat" className="text-primary text-[20px]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-label-md font-semibold text-on-surface">Past AI Consultations</span>
                  <span className="text-label-sm text-on-surface-variant">12 sessions recorded</span>
                </div>
              </div>
              <Icon
                name="expand_more"
                className={`text-on-surface-variant text-[24px] transition-transform ${expandedRecord === "consultations" ? "rotate-180" : ""}`}
              />
            </button>
            {expandedRecord === "consultations" && (
              <div className="px-4 pb-4 flex flex-col gap-2">
                {[
                  { date: "01 Sep 2026", topic: "Swelling in feet — Mild risk", risk: "LOW" },
                  { date: "25 Aug 2026", topic: "Nutrition guidance — 2nd trimester", risk: "LOW" },
                  { date: "18 Aug 2026", topic: "Headache & vision changes", risk: "MEDIUM" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl bg-surface-container p-3">
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-label-sm font-medium text-on-surface truncate">{item.topic}</span>
                      <span className="text-label-sm text-on-surface-variant">{item.date}</span>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-label-sm font-semibold ${
                        item.risk === "LOW"
                          ? "bg-tertiary-container text-tertiary"
                          : item.risk === "MEDIUM"
                            ? "bg-primary-container text-primary"
                            : "bg-secondary-container text-secondary"
                      }`}
                    >
                      {item.risk}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Clinical Vitals */}
          <div className="rounded-2xl bg-surface-container-low overflow-hidden">
            <button
              onClick={() => setExpandedRecord(expandedRecord === "vitals" ? null : "vitals")}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-secondary-container flex items-center justify-center">
                  <Icon name="monitor_heart" className="text-secondary text-[20px]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-label-md font-semibold text-on-surface">Clinical Vitals Log</span>
                  <span className="text-label-sm text-on-surface-variant">Last updated 2 days ago</span>
                </div>
              </div>
              <Icon
                name="expand_more"
                className={`text-on-surface-variant text-[24px] transition-transform ${expandedRecord === "vitals" ? "rotate-180" : ""}`}
              />
            </button>
            {expandedRecord === "vitals" && (
              <div className="px-4 pb-4 flex flex-col gap-3">
                {/* Blood Pressure */}
                <div className="rounded-xl bg-surface-container p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon name="favorite" className="text-secondary text-[18px]" />
                      <span className="text-label-md font-medium text-on-surface">Blood Pressure</span>
                    </div>
                    <span className="text-label-sm text-on-surface-variant">01 Sep 2026</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="font-headline-sm font-bold text-on-surface">118/78</span>
                      <span className="text-label-sm text-tertiary ml-2">Normal</span>
                    </div>
                    {/* Mini sparkline */}
                    <svg width="80" height="28" viewBox="0 0 80 28" className="text-primary">
                      <polyline
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points="0,20 12,18 24,14 36,16 48,10 60,12 72,8 80,6"
                      />
                    </svg>
                  </div>
                </div>

                {/* Hemoglobin */}
                <div className="rounded-xl bg-surface-container p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon name="bloodtype" className="text-secondary text-[18px]" />
                      <span className="text-label-md font-medium text-on-surface">Hemoglobin</span>
                    </div>
                    <span className="text-label-sm text-on-surface-variant">28 Aug 2026</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="font-headline-sm font-bold text-on-surface">11.2 g/dL</span>
                      <span className="text-label-sm text-primary ml-2">Borderline</span>
                    </div>
                    <svg width="80" height="28" viewBox="0 0 80 28" className="text-tertiary">
                      <polyline
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points="0,8 12,10 24,12 36,11 48,14 60,13 72,15 80,16"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reports */}
          <div className="rounded-2xl bg-surface-container-low overflow-hidden">
            <button
              onClick={() => setExpandedRecord(expandedRecord === "reports" ? null : "reports")}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-tertiary-container flex items-center justify-center">
                  <Icon name="description" className="text-tertiary text-[20px]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-label-md font-semibold text-on-surface">Lab & Ultrasound Reports</span>
                  <span className="text-label-sm text-on-surface-variant">3 reports available</span>
                </div>
              </div>
              <Icon
                name="expand_more"
                className={`text-on-surface-variant text-[24px] transition-transform ${expandedRecord === "reports" ? "rotate-180" : ""}`}
              />
            </button>
            {expandedRecord === "reports" && (
              <div className="px-4 pb-4 flex flex-col gap-2">
                {[
                  { name: "Ultrasound — 20 Week Scan", date: "15 Jul 2026", icon: "ultrasound" },
                  { name: "Complete Blood Count (CBC)", date: "28 Aug 2026", icon: "lab" },
                  { name: "Urine Analysis Report", date: "01 Sep 2026", icon: "lab" },
                ].map((report, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl bg-surface-container p-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0">
                      <Icon name={report.icon === "ultrasound" ? "image" : "science"} className="text-on-surface-variant text-[20px]" />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-label-sm font-medium text-on-surface truncate">{report.name}</span>
                      <span className="text-label-sm text-on-surface-variant">{report.date}</span>
                    </div>
                    <Icon name="download" className="text-primary text-[20px] shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Settings */}
        <section className="flex flex-col gap-3">
          <h3 className="font-headline-sm font-bold text-on-surface px-1">Settings</h3>

          <div className="rounded-2xl bg-surface-container-low flex flex-col divide-y divide-outline-variant/40">
            {/* Language */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="language" className="text-on-surface-variant text-[22px]" />
                <span className="text-label-md font-medium text-on-surface">Language</span>
              </div>
              <div className="flex gap-1.5">
                {[
                  { code: "ur", label: "اردو" },
                  { code: "en", label: "English" },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setActiveLang(lang.code)}
                    className={`rounded-full px-3 py-1 text-label-sm font-medium transition-colors ${
                      activeLang === lang.code
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container text-on-surface-variant"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Assistance */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="record_voice_over" className="text-on-surface-variant text-[22px]" />
                <span className="text-label-md font-medium text-on-surface">Voice Assistance</span>
              </div>
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`w-12 h-7 rounded-full relative transition-colors ${voiceEnabled ? "bg-primary" : "bg-outline-variant"}`}
              >
                <span
                  className={`absolute top-0.5 w-6 h-6 rounded-full bg-on-primary shadow-sm transition-transform ${
                    voiceEnabled ? "translate-x-5.5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            {/* LHW Reminders */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="notifications" className="text-on-surface-variant text-[22px]" />
                <span className="text-label-md font-medium text-on-surface">LHW Reminders</span>
              </div>
              <button
                onClick={() => setLhwReminders(!lhwReminders)}
                className={`w-12 h-7 rounded-full relative transition-colors ${lhwReminders ? "bg-primary" : "bg-outline-variant"}`}
              >
                <span
                  className={`absolute top-0.5 w-6 h-6 rounded-full bg-on-primary shadow-sm transition-transform ${
                    lhwReminders ? "translate-x-5.5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            {/* Sehat Card Sync */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="sync" className="text-on-surface-variant text-[22px]" />
                <div className="flex flex-col">
                  <span className="text-label-md font-medium text-on-surface">Sehat Card Sync</span>
                  <span className="text-label-sm text-on-surface-variant">Sync with Punjab Sehat Card</span>
                </div>
              </div>
              <button
                onClick={() => setSehatSync(!sehatSync)}
                className={`w-12 h-7 rounded-full relative transition-colors ${sehatSync ? "bg-primary" : "bg-outline-variant"}`}
              >
                <span
                  className={`absolute top-0.5 w-6 h-6 rounded-full bg-on-primary shadow-sm transition-transform ${
                    sehatSync ? "translate-x-5.5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="flex flex-col gap-3">
          <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-surface-container py-3.5 text-label-md font-semibold text-on-surface transition-colors active:bg-surface-container-high">
            <Icon name="download" className="text-[20px]" />
            Download Health Card
          </button>
          <Link href="/" className="w-full flex items-center justify-center gap-2 rounded-xl border border-secondary/30 py-3.5 text-label-md font-semibold text-secondary transition-colors active:bg-secondary-container/10">
            <Icon name="logout" className="text-[20px]" />
            Sign Out
          </Link>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
