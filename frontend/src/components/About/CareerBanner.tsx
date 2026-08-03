import Image from "next/image";
import Link from "next/link";

export default function CareerBanner() {
  return (
    <section className="py-16">
      <div className="relative max-w-full mx-auto aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] overflow-hidden flex items-center justify-center">
        <Image
          src="https://golden-ray.b-cdn.net/About%20us/f6e7954ac38b29096c6d713f04250af8caadedb4.jpg"
          alt="The Flarize team collaborating in the office"
          fill
          sizes="100vw"
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-[#123532]/60" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 py-16">
          <p className="text-white/90 text-sm md:text-base font-semibold mb-3">
            Help Build What Comes Next
          </p>

          <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-semibold leading-snug max-w-2xl mb-8">
            We&apos;re looking for curious minds, creative thinkers, and
            ambitious builders to join our team in Kerala.
          </h2>

          <Link
            href="/career"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-[#F7BA41] text-[#272218] font-semibold transition-colors hover:bg-yellow-500"
          >
            View Open Positions
          </Link>
        </div>
      </div>
    </section>
  );
}
