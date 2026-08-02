import path from "path";
import fs from "fs";
import { Document, Page, Text, View, Image, Font, Svg, Path, Rect, Circle, StyleSheet } from "@react-pdf/renderer";
import { serviceLabel, tierLabel, type PricedEvent, type PricedService, type PricingTables } from "../pricing";

// Icon paths sourced from lucide-static (ISC license)
function iconProps(color: string) {
  return {
    stroke: color,
    strokeWidth: 2,
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}

function CalendarIcon({ color = "#f3a8c1", size = 11 }: { color?: string; size?: number }) {
  const p = iconProps(color);
  return (
    <Svg viewBox="0 0 24 24" style={{ width: size, height: size }}>
      <Path d="M8 2v3" {...p} />
      <Path d="M16 2v3" {...p} />
      <Rect x={3} y={3} width={18} height={18} rx={2} {...p} />
      <Path d="M3 9h18" {...p} />
    </Svg>
  );
}

function DocumentIcon({ color = "#f3a8c1", size = 11 }: { color?: string; size?: number }) {
  const p = iconProps(color);
  return (
    <Svg viewBox="0 0 24 24" style={{ width: size, height: size }}>
      <Path
        d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"
        {...p}
      />
      <Path d="M14 2v5a1 1 0 0 0 1 1h5" {...p} />
      <Path d="M10 9H8" {...p} />
      <Path d="M16 13H8" {...p} />
      <Path d="M16 17H8" {...p} />
    </Svg>
  );
}

function PhoneIcon({ color = "#999", size = 11 }: { color?: string; size?: number }) {
  const p = iconProps(color);
  return (
    <Svg viewBox="0 0 24 24" style={{ width: size, height: size }}>
      <Path
        d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"
        {...p}
      />
    </Svg>
  );
}

function MailIcon({ color = "#999", size = 11 }: { color?: string; size?: number }) {
  const p = iconProps(color);
  return (
    <Svg viewBox="0 0 24 24" style={{ width: size, height: size }}>
      <Path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" {...p} />
      <Rect x={2} y={4} width={20} height={16} rx={2} {...p} />
    </Svg>
  );
}

function GlobeIcon({ color = "#999", size = 11 }: { color?: string; size?: number }) {
  const p = iconProps(color);
  return (
    <Svg viewBox="0 0 24 24" style={{ width: size, height: size }}>
      <Circle cx={12} cy={12} r={10} {...p} />
      <Path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" {...p} />
      <Path d="M2 12h20" {...p} />
    </Svg>
  );
}

function PinIcon({ color = "#999", size = 11 }: { color?: string; size?: number }) {
  const p = iconProps(color);
  return (
    <Svg viewBox="0 0 24 24" style={{ width: size, height: size }}>
      <Path
        d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
        {...p}
      />
      <Circle cx={12} cy={10} r={3} {...p} />
    </Svg>
  );
}

function InfoIcon({ color = "#999", size = 11 }: { color?: string; size?: number }) {
  const p = iconProps(color);
  return (
    <Svg viewBox="0 0 24 24" style={{ width: size, height: size }}>
      <Circle cx={12} cy={12} r={10} {...p} />
      <Path d="M12 16v-4" {...p} />
      <Path d="M12 8h.01" {...p} />
    </Svg>
  );
}

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
        <Circle key={`${r}-${c}`} cx={c * spacing} cy={r * spacing} r={1.1} fill="#b8496a" opacity={opacity} />
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

const FONTS_DIR = path.join(process.cwd(), "app", "lib", "pdf", "fonts");

Font.register({
  family: "Poppins",
  fonts: [
    { src: path.join(FONTS_DIR, "Poppins-Light.ttf"), fontWeight: 300 },
    { src: path.join(FONTS_DIR, "Poppins-Regular.ttf"), fontWeight: 400 },
    { src: path.join(FONTS_DIR, "Poppins-Medium.ttf"), fontWeight: 500 },
    { src: path.join(FONTS_DIR, "Poppins-SemiBold.ttf"), fontWeight: 600 },
    { src: path.join(FONTS_DIR, "Poppins-Bold.ttf"), fontWeight: 700 },
    { src: path.join(FONTS_DIR, "Poppins-ExtraBold.ttf"), fontWeight: 800 },
  ],
});

Font.register({
  family: "Playfair Display",
  fonts: [
    { src: path.join(FONTS_DIR, "PlayfairDisplay-Regular.ttf"), fontWeight: 400 },
    { src: path.join(FONTS_DIR, "PlayfairDisplay-Medium.ttf"), fontWeight: 500 },
    { src: path.join(FONTS_DIR, "PlayfairDisplay-SemiBold.ttf"), fontWeight: 600 },
    { src: path.join(FONTS_DIR, "PlayfairDisplay-Bold.ttf"), fontWeight: 700 },
    { src: path.join(FONTS_DIR, "PlayfairDisplay-Black.ttf"), fontWeight: 900 },
  ],
});

Font.register({
  family: "Montserrat",
  fonts: [
    { src: path.join(FONTS_DIR, "Montserrat-Regular.ttf"), fontWeight: 400 },
    { src: path.join(FONTS_DIR, "Montserrat-Medium.ttf"), fontWeight: 500 },
    { src: path.join(FONTS_DIR, "Montserrat-SemiBold.ttf"), fontWeight: 600 },
    { src: path.join(FONTS_DIR, "Montserrat-Bold.ttf"), fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 50,
    fontSize: 11,
    fontFamily: "Montserrat",
    color: "#1a1a1a",
  },
  contactFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#b8496a",
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contactItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  contactText: { fontSize: 8, color: "#ffffff", fontFamily: "Montserrat", fontWeight: 500 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  brandGroup: { flexDirection: "row", alignItems: "center", gap: 12 },
  logo: { width: 39, height: 52 },
  brandBlock: { justifyContent: "center" },
  metaCard: {
    border: "0.75pt solid #e0688f",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minWidth: 130,
  },
  metaDivider: { borderTop: "0.75pt solid #e0688f", marginVertical: 6 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  metaLabel: {
    fontSize: 7,
    fontFamily: "Montserrat",
    fontWeight: 700,
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  metaValue: { fontSize: 9, fontFamily: "Montserrat", fontWeight: 700, color: "#1a1a1a", marginTop: 2 },
  brandName: {
    fontSize: 20,
    fontFamily: "Poppins",
    fontWeight: 600,
    letterSpacing: 1.25,
    textTransform: "uppercase",
    lineHeight: 1,
  },
  brandNameAccent: { color: "#b8496a" },
  tagline: {
    fontSize: 6,
    fontFamily: "Poppins",
    fontWeight: 500,
    color: "#999",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 6,
  },
  title: { fontSize: 26, marginBottom: 8, fontFamily: "Playfair Display", fontWeight: 600 },
  titleRule: { width: 48, height: 1, backgroundColor: "#b8496a", marginBottom: 12 },
  intro: { fontSize: 10, color: "#555", marginBottom: 20, lineHeight: 1.4 },
  introName: { fontFamily: "Montserrat", fontWeight: 700, color: "#1a1a1a" },
  section: { marginBottom: 0 },
  sectionHeading: { fontSize: 13, fontFamily: "Montserrat", fontWeight: 700, marginBottom: 8 },
  eventBlock: {
    marginBottom: 14,
    border: "0.75pt solid #b8496a",
    borderRadius: 6,
  },
  eventHeader: { backgroundColor: "rgb(247 217 226, 0.5)", paddingTop: 12, paddingHorizontal: 12 },
  eventLabel: {
    fontSize: 8,
    fontFamily: "Montserrat",
    fontWeight: 700,
    color: "#b8496a",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  eventSummary: { fontSize: 13, fontFamily: "Montserrat", fontWeight: 700, marginBottom: 10 },
  eventDivider: { borderTop: "0.5pt solid #b8496a", marginBottom: 10 },
  subtotalRow: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "rgb(247 217 226, 0.5)", paddingHorizontal: 12, paddingVertical: 6 },
  subtotalDivider: { borderTop: "0.5pt solid #b8496a", marginTop: 6 },
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
    color: "#999",
    textTransform: "uppercase",
  },
  serviceRow: { flexDirection: "row", marginBottom: 5, paddingHorizontal: 12 },
  colService: { flex: 0.32 },
  colDetail: { flex: 0.48 },
  colPrice: { flex: 0.2, textAlign: "right" },
  serviceText: { fontSize: 10, fontWeight: 600 },
  detailText: { fontSize: 10, color: "#555" },
  priceText: { fontSize: 10 },
  totalCard: {
    flexDirection: "row",
    border: "0.5pt solid #b8496a",
    borderLeft: "10pt solid #b8496a",
    borderRadius: 10,
  },
  totalAccent: {
    backgroundColor: "#b8496a",
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
    color: "#b8496a",
    textTransform: "uppercase",
    letterSpacing: 0.1,
    // marginBottom: 2,
  },
  totalValue: { fontSize: 26, fontFamily: "Playfair Display", fontWeight: 600, color: "#1a1a1a" },
  totalDots: { position: "absolute", right: -10, top: 0 },
  footer: { marginTop: 32, fontSize: 9, color: "#888" },
  footerRow: { flexDirection: "row", gap: 5, marginTop: 12 },
  footerIcon: { backgroundColor: "rgb(247 217 226, 0.5)", padding: 6, marginTop: 1, borderRadius: 15 },
  footerText: { flex: 1 },
});

function formatPkr(amount: number) {
  return `${amount.toLocaleString("en-PK")}`;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function serviceDetail(tables: PricingTables, service: PricedService, femaleGuests: number): string {
  if (service.type === "PHONE_POUCHES" || service.type === "MONITORING") {
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
                <Text style={styles.metaValue}>{formatDate(createdAt)}</Text>
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
                  {event.city} • {formatDate(event.date)} • {event.femaleGuests} female guests
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
                  <Text style={[styles.priceText, styles.colPrice]}>{formatPkr(service.price)}</Text>
                </View>
              ))}

              <View style={styles.subtotalDivider} />
              <View style={styles.subtotalRow}>
                <Text style={styles.subtotalLabel}>Event subtotal</Text>
                <Text style={styles.subtotalLabel}>{formatPkr(event.priced.subtotal)}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.totalCard}>
          <View style={styles.totalAccent} />
          <View style={styles.totalMain}>
            <View>
              <Text style={styles.totalLabel}>Total Estimated Charges</Text>
              <Text style={styles.totalValue}>PKR {formatPkr(total)}</Text>
            </View>
            <View style={styles.totalDots}>
              <DotPattern />
            </View>
          </View>
        </View>

        <View style={styles.footerRow}>
          <View style={styles.footerIcon}>
            <InfoIcon color="#b8496a" size={10} />
          </View>
          <Text style={[styles.footer, styles.footerText, { marginTop: 0 }]}>
            This is an estimated quote based on the details you submitted. Final charges are confirmed
            when you proceed with booking. Prices are in Pakistani Rupees (PKR).
          </Text>
        </View>

        <View style={styles.contactFooter} fixed>
          <View style={styles.contactItem}>
            <PhoneIcon color="#ffffff" size={10} />
            <Text style={styles.contactText}>+92 300 000 0000</Text>
          </View>
          <View style={styles.contactItem}>
            <MailIcon color="#ffffff" size={10} />
            <Text style={styles.contactText}>info@wiisecurity.com</Text>
          </View>
          <View style={styles.contactItem}>
            <GlobeIcon color="#ffffff" size={10} />
            <Text style={styles.contactText}>www.wiisecurity.com</Text>
          </View>
          <View style={styles.contactItem}>
            <PinIcon color="#ffffff" size={10} />
            <Text style={styles.contactText}>Karachi, Pakistan</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
