import type { Metadata } from "next";
import BookingForm from "../../components/sections/BookingForm";

export const metadata: Metadata = {
  title: "Book Your Event | WII Security",
  description:
    "Confirm your WII Security booking — event details, package selection, and payment receipt.",
};

export default function BookPage() {
  return <BookingForm />;
}
