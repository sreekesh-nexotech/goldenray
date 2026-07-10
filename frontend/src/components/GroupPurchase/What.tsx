import Image from "next/image";
import { Check, HelpCircle } from "lucide-react";

export default function What() {
  const features = [
    {
      number: "01",
      title: "Lower Installation Cost",
      description:
        "Group purchasing helps reduce logistics and installation costs.",
    },
    {
      number: "02",
      title: "Faster Project Scheduling",
      description:
        "Homes are installed together, reducing waiting time.",
    },
    {
      number: "03",
      title: "Same Equipment & Warranty",
      description:
        "You receive the same panels, inverter, and warranty as individual customers.",
    },
    {
      number: "04",
      title: "Risk-Free Participation",
      description:
        "Refund available if the group doesn't form.",
    },
  ];

  return (
    <section className="relative py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16 ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-[#123532] text-4xl md:text-5xl font-semibold leading-tight mb-3 sm:mb-4 md:mb-8 lg:mb-12">
          Why Homeowners Choose Group Solar
        </h2>

        

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
                  <span className="text-[#F59E0B] text-base md:text-lg font-medium leading-snug flex-shrink-0">
                    {feature.number}
                  </span>
                  <h3 className="text-[#123532] text-lg md:text-xl font-medium leading-snug">
                    {feature.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-[#6B7280] text-xs md:text-base font-medium leading-normal pl-6 sm:pl-8 md:pl-9">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Risk-free reassurance card */}
        <div className="mt-8 sm:mt-10 md:mt-12 rounded-2xl border border-[#001F1D1A] bg-[#ADD6D880] px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="flex items-center gap-2 text-black text-base sm:text-lg md:text-xl font-medium leading-snug">
              <HelpCircle
                size={18}
                className="shrink-0 text-black"
              />
              What if the group isn&apos;t completed?
            </h3>
            <span className="shrink-0 rounded-full bg-[#16A34A] px-3 py-1 text-xs  font-medium text-white">
              Zero risk either way
            </span>
          </div>

          <p className="mt-3 text-[#444444] text-lg sm:text-xl leading-relaxed">
            A group is formed when{" "}
            <span className="font-semibold ">
              at least 5 families join
            </span>
            . If the required group size isn&apos;t reached within the specified
            period, you can receive a full refund or continue individually at your
            locked price.
          </p>

          <div className="mt-3 flex items-center gap-2 text-[#444444] text-lg sm:text-xl">
            <Check size={16} className="shrink-0 " />
            Full refund within 48 hours
          </div>
        </div>
      </div>
    </section>
  );
}
