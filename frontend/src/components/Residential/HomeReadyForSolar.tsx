import Image from "next/image";
import { Check } from "lucide-react";

// Swap for the 3D house illustration once it is on the CDN.
const homeIllustration = "https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/house3d.png";
const homeIllustrationAlt =
  "Home with rooftop solar panels under the Kerala sun";

const checks = [
  {
    title: "Available Roof Space",
    desc: "80 sq.ft per kW of shadow-free area is required for optimal efficiency.",
  },
  {
    title: "Roof Orientation & Slope",
    desc: "South-facing roofs receive maximum sunlight in Kerala. East-West is secondary.",
  },
  {
    title: "What's your monthly bill?",
    desc: "Using over 200 units a month? Solar starts paying for itself fast — above 250 units, KSEB rates jump sharply, so you save even more.",
  },
  {
    title: "Any big shadows?",
    desc: "Tall trees or buildings shading the roof between 9 AM and 4 PM cut your generation. Our engineer measures this exactly during the assessment.",
  },
];

const HomeReadyForSolar = () => {
  return (
    <section className="relative z-10 container mx-auto px-4 py-10 md:py-16 max-w-7xl">
      <div className="rounded-3xl bg-[#F7BA41] px-6 py-8 md:px-12 md:py-12">
        <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
          {/* Left: heading + checklist */}
          <div className="w-full lg:w-[58%]">
            <h2 className="text-[32px] md:text-5xl font-semibold leading-tight text-[#123532]">
              Is Your Home Ready for Solar?
            </h2>

            <ul className="mt-6 md:mt-8 flex flex-col gap-5 md:gap-6">
              {checks.map(({ title, desc }) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] bg-[#1C9C4A]">
                    <Check
                      className="h-3.5 w-3.5 text-white"
                      strokeWidth={3}
                      aria-hidden="true"
                    />
                  </span>
                  <div>
                    <h3 className="text-sm md:text-base font-semibold leading-snug text-[#123532]">
                      {title}
                    </h3>
                    <p className="mt-1 text-xs md:text-sm font-normal leading-relaxed text-[#444444]">
                      {desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right on desktop, below the list on mobile */}
          <div className="w-full lg:w-[42%]">
            <div className="relative mx-auto w-full max-w-sm lg:max-w-none h-[200px] sm:h-[240px] lg:h-[320px]">
              <Image
                src={homeIllustration}
                alt={homeIllustrationAlt}
                fill
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-contain object-center rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeReadyForSolar;
