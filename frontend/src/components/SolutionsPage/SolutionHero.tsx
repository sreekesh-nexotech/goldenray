// src/components/SolutionsPage/SolutionHero.tsx
import Image from "next/image";
import { SolutionHeroData } from "@/data/solutions-page-data";

interface SolutionHeroProps {
  data: SolutionHeroData;
}

export default function SolutionHero({ data }: SolutionHeroProps) {
  return (
    <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
      {/* Background Image */}
      <Image
        src={data.image}
        fill
        alt={data.title}
        className="object-cover"
        sizes="100vw"
        priority
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative h-full flex items-center px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white leading-tight uppercase max-w-3xl">
            {data.title}
          </h1>
        </div>
      </div>
    </section>
  );
}
