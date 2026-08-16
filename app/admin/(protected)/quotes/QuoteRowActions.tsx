"use client";

import { useState, useTransition } from "react";
import { formatPkr, formatDateLong } from "../../../lib/format";
import { pdfBase64ToUrl, openLoadingTab } from "../../../lib/pdf-client";
import { RowActionsMenu, type RowAction } from "../_components/table/RowActionsMenu";
import { DetailDialog } from "../_components/table/DetailDialog";
import { generateQuotePdf } from "./actions";

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
  const [pending, startTransition] = useTransition();

  const handleGeneratePdf = () => {
    const pdfTab = openLoadingTab("Preparing quote PDF…");
    startTransition(async () => {
      const result = await generateQuotePdf(quote.id);
      if (result.success) {
        const url = pdfBase64ToUrl(result.pdfBase64);
        if (pdfTab && !pdfTab.closed) {
          pdfTab.location.href = url;
        }
      } else if (pdfTab && !pdfTab.closed) {
        pdfTab.close();
        window.alert(result.error);
      }
    });
  };

  const actions: RowAction[] = [
    { label: "View", onClick: () => setViewOpen(true) },
    { label: "Generate PDF", disabled: pending, onClick: handleGeneratePdf },
  ];

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
