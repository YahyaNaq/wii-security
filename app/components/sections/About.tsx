"use client";

import Eyebrow from "../ui/Eyebrow";
import Card from "../ui/Card";
import { theme } from "../ui/theme";
import { useLanguage } from "../../i18n/LanguageContext";

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
        <div>
          <Eyebrow>{t.about.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-display text-3xl text-foreground sm:text-4xl">
            {t.about.title}
          </h2>
          <p className="mt-6 text-base leading-8 text-foreground/70">
            {t.about.paragraph}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {t.about.values.map((v) => (
            <Card key={v.title} radius="2xl" padding="p-6">
              <h3 className={`font-display text-lg ${theme.text.accent}`}>{v.title}</h3>
              <p className="mt-2 text-sm leading-6 text-foreground/65">{v.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
