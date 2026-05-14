import { Check, Lock } from 'lucide-react'
import React from 'react'
import LinkingButton from '../ui/LinkingButton'

const visibleRow = {
  size: '3 kW – 10 kW+',
  use: 'Homes & Commercial',
  commission: '₹8,000',
}

const lockedRows = [
  { size: '5 kW – 8 kW', use: 'Homes & Commercial', commission: '₹6,000' },
  { size: '8 kW – 10 kW', use: 'Commercial', commission: '₹10,000' },
]

const badges = [
  'Free Registration',
  'No Minimum Target',
  '7-14 Day Commission Credit',
  'Unlimited Referrals',
]

const CommissionStructure = () => {
  return (
    <section className="relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col items-center h-full gap-8">
      {/* Heading */}
      <div className="w-full max-w-7xl mx-auto text-center mb-8">
        <h2 className="text-3xl xl:text-5xl font-semibold text-[#123532] mb-4">
          Commission Structure — Fixed Rates, No Hidden Deductions
        </h2>
        <p className="hidden sm:block text-[20px] text-[#4B5563]">
          Our commission structure is fixed, documented, and paid on every successful installation — with no hidden deductions, no variable adjustments, and no minimum thresholds. Exact per-system-size rates are available inside your free partner account.
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-5xl p-5 md:p-8 bg-[#FEF3E8] rounded-xl overflow-hidden">
        {/* Table */}
        <div className="relative">
          <div className="grid grid-cols-3 bg-[#074A4D] text-white text-xs sm:text-sm md:text-base rounded-t-xl font-semibold">
            <div className="px-3 sm:px-6 py-3 sm:py-4 text-center">System Size</div>
            <div className="px-3 sm:px-6 py-3 sm:py-4 text-center">Typical Use</div>
            <div className="px-3 sm:px-6 py-3 sm:py-4 text-center">Your Commission</div>
          </div>

          {/* Visible Row */}
          <div className="grid grid-cols-3 text-[#123532] text-xs sm:text-sm md:text-base font-semibold">
            <div className="px-3 sm:px-6 py-3 sm:py-4 text-center">{visibleRow.size}</div>
            <div className="px-3 sm:px-6 py-3 sm:py-4 text-center">{visibleRow.use}</div>
            <div className="px-3 sm:px-6 py-3 sm:py-4 text-center font-semibold">{visibleRow.commission}</div>
          </div>

          {/* Locked Rows */}
          <div className="relative">
            <div aria-hidden className="select-none pointer-events-none">
              {lockedRows.map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-3 text-[#123532] text-xs sm:text-sm md:text-base font-semibold blur-[6px] opacity-70"
                >
                  <div className="px-3 sm:px-6 py-3 sm:py-4 text-center">{row.size}</div>
                  <div className="px-3 sm:px-6 py-3 sm:py-4 text-center">{row.use}</div>
                  <div className="px-3 sm:px-6 py-3 sm:py-4 text-center font-semibold">{row.commission}</div>
                </div>
              ))}
            </div>

            {/* Lock Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-[#F7BA41] rounded-xl p-3 sm:p-4 shadow-[0_8px_20px_rgba(247,186,65,0.45)]">
                <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-[#123532]" strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center ">
          <h3 className="text-xl sm:text-2xl md:text-4xl font-medium text-[#000000] mb-3">
            Full commission breakdown inside
          </h3>
          <p className="text-base sm:text-xl text-[#404040]  mx-auto mb-6 font-light">
            Create your free partner account to see exact rates per system size, payout schedule, and bonus structure.
          </p>

          <LinkingButton
            content="See Full Commission Structure →"
            ButtonLink="#form"
            ButtonBg="bg-[#F7BA41]"
            ButtonHover="hover:bg-[#e5a51f]"
            Buttontext="text-[#000000]"
          />

          <p className="text-xs sm:text-sm text-[#757575] mt-3">
            Free. Takes 60 seconds. No spam.
          </p>
        </div>
      </div>

      {/* Badges */}
      <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-3 w-full max-w-4xl mx-auto">
        {badges.map((badge, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 bg-[#16A34A3D] text-[#15803D] text-[10px] sm:text-sm md:text-base font-medium px-3 sm:px-4 py-2 rounded-full w-full sm:w-auto"
          >
            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#15803D] shrink-0" strokeWidth={3} />
            <span>{badge}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CommissionStructure
