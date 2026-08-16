import { prisma } from "../../../../lib/db";
import { formatPkr } from "../../../../lib/format";
import { EmptyRow } from "../../_components/table/EmptyRow";
import { AddGuestTierButton } from "../AddGuestTierButton";
import { GuestTierRowActions } from "../GuestTierRowActions";

export default async function AdminGuestTiersPricingPage() {
  const guestTiers = await prisma.guestTierPrice.findMany({ orderBy: { minGuests: "asc" } });

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Guest Tier Pricing</h1>
        <AddGuestTierButton />
      </div>
      <p className="mb-6 text-sm text-neutral-500">
        Guest-count tiers used to price the Monitoring and Phone Pouches services. A quote&apos;s price for these
        services is looked up by matching the event&apos;s female guest count against these ranges.
      </p>

      <div className="overflow-x-auto rounded-lg border border-neutral-800">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-800 text-neutral-400">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Guest Range</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {guestTiers.map((tier, index) => (
              <tr key={tier.id} className="border-b border-neutral-800 last:border-0">
                <td className="px-4 py-3 text-neutral-500">{index + 1}</td>
                <td className="px-4 py-3">{tier.slug}</td>
                <td className="px-4 py-3 text-neutral-400">
                  {tier.minGuests}–{tier.maxGuests}
                </td>
                <td className="px-4 py-3">{formatPkr(tier.price)}</td>
                <td className="px-4 py-3 text-right">
                  <GuestTierRowActions tier={tier} />
                </td>
              </tr>
            ))}
            {guestTiers.length === 0 && <EmptyRow colSpan={5} message="No guest tiers configured." />}
          </tbody>
        </table>
      </div>
    </div>
  );
}
