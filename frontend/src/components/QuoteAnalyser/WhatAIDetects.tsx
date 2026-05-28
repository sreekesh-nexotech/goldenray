import React from "react";

const items = [
  {
    title: "Overpricing",
    description:
      "We compare your quote against the Kerala market average for the same kW size, brand and roof type.",
  },
  {
    title: "Fake Claims",
    description:
      "We verify warranty terms, subsidy eligibility and brand authenticity using real product data.",
  },
  {
    title: "Component Mismatch",
    description:
      "We flag inverters that are undersized, panels that are incompatible or mounting that won't last in Kerala monsoon.",
  },
  {
    title: "Hidden Costs",
    description:
      "GST, transport, scaffolding, net metering charges — we surface what installers commonly leave out of the quote.",
  },
  {
    title: "Pricing Tactics",
    description:
      "Anchor pricing, bundled discounts and limited-time offers designed to pressure you into signing fast.",
  },
  {
    title: "Government Promising",
    description:
      "We separate real PM Surya Ghar subsidy commitments from vague promises installers make to close the deal.",
  },
];

const WhatAIDetects = () => {
  return (
    <section className="relative bg-white py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532]">
            What our AI detects
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-[#074A4D] rounded-2xl p-6 text-white"
            >
              <h3 className="text-xl md:text-2xl font-semibold leading-snug mb-3">
                {item.title}
              </h3>
              <p className="text-sm md:text-base font-normal leading-relaxed text-white/80">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatAIDetects;
