// src/components/SolutionsPage/InfoSection.tsx
import Image from "next/image";
import { InfoSectionData } from "@/data/solutions-page-data";

interface InfoSectionProps {
  data: InfoSectionData;
  variant?: "default" | "boxed";
}

export default function InfoSection({
  data,
  variant = "default",
}: InfoSectionProps) {
  const isImageLeft = data.imagePosition === "left";
  const isBoxed = variant === "boxed";

  return (
    <section className="w-full py-12 md:py-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          className={`flex flex-col ${
            isImageLeft ? "lg:flex-row" : "lg:flex-row-reverse"
          } gap-8 lg:gap-12 items-center`}
        >
          {/* Image */}
          <div className="w-full lg:w-1/2">
            <div
              className={`relative w-full h-[280px] md:h-[350px] lg:h-[400px] rounded-2xl overflow-hidden ${
                isBoxed ? "bg-white shadow-2xl p-4 md:p-6" : "shadow-lg"
              }`}
            >
              <Image
                src={data.image}
                fill
                alt={data.title}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-xl md:text-2xl lg:text-2xl font-semibold leading-snug text-gray-900 mb-6">
              {data.title}
            </h2>
            <p className="text-gray-600 text-sm md:text-base lg:text-xl font-normal leading-relaxed">
              {data.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
