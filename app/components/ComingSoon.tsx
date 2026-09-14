"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import { theme } from "./ui/theme";

function getRemaining(target: number) {
  const diff = Math.max(0, target - Date.now());
  return {
    total: diff,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function ComingSoon({ launchAt }: { launchAt: string }) {
  const target = new Date(launchAt).getTime();
  const [remaining, setRemaining] = useState(() => getRemaining(target));

  useEffect(() => {
    const interval = setInterval(() => {
      const next = getRemaining(target);
      setRemaining(next);
      if (next.total <= 0) {
        clearInterval(interval);
        window.location.reload();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [target]);

  const units = [
    { label: "Days", value: remaining.days },
    { label: "Hours", value: remaining.hours },
    { label: "Minutes", value: remaining.minutes },
    { label: "Seconds", value: remaining.seconds },
  ];

  return (
    <div className={`flex min-h-screen flex-col items-center justify-center px-6 text-center ${theme.gradient.soft}`}>
      <Logo className="h-20 w-20" />

      <span className="mt-8 text-xs font-semibold uppercase tracking-widest text-brand-dark">
        Launching Soon
      </span>
      <h1 className="mt-4 font-display text-3xl text-foreground sm:text-4xl">
        We’re putting the finishing touches on our new website.
      </h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-foreground/70">
        WII Security&apos;s site is almost here. Check back after the countdown ends.
      </p>

      <div className="mt-10 flex gap-4 sm:gap-6">
        {units.map((unit) => (
          <div
            key={unit.label}
            className={`flex w-16 flex-col items-center rounded-2xl border ${theme.border.subtle} ${theme.surface} py-4 shadow-sm ${theme.shadow.xs} sm:w-20`}
          >
            <span className="font-display text-2xl text-brand-dark sm:text-3xl">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="mt-1 text-[11px] uppercase tracking-wide text-foreground/60">
              {unit.label}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-12 text-xs text-foreground/50">
        &copy; 2026 WII Security &middot; All Rights Reserved
      </p>
    </div>
  );
}
