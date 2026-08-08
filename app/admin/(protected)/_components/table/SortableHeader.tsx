import Link from "next/link";
import { buildHref } from "../../_lib/build-href";
import type { SortDir } from "../../_lib/list-params";

export function SortableHeader({
  pathname,
  searchParams,
  sortKey,
  activeSort,
  activeDir,
  children,
}: {
  pathname: string;
  searchParams: Record<string, string | string[] | undefined>;
  sortKey: string;
  activeSort: string;
  activeDir: SortDir;
  children: React.ReactNode;
}) {
  const isActive = activeSort === sortKey;
  const nextDir: SortDir = isActive && activeDir === "desc" ? "asc" : "desc";
  const href = buildHref(pathname, searchParams, { sort: sortKey, dir: nextDir, page: null });

  return (
    <Link href={href} className="inline-flex items-center gap-1 hover:text-white">
      {children}
      <span className="text-[10px] text-neutral-600">
        {isActive ? (activeDir === "desc" ? "▼" : "▲") : "↕"}
      </span>
    </Link>
  );
}
