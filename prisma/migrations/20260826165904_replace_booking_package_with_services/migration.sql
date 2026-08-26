-- AlterTable
ALTER TABLE "BookingEvent" DROP COLUMN "package",
ADD COLUMN     "guestService" TEXT,
ADD COLUMN     "photographyTier" TEXT,
ADD COLUMN     "videographyTier" TEXT;
