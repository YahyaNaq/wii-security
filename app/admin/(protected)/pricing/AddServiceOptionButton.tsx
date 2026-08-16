"use client";

import { useState } from "react";
import { ServiceOptionForm } from "./ServiceOptionForm";

export function AddServiceOptionButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-neutral-950 hover:bg-neutral-200"
      >
        Add Package
      </button>
      <ServiceOptionForm open={open} onOpenChange={setOpen} />
    </>
  );
}
