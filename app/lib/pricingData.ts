import { PricedServiceType } from "@prisma/client";
import { prisma } from "./db";
import type { GuestTier, PricingTables } from "./pricing";

function toGuestTier(t: { slug: string; minGuests: number; maxGuests: number; price: number }): GuestTier {
  return { slug: t.slug, minGuests: t.minGuests, maxGuests: t.maxGuests, price: t.price };
}

export async function loadPricingTables(): Promise<PricingTables> {
  const [pouchGuestTiers, monitoringGuestTiers, serviceOptions] = await Promise.all([
    prisma.pouchGuestTierPrice.findMany({ orderBy: { minGuests: "asc" } }),
    prisma.monitoringGuestTierPrice.findMany({ orderBy: { minGuests: "asc" } }),
    prisma.serviceOptionPrice.findMany({ orderBy: { price: "asc" } }),
  ]);

  return {
    pouchGuestTiers: pouchGuestTiers.map(toGuestTier),
    monitoringGuestTiers: monitoringGuestTiers.map(toGuestTier),
    photographyOptions: serviceOptions
      .filter((o) => o.serviceType === PricedServiceType.PHOTOGRAPHY)
      .map((o) => ({ slug: o.slug, label: o.label, price: o.price })),
    videographyOptions: serviceOptions
      .filter((o) => o.serviceType === PricedServiceType.VIDEOGRAPHY)
      .map((o) => ({ slug: o.slug, label: o.label, price: o.price })),
  };
}
