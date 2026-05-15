// src/components/SolutionsPage/SolarTypes.tsx
import Image from "next/image";

interface SolarType {
  title: string;
  description: string;
}

interface SolarTypesProps {
  title?: string;
  solarTypes: SolarType[];
  backgroundImage?: string;
  cardImage?: string;
}

export default function SolarTypes({
  title = "Types of Solar Panels",
  solarTypes,
  backgroundImage = "https://golden-ray.b-cdn.net/images/img.jpg",
  cardImage = "https://gym-manager-pull.b-cdn.net/golden_ray/solution/Rectangle-12153.png",
}: SolarTypesProps) {
  return (
    <section className="relative w-full py-16 md:py-20 lg:py-24 px-4 md:px-6 lg:px-8 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Solar panels background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-center text-white mb-12 md:mb-16 lg:mb-20">
          {title}
        </h2>

        {/* Solar Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {solarTypes.map((type, index) => (
            <div
              key={index}
              className="group relative bg-black/30 backdrop-blur-sm rounded-2xl md:rounded-3xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300"
            >
              {/* Card Content - Horizontal Layout */}
              <div className="flex flex-row items-stretch h-full min-h-[180px] md:min-h-[240px]">
                {/* Text Content - Left Side */}
                <div className="flex-1 p-4 md:p-8 flex flex-col justify-center">
                  <h3 className="text-base md:text-xl lg:text-2xl font-semibold leading-snug text-white mb-2 md:mb-4">
                    {type.title}
                  </h3>
                  <p className="text-white/90 text-xs md:text-sm lg:text-base font-normal leading-normal">
                    {type.description}
                  </p>
                </div>

                {/* Card Image - Right Side */}
                <div className="relative w-[140px] md:w-1/2 overflow-hidden flex-shrink-0">
                  <Image
                    src={cardImage}
                    alt={type.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 140px, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
