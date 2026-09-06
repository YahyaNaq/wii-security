import { verifyAdminSession } from "../../../../../lib/admin/dal";
import { loadReportData, parseReportFilters } from "../_lib/report-query";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(request: Request) {
  await verifyAdminSession();

  const url = new URL(request.url);
  const searchParams = Object.fromEntries(url.searchParams.entries());
  const filters = parseReportFilters(searchParams);
  const { bookings } = await loadReportData(filters);

  const header = ["Booking ID", "Name", "Status", "Submitted", "Total Amount (PKR)", "Cities", "Event Types"];
  const rows = bookings.map((booking) => [
    booking.id,
    booking.name,
    booking.status,
    booking.createdAt.toISOString(),
    String(booking.totalAmount),
    [...new Set(booking.events.map((e) => e.city))].join("; "),
    [...new Set(booking.events.map((e) => e.eventType))].join("; "),
  ]);

  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="bookings-report-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
