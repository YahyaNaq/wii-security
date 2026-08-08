import { prisma } from "../../../lib/db";
import { formatPkr } from "../../../lib/format";

export default async function AdminQuotesPage() {
  const quotes = await prisma.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { events: true },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Quote Requests</h1>

      <div className="overflow-x-auto rounded-lg border border-neutral-800">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-800 text-neutral-400">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Events</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote) => (
              <tr key={quote.id} className="border-b border-neutral-800 last:border-0">
                <td className="px-4 py-3">{quote.name}</td>
                <td className="px-4 py-3 text-neutral-400">
                  <div>{quote.phone}</div>
                  <div className="text-neutral-500">{quote.email}</div>
                </td>
                <td className="px-4 py-3 text-neutral-400">
                  {quote.events.map((event) => event.city).join(", ")}
                </td>
                <td className="px-4 py-3">{formatPkr(quote.totalAmount)}</td>
                <td className="px-4 py-3 text-neutral-500">{quote.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
            {quotes.length === 0 && (
              <tr>
                <td className="px-4 py-3 text-neutral-500" colSpan={5}>
                  No quote requests yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
