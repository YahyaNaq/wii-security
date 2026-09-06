"use client";

import { useState } from "react";
import { EventStaffDialog, type StaffableEmployee } from "./EventStaffDialog";
import Button from "../../../_components/Button";

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
      <Button type="button" onClick={() => setOpen(true)} variant="secondary" size="xs">
        Manage Staff
      </Button>
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
