import { SelectField } from "../../components/ui/Select";
import { cn } from "../../components/ui/cn";

const SIZES = {
  xs: "px-2 py-1 text-sm",
  sm: "px-3 py-1.5 text-sm",
};

const contentClass =
  "admin-portal z-50 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border border-neutral-800 bg-neutral-900 shadow-lg";
const itemClass =
  "relative flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm text-white outline-none data-[highlighted]:bg-neutral-800 data-[state=checked]:font-semibold";
const labelWrapperClass = "flex min-w-0 flex-col gap-1";

type SelectFieldProps = React.ComponentProps<typeof SelectField>;

type Props = Omit<
  SelectFieldProps,
  "triggerClassName" | "contentClassName" | "itemClassName" | "labelClassName"
> & {
  size?: keyof typeof SIZES;
  fullWidth?: boolean;
};

// Admin-dark-theme wrapper around the site's Radix-based SelectField. Keeps the
// override class strings in one place instead of retyped at every call site.
export function Select({ size = "sm", fullWidth, ...props }: Props) {
  return (
    <SelectField
      {...props}
      triggerClassName={cn(
        "flex cursor-pointer items-center justify-between gap-2 rounded-md border border-neutral-800 bg-neutral-900 text-left text-white focus:border-neutral-600 focus:outline-none",
        SIZES[size],
        fullWidth && "w-full"
      )}
      contentClassName={contentClass}
      itemClassName={itemClass}
      labelClassName={labelWrapperClass}
    />
  );
}
