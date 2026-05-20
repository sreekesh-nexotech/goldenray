import LinkingButton from '../ui/LinkingButton'
import PageIllustration from '../ui/page-illustration'
import React from 'react'

const EmiHero = () => {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 120% 80% at 50% -10%, #F8F2E1 0%, #FFFFFF 70%)',
      }}
    >
      <PageIllustration />

      <div className="relative z-10 container mx-auto px-4 py-15 max-w-6xl  flex flex-col items-center text-center gap-5 sm:gap-6">

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-7xl font-semibold text-[#111827] leading-tight">
          Let the Government and the Sun Pay Your Bills.
        </h1>

        {/* Orange sub-line */}
        <p className="text-3xl sm:text-4xl md:text-5xl xl:text-7xl font-semibold text-[#F88A22] leading-tight">
          You Just Enjoy the Upgrade.
        </p>

        {/* Description */}
        <p className="text-xs sm:text-sm md:text-base text-[#4B5563] max-w-2xl leading-relaxed">
          <strong className="font-semibold text-[#074A4D]">₹78,000 government subsidy. 5.65% SBI rate</strong>
          {' '}— exclusive to Flarize. Your 3kW solar system covers ₹6,000 worth of electricity
          every two months. Your EMI? ₹3,000/month. Run your AC. Cook on induction.
          Pay less than you do today.
        </p>

        {/* Comparison Card */}
        <div className="w-full max-w-3xl border border-[#E5E7EB] rounded-3xl bg-[#F8F2E1] backdrop-blur-sm px-5 sm:px-8 py-5 flex items-center justify-between gap-3 sm:gap-6 mt-2">
          {/* Left — Solar EMI */}
          <div className="flex flex-col text-left items-start gap-0.5">
            <span className="text-[10px] sm:text-sm text-[#6B7280]">Your Solar EMI</span>
            <div className='flex flex-col md:flex-row items-start  md:items-center gap-2'>
                <span className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#16A34A] leading-none">
                    ₹3,000
                </span>
                <span className="text-[10px] sm:text-sm text-[#4B5563]">/month · full usage</span>
            </div>
          </div>

          {/* VS */}
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-[#123532] shrink-0">
            VS
          </span>

          {/* Right — Electricity Bill */}
          <div className="flex flex-col text-right items-end gap-0.5">
            <span className="text-[10px] sm:text-sm text-[#6B7280]">Your Electricity Bill</span>
            <div className='flex  flex-col md:flex-row items-end  md:items-center gap-2'>
                <span className="text-2xl sm:text-3xl  md:text-5xl font-bold text-[#F59E0B] leading-none">
                    ₹6,000
                </span>
                <span className="text-[10px] sm:text-sm text-[#4B5563]">/bimonthly · restricted</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-row gap-3 mt-2 w-full sm:w-auto">
         <LinkingButton
            content="Compare Bank Rates"
            ButtonLink="#bank-rates"
            ButtonBorder="border border-[#074A4D]"
            ButtonBg="bg-transparent"
            Buttontext="text-[#074A4D]"
            ButtonHover="hover:bg-[#eeeeee]"
            className="flex-1 sm:flex-none !whitespace-normal sm:!whitespace-nowrap text-center text-xs sm:text-sm md:text-lg"
          />
           <LinkingButton
            content="Calculate My EMI — Free"
            ButtonLink="#calculator"
            ButtonBg="bg-[#F7BA41]"
            Buttontext="text-[#272218]"
            ButtonHover="hover:bg-yellow-500"
            className="flex-1 sm:flex-none !whitespace-normal sm:!whitespace-nowrap text-center text-xs sm:text-sm md:text-lg"
          />
        </div>

      </div>
    </section>
  )
}

export default EmiHero
