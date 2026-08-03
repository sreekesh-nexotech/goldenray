import React from "react";
import StatCard from "@/components/About/StatCard";

const statsData = [
  {
    value: "8+",
    label: "YEARS OF EXPERIENCE",
    description: "Years of Making solar simple & accessible.",
    highlight: "simple & accessible.",
  },
  {
    value: "300+",
    label: "PROJECTS",
    description: "Projects powering  homes & businesses",
    highlight: " homes & businesses",
  },
  {
    value: "4.9/5",
    label: "CUSTOMER RATING",
    description: "Average rating from customers we've installed for.",
    highlight: "rating from customers",
  },
  {
    value: "2,000+",
    label: "kW Installed",
    description: "kW clean energy enabled",
    highlight: "kW clean energy",
  },
];

export default function StatsSection() {
  return (
    // Main section container with padding and background color.
    <section className="px-4 pt-8 pb-8 sm:pt-12 sm:pb-12 lg:pt-16 lg:pb-16 sm:px-6 lg:px-8 ">
      <div className="max-w-7xl mx-auto grid grid-cols-2  gap-2 sm:gap-4 sm:grid-cols-4 lg:grid-cols-4  border-gray-200">
        {/* Map through the statsData array to render each StatCard */}
        {statsData.map((stat, index) => (
          <div
            key={index}
            className={`${
              // Add right border for all cards except the last one in each row
              index !== statsData.length - 1 && index % 2 === 0
                ? "border-r sm:border-r"
                : ""
            } ${
              // For larger screens, add border to all except the last card
              index !== statsData.length - 1 ? "sm:border-r" : ""
            } border-gray-300`}
          >
            <StatCard
              value={stat.value}
              label={stat.label}
              description={stat.description}
              highlight={stat.highlight}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
