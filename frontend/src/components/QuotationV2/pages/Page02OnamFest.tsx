/* eslint-disable @next/next/no-img-element -- fixed-pixel print artwork; plain
   <img> keeps browser print / DOM-capture output faithful to the design. */
// Page 2 of the Flarize quotation document (English) — Onam Solar Fest 2026 campaign offer.
// Authored on a 794×1123 canvas and scaled ×1.8136 to the 1440×2038 document frame,
// exactly as in the approved design prototype.
import type { CSSProperties } from "react";

interface Page02OnamFestProps {
  className?: string;
  style?: CSSProperties;
  /** Onam flower garlands in the page corners; on in the approved design. */
  showFlowers?: boolean;
}

const ASSETS = "https://golden-ray.b-cdn.net/quotation-v2/onam";

function StarGlyph({ size = 9 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="#F88A22">
      <path d="M5 0l1.2 3.8L10 5 6.2 6.2 5 10 3.8 6.2 0 5l3.8-1.2z" />
    </svg>
  );
}

export default function Page02OnamFest({
  className,
  style,
  showFlowers = true,
}: Page02OnamFestProps) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: 1440,
        height: 2038,
        overflow: "hidden",
        backgroundColor: "rgb(255,255,255)",
        ...style,
      }}
    >
      <div
        style={{
          width: 794,
          height: 1123,
          transform: "scale(1.8136)",
          transformOrigin: "top left",
          position: "relative",
          background: "#ffffff",
          fontFamily:
            'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          color: "#123532",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {showFlowers && (
          <div>
            <img
              src={`${ASSETS}/flowers_v3.jpg`}
              alt="Onam floral decoration"
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 200,
                height: "auto",
                mixBlendMode: "multiply",
                pointerEvents: "none",
                zIndex: 2,
              }}
            />
            <img
              src={`${ASSETS}/flowers_v3.jpg`}
              alt="Onam floral decoration"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 150,
                height: "auto",
                transform: "scaleX(-1)",
                mixBlendMode: "multiply",
                pointerEvents: "none",
                opacity: 0.85,
                zIndex: 2,
              }}
            />
            <img
              src={`${ASSETS}/flowers_v3.jpg`}
              alt="Onam floral decoration"
              style={{
                position: "absolute",
                bottom: 70,
                left: -10,
                width: 140,
                height: "auto",
                transform: "rotate(180deg)",
                mixBlendMode: "multiply",
                pointerEvents: "none",
                opacity: 0.9,
                zIndex: 3,
              }}
            />
            <img
              src={`${ASSETS}/flowers_v3.jpg`}
              alt="Onam floral decoration"
              style={{
                position: "absolute",
                bottom: 66,
                right: -6,
                width: 130,
                height: "auto",
                transform: "rotate(180deg) scaleX(-1)",
                mixBlendMode: "multiply",
                pointerEvents: "none",
                opacity: 0.9,
                zIndex: 3,
              }}
            />
          </div>
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(120% 60% at 50% 0%,#FFF9F3 0%,#ffffff 55%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        {/* Header: logo + page tag */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            padding: "22px 40px 0 40px",
            position: "relative",
            zIndex: 4,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Same logo sprite crop the design-system pages use — the
                handoff's flarize-logo.svg lost its embedded raster. */}
            <div
              className="fig-asset-db0497502244a62d-3df8ef3e"
              role="img"
              aria-label="Flarize"
              style={{ width: 124, height: 26 }}
            />
            <span
              style={{
                fontSize: 8,
                fontWeight: 600,
                color: "#9CA3AF",
                letterSpacing: 1.5,
                paddingLeft: 30,
              }}
            >
              POWERED BY GOLDEN RAY
            </span>
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1.5,
              color: "#D1D5DB",
              marginTop: 6,
            }}
          >
            PAGE 02 · FESTIVAL OFFER
          </span>
        </div>
        {/* Title block + Mahabali */}
        <div
          style={{
            position: "relative",
            padding: "12px 40px 0 40px",
            zIndex: 4,
          }}
        >
          <div style={{ width: "62%" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#123532",
                color: "#ffffff",
                padding: "7px 16px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1,
                whiteSpace: "nowrap",
              }}
            >
              <StarGlyph />
              <span>
                ONAM SOLAR FEST <span style={{ color: "#F7BA41" }}>2026</span>
              </span>
              <StarGlyph />
            </div>
            <h1
              lang="ml"
              style={{
                fontFamily:
                  "'Noto Sans Malayalam Condensed','Poppins',sans-serif",
                fontSize: 38,
                fontWeight: 700,
                color: "#008130",
                lineHeight: 1.35,
                margin: "8px 0 0 0",
              }}
            >
              ഓണം സോളാർ ഫെസ്റ്റ്
            </h1>
            <p
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: "#123532",
                margin: "4px 0 0 0",
              }}
            >
              Celebrate <span style={{ color: "#008130" }}>Onam</span> with{" "}
              <span style={{ color: "#F88A22" }}>Flarize!</span>
            </p>
          </div>
          <img
            src={`${ASSETS}/mahabali_v2.jpg`}
            alt="King Mahabali illustration"
            style={{
              position: "absolute",
              top: -4,
              right: 30,
              width: 180,
              height: "auto",
              mixBlendMode: "multiply",
              zIndex: 3,
            }}
          />
        </div>
        {/* Benefits banner */}
        <div
          style={{
            margin: "12px 40px 0 40px",
            position: "relative",
            zIndex: 4,
            background: "linear-gradient(135deg,#123532 0%,#0B2A27 100%)",
            borderRadius: 16,
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 8px 22px rgba(18,53,50,0.22)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -40,
              top: -40,
              width: 160,
              height: 160,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(248,138,34,0.35) 0%,rgba(248,138,34,0) 70%)",
            }}
          />
          <div style={{ position: "relative" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 2,
                color: "rgba(247,244,230,0.75)",
              }}
            >
              FESTIVAL OFFERS WORTH UP TO
            </div>
            <div
              style={{
                fontSize: 46,
                fontWeight: 900,
                color: "#ffffff",
                lineHeight: 1.1,
                marginTop: 3,
                letterSpacing: -0.5,
              }}
            >
              ₹40,000<span style={{ color: "#F88A22" }}>+</span>{" "}
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: 1,
                  color: "#F7BA41",
                }}
              >
                IN BENEFITS*
              </span>
            </div>
          </div>
          <div
            style={{
              position: "relative",
              background: "#F88A22",
              color: "#123532",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.5,
              padding: "9px 16px",
              borderRadius: 10,
              textAlign: "center",
              lineHeight: 1.3,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            LIMITED TIME
            <br />
            FESTIVAL OFFER
          </div>
        </div>
        {/* Mega lucky draw card */}
        <div style={{ margin: "14px 40px 0 40px", position: "relative", zIndex: 4 }}>
          <div
            style={{
              position: "absolute",
              inset: -6,
              borderRadius: 22,
              background:
                "radial-gradient(60% 90% at 22% 50%,rgba(248,138,34,0.28) 0%,rgba(248,138,34,0) 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: "246px 1fr",
              gap: 20,
              alignItems: "center",
              background: "linear-gradient(135deg,#F7F4E6 0%,#FEF3E8 100%)",
              border: "1.5px solid rgba(204,167,48,0.45)",
              borderRadius: 18,
              padding: "16px 20px 16px 16px",
              boxShadow: "0 10px 26px rgba(199,154,46,0.18)",
            }}
          >
            <div
              style={{
                position: "relative",
                height: 170,
                borderRadius: 14,
                overflow: "hidden",
                boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                background: "#ffffff",
              }}
            >
              <img
                src={`${ASSETS}/img-scooter.jpg`}
                alt="Electric scooter grand prize"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  background: "#F88A22",
                  color: "#123532",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 1,
                  padding: "5px 12px",
                  borderRadius: 20,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
                  zIndex: 5,
                  pointerEvents: "none",
                }}
              >
                ★ GRAND PRIZE
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  color: "#8D4F00",
                }}
              >
                MEGA LUCKY DRAW
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#123532",
                  lineHeight: 1.1,
                  marginTop: 4,
                }}
              >
                Win an Electric Scooter
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "#4B5563",
                  lineHeight: 1.5,
                  margin: "8px 0 0 0",
                  textWrap: "pretty",
                }}
              >
                Every eligible solar booking during the campaign enters you into
                our grand festival draw for a brand-new{" "}
                <b style={{ color: "#123532" }}>premium electric scooter</b>. Go
                solar, ride electric — celebrate Onam the sustainable way.
              </p>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  marginTop: 12,
                  background: "#123532",
                  color: "#ffffff",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "8px 14px",
                  borderRadius: 10,
                }}
              >
                <svg
                  width={15}
                  height={15}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#F88A22"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx={6} cy={17} r={3} />
                  <circle cx={18} cy={17} r={3} />
                  <path d="M9 17h6M6 14l3-6h4l3 4h2" />
                </svg>
                <span>1 lucky winner every campaign</span>
              </div>
            </div>
          </div>
        </div>
        {/* More festival benefits */}
        <div style={{ margin: "14px 40px 0 40px", position: "relative", zIndex: 4 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                flex: 1,
                height: 1,
                background:
                  "linear-gradient(90deg,transparent,rgba(204,167,48,0.5))",
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2,
                color: "#123532",
                whiteSpace: "nowrap",
              }}
            >
              MORE FESTIVAL BENEFITS
            </span>
            <span
              style={{
                flex: 1,
                height: 1,
                background:
                  "linear-gradient(90deg,rgba(204,167,48,0.5),transparent)",
              }}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 14,
            }}
          >
            {(
              [
                {
                  img: "img-ac.jpg",
                  alt: "Split AC and gift voucher",
                  title: "Free AC Voucher",
                  text: "A modern split air-conditioner voucher on selected solar installations.",
                },
                {
                  img: "img-hybrid.jpg",
                  alt: "Hybrid inverter and battery",
                  title: "Free Hybrid Upgrade",
                  text: "Upgrade to a hybrid inverter & battery system on eligible configurations.",
                },
                {
                  img: "img-gifts.jpg",
                  alt: "Festive gift hampers",
                  title: "Exclusive Onam Gifts",
                  text: "Premium wrapped hampers & surprise festive gifts for every customer.",
                },
              ] as const
            ).map((card) => (
              <div
                key={card.title}
                style={{
                  background: "#ffffff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 14,
                  overflow: "hidden",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                }}
              >
                <img
                  src={`${ASSETS}/${card.img}`}
                  alt={card.alt}
                  style={{
                    width: "100%",
                    height: 96,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <div style={{ padding: "11px 13px 13px" }}>
                  <div
                    style={{ fontSize: 12.5, fontWeight: 700, color: "#123532" }}
                  >
                    {card.title}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#4B5563",
                      marginTop: 4,
                      lineHeight: 1.4,
                    }}
                  >
                    {card.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Why book during Onam + campaign period */}
        <div
          style={{
            margin: "14px 40px 0 40px",
            position: "relative",
            zIndex: 4,
            display: "grid",
            gridTemplateColumns: "1.55fr 1fr",
            gap: 14,
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              background: "#F3F4F6",
              borderRadius: 14,
              padding: "13px 18px",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1,
                color: "#123532",
              }}
            >
              WHY BOOK DURING ONAM?
            </div>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "11px 16px",
              }}
            >
              <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                <svg
                  width={22}
                  height={22}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0 }}
                >
                  <path d="M3 11c0-2 2-4 5-4h3c3 0 5 2 5 4v3c0 1-1 2-2 2v2h-2v-2H7v2H5v-2c-1 0-2-1-2-2z" />
                  <circle cx={14} cy={11} r={1} />
                </svg>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#123532",
                      lineHeight: 1.15,
                    }}
                  >
                    Better Savings
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: "#4B5563",
                      marginTop: 2,
                      lineHeight: 1.3,
                    }}
                  >
                    Offers worth up to ₹40,000+
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                <svg
                  width={22}
                  height={22}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0 }}
                >
                  <rect x={4} y={9} width={16} height={11} rx={1} />
                  <path d="M4 13h16M12 9v11" />
                  <path d="M12 9S9 4 6.5 6 12 9 12 9zM12 9s3-5 5.5-3S12 9 12 9z" />
                </svg>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#123532",
                      lineHeight: 1.15,
                    }}
                  >
                    Exclusive Gifts
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: "#4B5563",
                      marginTop: 2,
                      lineHeight: 1.3,
                    }}
                  >
                    Exciting gifts &amp; vouchers
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                <svg
                  width={22}
                  height={22}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0 }}
                >
                  <rect x={3.5} y={4.5} width={17} height={16} rx={2} />
                  <path d="M3.5 9h17M8 3v3M16 3v3" />
                  <path d="M8.5 14l2.2 2.2 4.3-4.4" />
                </svg>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#123532",
                      lineHeight: 1.15,
                    }}
                  >
                    Faster Installation
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: "#4B5563",
                      marginTop: 2,
                      lineHeight: 1.3,
                    }}
                  >
                    Priority festival scheduling
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                <svg
                  width={22}
                  height={22}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0 }}
                >
                  <circle cx={12} cy={13} r={8} />
                  <path d="M12 13V9M9 2h6" />
                </svg>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#123532",
                      lineHeight: 1.15,
                    }}
                  >
                    Limited Time Only
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: "#4B5563",
                      marginTop: 2,
                      lineHeight: 1.3,
                    }}
                  >
                    Valid for a short period
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #E5E7EB",
              borderLeft: "4px solid #F88A22",
              borderRadius: 14,
              padding: "13px 16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1.5,
                color: "#4B5563",
              }}
            >
              CAMPAIGN PERIOD
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                marginTop: 8,
              }}
            >
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#123532"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0 }}
              >
                <rect x={3.5} y={4.5} width={17} height={16} rx={2} />
                <path d="M3.5 9h17M8 3v3M16 3v3" />
              </svg>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#123532",
                  lineHeight: 1.1,
                }}
              >
                29 JULY – 12 AUGUST
              </div>
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#4B5563",
                marginTop: 8,
                lineHeight: 1.4,
              }}
            >
              Book before 12th August to avail these exclusive festival offers.
            </div>
          </div>
        </div>
        {/* Book today + QR */}
        <div
          style={{
            margin: "12px 40px 0 40px",
            position: "relative",
            zIndex: 4,
            display: "grid",
            gridTemplateColumns: "1fr 210px",
            gap: 14,
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg,#123532 0%,#0B2A27 100%)",
              color: "#ffffff",
              borderRadius: 14,
              padding: "15px 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 18,
                fontWeight: 700,
                lineHeight: 1.12,
              }}
            >
              <svg
                width={12}
                height={12}
                viewBox="0 0 10 10"
                fill="#F88A22"
                style={{ flexShrink: 0 }}
              >
                <path d="M5 0l1.2 3.8L10 5 6.2 6.2 5 10 3.8 6.2 0 5l3.8-1.2z" />
              </svg>
              <span>Book Your Solar System Today!</span>
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(247,244,230,0.85)",
                marginTop: 6,
                lineHeight: 1.45,
              }}
            >
              Celebrate Onam with clean energy for a brighter tomorrow — limited
              festival slots available.
            </div>
          </div>
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #E5E7EB",
              borderRadius: 14,
              padding: 11,
              display: "flex",
              alignItems: "center",
              gap: 11,
            }}
          >
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  letterSpacing: 1,
                  color: "#4B5563",
                  marginBottom: 4,
                }}
              >
                SCAN TO BOOK
              </div>
              <img
                src={`${ASSETS}/qr_v2.jpg`}
                alt="Booking QR code"
                style={{
                  width: 66,
                  height: 66,
                  display: "block",
                  borderRadius: 4,
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#123532",
                }}
              >
                <svg
                  width={13}
                  height={13}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth={1.8}
                >
                  <circle cx={12} cy={12} r={9} />
                  <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
                </svg>
                <span>www.flarize.com</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#123532",
                }}
              >
                <svg width={13} height={13} viewBox="0 0 24 24" fill="#16A34A">
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1l-2.3 2.3z" />
                </svg>
                <span>+91 9995 073 579</span>
              </div>
            </div>
          </div>
        </div>
        {/* Fine print footer */}
        <div
          style={{
            marginTop: "auto",
            background: "#F7F4E6",
            padding: "9px 40px",
            textAlign: "center",
            fontSize: 9,
            color: "#735C00",
            position: "relative",
            zIndex: 4,
            fontFamily:
              'var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          }}
        >
          *T&amp;C Apply. Offer valid during the campaign period. Benefits vary
          by system configuration and eligibility. Prize terms apply.
        </div>
      </div>
    </div>
  );
}
