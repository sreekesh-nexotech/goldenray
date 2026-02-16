"use client";

const faqs = [
  {
    question: "What if the installer disappears after I pay?",
    answer:
      "We've completed 200+ installations with zero abandoned projects in Kerala since 2018. Every system carries a 5-year full warranty from us, plus manufacturer warranties on panels (25 yrs) and inverters (8 yrs). You're protected legally and contractually.",
    tag: "200+ installations with zero abandoned projects",
  },
  {
    question: "What if my roof isn't suitable for solar?",
    answer:
      "We do a free site inspection before any major payment. If your roof doesn't work, your ₹5,000 booking fee is fully refunded. No questions asked. We won't install where it won't perform.",
    tag: "₹5,000 fully refundable if roof is unsuitable.",
  },
  {
    question: "What if KSEB rejects my application?",
    answer:
      "We handle the entire KSEB process. Across 200+ installations with zero abandoned projects, we have a 100% approval rate. We know the system, the paperwork, and the officials. If there's an issue, it's our problem to solve — not yours.",
    tag: "100% KSEB approval rate across all our projects.",
  },
  {
    question: "What if I move houses in 3–5 years?",
    answer:
      "Solar panels increase your property value by ₹3-5 lakh minimum. Buyers actively look for solar-equipped homes. You're not losing money — you're adding a permanent asset. The new owner benefits, and so does your selling price.",
    tag: "Solar adds ₹3–5 lakh to your property value.",
  },
  {
    question: "Is there any maintenance hassle?",
    answer:
      "Minimal. Panels are self-cleaning in rain — Kerala's monsoons actually help. We recommend one annual inspection (₹1,500/year). That's it. No moving parts, no fuel, no regular maintenance needed.",
    tag: "Annual maintenance: Only ₹1,500. Rain does the rest.",
  },
];

export default function Page7Content() {
  return (
    <div className="flex flex-col h-full">
      {/* Title */}
      <div className="text-center mt-4 mb-5">
        <h1 className="text-[28px] font-bold text-[#123532] leading-tight">
          We Know What You&apos;re Thinking
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Honest answers to real concerns — no marketing fluff.
        </p>
      </div>

      {/* FAQ Cards */}
      <div className="flex flex-col gap-4 px-4 mb-7">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="border border-[#F59E0B] rounded-xl pl-4 pr-5 py-3"
          >
            {/* Question */}
            <h3 className="text-sm font-bold text-[#123532] mb-2">
              {idx + 1} .&nbsp; {faq.question}
            </h3>

            {/* Answer */}
            <p className="text-xs text-gray-600 leading-relaxed mb-3">
              {faq.answer}
            </p>

            {/* Tag */}
            <span className="inline-flex items-center gap-1 text-[10px]  px-3 py-1 rounded-md text-[#16a34a] bg-[#16A34A1A]">
              ✓ {faq.tag}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom Reassurance Banner */}
      <div
        className="mt-auto -mx-[10mm] mb-0"
        style={{ marginBottom: "-8mm", paddingBottom: "8mm" }}
      >
        <div className="bg-[#FEF3E8] px-8 py-6 text-center">
          <p className="text-xs text-[#123532] mb-2 leading-relaxed">
            These are the same questions most homeowners ask us — and the same
            concerns we&apos;ve been handling successfully since 2018.
          </p>
          <p className="text-base font-bold text-[#123532]">
            Your concerns are valid, normal, and completely addressable.
          </p>
        </div>
      </div>
    </div>
  );
}
