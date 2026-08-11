import Image from "next/image";
import vector1 from "../../../public/Vector-1.png";
import vector2 from "../../../public/Vector-2.png";
import vector3 from "../../../public/Vector-3.png";
import vector4 from "../../../public/Vector-4.png";
import vector5 from "../../../public/Vector-5.png";

const services = [
  {
    icon: vector1,
    title: "Fastest Installation",
    bgColor: "#FDF6D2",
  },
  {
    icon: vector2,
    title: "Save Upto 90% on bills",
    bgColor: "#D4EEF0",
  },
  {
    icon: vector3,
    title: "Support with getting Subsidy",
    bgColor: "#FBE8DA",
  },
  {
    icon: vector4,
    title: "Multiple EMI options",
    bgColor: "#FBF1BD",
  },
  {
    icon: vector5,
    title: "Quick Repairs & Annual checkups",
    bgColor: "#C3E0BD",
  },
];

const AboutServices = () => {
  return (
    <section
      id="team"
      className="scroll-mt-[65px] py-16 px-4 sm:px-6 lg:px-4 xl:px-16"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-left sm:text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-[#123532]">
            Why choose our solar solutions?
          </h2>
        </div>

        {/* Services */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-8 gap-x-4">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`flex flex-col items-center text-center gap-3 ${
                index === services.length - 1
                  ? "col-span-2 sm:col-span-1"
                  : ""
              }`}
            >
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: service.bgColor }}
              >
                <Image
                  src={service.icon}
                  width={28}
                  height={28}
                  alt={service.title}
                  className="w-6 h-6 sm:w-7 sm:h-7"
                />
              </div>
              <p className="text-sm sm:text-base font-semibold text-[#123532] leading-snug max-w-[140px]">
                {service.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutServices;
