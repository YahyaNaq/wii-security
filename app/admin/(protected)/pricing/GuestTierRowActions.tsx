"use client";

import { useState, useTransition } from "react";
import { RowActionsMenu, type RowAction } from "../_components/table/RowActionsMenu";
import { GuestTierForm, type GuestTier, type GuestTierActions } from "./GuestTierForm";

export function GuestTierRowActions({ tier, actions }: { tier: GuestTier; actions: GuestTierActions }) {
  const [editOpen, setEditOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!window.confirm(`Delete guest tier "${tier.slug}"? This can't be undone.`)) return;
    startTransition(async () => {
      await actions.delete(tier.id);
    });
  };

  const rowActions: RowAction[] = [
    { label: "Edit", onClick: () => setEditOpen(true) },
    { label: "Delete", variant: "danger", disabled: pending, onClick: handleDelete },
  ];

  return (
    <>
      <RowActionsMenu actions={rowActions} />
      <GuestTierForm open={editOpen} onOpenChange={setEditOpen} tier={tier} actions={actions} />
    </>
  );
}
