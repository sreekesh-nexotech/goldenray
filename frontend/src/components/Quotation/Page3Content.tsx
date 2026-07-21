"use client";

export default function Page6Content() {
  const steps = [
    {
      day: "Day 1",
      title: "Pay ₹5,000 – Slot Locked",
      description:
        "Lock your installation slot with a small booking fee and we'll begin the technical assessment right away.",
      tagIcon: "🛡️",
      tagText: "100% Refundable if unsuitable",
      tagColor: "#16a34a",
      tagBg: "#16A34A1A",
    },
    {
      day: "Day 4–8",
      title: "Site Inspection & Documentation",
      description:
        "Our team visits your site to evaluate roof, wiring, and shading. All measurements and documentation are managed by us.",
      tagIcon: "🔧",
      tagText: "We handle this",
      tagColor: "#16a34a",
      tagBg: "#16A34A1A",
    },
    {
      day: "Day 15–25",
      title: "KSEB Meter Installation",
      description:
        "Net metering is applied with KSEB, and the bi-directional meter is installed to connect your system to the grid.",
      tagIcon: "📋",
      tagText: "We coordinate everything",
      tagColor: "#16a34a",
      tagBg: "#16A34A1A",
    },
    {
      day: "Day 30–35",
      title: "Solar Installation Complete",
      description:
        "We handle the full installation and system integration. Once commissioned, your solar system begins producing clean energy.",
      tagIcon: "✅",
      tagText: "5-year warranty included",
      tagColor: "#16a34a",
      tagBg: "#16A34A1A",
    },
    {
      day: "Day 45–60",
      title: "Government Approvals & Subsidy",
      description:
        "All final approvals and subsidy paperwork are managed by us. You'll receive the subsidy directly in your bank account as per official timelines.",
      tagIcon: "🏛️",
      tagText: "We handle all paperwork",
      tagColor: "#16a34a",
      tagBg: "#16A34A1A",
    },
  ];

  const weHandle = [
    "Design the panels according to site-specific requirements",
    "Analyze the site for shading and optimize panel placement",
    "Procure Solar Panels, Inverter, Structure and BOQ according to project requirements",
    "Install all required components, fittings, and equipment",
    "Test and commission the solar power plant, Invite authorities for final approval before commissioning",
    "Installation scope is limited to the DC side; solar meter installation is included",
    "Train client's personnel on system operation, safety, and maintenance",
  ];

  const youNeedToDo = [
    "Provide a shade-free roof area and a safe, weather-protected space for the inverter.",
    "Arrange basic installation support, including water, electricity, storage space, and any required civil work.",
    "Provide necessary technical provisions (internet connection, termination point, CT/AC components, and upgrades if applicable for HT or generator setups).",
    "Complete any required KSEB-related adjustments if sharing excess power.",
    "Pay applicable statutory fees (80% reimbursable).",
    "Additional charges may apply if extra structural work is required.",
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Title */}
      <div className="text-center mt-4 mb-12">
        <h1 className="text-[28px] font-semibold">
          <span className="text-[#F88A22]">From Booking to Savings — </span>
          <span className="text-[#123532]">Step by Step</span>
        </h1>
      </div>

      {/* Timeline */}
      <div className="relative mx-6 mb-4">
        {steps.map((step, idx) => (
          <div key={idx} className="relative flex items-start mb-1">
            {/* Vertical line */}
            {idx < steps.length - 1 && (
              <div
                className="absolute left-[15px] top-[32px] w-[2px] bg-gray-200"
                style={{ height: "calc(100% - 27px)" }}
              />
            )}

            {/* Numbered circle */}
            <div
              className="relative z-10 flex-shrink-0 w-[32px] h-[32px] rounded-full bg-[#123532] flex items-center justify-center mt-[2px]"
              style={{ opacity: idx === 0 ? 1 : 0.3 }}
            >
              <span className="text-white text-[13px] font-bold">
                {idx + 1}
              </span>
            </div>

            {/* Content */}
            <div className="ml-4 pb-4 flex-1 mb-1">
              <p className="text-[10px] text-[#F88A22] font-semibold mb-0.5">
                {step.day}
              </p>
              <h3 className="text-[13px] font-semibold text-[#1a1a1a] mb-3">
                {step.title}
              </h3>
              <p className="text-[10.5px] text-gray-600 leading-relaxed ">
                {step.description}
              </p>
              <span
                className="inline-flex items-center gap-1 text-[9.5px] font-semibold px-2 py-0.5 rounded-md"
                style={{ color: step.tagColor, backgroundColor: step.tagBg }}
              >
                {step.tagIcon} {step.tagText}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Two Columns */}
      <div className="mx-4 grid grid-cols-2 gap-3 mt-auto mb-2">
        {/* What We Handle */}
        <div className="border border-gray-200 rounded-lg p-3 bg-[#FEF3E8]">
          <h4 className="text-[11px] font-bold text-[#1a1a1a] tracking-wide mb-2.5 uppercase">
            What We Handle
          </h4>
          <ul className="space-y-2">
            {weHandle.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="flex-shrink-0 w-[11px] h-[11px] rounded-full bg-[#F88A22] flex items-center justify-center mt-[2px]">
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
        <div className="border border-gray-200 rounded-lg p-3 bg-[#16A34A1A]">
          <h4 className="text-[11px] font-bold  tracking-wide mb-2.5 uppercase">
            What You Need To Do
          </h4>
          <ul className="space-y-2">
            {youNeedToDo.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="flex-shrink-0 w-[11px] h-[11px] rounded-full border-[3.5px] border-[#F88A22] mt-[2px]" />
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
