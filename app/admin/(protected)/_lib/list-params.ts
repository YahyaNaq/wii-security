export type SortDir = "asc" | "desc";

export type ListParams = {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
  sort: string;
  dir: SortDir;
  q: string;
};

// Shared parsing for admin list pages: page/sort/dir/q searchParams -> Prisma-ready values.
export function parseListParams(
  searchParams: Record<string, string | string[] | undefined>,
  options: { allowedSort: readonly string[]; defaultSort: string; pageSize?: number }
): ListParams {
  const single = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const pageSize = options.pageSize ?? 20;
  const rawPage = Number(single("page"));
  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;

  const rawSort = single("sort");
  const sort = rawSort && options.allowedSort.includes(rawSort) ? rawSort : options.defaultSort;

  const dir: SortDir = single("dir") === "asc" ? "asc" : "desc";

  const q = single("q")?.trim() ?? "";

  return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize, sort, dir, q };
}
