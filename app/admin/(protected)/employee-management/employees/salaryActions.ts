"use server";

import { revalidatePath } from "next/cache";
import { SalaryStatus } from "@prisma/client";
import { prisma } from "../../../../lib/db";
import { verifyAdminSession } from "../../../../lib/admin/dal";

export type SalaryGig = {
  id: string;
  date: Date;
  venue: string;
  city: string;
  package: string;
};

export type SalaryPeriod = {
  year: number;
  month: number;
  status: SalaryStatus;
  amount: number;
  releasedAt: Date | null;
  gigs: SalaryGig[];
};

function periodKey(year: number, month: number) {
  return `${year}-${month}`;
}

async function computeSalaryPeriods(employeeId: string): Promise<SalaryPeriod[]> {
  const employee = await prisma.employee.findUniqueOrThrow({
    where: { id: employeeId },
    select: { jobTitle: { select: { salary: true } } },
  });

  const [assignments, releasedPeriods] = await Promise.all([
    prisma.eventAssignment.findMany({
      where: { employeeId },
      select: {
        bookingEvent: { select: { id: true, date: true, venue: true, city: true, package: true } },
      },
    }),
    prisma.employeeSalaryPeriod.findMany({ where: { employeeId, status: SalaryStatus.RELEASED } }),
  ]);

  const grouped = new Map<string, { year: number; month: number; gigs: SalaryGig[] }>();
  for (const { bookingEvent } of assignments) {
    const year = bookingEvent.date.getFullYear();
    const month = bookingEvent.date.getMonth() + 1;
    const key = periodKey(year, month);
    if (!grouped.has(key)) grouped.set(key, { year, month, gigs: [] });
    grouped.get(key)!.gigs.push(bookingEvent);
  }

  const releasedByKey = new Map(releasedPeriods.map((p) => [periodKey(p.year, p.month), p]));
  for (const p of releasedPeriods) {
    const key = periodKey(p.year, p.month);
    if (!grouped.has(key)) grouped.set(key, { year: p.year, month: p.month, gigs: [] });
  }

  const periods: SalaryPeriod[] = Array.from(grouped.values()).map(({ year, month, gigs }) => {
    const released = releasedByKey.get(periodKey(year, month));
    const sortedGigs = [...gigs].sort((a, b) => a.date.getTime() - b.date.getTime());
    return {
      year,
      month,
      status: released ? SalaryStatus.RELEASED : SalaryStatus.PENDING,
      amount: released ? released.amount : gigs.length * employee.jobTitle.salary,
      releasedAt: released?.releasedAt ?? null,
      gigs: sortedGigs,
    };
  });

  periods.sort((a, b) => b.year - a.year || b.month - a.month);
  return periods;
}

export async function getEmployeeSalaryPeriods(employeeId: string): Promise<SalaryPeriod[]> {
  await verifyAdminSession();
  return computeSalaryPeriods(employeeId);
}

export type ReleaseSalaryResult = { success: true } | { success: false; error: string };

export async function releaseSalaryPeriod(
  employeeId: string,
  year: number,
  month: number,
  releaseDate: Date
): Promise<ReleaseSalaryResult> {
  await verifyAdminSession();

  if (Number.isNaN(releaseDate.getTime())) {
    return { success: false, error: "Enter a valid release date" };
  }

  const periods = await computeSalaryPeriods(employeeId);
  const target = periods.find((p) => p.year === year && p.month === month);

  if (!target) {
    return { success: false, error: "No gigs found for this month" };
  }
  if (target.status === SalaryStatus.RELEASED) {
    return { success: false, error: "This month has already been released" };
  }

  await prisma.employeeSalaryPeriod.upsert({
    where: { employeeId_year_month: { employeeId, year, month } },
    create: { employeeId, year, month, status: SalaryStatus.RELEASED, amount: target.amount, releasedAt: releaseDate },
    update: { status: SalaryStatus.RELEASED, amount: target.amount, releasedAt: releaseDate },
  });

  revalidatePath("/admin/employee-management/employees");
  return { success: true };
}
