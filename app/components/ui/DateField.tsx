"use client";

import { useId, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { DayPicker, type ClassNames, type Matcher } from "react-day-picker";
import { FieldLabel, fieldClasses } from "./fields";
import { theme } from "./theme";
import { cn } from "./cn";
import { formatDateShort } from "../../lib/format";

const defaultCalendarClassNames: Partial<ClassNames> = {
  months: "relative flex flex-col",
  month: "space-y-3",
  month_caption: "flex items-center justify-center pt-1 pb-2",
  caption_label: `font-display text-sm font-semibold ${theme.text.accent}`,
  nav: "flex items-center justify-between absolute inset-x-1 top-1",
  button_previous: `flex h-7 w-7 items-center justify-center rounded-full hover:bg-blush ${theme.text.accent} disabled:opacity-30`,
  button_next: `flex h-7 w-7 items-center justify-center rounded-full hover:bg-blush ${theme.text.accent} disabled:opacity-30`,
  chevron: "h-3.5 w-3.5 fill-current",
  month_grid: "w-full border-collapse",
  weekdays: "flex",
  weekday: "w-9 text-center text-[11px] font-medium uppercase text-foreground/40",
  week: "mt-1 flex w-full",
  day: "relative h-9 w-9 p-0 text-center text-sm",
  day_button:
    "h-9 w-9 cursor-pointer rounded-full text-sm font-normal text-foreground transition-colors hover:bg-blush disabled:cursor-not-allowed disabled:text-foreground/25 disabled:hover:bg-transparent",
  selected: `[&>button]:bg-brand [&>button]:text-white [&>button]:font-semibold [&>button]:hover:bg-brand-dark`,
  today: `[&>button]:${theme.text.accent} [&>button]:font-semibold`,
  outside: "text-foreground/30",
  disabled: "",
  hidden: "invisible",
};

export function DateField({
  label,
  name,
  required,
  error,
  placeholder = "Select a date",
  value,
  onValueChange,
  disabled = { before: new Date() },
  triggerClassName,
  contentClassName,
  labelClassName,
  calendarClassNames,
}: {
  label: React.ReactNode;
  name: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  value?: Date;
  onValueChange?: (date: Date | undefined) => void;
  // Dates the calendar won't let you pick. Defaults to "no past dates", which
  // fits the booking forms this was built for; pass `false` to allow any date
  // (e.g. filtering a report by a historical date range).
  disabled?: Matcher | Matcher[];
  // Full overrides (not merged) for callers whose surrounding UI doesn't use the brand theme tokens.
  triggerClassName?: string;
  contentClassName?: string;
  labelClassName?: string;
  calendarClassNames?: Partial<ClassNames>;
}) {
  const [internalDate, setInternalDate] = useState<Date | undefined>();
  const date = value !== undefined ? value : internalDate;
  const setDate = onValueChange ?? setInternalDate;
  const [open, setOpen] = useState(false);
  const id = useId();

  const formatted = date ? formatDateShort(date) : "";
  const isoValue = date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    : "";

  return (
    <FieldLabel label={label} error={error} className={labelClassName}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          id={id}
          type="button"
          className={
            triggerClassName ??
            cn(
              fieldClasses(!!error),
              "flex cursor-pointer items-center justify-between gap-2 text-left",
              !date && "text-foreground/40"
            )
          }
        >
          {formatted || placeholder}
          <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-foreground/40" fill="none">
            <rect x="3" y="4.5" width="14" height="12.5" rx="2" stroke="currentColor" strokeWidth="1.4" />
            <path d="M3 8H17" stroke="currentColor" strokeWidth="1.4" />
            <path d="M6.5 3V5.5M13.5 3V5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            side="bottom"
            align="start"
            sideOffset={6}
            avoidCollisions={false}
            className={
              contentClassName ??
              `z-50 rounded-xl border ${theme.border.solid} ${theme.surface} p-3 shadow-lg ${theme.shadow.sm}`
            }
          >
            <DayPicker
              mode="single"
              selected={date}
              onSelect={(d) => {
                setDate(d);
                setOpen(false);
              }}
              disabled={disabled}
              classNames={calendarClassNames ?? defaultCalendarClassNames}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <input type="hidden" name={name} value={isoValue} required={required} />
    </FieldLabel>
  );
}
