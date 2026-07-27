import { theme } from "./theme";

export default function SuccessBadge() {
  return (
    <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-blush ${theme.text.accent}`}>
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
        <path d="M5 13l5 5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
