"use client";

import { useState, useTransition } from "react";
import { BookingStatus } from "@prisma/client";
import { formatPkr, formatDateLong, formatDateTime } from "../../../lib/format";
import { RowActionsMenu, type RowAction } from "../_components/table/RowActionsMenu";
import { DetailDialog } from "../_components/table/DetailDialog";
import { updateBookingStatus } from "./actions";

type BookingDetail = {
  id: string;
  name: string;
  phone: string;
  totalAmount: number;
  status: BookingStatus;
  createdAt: Date;
  receiptFileName: string;
  events: {
    id: string;
    city: string;
    date: Date;
    venue: string;
    reportingTime: string;
    eventType: string;
    femaleGuests: number;
    serviceSummary: string;
  }[];
};

export function BookingRowActions({ booking }: { booking: BookingDetail }) {
  const [pending, startTransition] = useTransition();
  const [viewOpen, setViewOpen] = useState(false);

  const actions: RowAction[] = [{ label: "View", onClick: () => setViewOpen(true) }];

  if (booking.status === BookingStatus.IN_REVIEW) {
    actions.push(
      {
        label: "Accept",
        disabled: pending,
        onClick: () => startTransition(() => updateBookingStatus(booking.id, BookingStatus.ACCEPTED)),
      },
      {
        label: "Reject",
        variant: "danger",
        disabled: pending,
        onClick: () => startTransition(() => updateBookingStatus(booking.id, BookingStatus.REJECTED)),
      }
    );
  }

  return (
    <>
      <RowActionsMenu actions={actions} />
      <DetailDialog open={viewOpen} onOpenChange={setViewOpen} title={booking.name}>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-neutral-500">Phone</dt>
            <dd>{booking.phone}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500">Total</dt>
            <dd>{formatPkr(booking.totalAmount)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500">Submitted</dt>
            <dd>{formatDateTime(booking.createdAt)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500">Receipt</dt>
            <dd>
              <a
                href={`/admin/bookings/${booking.id}/receipt`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:underline"
              >
                {booking.receiptFileName}
              </a>
            </dd>
          </div>
          <div>
            <dt className="mb-2 text-neutral-500">Events</dt>
            <dd className="space-y-2">
              {booking.events.map((event) => (
                <div key={event.id} className="rounded-md border border-neutral-800 p-3">
                  <p className="font-medium">{event.venue}</p>
                  <p className="text-neutral-400">
                    {formatDateLong(event.date)} · {event.city} · {event.eventType} · {event.femaleGuests} guests
                  </p>
                  <p className="text-neutral-500">
                    {event.serviceSummary} · Reporting {event.reportingTime}
                  </p>
                </div>
              ))}
            </dd>
          </div>
        </dl>

        {booking.status === BookingStatus.IN_REVIEW && (
          <div className="mt-6 flex justify-end gap-2 border-t border-neutral-800 pt-4">
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await updateBookingStatus(booking.id, BookingStatus.REJECTED);
                  setViewOpen(false);
                })
              }
              className="rounded-md border border-red-900 px-3 py-1.5 text-sm text-red-400 hover:bg-red-950 disabled:pointer-events-none disabled:opacity-40"
            >
              Reject
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await updateBookingStatus(booking.id, BookingStatus.ACCEPTED);
                  setViewOpen(false);
                })
              }
              className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm text-white hover:bg-emerald-500 disabled:pointer-events-none disabled:opacity-40"
            >
              Accept
            </button>
          </div>
        )}
      </DetailDialog>
    </>
  );
}
