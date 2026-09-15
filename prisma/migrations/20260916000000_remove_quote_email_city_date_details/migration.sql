-- AlterTable
ALTER TABLE "QuoteRequest" DROP COLUMN "email",
DROP COLUMN "hearAboutUs",
DROP COLUMN "hearAboutUsOther";

-- AlterTable
ALTER TABLE "QuoteEvent" DROP COLUMN "city",
DROP COLUMN "date",
DROP COLUMN "details";
