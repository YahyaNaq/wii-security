"use client";

import { useState } from "react";
import { EmployeeForm, type EmployeeActions, type JobTitleOption } from "./EmployeeForm";
import Button from "../../../_components/Button";

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
      <Button type="button" onClick={() => setOpen(true)} variant="primary" size="sm">
        Add Employee
      </Button>
      <EmployeeForm open={open} onOpenChange={setOpen} actions={actions} jobTitleOptions={jobTitleOptions} />
    </>
  );
}
