-- CreateTable
CREATE TABLE "PouchGuestTierPrice" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "minGuests" INTEGER NOT NULL,
    "maxGuests" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "PouchGuestTierPrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PouchGuestTierPrice_slug_key" ON "PouchGuestTierPrice"("slug");

-- Seed Phone Pouches tiers with today's shared guest-tier ranges/prices, so pricing
-- keeps working immediately after the split; admins can then edit them independently.
INSERT INTO "PouchGuestTierPrice" (id, slug, "minGuests", "maxGuests", price)
SELECT id, slug, "minGuests", "maxGuests", price FROM "GuestTierPrice";
