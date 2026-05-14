"use client";
import { Handshake,  Zap } from 'lucide-react';
import React from 'react';

const SUPPORT_FEATURES = [
  {
    title: 'Energy Loss Guarantee',
    desc: 'If your solar system has a reported outage lasting more than 48 hours, Flarize compensates you for the lost energy production. This is the only energy loss guarantee offered by a solar company in Kerala — and it means our incentive to resolve issues quickly is directly tied to your system uptime',
    bg: 'bg-[#FDF6D280]',
    icon: (
        <div className='bg-[#FDF6D2] rounded-full p-5'>
            <Zap color='#C1A726' />
        </div>
    ),
  },
  {
    title: '3-Layer Support System',
    desc: 'WhatsApp support for quick queries and real-time updates. Remote diagnostics for system performance issues — most inverter faults are resolved without a site visit. Local technician visits when physical intervention is required. Three layers, one point of contact',
    bg: 'bg-[#ADD6D880]',
    icon: (
      <div className='bg-[#ADD6D8] rounded-full p-5'>
        <Handshake color='#13A7AE' />
      </div>
    ),
  },
  {
    title: 'Real-Time Digital Dashboard',
    desc: 'Monitor your solar generation, electricity savings, and system health from the Flarize app. Daily generation reports, performance alerts, monthly energy summaries, and net metering unit tracking — all updated in real time from your inverter',
    bg: 'bg-[#C3DFBD80]',
    icon: (
      <div className='bg-[#C3DFBD] rounded-full p-5'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#83B079" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
        </svg>

      </div>
    ),
  },
  {
    title: 'Solar Care Plans',
    desc: 'Annual maintenance packages starting from Rs.249/month. Includes preventive panel cleaning, electrical safety checks, inverter health monitoring, and priority technician response. A properly maintained system retains efficiency for the full 25-year panel performance period',
    bg: 'bg-[#FBE8DA80]',
    icon: (
        <div className='bg-[#FFE8D7] rounded-full p-5'>
            <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24"  
            fill="#FFBA84" viewBox="0 0 24 24" >
            {/* Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free */}
            <path d="M11 2H13V5H11z"/><path d="M19 11H22V13H19z"/><path d="m17,12.76v-.76c0-2.76-2.24-5-5-5s-5,2.24-5,5H3c-.35,0-.67.18-.85.47s-.2.66-.04.97l4,8c.17.34.52.55.89.55h13c.35,0,.67-.18.85-.47s.2-.66.04-.97l-3.89-7.79Zm-5-3.76c1.65,0,3,1.35,3,3h-6c0-1.65,1.35-3,3-3Zm-6.38,7l-1-2h4.51l1,2h-4.51Zm2,4l-1-2h4.51l1,2h-4.51Zm3.75-6h4.01l1,2h-4.01l-1-2Zm3,6l-1-2h4.01l1,2h-4.01Z"/><path d="M17.66 7.76 18.72 6.7 19.78 5.64 19.07 4.93 18.36 4.22 17.3 5.28 16.24 6.34 16.95 7.05 17.66 7.76z"/><path d="M6.34 7.76 7.05 7.05 7.76 6.34 6.7 5.28 5.64 4.22 4.93 4.93 4.22 5.64 5.28 6.7 6.34 7.76z"/>
            </svg>
        </div>
    ),
  },
];

const Support = () => {
  return (
    <section className="relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col items-center h-full gap-8">
      {/* Heading and description */}
      <div className="w-full max-w-7xl mx-auto text-center mb-8">
        <h2 className="text-3xl xl:text-5xl font-semibold text-[#123532] mb-4">
          Post-Installation Support
        </h2>
        <p className="hidden sm:block text-[20px] text-[#4B5563]">
          This is where most solar companies disappear. Flarize is built for the long haul — with a structured support ecosystem that covers the full life of your system.
        </p>
      </div>

      {/* Support Features Carousel on mobile, grid on md+ */}
      <div
        className="w-full max-w-7xl flex overflow-x-auto gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 no-scrollbar "
      >
        {SUPPORT_FEATURES.map((feature, idx) => (
          <div
            key={idx}
            className={`min-w-[75vw] max-w-[75vw] md:min-w-0 md:max-w-none rounded-xl px-3 py-5 flex flex-col items-center text-center gap-3 ${feature.bg}`}
          >
            <div className="mb-2">{feature.icon}</div>
            <div className="font-semibold text-xl text-[#111827] mb-1">{feature.title}</div>
            <div className="text-[#4B5563] text-base">{feature.desc}</div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default Support;