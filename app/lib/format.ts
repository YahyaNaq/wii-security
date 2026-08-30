// Shared display formatting so currency and dates read the same everywhere
// on the site (forms, PDFs, review screens).
export function formatAmount(amount: number): string {
  return amount.toLocaleString("en-PK");
}

export function formatPkr(amount: number): string {
  return `PKR ${formatAmount(amount)}`;
}

export function formatDateLong(date: Date): string {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function formatDateShort(date: Date): string {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(date: Date): string {
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
