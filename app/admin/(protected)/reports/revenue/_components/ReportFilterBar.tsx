"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { BookingStatus } from "@prisma/client";
import { buildHref } from "../../../_lib/build-href";
import { SelectField } from "../../../../../components/ui/Select";
import { DateField } from "../../../../../components/ui/DateField";

const ALL = "ALL";

const STATUS_OPTIONS = [
  { value: BookingStatus.ACCEPTED, label: "Accepted" },
  { value: ALL, label: "All statuses" },
  { value: BookingStatus.IN_REVIEW, label: "In review" },
  { value: BookingStatus.REJECTED, label: "Rejected" },
];

const inputClass =
  "rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-sm text-white focus:border-neutral-600 focus:outline-none";
const labelClass = "mb-1 block text-xs text-neutral-400";
const selectTriggerClass = `${inputClass} flex cursor-pointer items-center justify-between gap-2 text-left`;
const selectContentClass =
  "admin-portal z-50 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border border-neutral-800 bg-neutral-900 shadow-lg";
const selectItemClass =
  "relative flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm text-white outline-none data-[highlighted]:bg-neutral-800 data-[state=checked]:font-semibold";
const dateTriggerClass = `${inputClass} flex cursor-pointer items-center justify-between gap-2 text-left`;
const dateContentClass = "admin-portal z-50 rounded-md border border-neutral-800 bg-neutral-900 p-3 shadow-lg";

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
        disabled={false}
        triggerClassName={dateTriggerClass}
        contentClassName={dateContentClass}
      />
      <DateField
        label={<span className={labelClass}>To</span>}
        name="to"
        value={parseIsoDate(to)}
        onValueChange={(date) => update({ to: toIsoDate(date) })}
        disabled={false}
        triggerClassName={dateTriggerClass}
        contentClassName={dateContentClass}
      />
      <SelectField
        label={<span className={labelClass}>City</span>}
        name="city"
        value={city || ALL}
        onValueChange={(value) => update({ city: value === ALL ? null : value })}
        options={[{ value: ALL, label: "All cities" }, ...cityOptions.map((option) => ({ value: option, label: option }))]}
        placeholder="All cities"
        triggerClassName={selectTriggerClass}
        contentClassName={selectContentClass}
        itemClassName={selectItemClass}
      />
      <SelectField
        label={<span className={labelClass}>Event type</span>}
        name="eventType"
        value={eventType || ALL}
        onValueChange={(value) => update({ eventType: value === ALL ? null : value })}
        options={[{ value: ALL, label: "All event types" }, ...eventTypeOptions.map((option) => ({ value: option, label: option }))]}
        placeholder="All event types"
        triggerClassName={selectTriggerClass}
        contentClassName={selectContentClass}
        itemClassName={selectItemClass}
      />
      <SelectField
        label={<span className={labelClass}>Status</span>}
        name="status"
        value={status}
        onValueChange={(value) => update({ status: value })}
        options={STATUS_OPTIONS}
        placeholder="Status"
        triggerClassName={selectTriggerClass}
        contentClassName={selectContentClass}
        itemClassName={selectItemClass}
      />
      <a href={pathname} className="mb-0.5 text-sm text-neutral-400 hover:text-white">
        Reset
      </a>
    </div>
  );
}
