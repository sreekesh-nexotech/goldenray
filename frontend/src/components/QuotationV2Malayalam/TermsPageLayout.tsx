import type { CSSProperties, ReactNode } from "react";
import FooterLocationPin from "./icons/FooterLocationPin";

/**
 * Shared frame for the two Terms and Conditions pages.
 *
 * The Figma export put all nineteen clauses inside a single `white-space:
 * pre-wrap` span, with the number, the colon and the body as sibling inline
 * spans. That runs each heading into its own body text. Here every clause is a
 * block with the heading on its own line and the body underneath, matching the
 * v1 terms layout.
 */

const POPPINS =
  'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export interface TermsClause {
  title: string;
  body: string;
}

const FOOTER_ITEMS = [
  "Thannikakal, Thumpoly PO, Alappuzha– 688008",
  "www.flarize.com",
  "sales@flarize.com",
  "+91 9995 073 579",
];

function Footer() {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: 36,
        padding: "0px 0px 40px 0px",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        flexShrink: 0,
        alignSelf: "stretch",
      }}
    >
      {FOOTER_ITEMS.map((item, i) => (
        <div
          key={item}
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 7,
            alignItems: "center",
            flexWrap: "nowrap",
            flexShrink: 0,
            color: "rgb(68,68,68)",
          }}
        >
          {i === 0 && <FooterLocationPin />}
          <span
            style={{
              fontFamily: POPPINS,
              fontWeight: 400,
              fontSize: 18,
              lineHeight: "140%",
              color: "rgb(68,68,68)",
              whiteSpace: "nowrap",
            }}
          >
            {item}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function TermsPageLayout({
  className,
  style,
  title,
  clauses,
}: {
  className?: string;
  style?: CSSProperties;
  /** Page heading; only the first Terms page carries one. */
  title?: ReactNode;
  clauses: TermsClause[];
}) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: 1440,
        height: 2038,
        overflow: "hidden",
        backgroundColor: "rgb(255,255,255)",
        display: "flex",
        flexDirection: "column",
        padding: "0px 80px 0px 80px",
        alignItems: "center",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {/* Masthead */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 11,
          padding: "40px 0px 40px 0px",
          alignItems: "flex-end",
          flexWrap: "nowrap",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "flex-start",
        }}
      >
        <div
          className="fig-asset-db0497502244a62d-3df8ef3e"
          style={{ position: "relative", width: 147, height: 31, flexShrink: 0 }}
        />
        <span
          style={{
            fontFamily: POPPINS,
            fontWeight: 300,
            fontSize: 18,
            lineHeight: 1.4,
            color: "rgb(18,53,50)",
          }}
        >
          {" "}
          by Golden Ray
        </span>
      </div>

      {/* Clauses */}
      <div
        style={{
          position: "relative",
          width: 1270,
          display: "flex",
          flexDirection: "column",
          gap: 18,
          alignItems: "flex-start",
          flexWrap: "nowrap",
          boxSizing: "border-box",
          flexGrow: 1,
        }}
      >
        {title && (
          <span
            style={{
              fontFamily: POPPINS,
              fontWeight: 700,
              fontSize: 42,
              lineHeight: "60px",
              letterSpacing: "-0.5px",
              color: "var(--2)",
              flexShrink: 0,
            }}
          >
            {title}
          </span>
        )}

        {clauses.map((clause) => (
          <div
            key={clause.title}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              alignItems: "flex-start",
              flexWrap: "nowrap",
              flexShrink: 0,
              alignSelf: "stretch",
            }}
          >
            <span
              style={{
                fontFamily: POPPINS,
                fontWeight: 600,
                fontSize: 24,
                lineHeight: "150%",
                color: "rgb(18,53,50)",
              }}
            >
              {clause.title} :
            </span>
            <span
              style={{
                fontFamily: POPPINS,
                fontWeight: 400,
                fontSize: 20,
                lineHeight: "150%",
                color: "rgb(18,53,50)",
                alignSelf: "stretch",
              }}
            >
              {clause.body}
            </span>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
