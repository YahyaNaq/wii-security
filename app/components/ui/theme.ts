// Central source of truth for recurring brand styling (borders, shadows,
// gradients, text accents). Components should reference these tokens
// instead of inlining the raw utility classes, so the theme can be
// retuned from one place.
export const theme = {
  border: {
    subtle: "border-brand-light/70",
    subtleNav: "border-brand-light/60",
    solid: "border-brand-light",
    accent: "border-brand-dark/30",
    accentStrong: "border-brand-dark/40",
  },
  divider: "border-t border-brand-light/70",
  shadow: {
    xs: "shadow-brand/5",
    sm: "shadow-brand/10",
    md: "shadow-brand/20",
    lg: "shadow-brand/30",
  },
  gradient: {
    soft: "bg-gradient-to-br from-brand-light via-blush to-surface",
    brand: "bg-gradient-to-br from-brand to-brand-dark",
  },
  text: {
    accent: "text-brand-dark",
    hoverAccent: "hover:text-brand-dark",
  },
  surface: "bg-surface",
  focusRing: "outline-none focus:border-brand",
} as const;
