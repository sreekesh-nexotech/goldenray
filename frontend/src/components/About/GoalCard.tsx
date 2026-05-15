// components/GoalCard.jsx
import React from "react";

type GoalCardProps = {
  number: string;
  title: string;
  description: string;
  className?: string;
};
export default function GoalCard({
  number,
  title,
  description,
  className = "",
}: GoalCardProps) {
  return (
    // Main container for the card.
    <div
      className={`relative px-5 py-5 flex flex-col items-start rounded-2xl transition-all duration-300 ease-in-out hover:bg-white hover:shadow-[0_0_15px_#A98F383D] hover:-translate-y-1 ${className}`}
    >
      {/* Number */}
      <p className="text-base md:text-xl font-semibold leading-snug text-black mb-6">
        {number}
      </p>
      {/* Title */}
      <h3 className="text-xl md:text-2xl font-semibold leading-snug text-[#121217] mb-4">
        {title}
      </h3>
      {/* Description */}
      <p className="text-xs md:text-base font-normal leading-normal text-[#666666]">
        {description}
      </p>
    </div>
  );
}
