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
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 md:mb-5">
            {data.title}
          </h3>
          <p className="text-gray-800 text-base md:text-lg lg:text-xl leading-relaxed">
            {data.description}
          </p>
        </div>
      </div>
    </section>
  );
}
