import type { Metadata } from "next";
import PreBookingForm from "../components/sections/PreBookingForm";

export const metadata: Metadata = {
  title: "Get a Quote | WII Security",
  description:
    "Get a personalized security and privacy quote for your women-only event in Karachi, Lahore, or Islamabad.",
};

export default function GetAQuotePage() {
  return <PreBookingForm />;
}
