import React from "react";
import Image from "next/image";
import LinkingButton from "../ui/LinkingButton";

const features = [
  {
    icon: "/images/sollarWarranty/imageComponentsBreakpoints/Frame 2147225376.png",
    title: "Live system monitoring and reporting",
  },
  {
    icon: "/images/sollarWarranty/imageComponentsBreakpoints/Frame 2147225376 (1).png",
    title: "Priority support for maintenance and service issues",
  },
  {
    icon: "/images/sollarWarranty/imageComponentsBreakpoints/Frame 2147225376 (2).png",
    title: "Warranty assistance and preventive care guidance",
  },
];

const LongTermSupport = () => {
  return (
    <section className="relative w-full bg-white py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left */}
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4">
            Long-Term Solar Support That Stays With You
          </h2>
          <p className="text-sm md:text-base text-[#757575] leading-relaxed mb-6 max-w-xl">
            SolarCare helps keep your solar system performing efficiently with
            ongoing monitoring, maintenance support, warranty assistance, and
            performance tracking — long after installation.
          </p>

          <ul className="space-y-5 mb-6">
            {features.map((f) => (
              <li
                key={f.title}
                className="flex items-center gap-4 text-sm md:text-base text-[#1F2937] leading-relaxed"
              >
                <Image
                  src={f.icon}
                  alt={f.title}
                  width={36}
                  height={36}
                  className="shrink-0 w-9 h-9 object-contain"
                />
                <span>{f.title}</span>
              </li>
            ))}
          </ul>

          <p className="text-sm md:text-base text-[#4B5563] leading-relaxed mb-6 max-w-xl">
            Want to know more about SolarCare? Download our brochure to explore
            support plans, service inclusions, and long-term care options.
          </p>
        </div>

        {/* Right Image */}
        <div className="relative w-full aspect-[4/3] max-w-xl mx-auto">
          <Image
            src="/images/sollarWarranty/LongTermSupportImage(right side).png"
            alt="Long-term solar support illustration"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain"
          />
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm md:text-lg text-[#123532] font-semibold">
          Want to know more about SolarCare?
          <span className="text-sm md:text-lg font-normal text-[#374151]">
            {" "}
            Download our brochure to explore support plans, service inclusions,
            and long-term care options.
          </span>
        </p>

        <div className="flex justify-center gap-6 mt-6">
          <LinkingButton
            content="Talk to Our Team"
            ButtonLink="#contact"
            ButtonBg="bg-[#F7BA41]"
            Buttontext="text-[#272218]"
            ButtonHover="hover:bg-yellow-500"
            className="min-w-[220px] h-12 px-6 text-sm md:text-base rounded-full"
          />

          <LinkingButton
            content={
              <div className="flex items-center gap-3">
                <Image
                  src="/images/sollarWarranty/imageComponentsBreakpoints/Whatsappicon.png"
                  alt="WhatsApp icon"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <span>Send a WhatsApp message</span>
              </div>
            }
            ButtonLink="https://wa.me/919995010043"
            ButtonBorder="border border-[#074A4D]"
            ButtonBg="bg-white"
            Buttontext="text-[#074A4D]"
            ButtonHover="hover:bg-[#F3F4F6]"
            className="min-w-[260px] h-12 px-6 text-sm md:text-base rounded-full border-2"
          />
        </div>
      </div>
    </section>
  );
};

export default LongTermSupport;
