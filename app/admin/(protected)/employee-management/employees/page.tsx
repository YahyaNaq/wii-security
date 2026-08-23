import { EmploymentStatus, Prisma } from "@prisma/client";
import { prisma } from "../../../../lib/db";
import { parseListParams } from "../../_lib/list-params";
import { SortableHeader } from "../../_components/table/SortableHeader";
import { Pagination } from "../../_components/table/Pagination";
import { SearchInput } from "../../_components/table/SearchInput";
import { StatusBadge } from "../../_components/table/StatusBadge";
import { EmptyRow } from "../../_components/table/EmptyRow";
import { AddEmployeeButton } from "./AddEmployeeButton";
import { EmployeeRowActions } from "./EmployeeRowActions";
import { createEmployee, updateEmployee } from "./actions";

const actions = { create: createEmployee, update: updateEmployee };

const ALLOWED_SORT = ["name", "jobTitle", "city", "createdAt"] as const;

const STATUS_TONE = {
  [EmploymentStatus.ACTIVE]: "emerald",
  [EmploymentStatus.ON_LEAVE]: "amber",
  [EmploymentStatus.TERMINATED]: "red",
} as const;

const STATUS_LABEL = {
  [EmploymentStatus.ACTIVE]: "Active",
  [EmploymentStatus.ON_LEAVE]: "On Leave",
  [EmploymentStatus.TERMINATED]: "Terminated",
} as const;

export default async function AdminEmployeesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const { page, pageSize, skip, take, sort, dir, q } = parseListParams(resolvedSearchParams, {
    allowedSort: ALLOWED_SORT,
    defaultSort: "name",
  });

  const where: Prisma.EmployeeWhereInput = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { phoneNumber: { contains: q } },
          { email: { contains: q, mode: "insensitive" } },
          { cnic: { contains: q } },
          { jobTitle: { title: { contains: q, mode: "insensitive" } } },
        ],
      }
    : {};

  const orderBy: Prisma.EmployeeOrderByWithRelationInput =
    sort === "jobTitle" ? { jobTitle: { title: dir } } : { [sort]: dir };

  const [employees, total, jobTitles] = await Promise.all([
    prisma.employee.findMany({ where, orderBy, skip, take, include: { jobTitle: true } }),
    prisma.employee.count({ where }),
    prisma.jobTitle.findMany({ orderBy: { title: "asc" } }),
  ]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Employees</h1>
        <div className="flex items-center gap-3">
          <SearchInput placeholder="Search by name, phone, email or CNIC" />
          <AddEmployeeButton actions={actions} jobTitleOptions={jobTitles} />
        </div>
      </div>

      <div className="max-h-[65vh] overflow-auto rounded-lg border border-neutral-800">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="sticky top-0 z-10 bg-neutral-950">
            <tr className="border-b border-neutral-800 text-neutral-400">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">
                <SortableHeader
                  pathname="/admin/employee-management/employees"
                  searchParams={resolvedSearchParams}
                  sortKey="name"
                  activeSort={sort}
                  activeDir={dir}
                >
                  Name
                </SortableHeader>
              </th>
              <th className="px-4 py-3 font-medium">
                <SortableHeader
                  pathname="/admin/employee-management/employees"
                  searchParams={resolvedSearchParams}
                  sortKey="jobTitle"
                  activeSort={sort}
                  activeDir={dir}
                >
                  Job Title
                </SortableHeader>
              </th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">CNIC</th>
              <th className="px-4 py-3 font-medium">
                <SortableHeader
                  pathname="/admin/employee-management/employees"
                  searchParams={resolvedSearchParams}
                  sortKey="city"
                  activeSort={sort}
                  activeDir={dir}
                >
                  City
                </SortableHeader>
              </th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr key={employee.id} className="border-b border-neutral-800 last:border-0">
                <td className="px-4 py-3 text-neutral-500">{skip + index + 1}</td>
                <td className="px-4 py-3">{employee.name}</td>
                <td className="px-4 py-3 text-neutral-400">{employee.jobTitle.title}</td>
                <td className="px-4 py-3 text-neutral-400">
                  <div>{employee.phoneNumber}</div>
                  <div className="text-neutral-500">{employee.email}</div>
                </td>
                <td className="px-4 py-3 text-neutral-400">{employee.cnic}</td>
                <td className="px-4 py-3 text-neutral-400">{employee.city}</td>
                <td className="px-4 py-3">
                  <StatusBadge
                    label={STATUS_LABEL[employee.employmentStatus]}
                    tone={STATUS_TONE[employee.employmentStatus]}
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <EmployeeRowActions employee={employee} actions={actions} jobTitleOptions={jobTitles} />
                </td>
              </tr>
            ))}
            {employees.length === 0 && <EmptyRow colSpan={8} message="No employees found." />}
          </tbody>
        </table>
      </div>

      <Pagination
        pathname="/admin/employee-management/employees"
        searchParams={resolvedSearchParams}
        page={page}
        pageSize={pageSize}
        total={total}
      />
    </div>
  );
}
