// components/GoalCard.jsx
import React from 'react';

type GoalCardProps = {
    number:string;
    title:string;
    description:string;
    className:string;//for highlighted middle box(styles like bg-white and border-radius)
}
export default function GoalCard({ number, title, description, className }:GoalCardProps){
  return (
    // Main container for the card.
    <div className={` relative px-5 py-5 flex flex-col items-start ${className}`}>
      {/* Number */}
      <p className="text-sm font-medium text-black mb-6">
        {number}
      </p>
      {/* Title */}
      <h3 className="text-2xl mb:text-[32px] font-semibold text-[#121217] mb-4">
        {title}
      </h3>
      {/* Description */}
      <p className="text-base full mb:text-xl text-[#666666]">
        {description}
      </p>
    </div>
  );
};

