"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { BookingStatus } from "@prisma/client";
import { buildHref } from "../../../_lib/build-href";
import { Select } from "../../../../_components/Select";
import { DateField } from "../../../../_components/DateField";
import Button from "../../../../_components/Button";

const ALL = "ALL";

const STATUS_OPTIONS = [
  { value: BookingStatus.ACCEPTED, label: "Accepted" },
  { value: ALL, label: "All statuses" },
  { value: BookingStatus.IN_REVIEW, label: "In review" },
  { value: BookingStatus.REJECTED, label: "Rejected" },
];

const labelClass = "mb-1 block text-xs text-neutral-400";

function parseIsoDate(value: string): Date | undefined {
  return value ? new Date(`${value}T00:00:00`) : undefined;
}

function toIsoDate(date: Date | undefined): string | null {
  if (!date) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function ReportFilterBar({
  from,
  to,
  city,
  eventType,
  status,
  cityOptions,
  eventTypeOptions,
}: {
  from: string;
  to: string;
  city: string;
  eventType: string;
  status: string;
  cityOptions: string[];
  eventTypeOptions: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const update = (overrides: Record<string, string | null>) => {
    const current = Object.fromEntries(searchParams.entries());
    router.push(buildHref(pathname, current, overrides));
  };

  return (
    <div className="mb-8 flex flex-wrap items-end gap-4 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
      <DateField
        label={<span className={labelClass}>From</span>}
        name="from"
        value={parseIsoDate(from)}
        onValueChange={(date) => update({ from: toIsoDate(date) })}
      />
      <DateField
        label={<span className={labelClass}>To</span>}
        name="to"
        value={parseIsoDate(to)}
        onValueChange={(date) => update({ to: toIsoDate(date) })}
      />
      <Select
        label={<span className={labelClass}>City</span>}
        name="city"
        value={city || ALL}
        onValueChange={(value) => update({ city: value === ALL ? null : value })}
        options={[{ value: ALL, label: "All cities" }, ...cityOptions.map((option) => ({ value: option, label: option }))]}
        placeholder="All cities"
      />
      <Select
        label={<span className={labelClass}>Event type</span>}
        name="eventType"
        value={eventType || ALL}
        onValueChange={(value) => update({ eventType: value === ALL ? null : value })}
        options={[{ value: ALL, label: "All event types" }, ...eventTypeOptions.map((option) => ({ value: option, label: option }))]}
        placeholder="All event types"
      />
      <Select
        label={<span className={labelClass}>Status</span>}
        name="status"
        value={status}
        onValueChange={(value) => update({ status: value })}
        options={STATUS_OPTIONS}
        placeholder="Status"
      />
      <Button href={pathname} variant="secondary" size="sm">
        Reset
      </Button>
    </div>
  );
}
