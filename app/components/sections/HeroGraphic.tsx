import { theme } from "../ui/theme";

// Hand-drawn style line icons used as decorative doodles around the hero
// centerpiece. Kept as tiny local components so the composition below stays
// readable — each icon is a single-color line drawing that inherits
// `currentColor`, so it themes correctly in light and dark mode.

function ShieldLockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" {...props}>
      <path
        d="M32 6 L54 14 V30 C54 45 44 54 32 58 C20 54 10 45 10 30 V14 Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <rect x="23" y="30" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="2.5" />
      <path d="M27 30 V25 a5 5 0 0 1 10 0 V30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="36" r="1.8" fill="currentColor" />
    </svg>
  );
}

function RingsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 32" fill="none" {...props}>
      <circle cx="18" cy="18" r="10" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="30" cy="18" r="10" stroke="currentColor" strokeWidth="2.5" />
      <path d="M20 8 L24 2 L28 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CameraIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 40" fill="none" {...props}>
      <rect x="4" y="12" width="30" height="22" rx="4" stroke="currentColor" strokeWidth="2.5" />
      <path d="M34 19 L44 13 V33 L34 27" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="19" cy="23" r="6" stroke="currentColor" strokeWidth="2.2" />
      <path d="M12 12 L15 6 H23 L26 12" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  );
}

function FingerprintIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 40" fill="none" {...props}>
      <path d="M20 8 C11 8 6 15 6 22 c0 3 1 6 2 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M20 12 C14 12 10 17 10 22 c0 4 1 7 3 9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M20 16 C17 16 14 19 14 23 c0 4 2 7 4 9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M20 8 c9 0 14 7 14 14 0 4-1 7-2 9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M20 12 c6 0 10 5 10 10 0 4-1 6-2 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function BannerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 48" fill="none" {...props}>
      <path d="M8 4 V44 M8 4 H24 V18 H8" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M4 44 H12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M12 8 H20 M12 12 H18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function HeartLockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 36" fill="none" {...props}>
      <path
        d="M20 33 C6 24 2 16 2 10.5 2 5 6 2 10.5 2 14 2 17 4 20 8 23 4 26 2 29.5 2 34 2 38 5 38 10.5 38 16 34 24 20 33Z"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HeroGraphic() {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
      {/* Dotted orbit guides — the doodles below are pinned to this ring, so
          the layout reads as a deliberate composition rather than scattered
          clip-art. */}
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full text-brand-dark/20"
        aria-hidden="true"
      >
        <circle cx="200" cy="200" r="178" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 10" fill="none" />
      </svg>

      {/* Centerpiece card */}
      <div
        className={`absolute inset-[12%] flex items-center justify-center rounded-[2.5rem] ${theme.gradient.soft} shadow-xl ${theme.shadow.sm}`}
        aria-hidden="true"
      >
        <ShieldLockIcon className="h-28 w-28 text-brand-dark sm:h-32 sm:w-32" strokeWidth={2} />
      </div>

      {/* Orbiting doodles — fixed positions + gentle rotation for a
          hand-placed feel rather than a random scatter. */}
      <div
        className={`absolute left-[2%] top-[8%] flex h-16 w-16 -rotate-6 items-center justify-center rounded-2xl border ${theme.border.solid} bg-surface shadow-lg ${theme.shadow.sm}`}
        aria-hidden="true"
      >
        <CameraIcon className="h-8 w-8 text-brand" />
      </div>

      <div
        className={`absolute -right-2 top-[18%] flex h-14 w-14 rotate-6 items-center justify-center rounded-full border ${theme.border.solid} bg-surface shadow-lg ${theme.shadow.sm}`}
        aria-hidden="true"
      >
        <RingsIcon className="h-6 w-8 text-brand-dark" />
      </div>

      <div
        className={`absolute -left-4 bottom-[26%] flex h-16 w-14 rotate-3 items-center justify-center rounded-2xl border ${theme.border.solid} bg-surface shadow-lg ${theme.shadow.sm}`}
        aria-hidden="true"
      >
        <BannerIcon className="h-9 w-7 text-brand" />
      </div>

      <div
        className={`absolute right-[4%] bottom-[10%] flex h-16 w-16 -rotate-3 items-center justify-center rounded-2xl border ${theme.border.solid} bg-surface shadow-lg ${theme.shadow.sm}`}
        aria-hidden="true"
      >
        <FingerprintIcon className="h-9 w-9 text-brand-dark" />
      </div>

      <div
        className={`absolute left-1/2 bottom-[-4%] flex h-14 w-14 -translate-x-1/2 rotate-6 items-center justify-center rounded-full border ${theme.border.solid} bg-surface shadow-lg ${theme.shadow.sm}`}
        aria-hidden="true"
      >
        <HeartLockIcon className="h-7 w-7 text-brand" />
      </div>

      <SparkleIcon className="absolute right-[16%] top-[2%] h-5 w-5 text-brand-dark/70" aria-hidden="true" />
      <SparkleIcon className="absolute left-[20%] top-[46%] h-4 w-4 text-brand/60" aria-hidden="true" />
      <SparkleIcon className="absolute right-[2%] bottom-[36%] h-4 w-4 text-brand-dark/50" aria-hidden="true" />
    </div>
  );
}
