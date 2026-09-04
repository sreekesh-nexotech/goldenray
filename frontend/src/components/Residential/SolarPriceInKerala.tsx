const systems = [
  {
    title: "3kW On-Grid",
    summary:
      "For most homes — KSEB bill around ₹3,000–4,500 · needs ~300 sq ft of open roof",
    price: "₹2 - 2.30 lakh",
    subsidy: "-₹78,000",
    emi: "₹2,330/month",
    emiTail: "for 5 years — for many homes, less than the KSEB bill it replaces.",
    highlighted: false,
  },
  {
    title: "5kW System",
    summary:
      "For most homes — KSEB bill around ₹3,000–4,500 · needs ~300 sq ft of open roof",
    price: "₹3 - 3.30 lakh",
    subsidy: "-₹78,000",
    emi: "₹2,330/month",
    emiTail: "for 5 years — for many homes, less than the KSEB bill it replaces.",
    highlighted: true,
  },
  {
    title: "10kW System",
    summary:
      "For most homes — KSEB bill around ₹3,000–4,500 · needs ~300 sq ft of open roof",
    price: "₹5 - 6 lakh",
    subsidy: "-₹78,000",
    emi: "₹2,330/month",
    emiTail: "for 5 years — for many homes, less than the KSEB bill it replaces.",
    highlighted: false,
  },
];

const Row = ({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass: string;
}) => (
  <div className="flex items-center justify-between gap-3 py-3">
    <span className="text-base md:text-lg font-medium text-[#444444]">
      {label}
    </span>
    <span className={`text-base md:text-lg font-semibold ${valueClass}`}>
      {value}
    </span>
  </div>
);

const SolarPriceInKerala = () => {
  return (
    <section className="relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col items-center h-full gap-10">
      {/* Heading */}
      <div className="w-full max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532]">
          Solar Panel Price in Kerala: Cost, Subsidy &amp; EMI
        </h2>
        <p className="mt-3 text-[#757575] text-sm md:text-lg">
          Real price ranges from recent Kerala installations — including the
          ₹78,000 PM Surya Ghar subsidy most homes qualify for. No &quot;call us
          for price&quot; games.
        </p>
      </div>

      {/* Cards: a snapping side-scroller on phones, an even 3-up grid from md.
          The negative margin lets the strip bleed to the screen edges so the
          next card peeks in, as in the mobile design. */}
      <div className="-mx-4 w-[calc(100%+2rem)] overflow-x-auto md:mx-0 md:w-full md:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex snap-x snap-mandatory gap-5 px-4 md:grid md:grid-cols-3 md:gap-6 md:px-0">
          {systems.map((system) => (
            <div
              key={system.title}
              className={`flex w-[78%] shrink-0 snap-start flex-col rounded-2xl border bg-white p-5 md:w-auto md:p-6 ${
                system.highlighted ? "border-[#074A4D]" : "border-[#B2B2B233]"
              }`}
            >
              <h3 className="text-[22px] md:text-2xl font-semibold leading-tight text-black">
                {system.title}
              </h3>
              <p className="mt-3 text-sm md:text-base font-medium leading-relaxed text-[#525252]">
                {system.summary}
              </p>

              <div className="mt-4 divide-y divide-[#B2B2B233] border-y border-[#B2B2B233]">
                <Row
                  label="System price"
                  value={system.price}
                  valueClass="text-[#F88A22]"
                />
                <Row
                  label="Govt. subsidy"
                  value={system.subsidy}
                  valueClass="text-[#008130]"
                />
              </div>

              <p className="mt-4 text-sm md:text-base font-normal leading-relaxed text-[#444444]">
                On EMI : <span className="font-semibold">{system.emi}</span>{" "}
                {system.emiTail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Closing note */}
      <div className="w-full border-t border-[#B2B2B233] pt-6">
        <p className="text-lg md:text-xl font-normal leading-relaxed text-[#444444] text-center">
          <span className="font-semibold">
            Why is the price a range and not one number?
          </span>{" "}
          Because homes differ. A flat concrete roof costs less to work on than a
          tile roof that needs a raised frame. A taller building needs more cable
          and safer scaffolding. And panel or inverter brands differ in price.
          That&apos;s exactly what the assessment settles — after it, your
          proposals show one fixed, item-by-item price, and it doesn&apos;t change
          after work starts.
        </p>
      </div>
    </section>
  );
};

export default SolarPriceInKerala;
