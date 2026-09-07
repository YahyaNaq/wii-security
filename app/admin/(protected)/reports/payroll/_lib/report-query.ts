import { SalaryStatus } from "@prisma/client";
import { prisma } from "../../../../../lib/db";

export const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export type PayrollFilters = {
  year: number;
  month: number;
  status: SalaryStatus | "ALL";
};

function single(searchParams: Record<string, string | string[] | undefined>, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export function parsePayrollFilters(
  searchParams: Record<string, string | string[] | undefined>
): PayrollFilters {
  const now = new Date();

  const rawYear = Number(single(searchParams, "year"));
  const year = Number.isInteger(rawYear) && rawYear >= 2000 ? rawYear : now.getFullYear();

  const rawMonth = Number(single(searchParams, "month"));
  const month = Number.isInteger(rawMonth) && rawMonth >= 1 && rawMonth <= 12 ? rawMonth : now.getMonth() + 1;

  const rawStatus = single(searchParams, "status");
  const status: SalaryStatus | "ALL" =
    rawStatus === SalaryStatus.RELEASED || rawStatus === SalaryStatus.PENDING ? rawStatus : "ALL";

  return { year, month, status };
}

export type PayrollRow = {
  employeeId: string;
  name: string;
  jobTitle: string;
  employmentStatus: string;
  gigCount: number;
  amount: number;
  status: SalaryStatus;
  releasedAt: Date | null;
};

export async function loadPayrollData(filters: PayrollFilters) {
  const monthStart = new Date(filters.year, filters.month - 1, 1);
  const monthEnd = new Date(filters.year, filters.month, 1);

  const [assignments, released, eventDateRange] = await Promise.all([
    prisma.eventAssignment.findMany({
      where: { bookingEvent: { date: { gte: monthStart, lt: monthEnd } } },
      select: {
        employeeId: true,
        employee: {
          select: {
            name: true,
            employmentStatus: true,
            jobTitle: { select: { title: true, salary: true } },
          },
        },
      },
    }),
    prisma.employeeSalaryPeriod.findMany({
      where: { year: filters.year, month: filters.month, status: SalaryStatus.RELEASED },
      select: {
        employeeId: true,
        status: true,
        amount: true,
        releasedAt: true,
        employee: {
          select: { name: true, employmentStatus: true, jobTitle: { select: { title: true } } },
        },
      },
    }),
    prisma.bookingEvent.aggregate({ _min: { date: true }, _max: { date: true } }),
  ]);

  const salaryByEmployee = new Map<string, number>();
  const rows = new Map<string, PayrollRow>();

  for (const assignment of assignments) {
    salaryByEmployee.set(assignment.employeeId, assignment.employee.jobTitle.salary);
    const existing = rows.get(assignment.employeeId);
    if (existing) {
      existing.gigCount += 1;
    } else {
      rows.set(assignment.employeeId, {
        employeeId: assignment.employeeId,
        name: assignment.employee.name,
        jobTitle: assignment.employee.jobTitle.title,
        employmentStatus: assignment.employee.employmentStatus,
        gigCount: 1,
        amount: 0,
        status: SalaryStatus.PENDING,
        releasedAt: null,
      });
    }
  }

  for (const row of rows.values()) {
    row.amount = row.gigCount * (salaryByEmployee.get(row.employeeId) ?? 0);
  }

  // Released rows are authoritative (locked at release time) and can include
  // employees with zero current assignments if staffing changed afterwards.
  for (const period of released) {
    const existing = rows.get(period.employeeId);
    if (existing) {
      existing.status = period.status;
      existing.amount = period.amount;
      existing.releasedAt = period.releasedAt;
    } else {
      rows.set(period.employeeId, {
        employeeId: period.employeeId,
        name: period.employee.name,
        jobTitle: period.employee.jobTitle.title,
        employmentStatus: period.employee.employmentStatus,
        gigCount: 0,
        amount: period.amount,
        status: period.status,
        releasedAt: period.releasedAt,
      });
    }
  }

  let allRows = [...rows.values()];
  if (filters.status !== "ALL") {
    allRows = allRows.filter((row) => row.status === filters.status);
  }
  allRows.sort((a, b) => b.amount - a.amount);

  const currentYear = new Date().getFullYear();
  const minYear = eventDateRange._min.date?.getFullYear() ?? currentYear;
  const maxYear = Math.max(eventDateRange._max.date?.getFullYear() ?? currentYear, currentYear);
  const availableYears: number[] = [];
  for (let y = maxYear; y >= minYear; y--) availableYears.push(y);

  return { rows: allRows, availableYears };
}
