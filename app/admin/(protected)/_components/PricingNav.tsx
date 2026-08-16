"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const CHILDREN = [
  { href: "/admin/pricing/guest-tiers", label: "Guest Tier" },
  { href: "/admin/pricing/packages", label: "Photography/Videography" },
];

export function PricingNav() {
  const pathname = usePathname();
  const isActive = pathname.startsWith("/admin/pricing");
  const [open, setOpen] = useState(isActive);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left hover:bg-neutral-900"
      >
        <span className={`text-xs transition-transform ${open ? "rotate-90" : ""}`}>▶</span>
        <span>Pricing</span>
      </button>
      {open && (
        <div className="mt-1 ml-3 flex flex-col gap-1 border-l border-neutral-800 pl-3">
          {CHILDREN.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={`rounded-md px-3 py-1.5 text-sm ${
                pathname === child.href
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
              }`}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
