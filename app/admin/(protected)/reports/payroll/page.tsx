import { SalaryStatus } from "@prisma/client";
import { formatPkr } from "../../../../lib/format";
import { EmptyRow } from "../../_components/table/EmptyRow";
import { StatusBadge } from "../../_components/table/StatusBadge";
import { PayrollFilterBar } from "./_components/PayrollFilterBar";
import Button from "../../../_components/Button";
import { loadPayrollData, parsePayrollFilters, MONTH_LABELS } from "./_lib/report-query";

export default async function AdminPayrollReportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const filters = parsePayrollFilters(resolvedSearchParams);
  const { rows, availableYears } = await loadPayrollData(filters);

  const totalAmount = rows.reduce((sum, row) => sum + row.amount, 0);
  const releasedAmount = rows
    .filter((row) => row.status === SalaryStatus.RELEASED)
    .reduce((sum, row) => sum + row.amount, 0);
  const pendingAmount = totalAmount - releasedAmount;
  const totalGigs = rows.reduce((sum, row) => sum + row.gigCount, 0);

  const periodLabel = `${MONTH_LABELS[filters.month - 1]} ${filters.year}`;

  const exportQuery = new URLSearchParams();
  exportQuery.set("year", String(filters.year));
  exportQuery.set("month", String(filters.month));
  exportQuery.set("status", filters.status);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Staffing & Payroll Report</h1>
        <Button href={`/admin/reports/payroll/export?${exportQuery.toString()}`} variant="secondary" size="sm">
          Export CSV
        </Button>
      </div>

      <PayrollFilterBar
        year={filters.year}
        month={filters.month}
        status={filters.status}
        availableYears={availableYears}
      />

      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-5">
          <p className="text-xs text-neutral-400">Employees paid</p>
          <p className="mt-2 text-2xl font-semibold">{rows.length}</p>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-5">
          <p className="text-xs text-neutral-400">Total gigs</p>
          <p className="mt-2 text-2xl font-semibold">{totalGigs}</p>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-5">
          <p className="text-xs text-neutral-400">Released</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-400">{formatPkr(releasedAmount)}</p>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-5">
          <p className="text-xs text-neutral-400">Pending</p>
          <p className="mt-2 text-2xl font-semibold text-amber-400">{formatPkr(pendingAmount)}</p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium text-neutral-300">{periodLabel} — by employee</h2>
        <div className="overflow-hidden rounded-lg border border-neutral-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-950">
              <tr className="border-b border-neutral-800 text-neutral-400">
                <th className="px-4 py-3 font-medium">Employee</th>
                <th className="px-4 py-3 font-medium">Job Title</th>
                <th className="px-4 py-3 font-medium">Gigs</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.employeeId} className="border-b border-neutral-800 last:border-0">
                  <td className="px-4 py-3">{row.name}</td>
                  <td className="px-4 py-3 text-neutral-400">{row.jobTitle}</td>
                  <td className="px-4 py-3 text-neutral-400">{row.gigCount}</td>
                  <td className="px-4 py-3 text-neutral-400">{formatPkr(row.amount)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      label={row.status === SalaryStatus.RELEASED ? "Released" : "Pending"}
                      tone={row.status === SalaryStatus.RELEASED ? "emerald" : "amber"}
                    />
                  </td>
                </tr>
              ))}
              {rows.length === 0 && <EmptyRow colSpan={5} message="No payroll activity for this period." />}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-xs text-neutral-600">
        Release salary for an employee from Employee Management → Employees → Manage Salary. This report is
        read-only.
      </p>
    </div>
  );
}
