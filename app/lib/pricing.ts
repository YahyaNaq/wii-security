import { ServiceType } from "@prisma/client";
import { guestTierFor, guestTierLabel, type GuestTier } from "./guestTiers";

export type { GuestTier };
export { guestTierFor, guestTierLabel };

export type ServiceOption = {
  slug: string;
  label: string;
  price: number;
};

export type PricingTables = {
  pouchGuestTiers: GuestTier[];
  monitoringGuestTiers: GuestTier[];
  photographyOptions: ServiceOption[];
  videographyOptions: ServiceOption[];
};

export type ServiceSelection =
  | { type: typeof ServiceType.PHONE_POUCHES }
  | { type: typeof ServiceType.MONITORING }
  | { type: typeof ServiceType.PHOTOGRAPHY; tier: string }
  | { type: typeof ServiceType.VIDEOGRAPHY; tier: string };

export type PricedService = {
  type: ServiceSelection["type"];
  tier: string;
  price: number;
};

export type EventInput = {
  femaleGuests: number;
  services: ServiceSelection[];
};

export type PricedEvent = {
  services: PricedService[];
  subtotal: number;
};

export class PricingError extends Error {}

function serviceOptionFor(options: ServiceOption[], slug: string): ServiceOption | null {
  return options.find((o) => o.slug === slug) ?? null;
}

export function priceEvent(tables: PricingTables, event: EventInput): PricedEvent {
  const services: PricedService[] = event.services.map((service) => {
    if (service.type === ServiceType.PHONE_POUCHES || service.type === ServiceType.MONITORING) {
      const guestTiers = service.type === ServiceType.PHONE_POUCHES ? tables.pouchGuestTiers : tables.monitoringGuestTiers;
      const guestTier = guestTierFor(guestTiers, event.femaleGuests);
      if (!guestTier) {
        throw new PricingError(
          `Guest count ${event.femaleGuests} is outside supported range. Contact us directly for custom pricing.`
        );
      }
      return { type: service.type, tier: guestTier.slug, price: guestTier.price };
    }

    const options = service.type === ServiceType.PHOTOGRAPHY ? tables.photographyOptions : tables.videographyOptions;
    const option = serviceOptionFor(options, service.tier);
    if (!option) {
      throw new PricingError(`Unknown ${service.type.toLowerCase()} option "${service.tier}".`);
    }
    return { type: service.type, tier: option.slug, price: option.price };
  });

  return { services, subtotal: services.reduce((sum, s) => sum + s.price, 0) };
}

export function priceQuote(
  tables: PricingTables,
  events: EventInput[]
): { events: PricedEvent[]; total: number } {
  const pricedEvents = events.map((event) => priceEvent(tables, event));
  return { events: pricedEvents, total: pricedEvents.reduce((sum, e) => sum + e.subtotal, 0) };
}

const SERVICE_LABELS: Record<ServiceSelection["type"], string> = {
  [ServiceType.PHONE_POUCHES]: "Phone Pouches",
  [ServiceType.MONITORING]: "Monitoring (Non-Pouches)",
  [ServiceType.PHOTOGRAPHY]: "Female Photography",
  [ServiceType.VIDEOGRAPHY]: "Videography",
};

export function serviceLabel(type: ServiceSelection["type"]): string {
  return SERVICE_LABELS[type];
}

export function tierLabel(tables: PricingTables, type: ServiceSelection["type"], slug: string): string {
  if (type === ServiceType.PHONE_POUCHES || type === ServiceType.MONITORING) {
    const guestTiers = type === ServiceType.PHONE_POUCHES ? tables.pouchGuestTiers : tables.monitoringGuestTiers;
    const tier = serviceOptionForGuestSlug(guestTiers, slug);
    return tier ? guestTierLabel(tier) : slug;
  }
  const options = type === ServiceType.PHOTOGRAPHY ? tables.photographyOptions : tables.videographyOptions;
  return serviceOptionFor(options, slug)?.label ?? slug;
}

function serviceOptionForGuestSlug(guestTiers: GuestTier[], slug: string): GuestTier | null {
  return guestTiers.find((t) => t.slug === slug) ?? null;
}

const GUEST_SERVICE_LABELS: Record<string, string> = {
  "phone-pouches": "Phone Pouches",
  monitoring: "Monitoring (Non-Pouches)",
};

// Formats a Booking event's raw service selections (guestService/photographyTier/videographyTier)
// into a display string for admin views. Bookings don't compute per-service pricing like
// quotes do (totalAmount is entered manually), so this just resolves slugs to labels.
export function bookingServiceSummary(
  tables: PricingTables,
  event: { guestService: string | null; photographyTier: string | null; videographyTier: string | null }
): string {
  const parts: string[] = [];
  if (event.guestService && GUEST_SERVICE_LABELS[event.guestService]) {
    parts.push(GUEST_SERVICE_LABELS[event.guestService]);
  }
  if (event.photographyTier) {
    const option = serviceOptionFor(tables.photographyOptions, event.photographyTier);
    parts.push(option ? `Photography — ${option.label}` : "Photography");
  }
  if (event.videographyTier) {
    const option = serviceOptionFor(tables.videographyOptions, event.videographyTier);
    parts.push(option ? `Videography — ${option.label}` : "Videography");
  }
  return parts.length > 0 ? parts.join(", ") : "—";
}
