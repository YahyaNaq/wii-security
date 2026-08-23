"use client";

import { useState } from "react";
import { EventStaffDialog, type StaffableEmployee } from "./EventStaffDialog";

export function ManageStaffButton({
  eventLabel,
  bookingEventId,
  employees,
  assignedEmployeeIds,
  lockedEmployeeIds,
}: {
  eventLabel: string;
  bookingEventId: string;
  employees: StaffableEmployee[];
  assignedEmployeeIds: string[];
  lockedEmployeeIds: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md border border-neutral-800 px-2.5 py-1 text-xs text-neutral-300 hover:bg-neutral-900 hover:text-white"
      >
        Manage Staff
      </button>
      <EventStaffDialog
        open={open}
        onOpenChange={setOpen}
        eventLabel={eventLabel}
        bookingEventId={bookingEventId}
        employees={employees}
        assignedEmployeeIds={assignedEmployeeIds}
        lockedEmployeeIds={lockedEmployeeIds}
      />
    </>
  );
}
