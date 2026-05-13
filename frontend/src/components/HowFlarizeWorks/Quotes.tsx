import { Check } from 'lucide-react';
import React from 'react';

const QUOTES = [
  {
    label: 'Value',
    price: '₹1,56,000',
    tag: 'Best Price',
    tagClass: 'bg-[#2563EB] text-white',
    border: 'border-[#E5E5E5]',
    system: '3kW On-Grid',
    panels: 'Adani Solar',
    inverter: 'Growatt',
    structure: 'Aluminium',
    features: [
      'Full Flarize guarantee',
      'Same installation quality',
    ],
  },
  {
    label: 'Balanced',
    price: '₹1,78,000',
    tag: 'Most Popular',
    tagClass: 'bg-[#16A34A] text-white',
    border: 'border-[#074A4D]',
    system: '3kW On-Grid',
    panels: 'Waaree HJT',
    inverter: 'Sungrow',
    structure: 'Aluminium',
    features: [
      'Full Flarize guarantee',
      'Best monsoon performance',
    ],
  },
  {
    label: 'Premium',
    price: '₹2,05,000',
    tag: 'Best Performance',
    tagClass: 'bg-[#F7BA41] text-[#123532]',
    border: 'border-[#E5E5E5]',
    system: '3kW On-Grid',
    panels: 'Axitec',
    inverter: 'Fronius',
    structure: 'Aluminium',
    features: [
      'Full Flarize guarantee',
      '30-year performance warranty',
    ],
  },
];

const Quotes = () => {
  return (
    <section className="relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col items-center h-full gap-8">
      {/* Heading and description */}
      <div className="w-full max-w-7xl mx-auto text-center mb-8">
        <h2 className="text-3xl xl:text-5xl font-semibold text-[#123532] mb-4">
          What your 3 quotes look like
        </h2>
        <p className="hidden sm:block text-[20px] text-[#4B5563]">
          Same system size. Same Flarize quality guarantee. Different brands and budgets — you choose.
        </p>
      </div>

      {/* Quotes Cards */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {QUOTES.map((q, idx) => (
          <div
            key={idx}
            className={`relative bg-white rounded-xl p-6 flex flex-col gap-2 border-2 ${q.border}`}
          >
            <span
              className={`absolute -top-3 left-1/2 -translate-x-1/2 ${q.tagClass} text-sm md:text-base px-3 py-1 rounded-xl whitespace-nowrap`}
            >
              {q.tag}
            </span>
            <div className={`text-sm md:text-xl font-medium text-[#525252] mb-1 mt-2 md:mt-0`}>{q.label}</div>
            <div className='flex md:flex-col items-center md:items-start justify-between'>
                <div className="text-3xl font-semibold text-[#059669] mb-1">{q.price}</div>
                <div className="text-sm md:text-xl font-medium text-[#525252] mb-2">{q.system}</div>
            </div>
            <hr className='border-b-0 border-[#C3C1C1B2]'/>
            <div className="text-sm md:text-xl text-[#757575] mb-1">
              Panels: <span className="font-semibold text-[#444444]">{q.panels}</span>
            </div>
            <div className="text-sm md:text-xl text-[#757575] mb-1">
              Inverter: <span className="font-semibold text-[#444444]">{q.inverter}</span>
            </div>
            <div className="text-sm md:text-xl text-[#757575] mb-2">
              Structure: <span className="font-semibold text-[#444444]">{q.structure}</span>
            </div>
            <ul className="text-sm md:text-xl text-[#074A4D] space-y-1 mt-2">
              {q.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span><Check className="w-5 h-5" strokeWidth={3} /></span> {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Quotes;