import { Prisma } from "@prisma/client";
import { prisma } from "../../../lib/db";
import { formatPkr } from "../../../lib/format";
import { parseListParams } from "../_lib/list-params";
import { SortableHeader } from "../_components/table/SortableHeader";
import { Pagination } from "../_components/table/Pagination";
import { SearchInput } from "../_components/table/SearchInput";
import { EmptyRow } from "../_components/table/EmptyRow";
import { QuoteRowActions } from "./QuoteRowActions";

const ALLOWED_SORT = ["name", "totalAmount", "createdAt"] as const;

export default async function AdminQuotesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const { page, pageSize, skip, take, sort, dir, q } = parseListParams(resolvedSearchParams, {
    allowedSort: ALLOWED_SORT,
    defaultSort: "createdAt",
  });

  const where: Prisma.QuoteRequestWhereInput = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { phone: { contains: q } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const [quotes, total] = await Promise.all([
    prisma.quoteRequest.findMany({
      where,
      orderBy: { [sort]: dir },
      skip,
      take,
      include: { events: true },
    }),
    prisma.quoteRequest.count({ where }),
  ]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quote Requests</h1>
        <SearchInput placeholder="Search by name, phone or email" />
      </div>

      <div className="h-[65vh] overflow-auto rounded-lg border border-neutral-800">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="sticky top-0 z-10 bg-neutral-950">
            <tr className="border-b border-neutral-800 text-neutral-400">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">
                <SortableHeader
                  pathname="/admin/quotes"
                  searchParams={resolvedSearchParams}
                  sortKey="name"
                  activeSort={sort}
                  activeDir={dir}
                >
                  Name
                </SortableHeader>
              </th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Events</th>
              <th className="px-4 py-3 font-medium">
                <SortableHeader
                  pathname="/admin/quotes"
                  searchParams={resolvedSearchParams}
                  sortKey="totalAmount"
                  activeSort={sort}
                  activeDir={dir}
                >
                  Total
                </SortableHeader>
              </th>
              <th className="px-4 py-3 font-medium">
                <SortableHeader
                  pathname="/admin/quotes"
                  searchParams={resolvedSearchParams}
                  sortKey="createdAt"
                  activeSort={sort}
                  activeDir={dir}
                >
                  Submitted
                </SortableHeader>
              </th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote, index) => (
              <tr key={quote.id} className="border-b border-neutral-800 last:border-0">
                <td className="px-4 py-3 text-neutral-500">{skip + index + 1}</td>
                <td className="px-4 py-3">{quote.name}</td>
                <td className="px-4 py-3 text-neutral-400">
                  <div>{quote.phone}</div>
                  <div className="text-neutral-500">{quote.email}</div>
                </td>
                <td className="px-4 py-3 text-neutral-400">
                  {quote.events.map((event) => event.city).join(", ")}
                </td>
                <td className="px-4 py-3">{formatPkr(quote.totalAmount)}</td>
                <td className="px-4 py-3 text-neutral-500">{quote.createdAt.toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <QuoteRowActions quote={quote} />
                </td>
              </tr>
            ))}
            {quotes.length === 0 && <EmptyRow colSpan={7} message="No quote requests found." />}
          </tbody>
        </table>
      </div>

      <Pagination
        pathname="/admin/quotes"
        searchParams={resolvedSearchParams}
        page={page}
        pageSize={pageSize}
        total={total}
      />
    </div>
  );
}
