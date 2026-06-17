import Image from "next/image";
import { MapPin, Users } from "lucide-react";
import { locationServiceCards } from "@/data/service-area-data";

const icons = [MapPin, Users];

export default function ExploreByLocation() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-12 lg:py-16 bg-[#F3F4F6]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
        {/* Left - Map image */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#0a1f2e]">
          <Image
            src="https://golden-ray.b-cdn.net/images/img%20(8).png"
            alt="Map of Flarize solar service locations across Kerala"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* Right - Text + cards */}
        <div>
          <h2 className="text-3xl md:text-5xl font-semibold text-[#123532] leading-tight mb-5">
            Explore Solar Services by Location
          </h2>
          <p className="text-base md:text-lg text-[#666666] leading-relaxed mb-8">
            Our connected network ensures that whether you&apos;re in the busy
            streets of Ernakulam or the heights of Idukki, professional solar
            engineering is just a call away.
          </p>

          <div className="space-y-7">
            {locationServiceCards.map((card, idx) => {
              const Icon = icons[idx] ?? MapPin;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-5 rounded-2xl bg-[#1C6164] p-7"
                >
                  <span className="shrink-0 flex items-center justify-center h-12 w-12 rounded-xl bg-[#2A7376]">
                    <Icon size={22} className="text-white" />
                  </span>
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-white mb-1">
                      {card.title}
                    </h3>
                    <p className="text-sm text-white/70 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
