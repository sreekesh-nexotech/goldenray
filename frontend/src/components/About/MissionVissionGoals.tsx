// components/MissionVisionGoals.jsx
import React from "react";
import GoalCard from "@/components/About/GoalCard";
import PageIllustration from "../ui/page-illustration";

//  Data for the Mission, Vision, and Goals section.
const goalsData = [
  {
    number: "01",
    title: "Our Mission",
    description:
      "To make solar energy adoption simple and stress-free for homes and businesses across Kerala. We do this through clear guidance, transparent pricing, and dependable expert support—so customers can switch to renewable energy with complete confidence.",
  },
  {
    number: "02",
    title: "Our Vision",
    description:
      "To see clean solar energy become a natural part of everyday life in Kerala—accessible, reliable, and trusted by every household and business.",
    isHighlighted: true, // Flag to apply special styling (e.g., shadow)
  },
  {
    number: "03",
    title: "Our Goals",
    description:
      "To deliver solar solutions that are easy to understand, affordable to adopt, and reliable over the long term, helping customers reduce electricity costs while contributing to a greener, more sustainable Kerala—with full transparency at every step.",
  },
];

// MissionVisionGoals Component
export default function MissionVisionGoals() {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 xl:px-36 lg:py-24">
      <PageIllustration isGrid={false} />
      {/* Main Heading and Introductory Paragraph Container */}
      <div className="relative max-w-7xl mx-auto text-left mb-12">
        {/* Radial Gradients Layer */}
        <h2 className="text-2xl sm:text-5xl font-semibold text-[#074A4D] mb-6">
          Mission, Vision + Goals
        </h2>
      </div>

      {/* Grid Container for the Goal Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {goalsData.map((goal, index) => (
          <GoalCard
            key={index} // Unique key for each card
            number={goal.number}
            title={goal.title}
            description={goal.description}
          />
        ))}
      </div>
    </section>
  );
}
