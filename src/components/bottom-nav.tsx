"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./icon";

const navItems = [
  { path: "/dashboard", icon: "home", label: "Home", urduLabel: "ہوم" },
  { path: "/chat", icon: "smart_toy", label: "Doctor", urduLabel: "ڈاکٹر" },
  { path: "/clinics", icon: "location_on", label: "Clinics/BHU", urduLabel: "کلینک" },
  { path: "/consult", icon: "video_camera_front", label: "Consult", urduLabel: "مشورہ" },
  { path: "/profile", icon: "person", label: "Profile", urduLabel: "پروفائل" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(19,27,46,0.06)]">
      <div className="flex items-center justify-around h-20 px-inset-xs max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center justify-center min-w-touch-min min-h-touch-min gap-0.5 transition-colors hover:text-primary ${
                isActive ? "text-primary font-label-sm" : "text-on-surface-variant"
              }`}
            >
              <Icon name={item.icon} className="text-body-lg" />
              <span className="font-label-sm text-[11px] leading-tight text-center">
                {item.urduLabel}
              </span>
              <span className="font-label-sm text-[10px] leading-tight text-center">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
