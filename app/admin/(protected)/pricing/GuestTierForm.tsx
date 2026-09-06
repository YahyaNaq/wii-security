"use client";

import { useRef, useState, useTransition } from "react";
import { DetailDialog } from "../_components/table/DetailDialog";
import { AmountInput } from "../_components/form/AmountInput";
import Button from "../../_components/Button";
import type { TierActionResult } from "./actions";

export type GuestTier = {
  id: string;
  slug: string;
  minGuests: number;
  maxGuests: number;
  price: number;
};

export type GuestTierActions = {
  create: (formData: FormData) => Promise<TierActionResult>;
  update: (tierId: string, formData: FormData) => Promise<TierActionResult>;
  delete: (tierId: string) => Promise<TierActionResult>;
};

const inputClass =
  "w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-600 focus:outline-none";
const labelClass = "mb-1 block text-xs text-neutral-500";

export function GuestTierForm({
  open,
  onOpenChange,
  tier,
  actions,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tier?: GuestTier;
  actions: GuestTierActions;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = tier ? await actions.update(tier.id, formData) : await actions.create(formData);
      if (result.success) {
        onOpenChange(false);
        formRef.current?.reset();
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <DetailDialog open={open} onOpenChange={onOpenChange} title={tier ? "Edit Guest Tier" : "Add Guest Tier"}>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="slug">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            defaultValue={tier?.slug}
            placeholder="e.g. 1-50-guests"
            className={inputClass}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} htmlFor="minGuests">
              Min Guests
            </label>
            <input
              id="minGuests"
              name="minGuests"
              type="number"
              min={1}
              defaultValue={tier?.minGuests}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="maxGuests">
              Max Guests
            </label>
            <input
              id="maxGuests"
              name="maxGuests"
              type="number"
              min={1}
              defaultValue={tier?.maxGuests}
              className={inputClass}
              required
            />
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="price">
            Price (PKR)
          </label>
          <AmountInput id="price" name="price" defaultValue={tier?.price} className={inputClass} required />
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
