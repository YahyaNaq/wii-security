"use client";

import { useState } from "react";
import SectionHeading from "../ui/SectionHeading";
import IconBadge from "../ui/IconBadge";
import Button from "../ui/Button";
import { fieldClasses } from "../ui/fields";
import { theme } from "../ui/theme";
import { cn } from "../ui/cn";
import { useLanguage } from "../../i18n/LanguageContext";

export default function Faqs({ limit }: { limit?: number } = {}) {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(new Set());

  const toggleQuestion = (question: string) => {
    setOpenQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(question)) {
        next.delete(question);
      } else {
        next.add(question);
      }
      return next;
    });
  };

  const items = limit
    ? t.faqs.items.slice(0, limit)
    : t.faqs.items.filter((faq) => faq.q.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <section className={cn("bg-blush/60", limit ? "py-20" : "pb-20 pt-10 lg:pt-14")}>
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <SectionHeading centered constrain={false} eyebrow={t.faqs.eyebrow} title={t.faqs.title} />

        {!limit && (
          <div className="relative mt-10">
            <svg
              viewBox="0 0 20 20"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40 rtl:left-auto rtl:right-4"
              fill="none"
            >
              <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="1.6" />
              <path d="M17 17L13.5 13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.faqs.searchPlaceholder}
              className={cn(fieldClasses(false), "w-full pl-11 rtl:pl-4 rtl:pr-11")}
            />
          </div>
        )}

        <div className={cn("space-y-4", limit ? "mt-12" : "mt-6")}>
          {items.length === 0 && (
            <p className="text-center text-sm text-foreground/50">{t.faqs.noResults}</p>
          )}
          {items.map((faq) => {
            const isOpen = openQuestions.has(faq.q);
            return (
              <div
                key={faq.q}
                className={cn(
                  "rounded-2xl border transition-shadow duration-300",
                  theme.border.subtle,
                  theme.surface,
                  isOpen && `shadow-sm ${theme.shadow.xs}`,
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleQuestion(faq.q)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer list-none items-center justify-between gap-4 p-6 text-left font-display text-base text-foreground"
                >
                  {faq.q}
                  <IconBadge
                    size="h-7 w-7"
                    shape="rounded-full"
                    className={cn("shrink-0 transition-transform duration-300", isOpen && "rotate-45")}
                  >
                    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
                      <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </IconBadge>
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-sm leading-6 text-foreground/65">{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {limit && (
          <div className="mt-8 flex justify-center">
            <Button href="/faqs" variant="secondary" size="sm">
              {t.faqs.viewAll}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
