-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('PHONE_POUCHES', 'MONITORING', 'PHOTOGRAPHY', 'VIDEOGRAPHY');

-- CreateTable
CREATE TABLE "QuoteRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hearAboutUs" TEXT NOT NULL,
    "hearAboutUsOther" TEXT,
    "totalAmount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuoteRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteEvent" (
    "id" TEXT NOT NULL,
    "quoteRequestId" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "femaleGuests" INTEGER NOT NULL,
    "details" TEXT,
    "subtotal" INTEGER NOT NULL,

    CONSTRAINT "QuoteEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteService" (
    "id" TEXT NOT NULL,
    "quoteEventId" TEXT NOT NULL,
    "type" "ServiceType" NOT NULL,
    "tier" TEXT NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "QuoteService_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuoteEvent" ADD CONSTRAINT "QuoteEvent_quoteRequestId_fkey" FOREIGN KEY ("quoteRequestId") REFERENCES "QuoteRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteService" ADD CONSTRAINT "QuoteService_quoteEventId_fkey" FOREIGN KEY ("quoteEventId") REFERENCES "QuoteEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
