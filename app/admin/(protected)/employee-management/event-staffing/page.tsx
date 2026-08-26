import { SalaryStatus } from "@prisma/client";
import { prisma } from "../../../../lib/db";
import { formatDateLong } from "../../../../lib/format";
import { parseListParams } from "../../_lib/list-params";
import { Pagination } from "../../_components/table/Pagination";
import { SearchInput } from "../../_components/table/SearchInput";
import { EmptyRow } from "../../_components/table/EmptyRow";
import { ManageStaffButton } from "./ManageStaffButton";

export default async function AdminEventStaffingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const { page, pageSize, skip, take, q } = parseListParams(resolvedSearchParams, {
    allowedSort: [],
    defaultSort: "date",
  });

  const where = q
    ? {
        OR: [
          { venue: { contains: q, mode: "insensitive" as const } },
          { city: { contains: q, mode: "insensitive" as const } },
          { booking: { name: { contains: q, mode: "insensitive" as const } } },
        ],
      }
    : {};

  const [events, total, employees] = await Promise.all([
    prisma.bookingEvent.findMany({
      where,
      orderBy: { date: "desc" },
      skip,
      take,
      include: {
        booking: { select: { name: true } },
        staff: { include: { employee: { select: { id: true, name: true, jobTitle: { select: { title: true } } } } } },
      },
    }),
    prisma.bookingEvent.count({ where }),
    prisma.employee.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, jobTitle: { select: { title: true } } },
    }),
  ]);

  const months = Array.from(
    new Map(
      events.map((event) => {
        const year = event.date.getFullYear();
        const month = event.date.getMonth() + 1;
        return [`${year}-${month}`, { year, month }];
      })
    ).values()
  );
  const releasedPeriods = months.length
    ? await prisma.employeeSalaryPeriod.findMany({
        where: { status: SalaryStatus.RELEASED, OR: months },
        select: { employeeId: true, year: true, month: true },
      })
    : [];
  const releasedKeys = new Set(releasedPeriods.map((p) => `${p.employeeId}-${p.year}-${p.month}`));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Event Staffing</h1>
        <SearchInput placeholder="Search by venue, city or customer" />
      </div>
      <p className="mb-6 text-sm text-neutral-500">
        Record which employees worked each event. Assignments can be edited later if staff are replaced — unless an
        employee&apos;s salary for that month has already been released, in which case their staffing for that month is
        locked.
      </p>

      <div className="h-[65vh] overflow-auto rounded-lg border border-neutral-800">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="sticky top-0 z-10 bg-neutral-950">
            <tr className="border-b border-neutral-800 text-neutral-400">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Event</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Package</th>
              <th className="px-4 py-3 font-medium">Staff</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={event.id} className="border-b border-neutral-800 last:border-0">
                <td className="px-4 py-3 text-neutral-500">{skip + index + 1}</td>
                <td className="px-4 py-3 text-neutral-500">{formatDateLong(event.date)}</td>
                <td className="px-4 py-3">
                  <div>{event.venue}</div>
                  <div className="text-neutral-500">{event.city}</div>
                </td>
                <td className="px-4 py-3 text-neutral-400">{event.booking.name}</td>
                <td className="px-4 py-3 text-neutral-400">{event.package}</td>
                <td className="px-4 py-3 text-neutral-400">
                  {event.staff.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {event.staff.map((assignment) => (
                        <span
                          key={assignment.id}
                          className="rounded-full border border-neutral-800 px-2 py-0.5 text-xs"
                        >
                          {assignment.employee.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-neutral-600">Unstaffed</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <ManageStaffButton
                    eventLabel={`${event.venue}, ${formatDateLong(event.date)}`}
                    bookingEventId={event.id}
                    employees={employees}
                    assignedEmployeeIds={event.staff.map((assignment) => assignment.employee.id)}
                    lockedEmployeeIds={employees
                      .filter((employee) =>
                        releasedKeys.has(`${employee.id}-${event.date.getFullYear()}-${event.date.getMonth() + 1}`)
                      )
                      .map((employee) => employee.id)}
                  />
                </td>
              </tr>
            ))}
            {events.length === 0 && <EmptyRow colSpan={7} message="No events found." />}
          </tbody>
        </table>
      </div>

      <Pagination
        pathname="/admin/employee-management/event-staffing"
        searchParams={resolvedSearchParams}
        page={page}
        pageSize={pageSize}
        total={total}
      />
    </div>
  );
}
