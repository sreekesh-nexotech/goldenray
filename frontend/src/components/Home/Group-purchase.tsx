'use client';

import React from 'react';
import Image from 'next/image';
import GroupPurchaseItem from './Group-purchase-item';
import people from '../../../public/People-1.png'
import line from '../../../public/Vector-6.png'
import vector1 from '../../../public/Vector-7.png'
import vector2 from '../../../public/Vector-8.png'
import vector3 from '../../../public/Vector-9.png'
import Link from 'next/link';


// Main GroupPurchaseScheme component
export default function GroupPurchaseScheme() {
  return (
    <section className=' mb-10 px-4 sm:px-6 lg:px-8 xl:px-36'>
      <div>
        {/* Main content card */}
        <div className="bg-[#F7BA41] rounded-3xl p-8 sm:p-12 lg:p-16 flex flex-col gap-2 items-center xl:items-stretch">
          <div className='flex flex-col xl:flex-row justify-between items-center '>
            {/* Left content area (text and button) */}
            <div className="flex-1  xl:max-w-xl text-center md:text-left gap-0">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8 text-[#123532]">
                Save more, Together Join your local solar group purchase
              </h2>
              
              {/* button for large devices */}
              <div className='flex mb-10'>
                <Link href="#booking" className=" hidden md:block bg-white text-[#074A4D] px-10 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300  cursor-pointer">
                  Reserve Your Spot Now
                </Link>
              </div>
              <p className="text-base xl:text-lg mb-4 text-[#444444]">
                Neighbors in your area are teaming up for solar savings. Be the first to reserve your spot! 
              </p>
            </div>

            {/* Right content area (illustration) */}
            <div className="flex-1 flex justify-center xl:justify-end min-w-[200px] max-w-full">
              <div className='flex flex-col'>
                {/* SVG Illustration of people */}
                <Image src={people} alt='people line art' width={347} height={208}/>
                <Image src={line} alt='line vector' width={354} height={63}/>
              </div>
            </div>
          </div>


          {/* Benefit cards section */}
          <div className="flex flex-wrap flex-col md:flex-row xl:justify-between align-baseline mt-12 gap-x-5 "> 
            {/* Benefit 1: Reserve */}
            <GroupPurchaseItem
              icon={
                <Image src={vector1} alt='Vector1' className='w-[36px] h-[24px]'/>
              }
                title="Reserve"
                description="Secure your spot with a small, refundable fee."
            />

            {/* Benefit 2: Invite*/}
            <GroupPurchaseItem
              icon={
                  <Image src={vector3} alt='Vector1' className='w-[30px] h-[26px]'/>
              }
              title="Invite"
              description="Share with friends and neighbors to grow your group."
            />

            {/* Benefit 3: Unlock */}
            <GroupPurchaseItem
              icon={
                <Image src={vector2} alt='Vector1' className='w-[36px] h-[24px]'/>
              }
              title="Unlock"
              description="Unlock massive discounts which are exclusive for bulk orders."
            />

            {/* Benefit 4: Install */}
            <GroupPurchaseItem
              icon={
                <Image src={vector2} alt='Vector1' className='w-[36px] h-[24px]'/>
              }
              title="Install"
              description="Enjoy a smooth, professional solar installation."
            />

            
            {/* button for mobile  */}
            <div className='text-center' >
            <Link href="#booking" className="md:hidden block bg-white text-[#074A4D] px-10 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300 mt-4 cursor-pointer"> 
                  Talk To Us
            </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}