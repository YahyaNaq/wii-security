"use client";

import SectionHeading from "../ui/SectionHeading";
import Card from "../ui/Card";
import IconBadge from "../ui/IconBadge";
import Eyebrow from "../ui/Eyebrow";
import CheckIcon from "../ui/CheckIcon";
import { theme } from "../ui/theme";
import { useLanguage } from "../../i18n/LanguageContext";

const icons = [
  <path
    key="security"
    d="M14 4L23 8V15C23 21 19 25.5 14 27C9 25.5 5 21 5 15V8L14 4Z"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinejoin="round"
  />,
  <g key="phone-pouch">
    <rect x="9" y="4" width="10" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M12 20H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </g>,
  <g key="photography">
    <rect x="3" y="8" width="22" height="15" rx="3" stroke="currentColor" strokeWidth="2" />
    <circle cx="14" cy="15.5" r="4.5" stroke="currentColor" strokeWidth="2" />
    <path d="M10 8L11.5 5H16.5L18 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </g>,
];

export default function Services() {
  const { t } = useLanguage();

  return (
    <section id="services" className="bg-blush/60 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          centered
          eyebrow={t.services.eyebrow}
          title={t.services.title}
        />

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {t.services.items.map((s, i) => (
            <Card key={s.title} hover className="flex flex-col">
              <IconBadge>
                <svg viewBox="0 0 28 28" className="h-7 w-7" fill="none">
                  {icons[i]}
                </svg>
              </IconBadge>
              <Eyebrow className="mt-6">{s.subtitle}</Eyebrow>
              <h3 className="mt-2 font-display text-xl text-foreground">{s.title}</h3>
              {/* Paragraph description hidden for now — bullets shown instead.
              <p className="mt-3 flex-1 text-sm leading-6 text-foreground/65">{s.desc}</p>
              */}
              <ul className="mt-3 flex-1 space-y-2">
                {s.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2 text-sm text-foreground/65">
                    <CheckIcon className={`h-4 w-4 shrink-0 ${theme.text.accent}`} />
                    {bullet}
                  </li>
                ))}
              </ul>
              <a
                href="/get-a-quote"
                className={`mt-6 inline-flex items-center gap-1.5 text-sm font-semibold ${theme.text.accent}`}
              >
                {t.services.learnMore} <span aria-hidden="true">&rarr;</span>
              </a>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
