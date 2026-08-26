"use client";

import { useState } from "react";
import * as RadixSelect from "@radix-ui/react-select";
import { FieldLabel, fieldClasses } from "./fields";
import { theme } from "./theme";
import { cn } from "./cn";

function maskNumber(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  return `${digits.slice(0, 3)} ${digits.slice(3)}`;
}

export function PhoneField({
  label,
  name,
  codes,
  required,
  error,
  placeholder = "300 1234567",
  defaultValue,
  onChange,
}: {
  label: React.ReactNode;
  name: string;
  codes: { code: string; country: string }[];
  required?: boolean;
  error?: string;
  placeholder?: string;
  defaultValue?: string;
  onChange?: () => void;
}) {
  const spaceIndex = defaultValue?.indexOf(" ") ?? -1;
  const defaultCode = spaceIndex > -1 ? defaultValue!.slice(0, spaceIndex) : defaultValue;
  const defaultNumber = spaceIndex > -1 ? defaultValue!.slice(spaceIndex + 1) : "";
  const [code, setCode] = useState(defaultCode || codes[0]?.code || "");
  const [number, setNumber] = useState(defaultNumber);
  const value = number ? `${code} ${number}` : "";

  return (
    <FieldLabel label={label} error={error}>
      <div className="flex min-w-0">
        <RadixSelect.Root value={code} onValueChange={setCode} disabled>
          <RadixSelect.Trigger
            className={cn(
              fieldClasses(false),
              "flex w-20 shrink-0 cursor-pointer items-center justify-between gap-1 rounded-r-none border-r-0"
            )}
          >
            <RadixSelect.Value>{code}</RadixSelect.Value>
            <RadixSelect.Icon>
              <svg viewBox="0 0 12 12" className="h-3 w-3 shrink-0" fill="none">
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </RadixSelect.Icon>
          </RadixSelect.Trigger>
          <RadixSelect.Portal>
            <RadixSelect.Content
              position="popper"
              sideOffset={6}
              className={`z-50 overflow-hidden rounded-xl border ${theme.border.solid} ${theme.surface} shadow-lg ${theme.shadow.sm}`}
            >
              <RadixSelect.Viewport className="p-1">
                {codes.map((c) => (
                  <RadixSelect.Item
                    key={c.code}
                    value={c.code}
                    className={`relative flex cursor-pointer select-none items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm text-foreground outline-none data-[highlighted]:bg-blush data-[state=checked]:font-semibold data-[state=checked]:${theme.text.accent}`}
                  >
                    <RadixSelect.ItemText>
                      {c.code} {c.country}
                    </RadixSelect.ItemText>
                  </RadixSelect.Item>
                ))}
              </RadixSelect.Viewport>
            </RadixSelect.Content>
          </RadixSelect.Portal>
        </RadixSelect.Root>
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={number}
          onChange={(e) => {
            setNumber(maskNumber(e.target.value));
            onChange?.();
          }}
          placeholder={placeholder}
          required={required}
          className={cn(fieldClasses(!!error), "min-w-0 flex-1 rounded-l-none")}
        />
      </div>
      <input type="hidden" name={name} value={value} required={required} />
    </FieldLabel>
  );
}
