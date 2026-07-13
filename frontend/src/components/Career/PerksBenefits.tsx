import React from 'react'
import { ShieldCheck, LayoutGrid, GraduationCap, PiggyBank } from 'lucide-react'

const perks = [
  {
    icon: ShieldCheck,
    title: 'Health Coverage',
    description: 'Premium insurance for you and your family.',
  },
  {
    icon: LayoutGrid,
    title: 'Flexible Work',
    description: 'Hybrid options to balance focus and connection.',
  },
  {
    icon: GraduationCap,
    title: 'Learning Budget',
    description: 'Annual stipend for courses and conferences.',
  },
  {
    icon: PiggyBank,
    title: 'Equity Plan',
    description: "Shared ownership in Flarize's success.",
  },
]

const PerksBenefits = () => {
  return (
    <section  className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4">
            Perks & Benefits
          </h2>
          <p className="text-sm md:text-lg font-normal leading-relaxed text-[#444444]">
            We take care of our people so they can take care of our mission.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-[#F5F1E4] rounded-2xl p-6 flex flex-col"
            >
                <Icon className="w-5 h-5 text-[#123532] mb-2" strokeWidth={2} />
              <h3 className="text-lg font-semibold text-[#123532] mb-2">
                {title}
              </h3>
              <p className="text-sm font-normal leading-relaxed text-[#6B6B6B]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PerksBenefits
