"use client";

import { useRef, useState } from "react";
import SectionHeading from "../ui/SectionHeading";
import Card from "../ui/Card";
import { theme } from "../ui/theme";
import { useLanguage } from "../../i18n/LanguageContext";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function TestimonialCard({
  item,
  prominent,
}: {
  item: { quote: string; name: string; location: string };
  prominent: boolean;
}) {
  return (
    <Card
      radius="2xl"
      padding="p-8"
      className={`relative h-full w-full overflow-hidden transition-all duration-300 ${
        prominent ? "shadow-md scale-100" : "opacity-60 scale-95"
      }`}
    >
      <svg
        viewBox="0 0 32 32"
        className={`absolute -right-2 -top-2 h-20 w-20 opacity-[0.08] ${theme.text.accent}`}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M10 6C5.6 8.4 3 12.2 3 16.6C3 20 5.2 22.4 8.2 22.4C10.8 22.4 12.8 20.4 12.8 17.8C12.8 15.4 11.2 13.6 8.8 13.4C9.4 10.8 11.4 8.6 14 7.2L10 6ZM24.2 6C19.8 8.4 17.2 12.2 17.2 16.6C17.2 20 19.4 22.4 22.4 22.4C25 22.4 27 20.4 27 17.8C27 15.4 25.4 13.6 23 13.4C23.6 10.8 25.6 8.6 28.2 7.2L24.2 6Z" />
      </svg>

      <p className="relative text-sm leading-7 text-foreground/75">
        &ldquo;{item.quote}&rdquo;
      </p>

      <div className="relative mt-6 flex items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-light/70 text-xs font-semibold ${theme.text.accent}`}
        >
          {initials(item.name)}
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">{item.name}</p>
          <p className="text-xs text-foreground/55">{item.location}</p>
        </div>
      </div>
    </Card>
  );
}

export default function Testimonials() {
  const { t } = useLanguage();
  const items = t.testimonials.items;
  const count = items.length;
  const [index, setIndex] = useState(0);

  const go = (direction: 1 | -1) =>
    setIndex((i) => (i + direction + count) % count);

  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const swipeThreshold = 40;
    if (deltaX > swipeThreshold) go(-1);
    else if (deltaX < -swipeThreshold) go(1);
    touchStartX.current = null;
  };

  const prevItem = items[(index - 1 + count) % count];
  const current = items[index];
  const nextItem = items[(index + 1) % count];

  return (
    <section id="testimonials" className="bg-blush/60 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          centered
          eyebrow={t.testimonials.eyebrow}
          title={t.testimonials.title}
        />

        <div className="mt-14 flex items-center justify-center gap-3 sm:gap-6">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${theme.border.subtle} ${theme.surface} ${theme.text.accent} shadow-sm transition hover:bg-brand-light/40`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div
            className="grid w-full max-w-4xl touch-pan-y grid-cols-1 items-center gap-6 lg:grid-cols-3"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="hidden lg:block">
              <TestimonialCard item={prevItem} prominent={false} />
            </div>
            <div>
              <TestimonialCard item={current} prominent />
            </div>
            <div className="hidden lg:block">
              <TestimonialCard item={nextItem} prominent={false} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${theme.border.subtle} ${theme.surface} ${theme.text.accent} shadow-sm transition hover:bg-brand-light/40`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {items.map((item, i) => (
            <button
              key={item.name + i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-brand-dark" : "w-2 bg-brand-dark/25"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
