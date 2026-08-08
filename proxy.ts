import { NextRequest, NextResponse } from "next/server";
import { decryptSession, SESSION_COOKIE_NAME } from "./app/lib/admin/auth";

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (!path.startsWith("/admin")) return NextResponse.next();

  const isLoginRoute = path === "/admin/login";
  const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await decryptSession(cookie);

  if (!isLoginRoute && !session?.adminUserId) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }

  if (isLoginRoute && session?.adminUserId) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
