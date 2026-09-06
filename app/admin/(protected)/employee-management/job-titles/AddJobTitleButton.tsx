"use client";

import { useState } from "react";
import { JobTitleForm, type JobTitleActions } from "./JobTitleForm";
import Button from "../../../_components/Button";

export function AddJobTitleButton({ actions }: { actions: JobTitleActions }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)} variant="primary" size="sm">
        Add Job Title
      </Button>
      <JobTitleForm open={open} onOpenChange={setOpen} actions={actions} />
    </>
  );
}
