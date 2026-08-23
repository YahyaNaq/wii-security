-- CreateEnum
CREATE TYPE "SalaryStatus" AS ENUM ('PENDING', 'RELEASED');

-- CreateTable
CREATE TABLE "EmployeeSalaryPeriod" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "status" "SalaryStatus" NOT NULL DEFAULT 'RELEASED',
    "amount" INTEGER NOT NULL,
    "releasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployeeSalaryPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeSalaryPeriod_employeeId_year_month_key" ON "EmployeeSalaryPeriod"("employeeId", "year", "month");

-- AddForeignKey
ALTER TABLE "EmployeeSalaryPeriod" ADD CONSTRAINT "EmployeeSalaryPeriod_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
