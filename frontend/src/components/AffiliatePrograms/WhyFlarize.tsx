"use client"
import { Award, BadgeCheck, Clock, ShieldCheck, TrendingUp, User } from 'lucide-react'
import React from 'react'

interface Feature {
  icon: React.ReactNode
  title: string
  desc: string
}

const features: Feature[] = [
  {
    icon: <Award className="w-8 h-8 text-white" />,
    title: 'Pricing 15-20% Below Kerala Market Average',
    desc: "Flarize's system pricing is consistently 15-20% below the Kerala market average for equivalent system specifications. When customers you refer see the quote, the value is immediately apparent — reducing the friction between your introduction and their decision to proceed.",
  },
  {
    icon: <User className="w-8 h-8 text-white" />,
    title: 'Dedicated Relationship Manager for Every Partner',
    desc: "Every affiliate is assigned a named relationship manager from day one. They handle lead follow-up, site assessment coordination, payout queries, and partner communications. You always have a direct contact — not a support ticket queue.",
  },
  {
    icon: <Clock className="w-8 h-8 text-white" />,
    title: 'Installation Completed in 3-5 Working Days',
    desc: "After KSEB approval, Flarize installations are completed in 3-5 working days. Faster installation means faster commission credit — and a better experience for the customer you referred. This also protects your referral relationship.",
  },
  {
    icon: <BadgeCheck className="w-8 h-8 text-white" />,
    title: 'KSEB and MNRE Approvals Handled End-to-End',
    desc: "Flarize is a KSEB-approved installer and MNRE-empaneled solar EPC company. Every installation comes with net metering documentation, system inspection certificates, and subsidy processing support where applicable under PM Surya Ghar. Customers you refer do not face bureaucratic delays.",
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-white" />,
    title: '40%+ Lead-to-Installation Conversion Rate',
    desc: "More than 40% of qualified leads submitted through the affiliate program convert to completed installations. Flarize's sales team handles all technical objections, pricing discussions, and follow-up within 24 hours of lead submission. This is significantly above the industry average for solar programs in Kerala.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-white" />,
    title: '10-Year Warranty on Panels, Inverters, and Workmanship',
    desc: "Every Flarize installation carries a comprehensive 10-year warranty. This reduces post-installation complaints and protects your reputation with customers from your network. Customers you refer are in safe hands long after installation day.",
  },
]

const WhyFlarize = () => {
  return (
    <section className="relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col items-center h-full gap-8">
      {/* Heading */}
      <div className="w-full max-w-7xl mx-auto text-center mb-8">
        <h2 className="text-3xl xl:text-5xl font-semibold text-[#123532] mb-4">
          Why Affiliates Choose Flarize Over Other Programs
        </h2>
        <p className="hidden sm:block text-[20px] text-[#4B5563]">
          Your referral commission is only as good as the company completing the installation. If the customer has a poor experience, that reflects on you. Flarize affiliates consistently earn more per referral because of six specific structural advantages
        </p>
      </div>

        {/* Feature cards */}
        <div className="w-full max-w-7xl flex overflow-x-auto gap-4 lg:grid lg:grid-cols-3 md:gap-6 no-scrollbar">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="min-w-[75vw] max-w-[75vw] lg:min-w-0 lg:max-w-none bg-[#074A4D] rounded-xl p-5 flex flex-col gap-3"
            >
              <div>
                {feature.icon}
              </div>
              <h3 className="text-xl md:text-2xl text-white leading-snug">{feature.title}</h3>
              <p className="text-sm md:text-base text-[#B2B2B2] leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}

export default WhyFlarize
