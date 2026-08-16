"use client";

import { useState, useTransition } from "react";
import { PricedServiceType } from "@prisma/client";
import { RowActionsMenu, type RowAction } from "../_components/table/RowActionsMenu";
import { ServiceOptionForm } from "./ServiceOptionForm";
import { deleteServiceOption } from "./actions";

type ServiceOption = {
  id: string;
  serviceType: PricedServiceType;
  slug: string;
  label: string;
  price: number;
};

export function ServiceOptionRowActions({ option }: { option: ServiceOption }) {
  const [editOpen, setEditOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!window.confirm(`Delete package "${option.label}"? This can't be undone.`)) return;
    startTransition(async () => {
      await deleteServiceOption(option.id);
    });
  };

  const actions: RowAction[] = [
    { label: "Edit", onClick: () => setEditOpen(true) },
    { label: "Delete", variant: "danger", disabled: pending, onClick: handleDelete },
  ];

  return (
    <>
      <RowActionsMenu actions={actions} />
      <ServiceOptionForm open={editOpen} onOpenChange={setEditOpen} option={option} />
    </>
  );
}
