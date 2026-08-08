// Builds a URL for the current admin list page with some searchParams overridden.
export function buildHref(
  pathname: string,
  current: Record<string, string | string[] | undefined>,
  overrides: Record<string, string | null>
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(current)) {
    if (typeof value === "string") params.set(key, value);
  }

  for (const [key, value] of Object.entries(overrides)) {
    if (value === null) params.delete(key);
    else params.set(key, value);
  }

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
