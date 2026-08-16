import Image from "next/image";
import Link from "next/link";
import { getCurrentAdmin } from "../../lib/admin/dal";
import LogoutButton from "./LogoutButton";
import { PricingNav } from "./_components/PricingNav";

export default async function AdminProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const admin = await getCurrentAdmin();

  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">
      <aside className="flex w-64 shrink-0 flex-col border-r border-neutral-800 p-4">
        <div className="mb-8 flex items-center gap-2">
          <Image
            src="/wii-security-logo.png"
            alt="WII Security"
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-md bg-white object-contain"
            priority
          />
          <div>
            <p className="text-sm font-semibold">WII Security</p>
            <p className="text-xs text-neutral-500">Admin Portal</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 text-sm">
          <Link href="/admin" className="rounded-md px-3 py-2 hover:bg-neutral-900">
            Dashboard
          </Link>
          <Link href="/admin/quotes" className="rounded-md px-3 py-2 hover:bg-neutral-900">
            Quotes
          </Link>
          <Link href="/admin/bookings" className="rounded-md px-3 py-2 hover:bg-neutral-900">
            Bookings
          </Link>
          <PricingNav />
        </nav>
        <div className="border-t border-neutral-800 pt-4">
          <p className="mb-2 truncate text-xs text-neutral-400">{admin.email}</p>
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 overflow-x-auto p-8">{children}</main>
    </div>
  );
}
