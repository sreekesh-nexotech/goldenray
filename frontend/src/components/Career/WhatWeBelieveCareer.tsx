import React from "react";

const beliefs = [
  {
    title: "Transparency",
    description:
      "We share information early and often. Bad news travels fast, so we can solve it together.",
  },
  {
    title: "Ownership",
    description:
      "No one is \"above\" any task. We act as owners because we are all invested in the outcome.",
  },
  {
    title: "Learning",
    description:
      "Curiosity is our fuel. We prize the ability to learn and adapt over static expertise.",
  },
  {
    title: "Community",
    description:
      "We are part of Kerala's fabric. We build for our neighbors, our families, and our future.",
  },
];

export default function WhatWeBelieveCareer() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-[#ECB94A] rounded-3xl p-8 sm:p-12 lg:p-16">
        <h2 className="text-3xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4">
          What We Believe In
        </h2>
        <p className="text-sm md:text-lg font-normal leading-relaxed text-[#1f3a38] mb-12 max-w-3xl">
          Our values aren&apos;t posters on the wall; they&apos;re the operating
          system for how we work every single day.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {beliefs.map((belief, index) => (
            <div key={index} className="pl-4 border-l-2 border-[#D89B2B]">
              <h3 className="text-lg md:text-xl font-semibold leading-snug text-[#123532] mb-3">
                {belief.title}
              </h3>
              <p className="text-sm font-normal leading-relaxed text-[#1f3a38]">
                {belief.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
