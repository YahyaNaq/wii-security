import path from "path";
import fs from "fs";
import { Document, Page, Text, View, Image, Svg, Circle, StyleSheet } from "@react-pdf/renderer";
import { ServiceType } from "@prisma/client";
import { serviceLabel, tierLabel, type PricedEvent, type PricedService, type PricingTables } from "../pricing";
import { colors } from "./colors";
import { CalendarIcon, DocumentIcon, PhoneIcon, MailIcon, GlobeIcon, PinIcon, InfoIcon } from "./icons";
import { formatAmount, formatPkr, formatDateLong } from "../format";
import "./fonts";

// Decorative dot-grid pattern, fading toward the right edge of the total-charges card.
function DotPattern() {
  const rows = 20;
  const cols = 30;
  const spacing = 8;
  const dots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const opacity = 0.15 + (c / cols) * 0.35;
      dots.push(
        <Circle key={`${r}-${c}`} cx={c * spacing} cy={r * spacing} r={1.1} fill={colors.brandDark} opacity={opacity} />
      );
    }
  }
  return (
    <Svg
      viewBox={`0 0 ${cols * spacing} ${rows * spacing}`}
      style={{ width: cols * spacing, height: rows * spacing }}
    >
      {dots}
    </Svg>
  );
}

const LOGO_SRC = {
  data: fs.readFileSync(path.join(process.cwd(), "app", "lib", "pdf", "assets", "logo-trimmed.png")),
  format: "png" as const,
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 50,
    fontSize: 11,
    fontFamily: "Montserrat",
    color: colors.text,
  },
  contactFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.brandDark,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contactItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  contactText: { fontSize: 8, color: colors.white, fontFamily: "Montserrat", fontWeight: 500 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  brandGroup: { flexDirection: "row", alignItems: "center", gap: 12 },
  logo: { width: 39, height: 52 },
  brandBlock: { justifyContent: "center" },
  pageMark: { flexDirection: "row", alignItems: "center", gap: 6, opacity: 0.35, marginBottom: 14 },
  pageMarkLogo: { width: 12, height: 16 },
  pageMarkText: {
    fontSize: 10,
    fontFamily: "Poppins",
    fontWeight: 600,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  metaCard: {
    border: `0.75pt solid ${colors.brandSoft}`,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minWidth: 130,
  },
  metaDivider: { borderTop: `0.75pt solid ${colors.brandSoft}`, marginVertical: 6 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  metaLabel: {
    fontSize: 7,
    fontFamily: "Montserrat",
    fontWeight: 700,
    color: colors.textSubtle,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  metaValue: { fontSize: 9, fontFamily: "Montserrat", fontWeight: 700, color: colors.text, marginTop: 2 },
  brandName: {
    fontSize: 20,
    fontFamily: "Poppins",
    fontWeight: 600,
    letterSpacing: 1.25,
    textTransform: "uppercase",
    lineHeight: 1,
  },
  brandNameAccent: { color: colors.brandDark },
  tagline: {
    fontSize: 6,
    fontFamily: "Poppins",
    fontWeight: 500,
    color: colors.textSubtle,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 6,
  },
  title: { fontSize: 26, marginBottom: 8, fontFamily: "Playfair Display", fontWeight: 600 },
  titleRule: { width: 48, height: 1, backgroundColor: colors.brandDark, marginBottom: 12 },
  intro: { fontSize: 10, color: colors.textMuted, marginBottom: 20, lineHeight: 1.4 },
  introName: { fontFamily: "Montserrat", fontWeight: 700, color: colors.text },
  section: { marginBottom: 0 },
  sectionHeading: { fontSize: 13, fontFamily: "Montserrat", fontWeight: 700, marginBottom: 8 },
  eventBlock: {
    marginBottom: 14,
    border: `0.75pt solid ${colors.brandDark}`,
    borderRadius: 6,
  },
  eventHeader: { backgroundColor: colors.brandLightTint, paddingTop: 12, paddingHorizontal: 12 },
  eventLabel: {
    fontSize: 8,
    fontFamily: "Montserrat",
    fontWeight: 700,
    color: colors.brandDark,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  eventSummary: { fontSize: 13, fontFamily: "Montserrat", fontWeight: 700, marginBottom: 10 },
  eventDivider: { borderTop: `0.5pt solid ${colors.brandDark}`, marginBottom: 10 },
  subtotalRow: { flexDirection: "row", justifyContent: "space-between", backgroundColor: colors.brandLightTint, paddingHorizontal: 12, paddingVertical: 6 },
  subtotalDivider: { borderTop: `0.5pt solid ${colors.brandDark}`, marginTop: 6 },
  subtotalLabel: {
    fontFamily: "Montserrat",
    fontWeight: 700,
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableHeaderRow: { flexDirection: "row", marginBottom: 5, paddingHorizontal: 12 },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: "Montserrat",
    fontWeight: 700,
    color: colors.textSubtle,
    textTransform: "uppercase",
  },
  serviceRow: { flexDirection: "row", marginBottom: 5, paddingHorizontal: 12 },
  colService: { flex: 0.32 },
  colDetail: { flex: 0.48 },
  colPrice: { flex: 0.2, textAlign: "right" },
  serviceText: { fontSize: 10, fontWeight: 600 },
  detailText: { fontSize: 10, color: colors.textMuted },
  priceText: { fontSize: 10 },
  totalCard: {
    flexDirection: "row",
    border: `0.5pt solid ${colors.brandDark}`,
    borderLeft: `10pt solid ${colors.brandDark}`,
    borderRadius: 10,
  },
  totalAccent: {
    backgroundColor: colors.brandDark,
  },
  totalMain: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingLeft: 12,
    overflow: "hidden",
  },
  totalLabel: {
    fontSize: 9,
    fontFamily: "Montserrat",
    fontWeight: 700,
    color: colors.brandDark,
    textTransform: "uppercase",
    letterSpacing: 0.1,
    // marginBottom: 2,
  },
  totalValue: { fontSize: 26, fontFamily: "Playfair Display", fontWeight: 600, color: colors.text },
  totalDots: { position: "absolute", right: -10, top: 0 },
  footer: { marginTop: 32, fontSize: 9, color: colors.footerText },
  footerRow: { flexDirection: "row", alignItems: "flex-start", gap: 5, marginTop: 12 },
  footerIcon: { backgroundColor: colors.brandLightTint, padding: 6, marginTop: 1, borderRadius: 15 },
  footerText: { flex: 1 },
});

function serviceDetail(tables: PricingTables, service: PricedService, femaleGuests: number): string {
  if (service.type === ServiceType.PHONE_POUCHES || service.type === ServiceType.MONITORING) {
    return `${femaleGuests} guests`;
  }
  return tierLabel(tables, service.type, service.tier);
}

export type QuotePdfProps = {
  name: string;
  quoteId: string;
  createdAt: Date;
  events: { city: string; date: Date; femaleGuests: number; priced: PricedEvent }[];
  total: number;
  tables: PricingTables;
};

export function QuotePdf({ name, quoteId, createdAt, events, total, tables }: QuotePdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View
          style={styles.pageMark}
          fixed
          render={({ pageNumber }) =>
            pageNumber === 1 ? null : (
              <>
                {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf's Image, not an HTML img */}
                <Image src={LOGO_SRC} style={styles.pageMarkLogo} />
                <Text style={styles.pageMarkText}>
                  <Text style={styles.brandNameAccent}>WII</Text> Security
                </Text>
              </>
            )
          }
        />

        <View style={styles.header}>
          <View style={styles.brandGroup}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf's Image, not an HTML img */}
            <Image src={LOGO_SRC} style={styles.logo} />
            <View style={styles.brandBlock}>
              <Text style={styles.brandName}>
                <Text style={styles.brandNameAccent}>WII</Text> Security
              </Text>
              <Text style={styles.tagline}>Secure Moments, Lasting Memories</Text>
            </View>
          </View>

          <View style={styles.metaCard}>
            <View style={styles.metaRow}>
              <DocumentIcon />
              <View>
                <Text style={styles.metaLabel}>Quote #</Text>
                <Text style={styles.metaValue}>{quoteId}</Text>
              </View>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaRow}>
              <CalendarIcon />
              <View>
                <Text style={styles.metaLabel}>Date</Text>
                <Text style={styles.metaValue}>{formatDateLong(createdAt)}</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.title}>Your Quote</Text>
        <View style={styles.titleRule} />
        <Text style={styles.intro}>
          Thank you, <Text style={styles.introName}>{name}</Text>, for considering WII Security. We are excited to
          be a part of your special day.
        </Text>

        <View style={styles.section}>
          {events.map((event, i) => (
            <View key={i} style={styles.eventBlock} wrap={false}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventLabel}>Event {i + 1}</Text>
                <Text style={styles.eventSummary}>
                  {event.city} • {formatDateLong(event.date)} • {event.femaleGuests} female guests
                </Text>
              </View>
              <View style={styles.eventDivider} />

              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHeaderCell, styles.colService]}>Service</Text>
                <Text style={[styles.tableHeaderCell, styles.colDetail]}>Detail</Text>
                <Text style={[styles.tableHeaderCell, styles.colPrice, { textAlign: "right" }]}>Price (PKR)</Text>
              </View>

              {event.priced.services.map((service, j) => (
                <View key={j} style={styles.serviceRow}>
                  <Text style={[styles.serviceText, styles.colService]}>{serviceLabel(service.type)}</Text>
                  <Text style={[styles.detailText, styles.colDetail]}>
                    {serviceDetail(tables, service, event.femaleGuests)}
                  </Text>
                  <Text style={[styles.priceText, styles.colPrice]}>{formatAmount(service.price)}</Text>
                </View>
              ))}

              <View style={styles.subtotalDivider} />
              <View style={styles.subtotalRow}>
                <Text style={styles.subtotalLabel}>Event subtotal</Text>
                <Text style={styles.subtotalLabel}>{formatAmount(event.priced.subtotal)}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.totalCard}>
          <View style={styles.totalAccent} />
          <View style={styles.totalMain}>
            <View>
              <Text style={styles.totalLabel}>Total Estimated Charges</Text>
              <Text style={styles.totalValue}>{formatPkr(total)}</Text>
            </View>
            <View style={styles.totalDots}>
              <DotPattern />
            </View>
          </View>
        </View>

        <View style={styles.footerRow}>
          <View style={styles.footerIcon}>
            <InfoIcon color={colors.brandDark} size={10} />
          </View>
          <Text style={[styles.footer, styles.footerText, { marginTop: 0 }]}>
            This is an estimated quote based on the details you submitted. It does not reserve your event date — another event may already be
            booked for it. Availability and final charges are confirmed when you proceed with
            booking. Prices are in Pakistani Rupees (PKR).
          </Text>
        </View>

        <View style={styles.contactFooter} fixed>
          <View style={styles.contactItem}>
            <PhoneIcon color={colors.white} size={10} />
            <Text style={styles.contactText}>+92 300 000 0000</Text>
          </View>
          <View style={styles.contactItem}>
            <MailIcon color={colors.white} size={10} />
            <Text style={styles.contactText}>info@wiisecurity.com</Text>
          </View>
          <View style={styles.contactItem}>
            <GlobeIcon color={colors.white} size={10} />
            <Text style={styles.contactText}>www.wiisecurity.com</Text>
          </View>
          <View style={styles.contactItem}>
            <PinIcon color={colors.white} size={10} />
            <Text style={styles.contactText}>Karachi, Pakistan</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
