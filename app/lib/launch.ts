// Site-wide launch gate: the public (site) pages show a countdown until this
// moment, then reveal automatically. Admin routes are unaffected.
export const LAUNCH_AT = "2026-09-19T18:00:00+05:00";

export function isLaunched(now: Date = new Date()) {
  return now.getTime() >= new Date(LAUNCH_AT).getTime();
}
