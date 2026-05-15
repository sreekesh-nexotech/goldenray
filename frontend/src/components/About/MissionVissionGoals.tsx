// components/MissionVisionGoals.jsx
import React from "react";
import PageIllustration from "../ui/page-illustration";

type GoalItem = {
  title: string;
  description: string;
};

type GoalData = {
  number: string;
  title: string;
  descriptionBold?: string;
  descriptionParagraphs?: string[];
  goals?: GoalItem[];
  isHighlighted?: boolean;
};

//  Data for the Mission, Vision, and Goals section.
const goalsData: GoalData[] = [
  {
    number: "01",
    title: "Our Mission",
    descriptionBold:
      "Most people buy solar to save money on bills. We think that's backward.",
    descriptionParagraphs: [
      "Solar should be about living better—running your home the way you want, without checking the meter every time someone turns on the AC.",
      "That requires understanding what you're actually buying. Not just comparing quotes. We're here to close that gap.",
    ],
  },
  {
    number: "02",
    title: "Our Vision",
    descriptionBold: "Honestly? We want to make electricity bills irrelevant.",
    descriptionParagraphs: [
      "Not in a grand save-the-planet way (though that's nice). In a practical, everyday way.",
      "Where your mom doesn't think twice before running the AC for your kids. Where working from home doesn't mean rationing power. Where adding appliances is about need, not anxiety.",
      "Solar adoption should feel obvious, not risky.",
    ],
    isHighlighted: true,
  },
  {
    number: "03",
    title: "Our Goals",
    goals: [
      {
        title: "Educate before selling",
        description: "Help people understand risks, not just benefits",
      },
      {
        title: "Outlast individual companies",
        description: "Your support shouldn't depend on one EPC surviving",
      },
      {
        title: "Set actual standards",
        description: "Consistent quality across India's chaotic solar market",
      },
      {
        title: "Enable better living",
        description: "Not just lower bills, but genuine energy freedom",
      },
      {
        title: "Grow responsibly",
        description: "City by city, without sacrificing reliability for speed",
      },
    ],
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
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#074A4D] mb-6">
          Mission, Vision + Goals
        </h2>
      </div>

      {/* Grid Container for the Goal Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {goalsData.map((goal, index) => (
          <div
            key={index}
            className="relative px-5 py-5 flex flex-col items-start rounded-2xl transition-all duration-300 ease-in-out hover:bg-white hover:shadow-[0_0_15px_#A98F383D] hover:-translate-y-1"
          >
            {/* Number */}
            <p className="text-base md:text-xl font-semibold leading-snug text-black mb-6">
              {goal.number}
            </p>
            {/* Title */}
            <h3 className="text-xl md:text-2xl font-semibold leading-snug text-[#121217] mb-4">
              {goal.title}
            </h3>
            {/* Description */}
            <div className="text-sm md:text-xl font-normal leading-relaxed text-[#666666]">
              {goal.descriptionBold && (
                <p className="font-bold mb-3">{goal.descriptionBold}</p>
              )}
              {goal.descriptionParagraphs?.map((para, idx) => (
                <p key={idx} className="mb-3">
                  {para}
                </p>
              ))}
              {goal.goals && (
                <ul className="space-y-3">
                  {goal.goals.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2 mt-1 text-green-600">✓</span>
                      <span>
                        <span className="font-bold">{item.title}</span>
                        <span className="text-[#666666]">
                          {" "}
                          - {item.description}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
