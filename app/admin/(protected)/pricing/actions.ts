"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Prisma, PricedServiceType } from "@prisma/client";
import { prisma } from "../../../lib/db";
import { verifyAdminSession } from "../../../lib/admin/dal";
import { isPositiveNumber } from "../../../lib/validators";

const tierSchema = z
  .object({
    slug: z.string().trim().min(1, "Slug is required"),
    minGuests: z.string().refine(isPositiveNumber, "Enter a valid number").transform(Number),
    maxGuests: z.string().refine(isPositiveNumber, "Enter a valid number").transform(Number),
    price: z.string().refine(isPositiveNumber, "Enter a valid price").transform(Number),
  })
  .refine((data) => data.maxGuests >= data.minGuests, {
    message: "Max guests must be greater than or equal to min guests",
    path: ["maxGuests"],
  });

export type TierActionResult = { success: true } | { success: false; error: string };

function parseTierFormData(formData: FormData) {
  return {
    slug: formData.get("slug"),
    minGuests: formData.get("minGuests"),
    maxGuests: formData.get("maxGuests"),
    price: formData.get("price"),
  };
}

function revalidatePricingPaths() {
  revalidatePath("/admin/pricing/pouch-tiers");
  revalidatePath("/admin/pricing/monitoring-tiers");
  revalidatePath("/admin/pricing/packages");
  revalidatePath("/get-a-quote");
}

async function findOverlappingPouchTier(minGuests: number, maxGuests: number, excludeId?: string) {
  return prisma.pouchGuestTierPrice.findFirst({
    where: {
      id: excludeId ? { not: excludeId } : undefined,
      minGuests: { lte: maxGuests },
      maxGuests: { gte: minGuests },
    },
  });
}

export async function createPouchTier(formData: FormData): Promise<TierActionResult> {
  await verifyAdminSession();

  const parsed = tierSchema.safeParse(parseTierFormData(formData));
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const overlap = await findOverlappingPouchTier(parsed.data.minGuests, parsed.data.maxGuests);
  if (overlap) {
    return { success: false, error: `Range overlaps with existing tier "${overlap.slug}" (${overlap.minGuests}–${overlap.maxGuests})` };
  }

  try {
    await prisma.pouchGuestTierPrice.create({ data: parsed.data });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { success: false, error: "A tier with this slug already exists" };
    }
    throw err;
  }

  revalidatePricingPaths();
  return { success: true };
}

export async function updatePouchTier(tierId: string, formData: FormData): Promise<TierActionResult> {
  await verifyAdminSession();

  const parsed = tierSchema.safeParse(parseTierFormData(formData));
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const overlap = await findOverlappingPouchTier(parsed.data.minGuests, parsed.data.maxGuests, tierId);
  if (overlap) {
    return { success: false, error: `Range overlaps with existing tier "${overlap.slug}" (${overlap.minGuests}–${overlap.maxGuests})` };
  }

  try {
    await prisma.pouchGuestTierPrice.update({ where: { id: tierId }, data: parsed.data });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { success: false, error: "A tier with this slug already exists" };
    }
    throw err;
  }

  revalidatePricingPaths();
  return { success: true };
}

export async function deletePouchTier(tierId: string): Promise<TierActionResult> {
  await verifyAdminSession();

  await prisma.pouchGuestTierPrice.delete({ where: { id: tierId } });

  revalidatePricingPaths();
  return { success: true };
}

async function findOverlappingMonitoringTier(minGuests: number, maxGuests: number, excludeId?: string) {
  return prisma.monitoringGuestTierPrice.findFirst({
    where: {
      id: excludeId ? { not: excludeId } : undefined,
      minGuests: { lte: maxGuests },
      maxGuests: { gte: minGuests },
    },
  });
}

export async function createMonitoringTier(formData: FormData): Promise<TierActionResult> {
  await verifyAdminSession();

  const parsed = tierSchema.safeParse(parseTierFormData(formData));
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const overlap = await findOverlappingMonitoringTier(parsed.data.minGuests, parsed.data.maxGuests);
  if (overlap) {
    return { success: false, error: `Range overlaps with existing tier "${overlap.slug}" (${overlap.minGuests}–${overlap.maxGuests})` };
  }

  try {
    await prisma.monitoringGuestTierPrice.create({ data: parsed.data });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { success: false, error: "A tier with this slug already exists" };
    }
    throw err;
  }

  revalidatePricingPaths();
  return { success: true };
}

export async function updateMonitoringTier(tierId: string, formData: FormData): Promise<TierActionResult> {
  await verifyAdminSession();

  const parsed = tierSchema.safeParse(parseTierFormData(formData));
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const overlap = await findOverlappingMonitoringTier(parsed.data.minGuests, parsed.data.maxGuests, tierId);
  if (overlap) {
    return { success: false, error: `Range overlaps with existing tier "${overlap.slug}" (${overlap.minGuests}–${overlap.maxGuests})` };
  }

  try {
    await prisma.monitoringGuestTierPrice.update({ where: { id: tierId }, data: parsed.data });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { success: false, error: "A tier with this slug already exists" };
    }
    throw err;
  }

  revalidatePricingPaths();
  return { success: true };
}

export async function deleteMonitoringTier(tierId: string): Promise<TierActionResult> {
  await verifyAdminSession();

  await prisma.monitoringGuestTierPrice.delete({ where: { id: tierId } });

  revalidatePricingPaths();
  return { success: true };
}

const serviceOptionSchema = z.object({
  serviceType: z.enum(PricedServiceType),
  slug: z.string().trim().min(1, "Slug is required"),
  label: z.string().trim().min(1, "Label is required"),
  price: z.string().refine(isPositiveNumber, "Enter a valid price").transform(Number),
});

function parseServiceOptionFormData(formData: FormData) {
  return {
    serviceType: formData.get("serviceType"),
    slug: formData.get("slug"),
    label: formData.get("label"),
    price: formData.get("price"),
  };
}

export async function createServiceOption(formData: FormData): Promise<TierActionResult> {
  await verifyAdminSession();

  const parsed = serviceOptionSchema.safeParse(parseServiceOptionFormData(formData));
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await prisma.serviceOptionPrice.create({ data: parsed.data });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { success: false, error: "A package with this slug already exists for this service" };
    }
    throw err;
  }

  revalidatePricingPaths();
  return { success: true };
}

export async function updateServiceOption(optionId: string, formData: FormData): Promise<TierActionResult> {
  await verifyAdminSession();

  const parsed = serviceOptionSchema.safeParse(parseServiceOptionFormData(formData));
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await prisma.serviceOptionPrice.update({ where: { id: optionId }, data: parsed.data });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { success: false, error: "A package with this slug already exists for this service" };
    }
    throw err;
  }

  revalidatePricingPaths();
  return { success: true };
}

export async function deleteServiceOption(optionId: string): Promise<TierActionResult> {
  await verifyAdminSession();

  await prisma.serviceOptionPrice.delete({ where: { id: optionId } });

  revalidatePricingPaths();
  return { success: true };
}
