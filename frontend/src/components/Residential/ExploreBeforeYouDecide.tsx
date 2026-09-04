import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Illustrations for each tool. Swap these for the final artwork once it is on
// the CDN — the paths follow the same Residential folder as the other sections.
const cdn = "https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions";

const resources = [
  {
    title: "Savings Calculator",
    desc: "Calculate exactly how much you'll save on your KSEB bills based on your current consumption.",
    cta: "Calculate Now",
    href: "/advanced-calculator",
    image: `${cdn}/savings-calculator.png`,
    alt: "Electricity bill dropping after switching to solar",
  },
  {
    title: "EMI Calculator",
    desc: "Plan your finances with our flexible payment tool. See how your EMI compares to your savings.",
    cta: "Check EMIs",
    href: "/emi-calculator",
    image: `${cdn}/emi-calculator.png`,
    alt: "Calculator with rupee coins and a payment schedule",
  },
  {
    title: "Group Purchase",
    desc: "Partner with your neighbors or RWA members for massive bulk discounts on installations.",
    cta: "Learn More",
    href: "/group-purchase",
    image: `${cdn}/group-purchase.png`,
    alt: "Neighbours buying a shared solar system together",
  },
  {
    title: "Subsidy Guide 2026",
    desc: "A step-by-step walkthrough of the PM Surya Ghar Muft Bijli Yojana application process.",
    cta: "Get the Steps",
    href: "/subsidy",
    image: `${cdn}/subsidy-guide.png`,
    alt: "Approved government subsidy document beside solar panels",
  },
  {
    title: "Panel Comparison",
    desc: "Compare N-Type vs P-Type panels. Understand efficiency, degradation, and heat tolerance.",
    cta: "Compare Panels",
    href: "/solar-comparison",
    image: `${cdn}/panel-comparison.png`,
    alt: "Two solar panels compared side by side",
  },
  {
    title: "Inverter Guide",
    desc: "On-Grid, Hybrid, or Off-Grid? Learn which inverter suits your power backup needs.",
    cta: "Compare Inverters",
    href: "/inverter-comparison",
    image: `${cdn}/inverter-guide.png`,
    alt: "Wall-mounted hybrid solar inverter",
  },
];

const ExploreBeforeYouDecide = () => {
  return (
    <section className="relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col items-center h-full gap-10">
      {/* Heading */}
      <div className="w-full max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532]">
          Explore Before You Decide
        </h2>
        <p className="mt-3 text-[#757575] text-sm md:text-lg">
          Empowering you with the right tools and knowledge to make an informed
          choice for your home.
        </p>
      </div>

      {/* Cards: a snapping side-scroller on phones so the next card peeks in,
          a 2-up grid from sm and 3-up from lg. */}
      <div className="-mx-4 w-[calc(100%+2rem)] overflow-x-auto sm:mx-0 sm:w-full sm:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex snap-x snap-mandatory gap-5 px-4 sm:grid sm:grid-cols-2 sm:gap-6 sm:px-0 lg:grid-cols-3">
          {resources.map((resource) => (
            <article
              key={resource.title}
              className="flex w-[72%] shrink-0 snap-start flex-col rounded-2xl border border-[#B2B2B233] bg-[#F6F6F6] p-5 sm:w-auto md:p-6"
            >
              <div className="relative h-32 w-full md:h-40">
                <Image
                  src={resource.image}
                  alt={resource.alt}
                  fill
                  sizes="(max-width: 640px) 72vw, (max-width: 1024px) 45vw, 30vw"
                  className="object-contain object-center"
                />
              </div>

              <h3 className="mt-5 text-[22px] md:text-2xl font-semibold leading-tight text-black">
                {resource.title}
              </h3>
              <p className="mt-2 text-sm md:text-base font-medium leading-relaxed text-[#525252]">
                {resource.desc}
              </p>

              <Link
                href={resource.href}
                className="mt-4 inline-flex items-center gap-1.5 text-base md:text-lg font-semibold text-[#F88A22] hover:underline"
              >
                {resource.cta}
                <ArrowRight
                  className="h-4 w-4 md:h-5 md:w-5"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreBeforeYouDecide;
