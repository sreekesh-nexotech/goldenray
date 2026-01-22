// src/components/SolutionsPage/PanelTypesSection.tsx
import Image from "next/image";
import { PanelType } from "@/data/solutions-page-data";
import vector1 from "../../../public/Vector-1.png";
import vector2 from "../../../public/Vector-2.png";
import vector3 from "../../../public/Vector-3.png";

interface PanelTypesSectionProps {
  title?: string;
  panels: PanelType[];
  variant?: "light" | "dark";
}

const vectorIcons = [vector1, vector2, vector3];

export default function PanelTypesSection({
  title = "Types of Solar Panels",
  panels,
  variant = "light",
}: PanelTypesSectionProps) {
  const isDark = variant === "dark";

  const cardBackgrounds = ["bg-[#E8F5E9]", "bg-[#E3F2FD]", "bg-[#FFF3E0]"];

  return (
    <section
      className={`w-full py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8 ${
        isDark ? "bg-[#074A4D]" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <h2
          className={`text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-10 md:mb-12 lg:mb-16 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </h2>

        {/* Panel Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 lg:gap-10">
          {panels.map((panel, index) => (
            <div
              key={index}
              className={`rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 text-center transition-all duration-300 hover:shadow-lg ${
                isDark
                  ? "bg-[#0A5D61] hover:bg-[#0B6B70]"
                  : cardBackgrounds[index % 3]
              }`}
            >
              {/* Panel Icon */}
              <div className="flex justify-center mb-6 md:mb-8">
                <div
                  className={`w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center ${
                    isDark ? "bg-[#0D7A80]" : "bg-white/50"
                  }`}
                >
                  <div className="relative w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12">
                    <Image
                      src={vectorIcons[index % 3]}
                      fill
                      alt={panel.name}
                      className="object-contain"
                      sizes="48px"
                    />
                  </div>
                </div>
              </div>

              {/* Panel Name */}
              <h3
                className={`text-base md:text-lg lg:text-xl 2xl:text-2xl font-bold mb-3 md:mb-4 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {panel.name}
              </h3>

              {/* Panel Description */}
              <p
                className={`text-sm md:text-base 2xl:text-lg leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {panel.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
