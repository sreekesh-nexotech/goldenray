import ServiceItem from "@/components/Home/ServiceItem";
import Image from "next/image";
import vector1 from '../../../public/Vector (1).png'
import vector2 from '../../../public/Vector (2).png'
import vector3 from '../../../public/Vector (3).png'
import vector4 from '../../../public/Vector (4).png'
import vector5 from '../../../public/Vector (5).png'

type servicesProps = {
  serviceTitle:string;
}


export default function Services({serviceTitle}:servicesProps) {
  return (
    // Main container for the section, using Tailwind for padding and background
    <section className="py-16 sm:py-20  font-inter mb-10 lg:mb-20 mt-10">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h1 className="text-3xl md:text-4xl lg:text-[64px] font-semibold text-[#123532] mb-15 text-center">
          {serviceTitle}
        </h1>

        {/* Grid for service items */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5  justify-items-center">
          {/* Service Item 1: Fastest Installation */}
          <ServiceItem
            icon={
              <Image src={vector1} width={35} height={35} alt="Vector 1"/>
            }
            title="Fastest Installation"
            bgColor="#FDF6D2"
          />

          {/* Service Item 2: 10 Year Warranty period */}
          <ServiceItem
            icon={
              <Image src={vector2} width={35} height={35} alt="Vector 1"/>
            }
            title="10 Year Warranty period"
            bgColor="#ADD6D8"
          />

          {/* Service Item 3: Support with getting Subsidy */}
          <ServiceItem
            icon={
              <Image src={vector3} width={35} height={35} alt="Vector 1"/>
            }
            title="Support with getting Subsidy"
            bgColor="#FBE8DA"
          />

          {/* Service Item 4: Multiple EMI options */}
          <ServiceItem
            icon={
              <Image src={vector4} width={35} height={35} alt="Vector 1"/>
            }
            title="Multiple EMI options"
            bgColor="#FBF1BD"
          />

          {/* Service Item 5: Quick Repairs & Annual checkups --wrap it inside a div and used span property to make it center in mobile*/}
          <div className="col-span-2 md:col-span-1 justify-self-center">
            <ServiceItem
                icon={<Image src={vector5} width={35} height={35} alt="Vector 5" />}
                title="Quick Repairs & Annual checkups"
                bgColor="#C3E0BD"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
