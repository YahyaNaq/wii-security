"use client";

import { useRef, useState, useTransition } from "react";
import { PricedServiceType } from "@prisma/client";
import { DetailDialog } from "../_components/table/DetailDialog";
import { AmountInput } from "../_components/form/AmountInput";
import { SelectField } from "../../../components/ui/Select";
import Button from "../../_components/Button";
import { createServiceOption, updateServiceOption } from "./actions";

const SERVICE_TYPE_OPTIONS = [
  { value: PricedServiceType.PHOTOGRAPHY, label: "Photography" },
  { value: PricedServiceType.VIDEOGRAPHY, label: "Videography" },
];

type ServiceOption = {
  id: string;
  serviceType: PricedServiceType;
  slug: string;
  label: string;
  price: number;
};

const inputClass =
  "w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-600 focus:outline-none";
const labelClass = "mb-1 block text-xs text-neutral-500";
const selectLabelClass = "block text-xs text-neutral-500";
const selectLabelWrapperClass = "flex min-w-0 flex-col gap-1";

export function ServiceOptionForm({
  open,
  onOpenChange,
  option,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  option?: ServiceOption;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = option
        ? await updateServiceOption(option.id, formData)
        : await createServiceOption(formData);
      if (result.success) {
        onOpenChange(false);
        formRef.current?.reset();
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <DetailDialog open={open} onOpenChange={onOpenChange} title={option ? "Edit Package" : "Add Package"}>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <SelectField
          label={<span className={selectLabelClass}>Service</span>}
          name="serviceType"
          options={SERVICE_TYPE_OPTIONS}
          placeholder="Select a service"
          defaultValue={option?.serviceType}
          required
          labelClassName={selectLabelWrapperClass}
          triggerClassName={`${inputClass} flex cursor-pointer items-center justify-between gap-2 text-left`}
          contentClassName="admin-portal z-50 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border border-neutral-800 bg-neutral-900 shadow-lg"
          itemClassName="relative flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm text-white outline-none data-[highlighted]:bg-neutral-800 data-[state=checked]:font-semibold"
        />
        <div>
          <label className={labelClass} htmlFor="slug">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            defaultValue={option?.slug}
            placeholder="e.g. standard"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="label">
            Label
          </label>
          <input
            id="label"
            name="label"
            type="text"
            defaultValue={option?.label}
            placeholder="e.g. Standard Package"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="price">
            Price (PKR)
          </label>
          <AmountInput id="price" name="price" defaultValue={option?.price} className={inputClass} required />
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
