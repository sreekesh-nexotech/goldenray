import { CircleMinus, IndianRupee, PhoneCall, WalletMinimal } from 'lucide-react';
import React from 'react';
import Button from '../ui/Button';

const INFO_ITEMS = [
  {
    icon: (
        <div className='border-3 border-[#074A4D] p-1 rounded-full'>
            <IndianRupee strokeWidth={2.5} color='#074A4D' width={18} height={18} />
        </div>
    ),
    title: '₹1,000 — Fully Refundable',
    desc: 'If your group doesn’t form within 30 days, your ₹1,000 is refunded to your original payment method within 48 hours. No questions asked, no forms to fill.'
  },
  {
    icon: (
        <div className='p-1'>
            <PhoneCall strokeWidth={2.5} color='#074A4D' />
        </div>
    ),
    title: '15-Minute Callback — Guaranteed',
    desc: 'Our Kerala-based solar consultants call you within 15 minutes during business hours (8am–8pm, Mon–Sat). We confirm your spot, explain group status in your area, and answer any question.'
  },
  {
    icon: (
        <div className='p-1 '>
            <CircleMinus strokeWidth={2.5} color='#074A4D' />
        </div>
    ),
    title: 'No Spam. One Call. Transparent Updates.',
    desc: 'We call once to confirm. We update you when your group forms. Your number is never shared with other group members or third parties.'
  },
  {
    icon: (
        <div className='border-3 border-[#074A4D] p-1 rounded-full'>
            <WalletMinimal strokeWidth={2.5} color='#074A4D' width={18} height={18} />
        </div>
    ),
    title: 'EMI Starting at ₹2,000/month',
    desc: 'Most families pay ₹3,000–5,000 EMI per month — less than their current KSEB electricity bill. We explain zero-cost EMI options on the callback. No ITR required for most financing schemes.'
  },
];

const LOCATIONS = [
  'Thiruvananthapuram',
  'Kollam',
  'Pathanamthitta',
  'Alappuzha',
  'Kottayam',
  'Idukki',
  'Ernakulam',
  'Thrissur',
  'Palakkad',
  'Malappuram',
  'Kozhikode',
  'Wayanad',
  'Kannur',
  'Kasaragod',
];

const BILL_RANGES = [
  'Below ₹2,000',
  '₹2,000 – ₹5,000',
  '₹5,000 – ₹10,000',
  'Above ₹10,000',
];

const Reserve = () => {
  return (
    <section id='reserve' className="scroll-mt-15 relative z-10 container mx-auto px-4 py-10 md:py-20 xl:py-16 max-w-7xl flex flex-col xl:flex-row items-stretch gap-10 md:gap-16">
      {/* Left Info Section */}
      <div className="flex-1 w-full xl:max-w-xl flex flex-col">
        <h2 className="text-[#123532] font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-5xl text-left mb-3 sm:mb-4">
          Reserve Your Group Solar Spot in Kerala
        </h2>
        <p className="text-[#6B7280] text-sm sm:text-base md:text-base text-left mb-8 sm:mb-10 md:mb-12 lg:mb-14">
          We&apos;ll call you within 15 minutes during business hours to confirm your spot, explain group status in your area, and answer any questions — no pressure.
        </p>

        <div className="flex flex-col gap-6">
          {INFO_ITEMS.map((item, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className="shrink-0 bg-[#16A34A1A] p-2 rounded-lg">{item.icon}</div>
              <div>
                <div className="font-medium text-[#123532] text-lg mb-1">{item.title}</div>
                <div className="text-[#757575] text-sm">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex-1 w-full max-w-7xl bg-[#0B4740] rounded-2xl p-6 flex flex-col gap-6 min-h-full justify-center">
        <form className="flex flex-col justify-between bg-white rounded-2xl px-4 py-10 h-full">
          <div>
            <label htmlFor="reserve-name" className="block text-[#123532] font-medium mb-1 text-sm">Name</label>
            <input
              id="reserve-name"
              type="text"
              placeholder="Enter your name"
              className="w-full rounded-lg border border-[#E5E7EB] px-4 py-4 text-base focus:outline-none focus:ring-2 focus:ring-[#0B4740]"
            />
          </div>
          <div>
            <label htmlFor="reserve-phone" className="block text-[#123532] font-medium mb-1 text-sm">Phone Number</label>
            <input
              id="reserve-phone"
              type="text"
              placeholder="Enter your number"
              className="w-full rounded-lg border border-[#E5E7EB] px-4 py-4 text-base focus:outline-none focus:ring-2 focus:ring-[#0B4740]"
            />
          </div>
          <div>
            <label htmlFor="reserve-location" className="block text-[#123532] font-medium mb-1 text-sm">Location</label>
            <select
              id="reserve-location"
              className="w-full rounded-lg border border-[#E5E7EB] px-4 py-4 text-base bg-white focus:outline-none focus:ring-2 focus:ring-[#0B4740]"
              defaultValue=""
            >
              <option value="" disabled>Select location</option>
              {LOCATIONS.map((loc, idx) => (
                <option key={idx} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="reserve-bill" className="block text-[#123532] font-medium mb-1 text-sm">Average Monthly Electricity Bill</label>
            <select
              id="reserve-bill"
              className="w-full rounded-lg border border-[#E5E7EB] px-4 py-4 text-base bg-white focus:outline-none focus:ring-2 focus:ring-[#0B4740]"
              defaultValue=""
            >
              <option value="" disabled>Select bill range</option>
              {BILL_RANGES.map((bill, idx) => (
                <option key={idx} value={bill}>{bill}</option>
              ))}
            </select>
          </div>
          <Button>Reserve My Group Spot →</Button>
        </form>
      </div>
    </section>
  );
};

export default Reserve;