export default function GroupVsIndividual() {
  const comparisonData = [
    {
      feature: "System cost (5kW)",
      individual: "₹2,50,000",
      group: "₹2,40,000",
      highlight: false,
    },
    {
      feature: "Group discount",
      individual: "Not applicable",
      group: "₹10,000 off",
      highlight: true,
    },
    {
      feature: "Panels",
      individual: "Waaree / Adani mono PERC",
      group: "Waaree / Adani mono PERC",
      highlight: false,
    },
    {
      feature: "Inverter",
      individual: "Sungrow grid-tied",
      group: "Sungrow grid-tied",
      highlight: false,
    },
    {
      feature: "Installation Timeline",
      individual: "4-6 weeks scheduling",
      group: "Group week (5-7 days)",
      highlight: false,
    },
    {
      feature: "KSEB Net Metering",
      individual: "Included",
      group: "Included (batch filing)",
      highlight: false,
    },
    {
      feature: "PM Surya Ghar Subsidy",
      individual: "Filed by Flarize",
      group: "Filed by Flarize",
      highlight: false,
    },
    {
      feature: "Panel Warranty",
      individual: "25 years",
      group: "25 years",
      highlight: false,
    },
    {
      feature: "Inverter Warranty",
      individual: "10 years",
      group: "10 years",
      highlight: false,
    },
    {
      feature: "Booking Amount",
      individual: "₹5,000",
      group: "₹1,000 (fully refundable)",
      highlight: true,
    },
  ];

  return (
    <section className="relative py-8 sm:py-10 md:py-12 lg:py-16 xl:py-12 2xl:py-16">
      {/* Align with navbar container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h1 className="text-[#1F2937] text-4xl md:text-5xl font-semibold leading-tight text-center mb-3 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-4 2xl:mb-4">
          Group vs Individual Solar Installation: What You Actually Save
        </h1>

        {/* Subtitle */}
        <p className="text-[#6B7280] text-base md:text-xl font-normal md:font-semibold leading-snug text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-8 2xl:mb-8">
          Same quality installation. Lower cost because we schedule all homes
          together.
        </p>

        {/* Comparison Table - Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse rounded-2xl overflow-hidden shadow-lg">
            {/* Table Header */}
            <thead>
              <tr className="bg-[#074A4D] text-white">
                <th className="text-left py-4 sm:py-5 md:py-5 lg:py-6 xl:py-4 2xl:py-5 px-4 sm:px-5 md:px-6 lg:px-8 xl:px-6 2xl:px-6 text-base md:text-xl font-semibold leading-snug">
                  What&apos;s included
                </th>
                <th className="text-left py-4 sm:py-5 md:py-5 lg:py-6 xl:py-4 2xl:py-5 px-4 sm:px-5 md:px-6 lg:px-8 xl:px-6 2xl:px-6 text-base md:text-xl font-semibold leading-snug">
                  Individual Install (5kW)
                </th>
                <th className="text-left py-4 sm:py-5 md:py-5 lg:py-6 xl:py-4 2xl:py-5 px-4 sm:px-5 md:px-6 lg:px-8 xl:px-6 2xl:px-6 text-base md:text-xl font-semibold leading-snug bg-[#074A4D] text-white">
                  Group Install (5kW)
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {comparisonData.map((row, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="py-3 sm:py-4 md:py-4 lg:py-5 xl:py-3 2xl:py-4 px-4 sm:px-5 md:px-6 lg:px-8 xl:px-6 2xl:px-6 text-[#374151] text-xs md:text-base font-normal leading-normal">
                    {row.feature}
                  </td>
                  <td className="py-3 sm:py-4 md:py-4 lg:py-5 xl:py-3 2xl:py-4 px-4 sm:px-5 md:px-6 lg:px-8 xl:px-6 2xl:px-6 text-[#6B7280] text-xs md:text-base font-normal leading-normal">
                    {row.individual}
                  </td>
                  <td className="py-3 sm:py-4 md:py-4 lg:py-5 xl:py-3 2xl:py-4 px-4 sm:px-5 md:px-6 lg:px-8 xl:px-6 2xl:px-6 text-xs md:text-base font-normal leading-normal bg-[#FDF6D280] text-[#6B7280]">
                    {row.group}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Comparison Cards - Mobile */}
        <div className="md:hidden space-y-4 sm:space-y-5">
          {comparisonData.map((row, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
            >
              <div className="bg-[#074A4D] text-white py-3 px-4 text-xl md:text-2xl font-semibold leading-snug">
                {row.feature}
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs md:text-base font-normal leading-normal text-[#6B7280]">
                    Individual Install (5kW)
                  </span>
                  <span className="text-xs md:text-base font-normal leading-normal text-[#374151] text-right">
                    {row.individual}
                  </span>
                </div>
                <div
                  className={`flex justify-between items-start p-3 rounded-lg ${
                    row.highlight ? "bg-[#FEF3C7]" : "bg-[#FFFBEB]"
                  }`}
                >
                  <span
                    className={`text-xs md:text-base font-normal leading-normal ${
                      row.highlight ? "text-[#92400E]" : "text-[#6B7280]"
                    }`}
                  >
                    Group Install (5kW)
                  </span>
                  <span
                    className={`text-xs md:text-base font-normal leading-normal text-right ${
                      row.highlight
                        ? "text-[#92400E] font-semibold"
                        : "text-[#374151]"
                    }`}
                  >
                    {row.group}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-8 2xl:mt-10 bg-white rounded-xl p-4 sm:p-5 md:p-6 lg:p-8 xl:p-6 2xl:p-6 ">
          <p className="text-[#6B7280] text-xs md:text-base font-normal leading-normal text-center">
            Both options include complete installation, KSEB net metering
            activation, PM Surya Ghar subsidy filing, and 25-year panel
            warranty. Group booking requires only ₹1,000 — fully refundable if
            the group doesn&apos;t form.
          </p>
        </div>
      </div>
    </section>
  );
}
