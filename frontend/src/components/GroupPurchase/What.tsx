import Image from "next/image";

export default function What() {
  const features = [
    {
      number: "01",
      title: "10 families in your area book together",
      description:
        "You reserve a spot with ₹1,000 (fully refundable). Flarize matches your home with 9 other families within your pincode area. Groups typically form in 10-15 days. You never need to contact or coordinate with other members.",
    },
    {
      number: "02",
      title: "All 10 homes installed in the same week",
      description:
        "Our installation crew travels to your area once and completes all 10 systems in 5-7 days. No repeat travel, no repeat logistics. Same batch of Waaree or Adani mono PERC panels. Same Sungrow grid-tied inverter. All 10 KSEB net metering applications filed together for faster processing.",
    },
    {
      number: "03",
      title: "Same quality as individual booking — just ₹10,000 cheaper",
      description:
        "Your panels, inverter, warranty, and installation are identical to a solo booking. ALMM-listed, BIS-certified, DCR-compliant panels. 25-year panel warranty. 10-year inverter warranty. PM Surya Ghar subsidy (up to ₹78,000) filed by Flarize. The only difference is the group discount.",
    },
    {
      number: "04",
      title: "If the group doesn't form — full refund and locked pricing",
      description:
        "If we cannot find 10 families in your area within 30 days, your ₹1,000 is refunded to your original payment method within 48 hours. And your individual pricing stays locked at the group rate anyway. Zero risk either way.",
    },
  ];

  return (
    <section className="relative py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16 ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-[#123532] text-4xl md:text-5xl font-semibold leading-tight mb-3 sm:mb-4 md:mb-5 lg:mb-6">
          What Is Group Solar Purchasing?
        </h2>

        {/* Description */}
        <p className="text-sm md:text-xl font-normal leading-relaxed mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          Group solar purchasing is a bulk installation model exclusive to
          Flarize. 10 families in the same Kerala locality book together, and we
          install all homes in a single coordinated week. Each home gets its own
          dedicated on-grid solar system with individual KSEB net metering. The
          group element is purely logistical — shared scheduling and bulk
          material ordering drive costs down by ₹10,000 per home.
        </p>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          {/* Left Column - Image */}
          <div className="relative w-full h-[250px] sm:h-[280px] md:h-[320px] lg:h-[350px] xl:h-[380px] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/img (7).png"
              alt="Aerial view of neighborhood with solar panels on rooftops"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Right Column - Features */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col">
                {/* Number and Title */}
                <div className="flex items-start gap-2 sm:gap-3 mb-1">
                  <span className="text-[#F59E0B] text-base md:text-xl font-semibold leading-snug flex-shrink-0">
                    {feature.number}
                  </span>
                  <h3 className="text-[#123532] text-xl md:text-2xl font-semibold leading-snug">
                    {feature.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-[#6B7280] text-xs md:text-base font-normal leading-normal pl-6 sm:pl-8 md:pl-9">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
