"use server";

import { renderToBuffer } from "@react-pdf/renderer";
import { ServiceType } from "@prisma/client";
import { prisma } from "../../../lib/db";
import { verifyAdminSession } from "../../../lib/admin/dal";
import { loadPricingTables } from "../../../lib/pricingData";
import { QuotePdf } from "../../../lib/pdf/QuotePdf";
import type { PricedEvent } from "../../../lib/pricing";

export type GenerateQuotePdfResult = { success: true; pdfBase64: string } | { success: false; error: string };

export async function generateQuotePdf(quoteId: string): Promise<GenerateQuotePdfResult> {
  await verifyAdminSession();

  const quoteRequest = await prisma.quoteRequest.findUnique({
    where: { id: quoteId },
    include: { events: { include: { services: true } } },
  });

  if (!quoteRequest) {
    return { success: false, error: "Quote request not found." };
  }

  const tables = await loadPricingTables();

  const pdfBuffer = await renderToBuffer(
    <QuotePdf
      name={quoteRequest.name}
      quoteId={quoteRequest.id}
      createdAt={quoteRequest.createdAt}
      total={quoteRequest.totalAmount}
      events={quoteRequest.events.map((event) => {
        const priced: PricedEvent = {
          subtotal: event.subtotal,
          services: event.services.map((service) => ({
            type: service.type,
            tier: service.tier,
            price: service.price,
          })),
        };
        const needsGuestCount = event.services.some(
          (s) => s.type === ServiceType.PHONE_POUCHES || s.type === ServiceType.MONITORING
        );
        return {
          femaleGuests: needsGuestCount ? event.femaleGuests : undefined,
          priced,
        };
      })}
      tables={tables}
    />
  );

  return { success: true, pdfBase64: pdfBuffer.toString("base64") };
}
