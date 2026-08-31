"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import Button from "./ui/Button";
import LanguageToggle from "./ui/LanguageToggle";
import ThemeToggle from "./ui/ThemeToggle";
import { theme } from "./ui/theme";
import { useLanguage } from "../i18n/LanguageContext";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  const links = [
    // { href: "/#home", label: t.nav.links.home },
    { href: "/#about", label: t.nav.links.about },
    { href: "/#services", label: t.nav.links.services },
    { href: "/#gallery", label: t.nav.links.gallery },
    { href: "/#how-it-works", label: t.nav.links.howItWorks },
    // { href: "/#cities", label: t.nav.links.cities },
    { href: "/faqs", label: t.nav.links.faqs },
    { href: "/#contact", label: t.nav.links.contact },
  ];

  return (
    <header className={`sticky top-0 z-50 border-b ${theme.border.subtleNav} bg-background/90 backdrop-blur`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/#home" className={`flex items-center ${theme.text.accent}`}>
          <Logo className="h-16 w-16" />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium text-foreground/70 transition-colors ${theme.text.hoverAccent}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <ThemeToggle />
          <LanguageToggle />
          <Button href="/book" size="sm" shadow="sm">
            {t.nav.bookNow}
          </Button>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <LanguageToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle menu"
            className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border ${theme.border.solid} ${theme.text.accent}`}
          >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className={`flex flex-col gap-1 border-t ${theme.border.subtleNav} bg-background px-6 pb-6 pt-2 lg:hidden`}>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-blush ${theme.text.hoverAccent}`}
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2 flex flex-col gap-2">
            <Button href="/get-a-quote" size="sm" variant="secondary" onClick={() => setOpen(false)}>
              {t.hero.getQuote}
            </Button>
            <Button href="/book" size="sm" onClick={() => setOpen(false)}>
              {t.nav.bookNow}
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
