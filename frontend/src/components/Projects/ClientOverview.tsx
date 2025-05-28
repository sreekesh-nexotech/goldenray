// src/components/Projects/ClientOverviewSection.tsx
import React from 'react';

interface ClientOverviewProps {
  clientOverview: {
    ClientOverviewDescription:string;
  };
}

export default function ClientOverviewSection({ clientOverview }: ClientOverviewProps) {
  if (!clientOverview) return null; // Don't render if no data

  return (
    <div className="p-8 md:px-20 flex flex-col text-left items-start xl:mx-70">
      <h2 className="text-xl md:text-[28px] font-semibold text-[#201D1D] mb-6">Client Overview</h2>
      <p className='text-[#535862] text-base md:text-xl'>{clientOverview.ClientOverviewDescription}</p>
    </div>
  );
}