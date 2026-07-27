import { cn } from "./cn";
import { theme } from "./theme";

export default function Eyebrow({
  as: Tag = "span",
  children,
  className,
}: {
  as?: "span" | "h3";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Tag
      className={cn(
        `text-xs font-semibold uppercase tracking-widest ${theme.text.accent}`,
        className
      )}
    >
      {children}
    </Tag>
  );
}
