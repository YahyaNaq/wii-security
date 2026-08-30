import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "../db";
import { decryptSession, SESSION_COOKIE_NAME } from "./auth";

export const verifyAdminSession = cache(async () => {
  const cookie = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const session = await decryptSession(cookie);

  if (!session?.adminUserId) {
    redirect("/admin/login");
  }

  return { adminUserId: session.adminUserId };
});

export const getCurrentAdmin = cache(async () => {
  const session = await verifyAdminSession();

  const admin = await prisma.adminUser.findUnique({
    where: { id: session.adminUserId },
    select: { id: true, email: true, name: true },
  });

  if (!admin) {
    redirect("/admin/login");
  }

  const allowedEmail = process.env.ALLOWED_ADMIN_EMAIL?.toLowerCase();
  if (allowedEmail && admin.email.toLowerCase() !== allowedEmail) {
    redirect("/admin/login");
  }

  return admin;
});
