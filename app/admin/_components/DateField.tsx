import type { ClassNames } from "react-day-picker";
import { DateField as SiteDateField } from "../../components/ui/DateField";

const triggerClass =
  "flex cursor-pointer items-center justify-between gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-left text-sm text-white focus:border-neutral-600 focus:outline-none";
const contentClass = "admin-portal z-50 rounded-md border border-neutral-800 bg-neutral-900 p-3 shadow-lg";

// Mirrors the site's default calendar look, but swapped off the brand pink theme
// tokens (blush/brand) onto the neutral-800/900 palette the rest of admin uses.
const calendarClassNames: Partial<ClassNames> = {
  months: "relative flex flex-col",
  month: "space-y-3",
  month_caption: "flex items-center justify-center pt-1 pb-2",
  caption_label: "text-sm font-semibold text-white",
  nav: "flex items-center justify-between absolute inset-x-1 top-1",
  button_previous: "flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-800 hover:text-white disabled:opacity-30",
  button_next: "flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-800 hover:text-white disabled:opacity-30",
  chevron: "h-3.5 w-3.5 fill-current",
  month_grid: "w-full border-collapse",
  weekdays: "flex",
  weekday: "w-9 text-center text-[11px] font-medium uppercase text-neutral-500",
  week: "mt-1 flex w-full",
  day: "relative h-9 w-9 p-0 text-center text-sm",
  day_button:
    "h-9 w-9 cursor-pointer rounded-full text-sm font-normal text-neutral-200 transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:text-neutral-700 disabled:hover:bg-transparent",
  selected: "[&>button]:bg-white [&>button]:text-neutral-950 [&>button]:font-semibold [&>button]:hover:bg-neutral-200",
  today: "[&>button]:text-white [&>button]:font-semibold",
  outside: "text-neutral-700",
  disabled: "",
  hidden: "invisible",
};

type Props = Omit<
  React.ComponentProps<typeof SiteDateField>,
  "triggerClassName" | "contentClassName" | "calendarClassNames"
>;

// Admin-dark-theme wrapper around the site's DateField. The site defaults to
// blocking past dates (booking future events) — admin usually wants the opposite
// (filtering past records), so this defaults `disabled` to "allow any date"
// instead, while still letting a caller override it either way.
export function DateField({ disabled = false, ...props }: Props) {
  return (
    <SiteDateField
      {...props}
      disabled={disabled}
      triggerClassName={triggerClass}
      contentClassName={contentClass}
      calendarClassNames={calendarClassNames}
    />
  );
}
