"use server";

import { revalidatePath } from "next/cache";
import { SalaryStatus } from "@prisma/client";
import { prisma } from "../../../../lib/db";
import { verifyAdminSession } from "../../../../lib/admin/dal";

export type EventStaffActionResult = { success: true } | { success: false; error: string };

// Replaces the full staff list for an event with the given employee ids.
export async function setEventStaff(bookingEventId: string, employeeIds: string[]): Promise<EventStaffActionResult> {
  await verifyAdminSession();

  const bookingEvent = await prisma.bookingEvent.findUniqueOrThrow({
    where: { id: bookingEventId },
    select: { date: true, staff: { select: { employeeId: true } } },
  });
  const year = bookingEvent.date.getFullYear();
  const month = bookingEvent.date.getMonth() + 1;

  const currentIds = new Set(bookingEvent.staff.map((s) => s.employeeId));
  const nextIds = new Set(employeeIds);
  const changedIds = [...currentIds, ...nextIds].filter(
    (id) => currentIds.has(id) !== nextIds.has(id)
  );

  if (changedIds.length > 0) {
    const releasedForChanged = await prisma.employeeSalaryPeriod.findMany({
      where: { employeeId: { in: [...new Set(changedIds)] }, year, month, status: SalaryStatus.RELEASED },
      include: { employee: { select: { name: true } } },
    });
    if (releasedForChanged.length > 0) {
      const names = releasedForChanged.map((p) => p.employee.name).join(", ");
      return {
        success: false,
        error: `Cannot change staffing for ${names}: salary for this month has already been released.`,
      };
    }
  }

  await prisma.$transaction([
    prisma.eventAssignment.deleteMany({
      where: { bookingEventId, employeeId: { notIn: employeeIds } },
    }),
    ...employeeIds.map((employeeId) =>
      prisma.eventAssignment.upsert({
        where: { bookingEventId_employeeId: { bookingEventId, employeeId } },
        create: { bookingEventId, employeeId },
        update: {},
      })
    ),
  ]);

  revalidatePath("/admin/employee-management/event-staffing");
  return { success: true };
}
