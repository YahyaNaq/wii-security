import { prisma } from "../../../lib/db";
import { formatPkr } from "../../../lib/format";
import BookingStatusActions from "./BookingStatusActions";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { events: true },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Bookings</h1>

      <div className="overflow-x-auto rounded-lg border border-neutral-800">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-800 text-neutral-400">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Events</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-neutral-800 last:border-0">
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
                  <BookingStatusActions bookingId={booking.id} status={booking.status} />
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td className="px-4 py-3 text-neutral-500" colSpan={6}>
                  No bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
