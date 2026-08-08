"use server";

import { redirect } from "next/navigation";
import { deleteAdminSession } from "../../lib/admin/session";

export async function logout() {
  await deleteAdminSession();
  redirect("/admin/login");
}
