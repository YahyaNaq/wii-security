"use client";

import { useState, useTransition } from "react";
import { RowActionsMenu, type RowAction } from "../../_components/table/RowActionsMenu";
import { JobTitleForm, type JobTitle, type JobTitleActions } from "./JobTitleForm";

export function JobTitleRowActions({ jobTitle, actions }: { jobTitle: JobTitle; actions: JobTitleActions }) {
  const [editOpen, setEditOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    if (!window.confirm(`Delete job title "${jobTitle.title}"? This can't be undone.`)) return;
    startTransition(async () => {
      const result = await actions.delete(jobTitle.id);
      if (!result.success) setError(result.error);
    });
  };

  const rowActions: RowAction[] = [
    { label: "Edit", onClick: () => setEditOpen(true) },
    { label: "Delete", variant: "danger", disabled: pending, onClick: handleDelete },
  ];

  return (
    <>
      <RowActionsMenu actions={rowActions} />
      {error && <p className="mt-1 text-right text-xs text-red-400">{error}</p>}
      <JobTitleForm open={editOpen} onOpenChange={setEditOpen} jobTitle={jobTitle} actions={actions} />
    </>
  );
}
