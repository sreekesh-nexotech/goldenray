// Page 2 — why Flarize, commercial projects, hand-picked components.
/* eslint-disable @next/next/no-img-element -- printed by Chrome, next/image's optimisation buys nothing */
import { Award, BadgeCheck, MapPin, ShieldCheck, UserCog } from "lucide-react";

import BadgeStrip from "../BadgeStrip";
import { CommercialPage, FONT, INK, ORANGE, text } from "../shared";
import type { CommercialPageProps } from "./types";

const ICONS = [ShieldCheck, BadgeCheck, UserCog, MapPin, Award];

/** In the order the design lays the photos out. */
const PROJECT_PHOTOS = [
  "Project Card 1.png",
  "Project Card 2.png",
  "Solar installation project.png",
  "Project Card 2-1.png",
  "Project Card 3.png",
  "Project Card 3-1.png",
  "Project Card 5.png",
  "Project Card 5-1.png",
];

export default function WhyPage({ copy }: CommercialPageProps) {
  const c = copy.why;
  return (
    <CommercialPage>
      <div style={{ padding: "0 80px", flexShrink: 0 }}>
        <div style={text(42, 700, "rgb(0,0,0)", { lineHeight: "54px" })}>
          {c.title}
          <span style={{ color: ORANGE }}>{c.titleAccent}</span>
        </div>
        <p style={text(30, 400, "rgb(26,26,26)", { lineHeight: "35px", margin: "22px 0 0" })}>{c.intro}</p>
        <div style={{ borderLeft: `3px solid ${ORANGE}`, borderRadius: 2, padding: "2px 0 2px 22px", marginTop: 40 }}>
          <p style={text(30, 400, "rgb(26,26,26)", { lineHeight: "34px", margin: 0 })}>
            <span style={{ fontWeight: 700 }}>{c.promiseLead}</span>
            {c.promise}
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 260px)", gap: 15, padding: "62px 40px 0", flexShrink: 0 }}>
        {c.cards.map((card, i) => {
          const Icon = ICONS[i];
          return (
            <div
              key={card.main}
              style={{
                height: 150,
                boxSizing: "border-box",
                border: "2px solid rgb(251,207,160)",
                borderRadius: 14,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                padding: "0 6px",
                textAlign: "center",
              }}
            >
              <Icon size={32} color={INK} strokeWidth={2} />
              <span style={text(24, 500, ORANGE, { lineHeight: "32px" })}>{card.main}</span>
              <span style={text(21, 400, "rgb(68,68,68)", { lineHeight: "24px", letterSpacing: "0.3px" })}>{card.sub}</span>
            </div>
          );
        })}
      </div>

      <div style={{ backgroundColor: "rgb(243,244,246)", padding: "44px 65px 48px", marginTop: 66, flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "rgb(0,0,0)", lineHeight: 1.25 }}>{c.projects}</span>
          {c.projectsNote && (
            <span style={text(20, 600, INK, { lineHeight: "22px", textAlign: "right", maxWidth: 300 })}>{c.projectsNote}</span>
          )}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 300px)", gap: 26, marginTop: 44 }}>
          {PROJECT_PHOTOS.map((photo) => (
            <img
              key={photo}
              src={`/commercial/icon_photos/${encodeURIComponent(photo)}`}
              alt="Flarize commercial solar installation"
              style={{ display: "block", width: 300, height: 286, objectFit: "cover", borderRadius: 8 }}
            />
          ))}
        </div>
      </div>

      <div style={{ padding: "60px 40px 0", flexShrink: 0 }}>
        <div
          style={text(28, 600, "var(--green-3)", {
            textAlign: "center",
            lineHeight: 1.13,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 28,
          })}
        >
          {c.handPicked}
        </div>
        <BadgeStrip />
      </div>
    </CommercialPage>
  );
}
