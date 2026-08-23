-- CreateTable
CREATE TABLE "JobTitle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "salary" INTEGER NOT NULL,

    CONSTRAINT "JobTitle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobTitle_title_key" ON "JobTitle"("title");

-- Backfill: one JobTitle row per distinct existing Employee.jobTitle value, salary defaults to 0.
INSERT INTO "JobTitle" ("id", "title", "salary")
SELECT gen_random_uuid()::text, "jobTitle", 0
FROM (SELECT DISTINCT "jobTitle" FROM "Employee") AS distinct_titles;

-- AlterTable: add nullable column, backfill, then enforce NOT NULL
ALTER TABLE "Employee" ADD COLUMN "jobTitleId" TEXT;

UPDATE "Employee" e
SET "jobTitleId" = jt."id"
FROM "JobTitle" jt
WHERE jt."title" = e."jobTitle";

ALTER TABLE "Employee" ALTER COLUMN "jobTitleId" SET NOT NULL;

ALTER TABLE "Employee" DROP COLUMN "jobTitle";

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_jobTitleId_fkey" FOREIGN KEY ("jobTitleId") REFERENCES "JobTitle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
