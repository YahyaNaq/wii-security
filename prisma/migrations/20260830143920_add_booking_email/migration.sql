-- AlterTable
-- Existing rows predate email capture; backfill with a placeholder so the
-- column can be NOT NULL. New bookings always supply a real email.
ALTER TABLE "Booking" ADD COLUMN     "email" TEXT NOT NULL DEFAULT 'unknown@wiisecurity.com';
ALTER TABLE "Booking" ALTER COLUMN "email" DROP DEFAULT;
