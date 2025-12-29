"use client";

import React from "react";

// Component for a single benefit item
type GroupPurchaseItemProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export default function GroupPurchaseItem({
  icon,
  title,
  description,
}: GroupPurchaseItemProps) {
  return (
    <div className="flex flex-col md:flex-row xl:flex-col items-start text-left py-5 md:py-2 gap-5 md:gap-3 max-w-full md:max-w-[13.2rem]">
      <div className="flex-shrink-0">
        {" "}
        {/* Icon color */}
        {icon}
      </div>
      <div className="flex flex-col">
        <h3 className="text-2xl md:text-lg lg:text-xl xl:text-2xl font-semibold text-[#123532] mb-3 md:mb-1">
          {title}
        </h3>
        <p className="text-lg md:text-sm lg:text-base xl:text-lg text-[#444444] leading-relaxed md:leading-snug line-clamp-3 md:line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
}
