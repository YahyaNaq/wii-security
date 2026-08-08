"use client";

import { useEffect, useRef, useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { TextField, RadioGroupField, FileField } from "../ui/fields";
import { SelectField } from "../ui/Select";
import { PhoneField } from "../ui/PhoneField";
import Button from "../ui/Button";
import CheckIcon from "../ui/CheckIcon";
import SuccessBadge from "../ui/SuccessBadge";
import ReviewField from "../ui/ReviewField";
import { theme } from "../ui/theme";
import { useLanguage } from "../../i18n/LanguageContext";
import { isValidPhoneNumber, isPositiveNumber } from "../../lib/validators";
import type { Translations } from "../../i18n/translations";
import { formatPkr } from "../../lib/format";
import { submitBooking } from "../../(site)/book/actions";

type BookingForm = Translations["booking"]["form"];

const EVENT_FIELDS = ["city", "reportingTime", "venue", "eventType", "femaleGuests", "package"];
const TOP_LEVEL_REQUIRED = ["name", "phone", "totalAmount"];
const MAX_EVENTS = 10;

function formatTime12h(time: string) {
  const [hoursStr, minutes] = time.split(":");
  const hours = Number(hoursStr);
  if (Number.isNaN(hours) || minutes === undefined) return time;
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes} ${period}`;
}

type ReviewEvent = {
  city: string;
  reportingTime: string;
  venue: string;
  eventType: string;
  eventTypeOther: string;
  femaleGuests: string;
  packageValue: string;
};

type ReviewData = {
  name: string;
  phone: string;
  totalAmount: string;
  receiptFileName: string;
  agreeToTerms: boolean;
  events: ReviewEvent[];
};

function EventFields({
  form,
  index,
  eventId,
  onRemove,
  removable,
  errors,
  city,
  onCityChange,
}: {
  form: BookingForm;
  index: number;
  eventId: number;
  onRemove: () => void;
  removable: boolean;
  errors: Record<string, string>;
  city: string;
  onCityChange: (city: string) => void;
}) {
  const prefix = `events[${index}]`;
  const [venue, setVenue] = useState("");
  const [reportingTime, setReportingTime] = useState("");
  const summary = [city || null, venue || null, reportingTime ? formatTime12h(reportingTime) : null]
    .filter(Boolean)
    .join(" · ");

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
          {summary && (
            <span className="hidden text-xs font-normal text-foreground/45 group-data-[state=closed]:inline">
              {summary}
            </span>
          )}
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
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label={form.city}
                name={`${prefix}[city]`}
                options={form.cityOptions}
                placeholder={form.citySelectPlaceholder}
                value={city}
                onValueChange={onCityChange}
                error={errors[`${prefix}[city]`]}
                required
              />
              <TextField
                label={form.reportingTime}
                type="time"
                name={`${prefix}[reportingTime]`}
                value={reportingTime}
                onChange={(e) => setReportingTime(e.target.value)}
                error={errors[`${prefix}[reportingTime]`]}
                required
              />
            </div>
            <TextField
              label={form.venue}
              type="text"
              name={`${prefix}[venue]`}
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              error={errors[`${prefix}[venue]`]}
              required
            />

            <RadioGroupField
              label={form.eventType}
              name={`${prefix}[eventType]`}
              options={form.eventTypeOptions}
              otherOption={form.otherOptionValue}
              otherFieldName={`${prefix}[eventTypeOther]`}
              otherFieldPlaceholder={form.otherPlaceholder}
              error={errors[`${prefix}[eventType]`]}
              required
            />

            <TextField
              label={form.femaleGuests}
              type="number"
              name={`${prefix}[femaleGuests]`}
              min={0}
              error={errors[`${prefix}[femaleGuests]`]}
              required
            />

            <RadioGroupField
              label={form.packageLabel}
              name={`${prefix}[package]`}
              options={form.packageOptions}
              error={errors[`${prefix}[package]`]}
              required
            />
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
}: {
  form: BookingForm;
  review: Translations["booking"]["review"];
  data: ReviewData;
  onEdit: () => void;
  onConfirm: () => void;
  submitting: boolean;
  submitError: string | null;
}) {
  const notProvided = review.notProvided;

  return (
    <div className="flex flex-col gap-6">
      <h3 className="font-display text-lg text-foreground">{review.title}</h3>

      <div className={`rounded-2xl border ${theme.border.subtle} p-4 sm:p-5`}>
        <dl className="grid gap-3 sm:grid-cols-2">
          <ReviewField label={form.fullName} value={data.name || notProvided} />
          <ReviewField label={form.contactNumber} value={data.phone || notProvided} />
          <ReviewField
            label={form.totalAmount}
            value={data.totalAmount ? formatPkr(Number(data.totalAmount)) : notProvided}
          />
          <ReviewField label={form.receiptLabel} value={data.receiptFileName || notProvided} />
          <ReviewField
            label={form.termsLinkLabel}
            value={data.agreeToTerms ? review.termsAgreed : review.termsNotAgreed}
          />
        </dl>
      </div>

      {data.events.map((event, i) => (
        <div key={i} className={`rounded-2xl border ${theme.border.subtle} p-4 sm:p-5`}>
          <h4 className={`text-xs font-semibold uppercase tracking-widest ${theme.text.accent}`}>
            {form.eventLabel} {i + 1}
          </h4>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            <ReviewField label={form.city} value={event.city || notProvided} />
            <ReviewField label={form.reportingTime} value={event.reportingTime || notProvided} />
            <ReviewField label={form.venue} value={event.venue || notProvided} />
            <ReviewField
              label={form.eventType}
              value={
                event.eventType === form.otherOptionValue && event.eventTypeOther
                  ? `${event.eventType} — ${event.eventTypeOther}`
                  : event.eventType || notProvided
              }
            />
            <ReviewField label={form.femaleGuests} value={event.femaleGuests || notProvided} />
            <ReviewField label={form.packageLabel} value={event.packageValue || notProvided} />
          </dl>
        </div>
      ))}

      {submitError && <p className="text-sm text-red-600">{submitError}</p>}

      <div className="flex gap-3">
        <Button type="button" variant="secondary" size="sm" onClick={onEdit} disabled={submitting}>
          {review.edit}
        </Button>
        <Button type="button" size="compact" onClick={onConfirm} disabled={submitting}>
          {submitting ? review.submitting : review.confirm}
        </Button>
      </div>
    </div>
  );
}

export default function BookingForm() {
  const { t } = useLanguage();
  const form = t.booking.form;

  const [eventIds, setEventIds] = useState([0]);
  const [openIds, setOpenIds] = useState<string[]>(["0"]);
  const nextId = useRef(1);
  const [step, setStep] = useState<"form" | "review" | "success">("form");
  const stepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    stepRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [totalAmount, setTotalAmount] = useState("");
  const [city, setCity] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const pendingFormData = useRef<FormData | null>(null);

  const dueNow = totalAmount && !Number.isNaN(Number(totalAmount))
    ? formatPkr(Math.round(Number(totalAmount) * 0.5))
    : null;

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

  const validate = (fd: FormData) => {
    const nextErrors: Record<string, string> = {};
    for (const key of TOP_LEVEL_REQUIRED) {
      const rawValue = String(fd.get(key) ?? "").trim();
      if (!rawValue) {
        nextErrors[key] = t.common.requiredError;
      } else if (key === "totalAmount" && !isPositiveNumber(rawValue)) {
        nextErrors[key] = t.common.invalidNumberError;
      }
    }

    const phone = String(fd.get("phone") ?? "").trim();
    if (phone && !isValidPhoneNumber(phone)) nextErrors.phone = t.common.invalidPhoneError;

    eventIds.forEach((_, i) => {
      for (const field of EVENT_FIELDS) {
        const key = `events[${i}][${field}]`;
        const rawValue = String(fd.get(key) ?? "").trim();
        if (!rawValue) {
          nextErrors[key] = t.common.requiredError;
        } else if (field === "femaleGuests" && !isPositiveNumber(rawValue)) {
          nextErrors[key] = t.common.invalidNumberError;
        }
      }
    });

    const receipt = fd.get("receipt");
    if (!(receipt instanceof File) || receipt.size === 0) {
      nextErrors.receipt = t.common.requiredError;
    }
    if (!fd.get("agreeToTerms")) {
      nextErrors.agreeToTerms = t.common.requiredError;
    }
    return nextErrors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const validationErrors = validate(fd);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    pendingFormData.current = fd;
    setSubmitError(null);

    const receipt = fd.get("receipt");
    setReviewData({
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      totalAmount: String(fd.get("totalAmount") ?? ""),
      receiptFileName: receipt instanceof File ? receipt.name : "",
      agreeToTerms: !!fd.get("agreeToTerms"),
      events: eventIds.map((_, i) => ({
        city: String(fd.get(`events[${i}][city]`) ?? ""),
        reportingTime: String(fd.get(`events[${i}][reportingTime]`) ?? ""),
        venue: String(fd.get(`events[${i}][venue]`) ?? ""),
        eventType: String(fd.get(`events[${i}][eventType]`) ?? ""),
        eventTypeOther: String(fd.get(`events[${i}][eventTypeOther]`) ?? ""),
        femaleGuests: String(fd.get(`events[${i}][femaleGuests]`) ?? ""),
        packageValue: String(fd.get(`events[${i}][package]`) ?? ""),
      })),
    });
    setStep("review");
  };

  const handleConfirm = async () => {
    if (!pendingFormData.current || submitting) return;
    setSubmitting(true);
    setSubmitError(null);

    const result = await submitBooking(pendingFormData.current);

    setSubmitting(false);
    if (result.success) {
      pendingFormData.current = null;
      setStep("success");
      return;
    }

    if (result.fieldErrors) setErrors(result.fieldErrors);
    setSubmitError(result.error);
  };

  return (
    <section className="mx-auto max-w-7xl pt-12 pb-24 lg:px-8">
      <div className={`grid ${theme.cardDesktop} lg:grid-cols-2`}>
        <div className={`${theme.gradient.brand} p-6 text-white sm:p-10 lg:p-14`}>
          <span className="text-xs font-semibold uppercase tracking-widest text-white/70">
            {t.booking.eyebrow}
          </span>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl">{t.booking.title}</h2>
          <p className="mt-4 text-sm leading-6 text-white/80">{t.booking.description}</p>
          <ul className="mt-8 space-y-3">
            {t.booking.perks.map((perk) => (
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
              <h3 className="font-display text-xl text-foreground">{t.booking.success.title}</h3>
              <p className="max-w-sm text-sm leading-6 text-foreground/65">{t.booking.success.message}</p>
            </div>
          ) : step === "review" && reviewData ? (
            <Review
              form={form}
              review={t.booking.review}
              data={reviewData}
              onEdit={() => setStep("form")}
              onConfirm={handleConfirm}
              submitting={submitting}
              submitError={submitError}
            />
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label={form.fullName}
                  type="text"
                  name="name"
                  defaultValue={reviewData?.name}
                  error={errors.name}
                  required
                />
                <PhoneField
                  label={form.contactNumber}
                  name="phone"
                  codes={t.bookCta.form.phoneCodes}
                  defaultValue={reviewData?.phone}
                  error={errors.phone}
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
                    city={city}
                    onCityChange={setCity}
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

              <div className="flex flex-col gap-1.5">
                <TextField
                  label={form.totalAmount}
                  type="number"
                  name="totalAmount"
                  min={0}
                  step={1000}
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  error={errors.totalAmount}
                  required
                />
                <p className={`text-xs ${dueNow ? theme.text.accent : "text-foreground/45"}`}>
                  {dueNow ? `${form.dueNowPrefix} ${dueNow}` : form.dueNowExample}
                </p>
              </div>

              <div className={`rounded-2xl border ${theme.border.subtle} p-4 sm:p-5`}>
                <h4 className={`text-xs font-semibold uppercase tracking-widest ${theme.text.accent}`}>
                  {form.accountDetailsHeading}
                </h4>
                <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-xs font-medium uppercase tracking-wide text-foreground/45">
                      {form.accountTitleLabel}
                    </dt>
                    <dd className="text-sm font-medium text-foreground">{form.accountTitleValue}</dd>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-xs font-medium uppercase tracking-wide text-foreground/45">
                      {form.accountNumberLabel}
                    </dt>
                    <dd className="text-sm font-medium text-foreground">{form.accountNumberValue}</dd>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-xs font-medium uppercase tracking-wide text-foreground/45">
                      {form.bankNameLabel}
                    </dt>
                    <dd className="text-sm font-medium text-foreground">{form.bankNameValue}</dd>
                  </div>
                </dl>
              </div>

              <FileField
                label={form.receiptLabel}
                name="receipt"
                accept="image/*"
                placeholder={form.receiptPlaceholder}
                browseLabel={form.receiptBrowse}
                error={errors.receipt}
                required
              />

              <label className="mt-1 flex items-start gap-2 text-sm text-foreground/70">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  defaultChecked={reviewData?.agreeToTerms}
                  required
                  className="mt-0.5 accent-brand"
                />
                <span>
                  {form.termsPrefix}{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`font-medium underline ${theme.text.accent}`}
                  >
                    {form.termsLinkLabel}
                  </a>
                </span>
              </label>
              {errors.agreeToTerms && (
                <span className="-mt-2 text-xs text-red-600">{errors.agreeToTerms}</span>
              )}

              <p className={`rounded-xl border ${theme.border.accent} bg-blush px-3 py-2.5 text-xs leading-5 ${theme.text.accent}`}>
                {form.terminationDisclaimer}
              </p>

              <Button type="submit" size="compact" className="mt-1">
                {form.submit}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
