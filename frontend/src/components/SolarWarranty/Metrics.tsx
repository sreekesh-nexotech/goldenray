import React from "react";

const stats = [
  {
    value: "< 1 Minute",
    label:
      "Average WhatsApp or phone response time from our Kerala service team.",
  },
  {
    value: "80%",
    label:
      "Of support issues resolved remotely through inverter cloud diagnostics.",
  },
  {
    value: "48 Hours",
    label:
      "On-site technician visit guaranteed for any physical fault, across all Kerala districts.",
  },
];

const Metrics = () => {
  return (
    <section className="relative w-full bg-white py-14 sm:py-16 md:py-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 items-start py-2 sm:py-4 md:py-6">
          {stats.map((stat, index) => (
            <div
              key={stat.value}
              className={`flex flex-col items-center text-center px-2 sm:px-6 md:px-10 ${
                index < stats.length - 1 ? "border-r border-[#D8D8D8]" : ""
              }`}
            >
              <span className="self-start w-full text-left text-[2.15rem] leading-[0.95] font-semibold tracking-tighter text-[#111827] sm:text-6xl md:text-6xl">
                {stat.value}
              </span>
              <span className="mt-2 self-start w-full max-w-full text-left text-[0.72rem] leading-snug text-[#FF8A1E] sm:mt-4 sm:max-w-48 sm:text-sm md:max-w-52 md:text-base overflow-hidden md:[display:-webkit-box] md:[-webkit-line-clamp:2] md:[-webkit-box-orient:vertical] md:line-clamp-2">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Metrics;
