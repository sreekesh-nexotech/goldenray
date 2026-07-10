"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const AUTO_ADVANCE_MS = 5000;

const CDN = "https://golden-ray.b-cdn.net/images";

type Testimonial = {
  image: string;
  imageAlt: string;
  title: string;
  savings: string;
  duration: string;
  rating: string;
  quote: string;
  author: string;
  role: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    image: `${CDN}/efb490138fedbb55b92affe04c15698fbd0e408b.jpg`,
    imageAlt: "Haripad family in front of their rooftop solar home",
    title: "Haripad Group – 5 Families Installed",
    savings: "₹1,25,000",
    duration: "3 Weeks",
    rating: "4.9/5",
    quote:
      "The group approach made everything so much easier. We saved money and the whole process was smooth because we did it together.",
    author: "Rajesh Kumar",
    role: "Community Leader",
  },
  {
    image: `${CDN}/efb490138fedbb55b92affe04c15698fbd0e408b.jpg`,
    imageAlt: "Cherthala families with newly installed solar panels",
    title: "Cherthala Group – 6 Families Installed",
    savings: "₹1,50,000",
    duration: "3 Weeks",
    rating: "4.8/5",
    quote:
      "One survey, one crew, one schedule for all of us. The coordination was effortless and the savings were real.",
    author: "Anitha Menon",
    role: "Group Coordinator",
  },
  {
    image: `${CDN}/efb490138fedbb55b92affe04c15698fbd0e408b.jpg`,
    imageAlt: "Kayamkulam group solar installation",
    title: "Kayamkulam Group – 8 Families Installed",
    savings: "₹2,00,000",
    duration: "4 Weeks",
    rating: "5/5",
    quote:
      "Being the largest group in our area meant the biggest savings. Flarize handled every KSEB application for us.",
    author: "Suresh Nair",
    role: "Group Lead",
  },
  {
    image: `${CDN}/efb490138fedbb55b92affe04c15698fbd0e408b.jpg`,
    imageAlt: "Ambalappuzha families outside their solar-powered homes",
    title: "Ambalappuzha Group – 5 Families Installed",
    savings: "₹1,25,000",
    duration: "3 Weeks",
    rating: "4.9/5",
    quote:
      "We were nervous about going solar, but doing it as a group gave us confidence. Everyone got the same quality.",
    author: "Fathima Beevi",
    role: "Community Leader",
  },
  {
    image: `${CDN}/efb490138fedbb55b92affe04c15698fbd0e408b.jpg`,
    imageAlt: "Mavelikkara group solar rooftops",
    title: "Mavelikkara Group – 7 Families Installed",
    savings: "₹1,75,000",
    duration: "3 Weeks",
    rating: "4.7/5",
    quote:
      "The logistics savings were passed straight to us. Same panels, same warranty, a much better price.",
    author: "Thomas Varghese",
    role: "Group Coordinator",
  },
];

const GroupTestimonial = () => {
  const [index, setIndex] = useState(0);
  const pausedRef = useRef(false);

  // Auto-advance through the testimonials, looping back to the start.
  // Pauses while the user is hovering the carousel.
  useEffect(() => {
    const id = setInterval(() => {
      if (!pausedRef.current) {
        setIndex((i) => (i + 1) % TESTIMONIALS.length);
      }
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative py-12 sm:py-14 md:py-16 lg:py-20 xl:py-24 2xl:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-[#123532] text-4xl md:text-5xl font-semibold leading-tight text-center mb-8 sm:mb-10 md:mb-12">
          What families are saying about group solar
        </h2>

        {/* Carousel viewport */}
        <div
          className="overflow-hidden"
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {TESTIMONIALS.map((t) => (
              <div key={t.title} className="w-full shrink-0">
                <article className="flex flex-col gap-5 rounded-3xl bg-[#FEF3E8] p-5 sm:flex-row sm:gap-6 sm:p-6 md:gap-8 md:p-8">
                  {/* Image */}
                  <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl sm:aspect-square sm:w-40 md:w-48 lg:w-56">
                    <Image
                      src={t.image}
                      alt={t.imageAlt}
                      fill
                      sizes="(min-width: 640px) 224px, 100vw"
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="mb-4 text-lg font-semibold text-[#111827] md:text-2xl">
                      {t.title}
                    </h3>

                    {/* Stats */}
                    <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6">
                      <div>
                        <div className="mb-0.5 text-sm text-[#4B5563] md:text-base">
                          Total Group Savings
                        </div>
                        <div className="text-lg font-bold text-[#16A34A] md:text-xl">
                          {t.savings}
                        </div>
                      </div>
                      <div>
                        <div className="mb-0.5 text-sm text-[#4B5563] md:text-base">
                          Install Duration
                        </div>
                        <div className="text-lg font-bold text-[#2563EB] md:text-xl">
                          {t.duration}
                        </div>
                      </div>
                      <div>
                        <div className="mb-0.5 text-sm text-[#4B5563] md:text-base">
                          Community Rating
                        </div>
                        <div className="text-lg font-bold text-[#F7BA41] md:text-xl">
                          {t.rating}
                        </div>
                      </div>
                    </div>

                    {/* Quote */}
                    <p className="mb-3 text-sm leading-relaxed text-[#374151] md:text-base">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <p className="text-sm text-[#4B5563] md:text-base">
                      - {t.author}, {t.role}
                    </p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="mt-6 flex justify-center gap-2">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.title}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? "w-5 bg-[#123532]" : "w-2 bg-[#D1D5DB]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GroupTestimonial;
