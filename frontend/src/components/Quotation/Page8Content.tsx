"use client";

export default function Page8Content() {
  return (
    <div className="flex flex-col h-full">
      {/* Title */}
      <div className="text-center mt-7 mb-7">
        <h1 className="text-[28px] font-bold text-[#123532] leading-tight">
          Terms and Conditions
        </h1>
      </div>

      {/* Row 1: Warranty & Payment Terms */}
      <div className="grid grid-cols-2 gap-3 px-4 mb-3">
        {/* Warranty */}
        <div className="bg-[#FEF3E8] rounded-xl p-3">
          <h3 className="text-[16px] font-bold text-[#123532] mb-2">
            Warranty
          </h3>
          <ul className="space-y-1 list-disc list-outside pl-4">
            <li className="text-[10.5px] text-gray-700 leading-relaxed">
              The Company guarantees the performance of the solar energy systems
              in accordance with the specifications agreed upon, subject to the
              terms of the warranty.
            </li>
            <li className="text-[10.5px] text-gray-700 leading-relaxed">
              Warranty claims are limited to manufacturing defects and exclude
              issues arising from non-compliance with operational guidelines or
              external damage.
            </li>
            <li className="text-[10.5px] text-gray-700 leading-relaxed">
              Golden Ray will provide service and maintenance training.
            </li>
            <li className="text-[10.5px] text-gray-700 leading-relaxed">
              Standby inverter provided during inverter failure/ repair to
              ensure uninterrupted power generation.
            </li>
            <li className="text-[10.5px] text-gray-700 leading-relaxed">
              Water access for panel washing should be provided by the client.
            </li>
          </ul>
        </div>

        {/* Payment Terms */}
        <div className="bg-[#FEF3E8] rounded-xl p-3">
          <h3 className="text-[16px] font-bold text-[#123532] mb-2">
            Payment Terms
          </h3>
          <ul className="space-y-1 list-disc list-outside pl-4">
            <li className="text-[10.5px] text-gray-700 leading-relaxed">
              Payments to Golden Ray should be as follows:
              <ul className="list-disc list-outside pl-4 mt-1 space-y-0.5">
                <li>65% at the time of order confirmation.</li>
                <li>20% after material delivery.</li>
                <li>10% on completion of installation.</li>
                <li>5% after commissioning.</li>
              </ul>
            </li>
            <li className="text-[10.5px] text-gray-700 leading-relaxed">
              Prices are fixed and inclusive of all taxes, subject to change in
              tax rates. Any such changes will be reflected in the final
              invoice.
            </li>
            <li className="text-[10.5px] text-gray-700 leading-relaxed">
              Payment terms are as per the contractual agreement and are due
              immediately upon completion of installation.
            </li>
            <li className="text-[10.5px] text-gray-700 leading-relaxed">
              Payments are accepted via bank transfer or other agreed-upon
              methods.
            </li>
            <li className="text-[10.5px] text-gray-700 leading-relaxed">
              Late payments will incur interest at a rate specified in the
              agreement.
            </li>
          </ul>
        </div>
      </div>

      {/* Row 2: Warranty Exclusions & Project Completion */}
      <div className="grid grid-cols-2 gap-4 px-4 my-7">
        {/* Warranty Exclusions */}
        <div className="bg-[#FEF3E8] rounded-xl p-3">
          <h3 className="text-[16px] font-bold text-[#123532] mb-1.5">
            Warranty Exclusions
          </h3>
          <p className="text-[10.5px] text-gray-700 leading-relaxed mb-1.5">
            The warranty shall not apply to defects resulting from the
            following:
          </p>
          <ul className="space-y-1 list-disc list-outside pl-4">
            <li className="text-[10.5px] text-gray-700 leading-relaxed">
              Willful damage or negligence by the customer after the final
              commissioning.
            </li>
            <li className="text-[10.5px] text-gray-700 leading-relaxed">
              Misuse or abuse of equipment.
            </li>
            <li className="text-[10.5px] text-gray-700 leading-relaxed">
              Damage due to natural calamities, Force Majeure.
            </li>
            <li className="text-[10.5px] text-gray-700 leading-relaxed">
              Any third-party interfering installations related to our
              installation.
            </li>
          </ul>
        </div>

        {/* Project Completion */}
        <div className="bg-[#FEF3E8] rounded-xl p-3">
          <h3 className="text-[16px] font-bold text-[#123532] mb-2">
            Project Completion
          </h3>
          <ul className="space-y-1 list-disc list-outside pl-4">
            <li className="text-[10.5px] text-gray-700 leading-relaxed">
              Completion of the project may prolong up to 20 days from the date
              of receipt of the work order, due to authority delays. Any other
              charges (if required) will be discussed & agreed upon mutually, in
              writing, between Golden Ray & the customer.
            </li>
          </ul>
        </div>
      </div>

      {/* Row 3: Force Majeure (full width) */}
      <div className="px-4 mb-7">
        <div className="bg-[#FEF3E8] rounded-xl p-3">
          <h3 className="text-[16px] font-bold text-[#123532] mb-2">
            Force Majeure
          </h3>
          <ul className="list-disc list-outside pl-4">
            <li className="text-[10.5px] text-gray-700 leading-relaxed">
              The Company is not liable for delays or failure to perform caused
              by circumstances beyond its reasonable control, including natural
              disasters, strikes, or government actions.
            </li>
          </ul>
        </div>
      </div>

      {/* Row 4: Additional expenses & Additional Services & Notes */}
      <div className="grid grid-cols-2 gap-3 px-4 mb-2 mt-auto">
        {/* Additional expenses */}
        <div className="bg-[#FEF3E8] rounded-xl p-3">
          <h3 className="text-[16px] font-bold text-[#123532] mb-2">
            Additional expenses
          </h3>
          <ul className="space-y-1 list-disc list-outside pl-4">
            <li className="text-[10.5px] text-gray-700 leading-relaxed">
              KSEB Application Fee, Registration Fee, Documentation, Testing,
              Agreement, Net Meter Connection including 18% GST
            </li>
            <li className="text-[10.5px] text-gray-700 leading-relaxed">
              Additional structure charges if required - per kW
            </li>
            <li className="text-[10.5px] text-gray-700 leading-relaxed">
              GI Apollo( 16 gauge) (If required only)
            </li>
            <li className="text-[10.5px] text-gray-700 leading-relaxed">
              Refund from KSEB – (80% of Pre-tax value of registration fee)
              (1000 per kw + 18% tax)
            </li>
          </ul>
        </div>

        {/* Additional Services & Notes */}
        <div className="bg-[#FEF3E8] rounded-xl p-3">
          <h3 className="text-[16px] font-bold text-[#123532] mb-2">
            Additional Services & Notes
          </h3>
          <ul className="space-y-1 list-disc list-outside pl-4">
            <li className="text-[10.5px] text-gray-700 leading-relaxed">
              1 free panel washing service within first year (additional
              services on pay-as-you-go basis)
            </li>
            <li className="text-[10.5px] text-gray-700 leading-relaxed">
              Standby inverter provided during inverter failure or repair period
            </li>
            <li className="text-[10.5px] text-gray-700 leading-relaxed">
              All structure pricing based on TaTa GI structure
            </li>
            <li className="text-[10.5px] text-gray-700 leading-relaxed">
              FIS V PLUS used for anchor bolting
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
