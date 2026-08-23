"use client";

import { useState } from "react";
import { EmployeeForm, type EmployeeActions, type JobTitleOption } from "./EmployeeForm";

export function AddEmployeeButton({
  actions,
  jobTitleOptions,
}: {
  actions: EmployeeActions;
  jobTitleOptions: JobTitleOption[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-neutral-950 hover:bg-neutral-200"
      >
        Add Employee
      </button>
      <EmployeeForm open={open} onOpenChange={setOpen} actions={actions} jobTitleOptions={jobTitleOptions} />
    </>
  );
}
