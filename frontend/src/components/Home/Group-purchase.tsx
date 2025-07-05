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
            <div className="flex-1  xl:max-w-xl text-center xl:text-left gap-0">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 text-[#123532]">
                Save more with our group purchase scheme!
              </h2>
              <p className="text-base xl:text-lg mb-4 text-[#444444]">
                Join our Group Purchase Scheme and enjoy exclusive discounts when you team up with your neighbours, friends, or community to install solar panels.
              </p>
              {/* button for large devices */}
              <div className='flex '>
                <Link href="#booking" className=" hidden xl:block bg-white text-[#074A4D] px-10 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300  cursor-pointer">
                Talk To Us
              </Link>
              </div>
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
          <div className="flex flex-wrap flex-col xl:flex-row xl:justify-between align-baseline mt-12 gap-x-12 "> 
            {/* Benefit 1: Lower Costs */}
            <GroupPurchaseItem
              icon={
                <Image src={vector1} alt='Vector1' className='w-[36px] h-[24px]'/>
              }
                title="Lower Costs"
                description="Bulk purchasing means better pricing for everyone."
            />

            {/* Benefit 2: Simplified Process */}
            <GroupPurchaseItem
              icon={
                  <Image src={vector3} alt='Vector1' className='w-[30px] h-[26px]'/>
              }
              title="Simplified Process"
              description="We handle everything, from consultation to installation."
            />

            {/* Benefit 3: Community Impact */}
            <GroupPurchaseItem
              icon={
                <Image src={vector2} alt='Vector1' className='w-[36px] h-[24px]'/>
              }
              title="Community Impact"
              description="Create a greener, more sustainable neighborhood."
            />
            {/* button for mobile  */}
            <div className='text-center' >
            <Link href="#booking" className="xl:hidden block bg-white text-[#074A4D] px-10 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300 mt-4 cursor-pointer"> 
                  Talk To Us
            </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}