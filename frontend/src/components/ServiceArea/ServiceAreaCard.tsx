import Image from "next/image";
import Link from "next/link";
import { CircleCheck, ArrowRight } from "lucide-react";
import type { ServiceAreaCard as ServiceAreaCardType } from "@/data/service-area-data";

export default function ServiceAreaCard({
  district,
  image,
  isTopHub,
  features,
  ctaLabel,
  ctaLink,
}: ServiceAreaCardType) {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_28px_rgba(0,0,0,0.1)] hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-56 w-full p-3">
        <div className="relative h-full w-full rounded-xl overflow-hidden">
          <Image
            src={image}
            alt={`Solar services in ${district}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
          {isTopHub && (
            <span className="absolute top-3 left-3 px-4 py-1.5 rounded-lg bg-[#F7BA41] text-[#272218] text-sm font-semibold shadow">
              Top Hub
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-grow px-6 pt-4 pb-6">
        <h3 className="text-2xl font-semibold text-[#123532] mb-5">
          {district}
        </h3>

        <ul className="space-y-4 mb-8">
          {features.map((feature, idx) => (
            <li
              key={idx}
              className="flex items-center gap-3 text-lg text-[#444444]"
            >
              <CircleCheck size={22} className="text-[#123532] shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="inline-flex items-center text-sm font-semibold text-[#444444] bg-gray-100 rounded-lg px-4 py-2.5">
            Local support active
          </span>
          <Link
            href={ctaLink}
            className="inline-flex items-center gap-2 text-base font-semibold text-[#123532] hover:text-[#5A8C4E] transition-colors"
          >
            {ctaLabel}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
