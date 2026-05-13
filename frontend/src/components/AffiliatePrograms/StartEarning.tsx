import React from 'react'
import LinkingButton from '../ui/LinkingButton'
import Link from 'next/link'

const StartEarning = () => {
  return (
    <section className="relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col items-center h-full gap-8">
      {/* Heading */}
      <div className="w-full max-w-7xl mx-auto text-center mb-8">
        <h2 className="text-3xl xl:text-5xl font-semibold text-[#123532] mb-4">
          Start Earning with Solar Today
        </h2>
        <p className="text-[20px] text-[#4B5563]">
         Apply now and begin referring immediately
        </p>
      </div>

      <div className='flex flex-col sm:flex-row w-full justify-center gap-5'>
        <LinkingButton content="Apply as Affiliate Partner" ButtonLink="#form" ButtonBg="bg-[#F7BA41]" ButtonHover="hover:bg-[#e6a73a]" Buttontext="text-[#272218]" />

        <Link href="#form" target="_blank" className="btn border border-[#074A4D] flex items-center gap-2 bg-transparent text-[#074A4D] hover:bg-[#eeeeee] transition-all duration-200">
          Talk to Partner Manager
        </Link>
      </div>

    </section>
  )
}

export default StartEarning