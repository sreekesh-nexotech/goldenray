// src/components/SolutionsPage/FinalThoughtsSection.tsx
import { FinalThoughtsData } from "@/data/solutions-page-data";

interface FinalThoughtsSectionProps {
  data: FinalThoughtsData;
}

export default function FinalThoughtsSection({
  data,
}: FinalThoughtsSectionProps) {
  return (
    <section className="w-full py-12 md:py-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#FFF8E7] border border-[#F7BA41] rounded-2xl p-6 md:p-8 lg:p-10">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            {data.title}
          </h3>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            {data.description}
          </p>
        </div>
      </div>
    </section>
  );
}
