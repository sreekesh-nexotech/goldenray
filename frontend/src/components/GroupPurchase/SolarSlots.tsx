import Link from "next/link";
import LinkingButton from "../ui/LinkingButton";

// Mock data shaped like the future group-slots API response.
// familiesJoined === 0 → "No Group Yet" empty state.
// familiesJoined > 0 → progress bar and joined count fill in, first-family bonus hides.
type SolarSlot = {
  location: string;
  maxFamilies: number;
  familiesJoined: number;
  bonus: number;
};

const slots: SolarSlot[] = [
  { location: "Alappuzha", maxFamilies: 5, familiesJoined: 0, bonus: 5000 },
  { location: "Thrissur", maxFamilies: 5, familiesJoined: 2, bonus: 5000 },
  { location: "Kollam", maxFamilies: 5, familiesJoined: 5, bonus: 5000 },
];

export default function SolarSlots() {
  return (
    <section className="relative py-12 sm:py-14 md:py-16 lg:py-20 xl:py-24 2xl:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-[#123532] text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-center mb-4">
          Active group solar slots near you
        </h2>

        {/* Slot rules */}
        <p className="text-[#9CA3AF] text-xs md:text-sm text-right mb-4">
          Max {slots[0].maxFamilies} families each &middot; Resets monthly
        </p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {slots.map((slot) => {
            const percent = Math.round(
              (slot.familiesJoined / slot.maxFamilies) * 100
            );
            const hasGroup = slot.familiesJoined > 0;
            const isFull = slot.familiesJoined >= slot.maxFamilies;

            return (
              <div
                key={slot.location}
                className="rounded-xl border border-gray-200 bg-white p-5"
              >
                {/* Header with location and status */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[#123532] text-base font-bold leading-snug">
                    {slot.location}
                  </h3>
                  <span className="text-[#9CA3AF] text-xs whitespace-nowrap ml-3">
                    {isFull
                      ? "Group Full"
                      : hasGroup
                      ? `${slot.familiesJoined} of ${slot.maxFamilies} joined`
                      : "No Group Yet"}
                  </span>
                </div>

                {/* Progress */}
                <div className="flex items-center justify-between text-xs text-[#9CA3AF] mb-1.5">
                  <span>
                    {slot.familiesJoined} of {slot.maxFamilies} families
                  </span>
                  <span>{percent}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-gray-100 mb-4 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#123532]"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {/* First-family leader bonus — only while the group has no one yet */}
                {!hasGroup && (
                  <div className="flex items-center gap-2 mb-4 text-xs md:text-sm">
                    <span>🏆</span>
                    <span className="text-[#059669]">
                      First-family leader bonus: +₹
                      {slot.bonus.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                {/* CTA Button */}
                <Link
                  href={isFull ? "#" : "#reserve"}
                  aria-disabled={isFull}
                  className={`flex items-center justify-center w-full px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                    isFull
                      ? "bg-gray-100 text-gray-400 pointer-events-none"
                      : "bg-[#F7BA41] text-[#272218] hover:bg-[#e6a73a]"
                  }`}
                >
                  {isFull ? "Group Full" : "Join this area"}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="text-center">
          <p className="text-[#6B7280] text-sm md:text-base font-normal leading-relaxed mb-6 max-w-3xl mx-auto">
            <span className="font-semibold text-[#123532]">
              Your area not listed?
            </span>{" "}
            Reserve your spot and we start matching families near you. Most
            group solar slots in Kerala fill within 10-15 days. We serve all
            14 districts — from Kasaragod to Thiruvananthapuram.
          </p>

          {/* Reserve Button */}
          <LinkingButton
            content="Reserve & We'll Match You"
            ButtonLink="#reserve"
            ButtonBg="bg-[#F7BA41]"
            ButtonHover="hover:bg-[#e6a73a]"
            Buttontext="text-[#272218]"
          />
        </div>
      </div>
    </section>
  );
}
