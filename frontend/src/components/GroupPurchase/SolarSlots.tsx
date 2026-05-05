import Link from "next/link";
import LinkingButton from "../ui/LinkingButton";

export default function SolarSlots() {
  const slots = [
    {
      location: "Thrissur",
      status: "No Group Yet",
      description:
        "Be the first family in Thrissur. Once you book, we start matching 9 others near you. Most groups form in 10-15 days.",
      bonus: "₹15,000",
    },
    {
      location: "Alappuzha",
      status: "No Group Yet",
      description:
        "Be the first family in Thrissur. Once you book, we start matching 9 others near you. Most groups form in 10-15 days.",
      bonus: "₹15,000",
    },
    {
      location: "Kollam",
      status: "No Group Yet",
      description:
        "Be the first family in Thrissur. Once you book, we start matching 9 others near you. Most groups form in 10-15 days.",
      bonus: "₹15,000",
    },
  ];

  return (
    <section className="relative py-12 sm:py-14 md:py-16 lg:py-20 xl:py-24 2xl:py-16 ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-[#123532] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-4xl 2xl:text-4xl text-center mb-3 sm:mb-4 2xl:mb-3">
          Active Group Solar Slots Near You
        </h2>

        {/* Subheading with status */}
        <p className="text-sm sm:text-base md:text-base lg:text-lg xl:text-base 2xl:text-base text-center mb-8 sm:mb-10 md:mb-12 lg:mb-14 2xl:mb-8">
          <span className="text-[#F59E0B] font-semibold">3 of 5</span>{" "}
          <span className="text-[#6B7280]">
            open this month.Max 10 families each · Resets monthly
          </span>
        </p>

        {/* Three Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6 md:gap-6 lg:gap-8 2xl:gap-6 mb-8 sm:mb-10 md:mb-12 2xl:mb-8">
          {slots.map((slot, index) => (
            <div
              key={index}
              className="relative p-6 sm:p-7 md:p-5 2xl:p-6 border-2 border-dashed border-[#D1D5DB] rounded-2xl bg-white"
            >
              {/* Header with location and status */}
              <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-2 2xl:mb-3">
                <h3 className="text-[#123532]  text-xl sm:text-2xl md:text-xl lg:text-xl xl:text-xl 2xl:text-2xl">
                  {slot.location}
                </h3>
                <span className="text-[#6B7280] text-xs sm:text-sm md:text-sm font-medium whitespace-nowrap ml-3">
                  {slot.status}
                </span>
              </div>

              {/* Description */}
              <p className="text-[#6B7280] text-xs sm:text-sm md:text-sm lg:text-sm xl:text-sm 2xl:text-sm leading-relaxed mb-4 sm:mb-5 2xl:mb-3">
                {slot.description}
              </p>

              {/* Bonus Badge */}
              <div className="flex items-center gap-2 mb-4 sm:mb-5 md:mb-3 2xl:mb-3">
                <span className="text-lg sm:text-xl">🏆</span>
                <span className="text-[#059669] text-xs sm:text-sm md:text-xs font-medium">
                  First-family leader bonus: {slot.bonus}
                </span>
              </div>

              {/* CTA Button */}
              <Link
                href="#reserve"
                className="inline-flex items-center gap-2 text-[#F59E0B]  text-sm sm:text-base hover:gap-3 transition-all"
              >
                Start This Group
                <span>→</span>
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="text-center">
          <p className="text-[#6B7280] text-sm sm:text-base md:text-base lg:text-lg xl:text-base 2xl:text-base mb-6 sm:mb-8 2xl:mb-6 max-w-4xl mx-auto">
            Your area not listed? Reserve your spot and we start matching
            families near you. Most group solar slots in Kerala fill within
            10-15 days. We serve all 14 districts — from Kasaragod to
            Thiruvananthapuram.
          </p>

          {/* Reserve Button */}
          <LinkingButton content="Reserve & We'll Match You" ButtonLink="#reserve" ButtonBg="bg-[#F7BA41]" ButtonHover="hover:bg-[#e6a73a]" Buttontext="text-[#272218]" />
        </div>
      </div>
    </section>
  );
}
