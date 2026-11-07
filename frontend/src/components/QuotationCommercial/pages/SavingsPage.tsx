// Page 5 — savings, booking details and required documents.
import type { ReactNode } from "react";
import { ArrowRight, Banknote, CircleCheck, CircleX, Hourglass, LineChart, PiggyBank, ShieldCheck, Sun, TrendingDown, Zap } from "lucide-react";

import SavingsChart from "@/components/QuotationV2/SavingsChart";
import { ShortStructureCost, ShortSystemSummary } from "@/components/QuotationV2/ShortSystemBlocks";
import { CommercialPage, CREAM, GREY, INK, ORANGE, PageTitle, PAGE_MARGIN, text } from "../shared";
import type { CommercialPageProps } from "./types";

const RED = "rgb(220,38,38)";
const SOLAR_GREEN = "rgb(22,163,74)";

function Fact({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <span style={{ display: "flex", width: 24, flexShrink: 0, color: GREY }}>{icon}</span>
      <span style={text(25, 400, GREY, { lineHeight: "32px" })}>{children}</span>
    </div>
  );
}

function BankLine({ label, value }: { label: string; value: string }) {
  return (
    <div style={text(27, 500, INK, { lineHeight: "38px" })}>
      {label}
      <span style={{ color: ORANGE }}>{value}</span>
    </div>
  );
}

export default function SavingsPage({ data, copy, language }: CommercialPageProps) {
  const c = copy.savings;
  const icon = { size: 24, strokeWidth: 2 };
  const half = 4;

  return (
    <CommercialPage>
      {data.short ? (
        <ShortSystemSummary system={data.short} emiYears={data.emiYears} language={language} />
      ) : (
        <>
          <PageTitle>{c.title}</PageTitle>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: `16px ${PAGE_MARGIN}px 0`,
              flexShrink: 0,
            }}
          >
            {/* The chart positions itself absolutely, as on the residential page. */}
            <div
              style={{
                position: "relative",
                width: 612,
                height: 400,
                flexShrink: 0,
              }}
            >
              <SavingsChart chart={data.chart} />
            </div>
            <div
              style={{
                width: 612,
                display: "flex",
                flexDirection: "column",
                gap: 22,
              }}
            >
              <div
                style={{
                  backgroundColor: "rgb(254,243,232)",
                  borderRadius: 12,
                  padding: "20px 24px",
                }}
              >
                <div style={text(26, 600, INK, { lineHeight: "34px" })}>{c.reduction}</div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 36,
                    marginTop: 8,
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={text(23, 400, GREY, { lineHeight: "30px" })}>{c.currentBill}</span>
                    <span style={text(28, 700, INK, { lineHeight: "36px" })}>{data.monthlyBillValue}</span>
                  </div>
                  <ArrowRight size={26} color={GREY} />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={text(23, 400, GREY, { lineHeight: "30px" })}>{c.withSolar}</span>
                    <span style={text(28, 700, INK, { lineHeight: "36px" })}>{data.withSolarBill}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 13 }}>
                <div
                  style={{
                    flex: 1,
                    backgroundColor: "var(--primary)",
                    borderRadius: 6,
                    padding: "14px 20px",
                  }}
                >
                  <div
                    style={text(21, 400, "rgb(26,26,26)", {
                      lineHeight: "28px",
                    })}
                  >
                    {c.monthlySavings}
                  </div>
                  <div
                    style={text(25, 700, "rgb(26,26,26)", {
                      lineHeight: "32px",
                      whiteSpace: "nowrap",
                    })}
                  >
                    {data.monthlySavingsRange}
                  </div>
                </div>
                <div
                  style={{
                    flex: 1,
                    backgroundColor: "var(--sec)",
                    borderRadius: 6,
                    padding: "14px 20px",
                  }}
                >
                  <div
                    style={text(21, 400, "rgb(255,255,255)", {
                      lineHeight: "28px",
                    })}
                  >
                    {c.netSavings}
                  </div>
                  <div
                    style={text(25, 700, "rgb(255,255,255)", {
                      lineHeight: "32px",
                      whiteSpace: "nowrap",
                    })}
                  >
                    {data.netSavings25}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: `40px ${PAGE_MARGIN}px 0`,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 592,
                boxSizing: "border-box",
                backgroundColor: "rgb(254,242,242)",
                border: "2px solid rgb(254,202,202)",
                borderRadius: 16,
                padding: "24px 32px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <CircleX size={24} color="white" fill={RED} />
                <span style={text(24, 600, RED)}>{c.withoutCard}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <TrendingDown size={36} color={RED} />
                <span style={text(36, 700, RED, { whiteSpace: "nowrap" })}>{data.monthlyBillValue}</span>
                <span style={text(25, 500, RED)}>{c.monthlyBill}</span>
              </div>
              <Fact icon={<Banknote {...icon} />}>
                <span style={{ color: RED }}>{data.paidToKsebLakh}</span>
                {c.paidAfter}
              </Fact>
              <Fact icon={<LineChart {...icon} />}>
                {c.billIncrease}
                <span style={{ color: RED }}>{c.billIncreaseAccent}</span>
              </Fact>
              <Fact icon={<Hourglass {...icon} />}>{c.noOwnership}</Fact>
            </div>

            <ArrowRight size={44} color={INK} strokeWidth={3} style={{ flexShrink: 0 }} />

            <div
              style={{
                width: 592,
                boxSizing: "border-box",
                background: "linear-gradient(135deg, rgb(240,253,244), rgb(209,250,229))",
                border: `2px solid ${SOLAR_GREEN}`,
                borderRadius: 16,
                boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                padding: "24px 32px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <CircleCheck size={24} color="white" fill={SOLAR_GREEN} />
                <span style={text(24, 600, SOLAR_GREEN)}>{c.withCard}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Zap size={36} color={SOLAR_GREEN} fill={SOLAR_GREEN} />
                <span
                  style={text(32, 700, "rgb(0,129,48)", {
                    whiteSpace: "nowrap",
                  })}
                >
                  {data.withSolarBill}
                </span>
              </div>
              <Fact icon={<PiggyBank {...icon} />}>
                <span style={{ color: SOLAR_GREEN }}>{data.savedLakh}</span>
                {c.savedAfter}
              </Fact>
              <Fact icon={<ShieldCheck {...icon} />}>
                {c.protectedFrom}
                <span style={{ color: SOLAR_GREEN }}>{c.protectedAccent}</span>
              </Fact>
              <Fact icon={<Sun {...icon} />}>
                {c.ownPower}
                <span style={{ color: SOLAR_GREEN }}>{c.ownPowerAccent}</span>
              </Fact>
            </div>
          </div>
        </>
      )}

      <div style={{ padding: `36px ${PAGE_MARGIN}px 0`, flexShrink: 0 }}>
        <div style={text(36, 700, INK, { lineHeight: "46px" })}>{c.bookNow}</div>
        <div style={{ display: "flex", gap: 24, marginTop: 14 }}>
          <div
            style={{
              width: 256,
              boxSizing: "border-box",
              border: "1px solid rgb(229,231,235)",
              borderRadius: 24,
              padding: "12px 8px 8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <div className="fig-asset-0701f7494693611f-5d8c127c" style={{ width: 226, height: 262 }} />
            <span
              style={text(26, 500, "rgb(26,26,26)", {
                lineHeight: "32px",
                whiteSpace: "nowrap",
              })}
            >
              {c.upiId}
              <span style={{ color: ORANGE, fontWeight: 600 }}>flarize@upi</span>
            </span>
          </div>
          <div
            style={{
              flexGrow: 1,
              border: "1px solid rgb(229,231,235)",
              borderRadius: 24,
              padding: "20px 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={text(23, 400, INK, {
                lineHeight: "32px",
                marginBottom: 8,
              })}
            >
              {c.bankTransfer}
            </div>
            <BankLine label={c.bank} value="Union Bank of India" />
            <BankLine label={c.accountName} value="Golden Ray Renewable Energy LLP" />
            <BankLine label={c.accountNo} value="510 101 0069 819 30" />
            <BankLine label={c.ifsc} value="UBIN 0901 725" />
            <BankLine label={c.branch} value="Alappuzha" />
            <div style={text(22, 500, INK, { lineHeight: "30px", marginTop: 8 })}>{c.upiRef}</div>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "auto",
          backgroundColor: CREAM,
          padding: `22px ${PAGE_MARGIN}px 26px`,
          flexShrink: 0,
        }}
      >
        <div style={text(34, 700, INK, { lineHeight: "44px" })}>{c.documentsTitle}</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: 60,
            marginTop: 8,
          }}
        >
          {[c.documents.slice(0, half), c.documents.slice(half)].map((column, i) => (
            <ol key={i} start={i === 0 ? 1 : half + 1} style={{ margin: 0, paddingLeft: 42, listStyle: "decimal" }}>
              {column.map((document) => (
                <li
                  key={document}
                  style={text(28, 400, INK, {
                    lineHeight: "32px",
                    padding: "6px 0",
                  })}
                >
                  {document}
                </li>
              ))}
            </ol>
          ))}
        </div>
      </div>
      {data.short && (
        <div style={{ padding: "26px 0", flexShrink: 0 }}>
          <ShortStructureCost language={language} />
        </div>
      )}
    </CommercialPage>
  );
}
