// src/components/Projects/TestimonialSection.tsx
import React from 'react';
import Image from 'next/image'; // For testimonial image if you have one

interface TestimonialProps {
  testimonial: {
    quote: string;
    author: string;
  };
}

export default function TestimonialSection({ testimonial }: TestimonialProps) {
  if (!testimonial) return null;

  return (

    <div className="flex justify-center items-center  px-4 sm:px-6 lg:px-8 xl:px-36">
      <div className="bg-[#F7F7F2] rounded-2xl -hidden w-full">
        {/* Image Section */}
        <div className="relative w-full h-64 sm:h-80 md:h-[550px]">
          <Image
            src="/testimonial.png"
            alt={testimonial.author}
            layout="fill"
            objectFit="cover"
            quality={90}
            className="rounded-t-2xl object-top"
          />
        </div>

        {/* Testimonial Content */}
        <div className="p-6 sm:p-8 md:p-20 lg:px-50 ">
          <blockquote className="text-lg sm:text-xl md:text-[32px] font-normal text-[#535862]  mb-10 ">
            &quot;{testimonial.quote}&quot;
          </blockquote>
          <p className="text-sm md:text-2xl text-[#124944] font-medium">
            {testimonial.author}
          </p>
        </div>
      </div>
    </div>
  );
};

