"use server";

import { revalidatePath } from "next/cache";
import { BookingStatus } from "@prisma/client";
import { prisma } from "../../../lib/db";
import { verifyAdminSession } from "../../../lib/admin/dal";
import { sendBookingStatusEmail } from "../../../lib/email";
import { bookingServiceSummary } from "../../../lib/pricing";
import { loadPricingTables } from "../../../lib/pricingData";

export async function updateBookingStatus(
  bookingId: string,
  status: Exclude<BookingStatus, typeof BookingStatus.IN_REVIEW>
) {
  await verifyAdminSession();

  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
    include: { events: true },
  });

  revalidatePath("/admin/bookings");
  revalidatePath("/admin");

  try {
    const tables = await loadPricingTables();
    await sendBookingStatusEmail({
      to: booking.email,
      name: booking.name,
      status,
      bookingId: booking.id,
      totalAmount: booking.totalAmount,
      events: booking.events.map((event) => ({
        city: event.city,
        date: event.date,
        venue: event.venue,
        reportingTime: event.reportingTime,
        eventType: event.eventType === "Other" && event.eventTypeOther ? event.eventTypeOther : event.eventType,
        femaleGuests: event.femaleGuests,
        serviceSummary: bookingServiceSummary(tables, event),
      })),
    });
  } catch (err) {
    console.error("Failed to send booking status email", err);
  }
}
