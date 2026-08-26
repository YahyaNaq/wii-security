"use server";

import { z } from "zod";
import { prisma } from "../../lib/db";
import { guestTierFor } from "../../lib/pricing";
import { loadPricingTables } from "../../lib/pricingData";
import { isValidPhoneNumber, isPositiveNumber } from "../../lib/validators";

const MAX_RECEIPT_SIZE = 5 * 1024 * 1024;
const ACCEPTED_RECEIPT_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

const eventSchema = z
  .object({
    city: z.string().trim().min(1, "City is required"),
    date: z.string().trim().min(1, "Date is required").transform((v) => new Date(v)),
    reportingTime: z.string().trim().min(1, "Reporting time is required"),
    venue: z.string().trim().min(1, "Venue is required"),
    eventType: z.string().trim().min(1, "Event type is required"),
    eventTypeOther: z.string().trim().optional(),
    femaleGuests: z
      .string()
      .refine((v) => isPositiveNumber(v), "Enter a valid number of guests")
      .transform(Number),
    guestService: z.enum(["none", "phone-pouches", "monitoring"]),
    photographyTier: z.string().trim().optional(),
    videographyTier: z.string().trim().optional(),
  })
  .refine((e) => e.guestService !== "none" || !!e.photographyTier || !!e.videographyTier, {
    message: "Select at least one service for this event.",
    path: ["guestService"],
  });

const bookingSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  phone: z.string().trim().refine(isValidPhoneNumber, "Enter a valid phone number"),
  totalAmount: z
    .string()
    .refine((v) => isPositiveNumber(v), "Enter a valid amount")
    .transform(Number),
  agreeToTerms: z.literal("on", { error: "You must agree to the terms" }),
  events: z.array(eventSchema).min(1, "At least one event is required"),
  receipt: z
    .instanceof(File, { error: "Receipt is required" })
    .refine((f) => f.size > 0, "Receipt is required")
    .refine((f) => f.size <= MAX_RECEIPT_SIZE, "Receipt must be under 5MB")
    .refine((f) => ACCEPTED_RECEIPT_TYPES.includes(f.type), "Receipt must be an image"),
});

function parseFormData(formData: FormData): unknown {
  const events: unknown[] = [];
  for (let i = 0; formData.has(`events[${i}][city]`); i++) {
    events.push({
      city: formData.get(`events[${i}][city]`),
      date: formData.get(`events[${i}][date]`),
      reportingTime: formData.get(`events[${i}][reportingTime]`),
      venue: formData.get(`events[${i}][venue]`),
      eventType: formData.get(`events[${i}][eventType]`),
      eventTypeOther: formData.get(`events[${i}][eventTypeOther]`) || undefined,
      femaleGuests: formData.get(`events[${i}][femaleGuests]`),
      guestService: formData.get(`events[${i}][guestService]`) || "none",
      photographyTier: formData.get(`events[${i}][photographyTier]`) || undefined,
      videographyTier: formData.get(`events[${i}][videographyTier]`) || undefined,
    });
  }

  return {
    name: formData.get("name"),
    phone: formData.get("phone"),
    totalAmount: formData.get("totalAmount"),
    agreeToTerms: formData.get("agreeToTerms"),
    events,
    receipt: formData.get("receipt"),
  };
}

function toFieldKey(path: (string | number)[]) {
  return path.reduce<string>((acc, segment, i) => {
    if (i === 0) return String(segment);
    return `${acc}[${segment}]`;
  }, "");
}

export type SubmitBookingResult =
  | { success: true; bookingId: string }
  | { success: false; error: string; fieldErrors?: Record<string, string> };

export async function submitBooking(formData: FormData): Promise<SubmitBookingResult> {
  const parsed = bookingSchema.safeParse(parseFormData(formData));

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[toFieldKey(issue.path as (string | number)[])] = issue.message;
    }
    return { success: false, error: "Please check the form for errors.", fieldErrors };
  }

  const data = parsed.data;
  const tables = await loadPricingTables();

  const guestCountFieldErrors: Record<string, string> = {};
  data.events.forEach((event, i) => {
    if (event.guestService === "none") return;
    const guestTiers = event.guestService === "phone-pouches" ? tables.pouchGuestTiers : tables.monitoringGuestTiers;
    if (!guestTierFor(guestTiers, event.femaleGuests)) {
      guestCountFieldErrors[`events[${i}][femaleGuests]`] =
        "This guest count isn't supported for the selected service. Please contact us directly for a custom quote.";
    }
  });
  if (Object.keys(guestCountFieldErrors).length > 0) {
    return { success: false, error: "Please check the form for errors.", fieldErrors: guestCountFieldErrors };
  }

  try {
    const receiptData = Buffer.from(await data.receipt.arrayBuffer());

    const booking = await prisma.booking.create({
      data: {
        name: data.name,
        phone: data.phone,
        totalAmount: data.totalAmount,
        receiptFileName: data.receipt.name,
        receiptMimeType: data.receipt.type,
        receiptData,
        events: {
          create: data.events.map((event) => ({
            city: event.city,
            date: event.date,
            reportingTime: event.reportingTime,
            venue: event.venue,
            eventType: event.eventType,
            eventTypeOther: event.eventTypeOther || null,
            femaleGuests: event.femaleGuests,
            guestService: event.guestService === "none" ? null : event.guestService,
            photographyTier: event.photographyTier || null,
            videographyTier: event.videographyTier || null,
          })),
        },
      },
    });

    return { success: true, bookingId: booking.id };
  } catch (err) {
    console.error("Failed to save booking", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
