import { BookingStatus, Prisma } from "@prisma/client";
import { prisma } from "../../../../../lib/db";

export type ReportFilters = {
  from: string;
  to: string;
  city: string;
  eventType: string;
  status: BookingStatus | "ALL";
};

function single(searchParams: Record<string, string | string[] | undefined>, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export function parseReportFilters(
  searchParams: Record<string, string | string[] | undefined>
): ReportFilters {
  const rawStatus = single(searchParams, "status");
  const status: BookingStatus | "ALL" =
    rawStatus === "ALL" || (rawStatus && Object.values(BookingStatus).includes(rawStatus as BookingStatus))
      ? (rawStatus as BookingStatus | "ALL")
      : BookingStatus.ACCEPTED;

  return {
    from: single(searchParams, "from") ?? "",
    to: single(searchParams, "to") ?? "",
    city: single(searchParams, "city") ?? "",
    eventType: single(searchParams, "eventType") ?? "",
    status,
  };
}

export function buildBookingWhere(filters: ReportFilters): Prisma.BookingWhereInput {
  const where: Prisma.BookingWhereInput = {};

  if (filters.status !== "ALL") {
    where.status = filters.status;
  }

  if (filters.from || filters.to) {
    where.createdAt = {
      ...(filters.from ? { gte: new Date(`${filters.from}T00:00:00.000`) } : {}),
      ...(filters.to ? { lte: new Date(`${filters.to}T23:59:59.999`) } : {}),
    };
  }

  if (filters.city || filters.eventType) {
    where.events = {
      some: {
        ...(filters.city ? { city: filters.city } : {}),
        ...(filters.eventType ? { eventType: filters.eventType } : {}),
      },
    };
  }

  return where;
}

export async function loadReportData(filters: ReportFilters) {
  const where = buildBookingWhere(filters);

  const [bookings, cityRows, eventTypeRows] = await Promise.all([
    prisma.booking.findMany({
      where,
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        totalAmount: true,
        status: true,
        createdAt: true,
        events: {
          select: {
            city: true,
            eventType: true,
            guestService: true,
            photographyTier: true,
            videographyTier: true,
          },
        },
      },
    }),
    prisma.bookingEvent.findMany({
      distinct: ["city"],
      select: { city: true },
      orderBy: { city: "asc" },
    }),
    prisma.bookingEvent.findMany({
      distinct: ["eventType"],
      select: { eventType: true },
      orderBy: { eventType: "asc" },
    }),
  ]);

  return {
    bookings,
    cityOptions: cityRows.map((row) => row.city),
    eventTypeOptions: eventTypeRows.map((row) => row.eventType),
  };
}

export type ReportBooking = Awaited<ReturnType<typeof loadReportData>>["bookings"][number];

export function summarizeByMonth(bookings: ReportBooking[]) {
  const buckets = new Map<string, { count: number; total: number }>();

  for (const booking of bookings) {
    const key = `${booking.createdAt.getFullYear()}-${String(booking.createdAt.getMonth() + 1).padStart(2, "0")}`;
    const bucket = buckets.get(key) ?? { count: 0, total: 0 };
    bucket.count += 1;
    bucket.total += booking.totalAmount;
    buckets.set(key, bucket);
  }

  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => {
      const [year, month] = key.split("-").map(Number);
      const label = new Date(year, month - 1, 1).toLocaleDateString("en-GB", {
        month: "short",
        year: "numeric",
      });
      return { key, label, ...value };
    });
}

export function summarizeByField(
  bookings: ReportBooking[],
  field: "city" | "eventType"
) {
  const counts = new Map<string, number>();

  for (const booking of bookings) {
    for (const event of booking.events) {
      const value = event[field];
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }

  return [...counts.entries()].sort(([, a], [, b]) => b - a);
}

const SERVICE_LABELS = {
  phonePouches: "Phone Pouches",
  monitoring: "Monitoring (Non-Pouches)",
  photography: "Female Photography",
  videography: "Videography",
} as const;

export function summarizeByService(bookings: ReportBooking[]) {
  const counts: Record<keyof typeof SERVICE_LABELS, number> = {
    phonePouches: 0,
    monitoring: 0,
    photography: 0,
    videography: 0,
  };

  for (const booking of bookings) {
    for (const event of booking.events) {
      if (event.guestService === "phone-pouches") counts.phonePouches += 1;
      if (event.guestService === "monitoring") counts.monitoring += 1;
      if (event.photographyTier) counts.photography += 1;
      if (event.videographyTier) counts.videography += 1;
    }
  }

  return (Object.keys(SERVICE_LABELS) as (keyof typeof SERVICE_LABELS)[]).map((key) => ({
    label: SERVICE_LABELS[key],
    count: counts[key],
  }));
}
