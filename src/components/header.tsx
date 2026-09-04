"use client";

import Link from "next/link";
import { SehatLogo } from "./logo";
import { Icon } from "./icon";

interface HeaderProps {
  subtitle?: string;
  showBack?: boolean;
  title?: string;
}

export function AppHeader({ subtitle, showBack = false, title }: HeaderProps) {
  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 px-margin-mobile flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {showBack ? (
            <>
              <button
                aria-label="Go Back"
                onClick={() => window.history.back()}
                className="min-h-touch-min min-w-touch-min flex items-center justify-center text-on-surface hover:text-primary rounded-full transition-colors active:scale-95"
              >
                <Icon name="arrow_back" className="text-headline-md" />
              </button>
              <SehatLogo className="h-7 w-auto" />
              <h1 className="font-headline-sm text-headline-sm text-on-surface truncate">
                {title}
              </h1>
            </>
          ) : (
            <>
              <Link href="/dashboard">
                <SehatLogo className="h-8 w-auto" />
              </Link>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-primary leading-tight">
                  صحت Sehat AI
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium leading-none">
                  {subtitle}
                </span>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Link
            href="/admin"
            title="Admin Login Portal"
            className="min-h-touch-min px-2 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform"
          >
            <Icon name="admin_panel_settings" className="text-sm" />
            <span className="hidden xs:inline">Admin</span>
          </Link>
          <a
            aria-label="Emergency SOS"
            href="tel:1122"
            className="min-h-touch-min min-w-touch-min px-inset-sm rounded-full bg-secondary text-on-secondary flex items-center justify-center gap-1 font-label-sm text-label-sm shadow-[0_4px_12px_rgba(185,5,56,0.25)] active:scale-95 transition-transform"
          >
            <Icon name="sos" className="text-body-lg" />
            <span className="hidden sm:inline font-bold">مدد</span>
          </a>
          <Link href="/profile">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
              <Icon name="person" className="text-body-sm text-on-primary-container" />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
