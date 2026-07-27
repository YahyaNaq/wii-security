"use client";

import { useLanguage } from "../../i18n/LanguageContext";
import { locales } from "../../i18n/translations";
import { cn } from "./cn";
import { theme } from "./theme";

export default function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useLanguage();

  return null;

  return (
    <div
      className={cn(
        `inline-flex items-center gap-1 rounded-full border ${theme.border.solid} p-1`,
        className
      )}
    >
      {locales.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLocale(l.code)}
          aria-pressed={locale === l.code}
          className={cn(
            "cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition-colors",
            locale === l.code
              ? `bg-brand text-white`
              : `${theme.text.accent} hover:bg-blush`
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
