"use client";

export default function Page9Content() {
  const steps = [
    {
      day: "1",
      title: "Pay ₹5,000 – Slot Locked",
      description:
        "Lock your installation slot with a small booking fee and we'll begin the technical assessment right away.",
    },
    {
      day: "3-4",
      title: "Site Inspection & Documentation",
      description:
        "Our team visits your site to evaluate roof, wiring, and shading. All measurements and documentation are managed by us.",
    },
    {
      day: "5-7",
      title: "Payment and Material Delivery",
      description:
        "Deliver solar panel, inverters and structures; follow up with the next payment installation (80% loan amount)",
    },
    {
      day: "9-13",
      title: "Installation",
      description:
        "We handle the full installation and system integration. Once commissioned, your solar system begins producing clean energy.",
    },
    {
      day: "14",
      title: "Commissioning and Customer Orientation",
      description:
        "Commission the system and orient the customer on operation and maintenance.",
    },
    {
      day: "15-17",
      title: "Net Meter Installation and Activation",
      description:
        "Install net meter for grid integration, enabling the customer to start using solar power",
    },
  ];

  const weHandle = [
    "Design the panels according to site-specific requirements",
    "Analyze the site for shading and optimize panel placement",
    "Procure Solar Panels, inverter, Structure and BOQ according to project requirements",
    "Install all required components, fittings, and equipment",
    "Test and commission the solar power plant, Invite authorities for final approval before commissioning",
    "Installation scope is limited to the DC side; solar meter installation is included",
    "Train client's personal on system operation, safety, and maintenance",
  ];

  const youNeedToDo = [
    "Provide a shade-free roof area and a safe, weather-protected space for the inverter.",
    "Arrange basic installation support, including water, electricity, storage space, and site access.",
    "Provide necessary technical provisions such as internet connectivity, termination points, CT/AC components, and upgrades required for HT or generator setups.",
    "Complete any KSEB-related requirements, including net metering formalities, load enhancement, consumer name change, ownership transfer, or other utility-related modifications, if applicable.",
    "Pay applicable statutory fees, deposits, registration charges, and other charges imposed by KSEB or relevant authorities.",
    "Any civil work, roof repairs, waterproofing, structural modifications, trenching, masonry work, painting, restoration work, or additional structural work required for installation shall be under the customer's scope unless specifically included in the quotation.",
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Title */}
      <div className="text-center mt-4 mb-10">
        <h1 className="text-[28px] font-semibold">
          <span className="text-[#F88A22]">From Booking to Savings — </span>
          <span className="text-[#123532]">Step by Step</span>
        </h1>
      </div>

      {/* Horizontal Timeline */}
      <div className="relative mx-4 mb-8">
        {/* Connecting dotted line */}
        <div
          className="absolute left-[8%] right-[8%] top-[22px] border-t-2 border-dotted border-gray-300"
          style={{ zIndex: 0 }}
        />

        <div className="grid grid-cols-6 gap-2">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center">
              {/* Day circle */}
              <div className="relative z-10 flex-shrink-0 w-[44px] h-[44px] rounded-full bg-[#123532] flex flex-col items-center justify-center mb-4">
                <span className="text-white text-[12px] font-bold leading-none">
                  {step.day}
                </span>
                <span className="text-white text-[5.5px] font-semibold tracking-widest uppercase mt-[2px]">
                  Days
                </span>
              </div>

              {/* Content */}
              <div className="text-left w-full">
                <h3 className="text-[10px] font-bold text-[#1a1a1a] mb-1.5 leading-snug">
                  {step.title}
                </h3>
                <p className="text-[8.5px] text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Refund from KSEB box */}
      <div className="mx-4 mb-6 border-l-3 border-l-[#F88A22] px-5 py-3">
        <h4 className="text-[12px] font-bold text-[#1a1a1a] tracking-wide mb-1 uppercase">
          Refund from KSEB
        </h4>
        <p className="text-[9.5px] text-gray-600 mb-1.5">
          (80% of Pre-tax value of registration fee) ( 1000 per kw + 18% tax )
        </p>
        <p className="text-[11px] font-bold text-[#1a1a1a]">5kw – Rs 4000</p>
      </div>

      {/* Bottom Two Columns */}
      <div className="mx-4 grid grid-cols-2 gap-3 mb-2">
        {/* What We Handle */}
        <div className="rounded-lg p-4 bg-[#FEF3E8]">
          <h4 className="text-[11px] font-bold text-[#1a1a1a] tracking-wide mb-3 uppercase">
            What We Handle
          </h4>
          <ul className="space-y-2.5">
            {weHandle.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="flex-shrink-0 w-[12px] h-[12px] rounded-full bg-[#F88A22] flex items-center justify-center mt-[2px]">
                  <svg
                    className="w-[7px] h-[7px] text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <span className="text-[9.5px] text-gray-700 leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* What You Need To Do */}
        <div className="rounded-lg p-4 bg-[#16A34A1A]">
          <h4 className="text-[11px] font-bold text-[#1a1a1a] tracking-wide mb-3 uppercase">
            What You Need To Do
          </h4>
          <ul className="space-y-2.5">
            {youNeedToDo.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="flex-shrink-0 w-[12px] h-[12px] rounded-full border-[3px] border-[#F88A22] mt-[2px]" />
                <span className="text-[9.5px] text-gray-700 leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
