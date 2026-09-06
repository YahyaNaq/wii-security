"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { BookingStatus } from "@prisma/client";
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

function toIsoDate(date: Date | undefined): string {
  if (!date) return "";
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

  const [draft, setDraft] = useState({ from, to, city: city || ALL, eventType: eventType || ALL, status });

  const applyHref = (() => {
    const params = new URLSearchParams();
    if (draft.from) params.set("from", draft.from);
    if (draft.to) params.set("to", draft.to);
    if (draft.city !== ALL) params.set("city", draft.city);
    if (draft.eventType !== ALL) params.set("eventType", draft.eventType);
    params.set("status", draft.status);
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  })();

  return (
    <div className="mb-8 flex flex-wrap items-end gap-4 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
      <DateField
        label={<span className={labelClass}>From</span>}
        name="from"
        value={parseIsoDate(draft.from)}
        onValueChange={(date) => setDraft((d) => ({ ...d, from: toIsoDate(date) }))}
      />
      <DateField
        label={<span className={labelClass}>To</span>}
        name="to"
        value={parseIsoDate(draft.to)}
        onValueChange={(date) => setDraft((d) => ({ ...d, to: toIsoDate(date) }))}
      />
      <Select
        label={<span className={labelClass}>City</span>}
        name="city"
        value={draft.city}
        onValueChange={(value) => setDraft((d) => ({ ...d, city: value }))}
        options={[{ value: ALL, label: "All cities" }, ...cityOptions.map((option) => ({ value: option, label: option }))]}
        placeholder="All cities"
      />
      <Select
        label={<span className={labelClass}>Event type</span>}
        name="eventType"
        value={draft.eventType}
        onValueChange={(value) => setDraft((d) => ({ ...d, eventType: value }))}
        options={[{ value: ALL, label: "All event types" }, ...eventTypeOptions.map((option) => ({ value: option, label: option }))]}
        placeholder="All event types"
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
