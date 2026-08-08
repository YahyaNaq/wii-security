import type { Metadata } from "next";
import Faqs from "../../components/sections/Faqs";

export const metadata: Metadata = {
  title: "FAQs | WII Security",
  description:
    "Answers to common questions about WII Security's women-only event security, phone pouch service, and photography compliance in Karachi, Lahore, and Islamabad.",
};

export default function FaqsPage() {
  return <Faqs />;
}
