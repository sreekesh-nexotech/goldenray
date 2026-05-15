// src/components/SolutionsPage/FinalThoughtsSection.tsx
import { FinalThoughtsData } from "@/data/solutions-page-data";

interface FinalThoughtsSectionProps {
  data: FinalThoughtsData;
}

export default function FinalThoughtsSection({
  data,
}: FinalThoughtsSectionProps) {
  return (
    <section className="w-full py-4 md:py-6 lg:py-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          className="rounded-2xl md:rounded-3xl p-8 md:p-10 lg:p-12"
          style={{ background: "#F7BA41" }}
        >
          <h3 className="text-base md:text-xl lg:text-2xl font-semibold leading-snug text-gray-900 mb-4 md:mb-5">
            {data.title}
          </h3>
          <p className="text-gray-800 text-sm md:text-base lg:text-xl font-normal leading-relaxed">
            {data.description}
          </p>
        </div>
      </div>
    </section>
  );
}
