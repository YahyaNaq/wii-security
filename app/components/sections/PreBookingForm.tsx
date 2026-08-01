"use client";

import { useRef, useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import Button from "../ui/Button";
import {
  TextField,
  TextareaField,
  RadioGroupField,
  CheckboxGroupField,
} from "../ui/fields";
import { SelectField } from "../ui/Select";
import { DateField } from "../ui/DateField";
import { PhoneField } from "../ui/PhoneField";
import CheckIcon from "../ui/CheckIcon";
import SuccessBadge from "../ui/SuccessBadge";
import ReviewField from "../ui/ReviewField";
import { theme } from "../ui/theme";
import { useLanguage } from "../../i18n/LanguageContext";
import type { Translations } from "../../i18n/translations";
import { isValidEmail, isValidPhoneNumber, isPositiveNumber } from "../../lib/validators";

type BookCtaForm = Translations["bookCta"]["form"];

const MAX_EVENTS = 10;

type ReviewEvent = {
  city: string;
  date: string;
  femaleGuests: string;
  services: string[];
  details: string;
};

type ReviewData = {
  name: string;
  phone: string;
  email: string;
  hearAboutUs: string;
  hearAboutUsOther: string;
  events: ReviewEvent[];
};

function EventFields({
  form,
  index,
  eventId,
  onRemove,
  removable,
  city,
  onCityChange,
  date,
  onDateChange,
  errors,
}: {
  form: BookCtaForm;
  index: number;
  eventId: number;
  onRemove: () => void;
  removable: boolean;
  city: string;
  onCityChange: (city: string) => void;
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  errors: Record<string, string>;
}) {
  const prefix = `events[${index}]`;
  const summary = [
    city || null,
    date ? date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Accordion.Item
      value={String(eventId)}
      className={`overflow-hidden rounded-2xl border ${theme.border.subtle}`}
    >
      <Accordion.Header className="flex items-center justify-between gap-2 px-4 sm:px-5">
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
          <div className="flex flex-col gap-4 px-4 pb-4 sm:px-5 sm:pb-5">
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
              <DateField
                label={form.eventDate}
                name={`${prefix}[date]`}
                value={date}
                onValueChange={onDateChange}
                error={errors[`${prefix}[date]`]}
                required
              />
            </div>
            <TextField
              label={form.femaleGuests}
              type="number"
              name={`${prefix}[femaleGuests]`}
              min={0}
              error={errors[`${prefix}[femaleGuests]`]}
              required
            />
            <CheckboxGroupField
              label={form.servicesInterested}
              name={`${prefix}[services]`}
              options={form.serviceOptions}
            />
            <TextareaField
              label={form.details}
              name={`${prefix}[details]`}
              rows={3}
              placeholder={form.detailsPlaceholder}
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
}: {
  form: BookCtaForm;
  review: Translations["bookCta"]["review"];
  data: ReviewData;
  onEdit: () => void;
  onConfirm: () => void;
}) {
  const notProvided = review.notProvided;

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
          <ReviewField label={form.email} value={data.email || notProvided} />
          <ReviewField
            label={form.hearAboutUs}
            value={
              data.hearAboutUs === form.otherOptionValue && data.hearAboutUsOther
                ? `${data.hearAboutUs} — ${data.hearAboutUsOther}`
                : data.hearAboutUs || notProvided
            }
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
            <ReviewField label={form.eventDate} value={event.date || notProvided} />
            <ReviewField label={form.femaleGuests} value={event.femaleGuests || notProvided} />
            <ReviewField
              label={form.servicesInterested}
              value={event.services.length ? event.services.join(", ") : notProvided}
            />
            {event.details && (
              <div className="col-span-full flex flex-col gap-0.5">
                <dt className="text-xs font-medium uppercase tracking-wide text-foreground/45">
                  {form.details}
                </dt>
                <dd className="text-sm text-foreground">{event.details}</dd>
              </div>
            )}
          </dl>
        </div>
      ))}

      <div className="flex gap-3">
        <Button type="button" variant="secondary" size="sm" onClick={onEdit}>
          {review.edit}
        </Button>
        <Button type="button" size="compact" onClick={onConfirm}>
          {review.confirm}
        </Button>
      </div>
    </div>
  );
}

export default function PreBookingForm() {
  const { t } = useLanguage();
  const form = t.bookCta.form;

  const [eventIds, setEventIds] = useState([0]);
  const [openIds, setOpenIds] = useState<string[]>(["0"]);
  const nextId = useRef(1);
  const [city, setCity] = useState("");
  const [dates, setDates] = useState<Record<number, Date | undefined>>({});
  const [step, setStep] = useState<"form" | "review" | "success">("form");
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (fd: FormData) => {
    const nextErrors: Record<string, string> = {};
    const requiredTopLevel = ["name", "phone", "email", "hearAboutUs"];
    for (const key of requiredTopLevel) {
      if (!String(fd.get(key) ?? "").trim()) nextErrors[key] = t.common.requiredError;
    }

    const email = String(fd.get("email") ?? "").trim();
    if (email && !isValidEmail(email)) nextErrors.email = t.common.invalidEmailError;

    const phone = String(fd.get("phone") ?? "").trim();
    if (phone && !isValidPhoneNumber(phone)) nextErrors.phone = t.common.invalidPhoneError;

    eventIds.forEach((_, i) => {
      for (const field of ["city", "date", "femaleGuests"]) {
        const key = `events[${i}][${field}]`;
        const rawValue = String(fd.get(key) ?? "").trim();
        if (!rawValue) {
          nextErrors[key] = t.common.requiredError;
        } else if (field === "femaleGuests" && !isPositiveNumber(rawValue)) {
          nextErrors[key] = t.common.invalidNumberError;
        }
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
    setDates((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const validationErrors = validate(fd);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setReviewData({
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      hearAboutUs: String(fd.get("hearAboutUs") ?? ""),
      hearAboutUsOther: String(fd.get("hearAboutUsOther") ?? ""),
      events: eventIds.map((id, i) => ({
        city: String(fd.get(`events[${i}][city]`) ?? ""),
        date: dates[id]
          ? dates[id]!.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })
          : "",
        femaleGuests: String(fd.get(`events[${i}][femaleGuests]`) ?? ""),
        services: fd.getAll(`events[${i}][services]`).map(String),
        details: String(fd.get(`events[${i}][details]`) ?? ""),
      })),
    });
    setStep("review");
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className={`grid overflow-hidden rounded-[2.5rem] ${theme.gradient.brand} shadow-xl ${theme.shadow.md} lg:grid-cols-2`}>
        <div className="p-10 text-white sm:p-14">
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

        <div className={`flex flex-col gap-4 ${theme.surface} p-10 sm:p-14`}>
          {step === "success" ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <SuccessBadge />
              <h3 className="font-display text-xl text-foreground">{t.bookCta.success.title}</h3>
              <p className="max-w-sm text-sm leading-6 text-foreground/65">{t.bookCta.success.message}</p>
            </div>
          ) : step === "review" && reviewData ? (
            <Review
              form={form}
              review={t.bookCta.review}
              data={reviewData}
              onEdit={() => setStep("form")}
              onConfirm={() => setStep("success")}
            />
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label={form.fullName} type="text" name="name" defaultValue={reviewData?.name} error={errors.name} required />
                <PhoneField label={form.phoneNumber} name="phone" codes={form.phoneCodes} defaultValue={reviewData?.phone} error={errors.phone} required />
              </div>
              <TextField label={form.email} type="email" name="email" defaultValue={reviewData?.email} error={errors.email} required />
              <RadioGroupField
                label={form.hearAboutUs}
                name="hearAboutUs"
                options={form.hearAboutUsOptions}
                otherOption={form.otherOptionValue}
                otherFieldPlaceholder={form.otherPlaceholder}
                error={errors.hearAboutUs}
                required
              />

              <Accordion.Root
                type="multiple"
                value={openIds}
                onValueChange={setOpenIds}
                className="mt-2 flex flex-col gap-3"
              >
                {eventIds.map((id, i) => (
                  <EventFields
                    key={id}
                    form={form}
                    index={i}
                    eventId={id}
                    onRemove={() => removeEvent(id)}
                    removable={eventIds.length > 1}
                    city={city}
                    onCityChange={setCity}
                    date={dates[id]}
                    onDateChange={(d) => setDates((prev) => ({ ...prev, [id]: d }))}
                    errors={errors}
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
