import { cn } from "./cn";
import { theme } from "./theme";

export default function IconBadge({
  size = "h-14 w-14",
  shape = "rounded-2xl",
  center = false,
  className,
  children,
}: {
  size?: string;
  shape?: "rounded-full" | "rounded-2xl";
  center?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        `flex items-center justify-center bg-brand-light/70 ${theme.text.accent}`,
        size,
        shape,
        center && "mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
}
