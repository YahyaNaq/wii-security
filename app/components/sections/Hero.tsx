"use client";

import Image from "next/image";
import Button from "../ui/Button";
import CountUp from "../ui/CountUp";
import { theme } from "../ui/theme";
import { useLanguage } from "../../i18n/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blush via-background to-background" />
      <div
        className="absolute -right-24 -top-24 -z-10 h-96 w-96 rounded-full bg-brand-light/60 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -left-32 top-40 -z-10 h-80 w-80 rounded-full bg-blush blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28 lg:px-8">
        <div>
          <span className={`inline-flex items-center rounded-full border ${theme.border.solid} bg-surface/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest ${theme.text.accent}`}>
            {t.hero.badge}
          </span>
          <h1 className="mt-6 font-display text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
            {t.hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-foreground/70">
            {t.hero.description}
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Button href="/book" shadow="md">
              {t.hero.bookNow}
            </Button>
            <Button href="/get-a-quote" variant="secondary">
              {t.hero.getQuote}
            </Button>
          </div>
          <dl className={`mt-14 grid grid-cols-3 gap-6 ${theme.divider} pt-8`}>
            {t.hero.stats.map((stat, i) => (
              <div key={stat.label}>
                <dt className={`font-display text-3xl ${theme.text.accent}`}>
                  {i === t.hero.stats.length - 1 ? (
                    <CountUp value={stat.value} />
                  ) : (
                    stat.value
                  )}
                </dt>
                <dd className="mt-1 text-xs font-medium uppercase tracking-wide text-foreground/60">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className={`relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2.5rem] ${theme.gradient.soft} shadow-xl ${theme.shadow.sm}`}>
            <Image
              src="/front-image.jpeg"
              alt={t.hero.title}
              fill
              sizes="(min-width: 1024px) 28rem, 90vw"
              className="object-cover brightness-130 contrast-105"
              priority
            />
          </div>
          <div className={`absolute -bottom-6 -left-6 rounded-2xl border ${theme.border.solid} ${theme.surface} px-5 py-4 shadow-lg ${theme.shadow.sm} sm:left-auto sm:-right-6`}>
            <p className={`font-display text-sm ${theme.text.accent}`}>&ldquo;{t.hero.testimonialQuote}&rdquo;</p>
            <p className="mt-1 text-xs text-foreground/50">{t.hero.testimonialAuthor}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
