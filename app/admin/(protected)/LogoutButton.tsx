"use client";

import { useTransition } from "react";
import { logout } from "./actions";
import Button from "../_components/Button";

export default function LogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => logout())}
      variant="secondary"
      size="sm"
      fullWidth
    >
      {pending ? "Signing out…" : "Sign out"}
    </Button>
  );
}
