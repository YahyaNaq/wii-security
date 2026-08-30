"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { cn } from "./cn";
import { theme } from "./theme";

export function fieldClasses(hasError?: boolean) {
  return cn(
    "rounded-xl border px-4 py-2.5 text-foreground",
    hasError
      ? "border-red-400 outline-none focus:border-red-500"
      : `${theme.border.solid} ${theme.focusRing}`
  );
}

export function FieldLabel({
  label,
  error,
  className,
  children,
}: {
  label: React.ReactNode;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={className ?? "flex min-w-0 flex-col gap-1.5 text-sm text-foreground/70"}>
      {label}
      {children}
      {error && <span className="text-xs font-normal normal-case text-red-600">{error}</span>}
    </label>
  );
}

export function TextField({
  label,
  error,
  className,
  ...props
}: { label: React.ReactNode; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldLabel label={label} error={error}>
      <input className={cn(fieldClasses(!!error), className)} {...props} />
    </FieldLabel>
  );
}

export type Option = string | { value: string; label?: string; description?: string };

export function normalizeOption(option: Option) {
  return typeof option === "string"
    ? { value: option, label: option, description: undefined }
    : { label: option.value, ...option };
}

function OptionTooltip({ label, description }: { label: string; description: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label={`What's included in ${label}`}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          className={`flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border ${theme.border.accentStrong} text-[10px] font-semibold text-brand-dark/70 transition-colors hover:border-brand ${theme.text.hoverAccent}`}
        >
          i
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          role="tooltip"
          side="top"
          align="center"
          sideOffset={8}
          collisionPadding={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="pointer-events-none z-50 w-48 rounded-lg bg-foreground px-3 py-2 text-xs font-normal normal-case leading-5 text-background shadow-lg"
        >
          {description}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function OptionGroupField({
  type,
  label,
  name,
  options,
  required,
  error,
  className,
  otherOption,
  otherFieldName,
  otherFieldPlaceholder = "Please specify",
  defaultValue,
  otherDefaultValue,
}: {
  type: "radio" | "checkbox";
  label: React.ReactNode;
  name: string;
  options: Option[];
  required?: boolean;
  error?: string;
  className?: string;
  otherOption?: string;
  otherFieldName?: string;
  otherFieldPlaceholder?: string;
  defaultValue?: string;
  otherDefaultValue?: string;
}) {
  return (
    <fieldset
      className={cn(
        "group/options flex flex-col gap-2 text-sm text-foreground/70",
        className
      )}
    >
      <legend className="mb-0.5">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const { value, label: optionLabel, description } = normalizeOption(option);
          return (
            <span
              key={value}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm text-foreground/80 transition-colors has-[:checked]:border-brand has-[:checked]:bg-blush",
                `has-[:checked]:${theme.text.accent}`,
                error ? "border-red-400" : theme.border.solid
              )}
            >
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type={type}
                  name={name}
                  value={value}
                  required={required}
                  defaultChecked={value === defaultValue}
                  data-other={value === otherOption ? "" : undefined}
                  className="accent-brand"
                />
                {optionLabel}
              </label>
              {description && <OptionTooltip label={optionLabel!} description={description} />}
            </span>
          );
        })}
      </div>
      {otherOption && (
        <input
          type="text"
          name={otherFieldName ?? `${name}Other`}
          placeholder={otherFieldPlaceholder}
          defaultValue={otherDefaultValue}
          className={cn(
            fieldClasses(false),
            "hidden group-has-[[data-other]:checked]/options:block"
          )}
        />
      )}
      {error && <span className="text-xs font-normal normal-case text-red-600">{error}</span>}
    </fieldset>
  );
}

export function RadioGroupField(
  props: Omit<React.ComponentProps<typeof OptionGroupField>, "type">
) {
  return <OptionGroupField type="radio" {...props} />;
}

export function CheckboxGroupField(
  props: Omit<React.ComponentProps<typeof OptionGroupField>, "type">
) {
  return <OptionGroupField type="checkbox" {...props} />;
}

export function FileField({
  label,
  name,
  required,
  error,
  accept,
  placeholder = "Choose a file...",
  browseLabel = "Browse",
  helperText,
}: {
  label: React.ReactNode;
  name: string;
  required?: boolean;
  error?: string;
  accept?: string;
  placeholder?: string;
  browseLabel?: string;
  helperText?: React.ReactNode;
}) {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <FieldLabel label={label} error={error}>
      <div
        className={cn(
          fieldClasses(!!error),
          "relative flex cursor-pointer items-center justify-between gap-2"
        )}
      >
        <span className={cn("truncate", !fileName && "text-foreground/40")}>
          {fileName ?? placeholder}
        </span>
        <span
          className={`shrink-0 rounded-full bg-brand-light/70 px-3 py-1 text-xs font-semibold ${theme.text.accent}`}
        >
          {browseLabel}
        </span>
        <input
          type="file"
          name={name}
          accept={accept}
          required={required}
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
      {helperText && <p className="text-xs leading-5 text-foreground/50">{helperText}</p>}
    </FieldLabel>
  );
}

export function TextareaField({
  label,
  error,
  className,
  ...props
}: { label: React.ReactNode; error?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FieldLabel label={label} error={error}>
      <textarea
        className={cn("resize-none", fieldClasses(!!error), className)}
        {...props}
      />
    </FieldLabel>
  );
}
