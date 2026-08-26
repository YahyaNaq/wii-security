export type GuestTier = {
  slug: string;
  minGuests: number;
  maxGuests: number;
  price: number;
};

export function guestTierFor(guestTiers: GuestTier[], femaleGuests: number): GuestTier | null {
  return guestTiers.find((t) => femaleGuests >= t.minGuests && femaleGuests <= t.maxGuests) ?? null;
}

export function guestTierLabel(tier: GuestTier): string {
  return tier.minGuests === 0 ? `Under ${tier.maxGuests + 1} guests` : `${tier.minGuests}–${tier.maxGuests} guests`;
}
