-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('IN_REVIEW', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'IN_REVIEW',
    "receiptFileName" TEXT NOT NULL,
    "receiptMimeType" TEXT NOT NULL,
    "receiptData" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingEvent" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "reportingTime" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventTypeOther" TEXT,
    "femaleGuests" INTEGER NOT NULL,
    "package" TEXT NOT NULL,

    CONSTRAINT "BookingEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BookingEvent" ADD CONSTRAINT "BookingEvent_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
