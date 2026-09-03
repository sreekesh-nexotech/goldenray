import Image from "next/image";

// Swap for the panel close-ups once they are on the CDN.
const panelImage = "https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/1670655655bdb72d09ce47d34a2aa3bff322a109.png";

const panels = [
  {
    name: "TOPCon",
    image: panelImage,
    imageAlt: "Close-up of a TOPCon solar panel",
    desc: "Kerala roofs get hot — and heat quietly steals solar power. TOPCon panels lose less in the heat, so they make more electricity here, year after year. Our usual recommendation.",
    specs: [
      { label: "Efficiency", value: "22 – 23%" },
      { label: "Power lost in heat", value: "Low (-0.30%/°C)" },
      { label: "Performance", value: "30 years" },
    ],
    rightFor:
      "most Kerala homes — a small extra cost now, more units every year for decades.",
  },
  {
    name: "Mono PERC",
    image: panelImage,
    imageAlt: "Close-up of a Mono PERC solar panel",
    desc: "The dependable workhorse — installed on millions of roofs worldwide. Makes a little less in peak heat, and costs noticeably less to buy.",
    specs: [
      { label: "Efficiency", value: "20 – 21.5%" },
      { label: "Power lost in heat", value: "Moderate (-0.35%/°C)" },
      { label: "Performance", value: "25 years" },
    ],
    rightFor:
      "budget-conscious homes with enough roof space. Solid savings, lower upfront cost.",
  },
  {
    name: "HJT",
    image: panelImage,
    imageAlt: "Close-up of an HJT solar panel",
    desc: "The highest-output technology — squeezes the most power from every square foot, even on grey monsoon days when other panels slow down.",
    specs: [
      { label: "Efficiency", value: "22.5 – 23.5%" },
      { label: "Power lost in heat", value: "Lowest (-0.26%/°C)" },
      { label: "Performance", value: "30 years" },
    ],
    rightFor:
      "small roofs that need maximum generation, and homeowners who want the most output available.",
  },
  {
    name: "Bifacial",
    image: panelImage,
    imageAlt: "Close-up of a bifacial solar panel",
    desc: "Makes power from both sides — the front from the sun, the back from light bouncing up from below. Only helps when there's a bright surface underneath.",
    specs: [
      { label: "Efficiency (front)", value: "21 – 22%" },
      { label: "Extra from back side", value: "up to +10%" },
      { label: "Performance", value: "30 years" },
    ],
    rightFor:
      "panels raised over a light-coloured terrace. Not needed for most homes — we'll tell you if yours is one.",
  },
];

const UnderstandingSolarPanels = () => {
  return (
    <section className="relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col items-center h-full gap-10">
      {/* Heading */}
      <div className="w-full max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532]">
          Understanding Solar Panels
        </h2>
        <p className="mt-3 text-sm md:text-lg text-[#757575]">
          Not all panels are created equal. We use the latest Tier-1 technology
          for long-term performance in Kerala&apos;s climate.
        </p>
      </div>

      {/* Horizontally scrollable on mobile, 4-up grid from lg+ */}
      <div className="w-full flex overflow-x-auto gap-4 no-scrollbar lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible">
        {panels.map(({ name, image, imageAlt, desc, specs, rightFor }) => (
          <article
            key={name}
            className="shrink-0 min-w-[80vw] max-w-[80vw] lg:min-w-0 lg:max-w-none flex flex-col rounded-2xl border border-[#B2B2B233] bg-white p-4 md:p-5"
          >
            <div className="relative w-full h-[140px] md:h-[150px]">
              <Image
                src={image}
                alt={imageAlt}
                fill
                sizes="(max-width: 1024px) 80vw, 25vw"
                className="object-cover rounded-2xl"
              />
            </div>

            <h3 className="mt-5 text-lg md:text-xl font-bold leading-snug text-[#123532]">
              {name}
            </h3>

            <p className="mt-3 text-xs md:text-sm font-normal leading-relaxed text-[#444444]">
              {desc}
            </p>

            <dl className="mt-6 border-t border-[#B2B2B233] ">
              {specs.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 py-2"
                >
                  <dt className="text-[11px] md:text-xs font-normal text-[#757575]">
                    {label}
                  </dt>
                  <dd className="text-[11px] md:text-xs font-bold text-right text-[#123532]">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 rounded-xl bg-[#16A34A1A] px-3 py-3">
              <p className="text-xs md:text-[13px] leading-relaxed text-[#008130]">
                <span className="font-bold ">Right for:</span>{" "}
                {rightFor}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default UnderstandingSolarPanels;
