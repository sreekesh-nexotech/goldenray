// components/MissionVisionGoals.jsx
import React from "react";
import PageIllustration from "../ui/page-illustration";

type GoalData = {
  number: string;
  title: string;
  description: string;
  isHighlighted?: boolean;
};

//  Data for the Mission, Vision, and Goals section.
const goalsData: GoalData[] = [
  {
    number: "01",
    title: "Our Mission",
    description:
      "Give people the facts, tools, and trust to choose solar right, then build the system that lifts their daily life for 25 years.",
  },
  {
    number: "02",
    title: "Our Vision",
    description:
      "A self-powered, smarter home for every Indian family. Solar first, then the rest. We started in Kerala; we're building for the whole country.",
    isHighlighted: true,
  },
  {
    number: "03",
    title: "Our Goals",
    description:
      "Help you own your power, cut your bill, and go electric on your own terms, AC, induction, EV, backed for 25 years. Informed choices, no seller bias.",
  },
];

// MissionVisionGoals Component
export default function MissionVisionGoals() {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 xl:px-16 overflow-hidden">
      <PageIllustration isGrid={false} />

      {/* Heading */}
      <div className="relative max-w-7xl mx-auto mb-12">
        <h2 className="text-lg md:text-xl font-bold text-[#123532]">
          Mission, Vision + Goals
        </h2>
      </div>

      {/* Grid Container for the Goal Cards */}
      <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {goalsData.map((goal, index) => (
          <div
            key={index}
            className={
              goal.isHighlighted
                ? "rounded-2xl bg-white shadow-xl p-8"
                : "p-8"
            }
          >
            <p className="text-xs font-semibold text-gray-400 mb-6">
              {goal.number}
            </p>
            <h3 className="text-2xl font-bold text-[#123532] mb-3">
              {goal.title}
            </h3>
            <p className="text-sm md:text-base text-gray-500 leading-relaxed">
              {goal.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
