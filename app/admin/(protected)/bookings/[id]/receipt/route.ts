import { prisma } from "../../../../../lib/db";
import { verifyAdminSession } from "../../../../../lib/admin/dal";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await verifyAdminSession();

  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    select: { receiptData: true, receiptMimeType: true, receiptFileName: true },
  });

  if (!booking) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(new Uint8Array(booking.receiptData), {
    headers: {
      "Content-Type": booking.receiptMimeType,
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(booking.receiptFileName)}`,
      "Cache-Control": "private, no-store",
    },
  });
}
