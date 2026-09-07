import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../../../../lib/db";
import { SalaryPeriodsPanel } from "./SalaryPeriodsPanel";

export default async function EmployeeSalaryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const employee = await prisma.employee.findUnique({
    where: { id },
    select: { name: true, jobTitle: { select: { title: true } } },
  });

  if (!employee) notFound();

  return (
    <div>
      <Link
        href="/admin/employee-management/employees"
        className="mb-4 inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
      >
        ← Back to Employees
      </Link>
      <h1 className="text-2xl font-semibold">{employee.name}</h1>
      <p className="mb-6 text-sm text-neutral-500">{employee.jobTitle.title} · Manage Salary</p>

      <SalaryPeriodsPanel employeeId={id} />
    </div>
  );
}
