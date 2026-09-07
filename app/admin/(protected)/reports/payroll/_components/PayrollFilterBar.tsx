"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SalaryStatus } from "@prisma/client";
import { Select } from "../../../../_components/Select";
import Button from "../../../../_components/Button";
import { MONTH_LABELS } from "../_lib/report-query";

const ALL = "ALL";

const STATUS_OPTIONS = [
  { value: ALL, label: "All statuses" },
  { value: SalaryStatus.RELEASED, label: "Released" },
  { value: SalaryStatus.PENDING, label: "Pending" },
];

const labelClass = "mb-1 block text-xs text-neutral-400";

export function PayrollFilterBar({
  year,
  month,
  status,
  availableYears,
}: {
  year: number;
  month: number;
  status: string;
  availableYears: number[];
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [draft, setDraft] = useState({ year: String(year), month: String(month), status });

  const applyHref = (() => {
    const params = new URLSearchParams();
    params.set("year", draft.year);
    params.set("month", draft.month);
    params.set("status", draft.status);
    return `${pathname}?${params.toString()}`;
  })();

  return (
    <div className="mb-8 flex flex-wrap items-end gap-4 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
      <Select
        label={<span className={labelClass}>Month</span>}
        name="month"
        value={draft.month}
        onValueChange={(value) => setDraft((d) => ({ ...d, month: value }))}
        options={MONTH_LABELS.map((label, index) => ({ value: String(index + 1), label }))}
        placeholder="Month"
      />
      <Select
        label={<span className={labelClass}>Year</span>}
        name="year"
        value={draft.year}
        onValueChange={(value) => setDraft((d) => ({ ...d, year: value }))}
        options={availableYears.map((y) => ({ value: String(y), label: String(y) }))}
        placeholder="Year"
      />
      <Select
        label={<span className={labelClass}>Status</span>}
        name="status"
        value={draft.status}
        onValueChange={(value) => setDraft((d) => ({ ...d, status: value }))}
        options={STATUS_OPTIONS}
        placeholder="Status"
      />
      <Button type="button" onClick={() => router.push(applyHref)} variant="primary" size="sm">
        Apply
      </Button>
      <Button href={pathname} variant="ghost" size="sm">
        Reset
      </Button>
    </div>
  );
}
