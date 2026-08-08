"use client";

import { useTransition } from "react";
import { updateBookingStatus } from "./actions";

export default function BookingStatusActions({
  bookingId,
  status,
}: {
  bookingId: string;
  status: "IN_REVIEW" | "APPROVED" | "REJECTED";
}) {
  const [pending, startTransition] = useTransition();

  if (status !== "IN_REVIEW") {
    return <span className="text-neutral-500">{status}</span>;
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => updateBookingStatus(bookingId, "APPROVED"))}
        className="rounded-md border border-emerald-800 px-2 py-1 text-xs text-emerald-400 hover:bg-emerald-950 disabled:opacity-60"
      >
        Approve
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => updateBookingStatus(bookingId, "REJECTED"))}
        className="rounded-md border border-red-900 px-2 py-1 text-xs text-red-400 hover:bg-red-950 disabled:opacity-60"
      >
        Reject
      </button>
    </div>
  );
}
