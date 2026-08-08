import "server-only";
import { cookies } from "next/headers";
import { encryptSession, SESSION_COOKIE_NAME, SESSION_DURATION_MS } from "./auth";

export async function createAdminSession(adminUserId: string) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const session = await encryptSession({ adminUserId });
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
