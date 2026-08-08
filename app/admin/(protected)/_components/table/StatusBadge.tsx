const TONE_CLASSES = {
  neutral: "border-neutral-700 text-neutral-300",
  amber: "border-amber-800 text-amber-400",
  emerald: "border-emerald-800 text-emerald-400",
  red: "border-red-900 text-red-400",
} as const;

export function StatusBadge({ label, tone }: { label: string; tone: keyof typeof TONE_CLASSES }) {
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs ${TONE_CLASSES[tone]}`}>
      {label}
    </span>
  );
}
