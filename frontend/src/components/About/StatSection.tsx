import React from "react";
import StatCard from "@/components/About/StatCard";

const statsData = [
  {
    value: "10+",
    label: "YEARS OF EXPERIENCE",
    description: "Years of Making solar simple & accessible",
    highlight: "simple & accessible",
  },
  {
    value: "5,000+",
    label: "PROJECTS",
    description: "Projects in powering homes & businesses",
    highlight: "homes & businesses",
  },
  {
    value: "4.9/5",
    label: "CUSTOMER RATING",
    description: "Trusted by thousands for solar solutions",
    highlight: "Trusted",
  },
  {
    value: "50,000+",
    label: "CO2 REDUCED (TONS)",
    description: "Cutting Carbon footprints in Tonnes",
    highlight: "Carbon footprints in Tonnes",
  },
];

export default function StatsSection() {
  return (
    // Main section container with padding and background color.
    <section className="px-4 pt-8 pb-8 sm:pt-12 sm:pb-12 lg:pt-16 lg:pb-16 sm:px-6 lg:px-8 ">
      <div className="max-w-7xl mx-auto grid grid-cols-2  gap-2 sm:gap-4 sm:grid-cols-4 lg:grid-cols-4  border-gray-200">
        {/* Map through the statsData array to render each StatCard */}
        {statsData.map((stat, index) => (
          <StatCard
            key={index} // Unique key for each card
            value={stat.value}
            label={stat.label}
            description={stat.description}
            highlight={stat.highlight}
          />
        ))}
      </div>
    </section>
  );
}
