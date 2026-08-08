"use client";

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
        <h1 className="mb-1 text-xl font-semibold text-white">WII Security Admin</h1>
        <p className="mb-6 text-sm text-neutral-400">Sign in to manage quotes and bookings.</p>

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
