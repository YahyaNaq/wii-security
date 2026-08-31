"use client";

import SectionHeading from "../ui/SectionHeading";
import ArrowLink from "../ui/ArrowLink";
import { useLanguage } from "../../i18n/LanguageContext";

export default function HowItWorks() {
  const { t } = useLanguage();
  const steps = t.howItWorks.steps;

  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <SectionHeading
        centered
        eyebrow={t.howItWorks.eyebrow}
        title={t.howItWorks.title}
      />

      <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((step, i) => (
          <div key={step.n} className="relative flex h-full flex-col">
            <span className="font-display text-5xl text-brand">{step.n}</span>
            <h3 className="mt-3 font-display text-lg text-foreground">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-foreground/65">{step.desc}</p>
            {i === 0 && (
              <ArrowLink href="/get-a-quote" className="mt-auto pt-4">
                {t.hero.getQuote}
              </ArrowLink>
            )}
            {i === 2 && (
              <ArrowLink href="/book" className="mt-auto pt-4">
                {t.hero.bookNow}
              </ArrowLink>
            )}
            {i < steps.length - 1 && (
              <span
                className="absolute right-0 top-6 hidden h-px w-1/3 translate-x-1/2 bg-brand-light lg:block rtl:right-auto rtl:left-0 rtl:-translate-x-1/2"
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
