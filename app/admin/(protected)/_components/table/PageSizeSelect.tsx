"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { buildHref } from "../../_lib/build-href";
import { PAGE_SIZE_OPTIONS } from "../../_lib/list-params";
import { Select } from "../../../_components/Select";

export function PageSizeSelect({ pageSize }: { pageSize: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="flex items-center gap-2 text-neutral-500">
      Rows per page
      <Select
        label=""
        name="pageSize"
        value={String(pageSize)}
        onValueChange={(value) => {
          const current = Object.fromEntries(searchParams.entries());
          router.push(buildHref(pathname, current, { pageSize: value, page: null }));
        }}
        options={PAGE_SIZE_OPTIONS.map((size) => ({ value: String(size), label: String(size) }))}
        placeholder="Page size"
        size="xs"
      />
    </div>
  );
}
