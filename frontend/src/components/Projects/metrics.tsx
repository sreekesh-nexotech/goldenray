// src/components/Projects/metricsSection.tsx
import React from 'react';
import Image from 'next/image'; 

interface MetricsProps {
  metrics: {
    systemSize: string;
    installationType: string;
    annualGeneration: string;
    roiPeriod: string;
  };
}



export default function MetricsSection({ metrics }: MetricsProps) {
  if (!metrics) return null;

  return (
    <div className=" p-4 md:p-8 mb-12 xl:mx-30">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5  text-center ">
        <div className="flex flex-col items-center  shadow-[0_0_15px_rgba(0,0,0,0.3)] px-4 py-6 md:py-10 gap-3 rounded-xl">
          <Image src='/metrics-1.png'alt='system size'width={40} height={30}/>  
          <p className="text-[#666666] text-sm md:text-xl font-normal">System Size</p>
          <span className="text-sm font-medium md:text-2xl text-[#272218] ">{metrics.systemSize}</span>
        </div>
        <div className="flex flex-col items-center  shadow-[0_0_15px_rgba(0,0,0,0.3)] px-4 py-6 md:py-10 gap-3 rounded-xl">
          <Image src='/metrics-3.png'alt='Installation tme'width={39} height={30}/>  
          <p className="text-[#666666] text-sm md:text-xl font-normal">Installation Type</p>
          <span className="text-sm font-medium md:text-2xl text-[#272218] ">{metrics.installationType}</span>
        </div>
        <div className="flex flex-col items-center  shadow-[0_0_15px_rgba(0,0,0,0.3)] px-4 py-6 md:py-10 gap-3 rounded-xl">
          <Image src='/metrics-4.png'alt='Energy savings'width={33} height={39}/>  
          <p className="text-[#666666] text-sm md:text-xl font-normal">Energy Saved Annually</p>
          <span className="text-sm font-medium md:text-2xl text-[#272218] ">{metrics.annualGeneration}</span>
        </div>
        <div className="flex flex-col items-center  shadow-[0_0_15px_rgba(0,0,0,0.3)] px-4 py-6 md:py-10 gap-3 rounded-xl">
          <Image src='/metrics-2.png'alt='ROI Period'width={26} height={34}/>  
          <p className="text-[#666666] text-sm md:text-xl font-normal">ROI Period</p>
          <span className="text-sm font-medium md:text-2xl text-[#272218] ">{metrics.roiPeriod}</span>
        </div>
      </div>
    </div>
  );
}