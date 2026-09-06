import { formatPkr, formatDateTime } from "../../../../lib/format";
import { EmptyRow } from "../../_components/table/EmptyRow";
import { ReportFilterBar } from "./_components/ReportFilterBar";
import Button from "../../../_components/Button";
import {
  loadReportData,
  parseReportFilters,
  summarizeByMonth,
  summarizeByField,
  summarizeByService,
} from "./_lib/report-query";

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const filters = parseReportFilters(resolvedSearchParams);
  const { bookings, cityOptions, eventTypeOptions } = await loadReportData(filters);

  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const avgBookingValue = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;

  const monthly = summarizeByMonth(bookings);
  const byCity = summarizeByField(bookings, "city");
  const byEventType = summarizeByField(bookings, "eventType");
  const byService = summarizeByService(bookings);

  const exportQuery = new URLSearchParams();
  if (filters.from) exportQuery.set("from", filters.from);
  if (filters.to) exportQuery.set("to", filters.to);
  if (filters.city) exportQuery.set("city", filters.city);
  if (filters.eventType) exportQuery.set("eventType", filters.eventType);
  exportQuery.set("status", filters.status);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Revenue &amp; Bookings Report</h1>
        <Button href={`/admin/reports/revenue/export?${exportQuery.toString()}`} variant="secondary" size="sm">
          Export CSV
        </Button>
      </div>

      <ReportFilterBar
        from={filters.from}
        to={filters.to}
        city={filters.city}
        eventType={filters.eventType}
        status={filters.status}
        cityOptions={cityOptions}
        eventTypeOptions={eventTypeOptions}
      />

      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-5">
          <p className="text-xs text-neutral-400">Bookings</p>
          <p className="mt-2 text-2xl font-semibold">{totalBookings}</p>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-5">
          <p className="text-xs text-neutral-400">Total revenue</p>
          <p className="mt-2 text-2xl font-semibold">{formatPkr(totalRevenue)}</p>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-5">
          <p className="text-xs text-neutral-400">Average booking value</p>
          <p className="mt-2 text-2xl font-semibold">{formatPkr(avgBookingValue)}</p>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="mb-3 text-sm font-medium text-neutral-300">Revenue by month</h2>
        <div className="overflow-hidden rounded-lg border border-neutral-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-950">
              <tr className="border-b border-neutral-800 text-neutral-400">
                <th className="px-4 py-3 font-medium">Month</th>
                <th className="px-4 py-3 font-medium">Bookings</th>
                <th className="px-4 py-3 font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {monthly.map((row) => (
                <tr key={row.key} className="border-b border-neutral-800 last:border-0">
                  <td className="px-4 py-3">{row.label}</td>
                  <td className="px-4 py-3 text-neutral-400">{row.count}</td>
                  <td className="px-4 py-3 text-neutral-400">{formatPkr(row.total)}</td>
                </tr>
              ))}
              {monthly.length === 0 && <EmptyRow colSpan={3} message="No bookings match these filters." />}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-sm font-medium text-neutral-300">Events by city</h2>
          <div className="overflow-hidden rounded-lg border border-neutral-800">
            <table className="w-full text-left text-sm">
              <tbody>
                {byCity.map(([city, count]) => (
                  <tr key={city} className="border-b border-neutral-800 last:border-0">
                    <td className="px-4 py-3">{city}</td>
                    <td className="px-4 py-3 text-right text-neutral-400">{count}</td>
                  </tr>
                ))}
                {byCity.length === 0 && <EmptyRow colSpan={2} message="No data." />}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-medium text-neutral-300">Events by type</h2>
          <div className="overflow-hidden rounded-lg border border-neutral-800">
            <table className="w-full text-left text-sm">
              <tbody>
                {byEventType.map(([eventType, count]) => (
                  <tr key={eventType} className="border-b border-neutral-800 last:border-0">
                    <td className="px-4 py-3">{eventType}</td>
                    <td className="px-4 py-3 text-right text-neutral-400">{count}</td>
                  </tr>
                ))}
                {byEventType.length === 0 && <EmptyRow colSpan={2} message="No data." />}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-medium text-neutral-300">Events by service</h2>
        <p className="mb-3 text-xs text-neutral-500">
          Counts of events using each service. Booking totals are entered as a single manual amount, so
          revenue cannot be split accurately per service — these are event counts, not revenue shares.
        </p>
        <div className="overflow-hidden rounded-lg border border-neutral-800">
          <table className="w-full text-left text-sm">
            <tbody>
              {byService.map((row) => (
                <tr key={row.label} className="border-b border-neutral-800 last:border-0">
                  <td className="px-4 py-3">{row.label}</td>
                  <td className="px-4 py-3 text-right text-neutral-400">{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-8 text-xs text-neutral-600">
        Showing {bookings.length} booking{bookings.length === 1 ? "" : "s"} submitted{" "}
        {filters.from || filters.to ? "in the selected date range" : "of all time"}, most recent last.
        {bookings.length > 0 && (
          <> Latest: {formatDateTime(bookings[bookings.length - 1].createdAt)}.</>
        )}
      </p>
    </div>
  );
}
