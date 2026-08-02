import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.QUOTE_EMAIL_FROM ?? "quotes@wiisecurity.com";

export async function sendQuoteEmail({
  to,
  name,
  quoteId,
  pdfBuffer,
}: {
  to: string;
  name: string;
  quoteId: string;
  pdfBuffer: Buffer;
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    // to,
    to: "yahya.naqvi123@gmail.com",
    subject: "We've received your quote request",
    text: `Hi ${name},\n\nThanks for requesting a quote. We've attached your estimated quote as a PDF. Our team will follow up with you shortly.\n\nQuote reference: ${quoteId}`,
    attachments: [
      {
        filename: `quote-${quoteId}.pdf`,
        content: pdfBuffer,
      },
    ],
  });
}
