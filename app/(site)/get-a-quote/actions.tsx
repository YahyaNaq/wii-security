"use server";

import { z } from "zod";
import { renderToBuffer } from "@react-pdf/renderer";
import { ServiceType } from "@prisma/client";
import { prisma } from "../../lib/db";
import { priceQuote, guestTierFor, PricingError, type EventInput, type ServiceSelection } from "../../lib/pricing";
import { loadPricingTables } from "../../lib/pricingData";
import { QuotePdf } from "../../lib/pdf/QuotePdf";
// import { sendQuoteEmail } from "../../lib/email";
import { isValidEmail, isValidPhoneNumber, isPositiveNumber } from "../../lib/validators";

const eventSchema = z
  .object({
    city: z.string().trim().min(1, "City is required"),
    date: z.string().trim().min(1, "Date is required"),
    femaleGuests: z
      .string()
      .refine((v) => isPositiveNumber(v), "Enter a valid number of guests")
      .transform(Number),
    details: z.string().trim().optional(),
    guestService: z.enum(["none", "phone-pouches", "monitoring"]),
    photographyTier: z.string().trim().optional(),
    videographyTier: z.string().trim().optional(),
  })
  .refine((e) => e.guestService !== "none" || !!e.photographyTier || !!e.videographyTier, {
    message: "Select at least one service for this event.",
    path: ["guestService"],
  });

const quoteSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  phone: z.string().trim().refine(isValidPhoneNumber, "Enter a valid phone number"),
  email: z.string().trim().refine(isValidEmail, "Enter a valid email"),
  hearAboutUs: z.string().trim().min(1, "Required"),
  hearAboutUsOther: z.string().trim().optional(),
  events: z.array(eventSchema).min(1, "At least one event is required"),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

function eventsToPricingInput(events: QuoteFormValues["events"]): EventInput[] {
  return events.map((event) => {
    const services: ServiceSelection[] = [];
    if (event.guestService === "phone-pouches") services.push({ type: ServiceType.PHONE_POUCHES });
    if (event.guestService === "monitoring") services.push({ type: ServiceType.MONITORING });
    if (event.photographyTier) {
      services.push({ type: ServiceType.PHOTOGRAPHY, tier: event.photographyTier });
    }
    if (event.videographyTier) {
      services.push({ type: ServiceType.VIDEOGRAPHY, tier: event.videographyTier });
    }
    return { femaleGuests: event.femaleGuests, services };
  });
}

function parseFormData(formData: FormData): unknown {
  const eventCount = Math.max(1, Number(formData.get("eventCount") ?? 1));

  return {
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    hearAboutUs: formData.get("hearAboutUs"),
    hearAboutUsOther: formData.get("hearAboutUsOther"),
    events: Array.from({ length: eventCount }, (_, i) => ({
      city: formData.get(`events[${i}][city]`),
      date: formData.get(`events[${i}][date]`),
      femaleGuests: formData.get(`events[${i}][femaleGuests]`),
      details: formData.get(`events[${i}][details]`),
      guestService: formData.get(`events[${i}][guestService]`) || "none",
      photographyTier: formData.get(`events[${i}][photographyTier]`) || undefined,
      videographyTier: formData.get(`events[${i}][videographyTier]`) || undefined,
    })),
  };
}

function toFieldKey(path: (string | number)[]) {
  return path.reduce<string>((acc, segment, i) => {
    if (i === 0) return String(segment);
    return `${acc}[${segment}]`;
  }, "");
}

export type SubmitQuoteResult =
  | { success: true; quoteId: string; total: number; pdfBase64: string }
  | { success: false; error: string; fieldErrors?: Record<string, string> };

export async function submitQuoteRequest(formData: FormData): Promise<SubmitQuoteResult> {
  const parsed = quoteSchema.safeParse(parseFormData(formData));

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

  let priced: ReturnType<typeof priceQuote>;
  try {
    priced = priceQuote(tables, eventsToPricingInput(data.events));
  } catch (err) {
    if (err instanceof PricingError) {
      return { success: false, error: err.message };
    }
    throw err;
  }

  const quoteRequest = await prisma.quoteRequest.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email,
      hearAboutUs: data.hearAboutUs,
      hearAboutUsOther: data.hearAboutUsOther || null,
      totalAmount: priced.total,
      events: {
        create: data.events.map((event, i) => ({
          city: event.city,
          date: new Date(event.date),
          femaleGuests: event.femaleGuests,
          details: event.details || null,
          subtotal: priced.events[i].subtotal,
          services: {
            create: priced.events[i].services.map((service) => ({
              type: service.type,
              tier: service.tier,
              price: service.price,
            })),
          },
        })),
      },
    },
  });
  const quoteId = quoteRequest.id;
  const createdAt = quoteRequest.createdAt;

  const pdfBuffer = await renderToBuffer(
    <QuotePdf
      name={data.name}
      quoteId={quoteId}
      createdAt={createdAt}
      total={priced.total}
      events={data.events.map((event, i) => ({
        city: event.city,
        date: new Date(event.date),
        femaleGuests: event.femaleGuests,
        priced: priced.events[i],
      }))}
      tables={tables}
    />
  );

  // TODO: re-enable the confirmation email once the PDF layout is finalized.
  // try {
  //   await sendQuoteEmail({
  //     to: data.email,
  //     name: data.name,
  //     quoteId: quoteRequest.id,
  //     pdfBuffer,
  //   });
  // } catch (err) {
  //   console.error("Failed to send quote email", err);
  // }

  return { success: true, quoteId, total: priced.total, pdfBase64: pdfBuffer.toString("base64") };
}
