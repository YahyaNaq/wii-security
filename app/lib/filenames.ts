// Central place for download / attachment filenames. Naming conventions for
// generated files should change here, not at each call site.

function dateStamp(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export const siteFilenames = {
  quotePdf: (quoteId: string) => `quote-${quoteId}.pdf`,
};

export const adminFilenames = {
  quotePdf: (quoteId: string) => `quote-${quoteId}.pdf`,
  bookingsReportCsv: () => `bookings-report-${dateStamp()}.csv`,
  payrollReportCsv: (periodLabel: string) => `payroll-report-${periodLabel}.csv`,
};
