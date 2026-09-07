import { verifyAdminSession } from "../../../../../lib/admin/dal";
import { adminFilenames } from "../../../../../lib/filenames";
import { loadPayrollData, parsePayrollFilters, MONTH_LABELS } from "../_lib/report-query";

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
  const filters = parsePayrollFilters(searchParams);
  const { rows } = await loadPayrollData(filters);

  const header = ["Employee", "Job Title", "Gigs", "Amount (PKR)", "Bonus (PKR)", "Status", "Released At"];
  const csvRows = rows.map((row) => [
    row.name,
    row.jobTitle,
    String(row.gigCount),
    String(row.amount),
    String(row.bonus),
    row.status,
    row.releasedAt ? row.releasedAt.toISOString() : "",
  ]);

  const csv = [header, ...csvRows].map((row) => row.map(csvEscape).join(",")).join("\r\n");
  const periodLabel = `${MONTH_LABELS[filters.month - 1]}-${filters.year}`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${adminFilenames.payrollReportCsv(periodLabel)}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
