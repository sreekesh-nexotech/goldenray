import Image from 'next/image'
import React from 'react'

const Track = () => {
    const img = "https://golden-ray.b-cdn.net/images/affiliate-dashboard.png";

  return (
    <section className="relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col items-center h-full gap-8">
      {/* Heading */}
      <div className="w-full max-w-7xl mx-auto text-center mb-2  md:mb-8">
        <h2 className="text-3xl xl:text-5xl font-bold text-[#123532] mb-4">
          Track Every Referral from Lead to Bank Credit
        </h2>
        <p className="hidden sm:block text-[20px] text-[#4B5563]">
          Your partner dashboard shows the full referral lifecycle in real time: lead submission, site assessment scheduling, installation completion, and commission credit status. Every update is logged, timestamped, and accessible from your account. You never need to follow up with the Flarize team to confirm a payout.
        </p>
      </div>

      <div className='w-full max-w-5xl mx-auto'>
        <Image src={img} alt="Affiliate Dashboard" layout="responsive" width={800} height={600} />
      </div>
    
        
    </section>
  )
}

export default Track