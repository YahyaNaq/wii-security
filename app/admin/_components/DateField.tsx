import { DateField as SiteDateField } from "../../components/ui/DateField";

const triggerClass =
  "flex cursor-pointer items-center justify-between gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-left text-sm text-white focus:border-neutral-600 focus:outline-none";
const contentClass = "admin-portal z-50 rounded-md border border-neutral-800 bg-neutral-900 p-3 shadow-lg";

type Props = Omit<React.ComponentProps<typeof SiteDateField>, "triggerClassName" | "contentClassName">;

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
    />
  );
}
