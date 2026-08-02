import { PricedServiceType } from "@prisma/client";
import { prisma } from "./db";
import type { PricingTables } from "./pricing";

export async function loadPricingTables(): Promise<PricingTables> {
  const [guestTiers, serviceOptions] = await Promise.all([
    prisma.guestTierPrice.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    prisma.serviceOptionPrice.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return {
    guestTiers: guestTiers.map((t) => ({
      slug: t.slug,
      minGuests: t.minGuests,
      maxGuests: t.maxGuests,
      price: t.price,
    })),
    photographyOptions: serviceOptions
      .filter((o) => o.serviceType === PricedServiceType.PHOTOGRAPHY)
      .map((o) => ({ slug: o.slug, label: o.label, price: o.price })),
    videographyOptions: serviceOptions
      .filter((o) => o.serviceType === PricedServiceType.VIDEOGRAPHY)
      .map((o) => ({ slug: o.slug, label: o.label, price: o.price })),
  };
}
