// Color palette for generated PDFs. Mirrors the brand tokens defined in
// app/globals.css (light theme) — PDFs are a static, printed document, so
// there's no dark-mode variant to account for. Neutral tones with no
// equivalent CSS variable are defined here so every color used in the PDF
// has a single, named source instead of being hardcoded inline.
export const colors = {
  brand: "#d6688b",
  brandDark: "#b8496a",
  brandLight: "#f7d9e2",
  brandSoft: "#e0688f",
  brandTint: "#f3a8c1",
  blush: "#fdf1f4",
  surface: "#ffffff",
  brandLightTint: "rgba(247, 217, 226, 0.5)",
  text: "#1a1a1a",
  textMuted: "#555555",
  textSubtle: "#999999",
  footerText: "#424242",
  white: "#ffffff",
} as const;
