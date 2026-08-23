"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../../lib/db";
import { verifyAdminSession } from "../../../../lib/admin/dal";
import { isPositiveNumber } from "../../../../lib/validators";

const jobTitleSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  // Salary is per gig, not a monthly/annual figure.
  salary: z.string().refine(isPositiveNumber, "Enter a valid salary").transform(Number),
});

export type JobTitleActionResult = { success: true } | { success: false; error: string };

function parseJobTitleFormData(formData: FormData) {
  return {
    title: formData.get("title"),
    salary: formData.get("salary"),
  };
}

function revalidateJobTitlePaths() {
  revalidatePath("/admin/employee-management/job-titles");
  revalidatePath("/admin/employee-management/employees");
}

export async function createJobTitle(formData: FormData): Promise<JobTitleActionResult> {
  await verifyAdminSession();

  const parsed = jobTitleSchema.safeParse(parseJobTitleFormData(formData));
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await prisma.jobTitle.create({ data: parsed.data });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { success: false, error: "A job title with this name already exists" };
    }
    throw err;
  }

  revalidateJobTitlePaths();
  return { success: true };
}

export async function updateJobTitle(jobTitleId: string, formData: FormData): Promise<JobTitleActionResult> {
  await verifyAdminSession();

  const parsed = jobTitleSchema.safeParse(parseJobTitleFormData(formData));
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await prisma.jobTitle.update({ where: { id: jobTitleId }, data: parsed.data });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { success: false, error: "A job title with this name already exists" };
    }
    throw err;
  }

  revalidateJobTitlePaths();
  return { success: true };
}

export async function deleteJobTitle(jobTitleId: string): Promise<JobTitleActionResult> {
  await verifyAdminSession();

  try {
    await prisma.jobTitle.delete({ where: { id: jobTitleId } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2003") {
      return { success: false, error: "This job title is assigned to one or more employees" };
    }
    throw err;
  }

  revalidateJobTitlePaths();
  return { success: true };
}
