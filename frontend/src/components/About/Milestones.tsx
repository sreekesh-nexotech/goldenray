import PageIllustration from "../ui/page-illustration";

type Milestone = {
  year: string;
  title: string;
  description: string;
  highlight?: boolean;
};

const milestones: Milestone[] = [
  {
    year: "2018",
    title: "Golden Ray",
    description: "Started in Kerala; registered as a company in 2019.",
  },
  {
    year: "2019",
    title: "Statewide Expansion",
    description:
      "Built the business on commercial solar, before any home subsidy existed.",
  },
  {
    year: "2022",
    title: "MNRE-registered",
    description:
      "Became an MNRE-registered vendor, ready to handle customer subsidies.",
  },
  {
    year: "2024",
    title: "Homes come first",
    description:
      "PM Surya Ghar subsidy launches, we focus on residential, going deep in Alappuzha and nearby districts.",
  },
  {
    year: "2026",
    title: "Flarize, pan-Kerala",
    description:
      "Platform launches statewide; onboarding verified install and service partners.",
    highlight: true,
  },
];

export default function Milestones() {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 xl:px-16 overflow-hidden">
      <PageIllustration isGrid={false} />

      {/* Heading */}
      <div className="relative max-w-7xl mx-auto text-center mb-12">
        <p className="text-sm md:text-base font-semibold text-[#123532] mb-3">
          Our Milestones
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#123532]">
          How we got here
        </h2>
      </div>

      {/* Timeline — horizontal snap-scroll carousel on mobile, full row from lg up */}
      <div className="relative max-w-7xl mx-auto -mx-4 px-4 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-auto lg:px-0 lg:overflow-visible">
        <div className="flex items-stretch gap-4 pb-2 pt-2 sm:gap-6">
          {milestones.map((milestone, index) => (
            <div
              key={milestone.year}
              className="relative snap-start flex-shrink-0 w-[42vw] sm:w-[220px] lg:w-auto lg:flex-1"
            >
              {/* Connecting line, at the vertical center of the box, reaching into the gap */}
              {index < milestones.length - 1 && (
                <span className="absolute top-1/2 -right-4 z-0 h-[2px] w-4 -translate-y-1/2 bg-[#123532]/30 sm:-right-6 sm:w-6" />
              )}

              <div
                className={`relative h-full w-full rounded-xl p-5 ${
                  milestone.highlight
                    ? "bg-[#F7BA41]"
                    : "bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
                }`}
              >
                {/* Dot, straddling the box's top border */}
                <span className="absolute left-1/2 top-0 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#123532]" />

                <p
                  className={`text-sm font-bold mb-2 ${
                    milestone.highlight ? "text-[#123532]" : "text-[#F7BA41]"
                  }`}
                >
                  {milestone.year}
                </p>
                <h3 className="text-lg font-bold text-[#123532] mb-2">
                  {milestone.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed ${
                    milestone.highlight ? "text-[#123532]/80" : "text-gray-500"
                  }`}
                >
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
