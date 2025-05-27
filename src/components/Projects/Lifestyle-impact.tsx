// src/components/Projects/LifestyleImpactSection.tsx
import React from 'react';

interface LifestyleImpactProps {
  lifestyleImpact: string;
}

export default function LifestyleImpactSection({ lifestyleImpact }: LifestyleImpactProps) {
  if (!lifestyleImpact) return null;

  return (
    <div className="p-8 rounded-2xl bg-[#E5F4F2] md:px-20 flex flex-col text-left items-start xl:mx-70 mb-12 md:mb-20 mx-4">
      <h2 className="text-xl md:text-[28px] font-semibold text-[#201D1D] mb-6">How Solar Impacted Their Lifestyle</h2>
      <p className="list-disc list-inside text-[#535862] text-base md:text-xl space-y-2 leading-relaxed">
        {lifestyleImpact}
      </p>
    </div>
  );
}