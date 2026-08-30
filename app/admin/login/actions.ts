"use server";

import { redirect } from "next/navigation";
import { prisma } from "../../lib/db";
import { verifyPassword } from "../../lib/admin/auth";
import { createAdminSession } from "../../lib/admin/session";

export type LoginState = { error?: string } | undefined;

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return { error: "Enter your email and password." };
  }

  const normalizedEmail = email.toLowerCase();
  const allowedEmail = process.env.ALLOWED_ADMIN_EMAIL?.toLowerCase();

  const admin = await prisma.adminUser.findUnique({ where: { email: normalizedEmail } });
  const isValid = admin ? await verifyPassword(password, admin.passwordHash) : false;

  if (!admin || !isValid) {
    return { error: "Invalid email or password." };
  }

  if (allowedEmail && normalizedEmail !== allowedEmail) {
    return { error: "Invalid email or password." };
  }

  await createAdminSession(admin.id);
  redirect("/admin");
}
