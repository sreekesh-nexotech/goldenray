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
      "We simplify solar energy adoption with seamless solutions, transparent pricing, and expert support—so homeowners and businesses can switch to renewable energy with confidence.",
  },
  {
    number: "02",
    title: "Our Vision",
    description:
      "Making clean energy simple, accessible, and the standard for everyone.",
    isHighlighted: true, // Flag to apply special styling (e.g., shadow)
  },
  {
    number: "03",
    title: "Our Goals",
    description:
      "Make solar energy easy, affordable, and reliable while helping customers save money and support a greener future with full transparency.",
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
            // Conditionally apply a shadow to the middle card (Our Vision)
            className={
              goal.isHighlighted
                ? "bg-white rounded-2xl shadow-[0_0_15px_#A98F383D]"
                : ""
            }
          />
        ))}
      </div>
    </section>
  );
}
