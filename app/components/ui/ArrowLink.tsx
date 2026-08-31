import { cn } from "./cn";
import { theme } from "./theme";

type ArrowLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  className?: string;
  children: React.ReactNode;
};

export default function ArrowLink({ className, children, ...props }: ArrowLinkProps) {
  return (
    <a
      className={cn(
        `inline-flex items-center gap-1 text-sm font-semibold ${theme.text.accent} hover:opacity-80`,
        className
      )}
      {...props}
    >
      {children}
      <span aria-hidden="true">&rarr;</span>
    </a>
  );
}
