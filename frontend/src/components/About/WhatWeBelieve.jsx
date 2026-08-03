// components/WhatWeBelieve.jsx
import Image from "next/image";
import Link from "next/link";

export default function WhatWeBelieve() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 xl:px-16 ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Text Content */}
        <div className="text-left">
          <p className="text-sm md:text-base font-semibold text-[#123532] mb-3">
            Why Flarize Exists
          </p>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight text-[#123532] mb-6">
            The power should sit with you.
          </h2>

          <div className="space-y-4 text-[#444444] text-base md:text-lg leading-relaxed">
            <p>
              Buying solar, most people are at the mercy of the seller.
              You&apos;re told what to buy, not what fits your roof, your
              bill, and your budget. The seller knows the numbers. You
              don&apos;t.
            </p>
            <p>
              We think that&apos;s backwards. A 25-year decision should sit
              with the person who lives with it. Solar has a trust problem,
              not a demand problem, and trust starts with you understanding
              the choice.
            </p>
            <p>
              So we built Flarize. We hand you the facts and the tools,
              honest comparisons, real prices, clear subsidy and EMI numbers,
              so you decide for yourself. Then we install and support it for
              25 years. We started in Kerala; we&apos;re building for India.
            </p>
          </div>

          <p className="mt-6 mb-8 text-lg md:text-xl font-bold text-[#123532]">
            Own your power. Elevate your everyday.
          </p>

          
        </div>

        

        {/* Image */}
        <div className="w-full h-[320px] sm:h-[400px] lg:h-[460px] rounded-2xl overflow-hidden">
          <Image
            src="https://golden-ray.b-cdn.net/images/img52.jpeg"
            alt="The Flarize team collaborating"
            width={640}
            height={460}
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 lg:justify-center">
            <Link
              href="#team"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-[#F7BA41] text-[#272218] font-semibold text-base transition-colors hover:bg-yellow-500"
            >
              Meet our team
            </Link>
            <Link
              href="/quotation"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-[#123532] text-[#123532] font-semibold text-base transition-colors hover:bg-[#123532] hover:text-white"
            >
              Own your power
            </Link>
          </div>
    </section>
  );
}
