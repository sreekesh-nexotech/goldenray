import { Sun, Home, Zap, type LucideIcon } from "lucide-react";
import {
  getServiceAreaContent,
  type WhySolarIcon,
} from "@/data/service-area-content";

const ICONS: Record<WhySolarIcon, LucideIcon> = {
  sun: Sun,
  roof: Home,
  grid: Zap,
};

const WhySolar = ({ district }: { district?: string }) => {
  const { intro, points } = getServiceAreaContent(district).whySolar;

  return (
    <section className="relative z-10 container mx-auto flex h-full max-w-7xl flex-col items-center gap-8 px-4 py-10 pb-6 md:py-20 xl:py-16">
      {/* Heading and description */}
      <div className="mx-auto mb-4 w-full max-w-4xl text-center">
        <h2 className="mb-4 text-4xl font-bold leading-tight text-[#123532] md:text-5xl">
          Why Solar Works Well in {district ?? "Kerala"}
        </h2>
        <p className="text-sm font-normal leading-relaxed text-[#4B5563] md:text-xl">
          {intro}
        </p>
      </div>

      {/* Points */}
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
        {points.map((point) => {
          const Icon = ICONS[point.icon];
          return (
            <div
              key={point.title}
              className="flex flex-col items-center rounded-2xl  bg-[#F7F4E6] px-6 py-8 text-center"
            >
              <span className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#FDF6D280]  border border-[#F7BA41]  text-[#F7BA41]">
                <Icon size={26} />
              </span>
              <h3 className="mb-3 text-2xl font-medium text-black">
                {point.title}
              </h3>
              <p className="text-lg leading-relaxed text-[#444444]">
                {point.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WhySolar;
