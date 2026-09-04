const SUBSIDY_SLABS = [
  {
    systemSize: "1–2kW System",
    amount: "₹30,000 – ₹60,000",
    benefit: "Up to 40%",
    benefitTone: "bg-[#DCFCE7] text-[#166534]",
  },
  {
    systemSize: "3kW System",
    amount: "₹78,000",
    benefit: "Fixed rate",
    benefitTone: "bg-[#DCFCE7] text-[#166534]",
  },
  {
    systemSize: "4–10kW System",
    amount: "₹78,000 – ₹94,000",
    benefit: "Capped",
    benefitTone: "bg-[#FCF3C7] text-[#8A6100]",
  },
];

export default function SubsidyAmountTable() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-12 sm:py-14 lg:py-16">
      <div className="w-full max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532]">
          How much solar subsidy can you get in Kerala?
        </h2>
        <p className="mt-3 text-[#757575] text-sm md:text-lg">
          Quick overview of the financial support available for different
          residential system sizes.
        </p>
      </div>

      <div className="mx-auto mt-8 sm:mt-10 max-w-7xl">
        <div className="overflow-x-auto rounded-2xl border border-[#EFEFEF] bg-white shadow-[0_4px_24px_rgba(18,53,50,0.06)]">
          <table className="w-full min-w-[520px] border-collapse text-left">
            <thead>
              <tr className="bg-[#F7F7F7]">
                <th
                  scope="col"
                  className="px-6 py-4 sm:px-8 sm:py-5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.08em] text-[#123532]"
                >
                  System size
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 sm:px-8 sm:py-5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.08em] text-[#123532]"
                >
                  Subsidy amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 sm:px-8 sm:py-5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.08em] text-[#123532]"
                >
                  Benefit
                </th>
              </tr>
            </thead>
            <tbody>
              {SUBSIDY_SLABS.map(
                ({ systemSize, amount, benefit, benefitTone }) => (
                  <tr
                    key={systemSize}
                    className="border-t border-[#F0F0F0] first:border-t-0"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 sm:px-8 sm:py-5 text-sm md:text-base font-medium text-[#123532]"
                    >
                      {systemSize}
                    </th>
                    <td className="px-6 py-4 sm:px-8 sm:py-5 text-sm md:text-base font-semibold text-[#16A34A] whitespace-nowrap">
                      {amount}
                    </td>
                    <td className="px-6 py-4 sm:px-8 sm:py-5">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.06em] ${benefitTone}`}
                      >
                        {benefit}
                      </span>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-center text-xs md:text-sm text-[#757575]">
          * Actual subsidy depends on government policies and system size
          approval.
        </p>
      </div>
    </section>
  );
}
