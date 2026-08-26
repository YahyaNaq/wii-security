import type { Metadata } from "next";
import PreBookingForm from "../../components/sections/PreBookingForm";
import { loadPricingTables } from "../../lib/pricingData";

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
      <PreBookingForm
        photographyOptions={tables.photographyOptions}
        videographyOptions={tables.videographyOptions}
        pouchGuestTiers={tables.pouchGuestTiers}
        monitoringGuestTiers={tables.monitoringGuestTiers}
      />
    </>
  );
}
