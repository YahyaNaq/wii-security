import type { Metadata } from "next";
import PreBookingForm from "../components/sections/PreBookingForm";
import { loadPricingTables } from "../lib/pricingData";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Get a Quote | WII Security",
  description:
    "Get a personalized security and privacy quote for your women-only event in Karachi, Lahore, or Islamabad.",
};

export default async function GetAQuotePage() {
  const tables = await loadPricingTables();
  return (
    <>
      {/* TEMPORARY: fast PDF design iteration, remove along with app/get-a-quote/sample-pdf/route.tsx */}
      <a
        href="/get-a-quote/sample-pdf"
        style={{
          position: "fixed",
          top: 12,
          right: 12,
          zIndex: 9999,
          background: "#111",
          color: "#fff",
          padding: "8px 14px",
          borderRadius: 8,
          fontSize: 12,
          fontFamily: "monospace",
        }}
      >
        ⬇ Sample Quote PDF
      </a>
      <PreBookingForm
        photographyOptions={tables.photographyOptions}
        videographyOptions={tables.videographyOptions}
      />
    </>
  );
}
