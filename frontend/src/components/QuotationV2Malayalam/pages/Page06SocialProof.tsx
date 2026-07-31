/* eslint-disable @next/next/no-img-element -- fixed-pixel print artwork; a plain
   <img> keeps the QR crisp in the PDF and avoids next/image's wrapper. */
// Page 6 of the Flarize quotation document (Malayalam) — Homeowners Around You Have Already Switched — testimonials
import type { CSSProperties } from "react";
import FooterLocationPin from "../icons/FooterLocationPin";
import type { QuotationV2Data } from "../quotationV2MalayalamData";
import LetsIconsArrowLeft from "../icons/LetsIconsArrowLeft";
import MingcuteLocation2Fill from "../icons/MingcuteLocation2Fill";

interface Page06SocialProofProps {
  className?: string;
  style?: CSSProperties;
  /** Derived quotation values for this customer. */
  data: QuotationV2Data;
}

export default function Page06SocialProof({ className, style, data }: Page06SocialProofProps) {
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
          }}> by Golden Ray</span></div></div><div style={{
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
          backgroundColor: "rgba(0,0,0,0)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: "0px 80px 0px 80px",
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
            lineHeight: "60px",
            letterSpacing: "-0.500px",
            color: "var(--2-2)",
            flexShrink: 0,
            alignSelf: "stretch",
            whiteSpace: "pre-wrap"
          }}>നിങ്ങളുടെ അയൽവാസികൾ ഇതിനകം <span style={{
              color: "rgb(248,138,34)"
            }}>Solar-ലേക്ക് മാറി. നിങ്ങളോ?</span></span><span style={{
            position: "relative",
            width: 616,
            fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 500,
            fontSize: 24,
            textAlign: "center",
            lineHeight: "32px",
            letterSpacing: "-0.500px",
            color: "var(--grey)",
            flexShrink: 0
          }}>നിങ്ങൾ ഇപ്പോഴും എല്ലാ മാസവും മുഴുവൻ KSEB ബിൽ അടയ്ക്കുമ്പോൾ...</span></div><div style={{
          position: "relative",
          width: 1322,
          overflow: "hidden",
          borderRadius: 28,
          backgroundColor: "rgba(22,163,74,0.1)",
          border: "1px solid rgb(217,219,233)", boxShadow: "0px 0.500px 1px 0px rgba(25,33,61,0.04)",
          display: "flex",
          flexDirection: "row",
          gap: 24,
          padding: "16px 80px 16px 80px",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          boxSizing: "border-box",
          flexShrink: 0
        }}><MingcuteLocation2Fill style={{
            position: "relative",
            width: 88,
            height: 88,
            flexShrink: 0,
            color: "rgb(21,128,61)"
          }} /><div style={{
            position: "relative",
            width: 1118,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            alignItems: "flex-start",
            flexWrap: "nowrap",
            flexShrink: 0
          }}><span style={{
              position: "relative",
              fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 700,
              fontSize: 28,
              lineHeight: 1.5,
              color: "rgb(21,128,61)",
              flexShrink: 0,
              alignSelf: "stretch",
              whiteSpace: "pre-wrap"
            }}><span style={{
                fontSize: 28
              }}>{data.stats.district} ({data.pincode}) പ്രദേശത്തെ {data.stats.homes} വീടുകൾ ഇതിനകം Flarize Solar ഉപയോഗിക്കുന്നു.</span><span style={{
                fontSize: 28
              }}> {data.stats.year}-ൽ മാത്രം {data.stats.district} ജില്ലയിൽ {data.stats.installations} ഇൻസ്റ്റലേഷനുകൾ പൂർത്തിയാക്കി.</span></span></div></div><div style={{
          position: "relative",
          backgroundColor: "rgb(255,255,255)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "20px 80px 20px 80px",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch"
        }}><div style={{
            position: "relative",
            backgroundColor: "rgba(0,0,0,0)",
            display: "flex",
            flexDirection: "column",
            gap: 44,
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "nowrap",
            flexShrink: 0
          }}><div style={{
              position: "relative",
              width: 1298,
              height: 1057,
              overflow: "hidden",
              flexShrink: 0
            }}><div style={{
                position: "absolute",
                left: 0,
                top: 3.589,
                width: 414,
                overflow: "hidden",
                borderRadius: 12,
                backgroundColor: "rgb(255,255,255)",
                border: "1px solid rgba(68,68,68,0.32)",
                display: "flex",
                flexDirection: "column",
                gap: 24,
                padding: "10px 10px 10px 10px",
                alignItems: "flex-start",
                flexWrap: "nowrap",
                boxSizing: "border-box"
              }}><div style={{
                  position: "relative",
                  height: 333.229,
                  flexShrink: 0,
                  alignSelf: "stretch"
                }}><div className="fig-asset-a633cb1664c8569f-76d774a5" style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: 394,
                    height: 333.229,
                    borderRadius: 8
                  }} /><div style={{
                    position: "absolute",
                    left: 14,
                    top: 263,
                    width: 367,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    flexWrap: "nowrap"
                  }}><span style={{
                      position: "relative",
                      fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                      fontWeight: 700,
                      fontSize: 20,
                      textAlign: "center",
                      lineHeight: "28px",
                      color: "rgb(255,255,255)",
                      flexShrink: 0,
                      alignSelf: "stretch",
                      filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.25))"
                    }}>Jose V P - Vadakkal, Alappuzha</span><span style={{
                      position: "relative",
                      fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                      fontWeight: 400,
                      fontSize: 20,
                      lineHeight: "30px",
                      color: "rgb(255,255,255)",
                      flexShrink: 0,
                      alignSelf: "stretch",
                      filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.25))"
                    }}>5 kW System | Installed on ജൂൺ 2025</span></div></div><div style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 8,
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                  padding: "0px 10px 0px 10px",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "nowrap",
                  boxSizing: "border-box",
                  flexShrink: 0,
                  alignSelf: "stretch"
                }}><span style={{
                    position: "relative",
                    fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                    fontWeight: 400,
                    fontSize: 24,
                    lineHeight: "36px",
                    color: "var(--2)",
                    flexGrow: 1
                  }}>&quot;&quot;തുടക്കം മുതൽ അവസാനം വരെ മുഴുവൻ പ്രക്രിയയും വളരെ സുഗമമായിരുന്നു. ഞങ്ങളുടെ ആവശ്യങ്ങൾ മനസ്സിലാക്കി ശരിയായ സിസ്റ്റം നിർദേശിക്കുകയും എല്ലാ കാര്യങ്ങളും സമയബന്ധിതമായി പൂർത്തിയാക്കുകയും ചെയ്തു. ടീമിന്റെ സമീപനവും സേവനവും വളരെ മികച്ചതായിരുന്നു.&quot;.&quot;</span></div><div style={{
                  position: "relative",
                  backgroundColor: "rgba(0,0,0,0)",
                  borderTop: "1px solid rgb(229,231,235)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                  padding: "32px 0px 32px 0px",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  flexWrap: "nowrap",
                  boxSizing: "border-box",
                  flexShrink: 0,
                  alignSelf: "stretch"
                }}><div style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "center",
                    flexWrap: "nowrap",
                    flexShrink: 0
                  }}><div style={{
                      position: "relative",
                      borderRadius: 6,
                      backgroundColor: "rgba(220,38,38,0.1)",
                      display: "flex",
                      flexDirection: "row",
                      gap: 10,
                      padding: "8px 9px 8px 9px",
                      justifyContent: "center",
                      alignItems: "center",
                      flexWrap: "nowrap",
                      boxSizing: "border-box",
                      flexShrink: 0
                    }}><span style={{
                        position: "relative",
                        fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                        fontWeight: 600,
                        fontSize: 29,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        lineHeight: "32px",
                        letterSpacing: "-0.500px",
                        color: "rgb(220,38,38)",
                        flexShrink: 0
                      }}>₹3,200</span></div><LetsIconsArrowLeft style={{
                      position: "relative",
                      width: 24,
                      height: 24,
                      transform: "matrix(-1,0,0,1,0,0)",
                      flexShrink: 0
                    }} /><div style={{
                      position: "relative",
                      borderRadius: 6,
                      backgroundColor: "rgba(5,150,105,0.1)",
                      display: "flex",
                      flexDirection: "row",
                      gap: 10,
                      padding: "8px 9px 8px 9px",
                      justifyContent: "center",
                      alignItems: "center",
                      flexWrap: "nowrap",
                      boxSizing: "border-box",
                      flexShrink: 0
                    }}><span style={{
                        position: "relative",
                        fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                        fontWeight: 600,
                        fontSize: 29,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        lineHeight: "32px",
                        letterSpacing: "-0.500px",
                        color: "rgb(15,118,110)",
                        flexShrink: 0
                      }}>₹200</span></div></div><div style={{
                    position: "relative",
                    borderRadius: 6,
                    display: "flex",
                    flexDirection: "row",
                    gap: 10,
                    padding: "8px 9px 8px 9px",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    boxSizing: "border-box",
                    flexShrink: 0
                  }}><span style={{
                      position: "relative",
                      fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                      fontWeight: 600,
                      fontSize: 25,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      lineHeight: "28px",
                      letterSpacing: "-0.500px",
                      color: "var(--green-2)",
                      flexShrink: 0
                    }}>പ്രതിമാസ ലാഭം ₹2,900</span></div></div></div><div style={{
                position: "absolute",
                left: 442,
                top: 3.089,
                width: 414,
                overflow: "hidden",
                borderRadius: 12,
                backgroundColor: "rgb(255,255,255)",
                border: "1px solid rgba(68,68,68,0.32)",
                display: "flex",
                flexDirection: "column",
                gap: 24,
                padding: "10px 10px 10px 10px",
                alignItems: "flex-start",
                flexWrap: "nowrap",
                boxSizing: "border-box"
              }}><div style={{
                  position: "relative",
                  height: 333.229,
                  flexShrink: 0,
                  alignSelf: "stretch"
                }}><div className="fig-asset-a633cb1664c8569f-76d774a5" style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: 394,
                    height: 333.229,
                    borderRadius: 8
                  }} /><span style={{
                    position: "absolute",
                    left: 30.5,
                    top: 263,
                    width: 314,
                    height: 28,
                    fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                    fontWeight: 700,
                    fontSize: 20,
                    whiteSpace: "nowrap",
                    lineHeight: "28px",
                    color: "rgb(255,255,255)",
                    filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.25))"
                  }}>Siraj K P - Cherthala, Alappuzha</span><span style={{
                    position: "absolute",
                    left: 10,
                    top: 291,
                    width: 374,
                    height: 30,
                    fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                    fontWeight: 400,
                    fontSize: 20,
                    whiteSpace: "nowrap",
                    lineHeight: "30px",
                    color: "rgb(255,255,255)",
                    filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.25))"
                  }}>5 kW System | Installed on മാർച്ച് 2025</span></div><div style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 8,
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                  padding: "0px 10px 0px 10px",
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
                    lineHeight: "36px",
                    color: "var(--2)",
                    flexGrow: 1
                  }}>&quot;സോളാർ സ്ഥാപിച്ചതോടെ ഞങ്ങളുടെ വൈദ്യുതി ചെലവുകൾ കൂടുതൽ നിയന്ത്രണവിധേയമായി. എല്ലാ ഘട്ടങ്ങളിലും വ്യക്തമായ വിവരങ്ങൾ ലഭിച്ചു. KSEB നടപടികളും സാങ്കേതിക കാര്യങ്ങളും ടീം വളരെ പ്രൊഫഷണലായി കൈകാര്യം ചെയ്തു.&quot;</span></div><div style={{
                  position: "relative",
                  backgroundColor: "rgba(0,0,0,0)",
                  borderTop: "1px solid rgb(229,231,235)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                  padding: "32px 0px 32px 0px",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  flexWrap: "nowrap",
                  boxSizing: "border-box",
                  flexShrink: 0,
                  alignSelf: "stretch"
                }}><div style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "center",
                    flexWrap: "nowrap",
                    flexShrink: 0
                  }}><div style={{
                      position: "relative",
                      borderRadius: 6,
                      backgroundColor: "rgba(220,38,38,0.1)",
                      display: "flex",
                      flexDirection: "row",
                      gap: 10,
                      padding: "8px 9px 8px 9px",
                      justifyContent: "center",
                      alignItems: "center",
                      flexWrap: "nowrap",
                      boxSizing: "border-box",
                      flexShrink: 0
                    }}><span style={{
                        position: "relative",
                        fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                        fontWeight: 600,
                        fontSize: 29,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        lineHeight: "32px",
                        letterSpacing: "-0.500px",
                        color: "rgb(220,38,38)",
                        flexShrink: 0
                      }}>₹3,200</span></div><LetsIconsArrowLeft style={{
                      position: "relative",
                      width: 24,
                      height: 24,
                      transform: "matrix(-1,0,0,1,0,0)",
                      flexShrink: 0
                    }} /><div style={{
                      position: "relative",
                      borderRadius: 6,
                      backgroundColor: "rgba(5,150,105,0.1)",
                      display: "flex",
                      flexDirection: "row",
                      gap: 10,
                      padding: "8px 9px 8px 9px",
                      justifyContent: "center",
                      alignItems: "center",
                      flexWrap: "nowrap",
                      boxSizing: "border-box",
                      flexShrink: 0
                    }}><span style={{
                        position: "relative",
                        fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                        fontWeight: 600,
                        fontSize: 29,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        lineHeight: "32px",
                        letterSpacing: "-0.500px",
                        color: "rgb(15,118,110)",
                        flexShrink: 0
                      }}>₹200</span></div></div><div style={{
                    position: "relative",
                    borderRadius: 6,
                    display: "flex",
                    flexDirection: "row",
                    gap: 10,
                    padding: "8px 9px 8px 9px",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    boxSizing: "border-box",
                    flexShrink: 0
                  }}><span style={{
                      position: "relative",
                      fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                      fontWeight: 600,
                      fontSize: 25,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      lineHeight: "28px",
                      letterSpacing: "-0.500px",
                      color: "var(--green-2)",
                      flexShrink: 0
                    }}>പ്രതിമാസ ലാഭം ₹2,900</span></div></div></div><div style={{
                position: "absolute",
                left: 884,
                top: 0,
                width: 414,
                height: 1057,
                overflow: "hidden",
                borderRadius: 12,
                backgroundColor: "rgb(255,255,255)",
                border: "1px solid rgba(68,68,68,0.32)",
                display: "flex",
                flexDirection: "column",
                gap: 24,
                padding: "10px 10px 10px 10px",
                alignItems: "flex-start",
                flexWrap: "nowrap",
                boxSizing: "border-box"
              }}><div style={{
                  position: "relative",
                  height: 333.229,
                  flexShrink: 0,
                  alignSelf: "stretch"
                }}><div className="fig-asset-a633cb1664c8569f-76d774a5" style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: 394,
                    height: 333.229,
                    borderRadius: 8
                  }} /><span style={{
                    position: "absolute",
                    left: 24,
                    top: 262.716,
                    width: 347,
                    height: 28,
                    fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                    fontWeight: 700,
                    fontSize: 20,
                    lineHeight: "28px",
                    color: "rgb(255,255,255)",
                    filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.25))"
                  }}>Stephen V C - Vattayal, Alappuzha</span><span style={{
                    position: "absolute",
                    left: 17,
                    top: 291,
                    width: 360,
                    height: 30,
                    fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                    fontWeight: 400,
                    fontSize: 20,
                    whiteSpace: "nowrap",
                    lineHeight: "30px",
                    color: "rgb(255,255,255)",
                    filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.25))"
                  }}>5 kW System | Installed on മേയ് 2024</span></div><div style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 8,
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                  padding: "0px 10px 0px 10px",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  flexWrap: "nowrap",
                  boxSizing: "border-box",
                  flexGrow: 1,
                  alignSelf: "stretch"
                }}><span style={{
                    position: "relative",
                    fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                    fontWeight: 400,
                    fontSize: 24,
                    lineHeight: "36px",
                    color: "var(--2)",
                    flexGrow: 1
                  }}>&quot;വിൽപ്പനയ്ക്കായി അധിക വാഗ്ദാനങ്ങൾ നൽകാതെ, ഞങ്ങൾക്ക് യഥാർത്ഥത്തിൽ അനുയോജ്യമായ സിസ്റ്റം നിർദേശിച്ചതാണ് ഏറ്റവും ഇഷ്ടപ്പെട്ടത്. പ്ലാനിംഗ് മുതൽ ഇൻസ്റ്റലേഷൻ വരെ മുഴുവൻ പ്രക്രിയയും സുതാര്യവും വിശ്വസ്തതയുള്ളതുമായിരുന്നു.&quot;</span></div><div style={{
                  position: "relative",
                  backgroundColor: "rgba(0,0,0,0)",
                  borderTop: "1px solid rgb(229,231,235)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                  padding: "32px 0px 32px 0px",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  flexWrap: "nowrap",
                  boxSizing: "border-box",
                  flexShrink: 0,
                  alignSelf: "stretch"
                }}><div style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "center",
                    flexWrap: "nowrap",
                    flexShrink: 0
                  }}><div style={{
                      position: "relative",
                      borderRadius: 6,
                      backgroundColor: "rgba(220,38,38,0.1)",
                      display: "flex",
                      flexDirection: "row",
                      gap: 10,
                      padding: "8px 9px 8px 9px",
                      justifyContent: "center",
                      alignItems: "center",
                      flexWrap: "nowrap",
                      boxSizing: "border-box",
                      flexShrink: 0
                    }}><span style={{
                        position: "relative",
                        fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                        fontWeight: 600,
                        fontSize: 29,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        lineHeight: "32px",
                        letterSpacing: "-0.500px",
                        color: "rgb(220,38,38)",
                        flexShrink: 0
                      }}>₹3,200</span></div><LetsIconsArrowLeft style={{
                      position: "relative",
                      width: 24,
                      height: 24,
                      transform: "matrix(-1,0,0,1,0,0)",
                      flexShrink: 0
                    }} /><div style={{
                      position: "relative",
                      borderRadius: 6,
                      backgroundColor: "rgba(5,150,105,0.1)",
                      display: "flex",
                      flexDirection: "row",
                      gap: 10,
                      padding: "8px 9px 8px 9px",
                      justifyContent: "center",
                      alignItems: "center",
                      flexWrap: "nowrap",
                      boxSizing: "border-box",
                      flexShrink: 0
                    }}><span style={{
                        position: "relative",
                        fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                        fontWeight: 600,
                        fontSize: 29,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        lineHeight: "32px",
                        letterSpacing: "-0.500px",
                        color: "rgb(15,118,110)",
                        flexShrink: 0
                      }}>₹200</span></div></div><div style={{
                    position: "relative",
                    borderRadius: 6,
                    display: "flex",
                    flexDirection: "row",
                    gap: 10,
                    padding: "8px 9px 8px 9px",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    boxSizing: "border-box",
                    flexShrink: 0
                  }}><span style={{
                      position: "relative",
                      fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                      fontWeight: 600,
                      fontSize: 25,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      lineHeight: "28px",
                      letterSpacing: "-0.500px",
                      color: "var(--green-2)",
                      flexShrink: 0
                    }}>പ്രതിമാസ ലാഭം ₹2,900</span></div></div></div></div></div></div><div style={{
          position: "relative",
          width: 1322,
          overflow: "hidden",
          borderRadius: 28,
          backgroundColor: "var(--3)",
          border: "1px solid rgb(217,219,233)", boxShadow: "0px 0.500px 1px 0px rgba(25,33,61,0.04)",
          display: "flex",
          flexDirection: "row",
          gap: 24,
          padding: "16px 22px 16px 22px",
          alignItems: "center",
          flexWrap: "nowrap",
          boxSizing: "border-box",
          flexShrink: 0
        }}><img
            src="/quotation-v2/qr-testimonials.png"
            alt="QR code linking to Flarize customer testimonial videos"
            width={193}
            height={193}
            style={{ position: "relative", width: 193, height: 193, flexShrink: 0 }}
          /><div style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            alignItems: "flex-start",
            flexWrap: "nowrap",
            flexGrow: 1
          }}><span style={{
              position: "relative",
              fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 700,
              fontSize: 30,
              lineHeight: 1.2000000476837158,
              color: "var(--2-2)",
              flexShrink: 0,
              alignSelf: "stretch"
            }}>📹 കേരളത്തിലെ ഉപഭോക്താക്കളുടെ യഥാർത്ഥ അനുഭവങ്ങൾ കാണൂ</span><span style={{
              position: "relative",
              fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 400,
              fontSize: 24,
              lineHeight: 1.5,
              color: "var(--2-2)",
              flexShrink: 0,
              alignSelf: "stretch"
            }}>QR Code സ്കാൻ ചെയ്ത് ആലപ്പുഴ, കൊച്ചി, തൃശ്ശൂർ എന്നിവിടങ്ങളിലെ ഉപഭോക്താക്കളുടെ അനുഭവങ്ങൾ വീഡിയോയായി കാണാം. അവരുടെ വീടുകളിലെ Solar ഇൻസ്റ്റലേഷനും ലഭിച്ച ലാഭവും നേരിട്ട് അറിയുക.</span><span style={{
              position: "relative",
              fontFamily: "var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 400,
              fontSize: 24,
              lineHeight: 1.5,
              color: "var(--1-2)",
              flexShrink: 0,
              alignSelf: "stretch"
            }}>→ flarize.in/testimonials</span></div></div><div style={{
          position: "relative",
          height: 98,
          backgroundColor: "rgb(247,244,230)",
          flexShrink: 0,
          alignSelf: "stretch"
        }}><div style={{
            position: "absolute",
            left: 786,
            top: 14,
            display: "flex",
            flexDirection: "row",
            gap: 36,
            alignItems: "center",
            flexWrap: "nowrap"
          }}><div style={{
              position: "relative",
              display: "flex",
              flexDirection: "row",
              gap: 7,
              alignItems: "center",
              flexWrap: "nowrap",
              flexShrink: 0
            }} /><div style={{
              position: "relative",
              display: "flex",
              flexDirection: "row",
              gap: 7,
              alignItems: "center",
              flexWrap: "nowrap",
              flexShrink: 0
            }} /><div style={{
              position: "relative",
              display: "flex",
              flexDirection: "row",
              gap: 7,
              alignItems: "center",
              flexWrap: "nowrap",
              flexShrink: 0
            }}><div style={{
                position: "relative",
                width: 18,
                height: 18,
                overflow: "hidden",
                flexShrink: 0
              }}><FooterLocationPin /></div></div></div><div className="fig-asset-db0497502244a62d-3df8ef3e" style={{
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
