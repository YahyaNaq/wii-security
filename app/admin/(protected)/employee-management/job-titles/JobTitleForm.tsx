"use client";

import { useRef, useState, useTransition } from "react";
import { DetailDialog } from "../../_components/table/DetailDialog";
import { AmountInput } from "../../_components/form/AmountInput";
import type { JobTitleActionResult } from "./actions";

export type JobTitle = {
  id: string;
  title: string;
  salary: number;
};

export type JobTitleActions = {
  create: (formData: FormData) => Promise<JobTitleActionResult>;
  update: (jobTitleId: string, formData: FormData) => Promise<JobTitleActionResult>;
  delete: (jobTitleId: string) => Promise<JobTitleActionResult>;
};

const inputClass =
  "w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-600 focus:outline-none";
const labelClass = "mb-1 block text-xs text-neutral-500";

export function JobTitleForm({
  open,
  onOpenChange,
  jobTitle,
  actions,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle?: JobTitle;
  actions: JobTitleActions;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = jobTitle ? await actions.update(jobTitle.id, formData) : await actions.create(formData);
      if (result.success) {
        onOpenChange(false);
        formRef.current?.reset();
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <DetailDialog open={open} onOpenChange={onOpenChange} title={jobTitle ? "Edit Job Title" : "Add Job Title"}>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={jobTitle?.title}
            placeholder="e.g. Security Guard"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="salary">
            Salary (PKR, per gig)
          </label>
          <AmountInput id="salary" name="salary" defaultValue={jobTitle?.salary} className={inputClass} required />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md border border-neutral-800 px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-neutral-950 hover:bg-neutral-200 disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </DetailDialog>
  );
}
