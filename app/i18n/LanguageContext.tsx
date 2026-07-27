"use client";

import { createContext, useContext, useEffect } from "react";
import { locales, translations, type Locale, type Translations } from "./translations";
import { useStoredState } from "../lib/useStoredState";

const STORAGE_KEY = "wii-security-locale";

function isLocale(value: string): value is Locale {
  return value === "en" || value === "ur";
}

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dir: "ltr" | "rtl";
  t: Translations;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useStoredState(STORAGE_KEY, isLocale, "en");

  const dir = locales.find((l) => l.code === locale)?.dir ?? "ltr";

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, dir, t: translations[locale] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
