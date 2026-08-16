"use client";

import * as RadixSelect from "@radix-ui/react-select";
import { FieldLabel, fieldClasses, normalizeOption, type Option } from "./fields";
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
  triggerClassName,
  contentClassName,
  itemClassName,
}: {
  label: React.ReactNode;
  name: string;
  options: Option[];
  placeholder: string;
  required?: boolean;
  error?: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  // Full overrides (not merged) for callers whose surrounding UI doesn't use the brand theme tokens.
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
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
          className={
            triggerClassName ??
            cn(
              fieldClasses(!!error),
              "flex cursor-pointer items-center justify-between gap-2 text-left data-[placeholder]:text-foreground/40",
              className
            )
          }
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
            className={
              contentClassName ??
              `z-50 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border ${theme.border.solid} ${theme.surface} shadow-lg ${theme.shadow.sm}`
            }
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((option) => {
                const { value, label: optionLabel } = normalizeOption(option);
                return (
                  <RadixSelect.Item
                    key={value}
                    value={value}
                    className={
                      itemClassName ??
                      `relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm text-foreground outline-none data-[highlighted]:bg-blush data-[state=checked]:font-semibold data-[state=checked]:${theme.text.accent}`
                    }
                  >
                    <RadixSelect.ItemText>{optionLabel}</RadixSelect.ItemText>
                  </RadixSelect.Item>
                );
              })}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </FieldLabel>
  );
}
