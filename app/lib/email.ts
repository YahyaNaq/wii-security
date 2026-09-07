import { Resend } from "resend";
import { BookingStatus } from "@prisma/client";
import { formatPkr, formatDateLong } from "./format";
import { siteFilenames } from "./filenames";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.QUOTE_EMAIL_FROM ?? "quotes@wiisecurity.com";
const BOOKING_EMAIL_FROM = process.env.BOOKING_EMAIL_FROM ?? "bookings@wiisecurity.com";

const BRAND = {
  brand: "#d6688b",
  brandDark: "#b8496a",
  brandLight: "#f7d9e2",
  blush: "#fdf1f4",
  ink: "#3a2530",
  muted: "#8a7078",
};

function escapeHtml(value: string | number) {
  return String(value).replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

function emailShell(bodyHtml: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:${BRAND.blush};font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.blush};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(184,73,106,0.12);">
            <tr>
              <td style="background-color:${BRAND.brandDark};padding:28px 32px;text-align:center;">
                <span style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;letter-spacing:2px;color:#ffffff;text-transform:uppercase;">WII Security</span>
                <div style="margin-top:4px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${BRAND.brandLight};">Women. Independent. Invincible.</div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="background-color:${BRAND.brandDark};padding:20px 32px;text-align:center;">
                <div style="font-size:12px;color:#ffffff;">info@wiisecurity.com &nbsp;·&nbsp; +92 300 000 0000</div>
                <div style="margin-top:4px;font-size:11px;color:${BRAND.brandLight};">Karachi · Lahore · Islamabad</div>
                <div style="margin-top:10px;font-size:10px;color:${BRAND.brandLight};">&copy; ${new Date().getFullYear()} WII Security. All rights reserved.</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

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
        filename: siteFilenames.quotePdf(quoteId),
        content: pdfBuffer,
      },
    ],
  });
}

type BookingStatusEmailStatus = typeof BookingStatus.ACCEPTED | typeof BookingStatus.REJECTED;

type BookingStatusEmailEvent = {
  city: string;
  date: Date;
  venue: string;
  reportingTime: string;
  eventType: string;
  femaleGuests: number;
  serviceSummary: string;
};

const BOOKING_STATUS_EMAIL_SUBJECT: Record<BookingStatusEmailStatus, string> = {
  [BookingStatus.ACCEPTED]: "Your booking has been accepted",
  [BookingStatus.REJECTED]: "Your booking has been rejected",
};

const BOOKING_STATUS_BADGE: Record<BookingStatusEmailStatus, { label: string; color: string }> = {
  [BookingStatus.ACCEPTED]: { label: "Accepted", color: "#3a8a5c" },
  [BookingStatus.REJECTED]: { label: "Rejected", color: "#b8496a" },
};

function bookingStatusEmailIntro(name: string, status: BookingStatusEmailStatus) {
  if (status === BookingStatus.ACCEPTED) {
    return `Hi ${escapeHtml(name)}, great news — your booking has been accepted. Our team will be in touch with further details ahead of your event. Here's a summary of what you booked:`;
  }
  return `Hi ${escapeHtml(name)}, we're sorry to let you know that your booking has been rejected. If you have any questions or believe this was a mistake, please reach out to our team. Here's a summary of what was submitted:`;
}

function bookingStatusEmailEventsHtml(events: BookingStatusEmailEvent[]) {
  return events
    .map(
      (event, i) => `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:${i === 0 ? "0" : "12px"};border:1px solid ${BRAND.brandLight};border-radius:12px;">
        <tr>
          <td style="padding:16px 18px;">
            <div style="font-size:12px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;color:${BRAND.brandDark};">Event ${i + 1} — ${escapeHtml(event.eventType)}</div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;font-size:13px;color:${BRAND.ink};">
              <tr>
                <td style="padding:3px 0;color:${BRAND.muted};width:110px;">Date</td>
                <td style="padding:3px 0;font-weight:500;">${escapeHtml(formatDateLong(event.date))}</td>
              </tr>
              <tr>
                <td style="padding:3px 0;color:${BRAND.muted};">Venue</td>
                <td style="padding:3px 0;font-weight:500;">${escapeHtml(event.venue)}, ${escapeHtml(event.city)}</td>
              </tr>
              <tr>
                <td style="padding:3px 0;color:${BRAND.muted};">Reporting time</td>
                <td style="padding:3px 0;font-weight:500;">${escapeHtml(event.reportingTime)}</td>
              </tr>
              <tr>
                <td style="padding:3px 0;color:${BRAND.muted};">Female guests</td>
                <td style="padding:3px 0;font-weight:500;">${escapeHtml(event.femaleGuests)}</td>
              </tr>
              <tr>
                <td style="padding:3px 0;color:${BRAND.muted};">Services</td>
                <td style="padding:3px 0;font-weight:500;">${escapeHtml(event.serviceSummary || "—")}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`
    )
    .join("");
}

function bookingStatusEmailHtml({
  name,
  status,
  bookingId,
  totalAmount,
  events,
}: {
  name: string;
  status: BookingStatusEmailStatus;
  bookingId: string;
  totalAmount: number;
  events: BookingStatusEmailEvent[];
}) {
  const badge = BOOKING_STATUS_BADGE[status];
  return emailShell(`
    <span style="display:inline-block;padding:5px 14px;border-radius:999px;background-color:${badge.color};color:#ffffff;font-size:12px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;">${badge.label}</span>
    <p style="margin:18px 0 24px;font-size:14px;line-height:22px;color:${BRAND.ink};">${bookingStatusEmailIntro(name, status)}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;background-color:${BRAND.blush};border-radius:12px;">
      <tr>
        <td style="padding:14px 18px;font-size:13px;color:${BRAND.ink};">
          <strong>Booking reference:</strong> ${escapeHtml(bookingId)}<br/>
          <strong>Total amount:</strong> ${escapeHtml(formatPkr(totalAmount))}
        </td>
      </tr>
    </table>
    ${bookingStatusEmailEventsHtml(events)}
  `);
}

export async function sendBookingStatusEmail({
  to,
  name,
  status,
  bookingId,
  totalAmount,
  events,
}: {
  to: string;
  name: string;
  status: BookingStatusEmailStatus;
  bookingId: string;
  totalAmount: number;
  events: BookingStatusEmailEvent[];
}) {
  await resend.emails.send({
    from: BOOKING_EMAIL_FROM,
    // to,
    to: "yahya.naqvi123@gmail.com",
    subject: BOOKING_STATUS_EMAIL_SUBJECT[status],
    html: bookingStatusEmailHtml({ name, status, bookingId, totalAmount, events }),
  });
}
