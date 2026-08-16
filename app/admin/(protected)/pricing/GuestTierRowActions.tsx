"use client";

import { useState, useTransition } from "react";
import { RowActionsMenu, type RowAction } from "../_components/table/RowActionsMenu";
import { GuestTierForm } from "./GuestTierForm";
import { deleteGuestTier } from "./actions";

type GuestTier = {
  id: string;
  slug: string;
  minGuests: number;
  maxGuests: number;
  price: number;
};

export function GuestTierRowActions({ tier }: { tier: GuestTier }) {
  const [editOpen, setEditOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!window.confirm(`Delete guest tier "${tier.slug}"? This can't be undone.`)) return;
    startTransition(async () => {
      await deleteGuestTier(tier.id);
    });
  };

  const actions: RowAction[] = [
    { label: "Edit", onClick: () => setEditOpen(true) },
    { label: "Delete", variant: "danger", disabled: pending, onClick: handleDelete },
  ];

  return (
    <>
      <RowActionsMenu actions={actions} />
      <GuestTierForm open={editOpen} onOpenChange={setEditOpen} tier={tier} />
    </>
  );
}
