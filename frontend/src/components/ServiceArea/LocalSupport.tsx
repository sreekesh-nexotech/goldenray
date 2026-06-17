import { ShieldCheck, UserCog, Landmark, HeartPulse } from "lucide-react";
import { localSupportFeatures } from "@/data/service-area-data";

const iconMap = {
  shield: ShieldCheck,
  users: UserCog,
  bank: Landmark,
  care: HeartPulse,
} as const;

export default function LocalSupport() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-5xl font-semibold text-[#123532] mb-4">
            Local Solar Support You Can Trust
          </h2>
          <p className="text-base md:text-lg text-[#666666] leading-relaxed">
            We combine global technology standards with deep local expertise for
            Kerala&apos;s unique climate and policy landscape.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {localSupportFeatures.map((feature, idx) => {
            const Icon = iconMap[feature.icon];
            return (
              <div
                key={idx}
                className={`${feature.bg} rounded-2xl px-6 py-12 text-center flex flex-col items-center justify-center min-h-[280px] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(0,0,0,0.1)]`}
              >
                <span
                  className={`flex items-center justify-center h-14 w-14 rounded-full ${feature.iconBg} mb-5`}
                >
                  <Icon size={26} className={feature.iconColor} />
                </span>
                <h3 className="text-lg font-semibold text-[#123532] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#666666] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
