import { BookingStatus } from "@prisma/client";
import { prisma } from "../../lib/db";
import { formatPkr } from "../../lib/format";

export default async function AdminDashboardPage() {
  const [quoteCount, bookingCount, bookingsByStatus, quoteTotal, recentQuotes, recentBookings] =
    await Promise.all([
      prisma.quoteRequest.count(),
      prisma.booking.count(),
      prisma.booking.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.quoteRequest.aggregate({ _sum: { totalAmount: true } }),
      prisma.quoteRequest.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, totalAmount: true, createdAt: true },
      }),
      prisma.booking.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, totalAmount: true, status: true, createdAt: true },
      }),
    ]);

  const statusCounts = Object.fromEntries(
    bookingsByStatus.map((row) => [row.status, row._count._all])
  ) as Partial<Record<BookingStatus, number>>;

  const stats = [
    { label: "Quote requests", value: quoteCount },
    { label: "Bookings", value: bookingCount },
    { label: "Bookings in review", value: statusCounts[BookingStatus.IN_REVIEW] ?? 0 },
    { label: "Quoted value", value: formatPkr(quoteTotal._sum.totalAmount ?? 0) },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Dashboard</h1>

      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-neutral-800 bg-neutral-900 p-5">
            <p className="text-xs text-neutral-400">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-sm font-medium text-neutral-300">Recent quote requests</h2>
          <div className="overflow-hidden rounded-lg border border-neutral-800">
            <table className="w-full text-sm">
              <tbody>
                {recentQuotes.map((quote) => (
                  <tr key={quote.id} className="border-b border-neutral-800 last:border-0">
                    <td className="px-4 py-3">{quote.name}</td>
                    <td className="px-4 py-3 text-neutral-400">{formatPkr(quote.totalAmount)}</td>
                    <td className="px-4 py-3 text-right text-neutral-500">
                      {quote.createdAt.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {recentQuotes.length === 0 && (
                  <tr>
                    <td className="px-4 py-3 text-neutral-500">No quote requests yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-medium text-neutral-300">Recent bookings</h2>
          <div className="overflow-hidden rounded-lg border border-neutral-800">
            <table className="w-full text-sm">
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-neutral-800 last:border-0">
                    <td className="px-4 py-3">{booking.name}</td>
                    <td className="px-4 py-3 text-neutral-400">{booking.status}</td>
                    <td className="px-4 py-3 text-right text-neutral-500">
                      {booking.createdAt.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {recentBookings.length === 0 && (
                  <tr>
                    <td className="px-4 py-3 text-neutral-500">No bookings yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
