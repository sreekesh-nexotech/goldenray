import Image from "next/image";

const teamPhotos = [
  "https://golden-ray.b-cdn.net/About%20us/3ed69491d4806925ed05dbda2d909f9ed7742996.jpg",
  "https://golden-ray.b-cdn.net/About%20us/3ed69491d4806925ed05dbda2d909f9ed7742996.jpg",
];

export default function TeamShowcase() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 xl:px-16">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#123532] mb-10">
          Meet the Flarize Team
        </h2>

        {/* Photos — horizontal snap-scroll carousel on mobile, side-by-side from sm up */}
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0">
          {teamPhotos.map((photo, index) => (
            <div
              key={index}
              className="relative min-w-[85%] snap-start aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 sm:min-w-0"
            >
              <Image
                src={photo}
                alt="The Flarize team"
                fill
                sizes="(min-width: 640px) 45vw, 85vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <blockquote className="mt-10 max-w-2xl mx-auto text-base md:text-lg text-[#444444] italic leading-relaxed">
          &quot;The team explained every stage, from understanding our energy
          needs to system design, installation and activation. Timelines were
          shared in advance and the work stayed on track, no unnecessary
          delays.&quot;
        </blockquote>
        <p className="mt-4 text-sm text-gray-500">
          -Jose V P &middot; 3 kW system &middot; Vadakkal, Alappuzha
        </p>
      </div>
    </section>
  );
}
