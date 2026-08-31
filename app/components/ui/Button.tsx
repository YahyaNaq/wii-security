import { cn } from "./cn";
import { theme } from "./theme";

type CommonProps = {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "compact";
  shadow?: "none" | "sm" | "md";
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
  primary: "bg-brand text-white hover:bg-brand-dark",
  secondary: `border ${theme.border.accent} ${theme.text.accent} hover:bg-blush`,
};

const sizes = {
  sm: "px-6 py-2.5 text-sm",
  compact: "px-6 py-3.5 text-sm",
  md: "px-8 py-3.5 text-sm",
};

const shadows = {
  none: "",
  sm: `shadow-sm ${theme.shadow.lg}`,
  md: `shadow-md ${theme.shadow.lg}`,
};

export default function Button({
  variant = "primary",
  size = "md",
  shadow = "none",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex cursor-pointer items-center justify-center rounded-full text-center font-semibold transition-colors",
    variants[variant],
    sizes[size],
    shadows[shadow],
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
