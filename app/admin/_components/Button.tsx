import { cn } from "../../components/ui/cn";

type CommonProps = {
  variant?: "primary" | "secondary" | "success" | "danger";
  size?: "xs" | "sm" | "md";
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
};

type LinkProps = CommonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type NativeButtonProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonProps = LinkProps | NativeButtonProps;

const variants = {
  primary: "bg-white text-neutral-950 hover:bg-neutral-200",
  secondary: "border border-neutral-800 text-neutral-300 hover:bg-neutral-900 hover:text-white",
  success: "bg-emerald-600 text-white hover:bg-emerald-500",
  danger: "border border-red-900 text-red-400 hover:bg-red-950",
};

const sizes = {
  xs: "px-2.5 py-1 text-xs",
  sm: "px-3 py-1.5 text-sm",
  md: "px-3 py-2 text-sm",
};

// Shared admin-portal button. Kept separate from the public site's <Button> in
// components/ui/Button.tsx, which is styled for the marketing brand (rounded-full,
// brand colors) rather than this dark, dense admin UI.
export default function Button({
  variant = "secondary",
  size = "sm",
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className
  );

  if (props.href) {
    return (
      <a className={classes} {...(props as LinkProps)}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(props as NativeButtonProps)}>
      {children}
    </button>
  );
}
