"use client";

import { useEffect, useState, useTransition } from "react";
import { SalaryStatus } from "@prisma/client";
import { StatusBadge } from "../../../../_components/table/StatusBadge";
import { formatPkr, formatDateLong } from "../../../../../../lib/format";
import { getEmployeeSalaryPeriods, releaseSalaryPeriod, type SalaryPeriod } from "../../salaryActions";
import Button from "../../../../../_components/Button";
import { DateField } from "../../../../../_components/DateField";

function monthLabel(year: number, month: number) {
  return new Date(year, month - 1, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

function PeriodRow({ employeeId, period, onReleased }: { employeeId: string; period: SalaryPeriod; onReleased: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [releaseDate, setReleaseDate] = useState<Date | undefined>(() => new Date());
  const [bonusInput, setBonusInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const bonus = bonusInput ? Number(bonusInput) : 0;
  const bonusValid = Number.isInteger(bonus) && bonus >= 0;

  const handleRelease = () => {
    if (!releaseDate || !bonusValid) return;
    setError(null);
    startTransition(async () => {
      const result = await releaseSalaryPeriod(employeeId, period.year, period.month, releaseDate, bonus);
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
        <div className="flex flex-1 items-center gap-2 text-sm font-medium">
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
            {period.bonus > 0 && ` · +${formatPkr(period.bonus)} bonus`}
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
                <div key={gig.id} className="text-sm">
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
              <label className="flex items-center gap-1.5 text-xs text-neutral-500">
                Bonus
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={bonusInput}
                  onChange={(e) => setBonusInput(e.target.value)}
                  placeholder="0"
                  className="w-24 rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1.5 text-sm text-white placeholder:text-neutral-600 focus:border-neutral-600 focus:outline-none"
                />
              </label>
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
                disabled={pending || period.gigs.length === 0 || !releaseDate || !bonusValid}
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

export function SalaryPeriodsPanel({ employeeId }: { employeeId: string }) {
  const [periods, setPeriods] = useState<SalaryPeriod[] | null>(null);

  const load = () => {
    setPeriods(null);
    getEmployeeSalaryPeriods(employeeId).then(setPeriods);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch salary data on mount
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  return (
    <div className="space-y-2">
      {periods === null && <p className="py-4 text-center text-sm text-neutral-500">Loading…</p>}
      {periods?.length === 0 && (
        <p className="py-4 text-center text-sm text-neutral-500">No gigs recorded for this employee yet.</p>
      )}
      {periods?.map((period) => (
        <PeriodRow key={`${period.year}-${period.month}`} employeeId={employeeId} period={period} onReleased={load} />
      ))}
    </div>
  );
}
