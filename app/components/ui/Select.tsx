"use client";

import * as RadixSelect from "@radix-ui/react-select";
import { FieldLabel, fieldClasses } from "./fields";
import { theme } from "./theme";
import { cn } from "./cn";

export function SelectField({
  label,
  name,
  options,
  placeholder,
  required,
  error,
  defaultValue,
  value,
  onValueChange,
  className,
}: {
  label: React.ReactNode;
  name: string;
  options: string[];
  placeholder: string;
  required?: boolean;
  error?: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}) {
  return (
    <FieldLabel label={label} error={error}>
      <RadixSelect.Root
        name={name}
        required={required}
        defaultValue={defaultValue}
        value={value}
        onValueChange={onValueChange}
      >
        <RadixSelect.Trigger
          className={cn(
            fieldClasses(!!error),
            "flex cursor-pointer items-center justify-between gap-2 text-left data-[placeholder]:text-foreground/40",
            className
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
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
            className={`z-50 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border ${theme.border.solid} ${theme.surface} shadow-lg ${theme.shadow.sm}`}
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((option) => (
                <RadixSelect.Item
                  key={option}
                  value={option}
                  className={`relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm text-foreground outline-none data-[highlighted]:bg-blush data-[state=checked]:font-semibold data-[state=checked]:${theme.text.accent}`}
                >
                  <RadixSelect.ItemText>{option}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </FieldLabel>
  );
}
