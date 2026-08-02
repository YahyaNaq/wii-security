// TEMPORARY dev-only route for fast PDF design iteration.
// Delete this file (and its button on the quote page) once the PDF design is finalized.
import { renderToBuffer } from "@react-pdf/renderer";
import { priceQuote } from "../../lib/pricing";
import { loadPricingTables } from "../../lib/pricingData";
import { QuotePdf } from "../../lib/pdf/QuotePdf";

export async function GET() {
  const tables = await loadPricingTables();

  const events = [
    {
      femaleGuests: 120,
      services: [
        { type: "PHONE_POUCHES" as const },
        { type: "PHOTOGRAPHY" as const, tier: "couple-bridal-family" },
        { type: "VIDEOGRAPHY" as const, tier: "testimonial" },
      ],
    },
    {
      femaleGuests: 60,
      services: [{ type: "MONITORING" as const }],
    },
    {
      femaleGuests: 120,
      services: [
        { type: "PHONE_POUCHES" as const },
        { type: "PHOTOGRAPHY" as const, tier: "couple-bridal-family" },
        { type: "VIDEOGRAPHY" as const, tier: "testimonial" },
      ],
    },
    {
      femaleGuests: 60,
      services: [{ type: "MONITORING" as const }],
    },
    {
      femaleGuests: 120,
      services: [
        { type: "PHONE_POUCHES" as const },
        { type: "PHOTOGRAPHY" as const, tier: "couple-bridal-family" },
        { type: "VIDEOGRAPHY" as const, tier: "testimonial" },
      ],
    },
    {
      femaleGuests: 60,
      services: [{ type: "MONITORING" as const }],
    },
  ];

  const priced = priceQuote(tables, events);

  const pdfBuffer = await renderToBuffer(
    <QuotePdf
      name="Ayesha Khan"
      quoteId="SAMPLE-0001"
      createdAt={new Date()}
      total={priced.total}
      events={[
        { city: "Karachi", date: new Date("2026-09-15"), femaleGuests: 120, priced: priced.events[0] },
        { city: "Lahore", date: new Date("2026-10-02"), femaleGuests: 60, priced: priced.events[1] },
        { city: "Islamabad", date: new Date("2026-11-20"), femaleGuests: 120, priced: priced.events[2] },
        { city: "Peshawar", date: new Date("2026-12-10"), femaleGuests: 60, priced: priced.events[3] },
        { city: "Faisalabad", date: new Date("2027-01-15"), femaleGuests: 120, priced: priced.events[4] },
        { city: "Rawalpindi", date: new Date("2027-02-01"), femaleGuests: 60, priced: priced.events[5] },
      ]}
      tables={tables}
    />
  );

  return new Response(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="sample-quote.pdf"',
    },
  });
}
