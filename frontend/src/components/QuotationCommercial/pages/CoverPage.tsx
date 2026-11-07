// Page 1 — cover letter and proposal details.
/* eslint-disable @next/next/no-img-element -- printed by Chrome, next/image's optimisation buys nothing */
import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

import { InstallationsIcon, MnreIcon } from "../coverIcons";
import { CommercialPage, GREY, INK, ORANGE, RULE, text } from "../shared";
import type { CommercialPageProps } from "./types";

function Stat({ icon, main, sub }: { icon: ReactNode; main: string; sub: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      {icon}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={text(32, 700, ORANGE, { lineHeight: "40px", whiteSpace: "nowrap" })}>{main}</span>
        <span style={text(23, 400, GREY, { lineHeight: "30px", whiteSpace: "nowrap" })}>{sub}</span>
      </div>
    </div>
  );
}

function DetailRow({ label, value, labelWidth }: { label: string; value: string; labelWidth: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `${labelWidth}px 34px 1fr`, alignItems: "baseline" }}>
      <span style={text(23, 400, GREY, { lineHeight: "32px" })}>{label}</span>
      <span style={text(23, 500, INK, { lineHeight: "32px" })}>:</span>
      <span style={text(23, 500, INK, { lineHeight: "32px", overflowWrap: "anywhere" })}>{value}</span>
    </div>
  );
}

export default function CoverPage({ data, copy }: CommercialPageProps) {
  const c = copy.cover;
  const left: [string, string][] = [
    [c.name, data.customerName],
    [c.address, data.address],
    [c.pincode, data.pincode],
    [c.phone, data.phoneNumber],
    [c.bill, `${data.monthlyBillValue}${copy.perMonth}`],
    [c.size, data.systemSize],
  ];
  const right: [string, string][] = [
    [c.proposalBy, data.proposalBy],
    [c.quoteNo, data.quoteNo],
    [c.date, data.currentDate],
    [c.validUntil, data.validUntilDate],
    [c.gstNo, data.gstNo],
    [c.registration, data.companyRegistration],
  ];

  return (
    <CommercialPage>
      <div style={{ padding: "0 85px", flexShrink: 0 }}>
        <img
          src="/commercial/icon_photos/page1_BG.png"
          alt="Rooftop solar installation at sunset"
          style={{ display: "block", width: 1270, height: 542, objectFit: "cover", borderRadius: 12 }}
        />
      </div>
      <div style={text(46, 600, "rgb(17,24,39)", { textAlign: "center", lineHeight: 1.3, padding: "38px 60px 0", flexShrink: 0 })}>
        {c.headline}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "40px 80px 20px",
          borderBottom: RULE,
          flexShrink: 0,
        }}
      >
        <Stat
          icon={<ShieldCheck size={46} color="var(--green-3)" strokeWidth={2.2} />}
          main={data.heroStatMain}
          sub={data.heroStatSub}
        />
        <Stat icon={<InstallationsIcon />} main={c.installations.main} sub={c.installations.sub} />
        <Stat icon={<MnreIcon />} main={c.mnre.main} sub={c.mnre.sub} />
      </div>

      <div style={{ padding: "28px 80px 0", flexShrink: 0 }}>
        <div style={text(27, 700, INK, { lineHeight: "38px" })}>{c.greeting}</div>
        <div style={text(24, 400, "rgb(26,26,26)", { lineHeight: "31px" })}>{c.thanks(data.customerName)}</div>
        {c.paragraphs.map((paragraph) => (
          <p key={paragraph} style={text(24, 400, "rgb(26,26,26)", { lineHeight: "31px", margin: "30px 0 0" })}>
            {paragraph}
          </p>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 34, marginTop: 28 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={text(24, 400, "rgb(26,26,26)", { lineHeight: "34px" })}>{c.signOff}</span>
            <span style={text(24, 600, INK, { lineHeight: "34px" })}>{c.team}</span>
          </div>
          <div className="fig-asset-3505ba533a4c31a4" style={{ width: 154, height: 65, flexShrink: 0 }} />
          <div className="fig-asset-fb37b4210913ca92-fba75ad2" style={{ width: 95, height: 86, flexShrink: 0 }} />
        </div>
      </div>

      <div style={{ padding: "40px 80px 0", flexShrink: 0 }}>
        <div style={text(28, 600, "rgb(26,26,26)", { lineHeight: "36px" })}>{c.detailsTitle}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", marginTop: 18 }}>
          {[left, right].map((rows, column) => (
            <div
              key={column}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 26,
                padding: column === 0 ? "14px 24px 14px 20px" : "14px 0 14px 30px",
                borderLeft: column === 1 ? RULE : undefined,
              }}
            >
              {rows.map(([label, value]) => (
                <DetailRow key={label} label={label} value={value} labelWidth={column === 0 ? 300 : 250} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </CommercialPage>
  );
}
