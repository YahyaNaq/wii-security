import type { Metadata } from "next";
import BookingForm from "../../components/sections/BookingForm";
import { loadPricingTables } from "../../lib/pricingData";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book Your Event | WII Security",
  description:
    "Confirm your WII Security booking — event details, service selection, and payment receipt.",
};

export default async function BookPage() {
  const tables = await loadPricingTables();
  return (
    <BookingForm
      photographyOptions={tables.photographyOptions}
      videographyOptions={tables.videographyOptions}
      pouchGuestTiers={tables.pouchGuestTiers}
      monitoringGuestTiers={tables.monitoringGuestTiers}
    />
  );
}
