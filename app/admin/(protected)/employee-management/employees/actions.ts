"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Prisma, EmploymentStatus } from "@prisma/client";
import { prisma } from "../../../../lib/db";
import { verifyAdminSession } from "../../../../lib/admin/dal";
import { isValidEmail, isValidPhoneNumber } from "../../../../lib/validators";

const CNIC_REGEX = /^\d{5}-?\d{7}-?\d{1}$/;

const employeeSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  phoneNumber: z.string().trim().refine(isValidPhoneNumber, "Enter a valid phone number"),
  email: z.string().trim().refine(isValidEmail, "Enter a valid email"),
  jobTitleId: z.string().trim().min(1, "Job title is required"),
  cnic: z.string().trim().regex(CNIC_REGEX, "Enter a valid CNIC (13 digits)"),
  address: z.string().trim().min(1, "Address is required"),
  city: z.string().trim().min(1, "City is required"),
  employmentStatus: z.enum(EmploymentStatus),
  emergencyContactName: z.string().trim().optional().transform((v) => v || undefined),
  emergencyContactNumber: z.string().trim().optional().transform((v) => v || undefined),
});

export type EmployeeActionResult = { success: true } | { success: false; error: string };

function parseEmployeeFormData(formData: FormData) {
  return {
    name: formData.get("name"),
    phoneNumber: formData.get("phoneNumber"),
    email: formData.get("email"),
    jobTitleId: formData.get("jobTitleId"),
    cnic: formData.get("cnic"),
    address: formData.get("address"),
    city: formData.get("city"),
    employmentStatus: formData.get("employmentStatus"),
    emergencyContactName: formData.get("emergencyContactName"),
    emergencyContactNumber: formData.get("emergencyContactNumber"),
  };
}

function revalidateEmployeePaths() {
  revalidatePath("/admin/employee-management/employees");
}

export async function createEmployee(formData: FormData): Promise<EmployeeActionResult> {
  await verifyAdminSession();

  const parsed = employeeSchema.safeParse(parseEmployeeFormData(formData));
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await prisma.employee.create({ data: parsed.data });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { success: false, error: "An employee with this CNIC already exists" };
    }
    throw err;
  }

  revalidateEmployeePaths();
  return { success: true };
}

export async function updateEmployee(employeeId: string, formData: FormData): Promise<EmployeeActionResult> {
  await verifyAdminSession();

  const parsed = employeeSchema.safeParse(parseEmployeeFormData(formData));
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await prisma.employee.update({ where: { id: employeeId }, data: parsed.data });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { success: false, error: "An employee with this CNIC already exists" };
    }
    throw err;
  }

  revalidateEmployeePaths();
  return { success: true };
}
