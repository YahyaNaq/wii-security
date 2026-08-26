"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { buildHref } from "../../_lib/build-href";
import { PAGE_SIZE_OPTIONS } from "../../_lib/list-params";
import { SelectField } from "../../../../components/ui/Select";

export function PageSizeSelect({ pageSize }: { pageSize: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="flex items-center gap-2 text-neutral-500">
      Rows per page
      <SelectField
        label=""
        name="pageSize"
        value={String(pageSize)}
        onValueChange={(value) => {
          const current = Object.fromEntries(searchParams.entries());
          router.push(buildHref(pathname, current, { pageSize: value, page: null }));
        }}
        options={PAGE_SIZE_OPTIONS.map((size) => ({ value: String(size), label: String(size) }))}
        placeholder="Page size"
        triggerClassName="rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1 text-sm text-white focus:border-neutral-600 focus:outline-none flex cursor-pointer items-center justify-between gap-2 text-left"
        contentClassName="z-50 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border border-neutral-800 bg-neutral-900 shadow-lg"
        itemClassName="relative flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm text-white outline-none data-[highlighted]:bg-neutral-800 data-[state=checked]:font-semibold"
      />
    </div>
  );
}
