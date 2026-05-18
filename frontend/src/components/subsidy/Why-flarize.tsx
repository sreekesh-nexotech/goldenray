import Image from "next/image";

export default function WhyFlarize() {
  const features = [
    {
      title: "MNRE Approved & KSEB Registered",
      description:
        "Official government portal vendor — your subsidy is guaranteed",
      iconUrl: "https://golden-ray.b-cdn.net/icons/license.png",
    },
    {
      title: "300+ Kerala Families Served",
      description: "8+ years operating in Kerala with a 4.9★ customer rating",
      iconUrl: "https://golden-ray.b-cdn.net/icons/acute%20(1).png",
    },
    {
      title: "₹78K Full Subsidy Guaranteed",
      description: "Credited directly to your bank account within 45–60 days",
      iconUrl:
        "https://golden-ray.b-cdn.net/icons/account_balance_wallet%20(1).png",
    },
    {
      title: "Save ₹5,000+ Every Month",
      description:
        "Slash your electricity bills from Day 1 with a 25-year system warranty",
      iconUrl: "https://golden-ray.b-cdn.net/icons/call%20(1).png",
    },
  ];

  return (
    <section
      className="py-12 sm:py-16 lg:py-20 xl:py-24 2xl:py-28"
      style={{
        background:
          "radial-gradient(100% 100% at 50% 0%, #F8F2E1 0%, rgba(255, 255, 255, 0) 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 xl:mb-18 2xl:mb-20">
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-3 sm:mb-4 lg:mb-6">
            Why 300+ Kerala Families Choose Flarize
          </h2>
          <p className="text-sm md:text-xl font-normal leading-relaxed text-[#6B7280] max-w-5xl mx-auto">
            We handle all government paperwork, KSEB registration, and subsidy
            processing while you sit back and start saving on electricity.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 xl:gap-8 2xl:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl sm:rounded-3xl lg:rounded-4xl p-4 sm:p-6 lg:p-8 xl:p-8 2xl:p-10 min-h-[280px] sm:min-h-[320px] lg:min-h-[360px] xl:min-h-[380px] 2xl:min-h-[400px] shadow-[0_4px_24px_0_rgba(0,0,0,0.08)] hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col items-center text-center"
            >
              {/* Yellow Circle with Icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 2xl:w-28 2xl:h-28 bg-[#FEF3C7] rounded-full flex items-center justify-center mb-4 sm:mb-6 lg:mb-8 xl:mb-8 2xl:mb-8 flex-shrink-0">
                <Image
                  src={feature.iconUrl}
                  alt={`${feature.title} icon`}
                  width={56}
                  height={56}
                  sizes="(min-width: 1280px) 56px, (min-width: 1024px) 48px, (min-width: 640px) 40px, 32px"
                  className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-14 2xl:h-14 object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="text-base md:text-xl font-semibold leading-snug text-[#374151] mb-3 sm:mb-4 lg:mb-5 xl:mb-5 2xl:mb-5">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-xs md:text-base font-normal leading-normal text-[#6B7280] flex-1 flex items-start">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
