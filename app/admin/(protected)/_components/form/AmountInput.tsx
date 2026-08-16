"use client";

import { useState } from "react";
import { formatAmount } from "../../../../lib/format";

// Displays the numeric value comma-grouped while typing; the raw digits are
// submitted via a hidden input under `name` so server actions keep reading a plain number.
export function AmountInput({
  id,
  name,
  defaultValue,
  className,
  required,
}: {
  id: string;
  name: string;
  defaultValue?: number;
  className: string;
  required?: boolean;
}) {
  const [raw, setRaw] = useState(defaultValue != null ? String(defaultValue) : "");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRaw(event.target.value.replace(/\D/g, ""));
  };

  return (
    <>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        value={raw ? formatAmount(Number(raw)) : ""}
        onChange={handleChange}
        className={className}
        required={required}
      />
      <input type="hidden" name={name} value={raw} />
    </>
  );
}
