import { BookingStatus, Prisma } from "@prisma/client";
import { prisma } from "../../../lib/db";
import { formatPkr } from "../../../lib/format";
import { parseListParams } from "../_lib/list-params";
import { SortableHeader } from "../_components/table/SortableHeader";
import { Pagination } from "../_components/table/Pagination";
import { SearchInput } from "../_components/table/SearchInput";
import { StatusBadge } from "../_components/table/StatusBadge";
import { EmptyRow } from "../_components/table/EmptyRow";
import { BookingRowActions } from "./BookingRowActions";

const ALLOWED_SORT = ["name", "totalAmount", "createdAt"] as const;

const STATUS_TONE = {
  [BookingStatus.IN_REVIEW]: "amber",
  [BookingStatus.ACCEPTED]: "emerald",
  [BookingStatus.REJECTED]: "red",
} as const;

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const { page, pageSize, skip, take, sort, dir, q } = parseListParams(resolvedSearchParams, {
    allowedSort: ALLOWED_SORT,
    defaultSort: "createdAt",
  });

  const where: Prisma.BookingWhereInput = q
    ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { phone: { contains: q } }] }
    : {};

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      orderBy: { [sort]: dir },
      skip,
      take,
      select: {
        id: true,
        name: true,
        phone: true,
        totalAmount: true,
        status: true,
        createdAt: true,
        receiptFileName: true,
        events: {
          select: {
            id: true,
            city: true,
            date: true,
            venue: true,
            reportingTime: true,
            eventType: true,
            femaleGuests: true,
            package: true,
          },
        },
      },
    }),
    prisma.booking.count({ where }),
  ]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Bookings</h1>
        <SearchInput placeholder="Search by name or phone" />
      </div>

      <div className="max-h-[65vh] overflow-auto rounded-lg border border-neutral-800">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="sticky top-0 z-10 bg-neutral-950">
            <tr className="border-b border-neutral-800 text-neutral-400">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">
                <SortableHeader
                  pathname="/admin/bookings"
                  searchParams={resolvedSearchParams}
                  sortKey="name"
                  activeSort={sort}
                  activeDir={dir}
                >
                  Name
                </SortableHeader>
              </th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Events</th>
              <th className="px-4 py-3 font-medium">
                <SortableHeader
                  pathname="/admin/bookings"
                  searchParams={resolvedSearchParams}
                  sortKey="totalAmount"
                  activeSort={sort}
                  activeDir={dir}
                >
                  Total
                </SortableHeader>
              </th>
              <th className="px-4 py-3 font-medium">
                <SortableHeader
                  pathname="/admin/bookings"
                  searchParams={resolvedSearchParams}
                  sortKey="createdAt"
                  activeSort={sort}
                  activeDir={dir}
                >
                  Submitted
                </SortableHeader>
              </th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking.id} className="border-b border-neutral-800 last:border-0">
                <td className="px-4 py-3 text-neutral-500">{skip + index + 1}</td>
                <td className="px-4 py-3">{booking.name}</td>
                <td className="px-4 py-3 text-neutral-400">{booking.phone}</td>
                <td className="px-4 py-3 text-neutral-400">
                  {booking.events.map((event) => event.venue).join(", ")}
                </td>
                <td className="px-4 py-3">{formatPkr(booking.totalAmount)}</td>
                <td className="px-4 py-3 text-neutral-500">
                  {booking.createdAt.toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge label={booking.status} tone={STATUS_TONE[booking.status]} />
                </td>
                <td className="px-4 py-3 text-right">
                  <BookingRowActions booking={booking} />
                </td>
              </tr>
            ))}
            {bookings.length === 0 && <EmptyRow colSpan={8} message="No bookings found." />}
          </tbody>
        </table>
      </div>

      <Pagination
        pathname="/admin/bookings"
        searchParams={resolvedSearchParams}
        page={page}
        pageSize={pageSize}
        total={total}
      />
    </div>
  );
}
