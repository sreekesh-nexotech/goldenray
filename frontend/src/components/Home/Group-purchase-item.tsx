'use client';

import React from 'react';

// Component for a single benefit item
type GroupPurchaseItemProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function GroupPurchaseItem({
    icon,
    title,
    description }:GroupPurchaseItemProps) {
  return (
    <div className="flex flex-row xl:flex-col justify-center items-start text-left py-4 gap-4 max-w-[16.2rem]"> 
      <div className='pt-3'> {/* Icon color */}
        {icon}
      </div>
      <div className='flex flex-col '>
          <h3 className="text-xl lg:text-2xl font-semibold text-[#123532]"> 
          {title}
        </h3>
        <p className="text-sm lg:text-lg text-[#444444] leading-relaxed line-clamp-2"> 
          {description}
        </p>
      </div>
    </div>
  );
};