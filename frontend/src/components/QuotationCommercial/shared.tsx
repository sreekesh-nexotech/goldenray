/**
 * The frame every commercial page sits in (masthead, content, footer) and the
 * text styling they share, on the same 1440×2038 canvas as the residential
 * documents.
 */
import type { CSSProperties, ReactNode } from "react";
import { Globe, Mail, MapPin, Phone } from "lucide-react";

export const FONT =
  'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export const INK = "rgb(18,53,50)";
export const ORANGE = "rgb(248,138,34)";
export const GREY = "rgb(68,68,68)";
export const GREEN = "rgb(0,129,48)";
export const RULE = "1px solid rgb(229,231,235)";
export const CREAM = "rgb(247,244,230)";
/** Left and right page margin, in canvas pixels. */
export const PAGE_MARGIN = 80;

export const text = (
  fontSize: number,
  fontWeight: number,
  color: string = INK,
  extra?: CSSProperties,
): CSSProperties => ({ fontFamily: FONT, fontSize, fontWeight, color, ...extra });

export const LOGO_CLASS = "fig-asset-db0497502244a62d-3df8ef3e";

function Masthead() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 11, padding: "40px 80px", flexShrink: 0 }}>
      <div className={LOGO_CLASS} style={{ width: 147, height: 31, flexShrink: 0 }} />
      <span style={text(18, 300, INK, { lineHeight: 1.4 })}>by Golden Ray</span>
    </div>
  );
}

function FooterItem({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
      {icon}
      <span style={text(18, 500, INK, { lineHeight: "24px" })}>{children}</span>
    </div>
  );
}

function Footer() {
  const icon = { size: 22, strokeWidth: 1.8, color: INK };
  return (
    <div
      style={{
        height: 98,
        flexShrink: 0,
        backgroundColor: CREAM,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 120px 0 85px",
        boxSizing: "border-box",
      }}
    >
      <div className={LOGO_CLASS} style={{ width: 155, height: 33, flexShrink: 0 }} />
      <FooterItem icon={<MapPin {...icon} />}>
        Thannikakal, Thumpoly PO,
        <br />
        Alappuzha– 688008
      </FooterItem>
      <FooterItem icon={<Globe {...icon} />}>www.flarize.com</FooterItem>
      <FooterItem icon={<Mail {...icon} />}>sales@flarize.com</FooterItem>
      <FooterItem icon={<Phone {...icon} />}>+91 9995 073 579</FooterItem>
    </div>
  );
}

export function CommercialPage({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        position: "relative",
        width: 1440,
        height: 2038,
        overflow: "hidden",
        backgroundColor: "rgb(255,255,255)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Masthead />
      <div style={{ flexGrow: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>{children}</div>
      <Footer />
    </div>
  );
}

/** Centred page heading. */
export function PageTitle({ children, size = 42 }: { children: ReactNode; size?: number }) {
  return (
    <div style={text(size, 700, INK, { textAlign: "center", lineHeight: 1.25, padding: "0 80px", flexShrink: 0 })}>
      {children}
    </div>
  );
}
