"use client";

import React from "react";

// Component for a single benefit item
type GroupPurchaseItemProps = {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
};

export default function GroupPurchaseItem({
  icon,
  title,
  description,
}: GroupPurchaseItemProps) {
  return (
    <div className="flex flex-col items-start text-left py-4 sm:py-5 md:py-4 lg:py-2 xl:py-2 2xl:py-5 gap-3 sm:gap-4 md:gap-3 lg:gap-2 xl:gap-2 2xl:gap-4 max-w-full">
      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-10 md:h-10 lg:w-9 lg:h-9 xl:w-10 xl:h-10 2xl:w-14 2xl:h-14 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>img]:w-full [&>img]:h-full">
        {icon}
      </div>
      <div className="flex flex-col w-full">
        <h3 className="text-xl md:text-2xl font-semibold leading-snug text-[#123532] mb-1 sm:mb-2 md:mb-1 lg:mb-1">
          {title}
        </h3>
        <p className="text-xs md:text-base font-normal leading-normal text-[#444444]">
          {description}
        </p>
      </div>
    </div>
  );
}
