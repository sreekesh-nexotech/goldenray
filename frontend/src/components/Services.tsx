import ServiceItem from "@/components/ServiceItem";
import Image from "next/image";
import vector1 from "../../public/Vector-1.png";
import vector2 from "../../public/Vector-2.png";
import vector3 from "../../public/Vector-3.png";
import vector4 from "../../public/Vector-4.png";
import vector5 from "../../public/Vector-5.png";

type servicesProps = {
  serviceTitle: string;
};

export default function Services({ serviceTitle }: servicesProps) {
  return (
    // Main container for the section
    <section className="py-16 sm:py-20 xl:py-12 font-inter">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl lg:text-4xl 2xl:text-5xl font-semibold text-[#123532] mb-12 text-center">
          {serviceTitle}
        </h2>

        {/* Grid for service items */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          {/* Service Item 1: Fastest Installation */}
          <ServiceItem
            icon={
              <Image
                src={vector1}
                width={50}
                height={50}
                alt="Fastest Installation"
                className="w-6 h-6 sm:w-12 sm:h-12"
              />
            }
            title="Fastest Installation"
            description="Flarize's certified team: 2–6 days from start to activation. 300+ installations. No delays, no excuses."
            bgColor="#FDF6D2"
          />

          {/* Service Item 2: Transparent Pricing */}
          <ServiceItem
            icon={
              <Image
                src={vector2}
                width={40}
                height={40}
                alt="Transparent Pricing"
                className="w-6 h-6 sm:w-10 sm:h-10"
              />
            }
            title="Transparent Pricing"
            description="Compare options clearly before you decide. No hidden charges, confusing upgrades, or last-minute surprises."
            bgColor="#D4EEF0"
          />

          {/* Service Item 3: Support with getting Subsidy */}
          <ServiceItem
            icon={
              <Image
                src={vector3}
                width={50}
                height={50}
                alt="Subsidy Support"
                className="w-6 h-6 sm:w-12 sm:h-12"
              />
            }
            title="Support with Getting Subsidy"
            description="We handle your entire PM Surya Ghar application. Up to ₹78,000 MNRE subsidy — paperwork to bank transfer."
            bgColor="#FBE8DA"
          />

          {/* Service Item 4: Multiple EMI options */}
          <ServiceItem
            icon={
              <Image
                src={vector4}
                width={40}
                height={40}
                alt="EMI Options"
                className="w-6 h-6 sm:w-10 sm:h-10"
              />
            }
            title="Multiple EMI Options"
            description="Starting ₹2,000/month. In most cases, your EMI costs less than your current KSEB bill. Redirect, don't add."
            bgColor="#FBF1BD"
          />

          {/* Service Item 5: Quick Repairs & Annual checkups */}
          <ServiceItem
            icon={
              <Image
                src={vector5}
                width={40}
                height={40}
                alt="Repairs & Checkups"
                className="w-6 h-6 sm:w-10 sm:h-10"
              />
            }
            title="Quick Repairs & Annual Checkups"
            description="Your installer won't disappear. Scheduled solar panel maintenance, performance monitoring, and fast repairs across Kerala."
            bgColor="#C3E0BD"
          />
        </div>
      </div>
    </section>
  );
}
