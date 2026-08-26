import { PricedServiceType } from "@prisma/client";
import { prisma } from "../../../../lib/db";
import { formatPkr } from "../../../../lib/format";
import { parseListParams } from "../../_lib/list-params";
import { Pagination } from "../../_components/table/Pagination";
import { EmptyRow } from "../../_components/table/EmptyRow";
import { AddServiceOptionButton } from "../AddServiceOptionButton";
import { ServiceOptionRowActions } from "../ServiceOptionRowActions";

const SERVICE_TYPE_LABEL = {
  [PricedServiceType.PHOTOGRAPHY]: "Photography",
  [PricedServiceType.VIDEOGRAPHY]: "Videography",
} as const;

export default async function AdminPackagesPricingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const { page, pageSize, skip, take } = parseListParams(resolvedSearchParams, {
    allowedSort: [],
    defaultSort: "price",
  });

  const [serviceOptions, total] = await Promise.all([
    prisma.serviceOptionPrice.findMany({
      orderBy: [{ serviceType: "asc" }, { price: "asc" }],
      skip,
      take,
    }),
    prisma.serviceOptionPrice.count(),
  ]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Photography &amp; Videography Pricing</h1>
        <AddServiceOptionButton />
      </div>
      <p className="mb-6 text-sm text-neutral-500">
        Flat-price named packages selectable for the Photography and Videography services.
      </p>

      <div className="h-[65vh] overflow-auto rounded-lg border border-neutral-800">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="sticky top-0 z-10 bg-neutral-950">
            <tr className="border-b border-neutral-800 text-neutral-400">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Label</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {serviceOptions.map((option, index) => (
              <tr key={option.id} className="border-b border-neutral-800 last:border-0">
                <td className="px-4 py-3 text-neutral-500">{skip + index + 1}</td>
                <td className="px-4 py-3 text-neutral-400">{SERVICE_TYPE_LABEL[option.serviceType]}</td>
                <td className="px-4 py-3">{option.slug}</td>
                <td className="px-4 py-3">{option.label}</td>
                <td className="px-4 py-3">{formatPkr(option.price)}</td>
                <td className="px-4 py-3 text-right">
                  <ServiceOptionRowActions option={option} />
                </td>
              </tr>
            ))}
            {serviceOptions.length === 0 && <EmptyRow colSpan={6} message="No packages configured." />}
          </tbody>
        </table>
      </div>

      <Pagination
        pathname="/admin/pricing/packages"
        searchParams={resolvedSearchParams}
        page={page}
        pageSize={pageSize}
        total={total}
      />
    </div>
  );
}
