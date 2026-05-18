"use client";
import { TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Testimonial {
  initials: string;
  name: string;
  role: string;
  earned: string;
  quote: string;
  referrals: number;
  installations: number;
  conversion: string;
}

const testimonials: Testimonial[] = [
  {
    initials: "AK",
    name: "Arun Kumar",
    role: "Social Media Influencer, Kochi | Active Partner since 2025",
    earned: "₹72,000 earned",
    quote:
      "I mention solar as a natural upgrade conversation with homebuyers — it fits perfectly into discussions about running costs and long-term value. The Golden Sun team handles everything after I make the introduction. I've had 9 installations in 4 months without it feeling like sales work at all.",
    referrals: 9,
    installations: 9,
    conversion: "100% conversion",
  },
  {
    initials: "PR",
    name: "Priya Raj",
    role: "Real Estate Agent, Thiruvananthapuram | Active Partner since 2024",
    earned: "₹1,20,000 earned",
    quote:
      "Every property handover meeting now ends with a solar conversation. Flarize's sales team takes the technical questions off my plate, and the commission credit lands within 10 days of installation. It has become my most consistent additional income source.",
    referrals: 17,
    installations: 15,
    conversion: "88% conversion",
  },
  {
    initials: "SN",
    name: "Sajeev Nair",
    role: "Financial Advisor, Kozhikode | Active Partner since 2024",
    earned: "₹96,000 earned",
    quote:
      "Solar payback fits naturally into the long-term planning conversations I already have with clients. Flarize gives me documented payback numbers I can actually defend, and a partner manager who responds within an hour. The referrals close because the math is honest.",
    referrals: 12,
    installations: 12,
    conversion: "100% conversion",
  },
  {
    initials: "RM",
    name: "Rahul Menon",
    role: "Builder, Ernakulam | Active Partner since 2024",
    earned: "₹1,60,000 earned",
    quote:
      "We position every villa handover as solar-ready, and Flarize handles the full installation post-possession. Buyers see immediate value, we earn a meaningful commission per unit, and the project finishes on schedule. It is the cleanest add-on revenue we have.",
    referrals: 22,
    installations: 20,
    conversion: "91% conversion",
  },
  {
    initials: "AT",
    name: "Anita Thomas",
    role: "RWA Representative, Thrissur | Active Partner since 2025",
    earned: "₹64,000 earned",
    quote:
      "Our society did a coordinated solar drive and 8 families signed up in the same month. Flarize ran one combined site assessment for the block, which made the whole thing painless. Residents trust the recommendation because it came from inside the community.",
    referrals: 8,
    installations: 8,
    conversion: "100% conversion",
  },
];

const Testimonials = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col items-center h-full gap-8">
      {/* Heading */}
      <div className="w-full max-w-7xl mx-auto text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4">
          Real Affiliates. Real Earnings.
        </h2>
        <p className="text-sm md:text-xl font-normal leading-relaxed text-[#4B5563]">
          People across Kerala earning ₹10,000 to ₹40,000+ per month through
          their networks.
        </p>
      </div>

      {/* Testimonials Grid */}

      {/* Carousel Card */}
      <div className="w-full">
        <div className="overflow-hidden rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                aria-hidden={active !== idx}
                className="w-full shrink-0 bg-[#F7F7F2] p-5 sm:p-8"
              >
                {/* Top: avatar + meta */}
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <div className="w-10 h-10 sm:w-15 sm:h-15 md:w-20 md:h-20 rounded-full bg-[#334155] text-white flex items-center justify-center font-semibold text-base md:text-xl leading-snug shrink-0">
                    {t.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl md:text-2xl font-semibold leading-snug text-[#123532]">
                      {t.name}
                    </h3>
                    <p className="text-xs md:text-base font-normal leading-normal text-[#444444]">
                      {t.role}
                    </p>
                  </div>
                </div>

                {/* Earned badge */}
                <div className="inline-flex items-center gap-1 bg-[#16A34A33] text-[#16A34A] text-base md:text-xl font-semibold leading-snug px-3 py-1 rounded-md mb-4">
                  <TrendingUp
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    strokeWidth={2.5}
                  />
                  <span>{t.earned}</span>
                </div>

                {/* Quote */}
                <p className="text-sm md:text-xl font-normal leading-relaxed text-[#444444] mb-5">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Stats footer */}
                <p className="text-xs md:text-base font-normal leading-normal text-[#5B5B5B]">
                  {t.referrals} referrals →{" "}
                  <span className="text-[#16A34A]">
                    {t.installations} installations
                  </span>
                  <span className="mx-2">·</span>
                  <span>{t.conversion}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActive(idx)}
              aria-label={`Show testimonial ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                active === idx
                  ? "w-6 bg-[#074A4D]"
                  : "w-2 bg-[#D1D5DB] hover:bg-[#9CA3AF]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
