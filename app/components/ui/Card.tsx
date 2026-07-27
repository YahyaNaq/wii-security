import { cn } from "./cn";
import { theme } from "./theme";

const radii = {
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
};

export default function Card({
  radius = "3xl",
  padding = "p-8",
  center = false,
  hover = false,
  className,
  children,
}: {
  radius?: "2xl" | "3xl";
  padding?: string;
  center?: boolean;
  hover?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        radii[radius],
        `border ${theme.border.subtle} ${theme.surface} shadow-sm ${theme.shadow.xs}`,
        padding,
        center && "text-center",
        hover &&
          "transition-transform hover:-translate-y-1 hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}
