"use client";
import { Blocks, Gift, Handshake, } from 'lucide-react';
import React from 'react';

const SUPPORT_FEATURES = [
  {
    title: 'Coordinate Neighbours',
    desc: 'Help organize and guide your community through the group solar purchase process. We handle installation and paperwork.',
    bg: 'bg-[#FDF6D280]',
    icon: (
        <div className='bg-[#FDF6D2] rounded-full p-5'>
            <Blocks color='#C1A726' />
        </div>
    ),
  },
  {
    title: 'Leader Bonus ₹5,000',
    desc: 'Earn ₹5,000 additional reward when your group reaches 10 families. Over 45 group leaders across Kerala have earned through Flarize.',
    bg: 'bg-[#ADD6D880]',
    icon: (
      <div className='bg-[#ADD6D8] rounded-full p-5'>
        <Gift color='#13A7AE' />
      </div>
    ),
  },
  {
    title: 'Earn Referral Rewards',
    desc: 'Ongoing ₹1,000 per successful referral. Rewards paid within 7 days of each referred installation’s completion.',
    bg: 'bg-[#C3DFBD80]',
    icon: (
      <div className='bg-[#C3DFBD] rounded-full p-5'>
        <Handshake color='#83B079' />
      </div>
    ),
  },
  
];

const GroupLeader = () => {
  return (
    <section className="relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col items-center h-full gap-8">
      {/* Heading*/}
      <div className="w-full max-w-7xl mx-auto text-center mb-8">
        <h2 className="text-3xl xl:text-5xl font-bold text-[#123532] mb-4">
          Become a Solar Group Leader in Your Area
        </h2>
      </div>

      {/* Support Features Carousel on mobile, grid on md+ */}
      <div
        className="w-full max-w-7xl flex overflow-x-auto gap-4 md:grid md:grid-cols-3 md:gap-6 no-scrollbar "
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

export default GroupLeader;