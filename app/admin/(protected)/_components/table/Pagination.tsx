import Link from "next/link";
import { buildHref } from "../../_lib/build-href";

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
  if (pageCount <= 1) return null;

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="mt-4 flex items-center justify-between text-sm text-neutral-400">
      <p>
        Showing {from}–{to} of {total}
      </p>
      <div className="flex gap-2">
        <Link
          href={buildHref(pathname, searchParams, { page: String(Math.max(1, page - 1)) })}
          aria-disabled={page <= 1}
          className={`rounded-md border border-neutral-800 px-3 py-1.5 ${
            page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-neutral-900"
          }`}
        >
          Prev
        </Link>
        <span className="px-2 py-1.5 text-neutral-500">
          {page} / {pageCount}
        </span>
        <Link
          href={buildHref(pathname, searchParams, { page: String(Math.min(pageCount, page + 1)) })}
          aria-disabled={page >= pageCount}
          className={`rounded-md border border-neutral-800 px-3 py-1.5 ${
            page >= pageCount ? "pointer-events-none opacity-40" : "hover:bg-neutral-900"
          }`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
