"use client";

import { useState } from "react";
import { RowActionsMenu, type RowAction } from "../../_components/table/RowActionsMenu";
import { EmployeeForm, type Employee, type EmployeeActions, type JobTitleOption } from "./EmployeeForm";

export function EmployeeRowActions({
  employee,
  actions,
  jobTitleOptions,
}: {
  employee: Employee;
  actions: EmployeeActions;
  jobTitleOptions: JobTitleOption[];
}) {
  const [editOpen, setEditOpen] = useState(false);

  const rowActions: RowAction[] = [
    { label: "Edit", onClick: () => setEditOpen(true) },
    { label: "Manage Salary", href: `/admin/employee-management/employees/${employee.id}/salary` },
  ];

  return (
    <>
      <RowActionsMenu actions={rowActions} />
      <EmployeeForm
        open={editOpen}
        onOpenChange={setEditOpen}
        employee={employee}
        actions={actions}
        jobTitleOptions={jobTitleOptions}
      />
    </>
  );
}
