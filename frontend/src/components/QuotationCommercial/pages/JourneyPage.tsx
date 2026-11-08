// Page 6 — installation timeline, KSEB refund and the division of work.
import { CircleCheck, CircleDot } from "lucide-react";

import { CommercialPage, INK, ORANGE, RULE, text } from "../shared";
import type { CommercialPageProps } from "./types";

const SCOPE_COLUMN = {
  width: 622,
  boxSizing: "border-box",
  borderRadius: 28,
  border: RULE,
  padding: "26px 28px",
} as const;

function ScopeList({ title, items, background, marker }: {
  title: string;
  items: string[];
  background: string;
  marker: React.ReactNode;
}) {
  return (
    <div style={{ ...SCOPE_COLUMN, backgroundColor: background }}>
      <div style={text(26, 600, INK, { lineHeight: "36px" })}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 14 }}>
        {items.map((item) => (
          <div key={item} style={{ display: "flex", gap: 12 }}>
            <span style={{ display: "flex", paddingTop: 5, flexShrink: 0 }}>{marker}</span>
            <span style={text(25, 400, INK, { lineHeight: "28px" })}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function JourneyPage({ data, copy }: CommercialPageProps) {
  const c = copy.journey;
  return (
    <CommercialPage>
      <div style={text(42, 700, INK, { textAlign: "center", lineHeight: 1.25, padding: "10px 40px 0", flexShrink: 0 })}>
        <span style={{ color: ORANGE }}>{c.titleAccent}</span>
        {c.title}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", columnGap: 28, padding: "64px 80px 0", position: "relative", flexShrink: 0 }}>
        <div style={{ position: "absolute", left: 180, right: 180, top: 99, borderTop: "2px dashed rgb(160,160,160)" }} />
        {c.steps.map((step) => (
          <div key={step.days} style={{ display: "flex", flexDirection: "column", position: "relative" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  ...text(21, 700, "rgb(255,255,255)", { lineHeight: "70px", textAlign: "center" }),
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  backgroundColor: INK,
                }}
              >
                {step.days}
              </span>
              <span style={text(16, 600, INK)}>DAYS</span>
            </div>
            <div style={text(23, 600, "rgb(0,0,0)", { lineHeight: "31px", marginTop: 34 })}>{step.title}</div>
            <div style={text(23, 400, "rgb(68,68,68)", { lineHeight: "30px", marginTop: 12 })}>{step.body}</div>
          </div>
        ))}
      </div>

      <div style={{ margin: "60px 80px 0", borderLeft: `3px solid ${ORANGE}`, padding: "2px 0 2px 14px", flexShrink: 0 }}>
        <div style={text(24, 600, INK, { lineHeight: "34px" })}>{c.refundTitle}</div>
        <div style={text(23, 400, INK, { lineHeight: "36px", marginTop: 8 })}>{c.refundRule}</div>
        <div style={text(23, 600, INK, { lineHeight: "36px", marginTop: 6 })}>{c.refundExample(data.ksebRefund)}</div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, padding: "0 85px 12px", marginTop: "auto", flexShrink: 0 }}>
        <ScopeList
          title={c.weHandle}
          items={c.weHandleItems}
          background="rgb(253,242,234)"
          marker={<CircleCheck size={22} color="white" fill={ORANGE} strokeWidth={2.5} />}
        />
        <ScopeList
          title={c.youDo}
          items={c.youDoItems}
          background="rgb(232,244,238)"
          marker={<CircleDot size={22} color={ORANGE} strokeWidth={3} />}
        />
      </div>
    </CommercialPage>
  );
}
