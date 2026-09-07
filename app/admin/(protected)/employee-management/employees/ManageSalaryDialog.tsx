"use client";

import { useEffect, useState, useTransition } from "react";
import { SalaryStatus } from "@prisma/client";
import { DetailDialog } from "../../_components/table/DetailDialog";
import { StatusBadge } from "../../_components/table/StatusBadge";
import { formatPkr, formatDateLong } from "../../../../lib/format";
import { getEmployeeSalaryPeriods, releaseSalaryPeriod, type SalaryPeriod } from "./salaryActions";
import Button from "../../../_components/Button";
import { DateField } from "../../../_components/DateField";

function monthLabel(year: number, month: number) {
  return new Date(year, month - 1, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

function PeriodRow({ employeeId, period, onReleased }: { employeeId: string; period: SalaryPeriod; onReleased: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [releaseDate, setReleaseDate] = useState<Date | undefined>(() => new Date());
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleRelease = () => {
    if (!releaseDate) return;
    setError(null);
    startTransition(async () => {
      const result = await releaseSalaryPeriod(employeeId, period.year, period.month, releaseDate);
      if (result.success) {
        onReleased();
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <div className="rounded-md border border-neutral-800">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded((e) => !e)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setExpanded((exp) => !exp);
          }
        }}
        className="flex cursor-pointer items-center justify-between gap-3 px-3 py-2.5"
      >
        <div className="flex flex-1 items-center gap-2 text-sm">
          <span className={`text-[10px] text-neutral-600 transition-transform ${expanded ? "rotate-90" : ""}`}>▶</span>
          <span>{monthLabel(period.year, period.month)}</span>
          <span className="text-xs text-neutral-500">
            {period.gigs.length} gig{period.gigs.length === 1 ? "" : "s"}
          </span>
        </div>
        <span className="text-sm font-medium">{formatPkr(period.amount)}</span>
        <StatusBadge
          label={period.status === SalaryStatus.RELEASED ? "Released" : "Pending"}
          tone={period.status === SalaryStatus.RELEASED ? "emerald" : "amber"}
        />
        {period.status === SalaryStatus.RELEASED && (
          <span className="text-xs text-neutral-500">
            {period.releasedAt && `on ${formatDateLong(period.releasedAt)}`}
          </span>
        )}
      </div>
      {error && <p className="px-3 pb-2 text-xs text-red-400">{error}</p>}
      {expanded && (
        <div className="space-y-3 border-t border-neutral-800 px-3 py-2.5">
          <div className="space-y-1.5">
            {period.gigs.length === 0 ? (
              <p className="text-xs text-neutral-500">No gigs on record for this month.</p>
            ) : (
              period.gigs.map((gig) => (
                <div key={gig.id} className="text-xs">
                  <p className="text-neutral-300">
                    {formatDateLong(gig.date)} — {gig.venue}, {gig.city}
                  </p>
                  <p className="text-neutral-500">{gig.serviceSummary}</p>
                </div>
              ))
            )}
          </div>
          {period.status !== SalaryStatus.RELEASED && (
            <div className="flex items-center justify-end gap-2 border-t border-neutral-800 pt-3">
              <DateField
                label=""
                name="releaseDate"
                value={releaseDate}
                onValueChange={setReleaseDate}
                disabled={{ after: new Date() }}
              />
              <Button
                type="button"
                onClick={handleRelease}
                disabled={pending || period.gigs.length === 0 || !releaseDate}
                variant="primary"
                size="sm"
              >
                {pending ? "Releasing…" : "Release"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ManageSalaryDialog({
  open,
  onOpenChange,
  employeeId,
  employeeName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: string;
  employeeName: string;
}) {
  const [periods, setPeriods] = useState<SalaryPeriod[] | null>(null);

  const load = () => {
    setPeriods(null);
    getEmployeeSalaryPeriods(employeeId).then(setPeriods);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch salary data when the dialog opens
    if (open) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, employeeId]);

  return (
    <DetailDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Manage Salary — ${employeeName}`}
      maxWidthClassName="max-w-3xl"
    >
      <div className="max-h-[70vh] space-y-2 overflow-y-auto pr-1">
        {periods === null && <p className="py-4 text-center text-sm text-neutral-500">Loading…</p>}
        {periods?.length === 0 && (
          <p className="py-4 text-center text-sm text-neutral-500">No gigs recorded for this employee yet.</p>
        )}
        {periods?.map((period) => (
          <PeriodRow
            key={`${period.year}-${period.month}`}
            employeeId={employeeId}
            period={period}
            onReleased={load}
          />
        ))}
      </div>
    </DetailDialog>
  );
}
