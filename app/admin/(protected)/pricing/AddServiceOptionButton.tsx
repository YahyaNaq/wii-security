"use client";

import { useState } from "react";
import { ServiceOptionForm } from "./ServiceOptionForm";
import Button from "../../_components/Button";

export function AddServiceOptionButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)} variant="primary" size="sm">
        Add Package
      </Button>
      <ServiceOptionForm open={open} onOpenChange={setOpen} />
    </>
  );
}
