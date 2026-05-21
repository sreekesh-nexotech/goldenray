"use client";

const TYPE_CARDS = [
  {
    title: "String Inverter",
    type: "Microinverter", // badge label kept consistent with screenshot wording
    badgeStyle: "bg-[#E7F1FF] text-[#1F6CD9]",
    description:
      "All panels connect to one central inverter. Most affordable, simplest design, and widest brand selection. Best for unshaded, uniform rooftops. One panel underperforming drags down the entire string.",
    tagText: "Best Value · Most Common",
    tagStyle: "bg-[#16A34A1A] text-[#16A34A]",
  },
  {
    title: "Hybrid Inverter",
    type: "Hybrid",
    badgeStyle: "bg-[#EAF7EE] text-[#1E8D4E]",
    description:
      "A string inverter with a built-in battery port. Lets you add battery storage later without replacing the inverter. Costs more upfront but future-proofs your system for backup power and time-of-use optimization.",
    tagText: "Battery Ready · Future Proof",
    tagStyle: "bg-[#E0EEFF] text-[#1F6CD9]",
  },
  {
    title: "Microinverter",
    type: "Microinverter",
    badgeStyle: "bg-[#FFE7E7] text-[#D95050]",
    description:
      "One tiny inverter per panel — each panel operates independently. Eliminates shading impact, enables panel-level monitoring, and maximizes output on complex roofs. Premium price, but best long-term performance for tricky installations.",
    tagText: "Best for Shade · Panel-Level",
    tagStyle: "bg-[#FFEFD9] text-[#C98013]",
  },
];

export default function InverterTypesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#123532] mb-3">
          Inverter Types — Which One Fits Your Home?
        </h2>
        <p className="text-sm sm:text-base text-[#444444] max-w-2xl mx-auto">
          Before comparing brands, understand the three architectures. Each has
          real trade-offs for Kerala homes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {TYPE_CARDS.map((card) => (
          <article
            key={card.title}
            className="bg-white rounded-2xl border border-[#E8E8E8] shadow-[0_6px_20px_rgba(0,0,0,0.04)] overflow-hidden"
          >
            <div className="bg-[#F2F2F2] h-32 sm:h-36" />
            <div className="p-4 sm:p-5 space-y-3">
              <h3 className="font-semibold text-[17px] text-[#202020]">
                {card.title}
              </h3>
              <p className="text-[12px] text-[#4A4A4A] leading-[1.55]">
                {card.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span
                  className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${card.tagStyle}`}
                >
                  {card.tagText}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
