-- AlterTable: add nullable date column, backfill from the parent Booking's
-- createdAt (best available approximation for pre-existing rows), then enforce NOT NULL.
ALTER TABLE "BookingEvent" ADD COLUMN "date" TIMESTAMP(3);

UPDATE "BookingEvent" be
SET "date" = b."createdAt"
FROM "Booking" b
WHERE b."id" = be."bookingId";

ALTER TABLE "BookingEvent" ALTER COLUMN "date" SET NOT NULL;

-- CreateTable
CREATE TABLE "EventAssignment" (
    "id" TEXT NOT NULL,
    "bookingEventId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventAssignment_bookingEventId_employeeId_key" ON "EventAssignment"("bookingEventId", "employeeId");

-- AddForeignKey
ALTER TABLE "EventAssignment" ADD CONSTRAINT "EventAssignment_bookingEventId_fkey" FOREIGN KEY ("bookingEventId") REFERENCES "BookingEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAssignment" ADD CONSTRAINT "EventAssignment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
