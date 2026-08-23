"use client";

import { useState } from "react";
import { JobTitleForm, type JobTitleActions } from "./JobTitleForm";

export function AddJobTitleButton({ actions }: { actions: JobTitleActions }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-neutral-950 hover:bg-neutral-200"
      >
        Add Job Title
      </button>
      <JobTitleForm open={open} onOpenChange={setOpen} actions={actions} />
    </>
  );
}
