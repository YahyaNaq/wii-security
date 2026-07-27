"use client";

import SectionHeading from "../ui/SectionHeading";
import Card from "../ui/Card";
import IconBadge from "../ui/IconBadge";
import { useLanguage } from "../../i18n/LanguageContext";

// Karachi — Quaid's Mausoleum, Lahore — Minar-e-Pakistan, Islamabad — Faisal Mosque
const icons = [
  // Karachi — Mazar-e-Quaid
  <g key="mazar-e-quaid">
    {/* Main mausoleum structure */}
    <path d="M6 21V10H18V21" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>

    {/* Dome */}
    <path d="M8 10C8.4 6.2 9.8 4 12 3C14.2 4 15.6 6.2 16 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>

    {/* Dome finial */}
    <path d="M12 3V2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>

    {/* Entrance */}
    <path d="M9.5 21V16.5C9.5 14.8 10.6 13.5 12 13.5C13.4 13.5 14.5 14.8 14.5 16.5V21" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>

    {/* Side details */}
    <path d="M6 12H4.5M18 12H19.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>

    {/* Ground */}
    <path d="M3 21H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </g>,

  // Lahore — Minar-e-Pakistan
  <g key="minar-e-pakistan">
    {/* Main tapered tower */}
    <path d="M10 21L10.8 9L12 4L13.2 9L14 21" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>

    {/* Top finial */}
    <path d="M12 4V2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>

    {/* Balcony */}
    <path d="M9.8 9H14.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>

    {/* Base */}
    <path d="M8 21V18H16V21" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>

    {/* Base platform */}
    <path d="M6 21H18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>

    {/* Platform layers */}
    <path d="M7 18H17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </g>,

  // Islamabad — Faisal Mosque
  <g key="faisal-mosque">
    {/* Main triangular tent-like roof */}
    <path d="M12 3L18.5 21H5.5L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>

    {/* Central roof detail */}
    <path d="M12 3V21" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>

    {/* Left minaret */}
    <path d="M4 21V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>

    {/* Right minaret */}
    <path d="M20 21V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>

    {/* Minaret tops */}
    <path d="M3 10H5M19 10H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>

    {/* Minaret caps */}
    <path d="M4 10V8.5M20 10V8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>

    {/* Ground */}
    <path d="M3 21H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </g>,
];

export default function Cities() {
  const { t } = useLanguage();

  return (
    <section id="cities" className="bg-blush/60 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          centered
          eyebrow={t.cities.eyebrow}
          title={t.cities.title}
        />

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {t.cities.items.map((city, i) => (
            <Card key={city.name} center>
              <IconBadge size="h-12 w-12" shape="rounded-full" center>
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                  {icons[i]}
                </svg>
              </IconBadge>
              <h3 className="mt-5 font-display text-xl text-foreground">{city.name}</h3>
              <p className="mt-2 text-sm leading-6 text-foreground/65">{city.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
