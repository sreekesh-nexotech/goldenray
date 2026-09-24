// Page 12 of the Flarize quotation document (Malayalam) — Your Investment Summary — final pricing + next steps
import { InvestmentSummaryCard, OfferBanner } from "@/components/QuotationV2/PricingBlocks";
import type { CSSProperties } from "react";
import type { QuotationV2Data } from "../quotationV2MalayalamData";
import NotoLightBulb from "../icons/NotoLightBulb";

interface Page12SummaryProps {
  className?: string;
  style?: CSSProperties;
  /** Derived quotation values for this customer. */
  data: QuotationV2Data;
}

export default function Page12Summary({
  className,
  style,
  data,
}: Page12SummaryProps) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: 1440,
        height: 2038,
        backgroundColor: "rgb(255,255,255)",
        display: "flex",
        flexDirection: "row",
        gap: 10,
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: "nowrap",
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 1440,
          display: "flex",
          flexDirection: "column",
          padding: "0px 80px 0px 80px",
          alignItems: "center",
          flexWrap: "nowrap",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 40,
            padding: "40px 0px 40px 0px",
            alignItems: "flex-end",
            flexWrap: "nowrap",
            boxSizing: "border-box",
            flexShrink: 0,
            alignSelf: "stretch",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "row",
              gap: 11,
              justifyContent: "center",
              alignItems: "flex-end",
              flexWrap: "nowrap",
              flexShrink: 0,
            }}
          >
            <div
              className="fig-asset-db0497502244a62d-3df8ef3e"
              style={{
                position: "relative",
                width: 147,
                height: 31,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                position: "relative",
                width: 327,
                fontFamily:
                  'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                fontWeight: 300,
                fontSize: 18,
                lineHeight: 1.399999976158142,
                color: "rgb(18,53,50)",
                flexShrink: 0,
              }}
            >
               by Golden Ray
            </span>
          </div>
        </div>
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "nowrap",
            flexGrow: 1,
          }}
        >
          <div
            style={{
              position: "relative",
              width: 1440,
              backgroundColor: "rgba(0,0,0,0)",
              display: "flex",
              flexDirection: "column",
              gap: 32,
              padding: "0px 64px 0px 64px",
              alignItems: "center",
              flexWrap: "nowrap",
              boxSizing: "border-box",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "relative",
                backgroundColor: "rgba(0,0,0,0)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                padding: "10px 0px 10px 0px",
                alignItems: "center",
                flexWrap: "nowrap",
                boxSizing: "border-box",
                flexShrink: 0,
                alignSelf: "stretch",
              }}
            >
              <span
                style={{
                  position: "relative",
                  fontFamily:
                    'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontWeight: 700,
                  fontSize: 42,
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  lineHeight: "60px",
                  letterSpacing: "-0.500px",
                  color: "var(--2)",
                  flexShrink: 0,
                }}
              >
                നിങ്ങളുടെ നിക്ഷേപത്തിന്റെ സംഗ്രഹം
              </span>
              <span
                style={{
                  position: "relative",
                  width: 1068,
                  fontFamily:
                    'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontWeight: 400,
                  fontSize: 20,
                  textAlign: "center",
                  lineHeight: "33px",
                  letterSpacing: "-0.500px",
                  color: "rgb(100,116,139)",
                  flexShrink: 0,
                }}
              >
                ഒറ്റ തീരുമാനം — വർഷങ്ങളോളം ലാഭം
              </span>
            </div>
            <InvestmentSummaryCard
              data={data}
              language="Malayalam"
              headline={`${data.sizeLabel} — ശുപാർശ ചെയ്യുന്ന പാക്കേജ്`}
            />
          </div>
          <div
            style={{
              position: "relative",
              width: 1440,
              backgroundColor: "rgb(255,255,255)",
              display: "flex",
              flexDirection: "column",
              gap: 32,
              padding: "24px 80px 24px 80px",
              justifyContent: "center",
              alignItems: "flex-start",
              flexWrap: "nowrap",
              boxSizing: "border-box",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "relative",
                borderRadius: 16,
                backgroundColor: "rgb(7,74,77)",
                display: "flex",
                flexDirection: "column",
                gap: 22,
                padding: "32px 0px 32px 0px",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "nowrap",
                boxSizing: "border-box",
                flexShrink: 0,
                alignSelf: "stretch",
              }}
            >
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  alignItems: "center",
                  flexWrap: "nowrap",
                  flexShrink: 0,
                  alignSelf: "stretch",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    height: 48,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    flexShrink: 0,
                    alignSelf: "stretch",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      borderRadius: 9999,
                      display: "flex",
                      flexDirection: "row",
                      gap: 8,
                      padding: "8px 0px 8px 0px",
                      alignItems: "center",
                      flexWrap: "nowrap",
                      boxSizing: "border-box",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: 32,
                        height: 32,
                        flexShrink: 0,
                      }}
                    >
                      <NotoLightBulb
                        style={{
                          transform: "scale(2, 2)",
                          transformOrigin: "0 0",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        position: "relative",
                        fontFamily:
                          'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        fontWeight: 700,
                        fontSize: 32,
                        whiteSpace: "nowrap",
                        lineHeight: "35.5px",
                        color: "rgb(255,255,255)",
                        flexShrink: 0,
                      }}
                    >
                      💡 പവർ കട്ട് സമയത്തും വൈദ്യുതി ഉറപ്പാക്കാം.{" "}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    padding: "0px 0px 0.590px 0px",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    boxSizing: "border-box",
                    flexShrink: 0,
                    alignSelf: "stretch",
                  }}
                >
                  <span
                    style={{
                      position: "relative",
                      width: 1131.926,
                      fontFamily:
                        'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                      fontWeight: 400,
                      fontSize: 24,
                      textAlign: "center",
                      lineHeight: "26.5px",
                      color: "rgb(194,194,194)",
                      flexShrink: 0,
                      whiteSpace: "pre-wrap",
                      display: "inline-block",
                    }}
                  >
                    ഹൈബ്രിഡ് സോളാർ സിസ്റ്റത്തെക്കുറിച്ച് കൂടുതൽ അറിയാം ഇപ്പോൾ
                    തന്നെ വിളിക്കൂ —{" "}
                    <span
                      style={{
                        fontWeight: 500,
                        color: "rgb(243,244,246)",
                      }}
                    >
                      കേരളത്തിലെ വീടുകൾ
                    </span>{" "}
                    കൂടുതൽ തിരഞ്ഞെടുക്കുന്ന പുതിയ പരിഹാരം.
                  </span>
                </div>
              </div>
            </div>
          </div>
          <OfferBanner offer={data.offer} language="Malayalam" />
          <div
            style={{
              position: "relative",
              width: 1039,
              height: 149,
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 122,
                width: 1039,
                height: 27,
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 1039,
                  height: 27,
                  fontFamily:
                    'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontWeight: 500,
                  fontSize: 24,
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  lineHeight: 1.1299999952316284,
                  letterSpacing: "0.080em",
                  color: "rgb(18,53,50)",
                  textTransform: "uppercase",
                }}
              >
                MNRE അംഗീകൃത സ്ഥാപനം | 300+ വീടുകളുടെ വിശ്വാസം | ഗൂഗിളിൽ 4.9★
                റേറ്റിംഗ്
              </span>
            </div>
            <div
              className="fig-asset-8b319f8907bd6fc0"
              style={{
                position: "absolute",
                left: 71,
                top: 10.75,
                width: 94,
                height: 92,
              }}
            />
            <div
              className="fig-asset-67f845a3da270fe1-f735f282"
              style={{
                position: "absolute",
                left: 414,
                top: 0,
                width: 150,
                height: 113,
              }}
            />
            <div
              className="fig-asset-2c1b68d43856ffd7"
              style={{
                position: "absolute",
                left: 811,
                top: 10.75,
                width: 92,
                height: 92,
              }}
            />
          </div>
          <div
            style={{
              position: "relative",
              width: 1440,
              borderRadius: 12,
              backgroundColor: "rgb(255,255,255)",
              boxShadow:
                "0px 4px 6px 0px rgba(0,0,0,0.1), 0px 10px 15px 0px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              padding: "26px 26px 26px 26px",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "nowrap",
              boxSizing: "border-box",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "relative",
                backgroundColor: "rgba(0,0,0,0)",
                display: "flex",
                flexDirection: "row",
                gap: 40,
                padding: "0px 73px 0px 73px",
                alignItems: "center",
                flexWrap: "nowrap",
                boxSizing: "border-box",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: "relative",
                  backgroundColor: "rgba(0,0,0,0)",
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                  flexWrap: "nowrap",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: 32,
                    height: 43,
                    backgroundColor: "rgba(0,0,0,0)",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0.5,
                      top: 3,
                      width: 32,
                      height: 32,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      flexWrap: "nowrap",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: 32,
                        overflow: "hidden",
                        backgroundColor: "rgba(0,0,0,0)",
                        flexShrink: 0,
                        alignSelf: "stretch",
                      }}
                    >
                      <svg
                        width={29.002}
                        height={28.004}
                        viewBox="0 0 29.002 28.004"
                        fill="none"
                        style={{
                          position: "absolute",
                          left: 1,
                          top: 1.998,
                          width: 29.002,
                          height: 28.004,
                          color: "var(--2)",
                        }}
                      >
                        <path
                          d="M 2.031 12.002 L 1.5 12.002 C 0.669 12.002 0 11.334 0 10.502 L 0 2.502 C 0 1.896 0.362 1.346 0.925 1.115 C 1.487 0.884 2.131 1.009 2.563 1.44 L 5.162 4.04 C 10.637 -1.366 19.456 -1.348 24.9 4.102 C 30.369 9.571 30.369 18.434 24.9 23.902 C 19.431 29.371 10.569 29.371 5.1 23.902 C 4.319 23.121 4.319 21.852 5.1 21.071 C 5.881 20.29 7.15 20.29 7.931 21.071 C 11.837 24.977 18.169 24.977 22.075 21.071 C 25.981 17.165 25.981 10.834 22.075 6.927 C 18.188 3.04 11.906 3.021 7.994 6.865 L 10.563 9.44 C 10.994 9.871 11.119 10.515 10.887 11.077 C 10.656 11.64 10.106 12.002 9.5 12.002 L 2.031 12.002 Z"
                          fill="currentColor"
                          fillRule="nonzero"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    position: "relative",
                    backgroundColor: "rgba(0,0,0,0)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    alignItems: "flex-start",
                    flexWrap: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      position: "relative",
                      fontFamily:
                        'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                      fontWeight: 700,
                      fontSize: 20,
                      whiteSpace: "nowrap",
                      lineHeight: "22px",
                      letterSpacing: "-0.500px",
                      color: "rgb(17,24,39)",
                      flexShrink: 0,
                    }}
                  >
                    100% Refundable
                  </span>
                  <span
                    style={{
                      position: "relative",
                      fontFamily:
                        'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                      fontWeight: 400,
                      fontSize: 14,
                      whiteSpace: "nowrap",
                      lineHeight: "19px",
                      letterSpacing: "-0.500px",
                      color: "rgb(75,85,99)",
                      flexShrink: 0,
                      alignSelf: "stretch",
                    }}
                  >
                    ₹5,000 booking fee
                  </span>
                </div>
              </div>
              <div
                style={{
                  position: "relative",
                  backgroundColor: "rgba(0,0,0,0)",
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                  flexWrap: "nowrap",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "relative",
                    backgroundColor: "rgba(0,0,0,0)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    padding: "3px 0px 3px 0px",
                    alignItems: "flex-start",
                    flexWrap: "nowrap",
                    boxSizing: "border-box",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      height: 32,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      flexWrap: "nowrap",
                      flexShrink: 0,
                      alignSelf: "stretch",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: 40,
                        overflow: "hidden",
                        backgroundColor: "rgba(0,0,0,0)",
                        flexShrink: 0,
                        alignSelf: "stretch",
                      }}
                    >
                      <svg
                        width={40}
                        height={23.998}
                        viewBox="0 0 40 23.998"
                        fill="none"
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 4,
                          width: 40,
                          height: 23.998,
                          color: "var(--2)",
                        }}
                      >
                        <path
                          d="M 20.212 1.325 L 14.163 6.225 C 13.156 7.037 12.963 8.5 13.725 9.544 C 14.531 10.656 16.1 10.875 17.181 10.031 L 23.388 5.206 C 23.825 4.869 24.45 4.944 24.794 5.381 C 25.138 5.819 25.056 6.444 24.619 6.787 L 23.313 7.8 L 32 15.8 L 32 4 L 31.956 4 L 31.712 3.844 L 27.175 0.937 C 26.219 0.325 25.1 0 23.962 0 C 22.6 0 21.275 0.469 20.212 1.325 Z M 21.638 9.1 L 18.406 11.612 C 16.438 13.15 13.581 12.75 12.106 10.725 C 10.719 8.819 11.069 6.156 12.9 4.675 L 18.1 0.469 C 17.375 0.162 16.594 0.006 15.8 0.006 C 14.625 0 13.481 0.35 12.5 1 L 8 4 L 8 18 L 9.762 18 L 15.475 23.212 C 16.7 24.331 18.594 24.244 19.712 23.019 C 20.056 22.637 20.288 22.194 20.406 21.731 L 21.469 22.706 C 22.688 23.825 24.587 23.744 25.706 22.525 C 25.987 22.219 26.194 21.862 26.325 21.494 C 27.538 22.306 29.188 22.137 30.206 21.025 C 31.325 19.806 31.244 17.906 30.025 16.787 L 21.638 9.1 Z M 1 4 C 0.45 4 0 4.45 0 5 L 0 18 C 0 19.106 0.894 20 2 20 L 4 20 C 5.106 20 6 19.106 6 18 L 6 4 L 1 4 Z M 3 16 C 3.265 16 3.52 16.105 3.707 16.293 C 3.895 16.48 4 16.735 4 17 C 4 17.265 3.895 17.52 3.707 17.707 C 3.52 17.895 3.265 18 3 18 C 2.735 18 2.48 17.895 2.293 17.707 C 2.105 17.52 2 17.265 2 17 C 2 16.735 2.105 16.48 2.293 16.293 C 2.48 16.105 2.735 16 3 16 Z M 34 4 L 34 18 C 34 19.106 34.894 20 36 20 L 38 20 C 39.106 20 40 19.106 40 18 L 40 5 C 40 4.45 39.55 4 39 4 L 34 4 Z M 36 17 C 36 16.735 36.105 16.48 36.293 16.293 C 36.48 16.105 36.735 16 37 16 C 37.265 16 37.52 16.105 37.707 16.293 C 37.895 16.48 38 16.735 38 17 C 38 17.265 37.895 17.52 37.707 17.707 C 37.52 17.895 37.265 18 37 18 C 36.735 18 36.48 17.895 36.293 17.707 C 36.105 17.52 36 17.265 36 17 Z"
                          fill="currentColor"
                          fillRule="nonzero"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    position: "relative",
                    backgroundColor: "rgba(0,0,0,0)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    alignItems: "flex-start",
                    flexWrap: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      position: "relative",
                      fontFamily:
                        'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                      fontWeight: 700,
                      fontSize: 20,
                      whiteSpace: "nowrap",
                      lineHeight: "22px",
                      letterSpacing: "-0.500px",
                      color: "rgb(17,24,39)",
                      flexShrink: 0,
                    }}
                  >
                    No Obligation
                  </span>
                  <span
                    style={{
                      position: "relative",
                      fontFamily:
                        'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                      fontWeight: 400,
                      fontSize: 16,
                      lineHeight: "18px",
                      letterSpacing: "-0.500px",
                      color: "rgb(75,85,99)",
                      flexShrink: 0,
                      alignSelf: "stretch",
                    }}
                  >
                    If roof unsuitable
                  </span>
                </div>
              </div>
              <div
                style={{
                  position: "relative",
                  backgroundColor: "rgba(0,0,0,0)",
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                  flexWrap: "nowrap",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: 28,
                    height: 33,
                    backgroundColor: "rgba(0,0,0,0)",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 13,
                      top: 15,
                      width: 2,
                      height: 3,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      flexWrap: "nowrap",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        backgroundColor: "rgba(0,0,0,0)",
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center",
                        flexWrap: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      <svg
                        width={28}
                        height={32}
                        viewBox="0 0 28 32"
                        fill="none"
                        style={{
                          position: "relative",
                          width: 28,
                          height: 32,
                          flexShrink: 0,
                          color: "var(--2)",
                        }}
                      >
                        <path
                          d="M 9 9 L 9 12 L 19 12 L 19 9 C 19 6.238 16.763 4 14 4 C 11.238 4 9 6.238 9 9 Z M 5 12 L 5 9 C 5 4.031 9.031 0 14 0 C 18.969 0 23 4.031 23 9 L 23 12 L 24 12 C 26.206 12 28 13.794 28 16 L 28 28 C 28 30.206 26.206 32 24 32 L 4 32 C 1.794 32 0 30.206 0 28 L 0 16 C 0 13.794 1.794 12 4 12 L 5 12 Z"
                          fill="currentColor"
                          fillRule="nonzero"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    position: "relative",
                    backgroundColor: "rgba(0,0,0,0)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    flexWrap: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      position: "relative",
                      fontFamily:
                        'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                      fontWeight: 700,
                      fontSize: 20,
                      whiteSpace: "nowrap",
                      lineHeight: "22px",
                      letterSpacing: "-0.500px",
                      color: "rgb(17,24,39)",
                      flexShrink: 0,
                    }}
                  >
                    Price Locked
                  </span>
                  <span
                    style={{
                      position: "relative",
                      fontFamily:
                        'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                      fontWeight: 400,
                      fontSize: 16,
                      whiteSpace: "nowrap",
                      lineHeight: "18px",
                      letterSpacing: "-0.500px",
                      color: "rgb(75,85,99)",
                      flexShrink: 0,
                    }}
                  >
                    For 90 days only
                  </span>
                </div>
              </div>
              <div
                style={{
                  position: "relative",
                  backgroundColor: "rgba(0,0,0,0)",
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                  flexWrap: "nowrap",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: 32,
                    height: 32,
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width={32}
                    height={32}
                    viewBox="0 0 32 32"
                    fill="none"
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: 32,
                      height: 32,
                      color: "var(--2)",
                    }}
                  >
                    <path
                      d="M 0 16 C 0 11.757 1.686 7.687 4.686 4.686 C 7.687 1.686 11.757 0 16 0 C 20.243 0 24.313 1.686 27.314 4.686 C 30.314 7.687 32 11.757 32 16 C 32 20.243 30.314 24.313 27.314 27.314 C 24.313 30.314 20.243 32 16 32 C 11.757 32 7.687 30.314 4.686 27.314 C 1.686 24.313 0 20.243 0 16 Z M 15.087 22.848 L 24.299 11.332 L 22.635 10.001 L 14.78 19.817 L 9.216 15.181 L 7.851 16.819 L 15.087 22.848 Z"
                      fill="currentColor"
                      fillRule="evenodd"
                    />
                  </svg>
                </div>
                <div
                  style={{
                    position: "relative",
                    backgroundColor: "rgba(0,0,0,0)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    flexWrap: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      position: "relative",
                      fontFamily:
                        'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                      fontWeight: 700,
                      fontSize: 20,
                      whiteSpace: "nowrap",
                      lineHeight: "22px",
                      letterSpacing: "-0.500px",
                      color: "rgb(17,24,39)",
                      flexShrink: 0,
                    }}
                  >
                    Installation
                  </span>
                  <span
                    style={{
                      position: "relative",
                      fontFamily:
                        'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                      fontWeight: 400,
                      fontSize: 16,
                      whiteSpace: "nowrap",
                      lineHeight: "18px",
                      letterSpacing: "-0.500px",
                      color: "rgb(75,85,99)",
                      flexShrink: 0,
                    }}
                  >
                    {" "}
                    in 15–20 days
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              position: "relative",
              width: 1440,
              height: 98,
              backgroundColor: "rgb(247,244,230)",
              flexShrink: 0,
            }}
          >
            <div
              className="fig-asset-db0497502244a62d-3df8ef3e"
              style={{
                position: "absolute",
                left: 85,
                top: 30,
                width: 154,
                height: 33,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 319,
                top: 25,
                display: "flex",
                flexDirection: "row",
                gap: 48,
                alignItems: "center",
                flexWrap: "nowrap",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: 285,
                  display: "flex",
                  flexDirection: "row",
                  gap: 11,
                  alignItems: "center",
                  flexWrap: "nowrap",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "row",
                    gap: 10,
                    padding: "2px 4px 2px 4px",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    boxSizing: "border-box",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width={16}
                    height={23}
                    viewBox="0 0 16 23"
                    fill="none"
                    style={{
                      position: "relative",
                      width: 16,
                      height: 23,
                      flexShrink: 0,
                      color: "rgb(18,53,50)",
                    }}
                  >
                    <path
                      d="M 8 5.175 C 8.758 5.175 9.484 5.478 10.02 6.017 C 10.556 6.556 10.857 7.288 10.857 8.05 C 10.857 8.428 10.783 8.801 10.64 9.15 C 10.496 9.499 10.286 9.816 10.02 10.083 C 9.755 10.35 9.44 10.562 9.093 10.706 C 8.747 10.851 8.375 10.925 8 10.925 C 7.242 10.925 6.516 10.622 5.98 10.083 C 5.444 9.544 5.143 8.812 5.143 8.05 C 5.143 7.288 5.444 6.556 5.98 6.017 C 6.516 5.478 7.242 5.175 8 5.175 Z M 8 0 C 10.122 0 12.157 0.848 13.657 2.358 C 15.157 3.867 16 5.915 16 8.05 C 16 14.087 8 23 8 23 C 8 23 0 14.087 0 8.05 C 0 5.915 0.843 3.867 2.343 2.358 C 3.843 0.848 5.878 0 8 0 Z M 8 2.3 C 6.484 2.3 5.031 2.906 3.959 3.984 C 2.888 5.062 2.286 6.525 2.286 8.05 C 2.286 9.2 2.286 11.5 8 19.216 C 13.714 11.5 13.714 9.2 13.714 8.05 C 13.714 6.525 13.112 5.062 12.041 3.984 C 10.969 2.906 9.516 2.3 8 2.3 Z"
                      fill="currentColor"
                      fillRule="nonzero"
                    />
                  </svg>
                </div>
                <span
                  style={{
                    position: "relative",
                    fontFamily:
                      'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 500,
                    fontSize: 18,
                    lineHeight: 1.399999976158142,
                    color: "rgb(18,53,50)",
                    flexGrow: 1,
                  }}
                >
                  Thannikakal, Thumpoly PO, Alappuzha– 688008
                </span>
              </div>
              <div
                style={{
                  position: "relative",
                  width: 192,
                  flexShrink: 0,
                  alignSelf: "stretch",
                }}
              >
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 18 18"
                  fill="none"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 16,
                    width: 18,
                    height: 18,
                    color: "rgb(18,53,50)",
                  }}
                >
                  <path
                    d="M 9.009 18 C 13.931 18 18 13.921 18 9 C 18 4.088 13.921 0 9 0 C 4.079 0 0 4.088 0 9 C 0 13.921 4.088 18 9.009 18 Z M 6.399 4.305 C 6.934 2.955 7.668 1.985 8.474 1.686 L 8.474 4.514 C 7.731 4.495 7.033 4.423 6.399 4.305 Z M 9.517 1.686 C 10.323 1.985 11.066 2.955 11.592 4.305 C 10.958 4.423 10.269 4.495 9.517 4.514 L 9.517 1.686 Z M 11.429 1.94 C 12.399 2.275 13.278 2.792 14.012 3.471 C 13.613 3.698 13.151 3.888 12.634 4.051 C 12.308 3.208 11.891 2.492 11.429 1.94 Z M 3.979 3.471 C 4.722 2.801 5.601 2.275 6.571 1.94 C 6.1 2.492 5.692 3.208 5.356 4.051 C 4.849 3.888 4.387 3.698 3.979 3.471 Z M 13.495 8.474 C 13.45 7.214 13.26 6.045 12.961 5.012 C 13.64 4.804 14.239 4.541 14.746 4.233 C 15.707 5.393 16.332 6.861 16.441 8.474 L 13.495 8.474 Z M 1.559 8.474 C 1.668 6.861 2.284 5.393 3.254 4.233 C 3.752 4.541 4.36 4.804 5.03 5.012 C 4.731 6.045 4.55 7.214 4.505 8.474 L 1.559 8.474 Z M 9.517 8.474 L 9.517 5.556 C 10.369 5.529 11.175 5.429 11.927 5.275 C 12.199 6.245 12.381 7.332 12.426 8.474 L 9.517 8.474 Z M 5.574 8.474 C 5.61 7.332 5.792 6.245 6.073 5.275 C 6.816 5.429 7.631 5.529 8.474 5.556 L 8.474 8.474 L 5.574 8.474 Z M 1.559 9.517 L 4.505 9.517 C 4.541 10.795 4.731 11.991 5.03 13.033 C 4.369 13.242 3.77 13.495 3.272 13.804 C 2.293 12.625 1.668 11.148 1.559 9.517 Z M 5.565 9.517 L 8.474 9.517 L 8.474 12.489 C 7.631 12.517 6.816 12.607 6.073 12.77 C 5.792 11.792 5.61 10.677 5.565 9.517 Z M 9.517 12.489 L 9.517 9.517 L 12.426 9.517 C 12.39 10.677 12.208 11.792 11.927 12.77 C 11.175 12.607 10.369 12.517 9.517 12.489 Z M 12.961 13.033 C 13.269 11.991 13.45 10.795 13.495 9.517 L 16.441 9.517 C 16.341 11.148 15.716 12.634 14.728 13.804 C 14.23 13.505 13.631 13.242 12.961 13.033 Z M 6.399 13.74 C 7.033 13.622 7.731 13.55 8.474 13.532 L 8.474 16.36 C 7.668 16.06 6.934 15.091 6.399 13.74 Z M 9.517 13.532 C 10.269 13.55 10.958 13.622 11.592 13.74 C 11.066 15.091 10.323 16.06 9.517 16.36 L 9.517 13.532 Z M 4.006 14.556 C 4.405 14.338 4.858 14.148 5.356 13.994 C 5.683 14.81 6.073 15.499 6.526 16.051 C 5.583 15.725 4.731 15.208 4.006 14.556 Z M 12.634 13.994 C 13.142 14.148 13.595 14.338 13.994 14.565 C 13.269 15.218 12.408 15.734 11.465 16.06 C 11.918 15.508 12.317 14.81 12.634 13.994 Z"
                    fill="currentColor"
                    fillRule="nonzero"
                  />
                </svg>
                <span
                  style={{
                    position: "absolute",
                    left: 29,
                    top: 12.5,
                    width: 149,
                    height: 25,
                    fontFamily:
                      'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 500,
                    fontSize: 18,
                    whiteSpace: "nowrap",
                    lineHeight: 1.399999976158142,
                    color: "rgb(18,53,50)",
                  }}
                >
                  www.flarize.com
                </span>
              </div>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "row",
                  gap: 11,
                  alignItems: "center",
                  flexWrap: "nowrap",
                  flexShrink: 0,
                  alignSelf: "stretch",
                }}
              >
                <svg
                  width={19}
                  height={15}
                  viewBox="0 0 19 15"
                  fill="none"
                  style={{
                    position: "relative",
                    width: 19,
                    height: 15,
                    flexShrink: 0,
                    color: "rgb(18,53,50)",
                  }}
                >
                  <path
                    d="M 18.321 0 L 0.679 0 C 0.303 0 0 0.305 0 0.682 L 0 14.318 C 0 14.695 0.303 15 0.679 15 L 18.321 15 C 18.697 15 19 14.695 19 14.318 L 19 0.682 C 19 0.305 18.697 0 18.321 0 Z M 17.473 2.361 L 17.473 13.466 L 1.527 13.466 L 1.527 2.361 L 0.942 1.903 L 1.775 0.827 L 2.682 1.536 L 16.32 1.536 L 17.227 0.827 L 18.061 1.903 L 17.473 2.361 Z M 16.32 1.534 L 9.5 6.861 L 2.68 1.534 L 1.773 0.825 L 0.939 1.901 L 1.525 2.359 L 8.768 8.018 C 8.977 8.18 9.233 8.269 9.497 8.269 C 9.761 8.269 10.017 8.18 10.225 8.018 L 17.473 2.361 L 18.058 1.903 L 17.225 0.827 L 16.32 1.534 Z"
                    fill="currentColor"
                    fillRule="nonzero"
                  />
                </svg>
                <span
                  style={{
                    position: "relative",
                    fontFamily:
                      'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 500,
                    fontSize: 18,
                    whiteSpace: "nowrap",
                    lineHeight: 1.399999976158142,
                    color: "rgb(18,53,50)",
                    flexShrink: 0,
                  }}
                >
                  sales@flarize.com
                </span>
              </div>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "row",
                  gap: 11,
                  alignItems: "center",
                  flexWrap: "nowrap",
                  flexShrink: 0,
                  alignSelf: "stretch",
                }}
              >
                <svg
                  width={17}
                  height={18}
                  viewBox="0 0 17 18"
                  fill="none"
                  style={{
                    position: "relative",
                    width: 17,
                    height: 18,
                    flexShrink: 0,
                    color: "rgb(18,53,50)",
                  }}
                >
                  <path
                    d="M 15.039 18 L 14.928 18 C 2.085 17.218 0.261 5.739 0.006 2.236 C -0.014 1.964 0.016 1.69 0.096 1.43 C 0.175 1.17 0.303 0.929 0.47 0.722 C 0.638 0.514 0.842 0.343 1.072 0.219 C 1.302 0.096 1.553 0.021 1.81 0 L 5.412 0 C 5.673 0 5.929 0.083 6.146 0.238 C 6.363 0.394 6.53 0.615 6.627 0.872 L 7.621 3.462 C 7.716 3.713 7.74 3.989 7.689 4.255 C 7.638 4.521 7.514 4.765 7.333 4.957 L 5.941 6.445 C 6.158 7.754 6.75 8.961 7.636 9.902 C 8.522 10.843 9.66 11.473 10.895 11.707 L 12.314 10.218 C 12.498 10.029 12.73 9.901 12.982 9.85 C 13.235 9.8 13.495 9.829 13.732 9.935 L 16.196 10.98 C 16.436 11.086 16.64 11.265 16.783 11.494 C 16.926 11.723 17.002 11.993 17 12.268 L 17 15.923 C 17 16.474 16.793 17.002 16.426 17.392 C 16.058 17.781 15.559 18 15.039 18 Z M 1.967 1.385 C 1.794 1.385 1.627 1.458 1.505 1.587 C 1.382 1.717 1.313 1.893 1.313 2.077 L 1.313 2.132 C 1.614 6.231 3.542 15.923 15 16.615 C 15.086 16.621 15.172 16.609 15.253 16.579 C 15.335 16.549 15.41 16.503 15.474 16.442 C 15.538 16.382 15.591 16.309 15.628 16.227 C 15.666 16.145 15.688 16.056 15.693 15.965 L 15.693 12.268 L 13.229 11.222 L 11.353 13.195 L 11.039 13.154 C 5.353 12.399 4.581 6.376 4.581 6.314 L 4.542 5.982 L 6.398 3.995 L 5.418 1.385 L 1.967 1.385 Z"
                    fill="currentColor"
                    fillRule="nonzero"
                  />
                </svg>
                <span
                  style={{
                    position: "relative",
                    fontFamily:
                      'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 500,
                    fontSize: 18,
                    whiteSpace: "nowrap",
                    lineHeight: 1.399999976158142,
                    color: "rgb(18,53,50)",
                    flexShrink: 0,
                  }}
                >
                  +91 9995 073 579
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
