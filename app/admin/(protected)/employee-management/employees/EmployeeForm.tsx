"use client";

import { useRef, useState, useTransition } from "react";
import { EmploymentStatus } from "@prisma/client";
import { DetailDialog } from "../../_components/table/DetailDialog";
import { SelectField } from "../../../../components/ui/Select";
import Button from "../../../_components/Button";
import type { EmployeeActionResult } from "./actions";

export type Employee = {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  jobTitleId: string;
  cnic: string;
  address: string;
  city: string;
  employmentStatus: EmploymentStatus;
  emergencyContactName: string | null;
  emergencyContactNumber: string | null;
};

export type JobTitleOption = {
  id: string;
  title: string;
};

export type EmployeeActions = {
  create: (formData: FormData) => Promise<EmployeeActionResult>;
  update: (employeeId: string, formData: FormData) => Promise<EmployeeActionResult>;
};

const EMPLOYMENT_STATUS_OPTIONS = [
  { value: EmploymentStatus.ACTIVE, label: "Active" },
  { value: EmploymentStatus.ON_LEAVE, label: "On Leave" },
  { value: EmploymentStatus.TERMINATED, label: "Terminated" },
];

const CITY_OPTIONS = ["Karachi", "Lahore", "Islamabad"];

const inputClass =
  "w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-600 focus:outline-none";
const labelClass = "mb-1 block text-xs text-neutral-500";
const selectLabelClass = "block text-xs text-neutral-500";
const selectLabelWrapperClass = "flex min-w-0 flex-col gap-1";

export function EmployeeForm({
  open,
  onOpenChange,
  employee,
  actions,
  jobTitleOptions,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee;
  actions: EmployeeActions;
  jobTitleOptions: JobTitleOption[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = employee ? await actions.update(employee.id, formData) : await actions.create(formData);
      if (result.success) {
        onOpenChange(false);
        formRef.current?.reset();
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <DetailDialog open={open} onOpenChange={onOpenChange} title={employee ? "Edit Employee" : "Add Employee"}>
      <form ref={formRef} onSubmit={handleSubmit} className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={employee?.name}
              className={inputClass}
              required
            />
          </div>
          <SelectField
            label={<span className={selectLabelClass}>Job Title</span>}
            name="jobTitleId"
            options={jobTitleOptions.map((option) => ({ value: option.id, label: option.title }))}
            placeholder="Select a job title"
            defaultValue={employee?.jobTitleId}
            required
            labelClassName={selectLabelWrapperClass}
            triggerClassName={`${inputClass} flex cursor-pointer items-center justify-between gap-2 text-left`}
            contentClassName="admin-portal z-50 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border border-neutral-800 bg-neutral-900 shadow-lg"
            itemClassName="relative flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm text-white outline-none data-[highlighted]:bg-neutral-800 data-[state=checked]:font-semibold"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} htmlFor="phoneNumber">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              defaultValue={employee?.phoneNumber}
              placeholder="03XX XXXXXXX"
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={employee?.email}
              className={inputClass}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} htmlFor="cnic">
              CNIC
            </label>
            <input
              id="cnic"
              name="cnic"
              type="text"
              defaultValue={employee?.cnic}
              placeholder="XXXXX-XXXXXXX-X"
              className={inputClass}
              required
            />
          </div>
          <SelectField
            label={<span className={selectLabelClass}>City</span>}
            name="city"
            options={CITY_OPTIONS}
            placeholder="Select a city"
            defaultValue={employee?.city}
            required
            labelClassName={selectLabelWrapperClass}
            triggerClassName={`${inputClass} flex cursor-pointer items-center justify-between gap-2 text-left`}
            contentClassName="admin-portal z-50 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border border-neutral-800 bg-neutral-900 shadow-lg"
            itemClassName="relative flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm text-white outline-none data-[highlighted]:bg-neutral-800 data-[state=checked]:font-semibold"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="address">
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            defaultValue={employee?.address}
            className={inputClass}
            required
          />
        </div>
        <SelectField
          label={<span className={selectLabelClass}>Employment Status</span>}
          name="employmentStatus"
          options={EMPLOYMENT_STATUS_OPTIONS}
          placeholder="Select a status"
          defaultValue={employee?.employmentStatus ?? EmploymentStatus.ACTIVE}
          required
          labelClassName={selectLabelWrapperClass}
          triggerClassName={`${inputClass} flex cursor-pointer items-center justify-between gap-2 text-left`}
          contentClassName="admin-portal z-50 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border border-neutral-800 bg-neutral-900 shadow-lg"
          itemClassName="relative flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm text-white outline-none data-[highlighted]:bg-neutral-800 data-[state=checked]:font-semibold"
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} htmlFor="emergencyContactName">
              Emergency Contact Name
            </label>
            <input
              id="emergencyContactName"
              name="emergencyContactName"
              type="text"
              defaultValue={employee?.emergencyContactName ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="emergencyContactNumber">
              Emergency Contact Number
            </label>
            <input
              id="emergencyContactNumber"
              name="emergencyContactNumber"
              type="text"
              defaultValue={employee?.emergencyContactNumber ?? ""}
              className={inputClass}
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" onClick={() => onOpenChange(false)} variant="secondary" size="sm">
            Cancel
          </Button>
          <Button type="submit" disabled={pending} variant="primary" size="sm">
            {pending ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </DetailDialog>
  );
}
