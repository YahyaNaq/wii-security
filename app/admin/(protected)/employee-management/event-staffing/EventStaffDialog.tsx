"use client";

import { useState, useTransition } from "react";
import { DetailDialog } from "../../_components/table/DetailDialog";
import { setEventStaff } from "./actions";
import Button from "../../../_components/Button";

export type StaffableEmployee = {
  id: string;
  name: string;
  jobTitle: { title: string };
};

export function EventStaffDialog({
  open,
  onOpenChange,
  eventLabel,
  bookingEventId,
  employees,
  assignedEmployeeIds,
  lockedEmployeeIds,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventLabel: string;
  bookingEventId: string;
  employees: StaffableEmployee[];
  assignedEmployeeIds: string[];
  lockedEmployeeIds: string[];
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(assignedEmployeeIds));
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const locked = new Set(lockedEmployeeIds);

  const toggle = (id: string) => {
    if (locked.has(id)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      const result = await setEventStaff(bookingEventId, Array.from(selected));
      if (result.success) {
        onOpenChange(false);
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <DetailDialog open={open} onOpenChange={onOpenChange} title={`Manage Staff — ${eventLabel}`}>
      <div className="max-h-[50vh] space-y-1 overflow-y-auto pr-1">
        {employees.map((employee) => {
          const isLocked = locked.has(employee.id);
          return (
            <label
              key={employee.id}
              className={`flex items-center gap-3 rounded-md px-2 py-2 text-sm ${
                isLocked ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-neutral-900"
              }`}
            >
              <input
                type="checkbox"
                checked={selected.has(employee.id)}
                onChange={() => toggle(employee.id)}
                disabled={isLocked}
                className="accent-white"
              />
              <span className="flex-1">{employee.name}</span>
              {isLocked && <span className="text-xs text-amber-400">Salary released</span>}
              <span className="text-xs text-neutral-500">{employee.jobTitle.title}</span>
            </label>
          );
        })}
        {employees.length === 0 && <p className="px-2 py-2 text-sm text-neutral-500">No employees available.</p>}
      </div>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <div className="mt-4 flex justify-end gap-2 pt-2">
        <Button type="button" onClick={() => onOpenChange(false)} variant="secondary" size="sm">
          Cancel
        </Button>
        <Button type="button" onClick={handleSave} disabled={pending} variant="primary" size="sm">
          {pending ? "Saving…" : "Save"}
        </Button>
      </div>
    </DetailDialog>
  );
}
