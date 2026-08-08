"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";

export type RowAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "danger";
  disabled?: boolean;
};

export function RowActionsMenu({ actions }: { actions: RowAction[] }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Row actions"
          className="rounded-md border border-neutral-800 px-2 py-1 text-neutral-400 hover:bg-neutral-900 hover:text-white"
        >
          ⋯
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-50 min-w-[140px] overflow-hidden rounded-md border border-neutral-800 bg-neutral-900 py-1 shadow-lg"
        >
          {actions.map((action) => {
            const className = `block w-full cursor-pointer px-3 py-1.5 text-left text-sm outline-none data-[highlighted]:bg-neutral-800 ${
              action.variant === "danger" ? "text-red-400" : "text-neutral-200"
            } ${action.disabled ? "pointer-events-none opacity-40" : ""}`;

            return (
              <DropdownMenu.Item key={action.label} asChild disabled={action.disabled}>
                {action.href ? (
                  <Link href={action.href} className={className}>
                    {action.label}
                  </Link>
                ) : (
                  <button type="button" onClick={action.onClick} className={className}>
                    {action.label}
                  </button>
                )}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
