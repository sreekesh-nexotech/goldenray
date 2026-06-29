import React from "react";
import { Award, TrendingUp, UserCheck, Users } from "lucide-react";

const valuesData = [
  {
    icon: Award,
    title: "Ownership & Accountability",
    description:
      "We take responsibility for outcomes, not job titles. We build solutions that last and stand behind our work long after launch.",
  },
  {
    icon: TrendingUp,
    title: "Learn, Move & Execute",
    description:
      "We believe progress comes from action. We learn quickly, adapt faster, and focus on execution over endless discussions.",
  },
  {
    icon: UserCheck,
    title: "Customer-First Problem Solving",
    description:
      "Every decision starts with the customer. We solve real problems with practical solutions that create measurable value.",
  },
  {
    icon: Users,
    title: "Small Team, Big Impact",
    description:
      "We operate with a lean, high-performing team where every contribution matters and every role directly influences our mission.",
  },
];

export default function WhyFlarize() {
  return (
    <section id="why-flarize" className="py-16 px-4 sm:px-6 lg:px-8">
      {/* Heading */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4">
          Why Flarize?
        </h2>
        <p className="text-sm md:text-lg font-normal leading-relaxed text-[#444444]">
          We&apos;re a group of builders, thinkers, and doers obsessed with
          creating value.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {valuesData.map((value, index) => {
          const Icon = value.icon;
          return (
            <div
              key={index}
              className="bg-[#123532] rounded-2xl p-6 lg:p-8 flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-full bg-[#3a5b58] flex items-center justify-center mb-6">
                <Icon className="w-7 h-7 text-white" strokeWidth={1.8} />
              </div>
              <h3 className="text-lg md:text-xl font-semibold leading-snug text-white mb-4">
                {value.title}
              </h3>
              <p className="text-sm font-normal leading-relaxed text-[#B9C4C2]">
                {value.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
