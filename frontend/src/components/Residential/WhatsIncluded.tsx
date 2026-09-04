import Image from "next/image";
import { Check } from "lucide-react";

const houseImage =
  "https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/5140b1e070da6cb2624bcf62cf02b30708fca347.png";
const houseImageAlt =
  "Cutaway of a Kerala home showing panels, inverter, mounting structure and monitoring";

const items = [
  {
    step: "1",
    title: "Tier-1 N-Type Panels",
    desc: "30-Year performance warranty with 21-23% efficiency.",
    badge: "bg-[#F7BA41] text-[#272218]",
    // Callout placement over the house, as a % of the stage width (lg+ only).
    position: "left-[32.5%] top-[12.3%] w-[15%]",
  },
  {
    step: "2",
    title: "Smart Hybrid Inverter",
    desc: "Intelligent energy routing and mobile monitoring.",
    badge: "bg-[#074A4D] text-white",
    position: "left-[68.2%] top-[43.6%] w-[15%]",
  },
  {
    step: "3",
    title: "Hot-Dip GI Structure",
    desc: "Wind-rated mounts with 100% rust protection.",
    badge: "bg-[#0F6B4F] text-white",
    position: "left-[26.6%] top-[61.1%] w-[15%]",
  },
  {
    step: "4",
    title: "Real-time App",
    desc: "Track generation and savings live from your phone.",
    badge: "bg-[#F7BA41] text-[#272218]",
    position: "left-[53.2%] top-[64.5%] w-[15%]",
  },
];

const Card = ({
  step,
  title,
  desc,
  badge,
}: {
  step: string;
  title: string;
  desc: string;
  badge: string;
}) => (
  <div className="flex h-full flex-col items-center rounded-[0.96cqw] bg-white px-[0.96cqw] py-[0.96cqw] text-center shadow-[0_0.8cqw_2.4cqw_rgba(18,53,50,0.12)]">
    <span
      className={`mb-[0.64cqw] flex h-[1.92cqw] w-[1.92cqw] items-center justify-center rounded-full text-[0.88cqw] font-semibold ${badge}`}
    >
      {step}
    </span>
    <h3 className="text-[1.12cqw] font-bold leading-snug text-[#123532]">
      {title}
    </h3>
    <p className="mt-[0.32cqw] text-[0.88cqw] font-normal leading-relaxed text-[#757575]">
      {desc}
    </p>
  </div>
);

const WhatsIncluded = () => {
  return (
    <section className="relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col items-center h-full gap-10">
      {/* Heading */}
      <div className="w-full max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532]">
          What&apos;s Included in Every Installation?
        </h2>
        <p className="mt-3 text-sm md:text-lg text-[#757575]">
          A Flarize installation is a complete, turnkey ecosystem using only
          Tier-1 components for lifetime reliability.
        </p>
      </div>

      {/* House illustration with the callouts floating over it. The stage is
          a query container and everything inside it — positions, type, badges,
          shadows — is sized in cqw, so the composition scales as one piece
          from phones up instead of relayouting.

          Only 22%–83% of the stage width carries anything (circle left edge to
          card 2's right edge), so on narrow screens the stage is blown up past
          the container and re-centred on that band: the illustration gets
          bigger while the overflow that gets clipped is empty margin. */}
      <div className="relative mt-4 -mx-4 w-[calc(100%+2rem)] overflow-hidden sm:mx-0 sm:w-full">
        <div className="@container relative aspect-[100/56] w-[150%] -ml-[29%] sm:w-[135%] sm:-ml-[21.1%] md:w-[125%] md:-ml-[15.9%] lg:w-full lg:ml-0">
          {/* Soft circle the house sits inside */}
          <div className="pointer-events-none absolute left-[22.25%] top-0 aspect-square w-[55.5%] rounded-full bg-[#EAF2F3]" />

          {/* White band across the circle's middle — only its top and bottom
              arcs stay visible behind the house. */}
          <div className="pointer-events-none absolute inset-x-0 top-[21.9%] h-[56.6%] bg-white" />

          {/* The PNG ships with white padding, so the box is oversized and the
              house lands centred on the circle once it is object-contained. */}
          <div className="pointer-events-none absolute left-[19.3%] top-[2%] aspect-square w-[59.3%]">
            <Image
              src={houseImage}
              alt={houseImageAlt}
              fill
              sizes="(max-width: 768px) 60vw, 800px"
              className="object-contain object-center mix-blend-multiply"
            />
          </div>

          {items.map((item) => (
            <div key={item.step} className={`absolute z-20 ${item.position}`}>
              <Card {...item} />
            </div>
          ))}

          {/* Decorative verified tick near the roof */}
          <span className="absolute z-20 flex left-[47.8%] top-[23.9%] h-[3.2cqw] w-[3.2cqw] items-center justify-center rounded-full bg-white shadow-[0_0.64cqw_1.6cqw_rgba(18,53,50,0.15)]">
            <Check
              className="h-[1.6cqw] w-[1.6cqw] text-[#123532]"
              strokeWidth={3}
              aria-hidden="true"
            />
          </span>
        </div>
      </div>

    </section>
  );
};

export default WhatsIncluded;
