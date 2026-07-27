export default function ReviewField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-medium uppercase tracking-wide text-foreground/45">{label}</dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  );
}
