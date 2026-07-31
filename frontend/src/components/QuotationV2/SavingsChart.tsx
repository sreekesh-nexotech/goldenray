import type { QuotationV2Data } from "./quotationV2Data";

/**
 * The 25-year cumulative-cost chart on the savings page.
 *
 * The Figma export left this as an empty placeholder box, so the curves are
 * drawn here from the calculator's `graphData` — the same series and the same
 * smoothing the v1 savings page uses — laid out on the 612×400 card the design
 * reserved for it.
 */

// Card and plot geometry, taken from the design frame this replaces.
const CARD_W = 612;
const CARD_H = 400;
const PLOT_LEFT = 80;
const PLOT_TOP = 60;
const PLOT_W = 400;
const PLOT_H = 266;
const Y_TICK_COUNT = 5;

const KSEB_COLOR = "rgb(220,38,38)";
const SOLAR_COLOR = "rgb(22,163,74)";
const GRID_COLOR = "rgb(229,231,235)";
const AXIS_COLOR = "rgb(68,68,68)";
const LABEL_COLOR = "rgb(107,114,128)";

const INTER =
  'var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

/** Cumulative rupees rendered as lakhs, e.g. 5_200_000 -> "52". */
function formatLakh(value: number): string {
  if (value === 0) return "0";
  const inLakhs = value / 100000;
  return inLakhs >= 1 ? `${Math.round(inLakhs)}` : inLakhs.toFixed(1);
}

/**
 * Smooth cubic bezier through the data points — the same tension the v1 chart
 * uses, so both documents draw the same curve.
 */
function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const tension = 0.35;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}

export default function SavingsChart({
  chart,
}: {
  chart: QuotationV2Data["chart"];
}) {
  const { labels, withoutSolar, withSolar } = chart;
  const pointCount = Math.max(withoutSolar.length, withSolar.length);

  // Round the axis up to a whole power-of-ten step so the top gridline is a
  // readable number rather than the raw maximum.
  const rawMax = Math.max(1, ...withoutSolar, ...withSolar);
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax)));
  const niceMax = Math.ceil(rawMax / magnitude) * magnitude;

  const toPoint = (index: number, value: number) => ({
    x: PLOT_LEFT + (pointCount > 1 ? index / (pointCount - 1) : 0) * PLOT_W,
    y: PLOT_TOP + PLOT_H - (value / niceMax) * PLOT_H,
  });

  const yTicks = Array.from(
    { length: Y_TICK_COUNT + 1 },
    (_, i) => (i * niceMax) / Y_TICK_COUNT,
  );

  const ksebPath = smoothPath(withoutSolar.map((v, i) => toPoint(i, v)));
  const solarPath = smoothPath(withSolar.map((v, i) => toPoint(i, v)));

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 7,
        width: CARD_W,
        height: CARD_H,
        borderRadius: 12,
        backgroundColor: "rgb(249,250,251)",
        overflow: "hidden",
      }}
    >
      <svg
        width={CARD_W}
        height={CARD_H}
        viewBox={`0 0 ${CARD_W} ${CARD_H}`}
        fill="none"
      >
        <text
          x={PLOT_LEFT + PLOT_W / 2}
          y={34}
          textAnchor="middle"
          fontFamily={INTER}
          fontSize={18}
          fill="rgb(31,41,55)"
        >
          Cumulative Electricity Costs Over 25 Years
        </text>

        {/* Horizontal gridlines and the rupee (lakh) scale */}
        {yTicks.map((tick, i) => {
          const y = PLOT_TOP + PLOT_H - (tick / niceMax) * PLOT_H;
          return (
            <g key={`y-${i}`}>
              <line
                x1={PLOT_LEFT}
                y1={y}
                x2={PLOT_LEFT + PLOT_W}
                y2={y}
                stroke={GRID_COLOR}
                strokeWidth={1}
              />
              <text
                x={PLOT_LEFT - 10}
                y={y + 4}
                textAnchor="end"
                fontFamily={INTER}
                fontSize={12}
                fill={LABEL_COLOR}
              >
                {formatLakh(tick)}
              </text>
            </g>
          );
        })}

        {/* Axes */}
        <line
          x1={PLOT_LEFT}
          y1={PLOT_TOP}
          x2={PLOT_LEFT}
          y2={PLOT_TOP + PLOT_H}
          stroke={AXIS_COLOR}
          strokeWidth={1}
        />
        <line
          x1={PLOT_LEFT}
          y1={PLOT_TOP + PLOT_H}
          x2={PLOT_LEFT + PLOT_W}
          y2={PLOT_TOP + PLOT_H}
          stroke={AXIS_COLOR}
          strokeWidth={1}
        />

        {/* Year labels — every fifth year, so 26 points stay legible */}
        {labels.map((label, i) => {
          if (i % 5 !== 0 && i !== labels.length - 1) return null;
          const { x } = toPoint(i, 0);
          return (
            <text
              key={`x-${i}`}
              x={x}
              y={PLOT_TOP + PLOT_H + 22}
              textAnchor="middle"
              fontFamily={INTER}
              fontSize={12}
              fill={LABEL_COLOR}
            >
              {label}
            </text>
          );
        })}

        <path
          d={ksebPath}
          stroke={KSEB_COLOR}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={solarPath}
          stroke={SOLAR_COLOR}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Legend, in the panel the design places inside the plot area */}
        <g>
          <rect
            x={PLOT_LEFT + 8}
            y={PLOT_TOP + 6}
            width={113}
            height={49}
            rx={2}
            fill="rgba(255,255,255,0.9)"
            stroke={GRID_COLOR}
            strokeWidth={1}
          />
          <line
            x1={PLOT_LEFT + 13}
            y1={PLOT_TOP + 21}
            x2={PLOT_LEFT + 43}
            y2={PLOT_TOP + 21}
            stroke={KSEB_COLOR}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <text
            x={PLOT_LEFT + 48}
            y={PLOT_TOP + 25}
            fontFamily={INTER}
            fontSize={12}
            fill={AXIS_COLOR}
          >
            KSEB Costs
          </text>
          <line
            x1={PLOT_LEFT + 13}
            y1={PLOT_TOP + 40}
            x2={PLOT_LEFT + 43}
            y2={PLOT_TOP + 40}
            stroke={SOLAR_COLOR}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <text
            x={PLOT_LEFT + 48}
            y={PLOT_TOP + 44}
            fontFamily={INTER}
            fontSize={12}
            fill={AXIS_COLOR}
          >
            Solar + Bills
          </text>
        </g>
      </svg>
    </div>
  );
}
