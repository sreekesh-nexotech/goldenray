// src/components/SolutionsPage/WorkSection.tsx
import Image from "next/image";
import { WorkSectionData } from "@/data/solutions-page-data";

interface WorkSectionProps {
  data: WorkSectionData;
}

export default function WorkSection({ data }: WorkSectionProps) {
  return (
    <section className="w-full py-12 md:py-16 px-4 md:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-10 lg:p-12">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
            {/* Text Content */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-6">
                {data.title}
              </h2>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                {data.description}
              </p>
            </div>

            {/* Image */}
            <div className="w-full lg:w-1/2">
              <div className="relative w-full h-[280px] md:h-[320px] lg:h-[350px]">
                <Image
                  src={data.image}
                  fill
                  alt={data.title}
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
