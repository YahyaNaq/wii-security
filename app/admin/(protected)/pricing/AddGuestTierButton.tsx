"use client";

import { useState } from "react";
import { GuestTierForm, type GuestTierActions } from "./GuestTierForm";

export function AddGuestTierButton({ actions }: { actions: GuestTierActions }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-neutral-950 hover:bg-neutral-200"
      >
        Add Tier
      </button>
      <GuestTierForm open={open} onOpenChange={setOpen} actions={actions} />
    </>
  );
}
