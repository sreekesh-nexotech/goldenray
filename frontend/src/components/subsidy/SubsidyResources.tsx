import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const RESOURCES = [
  {
    href: "/resources",
    image:
      "https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/d90c8f1f5d6d4016123a85d01e9e38dfdf914743.png",
    imageAlt: "A Kerala family at home after their rooftop solar installation",
    category: "Case Studies",
    categoryTone: "bg-[#FDF3D9] text-[#8A6100]",
    title: "How the Sharma Family Saved ₹2.5L Annually",
    description: "Real case study of 5kW solar installation in Kochi.",
    readTime: "5 min read",
  },
  {
    href: "/inverter-comparison",
    image:
      "https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/d8d6a922e1c4488fc36db41761a359b6bf37a096.png",
    imageAlt: "Close-up of solar inverter hardware",
    category: "Comparisons",
    categoryTone: "bg-[#E8E6FB] text-[#5B4FC7]",
    title: "String vs Power Optimizers: Which is Better?",
    description:
      "Detailed comparison of solar inverter technologies for Indian homes.",
    readTime: "5 min read",
  },
  {
    href: "/resources",
    image:
      "https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/7df9926a0c4b9fb6dd483119735a21ba5d951f84.png",
    imageAlt: "Solar panel exposed to rain and foliage",
    category: "Maintenance",
    categoryTone: "bg-[#FBE3E3] text-[#C0392B]",
    title: "Solar Panel Maintenance During Monsoon",
    description:
      "Essential tips to maintain solar panels during Kerala's monsoon season.",
    readTime: "5 min read",
  },
];

export default function SubsidyResources() {
  return (
    <section className="w-full bg-white px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-12 sm:py-14 lg:py-16">
      <div className="w-full max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532]">
          Deep Dive into Solar Subsidies
        </h2>
        <p className="mt-3 text-[#757575] text-sm md:text-lg">
          Explore more resources and guides to help you transition to clean
          energy.
        </p>
      </div>

      {/* Swipeable on mobile, grid from sm up */}
      <div className="mx-auto mt-8 sm:mt-10 lg:mt-12 max-w-7xl">
        <div className="-mx-4 w-[calc(100%+2rem)] overflow-x-auto sm:mx-0 sm:w-full sm:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="flex snap-x snap-mandatory gap-6 px-4 sm:grid sm:grid-cols-2 sm:gap-7 sm:px-0 lg:grid-cols-3">
            {RESOURCES.map(
              ({
                href,
                image,
                imageAlt,
                category,
                categoryTone,
                title,
                description,
                readTime,
              }) => (
                <li
                  key={title}
                  className="w-[78%] shrink-0 snap-start sm:w-auto"
                >
                  <Link
                    href={href}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#F0F0F0] bg-white shadow-[0_4px_20px_rgba(18,53,50,0.05)] transition-shadow hover:shadow-[0_8px_28px_rgba(18,53,50,0.1)]"
                  >
                    <div className="relative h-44 sm:h-48 w-full shrink-0">
                      <Image
                        src={image}
                        alt={imageAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <span
                        className={`inline-flex w-fit items-center rounded-md px-2.5 py-1 text-[11px] font-medium ${categoryTone}`}
                      >
                        {category}
                      </span>

                      <h3 className="mt-4 text-base md:text-lg font-bold leading-snug text-[#123532]">
                        {title}
                      </h3>
                      <p className="mt-3 text-xs md:text-sm leading-relaxed text-[#5C5C5C]">
                        {description}
                      </p>

                      <div className="mt-auto pt-6">
                        <div className="flex items-center justify-between border-t border-[#F0F0F0] pt-4">
                          <span className="text-xs text-[#9A9A9A]">
                            {readTime}
                          </span>
                          <ArrowRight
                            className="h-4 w-4 text-[#0E7A55] transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
