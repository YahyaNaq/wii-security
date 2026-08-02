-- CreateEnum
CREATE TYPE "PricedServiceType" AS ENUM ('PHOTOGRAPHY', 'VIDEOGRAPHY');

-- CreateTable
CREATE TABLE "GuestTierPrice" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "minGuests" INTEGER NOT NULL,
    "maxGuests" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "GuestTierPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceOptionPrice" (
    "id" TEXT NOT NULL,
    "serviceType" "PricedServiceType" NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ServiceOptionPrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuestTierPrice_slug_key" ON "GuestTierPrice"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceOptionPrice_serviceType_slug_key" ON "ServiceOptionPrice"("serviceType", "slug");
