"use client";

import Image from "next/image";
import { useActionState } from "react";
import { login } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <form
        action={formAction}
        className="w-full max-w-sm rounded-lg border border-neutral-800 bg-neutral-900 p-8 shadow-lg"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <Image
            src="/wii-security-logo.png"
            alt="WII Security"
            width={70}
            height={70}
            className="mb-3 h-12 w-12 shrink-0 rounded-md bg-white object-contain"
            priority
          />
          <h1 className="text-xl font-semibold text-white">WII Security Admin</h1>
          <p className="text-sm text-neutral-400">Sign in to manage quotes and bookings.</p>
        </div>

        <label htmlFor="email" className="mb-1 block text-sm text-neutral-300">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="mb-4 w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-neutral-500"
        />

        <label htmlFor="password" className="mb-1 block text-sm text-neutral-300">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mb-4 w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-neutral-500"
        />

        {state?.error && <p className="mb-4 text-sm text-red-400">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-white px-3 py-2 font-medium text-neutral-950 transition hover:bg-neutral-200 disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
