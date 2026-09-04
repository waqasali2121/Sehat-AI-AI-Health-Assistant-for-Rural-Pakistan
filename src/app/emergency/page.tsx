"use client";

import { useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/header";
import { Icon } from "@/components/icon";

export default function EmergencyPage() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAudio = () => {
    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    const text =
      "Emergency alert has been activated. Your location has been shared. " +
      "Please call 1122 immediately or go to the nearest hospital. " +
      "Your Lady Health Worker has been notified. Help is on the way.";
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.onend = () => setIsPlaying(false);
    speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col flex-1 bg-surface">
      <AppHeader showBack title="Emergency" />

      <main className="flex flex-col gap-5 pb-10 px-4 pt-4">
        {/* Emergency Banner */}
        <div className="rounded-2xl bg-secondary-container overflow-hidden">
          <div className="p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <Icon name="emergency" className="text-on-secondary text-[28px]" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-secondary animate-ping" />
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-secondary" />
              </div>
              <div className="flex flex-col">
                <span className="text-label-sm font-semibold text-secondary uppercase tracking-wider">
                  Emergency Active
                </span>
                <span className="text-label-sm text-on-secondary-container/80">
                  Alert sent at 2:45 PM
                </span>
              </div>
            </div>

            <h1 className="font-headline-md font-bold text-on-secondary-container leading-tight">
              URGENT MEDICAL ATTENTION REQUIRED
            </h1>

            <p className="text-body-sm text-on-secondary-container/90 leading-relaxed">
              Based on your symptoms, immediate medical evaluation is necessary.
              Please follow the actions below right away.
            </p>
          </div>

          {/* Audio Banner */}
          <button
            onClick={handleAudio}
            className="w-full flex items-center gap-3 bg-secondary/10 px-5 py-3"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPlaying ? "bg-secondary" : "bg-secondary/20"}`}>
              <Icon
                name={isPlaying ? "pause" : "volume_up"}
                className={`text-[18px] ${isPlaying ? "text-on-secondary" : "text-secondary"}`}
              />
            </div>
            <span className="text-label-md font-medium text-on-secondary-container">
              {isPlaying ? "Playing audio guide..." : "Tap to hear instructions in Urdu"}
            </span>
          </button>
        </div>

        {/* Red-Flag Symptoms */}
        <section className="rounded-2xl bg-surface-container-low p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Icon name="warning" className="text-secondary text-[22px]" />
            <h2 className="font-headline-sm font-bold text-on-surface">Identified Red-Flag Symptoms</h2>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 rounded-xl bg-secondary-container/20 border border-secondary/20 p-3">
              <div className="w-9 h-9 rounded-lg bg-secondary-container flex items-center justify-center shrink-0">
                <Icon name="bloodtype" className="text-secondary text-[20px]" />
              </div>
              <div className="flex flex-col">
                <span className="text-label-md font-semibold text-on-surface">Severe Bleeding</span>
                <span className="text-label-sm text-on-surface-variant">Heavy bleeding with clots reported</span>
              </div>
              <span className="ml-auto shrink-0 rounded-full bg-secondary px-2 py-0.5 text-label-sm font-bold text-on-secondary">
                CRITICAL
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-secondary-container/20 border border-secondary/20 p-3">
              <div className="w-9 h-9 rounded-lg bg-secondary-container flex items-center justify-center shrink-0">
                <Icon name="pregnant" className="text-secondary text-[20px]" />
              </div>
              <div className="flex flex-col">
                <span className="text-label-md font-semibold text-on-surface">Reduced Fetal Movement</span>
                <span className="text-label-sm text-on-surface-variant">No movement detected for 12+ hours</span>
              </div>
              <span className="ml-auto shrink-0 rounded-full bg-secondary px-2 py-0.5 text-label-sm font-bold text-on-secondary">
                HIGH
              </span>
            </div>
          </div>
        </section>

        {/* GPS Location */}
        <section className="rounded-2xl bg-surface-container-low p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Icon name="my_location" className="text-primary text-[22px]" />
            <h2 className="font-headline-sm font-bold text-on-surface">Your Location</h2>
          </div>

          <div className="rounded-xl bg-surface-container p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center shrink-0">
              <Icon name="location_on" className="text-primary text-[22px]" />
            </div>
            <div className="flex flex-col">
              <span className="text-label-md font-semibold text-on-surface">Chak 42-SB, Sargodha</span>
              <span className="text-label-sm text-on-surface-variant">GPS shared with emergency services</span>
            </div>
            <div className="ml-auto shrink-0">
              <span className="inline-flex items-center gap-1 rounded-full bg-tertiary-container px-2 py-0.5 text-label-sm text-tertiary">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                Shared
              </span>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="flex flex-col gap-3">
          <a
            href="tel:1122"
            className="w-full flex items-center justify-center gap-3 rounded-xl border-2 border-secondary py-4 text-label-lg font-bold text-secondary transition-colors active:bg-secondary-container/10"
          >
            <Icon name="call" className="text-[24px]" />
            Call 1122 — Rescue
          </a>

          <Link
            href="/clinics?emergency=true"
            className="w-full flex items-center justify-center gap-3 rounded-xl bg-primary py-4 text-label-lg font-bold text-on-primary transition-colors active:bg-primary-container"
          >
            <Icon name="local_hospital" className="text-[24px]" />
            Nearest Hospital & Map Route
          </Link>

          <a
            href="tel:+923001234567"
            className="w-full flex items-center justify-center gap-3 rounded-xl bg-surface-container py-4 text-label-lg font-bold text-on-surface transition-colors active:bg-surface-container-high"
          >
            <Icon name="medical_services" className="text-[24px]" />
            Call On-Duty Doctor
          </a>
        </section>

        {/* LHW Contact */}
        <section className="rounded-2xl bg-surface-container-low p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center shrink-0">
            <span className="text-primary font-headline-sm font-bold">NB</span>
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-label-md font-semibold text-on-surface">Nazia Begum — LHW</span>
            <span className="text-label-sm text-on-surface-variant">Your Lady Health Worker notified</span>
          </div>
          <a href="tel:+923001234567" className="shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Icon name="call" className="text-on-primary text-[20px]" />
            </div>
          </a>
        </section>

        {/* Hospital Route Preview */}
        <section className="rounded-2xl bg-surface-container-low overflow-hidden">
          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Icon name="directions" className="text-primary text-[22px]" />
              <h2 className="font-headline-sm font-bold text-on-surface">Fastest Route</h2>
            </div>

            {/* Map placeholder */}
            <div className="w-full h-32 rounded-xl bg-surface-container flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%" viewBox="0 0 300 128">
                  <path d="M0,80 Q50,40 100,70 T200,50 T300,60" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
                  <path d="M0,100 Q80,60 150,90 T300,80" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-outline" />
                  <circle cx="60" cy="70" r="4" className="fill-secondary" />
                  <circle cx="240" cy="55" r="4" className="fill-primary" />
                </svg>
              </div>
              <div className="flex flex-col items-center gap-1 z-10">
                <Icon name="map" className="text-on-surface-variant text-[32px]" />
                <span className="text-label-sm text-on-surface-variant">Map view</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center shrink-0">
                <Icon name="local_hospital" className="text-primary text-[22px]" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-label-md font-semibold text-on-surface">THQ Hospital Kot Momin</span>
                <span className="text-label-sm text-on-surface-variant">Government facility — Emergency ward open</span>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="text-label-md font-bold text-primary">6.8 km</span>
                <span className="text-label-sm text-on-surface-variant">~14 min</span>
              </div>
            </div>
          </div>
        </section>

        {/* Assurance Footnote */}
        <div className="rounded-xl bg-tertiary-container/30 p-4 flex items-start gap-3">
          <Icon name="verified_user" className="text-tertiary text-[22px] shrink-0 mt-0.5" />
          <p className="text-label-sm text-on-surface-variant leading-relaxed">
            Your safety is our priority. Emergency services, your LHW, and your family have been notified.
            Stay calm and follow the instructions above. Help is on the way.
          </p>
        </div>
      </main>
    </div>
  );
}
