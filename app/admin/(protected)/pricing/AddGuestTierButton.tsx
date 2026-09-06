"use client";

import { useState } from "react";
import { GuestTierForm, type GuestTierActions } from "./GuestTierForm";
import Button from "../../_components/Button";

export function AddGuestTierButton({ actions }: { actions: GuestTierActions }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)} variant="primary" size="sm">
        Add Tier
      </Button>
      <GuestTierForm open={open} onOpenChange={setOpen} actions={actions} />
    </>
  );
}
