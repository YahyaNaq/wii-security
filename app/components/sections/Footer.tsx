"use client";

import Logo from "../Logo";
import Eyebrow from "../ui/Eyebrow";
import IconBadge from "../ui/IconBadge";
import { theme } from "../ui/theme";
import { useLanguage } from "../../i18n/LanguageContext";

const companyHrefs = ["/#about", "/#services", "/#how-it-works", "#"];
const legalHrefs = ["/privacy", "/terms"];

const socialHrefs = ["https://www.instagram.com/wiisecurity/"];

const socialIcons = [
  <svg key="instagram" viewBox="0 0 24 24" className="h-4 w-4" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="5.5" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
  </svg>,
  // <svg key="facebook" viewBox="0 0 24 24" className="h-4 w-4" fill="none">
  //   <path
  //     d="M15 8.5H13.4C12.6 8.5 12 9.2 12 10V12.2H15L14.6 15.2H12V21H9V15.2H7V12.2H9V9.7C9 7.4 10.7 5.5 13 5.5H15V8.5Z"
  //     stroke="currentColor"
  //     strokeWidth="1.4"
  //     strokeLinejoin="round"
  //   />
  // </svg>,
];

export default function Footer() {
  const { t } = useLanguage();
  const f = t.footer;

  return (
    <footer id="contact" className={`border-t ${theme.border.subtle} bg-blush/50`}>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo className="h-20 w-20" />
            <p className="mt-4 text-sm leading-6 text-foreground/60">
              {f.tagline}
            </p>
          </div>

          <div>
            <Eyebrow as="h3">{f.companyHeading}</Eyebrow>
            <ul className="mt-4 space-y-2.5 text-sm text-foreground/65">
              {f.companyLinks.map((label, i) => (
                <li key={label}>
                  <a href={companyHrefs[i]} className={theme.text.hoverAccent}>
                    {label}
                    {i === f.companyLinks.length - 1 && (
                      <span className="text-foreground/40"> {f.careersSoon}</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Eyebrow as="h3">{f.legalHeading}</Eyebrow>
            <ul className="mt-4 space-y-2.5 text-sm text-foreground/65">
              {f.legalLinks.map((label, i) => (
                <li key={label}>
                  <a href={legalHrefs[i]} className={theme.text.hoverAccent}>{label}</a>
                </li>
              ))}
            </ul>
            <Eyebrow as="h3" className="mt-6">{f.followHeading}</Eyebrow>
            <ul className="mt-4 flex gap-3">
              {f.social.map((label, i) => (
                <li key={label}>
                  <a
                    href={socialHrefs[i]}
                    aria-label={label}
                    {...(socialHrefs[i].startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <IconBadge
                      size="h-9 w-9"
                      shape="rounded-full"
                      className="transition-colors hover:bg-blush"
                    >
                      {socialIcons[i]}
                    </IconBadge>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Eyebrow as="h3">{f.contactHeading}</Eyebrow>
            <ul className="mt-4 space-y-2.5 text-sm text-foreground/65">
              <li>info@wiisecurity.com</li>
              <li>+92 300 000 0000</li>
              <li>{f.contactCities}</li>
            </ul>
          </div>
        </div>

        <div className={`mt-14 flex flex-col gap-4 border-t ${theme.border.subtle} pt-8 text-xs text-foreground/50 sm:flex-row sm:items-center sm:justify-between`}>
          <p>&copy; {new Date().getFullYear()} {f.copyright}</p>
          <p>{f.designedWithCare}</p>
        </div>
      </div>
    </footer>
  );
}
