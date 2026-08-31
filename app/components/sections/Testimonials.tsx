"use client";

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

export default function Testimonials() {
  const { t } = useLanguage();
  const items = t.testimonials.items;
  const track = [...items, ...items];

  return (
    <section id="testimonials" className="overflow-hidden bg-blush/60 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          centered
          eyebrow={t.testimonials.eyebrow}
          title={t.testimonials.title}
        />
      </div>

      <div className="mt-14 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-marquee gap-6">
          {track.map((item, i) => (
            <Card
              key={`${item.quote}-${i}`}
              radius="2xl"
              padding="p-8"
              className="relative w-[320px] shrink-0 overflow-hidden sm:w-[380px]"
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
          ))}
        </div>
      </div>
    </section>
  );
}
