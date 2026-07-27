"use client";

import { useState } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import SectionHeading from "../ui/SectionHeading";
import { theme } from "../ui/theme";
import { useLanguage } from "../../i18n/LanguageContext";

const images: (string | null)[] = ["/image-5.jpeg", "/image-7.jpeg", "/image-2.jpeg", "/image-4.jpeg"];

export default function Gallery() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="gallery" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <SectionHeading
        centered
        eyebrow={t.gallery.eyebrow}
        title={t.gallery.title}
        description={t.gallery.description}
      />

      <Dialog.Root
        open={openIndex !== null}
        onOpenChange={(open) => !open && setOpenIndex(null)}
      >
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {t.gallery.items.map((label, i) => (
            <div
              key={label}
              className={`group relative aspect-[3/4] overflow-hidden rounded-2xl ${theme.gradient.soft} shadow-sm ${theme.shadow.xs}`}
            >
              {images[i] ? (
                <Image
                  src={images[i]}
                  alt={label}
                  fill
                  sizes="(min-width: 640px) 25vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-30 transition-opacity group-hover:opacity-50">
                  <svg viewBox="0 0 24 24" className={`h-10 w-10 ${theme.text.accent}`} fill="none">
                    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
                    <circle cx="9" cy="10.5" r="2" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M3 16L8.5 12L13 15.5L16.5 12.5L21 16" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </div>
              )}

              {images[i] && (
                <Dialog.Trigger asChild>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(i)}
                    aria-label={t.gallery.viewFullScreen}
                    className="absolute inset-0 flex cursor-zoom-in items-center justify-center bg-foreground/0 opacity-0 transition-all group-hover:bg-foreground/20 group-hover:opacity-100 focus-visible:opacity-100"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface/90 text-foreground shadow-lg">
                      <svg viewBox="0 0 20 20" className="h-[18px] w-[18px]" fill="none">
                        <path
                          d="M7.5 3H3v4.5M12.5 3H17v4.5M7.5 17H3v-4.5M12.5 17H17v-4.5"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                </Dialog.Trigger>
              )}

              <span className={`absolute bottom-3 left-3 rtl:left-auto rtl:right-3 rounded-full bg-surface/85 px-3 py-1 text-xs font-medium ${theme.text.accent}`}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/80 backdrop-blur-sm" />
          <Dialog.Content
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpenIndex(null);
            }}
          >
            <Dialog.Title className="sr-only">
              {openIndex !== null ? t.gallery.items[openIndex] : ""}
            </Dialog.Title>
            {openIndex !== null && images[openIndex] && (
              <div className="relative aspect-[3/4] max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl">
                <Image
                  src={images[openIndex]}
                  alt={t.gallery.items[openIndex]}
                  fill
                  sizes="90vw"
                  className="object-contain"
                />
              </div>
            )}
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close"
                className={`absolute right-6 top-6 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-surface/90 ${theme.text.accent} shadow-lg`}
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none">
                  <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
