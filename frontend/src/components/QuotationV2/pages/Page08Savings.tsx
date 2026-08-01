// Page 8 of the Flarize quotation document (English) — Your Savings Over Time — savings chart + payback
import type { CSSProperties } from "react";
import type { QuotationV2Data } from "../quotationV2Data";
import SavingsChart from "../SavingsChart";
import FlowArrow from "../icons/FlowArrow";

interface Page08SavingsProps {
  className?: string;
  style?: CSSProperties;
  /** Derived quotation values for this customer. */
  data: QuotationV2Data;
}

export default function Page08Savings({ className, style, data }: Page08SavingsProps) {
  return <div className={className} style={{
    position: "relative",
    width: 1440,
    height: 2038,
    overflow: "hidden",
    backgroundColor: "rgb(255,255,255)",
    ...style
  }}><div style={{
      position: "absolute",
      left: 0,
      top: 0,
      width: 1440,
      height: 2038,
      display: "flex",
      flexDirection: "column",
      padding: "0px 80px 0px 80px",
      alignItems: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box"
    }}><div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: 40,
        padding: "40px 0px 40px 0px",
        alignItems: "flex-end",
        flexWrap: "nowrap",
        boxSizing: "border-box",
        flexShrink: 0,
        alignSelf: "stretch"
      }}><div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 11,
          justifyContent: "center",
          alignItems: "flex-end",
          flexWrap: "nowrap",
          flexShrink: 0
        }}><div className="fig-asset-db0497502244a62d-3df8ef3e" style={{
            position: "relative",
            width: 147,
            height: 31,
            flexShrink: 0
          }} /><span style={{
            position: "relative",
            width: 327,
            fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 300,
            fontSize: 18,
            lineHeight: 1.399999976158142,
            color: "rgb(18,53,50)",
            flexShrink: 0
          }}> by Golden Ray</span></div></div><div style={{
        position: "relative",
        width: 1440,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "nowrap",
        flexGrow: 1
      }}><div style={{
          position: "relative",
          backgroundColor: "rgb(255,255,255)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "20px 0px 20px 0px",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch"
        }}><div style={{
            position: "relative",
            width: 1280,
            backgroundColor: "rgba(0,0,0,0)",
            display: "flex",
            flexDirection: "column",
            gap: 32,
            alignItems: "flex-start",
            flexWrap: "nowrap",
            flexShrink: 0
          }}><div style={{
              position: "relative",
              backgroundColor: "rgba(0,0,0,0)",
              display: "flex",
              flexDirection: "column",
              gap: 18,
              padding: "0px 324px 0px 324px",
              alignItems: "center",
              flexWrap: "nowrap",
              boxSizing: "border-box",
              flexShrink: 0,
              alignSelf: "stretch"
            }}><span style={{
                position: "relative",
                fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                fontWeight: 700,
                fontSize: 42,
                textAlign: "center",
                whiteSpace: "nowrap",
                lineHeight: "46.5px",
                letterSpacing: "-0.500px",
                color: "rgb(17,24,39)",
                flexShrink: 0
              }}>Your Savings Over Time</span></div><div style={{
              position: "relative",
              height: 414,
              backgroundColor: "rgba(0,0,0,0)",
              flexShrink: 0,
              alignSelf: "stretch"
            }}><SavingsChart chart={data.chart} /><div style={{
                position: "absolute",
                left: 668,
                top: 0,
                width: 612,
                backgroundColor: "rgba(0,0,0,0)",
                display: "flex",
                flexDirection: "column",
                gap: 22,
                alignItems: "flex-start",
                flexWrap: "nowrap"
              }}><div style={{
                  position: "relative",
                  borderRadius: 12,
                  backgroundColor: "var(--3-2)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  padding: "25px 25px 25px 25px",
                  alignItems: "flex-start",
                  flexWrap: "nowrap",
                  boxSizing: "border-box",
                  flexShrink: 0,
                  alignSelf: "stretch"
                }}><span style={{
                    position: "relative",
                    fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                    fontWeight: 600,
                    fontSize: 26,
                    lineHeight: "29px",
                    letterSpacing: "-0.500px",
                    color: "var(--2)",
                    flexShrink: 0,
                    alignSelf: "stretch"
                  }}>Monthly Bill Reduction</span><div style={{
                    position: "relative",
                    backgroundColor: "rgba(0,0,0,0)",
                    display: "flex",
                    flexDirection: "row",
                    gap: 80,
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    flexShrink: 0,
                    alignSelf: "stretch"
                  }}><div style={{
                      position: "relative",
                      width: 129,
                      height: 52,
                      backgroundColor: "rgba(0,0,0,0)",
                      flexShrink: 0
                    }}><span style={{
                        position: "absolute",
                        left: 0,
                        top: 1,
                        width: 184,
                        height: 20,
                        fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                        fontWeight: 400,
                        fontSize: 24,
                        whiteSpace: "nowrap",
                        lineHeight: "26.5px",
                        letterSpacing: "-0.500px",
                        color: "rgb(75,85,99)"
                      }}>Current KSEB Bill</span><span style={{
                        position: "absolute",
                        left: 0.328,
                        top: 27,
                        width: 102,
                        height: 32,
                        fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                        fontWeight: 700,
                        fontSize: 30,
                        whiteSpace: "nowrap",
                        lineHeight: "33px",
                        letterSpacing: "-0.500px",
                        color: "var(--2)"
                      }}>{data.monthlyBillValue}</span></div><div style={{
                      position: "relative",
                      width: 21,
                      height: 32,
                      backgroundColor: "rgba(0,0,0,0)",
                      flexShrink: 0
                    }}><div style={{
                        position: "absolute",
                        left: 0,
                        top: 1,
                        width: 21,
                        height: 29,
                        backgroundColor: "rgba(0,0,0,0)"
                      }}><div style={{
                          position: "absolute",
                          left: 0,
                          top: 2,
                          width: 21,
                          height: 24,
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          flexWrap: "nowrap"
                        }}><div style={{
                            position: "relative",
                            width: 21,
                            overflow: "hidden",
                            backgroundColor: "rgba(0,0,0,0)",
                            flexShrink: 0,
                            alignSelf: "stretch"
                          }}><svg width={20.999} height={18.007} viewBox="0 0 20.999 18.007" fill="none" style={{
                              position: "absolute",
                              left: 0,
                              top: 2.996,
                              width: 20.999,
                              height: 18.007,
                              color: "rgb(75,85,99)"
                            }}><path d="M 20.559 10.063 C 21.145 9.477 21.145 8.525 20.559 7.939 L 13.059 0.439 C 12.473 -0.146 11.522 -0.146 10.936 0.439 C 10.35 1.025 10.35 1.977 10.936 2.563 L 15.881 7.504 L 1.5 7.504 C 0.67 7.504 0 8.174 0 9.004 C 0 9.833 0.67 10.504 1.5 10.504 L 15.877 10.504 L 10.941 15.444 C 10.355 16.03 10.355 16.982 10.941 17.568 C 11.527 18.154 12.478 18.154 13.064 17.568 L 20.564 10.068 L 20.559 10.063 Z" fill="currentColor" fillRule="nonzero" /></svg></div></div></div></div><div style={{
                      position: "relative",
                      backgroundColor: "rgba(0,0,0,0)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      alignItems: "flex-start",
                      flexWrap: "nowrap",
                      flexShrink: 0
                    }}><span style={{
                        position: "relative",
                        fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                        fontWeight: 400,
                        fontSize: 24,
                        lineHeight: "26.5px",
                        letterSpacing: "-0.500px",
                        color: "rgb(75,85,99)",
                        flexShrink: 0,
                        alignSelf: "stretch"
                      }}>With Solar</span><span style={{
                        position: "relative",
                        fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                        fontWeight: 700,
                        fontSize: 30,
                        whiteSpace: "nowrap",
                        lineHeight: "33px",
                        letterSpacing: "-0.500px",
                        color: "var(--2)",
                        flexShrink: 0
                      }}>{data.withSolarBill}</span></div></div></div><div style={{
                  position: "relative",
                  backgroundColor: "rgba(0,0,0,0)",
                  display: "flex",
                  flexDirection: "row",
                  gap: 12,
                  alignItems: "center",
                  flexWrap: "nowrap",
                  flexShrink: 0,
                  alignSelf: "stretch"
                }}><div style={{
                    position: "relative",
                    borderRadius: 8,
                    backgroundColor: "var(--primary)",
                    border: "1px solid rgb(191,219,254)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 5,
                    padding: "20px 20px 20px 20px",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    flexWrap: "nowrap",
                    boxSizing: "border-box",
                    flexGrow: 1
                  }}><span style={{
                      position: "relative",
                      fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                      fontWeight: 400,
                      fontSize: 20,
                      lineHeight: "22px",
                      letterSpacing: "-0.500px",
                      color: "rgb(68,68,68)",
                      flexShrink: 0,
                      alignSelf: "stretch"
                    }}>Monthly Savings</span><span style={{
                      position: "relative",
                      fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                      fontWeight: 700,
                      fontSize: 26,
                      lineHeight: "29px",
                      letterSpacing: "-0.500px",
                      color: "var(--black)",
                      flexShrink: 0,
                      alignSelf: "stretch"
                    }}>{data.monthlySavingsRange}</span></div><div style={{
                    position: "relative",
                    borderRadius: 8,
                    backgroundColor: "var(--sec)",
                    border: "1px solid rgb(254,215,170)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 5,
                    padding: "20px 20px 20px 20px",
                    alignItems: "flex-start",
                    flexWrap: "nowrap",
                    boxSizing: "border-box",
                    flexGrow: 1
                  }}><span style={{
                      position: "relative",
                      fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                      fontWeight: 400,
                      fontSize: 20,
                      lineHeight: "22px",
                      letterSpacing: "-0.500px",
                      color: "rgb(255,255,255)",
                      flexShrink: 0,
                      alignSelf: "stretch"
                    }}>25-Year Net Savings</span><span style={{
                      position: "relative",
                      fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                      fontWeight: 700,
                      fontSize: 26,
                      lineHeight: "29px",
                      letterSpacing: "-0.500px",
                      color: "rgb(255,255,255)",
                      flexShrink: 0,
                      alignSelf: "stretch"
                    }}>{data.netSavings25}</span></div></div><div style={{
                  position: "relative",
                  borderRadius: 12,
                  borderTop: "1px solid var(--1-2)",
                  borderRight: "1px solid var(--1-2)",
                  borderBottom: "1px solid var(--1-2)",
                  borderLeft: "2px solid var(--1-2)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 7,
                  padding: "23px 25px 23px 25px",
                  alignItems: "flex-start",
                  flexWrap: "nowrap",
                  boxSizing: "border-box",
                  flexShrink: 0,
                  alignSelf: "stretch"
                }}><span style={{
                    position: "relative",
                    fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                    fontWeight: 600,
                    fontSize: 22,
                    lineHeight: "28px",
                    letterSpacing: "-0.500px",
                    color: "var(--black)",
                    flexShrink: 0,
                    alignSelf: "stretch"
                  }}>Key Takeaway</span><span style={{
                    position: "relative",
                    fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                    fontWeight: 400,
                    fontSize: 22,
                    lineHeight: "24.5px",
                    color: "var(--black)",
                    flexShrink: 0,
                    alignSelf: "stretch"
                  }}>In just {data.paybackMonths}, your solar system pays for itself. The next 25 years are pure savings.</span></div></div></div></div></div><div style={{
          position: "relative",
          width: 1280,
          backgroundColor: "rgba(0,0,0,0)",
          display: "flex",
          flexDirection: "row",
          gap: 24,
          alignItems: "center",
          flexWrap: "nowrap",
          flexShrink: 0
        }}><div style={{
            position: "relative",
            borderRadius: 16,
            backgroundColor: "rgb(254,242,242)",
            border: "2px solid rgb(254,202,202)",
            display: "flex",
            flexDirection: "column",
            gap: 24,
            padding: "34px 34px 34px 34px",
            alignItems: "flex-start",
            flexWrap: "nowrap",
            boxSizing: "border-box",
            flexGrow: 1
          }}><div style={{
              position: "relative",
              backgroundColor: "rgba(0,0,0,0)",
              display: "flex",
              flexDirection: "row",
              gap: 10,
              padding: "1px 0px 1px 0px",
              alignItems: "center",
              flexWrap: "nowrap",
              boxSizing: "border-box",
              flexShrink: 0,
              alignSelf: "stretch"
            }}><svg width={20} height={20} viewBox="0 0 20 20" fill="none" style={{
                position: "relative",
                width: 20,
                height: 20,
                flexShrink: 0,
                color: "rgb(220,38,38)"
              }}><path d="M 10 20 C 12.652 20 15.196 18.946 17.071 17.071 C 18.946 15.196 20 12.652 20 10 C 20 7.348 18.946 4.804 17.071 2.929 C 15.196 1.054 12.652 0 10 0 C 7.348 0 4.804 1.054 2.929 2.929 C 1.054 4.804 0 7.348 0 10 C 0 12.652 1.054 15.196 2.929 17.071 C 4.804 18.946 7.348 20 10 20 Z M 6.836 6.836 C 7.203 6.469 7.797 6.469 8.16 6.836 L 9.996 8.672 L 11.832 6.836 C 12.199 6.469 12.793 6.469 13.156 6.836 C 13.52 7.203 13.523 7.797 13.156 8.16 L 11.32 9.996 L 13.156 11.832 C 13.523 12.199 13.523 12.793 13.156 13.156 C 12.789 13.52 12.195 13.523 11.832 13.156 L 9.996 11.32 L 8.16 13.156 C 7.793 13.523 7.199 13.523 6.836 13.156 C 6.473 12.789 6.469 12.195 6.836 11.832 L 8.672 9.996 L 6.836 8.16 C 6.469 7.793 6.469 7.199 6.836 6.836 Z" fill="currentColor" fillRule="nonzero" /></svg><span style={{
                position: "relative",
                fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                fontWeight: 600,
                fontSize: 22,
                whiteSpace: "nowrap",
                lineHeight: "32px",
                letterSpacing: "-0.500px",
                color: "rgb(220,38,38)",
                flexShrink: 0
              }}>Without Solar</span></div><div style={{
              position: "relative",
              backgroundColor: "rgba(0,0,0,0)",
              display: "flex",
              flexDirection: "column",
              gap: 20,
              alignItems: "flex-start",
              flexWrap: "nowrap",
              flexShrink: 0,
              alignSelf: "stretch"
            }}><div style={{
                position: "relative",
                backgroundColor: "rgba(0,0,0,0)",
                display: "flex",
                flexDirection: "row",
                gap: 18,
                padding: "8px 0px 8px 0px",
                alignItems: "center",
                flexWrap: "nowrap",
                boxSizing: "border-box",
                flexShrink: 0,
                alignSelf: "stretch"
              }}><div style={{
                  position: "relative",
                  transform: "matrix(1,0,0,-1,0,0)",
                  backgroundColor: "rgba(0,0,0,0)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  padding: "4px 0px 4px 0px",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "nowrap",
                  boxSizing: "border-box",
                  flexShrink: 0
                }}><div style={{
                    position: "relative",
                    height: 16,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    flexShrink: 0,
                    alignSelf: "stretch"
                  }}><div style={{
                      position: "relative",
                      width: 32,
                      height: 29,
                      overflow: "hidden",
                      backgroundColor: "rgba(0,0,0,0)",
                      flexShrink: 0
                    }}><svg width={32.004} height={18.124} viewBox="0 0 32.004 18.124" fill="none" style={{
                        position: "absolute",
                        left: -0.004,
                        top: 5.438,
                        width: 32.004,
                        height: 18.124,
                        color: "var(--red)"
                      }}><path d="M 21.338 3.625 C 20.354 3.625 19.56 2.815 19.56 1.813 C 19.56 0.81 20.354 0 21.338 0 L 30.226 0 C 31.21 0 32.004 0.81 32.004 1.813 L 32.004 10.875 C 32.004 11.878 31.21 12.688 30.226 12.688 C 29.243 12.688 28.449 11.878 28.449 10.875 L 28.449 6.191 L 19.038 15.78 C 18.343 16.488 17.215 16.488 16.521 15.78 L 10.671 9.816 L 3.038 17.593 C 2.343 18.301 1.215 18.301 0.521 17.593 C -0.174 16.885 -0.174 15.735 0.521 15.027 L 9.41 5.964 C 10.104 5.256 11.232 5.256 11.926 5.964 L 17.782 11.934 L 25.932 3.625 L 21.338 3.625 Z" fill="currentColor" fillRule="nonzero" /></svg></div></div></div><span style={{
                  position: "relative",
                  width: 475,
                  fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                  fontWeight: 700,
                  fontSize: 38,
                  lineHeight: "42px",
                  letterSpacing: "-0.500px",
                  color: "var(--red-2)",
                  flexShrink: 0,
                  whiteSpace: "pre-wrap",
                  display: "inline-block"
                }}><span style={{
                    fontSize: 38
                  }}>{data.monthlyBillValue} </span><span style={{
                    fontWeight: 500,
                    fontSize: 24
                  }}>( Monthly bill)</span></span></div><div style={{
                position: "relative",
                width: 432,
                height: 28,
                backgroundColor: "rgba(0,0,0,0)",
                flexShrink: 0
              }}><div style={{
                  position: "absolute",
                  left: 0,
                  top: 4,
                  width: 20,
                  backgroundColor: "rgba(0,0,0,0)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  padding: "4px 0px 4px 0px",
                  alignItems: "center",
                  flexWrap: "nowrap",
                  boxSizing: "border-box"
                }}><div style={{
                    position: "relative",
                    height: 16,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    flexShrink: 0,
                    alignSelf: "stretch"
                  }}><div style={{
                      position: "relative",
                      backgroundColor: "rgba(0,0,0,0)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      alignItems: "flex-start",
                      flexWrap: "nowrap",
                      flexShrink: 0,
                      alignSelf: "stretch"
                    }}><svg width={20} height={16} viewBox="0 0 20 16" fill="none" style={{
                        position: "relative",
                        width: 20,
                        height: 16,
                        flexShrink: 0,
                        color: "rgb(68,68,68)"
                      }}><path d="M 0 2.875 L 0 13.94 C 0 14.583 0.351 15.19 0.938 15.415 C 3.958 16.576 6.979 15.783 10 14.99 C 12.771 14.265 15.542 13.536 18.309 14.315 C 19.108 14.54 20 13.975 20 13.122 L 20 2.06 C 20 1.417 19.649 0.81 19.063 0.585 C 16.042 -0.576 13.021 0.217 10 1.01 C 7.229 1.735 4.458 2.46 1.691 1.682 C 0.889 1.457 0 2.021 0 2.875 Z M 10 11.429 C 8.465 11.429 7.222 9.893 7.222 8 C 7.222 6.107 8.465 4.571 10 4.571 C 11.535 4.571 12.778 6.107 12.778 8 C 12.778 9.893 11.535 11.429 10 11.429 Z M 2.222 11.429 C 3.448 11.429 4.444 12.454 4.444 13.715 L 2.222 13.715 L 2.222 11.429 Z M 4.444 4 C 4.444 5.261 3.448 6.286 2.222 6.286 L 2.222 4 L 4.444 4 Z M 17.778 9.714 L 17.778 12 L 15.556 12 C 15.556 10.739 16.552 9.714 17.778 9.714 Z M 15.556 2.285 L 17.778 2.285 L 17.778 4.571 C 16.552 4.571 15.556 3.546 15.556 2.285 Z" fill="currentColor" fillRule="nonzero" /></svg></div></div></div><span style={{
                  position: "absolute",
                  left: 38,
                  top: 2,
                  width: 393,
                  height: 24,
                  fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                  fontWeight: 400,
                  fontSize: 24,
                  whiteSpace: "pre-wrap",
                  lineHeight: "26.5px",
                  letterSpacing: "-0.500px",
                  color: "rgb(68,68,68)",
                  display: "inline-block"
                }}><span style={{
                    color: "rgb(220,38,38)",
                    fontSize: 24
                  }}>{data.paidToKsebLakh} </span><span style={{
                    fontSize: 24
                  }}>paid to KSEB in 25 years</span></span></div><div style={{
                position: "relative",
                width: 432,
                backgroundColor: "rgba(0,0,0,0)",
                display: "flex",
                flexDirection: "row",
                gap: 18,
                alignItems: "center",
                flexWrap: "nowrap",
                flexShrink: 0
              }}><div style={{
                  position: "relative",
                  backgroundColor: "rgba(0,0,0,0)",
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                  padding: "4px 0px 4px 0px",
                  alignItems: "center",
                  flexWrap: "nowrap",
                  boxSizing: "border-box",
                  flexShrink: 0
                }}><div style={{
                    position: "relative",
                    height: 16,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    flexShrink: 0
                  }}><div style={{
                      position: "relative",
                      width: 20,
                      height: 20,
                      overflow: "hidden",
                      backgroundColor: "rgba(0,0,0,0)",
                      flexShrink: 0
                    }}><svg width={20} height={17.500} viewBox="0 0 20 17.500" fill="none" style={{
                        position: "absolute",
                        left: 0,
                        top: 1.25,
                        width: 20,
                        height: 17.5,
                        color: "rgb(68,68,68)"
                      }}><path d="M 2.5 1.25 C 2.5 0.559 1.941 0 1.25 0 C 0.559 0 0 0.559 0 1.25 L 0 14.375 C 0 16.102 1.398 17.5 3.125 17.5 L 18.75 17.5 C 19.441 17.5 20 16.941 20 16.25 C 20 15.559 19.441 15 18.75 15 L 3.125 15 C 2.781 15 2.5 14.719 2.5 14.375 L 2.5 1.25 Z M 18.383 4.633 C 18.871 4.145 18.871 3.352 18.383 2.863 C 17.895 2.375 17.102 2.375 16.613 2.863 L 12.5 6.98 L 10.258 4.738 C 9.77 4.25 8.977 4.25 8.488 4.738 L 4.113 9.113 C 3.625 9.602 3.625 10.395 4.113 10.883 C 4.602 11.371 5.395 11.371 5.883 10.883 L 9.375 7.395 L 11.617 9.637 C 12.105 10.125 12.898 10.125 13.387 9.637 L 18.387 4.637 L 18.383 4.633 Z" fill="currentColor" fillRule="nonzero" /></svg></div></div></div><span style={{
                  position: "relative",
                  fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                  fontWeight: 400,
                  fontSize: 24,
                  whiteSpace: "pre-wrap",
                  lineHeight: "26.5px",
                  letterSpacing: "-0.500px",
                  color: "rgb(68,68,68)",
                  flexShrink: 0
                }}><span style={{
                    fontSize: 24
                  }}>Bill increases</span><span style={{
                    color: "rgb(220,38,38)",
                    fontSize: 24
                  }}> 8-12% yearly</span></span></div><div style={{
                position: "relative",
                width: 432,
                backgroundColor: "rgba(0,0,0,0)",
                display: "flex",
                flexDirection: "row",
                gap: 18,
                alignItems: "center",
                flexWrap: "nowrap",
                flexShrink: 0
              }}><div style={{
                  position: "relative",
                  width: 20,
                  backgroundColor: "rgba(0,0,0,0)",
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                  padding: "4px 0px 4px 0px",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "nowrap",
                  boxSizing: "border-box",
                  flexShrink: 0
                }}><div style={{
                    position: "relative",
                    width: 12,
                    height: 16,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    flexShrink: 0
                  }}><div style={{
                      position: "relative",
                      width: 15,
                      height: 20,
                      overflow: "hidden",
                      backgroundColor: "rgba(0,0,0,0)",
                      flexShrink: 0
                    }}><svg width={15.004} height={20} viewBox="0 0 15.004 20" fill="none" style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: 15.004,
                        height: 20,
                        color: "rgb(68,68,68)"
                      }}><path d="M 1.25 0 C 0.559 0 0 0.559 0 1.25 C 0 1.941 0.559 2.5 1.25 2.5 L 1.25 2.93 C 1.25 4.586 1.91 6.176 3.082 7.348 L 5.73 10 L 3.082 12.652 C 1.91 13.824 1.25 15.414 1.25 17.07 L 1.25 17.5 C 0.559 17.5 0 18.059 0 18.75 C 0 19.441 0.559 20 1.25 20 L 2.5 20 L 12.5 20 L 13.75 20 C 14.441 20 15 19.441 15 18.75 C 15 18.059 14.441 17.5 13.75 17.5 L 13.75 17.07 C 13.75 15.414 13.09 13.824 11.918 12.652 L 9.27 10 L 11.922 7.348 C 13.094 6.176 13.754 4.586 13.754 2.93 L 13.754 2.5 C 14.445 2.5 15.004 1.941 15.004 1.25 C 15.004 0.559 14.445 0 13.754 0 L 12.5 0 L 2.5 0 L 1.25 0 Z M 3.75 2.93 L 3.75 2.5 L 11.25 2.5 L 11.25 2.93 C 11.25 3.926 10.855 4.879 10.152 5.582 L 7.5 8.23 L 4.848 5.578 C 4.145 4.879 3.75 3.922 3.75 2.93 Z" fill="currentColor" fillRule="nonzero" /></svg></div></div></div><span style={{
                  position: "relative",
                  fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                  fontWeight: 400,
                  fontSize: 24,
                  whiteSpace: "nowrap",
                  lineHeight: "26.5px",
                  letterSpacing: "-0.500px",
                  color: "rgb(68,68,68)",
                  flexShrink: 0
                }}>No ownership, no control</span></div></div></div><FlowArrow size={46} style={{ flexShrink: 0, color: "rgb(0,0,0)" }} /><div style={{
            position: "relative",
            borderRadius: 16,
            background: "linear-gradient(117.977deg, rgb(240,253,250) -19.79%, rgb(209,250,229) 50.92%)",
            border: "2px solid var(--green)", boxShadow: "0px 4px 6px 0px rgba(0,0,0,0.1), 0px 10px 15px 0px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            gap: 28,
            padding: "34px 34px 34px 34px",
            alignItems: "flex-start",
            flexWrap: "nowrap",
            boxSizing: "border-box",
            flexGrow: 1
          }}><div style={{
              position: "relative",
              backgroundColor: "rgba(0,0,0,0)",
              display: "flex",
              flexDirection: "row",
              gap: 10,
              padding: "1px 0px 1px 0px",
              alignItems: "center",
              flexWrap: "nowrap",
              boxSizing: "border-box",
              flexShrink: 0,
              alignSelf: "stretch"
            }}><div style={{
                position: "relative",
                width: 20,
                height: 20,
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "nowrap",
                flexShrink: 0
              }}><svg width={20} viewBox="0 0 20 20" fill="none" style={{
                  position: "relative",
                  width: 20,
                  flexShrink: 0,
                  alignSelf: "stretch",
                  color: "var(--green)"
                }}><path d="M 10 20 C 12.652 20 15.196 18.946 17.071 17.071 C 18.946 15.196 20 12.652 20 10 C 20 7.348 18.946 4.804 17.071 2.929 C 15.196 1.054 12.652 0 10 0 C 7.348 0 4.804 1.054 2.929 2.929 C 1.054 4.804 0 7.348 0 10 C 0 12.652 1.054 15.196 2.929 17.071 C 4.804 18.946 7.348 20 10 20 Z M 14.414 8.164 L 9.414 13.164 C 9.047 13.531 8.453 13.531 8.09 13.164 L 5.59 10.664 C 5.223 10.297 5.223 9.703 5.59 9.34 C 5.957 8.977 6.551 8.973 6.914 9.34 L 8.75 11.176 L 13.086 6.836 C 13.453 6.469 14.047 6.469 14.41 6.836 C 14.773 7.203 14.777 7.797 14.41 8.16 L 14.414 8.164 Z" fill="currentColor" fillRule="nonzero" /></svg></div><span style={{
                position: "relative",
                fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                fontWeight: 600,
                fontSize: 24,
                whiteSpace: "nowrap",
                lineHeight: "32px",
                letterSpacing: "-0.500px",
                color: "var(--green)",
                flexShrink: 0
              }}>With Solar</span></div><div style={{
              position: "relative",
              backgroundColor: "rgba(0,0,0,0)",
              display: "flex",
              flexDirection: "column",
              gap: 20,
              alignItems: "flex-start",
              flexWrap: "nowrap",
              flexShrink: 0,
              alignSelf: "stretch"
            }}><div style={{
                position: "relative",
                backgroundColor: "rgba(0,0,0,0)",
                display: "flex",
                flexDirection: "row",
                gap: 18,
                padding: "8px 0px 8px 0px",
                alignItems: "center",
                flexWrap: "nowrap",
                boxSizing: "border-box",
                flexShrink: 0
              }}><div style={{
                  position: "relative",
                  backgroundColor: "rgba(0,0,0,0)",
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                  flexWrap: "nowrap",
                  flexShrink: 0
                }}><div style={{
                    position: "relative",
                    width: 32,
                    height: 37,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    flexShrink: 0
                  }}><div style={{
                      position: "relative",
                      width: 32,
                      overflow: "hidden",
                      backgroundColor: "rgba(0,0,0,0)",
                      flexShrink: 0,
                      alignSelf: "stretch"
                    }}><svg width={27.434} height={36.001} viewBox="0 0 27.434 36.001" fill="none" style={{
                        position: "absolute",
                        left: 2.283,
                        top: -0.001,
                        width: 27.434,
                        height: 36.001,
                        color: "var(--green-2)"
                      }}><path d="M 22.674 3.137 C 23.096 2.173 22.782 1.048 21.917 0.43 C 21.053 -0.189 19.874 -0.133 19.067 0.556 L 0.782 16.306 C 0.067 16.925 -0.19 17.916 0.146 18.788 C 0.482 19.66 1.339 20.251 2.289 20.251 L 10.253 20.251 L 4.76 32.865 C 4.339 33.828 4.653 34.953 5.517 35.572 C 6.382 36.19 7.56 36.134 8.367 35.445 L 26.653 19.695 C 27.367 19.076 27.624 18.085 27.289 17.213 C 26.953 16.341 26.103 15.758 25.146 15.758 L 17.182 15.758 L 22.674 3.137 Z" fill="currentColor" fillRule="nonzero" /></svg></div></div></div><span style={{
                  position: "relative",
                  width: 443,
                  fontFamily: "var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                  fontWeight: 400,
                  fontSize: 22,
                  lineHeight: "24.5px",
                  color: "rgb(0,0,0)",
                  flexShrink: 0,
                  whiteSpace: "pre-wrap",
                  display: "inline-block"
                }}><span style={{
                    fontWeight: 700,
                    color: "rgb(0,129,48)",
                    fontSize: 38
                  }}>₹300-800</span><span style={{
                    fontWeight: 500,
                    color: "rgb(0,129,48)",
                    fontSize: 24
                  }}>/month</span></span></div><div style={{
                position: "relative",
                width: 432,
                height: 24,
                backgroundColor: "rgba(0,0,0,0)",
                flexShrink: 0
              }}><div style={{
                  position: "absolute",
                  left: 0,
                  top: 4,
                  width: 20,
                  backgroundColor: "rgba(0,0,0,0)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  padding: "4px 0px 4px 0px",
                  alignItems: "flex-start",
                  flexWrap: "nowrap",
                  boxSizing: "border-box"
                }}><div style={{
                    position: "relative",
                    height: 16,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    flexShrink: 0,
                    alignSelf: "stretch"
                  }}><div style={{
                      position: "relative",
                      width: 20,
                      overflow: "hidden",
                      backgroundColor: "rgba(0,0,0,0)",
                      flexShrink: 0,
                      alignSelf: "stretch"
                    }}><svg width={20} height={18} viewBox="0 0 20 18" fill="none" style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: 20,
                        height: 18,
                        color: "var(--text)"
                      }}><path d="M 13.889 3.375 L 13.889 3.4 C 13.705 3.386 13.521 3.375 13.333 3.375 L 8.889 3.375 C 8.316 3.375 7.76 3.449 7.229 3.586 C 7.226 3.516 7.222 3.445 7.222 3.375 C 7.222 1.512 8.715 0 10.556 0 C 12.396 0 13.889 1.512 13.889 3.375 Z M 13.333 4.5 C 13.455 4.5 13.576 4.504 13.694 4.511 C 13.84 4.521 13.986 4.535 14.132 4.556 C 14.743 3.836 15.653 3.375 16.667 3.375 L 17.066 3.375 C 17.427 3.375 17.691 3.72 17.604 4.075 L 17.125 6.015 C 17.674 6.536 18.122 7.168 18.427 7.875 L 18.889 7.875 C 19.503 7.875 20 8.378 20 9 L 20 12.375 C 20 12.997 19.503 13.5 18.889 13.5 L 17.778 13.5 C 17.462 13.925 17.087 14.305 16.667 14.625 L 16.667 16.875 C 16.667 17.497 16.17 18 15.556 18 L 14.444 18 C 13.83 18 13.333 17.497 13.333 16.875 L 13.333 15.75 L 8.889 15.75 L 8.889 16.875 C 8.889 17.497 8.392 18 7.778 18 L 6.667 18 C 6.052 18 5.556 17.497 5.556 16.875 L 5.556 14.625 C 4.344 13.704 3.517 12.294 3.361 10.688 L 2.361 10.688 C 1.056 10.688 0 9.619 0 8.297 C 0 6.975 1.056 5.906 2.361 5.906 L 2.5 5.906 C 2.962 5.906 3.333 6.282 3.333 6.75 C 3.333 7.218 2.962 7.594 2.5 7.594 L 2.361 7.594 C 1.979 7.594 1.667 7.91 1.667 8.297 C 1.667 8.684 1.979 9 2.361 9 L 3.444 9 C 3.865 6.898 5.448 5.221 7.483 4.683 C 7.931 4.563 8.403 4.5 8.889 4.5 L 13.333 4.5 Z M 15.556 9.281 C 15.556 9.057 15.468 8.843 15.311 8.685 C 15.155 8.526 14.943 8.438 14.722 8.438 C 14.501 8.438 14.289 8.526 14.133 8.685 C 13.977 8.843 13.889 9.057 13.889 9.281 C 13.889 9.505 13.977 9.72 14.133 9.878 C 14.289 10.036 14.501 10.125 14.722 10.125 C 14.943 10.125 15.155 10.036 15.311 9.878 C 15.468 9.72 15.556 9.505 15.556 9.281 Z" fill="currentColor" fillRule="nonzero" /></svg></div></div></div><span style={{
                  position: "absolute",
                  left: 38,
                  top: 2,
                  width: 327,
                  height: 24,
                  fontFamily: "var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                  fontWeight: 400,
                  fontSize: 24,
                  whiteSpace: "pre-wrap",
                  lineHeight: "26.5px",
                  color: "rgb(0,0,0)",
                  display: "inline-block"
                }}><span style={{
                    color: "rgb(22,163,74)",
                    fontSize: 24
                  }}>{data.savedLakh}</span><span style={{
                    color: "rgb(68,68,68)",
                    fontSize: 24
                  }}> saved over 25 years</span></span></div><div style={{
                position: "relative",
                width: 432,
                height: 24,
                backgroundColor: "rgba(0,0,0,0)",
                flexShrink: 0
              }}><div style={{
                  position: "absolute",
                  left: 0,
                  top: 4,
                  width: 16,
                  height: 24,
                  backgroundColor: "rgba(0,0,0,0)"
                }}><div style={{
                    position: "absolute",
                    left: 0,
                    top: 4,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "nowrap"
                  }}><div style={{
                      position: "relative",
                      height: 21,
                      overflow: "hidden",
                      backgroundColor: "rgba(0,0,0,0)",
                      display: "flex",
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                      flexWrap: "nowrap",
                      flexShrink: 0
                    }}><svg width={20} viewBox="0 0 20 21" fill="none" style={{
                        position: "relative",
                        width: 20,
                        flexShrink: 0,
                        alignSelf: "stretch",
                        color: "var(--text)"
                      }}><path d="M 10 0 C 10.192 0 10.383 0.041 10.558 0.12 L 18.404 3.415 C 19.321 3.798 20.004 4.693 20 5.774 C 19.979 9.865 18.279 17.35 11.1 20.753 C 10.404 21.082 9.596 21.082 8.9 20.753 C 1.721 17.35 0.021 9.865 0 5.774 C -0.004 4.693 0.679 3.798 1.596 3.415 L 9.446 0.12 C 9.617 0.041 9.808 0 10 0 Z M 10 2.755 L 10 18.344 C 15.75 15.589 17.296 9.49 17.333 5.832 L 10 2.755 Z" fill="currentColor" fillRule="nonzero" /></svg></div></div></div><span style={{
                  position: "absolute",
                  left: 34,
                  top: 2,
                  width: 297,
                  height: 24,
                  fontFamily: "var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                  fontWeight: 400,
                  fontSize: 24,
                  whiteSpace: "pre-wrap",
                  lineHeight: "26.5px",
                  color: "rgb(0,0,0)",
                  display: "inline-block"
                }}><span style={{
                    color: "rgb(68,68,68)",
                    fontSize: 24
                  }}>Protected from</span><span style={{
                    color: "rgb(22,163,74)",
                    fontSize: 24
                  }}> tariff hikes</span></span></div><div style={{
                position: "relative",
                width: 432,
                height: 24,
                backgroundColor: "rgba(0,0,0,0)",
                flexShrink: 0
              }}><div style={{
                  position: "absolute",
                  left: 0,
                  top: 4,
                  width: 18,
                  height: 24,
                  backgroundColor: "rgba(0,0,0,0)"
                }}><div style={{
                    position: "absolute",
                    left: 0,
                    top: 4,
                    width: 20,
                    height: 18,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "nowrap"
                  }}><div style={{
                      position: "relative",
                      overflow: "hidden",
                      backgroundColor: "rgba(0,0,0,0)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      alignItems: "flex-start",
                      flexWrap: "nowrap",
                      flexGrow: 1,
                      alignSelf: "stretch"
                    }}><svg height={18} viewBox="0 0 20 18" fill="none" style={{
                        position: "relative",
                        height: 18,
                        flexShrink: 0,
                        alignSelf: "stretch",
                        color: "var(--text)"
                      }}><path d="M 12.42 0.298 C 11.993 -0.099 11.337 -0.099 10.913 0.298 L 3.691 7.048 C 3.365 7.351 3.25 7.822 3.396 8.244 C 6.42 9.133 8.799 11.556 9.656 14.628 L 16.111 14.628 C 17.031 14.628 17.778 13.872 17.778 12.941 L 17.778 9 L 18.889 9 C 19.347 9 19.757 8.715 19.924 8.286 C 20.09 7.857 19.979 7.365 19.642 7.048 L 12.42 0.298 Z M 10 7.312 C 10 7.003 10.25 6.749 10.556 6.749 L 12.778 6.749 C 13.083 6.749 13.333 7.003 13.333 7.312 L 13.333 9.562 C 13.333 9.871 13.083 10.125 12.778 10.125 L 10.556 10.125 C 10.25 10.125 10 9.871 10 9.562 L 10 7.312 Z M 0.833 9 C 0.372 9 0 9.376 0 9.843 C 0 10.311 0.372 10.687 0.833 10.687 C 4.361 10.687 7.222 13.584 7.222 17.156 C 7.222 17.624 7.594 18 8.056 18 C 8.517 18 8.889 17.624 8.889 17.156 C 8.889 12.652 5.281 9 0.833 9 Z M 1.111 18 C 1.406 18 1.688 17.881 1.897 17.67 C 2.105 17.459 2.222 17.173 2.222 16.875 C 2.222 16.577 2.105 16.29 1.897 16.079 C 1.688 15.868 1.406 15.75 1.111 15.75 C 0.816 15.75 0.534 15.868 0.325 16.079 C 0.117 16.29 0 16.577 0 16.875 C 0 17.173 0.117 17.459 0.325 17.67 C 0.534 17.881 0.816 18 1.111 18 Z M 0 13.219 C 0 13.686 0.372 14.062 0.833 14.062 C 2.521 14.062 3.889 15.448 3.889 17.156 C 3.889 17.624 4.26 18 4.722 18 C 5.184 18 5.556 17.624 5.556 17.156 C 5.556 14.516 3.441 12.375 0.833 12.375 C 0.372 12.375 0 12.751 0 13.219 Z" fill="currentColor" fillRule="nonzero" /></svg></div></div></div><span style={{
                  position: "absolute",
                  left: 36,
                  top: 2,
                  width: 410,
                  height: 24,
                  fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                  fontWeight: 400,
                  fontSize: 24,
                  whiteSpace: "pre-wrap",
                  lineHeight: "26.5px",
                  letterSpacing: "-0.500px",
                  color: "var(--text)",
                  display: "inline-block"
                }}><span style={{
                    fontSize: 24
                  }}>Own your power,</span><span style={{
                    color: "rgb(22,163,74)",
                    fontSize: 24
                  }}> 25+ year warranty</span></span></div></div></div></div><div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 24,
          padding: "40px 80px 40px 80px",
          alignItems: "center",
          flexWrap: "nowrap",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch"
        }}><div style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 24,
            justifyContent: "center",
            alignItems: "flex-start",
            flexWrap: "nowrap",
            flexShrink: 0,
            alignSelf: "stretch"
          }}><span style={{
              position: "relative",
              fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 700,
              fontSize: 34,
              whiteSpace: "nowrap",
              lineHeight: 1.2000000476837158,
              color: "rgb(18,53,50)",
              flexShrink: 0
            }}>Book now</span></div><div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 24,
            justifyContent: "center",
            alignItems: "flex-start",
            flexWrap: "nowrap",
            flexShrink: 0,
            alignSelf: "stretch"
          }}><div style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "nowrap",
              flexShrink: 0,
              alignSelf: "stretch"
            }}><div style={{
                position: "relative",
                width: 255,
                overflow: "hidden",
                borderRadius: 28,
                backgroundColor: "rgb(255,255,255)",
                border: "1px solid rgb(217,219,233)", boxShadow: "0px 0.500px 1px 0px rgba(25,33,61,0.04)",
                display: "flex",
                flexDirection: "column",
                padding: "20px 20px 20px 20px",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "nowrap",
                boxSizing: "border-box",
                flexGrow: 1
              }}><div className="fig-asset-0701f7494693611f-5d8c127c" style={{
                  position: "relative",
                  height: 269,
                  display: "flex",
                  flexDirection: "row",
                  gap: 162,
                  alignItems: "center",
                  flexWrap: "nowrap",
                  flexShrink: 0,
                  alignSelf: "stretch"
                }}><div style={{
                    position: "relative",
                    height: 23,
                    display: "flex",
                    flexDirection: "column",
                    gap: 28,
                    alignItems: "flex-start",
                    flexWrap: "nowrap",
                    flexGrow: 1
                  }} /></div><div style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "row",
                  gap: 162,
                  alignItems: "center",
                  flexWrap: "nowrap",
                  flexShrink: 0
                }}><div style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    gap: 28,
                    alignItems: "flex-start",
                    flexWrap: "nowrap",
                    flexShrink: 0
                  }}><span style={{
                      position: "relative",
                      fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                      fontWeight: 600,
                      fontSize: 26,
                      whiteSpace: "pre-wrap",
                      lineHeight: "100%",
                      textBox: "trim-both cap alphabetic",
                      color: "rgb(18,53,50)",
                      flexShrink: 0
                    }}><span style={{
                        fontWeight: 500,
                        fontSize: 26
                      }}>UPI ID:</span><span style={{
                        color: "rgb(248,138,34)",
                        fontSize: 26
                      }}> flarize@upi</span></span></div></div></div></div><div style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 28,
              backgroundColor: "rgb(255,255,255)",
              border: "1px solid rgb(217,219,233)", boxShadow: "0px 0.500px 1px 0px rgba(25,33,61,0.04)",
              display: "flex",
              flexDirection: "column",
              gap: 28,
              padding: "40px 20px 40px 20px",
              justifyContent: "center",
              alignItems: "flex-start",
              flexWrap: "nowrap",
              boxSizing: "border-box",
              flexGrow: 1
            }}><div style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                gap: 162,
                justifyContent: "center",
                alignItems: "flex-start",
                flexWrap: "nowrap",
                flexShrink: 0,
                alignSelf: "stretch"
              }}><div style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  gap: 32,
                  justifyContent: "center",
                  alignItems: "flex-start",
                  flexWrap: "nowrap",
                  flexShrink: 0,
                  alignSelf: "stretch"
                }}><span style={{
                    position: "relative",
                    fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                    fontWeight: 400,
                    fontSize: 22,
                    lineHeight: "100%",
                    textBox: "trim-both cap alphabetic",
                    color: "rgb(18,53,50)",
                    flexShrink: 0,
                    alignSelf: "stretch"
                  }}>Bank Transfer</span><span style={{
                    position: "relative",
                    fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                    fontWeight: 500,
                    fontSize: 26,
                    lineHeight: "100.20999908447266%",
                    textBox: "trim-both cap alphabetic",
                    color: "rgb(18,53,50)",
                    flexShrink: 0,
                    alignSelf: "stretch",
                    whiteSpace: "pre-wrap"
                  }}>Bank: <span style={{
                      color: "rgb(248,138,34)",
                      fontSize: 26
                    }}>Union Bank of India</span>
A/c Name: <span style={{
                      color: "rgb(248,138,34)",
                      fontSize: 26
                    }}>Golden Ray Renewable Energy LLP</span>
A/c No: <span style={{
                      color: "rgb(248,138,34)",
                      fontSize: 26
                    }}>510 101 0069 819 30</span>
IFSC: <span style={{
                      color: "rgb(248,138,34)"
                    }}>UBIN 0901 725</span>
Branch: <span style={{
                      color: "rgb(248,138,34)"
                    }}>Alappuzha</span></span><span style={{
                    position: "relative",
                    fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                    fontWeight: 500,
                    fontSize: 22,
                    lineHeight: "100%",
                    textBox: "trim-both cap alphabetic",
                    color: "rgb(18,53,50)",
                    flexShrink: 0,
                    alignSelf: "stretch"
                  }}>UPI Ref / NEFT Ref will be your project ID</span></div></div></div></div></div><div style={{
          position: "relative",
          overflow: "hidden",
          backgroundColor: "var(--4-2)",
          border: "1px solid rgb(217,219,233)", boxShadow: "0px 0.500px 1px 0px rgba(25,33,61,0.04)",
          display: "flex",
          flexDirection: "column",
          gap: 28,
          padding: "36px 80px 36px 80px",
          alignItems: "flex-start",
          flexWrap: "nowrap",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch"
        }}><div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 162,
            alignItems: "center",
            flexWrap: "nowrap",
            flexShrink: 0,
            alignSelf: "stretch"
          }}><div style={{
              position: "relative",
              width: 1280,
              display: "flex",
              flexDirection: "column",
              gap: 28,
              alignItems: "flex-start",
              flexWrap: "nowrap",
              flexShrink: 0
            }}><div style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                gap: 24,
                alignItems: "center",
                flexWrap: "nowrap",
                flexShrink: 0
              }}><span style={{
                  position: "relative",
                  fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                  fontWeight: 700,
                  fontSize: 34,
                  whiteSpace: "nowrap",
                  lineHeight: 1.2000000476837158,
                  color: "rgb(18,53,50)",
                  flexShrink: 0
                }}>Required Documents:</span></div><div style={{
                position: "relative",
                height: 160,
                backgroundColor: "rgba(0,0,0,0)",
                display: "grid",
                gridTemplateRows: "auto auto auto auto",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px 16px",
                flexShrink: 0,
                alignSelf: "stretch"
              }}><span style={{
                  position: "relative",
                  width: 535,
                  height: 28,
                  fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                  fontWeight: 400,
                  fontSize: 28,
                  lineHeight: "31px",
                  letterSpacing: "-0.500px",
                  color: "var(--2-2)",
                  whiteSpace: "pre-wrap",
                  display: "inline-block"
                }}>1. Bank Account</span><span style={{
                  position: "relative",
                  width: 632,
                  height: 28,
                  fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                  fontWeight: 400,
                  fontSize: 28,
                  lineHeight: "31px",
                  letterSpacing: "-0.500px",
                  color: "var(--2-2)",
                  whiteSpace: "pre-wrap",
                  display: "inline-block"
                }}>2. Proof of Identity (Aadhar & PAN Card)</span><span style={{
                  position: "relative",
                  width: 632,
                  height: 28,
                  fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                  fontWeight: 400,
                  fontSize: 28,
                  lineHeight: "31px",
                  letterSpacing: "-0.500px",
                  color: "var(--2-2)",
                  whiteSpace: "pre-wrap",
                  display: "inline-block"
                }}>3. Proof of Address</span><span style={{
                  position: "relative",
                  width: 632,
                  height: 28,
                  fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                  fontWeight: 400,
                  fontSize: 28,
                  lineHeight: "31px",
                  letterSpacing: "-0.500px",
                  color: "var(--2-2)",
                  whiteSpace: "pre-wrap",
                  display: "inline-block"
                }}>4. Salary Slips/Bank Statements (above 2L)</span><span style={{
                  position: "relative",
                  width: 632,
                  height: 28,
                  fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                  fontWeight: 400,
                  fontSize: 28,
                  lineHeight: "31px",
                  letterSpacing: "-0.500px",
                  color: "var(--2-2)",
                  whiteSpace: "pre-wrap",
                  display: "inline-block"
                }}>5. Land tax, Building tax</span><span style={{
                  position: "relative",
                  width: 632,
                  height: 28,
                  fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                  fontWeight: 400,
                  fontSize: 28,
                  lineHeight: "31px",
                  letterSpacing: "-0.500px",
                  color: "var(--2-2)",
                  whiteSpace: "pre-wrap",
                  display: "inline-block"
                }}>6. Latest KSEB Bill (2 months)</span><span style={{
                  position: "relative",
                  width: 632,
                  height: 28,
                  fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                  fontWeight: 400,
                  fontSize: 28,
                  lineHeight: "31px",
                  letterSpacing: "-0.500px",
                  color: "var(--2-2)",
                  whiteSpace: "pre-wrap",
                  display: "inline-block"
                }}>7. KSEB Feasibility Report</span><span style={{
                  position: "relative",
                  width: 632,
                  height: 28,
                  fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                  fontWeight: 400,
                  fontSize: 28,
                  lineHeight: "31px",
                  letterSpacing: "-0.500px",
                  color: "var(--2-2)",
                  whiteSpace: "pre-wrap",
                  display: "inline-block"
                }}>8. ITR (above 2L)</span></div></div></div></div><div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 24,
          padding: "40px 80px 40px 80px",
          alignItems: "center",
          flexWrap: "nowrap",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch"
        }}><div style={{
            position: "relative",
            borderLeft: "2px solid var(--1-2)",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            padding: "0px 16px 0px 16px",
            justifyContent: "center",
            alignItems: "flex-start",
            flexWrap: "nowrap",
            boxSizing: "border-box",
            flexShrink: 0,
            alignSelf: "stretch"
          }}><span style={{
              position: "relative",
              fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 400,
              fontSize: 24,
              lineHeight: "28px",
              letterSpacing: "-0.500px",
              color: "var(--grey)",
              flexShrink: 0,
              alignSelf: "stretch"
            }}>Additional Structure cost  ( if needed)</span><span style={{
              position: "relative",
              fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 600,
              fontSize: 24,
              lineHeight: "28px",
              letterSpacing: "-0.500px",
              color: "var(--p1)",
              flexShrink: 0,
              alignSelf: "stretch"
            }}>₹4500/kw</span></div></div><div style={{
          position: "relative",
          height: 98,
          backgroundColor: "rgb(247,244,230)",
          flexShrink: 0,
          alignSelf: "stretch"
        }}><div className="fig-asset-db0497502244a62d-3df8ef3e" style={{
            position: "absolute",
            left: 85,
            top: 30,
            width: 154,
            height: 33
          }} /><div style={{
            position: "absolute",
            left: 319,
            top: 25,
            display: "flex",
            flexDirection: "row",
            gap: 48,
            alignItems: "center",
            flexWrap: "nowrap"
          }}><div style={{
              position: "relative",
              width: 285,
              display: "flex",
              flexDirection: "row",
              gap: 11,
              alignItems: "center",
              flexWrap: "nowrap",
              flexShrink: 0
            }}><div style={{
                position: "relative",
                display: "flex",
                flexDirection: "row",
                gap: 10,
                padding: "2px 4px 2px 4px",
                alignItems: "center",
                flexWrap: "nowrap",
                boxSizing: "border-box",
                flexShrink: 0
              }}><svg width={16} height={23} viewBox="0 0 16 23" fill="none" style={{
                  position: "relative",
                  width: 16,
                  height: 23,
                  flexShrink: 0,
                  color: "rgb(18,53,50)"
                }}><path d="M 8 5.175 C 8.758 5.175 9.484 5.478 10.02 6.017 C 10.556 6.556 10.857 7.288 10.857 8.05 C 10.857 8.428 10.783 8.801 10.64 9.15 C 10.496 9.499 10.286 9.816 10.02 10.083 C 9.755 10.35 9.44 10.562 9.093 10.706 C 8.747 10.851 8.375 10.925 8 10.925 C 7.242 10.925 6.516 10.622 5.98 10.083 C 5.444 9.544 5.143 8.812 5.143 8.05 C 5.143 7.288 5.444 6.556 5.98 6.017 C 6.516 5.478 7.242 5.175 8 5.175 Z M 8 0 C 10.122 0 12.157 0.848 13.657 2.358 C 15.157 3.867 16 5.915 16 8.05 C 16 14.087 8 23 8 23 C 8 23 0 14.087 0 8.05 C 0 5.915 0.843 3.867 2.343 2.358 C 3.843 0.848 5.878 0 8 0 Z M 8 2.3 C 6.484 2.3 5.031 2.906 3.959 3.984 C 2.888 5.062 2.286 6.525 2.286 8.05 C 2.286 9.2 2.286 11.5 8 19.216 C 13.714 11.5 13.714 9.2 13.714 8.05 C 13.714 6.525 13.112 5.062 12.041 3.984 C 10.969 2.906 9.516 2.3 8 2.3 Z" fill="currentColor" fillRule="nonzero" /></svg></div><span style={{
                position: "relative",
                fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                fontWeight: 500,
                fontSize: 18,
                lineHeight: 1.399999976158142,
                color: "rgb(18,53,50)",
                flexGrow: 1
              }}>Thannikakal, Thumpoly PO, Alappuzha– 688008</span></div><div style={{
              position: "relative",
              width: 192,
              flexShrink: 0,
              alignSelf: "stretch"
            }}><svg width={18} height={18} viewBox="0 0 18 18" fill="none" style={{
                position: "absolute",
                left: 0,
                top: 16,
                width: 18,
                height: 18,
                color: "rgb(18,53,50)"
              }}><path d="M 9.009 18 C 13.931 18 18 13.921 18 9 C 18 4.088 13.921 0 9 0 C 4.079 0 0 4.088 0 9 C 0 13.921 4.088 18 9.009 18 Z M 6.399 4.305 C 6.934 2.955 7.668 1.985 8.474 1.686 L 8.474 4.514 C 7.731 4.495 7.033 4.423 6.399 4.305 Z M 9.517 1.686 C 10.323 1.985 11.066 2.955 11.592 4.305 C 10.958 4.423 10.269 4.495 9.517 4.514 L 9.517 1.686 Z M 11.429 1.94 C 12.399 2.275 13.278 2.792 14.012 3.471 C 13.613 3.698 13.151 3.888 12.634 4.051 C 12.308 3.208 11.891 2.492 11.429 1.94 Z M 3.979 3.471 C 4.722 2.801 5.601 2.275 6.571 1.94 C 6.1 2.492 5.692 3.208 5.356 4.051 C 4.849 3.888 4.387 3.698 3.979 3.471 Z M 13.495 8.474 C 13.45 7.214 13.26 6.045 12.961 5.012 C 13.64 4.804 14.239 4.541 14.746 4.233 C 15.707 5.393 16.332 6.861 16.441 8.474 L 13.495 8.474 Z M 1.559 8.474 C 1.668 6.861 2.284 5.393 3.254 4.233 C 3.752 4.541 4.36 4.804 5.03 5.012 C 4.731 6.045 4.55 7.214 4.505 8.474 L 1.559 8.474 Z M 9.517 8.474 L 9.517 5.556 C 10.369 5.529 11.175 5.429 11.927 5.275 C 12.199 6.245 12.381 7.332 12.426 8.474 L 9.517 8.474 Z M 5.574 8.474 C 5.61 7.332 5.792 6.245 6.073 5.275 C 6.816 5.429 7.631 5.529 8.474 5.556 L 8.474 8.474 L 5.574 8.474 Z M 1.559 9.517 L 4.505 9.517 C 4.541 10.795 4.731 11.991 5.03 13.033 C 4.369 13.242 3.77 13.495 3.272 13.804 C 2.293 12.625 1.668 11.148 1.559 9.517 Z M 5.565 9.517 L 8.474 9.517 L 8.474 12.489 C 7.631 12.517 6.816 12.607 6.073 12.77 C 5.792 11.792 5.61 10.677 5.565 9.517 Z M 9.517 12.489 L 9.517 9.517 L 12.426 9.517 C 12.39 10.677 12.208 11.792 11.927 12.77 C 11.175 12.607 10.369 12.517 9.517 12.489 Z M 12.961 13.033 C 13.269 11.991 13.45 10.795 13.495 9.517 L 16.441 9.517 C 16.341 11.148 15.716 12.634 14.728 13.804 C 14.23 13.505 13.631 13.242 12.961 13.033 Z M 6.399 13.74 C 7.033 13.622 7.731 13.55 8.474 13.532 L 8.474 16.36 C 7.668 16.06 6.934 15.091 6.399 13.74 Z M 9.517 13.532 C 10.269 13.55 10.958 13.622 11.592 13.74 C 11.066 15.091 10.323 16.06 9.517 16.36 L 9.517 13.532 Z M 4.006 14.556 C 4.405 14.338 4.858 14.148 5.356 13.994 C 5.683 14.81 6.073 15.499 6.526 16.051 C 5.583 15.725 4.731 15.208 4.006 14.556 Z M 12.634 13.994 C 13.142 14.148 13.595 14.338 13.994 14.565 C 13.269 15.218 12.408 15.734 11.465 16.06 C 11.918 15.508 12.317 14.81 12.634 13.994 Z" fill="currentColor" fillRule="nonzero" /></svg><span style={{
                position: "absolute",
                left: 29,
                top: 12.5,
                width: 149,
                height: 25,
                fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                fontWeight: 500,
                fontSize: 18,
                whiteSpace: "nowrap",
                lineHeight: 1.399999976158142,
                color: "rgb(18,53,50)"
              }}>www.flarize.com</span></div><div style={{
              position: "relative",
              display: "flex",
              flexDirection: "row",
              gap: 11,
              alignItems: "center",
              flexWrap: "nowrap",
              flexShrink: 0,
              alignSelf: "stretch"
            }}><svg width={19} height={15} viewBox="0 0 19 15" fill="none" style={{
                position: "relative",
                width: 19,
                height: 15,
                flexShrink: 0,
                color: "rgb(18,53,50)"
              }}><path d="M 18.321 0 L 0.679 0 C 0.303 0 0 0.305 0 0.682 L 0 14.318 C 0 14.695 0.303 15 0.679 15 L 18.321 15 C 18.697 15 19 14.695 19 14.318 L 19 0.682 C 19 0.305 18.697 0 18.321 0 Z M 17.473 2.361 L 17.473 13.466 L 1.527 13.466 L 1.527 2.361 L 0.942 1.903 L 1.775 0.827 L 2.682 1.536 L 16.32 1.536 L 17.227 0.827 L 18.061 1.903 L 17.473 2.361 Z M 16.32 1.534 L 9.5 6.861 L 2.68 1.534 L 1.773 0.825 L 0.939 1.901 L 1.525 2.359 L 8.768 8.018 C 8.977 8.18 9.233 8.269 9.497 8.269 C 9.761 8.269 10.017 8.18 10.225 8.018 L 17.473 2.361 L 18.058 1.903 L 17.225 0.827 L 16.32 1.534 Z" fill="currentColor" fillRule="nonzero" /></svg><span style={{
                position: "relative",
                fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                fontWeight: 500,
                fontSize: 18,
                whiteSpace: "nowrap",
                lineHeight: 1.399999976158142,
                color: "rgb(18,53,50)",
                flexShrink: 0
              }}>sales@flarize.com</span></div><div style={{
              position: "relative",
              display: "flex",
              flexDirection: "row",
              gap: 11,
              alignItems: "center",
              flexWrap: "nowrap",
              flexShrink: 0,
              alignSelf: "stretch"
            }}><svg width={17} height={18} viewBox="0 0 17 18" fill="none" style={{
                position: "relative",
                width: 17,
                height: 18,
                flexShrink: 0,
                color: "rgb(18,53,50)"
              }}><path d="M 15.039 18 L 14.928 18 C 2.085 17.218 0.261 5.739 0.006 2.236 C -0.014 1.964 0.016 1.69 0.096 1.43 C 0.175 1.17 0.303 0.929 0.47 0.722 C 0.638 0.514 0.842 0.343 1.072 0.219 C 1.302 0.096 1.553 0.021 1.81 0 L 5.412 0 C 5.673 0 5.929 0.083 6.146 0.238 C 6.363 0.394 6.53 0.615 6.627 0.872 L 7.621 3.462 C 7.716 3.713 7.74 3.989 7.689 4.255 C 7.638 4.521 7.514 4.765 7.333 4.957 L 5.941 6.445 C 6.158 7.754 6.75 8.961 7.636 9.902 C 8.522 10.843 9.66 11.473 10.895 11.707 L 12.314 10.218 C 12.498 10.029 12.73 9.901 12.982 9.85 C 13.235 9.8 13.495 9.829 13.732 9.935 L 16.196 10.98 C 16.436 11.086 16.64 11.265 16.783 11.494 C 16.926 11.723 17.002 11.993 17 12.268 L 17 15.923 C 17 16.474 16.793 17.002 16.426 17.392 C 16.058 17.781 15.559 18 15.039 18 Z M 1.967 1.385 C 1.794 1.385 1.627 1.458 1.505 1.587 C 1.382 1.717 1.313 1.893 1.313 2.077 L 1.313 2.132 C 1.614 6.231 3.542 15.923 15 16.615 C 15.086 16.621 15.172 16.609 15.253 16.579 C 15.335 16.549 15.41 16.503 15.474 16.442 C 15.538 16.382 15.591 16.309 15.628 16.227 C 15.666 16.145 15.688 16.056 15.693 15.965 L 15.693 12.268 L 13.229 11.222 L 11.353 13.195 L 11.039 13.154 C 5.353 12.399 4.581 6.376 4.581 6.314 L 4.542 5.982 L 6.398 3.995 L 5.418 1.385 L 1.967 1.385 Z" fill="currentColor" fillRule="nonzero" /></svg><span style={{
                position: "relative",
                fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                fontWeight: 500,
                fontSize: 18,
                whiteSpace: "nowrap",
                lineHeight: 1.399999976158142,
                color: "rgb(18,53,50)",
                flexShrink: 0
              }}>+91 9995 073 579</span></div></div></div></div></div></div>;
}
