-- CreateTable
CREATE TABLE "EmployeeBankDetails" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountTitle" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,

    CONSTRAINT "EmployeeBankDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeBankDetails_employeeId_key" ON "EmployeeBankDetails"("employeeId");

-- AddForeignKey
ALTER TABLE "EmployeeBankDetails" ADD CONSTRAINT "EmployeeBankDetails_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
