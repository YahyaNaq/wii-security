import Link from "next/link";
import { buildHref } from "../../_lib/build-href";
import { PageSizeSelect } from "./PageSizeSelect";

// Builds a compact page list with ellipsis gaps, e.g. 1 … 4 5 [6] 7 8 … 20.
function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  const delta = 1;
  const pages: number[] = [];

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      pages.push(i);
    }
  }

  const result: (number | "ellipsis")[] = [];
  let previous: number | undefined;
  for (const i of pages) {
    if (previous !== undefined) {
      if (i - previous === 2) result.push(previous + 1);
      else if (i - previous > 2) result.push("ellipsis");
    }
    result.push(i);
    previous = i;
  }
  return result;
}

export function Pagination({
  pathname,
  searchParams,
  page,
  pageSize,
  total,
}: {
  pathname: string;
  searchParams: Record<string, string | string[] | undefined>;
  page: number;
  pageSize: number;
  total: number;
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const navClass = (disabled: boolean) =>
    `rounded-md border border-neutral-800 px-3 py-1.5 ${disabled ? "pointer-events-none opacity-40" : "hover:bg-neutral-900"}`;

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-neutral-400">
      <div className="flex flex-wrap items-center gap-4">
        <p>
          Showing {from}–{to} of {total}
        </p>
        <PageSizeSelect pageSize={pageSize} />
      </div>

      {pageCount > 1 && (
        <div className="flex flex-wrap items-center gap-1">
          <Link
            href={buildHref(pathname, searchParams, { page: "1" })}
            aria-disabled={page <= 1}
            className={navClass(page <= 1)}
          >
            « First
          </Link>
          <Link
            href={buildHref(pathname, searchParams, { page: String(Math.max(1, page - 1)) })}
            aria-disabled={page <= 1}
            className={navClass(page <= 1)}
          >
            Prev
          </Link>

          {getPageNumbers(page, pageCount).map((p, i) =>
            p === "ellipsis" ? (
              <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-neutral-600">
                …
              </span>
            ) : (
              <Link
                key={p}
                href={buildHref(pathname, searchParams, { page: String(p) })}
                aria-current={p === page ? "page" : undefined}
                className={`rounded-md border px-3 py-1.5 ${
                  p === page ? "border-white text-white" : "border-neutral-800 hover:bg-neutral-900"
                }`}
              >
                {p}
              </Link>
            )
          )}

          <Link
            href={buildHref(pathname, searchParams, { page: String(Math.min(pageCount, page + 1)) })}
            aria-disabled={page >= pageCount}
            className={navClass(page >= pageCount)}
          >
            Next
          </Link>
          <Link
            href={buildHref(pathname, searchParams, { page: String(pageCount) })}
            aria-disabled={page >= pageCount}
            className={navClass(page >= pageCount)}
          >
            Last »
          </Link>
        </div>
      )}
    </div>
  );
}
