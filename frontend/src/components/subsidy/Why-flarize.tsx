export default function WhyFlarize() {
  const features = [
    {
      title: "MNRE Approved & KSEB Registered",
      description: "Official govt portal vendor—your subsidy is guaranteed",
      iconUrl: "https://golden-ray.b-cdn.net/icons/license.png",
    },
    {
      title: "2-3 Day\nInstallation",
      description: "Fastest in Kerala (others take 7-10 days)",
      iconUrl: "https://golden-ray.b-cdn.net/icons/acute%20(1).png",
    },
    {
      title: "₹78K Full Subsidy Guaranteed",
      description: "Credited in 30 days—every customer gets their full amount",
      iconUrl: "https://golden-ray.b-cdn.net/icons/account_balance_wallet%20(1).png",
    },
    {
      title: "5-Year Service + 24/7 Helpline",
      description: "Free priority service + expert helpline: 1800-XXX-XXXX",
      iconUrl: "https://golden-ray.b-cdn.net/icons/call%20(1).png",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#123532] mb-4">
            Why 1,200+ Kerala Families Choose Flarize
          </h2>
          <p className="text-xl md:text-2xl font-semibold text-[#123532] mb-3">
            Zero Hassle. Full Subsidy. Expert Support.
          </p>
          <p className="text-base md:text-lg text-gray-600 max-w-4xl mx-auto">
            We handle all government paperwork, KSEB registration, and subsidy
            processing while you sit back and start saving on electricity.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mt-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-6 md:p-8 min-h-[260px] md:min-h-[280px] shadow-[0_4px_24px_0_rgba(0,0,0,0.10)] hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.14)] transition-shadow duration-300 relative overflow-hidden flex flex-col"
              >
                {/* Icon Image at Top Right */}
                <img
                  src={feature.iconUrl}
                  alt={`${feature.title} icon`}
                  className="absolute top-0 right-0 mt-1 mr-1 w-18 h-18 md:w-30 md:h-29 object-contain opacity-30"
                />

                {/* Icon placeholder - leave empty for now as requested */}
                <div className="mb-4 md:mb-6 h-12 w-12 md:h-16 md:w-16 flex items-center justify-center flex-shrink-0">
                  {/* Icon will go here */}
                </div>

                {/* Title */}
                <h3 className="text-sm md:text-xl lg:text-2xl font-semibold text-[#6B7280]  md:leading-snug h-14 md:h-16 lg:h-20">
                  {feature.title.split("\n").map((line, i, arr) => (
                    <span key={i}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </span>
                  ))}
                </h3>

                {/* Description */}
                <p
                  className="text-xs md:text-base lg:text-lg leading-relaxed"
                  style={{ color: "#6B7280" }}
                >
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
