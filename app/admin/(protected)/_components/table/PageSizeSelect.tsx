"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { buildHref } from "../../_lib/build-href";
import { PAGE_SIZE_OPTIONS } from "../../_lib/list-params";

export function PageSizeSelect({ pageSize }: { pageSize: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <label className="flex items-center gap-2 text-neutral-500">
      Rows per page
      <select
        value={pageSize}
        onChange={(event) => {
          const current = Object.fromEntries(searchParams.entries());
          router.push(buildHref(pathname, current, { pageSize: event.target.value, page: null }));
        }}
        className="rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1 text-sm text-white focus:border-neutral-600 focus:outline-none"
      >
        {PAGE_SIZE_OPTIONS.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </label>
  );
}
