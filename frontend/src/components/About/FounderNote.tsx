import Image from "next/image";

export default function FounderNote() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 xl:px-16 bg-[#F6F7F6]">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Founder's note */}
        <div className=" flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Photo */}
          <div className="order-2 md:order-1 w-full md:w-[280px] flex-shrink-0">
            <div className="relative w-full aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden">
              <Image
                src="https://golden-ray.b-cdn.net/About%20us/6f0be9432f447d43a33ee2817ae83eb2e0a220cf.jpg"
                alt="Harikrishnan, Founder & CEO of Flarize"
                fill
                sizes="(min-width: 768px) 280px, 100vw"
                className="object-cover shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
              />
            </div>
          </div>

          {/* Text */}
          <div className="order-1 md:order-2 flex flex-col justify-center">
            <p className="text-sm font-semibold text-[#123532] mb-3">
              A Note From Our Founder
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#123532] leading-tight mb-4">
              The platform I wish I&apos;d had on the roof.
            </h2>
            <p className="text-[#555555] leading-relaxed mb-6">
              &quot;For seven years I installed solar across Kerala, and I
              kept seeing good homeowners get cheated, wrong systems, vendors
              who vanished, panels failing with no one to call. No one was
              fixing the experience. So I built Flarize, to put the power
              back with the customer.&quot;
            </p>
            <p className="font-bold text-[#123532]">Harikrishnan</p>
            <p className="text-sm text-gray-500">Founder &amp; CEO</p>
          </div>
        </div>

        {/* Strategic advisor */}
        <div className="rounded-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="bg-[#123532] text-white p-8 md:p-10 md:w-[38%] flex flex-col justify-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              Strategic Advisor
            </h3>
            <p className="text-white/80 leading-relaxed">
              Our direction is guided by people who helped build
              Kerala&apos;s solar industry from the start.
            </p>
          </div>
          <div className="bg-white p-8 md:p-10 flex flex-col items-center text-center md:flex-row md:items-center md:text-left gap-6 md:w-[62%]">
            <div className="relative w-24 h-28 md:w-28 md:h-32 flex-shrink-0 rounded-md overflow-hidden">
              <Image
                src="https://golden-ray.b-cdn.net/About%20us/abaf40f3b4844ec6fa9001430d6f02e2b814f139.png"
                alt="Georgekutty Kariyanappally"
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-bold text-[#123532] mb-2">
                Georgekutty Kariyanappally
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                A pioneer of solar in Kerala. Founder of Lifeway Solar
                Devices (1999), founder vice-chairman of iGBC Kerala, and the
                engineer behind India&apos;s first solar passenger rickshaw.
                He advises Flarize on strategy and standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
