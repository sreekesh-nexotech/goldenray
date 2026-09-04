import { ShieldCheck, PlugZap, RadioTower, FilePen } from "lucide-react";

const assurances = [
  {
    icon: ShieldCheck,
    title: "Safety First",
    desc: "SPD and MCB protection on both DC and AC sides.",
  },
  {
    icon: PlugZap,
    title: "Triple Earthing",
    desc: "Three dedicated earthing points protect the panels, inverter, and your home's electrical system.",
  },
  {
    icon: RadioTower,
    title: "Lightning Protection",
    desc: "Advanced LA rod protection for the entire roof area.",
  },
  {
    icon: FilePen,
    title: "All Paperwork Done",
    desc: "All Net-metering and Subsidy paperwork handled by us.",
  },
];

const SafetyAndCompliance = () => {
  return (
    <section className="relative z-10 container mx-auto px-4 py-10 md:py-16 max-w-7xl">
      <div className="rounded-3xl bg-[#F7BA41] px-6 py-8 md:px-12 md:py-12">
        {/* 2x2 on phones with left-aligned copy, one centred row from md up */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-x-8 md:gap-y-0">
          {assurances.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-start text-left md:items-center md:text-center"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#F3F4F6] md:h-12 md:w-12 md:rounded-xl">
                <Icon
                  className="h-5 w-5 text-black md:h-6 md:w-6"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>
              <h3 className="mt-3 text-sm md:text-base font-bold leading-snug text-black">
                {title}
              </h3>
              <p className="mt-1 text-sm md:text-base font-normal leading-relaxed text-[#444444]">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SafetyAndCompliance;
