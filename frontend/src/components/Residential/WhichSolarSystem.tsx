import Image from "next/image";
import { CircleAlert, CircleCheck, CircleX, Info } from "lucide-react";

// Swap the sources once the system diagrams are on the CDN.
const CDN = "https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions";

type PointTone = "pro" | "con" | "note" | "info";

const toneStyles: Record<
  PointTone,
  { Icon: typeof CircleCheck; className: string }
> = {
  pro: { Icon: CircleCheck, className: "text-[#008130]" },
  con: { Icon: CircleX, className: "text-[#E13B2E]" },
  note: { Icon: CircleAlert, className: "text-[#F18627]" },
  info: { Icon: Info, className: "text-[#2F6FED]" },
};

const systems = [
  {
    title: "On-Grid System",
    tagline: "Save the Most Money",
    taglineColor: "text-[#008130]",
    image: `${CDN}/ongrid.png`,
    imageAlt: "On-grid solar system: panels, inverter and the KSEB grid",
    desc: "Your roof makes power all day. What you don't use goes to KSEB and comes off your bill. The lowest investment and the fastest payback — the smart money choice when power cuts are rare.",
    highlighted: false,
    points: [
      { tone: "pro" as PointTone, text: "Cheapest to install, quickest to pay back" },
      { tone: "pro" as PointTone, text: "Gets the full ₹78,000 subsidy" },
      {
        tone: "con" as PointTone,
        text: "Switches off during power cuts (a KSEB safety rule)",
      },
    ],
  },
  {
    title: "Hybrid System",
    tagline: "Comfort, Even When Power Goes",
    taglineColor: "text-[#074A4D]",
    image: `${CDN}/hybrid.png`,
    imageAlt: "Hybrid solar system: panels, inverter, battery and the grid",
    desc: "Solar plus a battery. You save in the daytime — and when the power goes at night, your fans, lights, Wi-Fi and fridge keep running. The family barely notices the cut.",
    highlighted: true,
    points: [
      { tone: "pro" as PointTone, text: "Essentials keep working through outages" },
      {
        tone: "pro" as PointTone,
        text: "Great for families, work-from-home, elderly parents",
      },
      {
        tone: "note" as PointTone,
        text: "Battery adds cost — worth it if cuts are common in your area",
      },
    ],
  },
  {
    title: "Off-Grid System",
    tagline: "Total Energy Independence",
    taglineColor: "text-[#757575]",
    image: `${CDN}/offgrid.png`,
    imageAlt: "Off-grid solar system: panels, inverter and battery bank",
    desc: "No KSEB connection at all — your home runs fully on solar and batteries. Built for farms and remote places where the grid doesn't reach or barely works. Most Kerala homes don't need this; a hybrid gives the comfort at a lower cost.",
    highlighted: false,
    points: [
      { tone: "pro" as PointTone, text: "Works where there is no grid power" },
      { tone: "pro" as PointTone, text: "Fully self-sufficient" },
      {
        tone: "info" as PointTone,
        text: "Biggest battery cost; no net metering benefit",
      },
    ],
  },
];

const Points = ({
  points,
}: {
  points: { tone: PointTone; text: string }[];
}) => (
  <ul className="flex flex-col gap-2.5">
    {points.map(({ tone, text }) => {
      const { Icon, className } = toneStyles[tone];
      return (
        <li key={text} className="flex items-start gap-2">
          <Icon
            className={`mt-0.5 h-4 w-4 shrink-0 ${className}`}
            strokeWidth={2}
            aria-hidden="true"
          />
          <span className="text-xs md:text-sm font-normal leading-relaxed text-[#444444]">
            {text}
          </span>
        </li>
      );
    })}
  </ul>
);

const WhichSolarSystem = () => {
  return (
    <section className="relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col items-center h-full gap-10">
      {/* Heading */}
      <div className="w-full max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532]">
          Which Solar System Is Right?
        </h2>
        <p className="mt-3 text-sm md:text-lg text-[#757575]">
          Understand the three main ways solar can power your Kerala home.
        </p>
      </div>

      {/* Cards */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
        {systems.map((system) => (
          <article
            key={system.title}
            className={`rounded-2xl bg-white p-5 md:p-6 border ${
              system.highlighted
                ? "border-[#074A4D] shadow-[0_10px_30px_rgba(18,53,50,0.08)]"
                : "border-[#B2B2B233]"
            }`}
          >
            {/* Desktop: image on top, then title, tagline, description, points */}
            <div className="hidden lg:flex lg:flex-col">
              <div className="relative w-full h-[150px]">
                <Image
                  src={system.image}
                  alt={system.imageAlt}
                  fill
                  sizes="33vw"
                  className="object-contain object-center"
                />
              </div>
              <h3 className="mt-6 text-2xl font-bold leading-snug text-[#123532]">
                {system.title}
              </h3>
              <p
                className={`mt-1 text-sm font-semibold ${system.taglineColor}`}
              >
                {system.tagline}
              </p>
              <p className="mt-4 text-base font-normal leading-relaxed text-[#444444]">
                {system.desc}
              </p>
              <div className="mt-5">
                <Points points={system.points} />
              </div>
            </div>

            {/* Mobile: title row, then points beside the image, then description */}
            <div className="flex flex-col lg:hidden">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-base font-bold leading-snug text-[#123532]">
                  {system.title}
                </h3>
                <p
                  className={`text-right text-xs font-semibold ${system.taglineColor}`}
                >
                  {system.tagline}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1">
                  <Points points={system.points} />
                </div>
                <div className="relative h-24 w-24 shrink-0">
                  <Image
                    src={system.image}
                    alt={system.imageAlt}
                    fill
                    sizes="96px"
                    className="object-contain object-center"
                  />
                </div>
              </div>

              <p className="mt-4 text-sm font-normal leading-relaxed text-[#444444]">
                {system.desc}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default WhichSolarSystem;
