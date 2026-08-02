import { Svg, Path, Rect, Circle } from "@react-pdf/renderer";
import { colors } from "./colors";

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

export function CalendarIcon({ color = colors.brandTint, size = 11 }: { color?: string; size?: number }) {
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

export function DocumentIcon({ color = colors.brandTint, size = 11 }: { color?: string; size?: number }) {
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

export function PhoneIcon({ color = colors.textSubtle, size = 11 }: { color?: string; size?: number }) {
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

export function MailIcon({ color = colors.textSubtle, size = 11 }: { color?: string; size?: number }) {
  const p = iconProps(color);
  return (
    <Svg viewBox="0 0 24 24" style={{ width: size, height: size }}>
      <Path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" {...p} />
      <Rect x={2} y={4} width={20} height={16} rx={2} {...p} />
    </Svg>
  );
}

export function GlobeIcon({ color = colors.textSubtle, size = 11 }: { color?: string; size?: number }) {
  const p = iconProps(color);
  return (
    <Svg viewBox="0 0 24 24" style={{ width: size, height: size }}>
      <Circle cx={12} cy={12} r={10} {...p} />
      <Path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" {...p} />
      <Path d="M2 12h20" {...p} />
    </Svg>
  );
}

export function PinIcon({ color = colors.textSubtle, size = 11 }: { color?: string; size?: number }) {
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

export function InfoIcon({ color = colors.textSubtle, size = 11 }: { color?: string; size?: number }) {
  const p = iconProps(color);
  return (
    <Svg viewBox="0 0 24 24" style={{ width: size, height: size }}>
      <Circle cx={12} cy={12} r={10} {...p} />
      <Path d="M12 16v-4" {...p} />
      <Path d="M12 8h.01" {...p} />
    </Svg>
  );
}
