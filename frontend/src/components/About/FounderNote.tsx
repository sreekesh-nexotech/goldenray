import Image from "next/image";

export default function FounderNote() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 xl:px-16 bg-[#F6F7F6]">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-6">
        {/* Founder's note */}
        <div className=" flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Photo */}
          <div className="order-2 md:order-1 w-full max-w-[340px] mx-auto md:mx-0 md:w-[280px] flex-shrink-0">
            {/* Matches the photo's own 1089×1280 ratio so nothing is cropped */}
            <div className="relative w-full aspect-[1089/1280] rounded-2xl overflow-hidden">
              <Image
                src="https://golden-ray.b-cdn.net/About%20us/CEO%20Harikrishnan%20KR.jpg"
                alt="Harikrishnan, Founder & CEO of Flarize"
                fill
                sizes="(min-width: 768px) 280px, 340px"
                className="object-cover shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
              />
            </div>
          </div>

          {/* Text */}
          <div className="order-1 md:order-2 flex flex-col justify-center">
            <p className="text-[1.25rem] font-semibold text-[#123532] mb-3">
              A Note From Our Founder
            </p>
            <div className="mb-6 max-w-[760px] space-y-4 text-[#444444] text-base md:text-lg leading-relaxed">
              <p className="relative pl-6 italic text-[#1a1a1a] before:absolute before:left-0 before:top-0 before:text-[2.2rem] before:leading-none before:text-[#123532] before:content-['“'] after:ml-1 after:text-[2.2rem] after:leading-none after:text-[#123532] after:content-['”']">
                For seven years I installed solar across Kerala, and I kept
                seeing good homeowners get cheated, wrong systems, vendors who
                vanished, panels failing with no one to call. No one was fixing
                the experience. So I built Flarize, to put the power back with
                the customer.
              </p>
            </div>
            <p className="font-bold text-[#123532]">Harikrishnan</p>
            <p className="text-sm text-gray-500">Founder &amp; CEO</p>
          </div>
        </div>

        {/* Strategic advisor */}
        <div className="rounded-[28px] border border-[#dfe1df] bg-[#ffffff] p-4 sm:p-5 md:p-5">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
            <div className="order-1 md:order-1 w-full md:w-[68%]">
              <h3 className="text-center text-[1.25rem] font-semibold text-[#123532] mb-3 md:text-left">
                Georgekutty Kariyanappally
              </h3>
              <p className="mt-1 text-center text-[0.75rem] text-[#34413f] md:text-left md:text-[1.05rem]">
                Strategic Advisor
              </p>

              <p className="mt-4 max-w-[860px] text-[#444444] text-sm leading-relaxed md:text-lg">
                A pioneer of solar in Kerala. Founder of Lifeway Solar Devices
                (1999), founder vice-chairman of iGBC Kerala, and the engineer
                behind India&apos;s first solar passenger rickshaw. He advises
                Flarize on strategy and standards.
              </p>

              <p className="mt-5 text-[0.9rem] font-semibold leading-[1.5] text-[#111111] md:text-[1rem]">
                Our direction is guided by people who helped build Kerala&apos;s
                solar industry from the start.
              </p>
            </div>

            <div className="order-2 md:order-2 w-full md:w-[32%] md:flex md:justify-end">
              <div className="relative mx-auto mt-2 aspect-[1089/1280] w-full max-w-[180px] overflow-hidden rounded-[18px] md:mt-0 md:max-w-[220px] md:h-[260px] md:w-[220px]">
                <Image
                  src="https://golden-ray.b-cdn.net/About%20us/Advisor%20Georgekutty%20.jpg"
                  alt="Georgekutty Kariyanappally"
                  fill
                  sizes="(min-width: 768px) 220px, 180px"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#dfe1df] bg-[#ffffff] p-4 sm:p-5 md:p-5">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
            <div className="order-2 w-full md:order-1 md:w-[32%] md:flex md:justify-start">
              <div className="relative mx-auto mt-2 aspect-[1089/1280] w-full max-w-[180px] overflow-hidden rounded-[18px] md:mt-0 md:max-w-[220px] md:h-[260px] md:w-[220px]">
                <Image
                  src="https://golden-ray.b-cdn.net/Career%20page/Mentor%20-%20Devanandan.jpeg"
                  alt="K K Devanandan"
                  fill
                  sizes="(min-width: 768px) 220px, 180px"
                  className="object-cover object-center"
                />
              </div>
            </div>

            <div className="order-1 w-full md:order-2 md:w-[68%]">
              <h3 className="text-center text-[1.25rem] font-semibold text-[#123532] mb-3 md:text-left">
                K K Devanandan
              </h3>
              <p className="mt-1 text-center text-[0.75rem] text-[#34413f] md:text-left md:text-[1.05rem]">
                Mentor & Strategic Advisor
              </p>

              <p className="mt-4 max-w-[860px] text-[#444444] text-sm leading-relaxed md:text-lg">
                An experienced business and maritime industry leader, K K Devanandan
                 has held senior leadership roles including CEO of TMT Shipping 
                 and Managing Director at MSI & V. Ships. He brings extensive 
                 experience in business leadership, international operations 
                 and strategic decision-making, and mentors Flarize on business 
                 growth and strategy.
              </p>

              <p className="mt-5 text-[0.9rem] font-semibold leading-[1.5] text-[#111111] md:text-[1rem]">
                Our direction is strengthened by experienced leaders who bring a 
                broader perspective to how we build and grow Flarize.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
