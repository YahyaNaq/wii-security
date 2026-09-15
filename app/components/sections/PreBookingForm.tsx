"use client";

import { useEffect, useRef, useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import Button from "../ui/Button";
import { TextField, RadioGroupField } from "../ui/fields";
import { PhoneField } from "../ui/PhoneField";
import CheckIcon from "../ui/CheckIcon";
import SuccessBadge from "../ui/SuccessBadge";
import ReviewField from "../ui/ReviewField";
import { theme } from "../ui/theme";
import { useLanguage } from "../../i18n/LanguageContext";
import type { Translations } from "../../i18n/translations";
import { isValidPhoneNumber, isPositiveNumber } from "../../lib/validators";
import type { ServiceOption } from "../../lib/pricing";
import { guestTierFor, type GuestTier } from "../../lib/guestTiers";
import { submitQuoteRequest } from "../../(site)/get-a-quote/actions";
import { scrollToField } from "../../lib/scrollToField";
import { pdfBase64ToUrl, openLoadingTab, triggerDownload } from "../../lib/pdf-client";
import { siteFilenames } from "../../lib/filenames";

type BookCtaForm = Translations["bookCta"]["form"];

const MAX_EVENTS = 10;

type ReviewEvent = {
  femaleGuests: string;
  guestService: string;
  photography: boolean;
  photographyTier: string;
  videography: boolean;
  videographyTier: string;
};

type ReviewData = {
  name: string;
  phone: string;
  events: ReviewEvent[];
};

function EventFields({
  form,
  index,
  eventId,
  onRemove,
  removable,
  errors,
  photographyOptions,
  videographyOptions,
  reviewEvent,
}: {
  form: BookCtaForm;
  index: number;
  eventId: number;
  onRemove: () => void;
  removable: boolean;
  errors: Record<string, string>;
  photographyOptions: ServiceOption[];
  videographyOptions: ServiceOption[];
  reviewEvent: ReviewEvent | undefined;
}) {
  const prefix = `events[${index}]`;
  const [guestService, setGuestService] = useState(reviewEvent?.guestService ?? "");
  const needsGuestCount = guestService === "phone-pouches" || guestService === "monitoring";

  return (
    <Accordion.Item
      value={String(eventId)}
      className={`border-b ${theme.border.subtle} sm:overflow-hidden sm:rounded-2xl sm:border`}
    >
      <Accordion.Header className="flex items-center justify-between gap-2 px-1 sm:px-5">
        <Accordion.Trigger className="group flex flex-1 cursor-pointer items-center justify-between gap-2 py-3.5 text-left">
          <span className="flex items-center gap-2">
            <svg
              viewBox="0 0 12 12"
              className={`h-3 w-3 shrink-0 ${theme.text.accent} transition-transform group-data-[state=open]:rotate-90`}
              fill="none"
            >
              <path d="M4 2L8.5 6L4 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-display text-base text-foreground">
              {form.eventLabel} {index + 1}
            </span>
          </span>
        </Accordion.Trigger>
        {removable && (
          <button
            type="button"
            onClick={onRemove}
            className={`cursor-pointer text-xs font-medium text-foreground/50 transition-colors ${theme.text.hoverAccent}`}
          >
            {form.removeEvent}
          </button>
        )}
      </Accordion.Header>
      <Accordion.Content
        forceMount
        className="grid transition-[grid-template-rows] duration-200 ease-out data-[state=closed]:grid-rows-[0fr] data-[state=open]:grid-rows-[1fr]"
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-4 px-1 pb-4 sm:px-5 sm:pb-5">
            <div className="flex flex-col gap-3">
              <div>
                <h5 className="text-sm font-medium text-foreground">{form.servicesGroupHeading}</h5>
                <p className="text-xs text-foreground/50">{form.servicesGroupNote}</p>
              </div>

              <RadioGroupField
                label={form.guestServiceLabel}
                name={`${prefix}[guestService]`}
                options={form.guestServiceOptions}
                defaultValue={reviewEvent?.guestService}
                error={errors[`${prefix}[guestService]`]}
                onChange={setGuestService}
                hideOptionalMark
              />

              {needsGuestCount && (
                <TextField
                  label={form.femaleGuests}
                  type="number"
                  name={`${prefix}[femaleGuests]`}
                  min={0}
                  placeholder={form.femaleGuestsPlaceholder}
                  defaultValue={reviewEvent?.femaleGuests}
                  error={errors[`${prefix}[femaleGuests]`]}
                  required
                />
              )}

              <RadioGroupField
                label={form.photographyTierLabel}
                name={`${prefix}[photographyTier]`}
                options={photographyOptions.map((o) => ({ value: o.slug, label: o.label }))}
                defaultValue={reviewEvent?.photographyTier}
                error={errors[`${prefix}[photographyTier]`]}
                hideOptionalMark
              />

              <RadioGroupField
                label={form.videographyTierLabel}
                name={`${prefix}[videographyTier]`}
                options={videographyOptions.map((o) => ({ value: o.slug, label: o.label }))}
                defaultValue={reviewEvent?.videographyTier}
                error={errors[`${prefix}[videographyTier]`]}
                hideOptionalMark
              />
            </div>
          </div>
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
}

function Review({
  form,
  review,
  data,
  onEdit,
  onConfirm,
  submitting,
  submitError,
  photographyOptions,
  videographyOptions,
}: {
  form: BookCtaForm;
  review: Translations["bookCta"]["review"];
  data: ReviewData;
  onEdit: () => void;
  onConfirm: () => void;
  submitting: boolean;
  submitError: string | null;
  photographyOptions: ServiceOption[];
  videographyOptions: ServiceOption[];
}) {
  const notProvided = review.notProvided;
  const guestServiceLabel = (value: string) =>
    form.guestServiceOptions.find((o) => o.value === value)?.label ?? notProvided;
  const photographyTierLabel = (value: string) =>
    photographyOptions.find((o) => o.slug === value)?.label ?? notProvided;
  const videographyTierLabel = (value: string) =>
    videographyOptions.find((o) => o.slug === value)?.label ?? notProvided;

  return (
    <div className="flex flex-col gap-6">
      <h3 className="font-display text-lg text-foreground">{review.title}</h3>

      <div className={`rounded-2xl border ${theme.border.subtle} p-4 sm:p-5`}>
        <h4 className={`text-xs font-semibold uppercase tracking-widest ${theme.text.accent}`}>
          {review.contactHeading}
        </h4>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          <ReviewField label={form.fullName} value={data.name || notProvided} />
          <ReviewField label={form.phoneNumber} value={data.phone || notProvided} />
        </dl>
      </div>

      {data.events.map((event, i) => (
        <div key={i} className={`rounded-2xl border ${theme.border.subtle} p-4 sm:p-5`}>
          <h4 className={`text-xs font-semibold uppercase tracking-widest ${theme.text.accent}`}>
            {form.eventLabel} {i + 1}
          </h4>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            <ReviewField
              label={form.guestServiceLabel}
              value={event.guestService ? guestServiceLabel(event.guestService) : notProvided}
            />
            {(event.guestService === "phone-pouches" || event.guestService === "monitoring") && (
              <ReviewField label={form.femaleGuests} value={event.femaleGuests || notProvided} />
            )}
            {event.photography && (
              <ReviewField label={form.photographyLabel} value={photographyTierLabel(event.photographyTier)} />
            )}
            {event.videography && (
              <ReviewField label={form.videographyLabel} value={videographyTierLabel(event.videographyTier)} />
            )}
          </dl>
        </div>
      ))}

      {submitError && <p className="text-sm text-red-600">{submitError}</p>}

      <div className="flex gap-3">
        <Button type="button" variant="secondary" size="sm" onClick={onEdit} disabled={submitting}>
          {review.edit}
        </Button>
        <Button type="button" size="compact" onClick={onConfirm} disabled={submitting}>
          {submitting ? review.confirming : review.confirm}
        </Button>
      </div>
    </div>
  );
}

export default function PreBookingForm({
  photographyOptions,
  videographyOptions,
  pouchGuestTiers,
  monitoringGuestTiers,
}: {
  photographyOptions: ServiceOption[];
  videographyOptions: ServiceOption[];
  pouchGuestTiers: GuestTier[];
  monitoringGuestTiers: GuestTier[];
}) {
  const { t } = useLanguage();
  const form = t.bookCta.form;

  const [eventIds, setEventIds] = useState([0]);
  const [openIds, setOpenIds] = useState<string[]>(["0"]);
  const nextId = useRef(1);
  const [step, setStep] = useState<"form" | "review" | "success">("form");
  const stepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    stepRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [quoteId, setQuoteId] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const validate = (fd: FormData) => {
    const nextErrors: Record<string, string> = {};
    const requiredTopLevel = ["name", "phone"];
    for (const key of requiredTopLevel) {
      if (!String(fd.get(key) ?? "").trim()) nextErrors[key] = t.common.requiredError;
    }

    const phone = String(fd.get("phone") ?? "").trim();
    if (phone && !isValidPhoneNumber(phone)) nextErrors.phone = t.common.invalidPhoneError;

    eventIds.forEach((_, i) => {
      const guestService = String(fd.get(`events[${i}][guestService]`) ?? "");
      const needsGuestCount = guestService === "phone-pouches" || guestService === "monitoring";

      if (needsGuestCount) {
        const key = `events[${i}][femaleGuests]`;
        const rawValue = String(fd.get(key) ?? "").trim();
        if (!rawValue) {
          nextErrors[key] = t.common.requiredError;
        } else if (!isPositiveNumber(rawValue)) {
          nextErrors[key] = t.common.invalidNumberError;
        } else {
          const guestTiers = guestService === "phone-pouches" ? pouchGuestTiers : monitoringGuestTiers;
          if (!guestTierFor(guestTiers, Number(rawValue))) {
            nextErrors[key] = t.common.guestCountUnsupportedError;
          }
        }
      }

      const photographyTier = String(fd.get(`events[${i}][photographyTier]`) ?? "");
      const videographyTier = String(fd.get(`events[${i}][videographyTier]`) ?? "");
      if (!needsGuestCount && !photographyTier && !videographyTier) {
        nextErrors[`events[${i}][guestService]`] = form.atLeastOneServiceError;
      }
    });
    return nextErrors;
  };

  const addEvent = () => {
    if (eventIds.length >= MAX_EVENTS) return;
    const id = nextId.current++;
    setEventIds((prev) => [...prev, id]);
    setOpenIds((prev) => [...prev, String(id)]);
  };
  const removeEvent = (id: number) => {
    setEventIds((prev) => (prev.length > 1 ? prev.filter((eventId) => eventId !== id) : prev));
    setOpenIds((prev) => prev.filter((openId) => openId !== String(id)));
  };

  const clearError = (key: string) => {
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    const name = (e.target as unknown as HTMLInputElement).name;
    if (name) clearError(name);
  };

  const focusFirstError = (errorKeys: string[]) => {
    const firstKey = errorKeys[0];
    if (!firstKey) return;
    const eventMatch = firstKey.match(/^events\[(\d+)\]/);
    if (eventMatch) {
      const id = eventIds[Number(eventMatch[1])];
      if (id !== undefined) {
        setOpenIds((prev) => (prev.includes(String(id)) ? prev : [...prev, String(id)]));
      }
      // Wait for the accordion's grid-rows expand transition (200ms) before scrolling.
      setTimeout(() => scrollToField(firstKey), 260);
    } else {
      requestAnimationFrame(() => scrollToField(firstKey));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const validationErrors = validate(fd);
    setErrors(validationErrors);
    const errorKeys = Object.keys(validationErrors);
    if (errorKeys.length > 0) {
      focusFirstError(errorKeys);
      return;
    }

    setPendingFormData(fd);
    setReviewData({
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      events: eventIds.map((id, i) => {
        const photographyTier = String(fd.get(`events[${i}][photographyTier]`) ?? "");
        const videographyTier = String(fd.get(`events[${i}][videographyTier]`) ?? "");
        return {
          femaleGuests: String(fd.get(`events[${i}][femaleGuests]`) ?? ""),
          guestService: String(fd.get(`events[${i}][guestService]`) ?? ""),
          photography: !!photographyTier,
          photographyTier,
          videography: !!videographyTier,
          videographyTier,
        };
      }),
    });
    setSubmitError(null);
    setStep("review");
  };

  const handleConfirm = async () => {
    if (!pendingFormData) return;
    setSubmitting(true);
    setSubmitError(null);
    const pdfTab = openLoadingTab("Preparing your quote…");
    try {
      pendingFormData.set("eventCount", String(eventIds.length));
      const result = await submitQuoteRequest(pendingFormData);
      if (result.success) {
        const url = pdfBase64ToUrl(result.pdfBase64);
        setPdfUrl(url);
        setQuoteId(result.quoteId);
        // If the tab is missing or was closed while we waited, don't retry opening one —
        // a window.open() this far from the click is reliably popup-blocked. The success
        // screen's fallback download link covers that case instead.
        if (pdfTab && !pdfTab.closed) {
          pdfTab.location.href = url;
        }
        triggerDownload(url, siteFilenames.quotePdf(result.quoteId));
        setStep("success");
      } else {
        if (pdfTab && !pdfTab.closed) pdfTab.close();
        if (result.fieldErrors) {
          setErrors(result.fieldErrors);
          setStep("form");
          focusFirstError(Object.keys(result.fieldErrors));
          return;
        }
        setSubmitError(result.error);
      }
    } catch {
      if (pdfTab && !pdfTab.closed) pdfTab.close();
      setSubmitError(t.bookCta.review.submitError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl pt-12 pb-24 lg:px-8">
      <div className={`grid ${theme.cardDesktop} lg:grid-cols-2`}>
        <div className={`${theme.gradient.brand} p-6 text-white sm:p-10 lg:p-14`}>
          <span className="text-xs font-semibold uppercase tracking-widest text-white/70">
            {t.bookCta.eyebrow}
          </span>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl">
            {t.bookCta.title}
          </h2>
          <p className="mt-4 text-sm leading-6 text-white/80">
            {t.bookCta.description}
          </p>
          <ul className="mt-8 space-y-3">
            {t.bookCta.perks.map((perk) => (
              <li key={perk} className="flex items-start gap-3 text-sm text-white/90">
                <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <div ref={stepRef} className={`flex flex-col gap-4 scroll-mt-24 ${theme.surface} p-6 sm:p-10 lg:p-14`}>
          {step === "success" ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <SuccessBadge />
              <h3 className="font-display text-xl text-foreground">{t.bookCta.success.title}</h3>
              <p className="max-w-sm text-sm leading-6 text-foreground/65">{t.bookCta.success.message}</p>
              {pdfUrl && (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={quoteId ? siteFilenames.quotePdf(quoteId) : "quote.pdf"}
                  className={`text-sm font-medium underline ${theme.text.accent}`}
                >
                  {t.bookCta.success.downloadPdf}
                </a>
              )}
            </div>
          ) : step === "review" && reviewData ? (
            <Review
              form={form}
              review={t.bookCta.review}
              data={reviewData}
              onEdit={() => setStep("form")}
              onConfirm={handleConfirm}
              submitting={submitting}
              submitError={submitError}
              photographyOptions={photographyOptions}
              videographyOptions={videographyOptions}
            />
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit} onChange={handleFieldChange} noValidate>
              {Object.keys(errors).length > 0 && (
                <button
                  type="button"
                  onClick={() => focusFirstError(Object.keys(errors))}
                  className="rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-left text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400"
                >
                  {t.common.formHasErrors}
                </button>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label={form.fullName} type="text" name="name" placeholder={form.fullNamePlaceholder} defaultValue={reviewData?.name} error={errors.name} required />
                <PhoneField
                  label={form.phoneNumber}
                  name="phone"
                  codes={form.phoneCodes}
                  defaultValue={reviewData?.phone}
                  error={errors.phone}
                  onChange={() => clearError("phone")}
                  required
                />
              </div>

              <Accordion.Root
                type="multiple"
                value={openIds}
                onValueChange={setOpenIds}
                className="mt-2 flex flex-col sm:gap-3"
              >
                {eventIds.map((id, i) => (
                  <EventFields
                    key={id}
                    form={form}
                    index={i}
                    eventId={id}
                    onRemove={() => removeEvent(id)}
                    removable={eventIds.length > 1}
                    errors={errors}
                    photographyOptions={photographyOptions}
                    videographyOptions={videographyOptions}
                    reviewEvent={reviewData?.events[i]}
                  />
                ))}
              </Accordion.Root>

              {eventIds.length < MAX_EVENTS && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={addEvent}
                  className="self-start"
                >
                  + {form.addEvent}
                </Button>
              )}

              <Button type="submit" size="compact" className="mt-2">
                {form.submit}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
