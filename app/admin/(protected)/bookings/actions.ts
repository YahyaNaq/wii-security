"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/db";
import { verifyAdminSession } from "../../../lib/admin/dal";

export async function updateBookingStatus(bookingId: string, status: "APPROVED" | "REJECTED") {
  await verifyAdminSession();

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });

  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
}
