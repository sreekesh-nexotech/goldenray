import {
  Clock,
  IndianRupee,
  Receipt,
  Star,
  Tag,
  User,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

// Single source of truth — both the desktop table and the mobile cards render
// from this, so the two layouts can never drift apart.
type Row = {
  key: string;
  icon: LucideIcon;
  header: string; // desktop column heading
  label: string; // mobile row label
  individual: string;
  group: string;
};

const ROWS: Row[] = [
  {
    key: "system",
    icon: IndianRupee,
    header: "System cost (5kW)",
    label: "System Cost",
    individual: "₹2,50,000",
    group: "₹2,40,000",
  },
  {
    key: "discount",
    icon: Tag,
    header: "Group discount",
    label: "Group Discount",
    individual: "Not applicable",
    group: "– ₹10,000",
  },
  {
    key: "timeline",
    icon: Clock,
    header: "Installation timeline",
    label: "Timeline",
    individual: "4–6 weeks scheduling",
    group: "Group week — faster",
  },
  {
    key: "booking",
    icon: Receipt,
    header: "Booking amount",
    label: "Booking Fee",
    individual: "₹5,000",
    group: "₹1,000 (fully refundable)",
  },
];

const DESKTOP_GRID = "grid grid-cols-[1.2fr_1fr_1fr_1.2fr_1.2fr] gap-4";

const Quality = () => {
  return (
    <section className="relative py-12 sm:py-14 md:py-16 lg:py-20 xl:py-24 2xl:py-16 ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-[#123532] text-4xl md:text-5xl font-semibold leading-tight text-center mb-3 sm:mb-4 2xl:mb-3">
          Why cheaper doesn&apos;t mean lower quality
        </h2>
        <p className="hidden md:block text-base md:text-lg text-[#757575] mb-8 text-center">
          When one home books solo, our crew makes a separate trip, files one
          KSEB application, and handles permits individually. That overhead adds
          ₹8,000–12,000 per install. In a group, one trip covers all 10. The
          saving is in logistics — not materials.
        </p>

        {/* ── Desktop: comparison table ── */}
        <div className="hidden md:block rounded-2xl bg-[#F7BA41] p-6 lg:p-8">
          {/* Column headings */}
          <div
            className={`${DESKTOP_GRID} border-b border-black/15 pb-4 text-base text-[#444444]`}
          >
            <div>What&apos;s Included</div>
            {ROWS.map((r) => (
              <div key={r.key}>{r.header}</div>
            ))}
          </div>

          {/* Individual Install */}
          <div
            className={`${DESKTOP_GRID} items-center py-5 text-base lg:text-lg font-medium text-black`}
          >
            <div className="font-bold">Individual Install</div>
            {ROWS.map((r) => (
              <div key={r.key} className="flex items-center gap-1.5">
                {r.key === "discount" && (
                  <X size={16} className="shrink-0" />
                )}
                {r.individual}
              </div>
            ))}
          </div>

          {/* Group Install — highlighted white row */}
          <div
            className={`${DESKTOP_GRID} items-center rounded-xl bg-white px-4 py-5 text-lg lg:text-xl text-[#123532] font-medium `}
          >
            <div className="font-bold">Group Install</div>
            {ROWS.map((r) => (
              <div
                key={r.key}
                className={
                  r.key === "discount" ? "font-semibold " : ""
                }
              >
                {r.group}
              </div>
            ))}
          </div>

          {/* Footnote */}
          <p className="mt-5 text-center text-base text-[#444444]">
            Both include installation, KSEB net metering, PM Surya Ghar subsidy
            filing and 25-year panel warranty. Booking fee{" "}
            <span className="font-semibold">₹1,000 fully refundable</span>.
          </p>
        </div>

        {/* ── Mobile: stacked cards ── */}
        <div className="space-y-4 md:hidden">
          {/* Individual Install */}
          <div className="rounded-2xl bg-[#F3F4F6] p-5">
            <div className="mb-4 flex items-center gap-2 text-[#123532]">
              <User size={18} />
              <span className="text-base font-bold">Individual Install</span>
            </div>
            <ul className="space-y-3">
              {ROWS.map((r) => {
                const Icon = r.icon;
                return (
                  <li
                    key={r.key}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="flex items-center gap-2 text-[#6B7280]">
                      <Icon size={15} className="shrink-0" />
                      {r.label}
                    </span>
                    <span className="text-right font-semibold text-[#123532]">
                      {r.individual}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Group Install */}
          <div className="rounded-2xl bg-[#F7BA41] p-5">
            <div className="mb-4 flex items-center gap-2 text-[#123532]">
              <Users size={18} />
              <span className="text-base font-bold">Group Install</span>
              <Star size={16} className="fill-[#123532] text-[#123532]" />
            </div>
            <ul className="space-y-3">
              {ROWS.map((r) => {
                const Icon = r.icon;
                return (
                  <li
                    key={r.key}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="flex items-center gap-2 text-[#123532]/80">
                      <Icon size={15} className="shrink-0" />
                      {r.label}
                    </span>
                    <span className="text-right font-bold text-[#123532]">
                      {r.group}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Quality;
