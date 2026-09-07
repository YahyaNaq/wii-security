"use client";

import { useMemo, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Command } from "cmdk";
import { FieldLabel, normalizeOption, type Option } from "../../components/ui/fields";
import { cn } from "../../components/ui/cn";

const SIZES = {
  xs: "px-2 py-1 text-sm",
  sm: "px-3 py-1.5 text-sm",
};

// Radix's own Select only does single-key typeahead, not a real filter box, so a
// searchable dropdown (many options — employees, job titles, etc.) is built here
// on Popover + cmdk instead. Emits a hidden input like DateField does, so it still
// participates in plain <form> submission via `name`.
export function SearchableSelect({
  label,
  name,
  options,
  placeholder = "Select…",
  searchPlaceholder = "Type to search…",
  emptyMessage = "No matches.",
  value,
  onValueChange,
  required,
  error,
  size = "sm",
  fullWidth,
}: {
  label: React.ReactNode;
  name: string;
  options: Option[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
  error?: string;
  size?: keyof typeof SIZES;
  fullWidth?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const normalized = useMemo(() => options.map(normalizeOption), [options]);
  const selected = normalized.find((option) => option.value === value);

  return (
    <FieldLabel label={label} error={error} className="flex min-w-0 flex-col gap-1">
      <Popover.Root
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setSearch("");
        }}
      >
        <Popover.Trigger
          type="button"
          className={cn(
            "flex cursor-pointer items-center justify-between gap-2 rounded-md border border-neutral-800 bg-neutral-900 text-left text-white focus:border-neutral-600 focus:outline-none",
            SIZES[size],
            fullWidth && "w-full",
            !selected && "text-neutral-500"
          )}
        >
          <span className="truncate">{selected?.label ?? placeholder}</span>
          <svg viewBox="0 0 12 12" className="h-3 w-3 shrink-0 text-neutral-500" fill="none">
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={6}
            className="admin-portal z-50 w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-md border border-neutral-800 bg-neutral-900 shadow-lg"
          >
            <Command shouldFilter className="flex flex-col">
              <Command.Input
                value={search}
                onValueChange={setSearch}
                placeholder={searchPlaceholder}
                className="w-full border-b border-neutral-800 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-500"
              />
              <Command.List className="max-h-60 overflow-y-auto p-1">
                <Command.Empty className="px-3 py-2 text-sm text-neutral-500">{emptyMessage}</Command.Empty>
                {normalized.map((option) => (
                  <Command.Item
                    key={option.value}
                    value={option.label ?? option.value}
                    onSelect={() => {
                      onValueChange?.(option.value);
                      setOpen(false);
                      setSearch("");
                    }}
                    className="relative flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm text-white outline-none data-[selected=true]:bg-neutral-800"
                  >
                    {option.label}
                  </Command.Item>
                ))}
              </Command.List>
            </Command>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <input type="hidden" name={name} value={value ?? ""} required={required} />
    </FieldLabel>
  );
}
