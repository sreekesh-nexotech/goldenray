import { CalendarClock, FileCheck2, Gauge, Search } from "lucide-react";

const KERALA_INFO = [
  {
    icon: FileCheck2,
    title: "Net Metering Approval",
    description:
      "KSEB handles the application for grid-connection and net metering.",
    cardBg: "bg-[#FCF5DF]",
    iconBg: "bg-[#F7E7B8]",
    iconColor: "text-[#DDA02B]",
  },
  {
    icon: Search,
    title: "KSEB Inspection",
    description:
      "Local engineers inspect the installation for safety and compliance.",
    cardBg: "bg-[#D9E9EF]",
    iconBg: "bg-[#BEDBE5]",
    iconColor: "text-[#3E7D93]",
  },
  {
    icon: Gauge,
    title: "Meter Replacement",
    description:
      "Your existing meter will be replaced with a bi-directional net meter.",
    cardBg: "bg-[#DDEDDA]",
    iconBg: "bg-[#C3DFBF]",
    iconColor: "text-[#4E8A46]",
  },
  {
    icon: CalendarClock,
    title: "Local Timelines",
    description:
      "Typically takes 15-20 days for KSEB approval after installation.",
    cardBg: "bg-[#FAE6E1]",
    iconBg: "bg-[#F5CFC6]",
    iconColor: "text-[#D97757]",
  },
];

export default function KeralaSubsidyInfo() {
  return (
    <section className="w-full bg-white px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-12 sm:py-14 lg:py-16">
      <div className="w-full max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532]">
          Kerala-Specific Subsidy Information
        </h2>
      </div>

      <ul className="mx-auto mt-8 sm:mt-10 lg:mt-12 grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {KERALA_INFO.map(
          ({
            icon: Icon,
            title,
            description,
            cardBg,
            iconBg,
            iconColor,
          }) => (
            <li
              key={title}
              className={`rounded-2xl ${cardBg} px-6 py-8 sm:px-7 sm:py-10 flex flex-col items-center text-center`}
            >
              <span
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${iconBg}`}
              >
                <Icon
                  className={`h-6 w-6 ${iconColor}`}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </span>
              <h3 className="mt-6 text-base md:text-lg font-bold leading-snug text-[#123532]">
                {title}
              </h3>
              <p className="mt-3 text-xs md:text-sm leading-relaxed text-[#5C5C5C]">
                {description}
              </p>
            </li>
          ),
        )}
      </ul>
    </section>
  );
}
