"use client";

import { useState } from "react";
import { formatPkr, formatDateLong } from "../../../lib/format";
import { RowActionsMenu, type RowAction } from "../_components/table/RowActionsMenu";
import { DetailDialog } from "../_components/table/DetailDialog";

type QuoteDetail = {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalAmount: number;
  createdAt: Date;
  events: {
    id: string;
    city: string;
    date: Date;
    femaleGuests: number;
    subtotal: number;
  }[];
};

export function QuoteRowActions({ quote }: { quote: QuoteDetail }) {
  const [viewOpen, setViewOpen] = useState(false);

  const actions: RowAction[] = [{ label: "View", onClick: () => setViewOpen(true) }];

  return (
    <>
      <RowActionsMenu actions={actions} />
      <DetailDialog open={viewOpen} onOpenChange={setViewOpen} title={quote.name}>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-neutral-500">Phone</dt>
            <dd>{quote.phone}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500">Email</dt>
            <dd>{quote.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500">Total</dt>
            <dd>{formatPkr(quote.totalAmount)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500">Submitted</dt>
            <dd>{formatDateLong(quote.createdAt)}</dd>
          </div>
          <div>
            <dt className="mb-2 text-neutral-500">Events</dt>
            <dd className="space-y-2">
              {quote.events.map((event) => (
                <div key={event.id} className="rounded-md border border-neutral-800 p-3">
                  <p className="font-medium">{event.city}</p>
                  <p className="text-neutral-400">
                    {formatDateLong(event.date)} · {event.femaleGuests} guests
                  </p>
                  <p className="text-neutral-500">{formatPkr(event.subtotal)}</p>
                </div>
              ))}
            </dd>
          </div>
        </dl>
      </DetailDialog>
    </>
  );
}
