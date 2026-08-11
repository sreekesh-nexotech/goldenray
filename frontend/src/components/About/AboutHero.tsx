import Image from "next/image";
import Link from "next/link";
import PageIllustration from "../ui/page-illustration";

export default function AboutUsHero() {
  return (
    <>
      {/* Mobile hero */}
      <section className="sm:hidden bg-white px-4 pb-10">
        <div className="relative overflow-hidden text-center mb-6 py-6 -mx-4 px-4">
          <PageIllustration isGrid={true} />

          <div className="relative">
            <p className="text-[#123532] font-bold tracking-[0.2em] text-xs uppercase mb-3">
              About Flarize
            </p>

            <h1 className="text-[#123532] font-bold leading-[0.95] tracking-tight text-4xl mb-4">
              Elevate your everyday.
            </h1>

            <p className="text-[#555555] text-base font-normal leading-relaxed">
              Flarize helps you choose solar with clear eyes, then stands
              behind it for 25 years. Solar today, your whole home in time.
            </p>
          </div>
        </div>

        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6">
          <Image
            src="https://golden-ray.b-cdn.net/About%20us/3ed69491d4806925ed05dbda2d909f9ed7742996.jpg"
            alt="The Flarize team"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <div className="relative flex flex-col gap-3 z-10">
          <Link
            href="#team"
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#F7BA41] text-[#272218] font-semibold text-base transition-colors hover:bg-yellow-500"
          >
            Meet our team
          </Link>
          <Link
            href="/career"
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg border border-[#123532] text-[#123532] font-semibold text-base transition-colors hover:bg-[#123532] hover:text-white"
          >
            View Open Positions
          </Link>
        </div>
      </section>

      {/* Larger screens hero — unchanged */}
      <section className="relative w-full min-h-screen hidden sm:flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <Image
          src="https://golden-ray.b-cdn.net/About%20us/3ed69491d4806925ed05dbda2d909f9ed7742996.jpg"
          alt="The Flarize team"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center -z-10"
        />

        {/* Overlay for text contrast */}
        <div className="absolute inset-0 -z-10 bg-black/30" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <p className="text-white font-bold tracking-[0.2em] text-sm md:text-base uppercase mb-4">
            About Flarize
          </p>

          <h1 className="text-white font-bold leading-[0.95] tracking-tight text-6xl md:text-8xl mb-6">
            Elevate your everyday.
          </h1>

          <p className="text-white/90 text-lg md:text-2xl font-normal leading-relaxed max-w-6xl mb-10">
            Flarize helps you choose solar with clear eyes, then stands behind it
            for 25 years. Solar today, your whole home in time.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <Link
              href="#team"
              className="inline-flex items-center justify-center min-w-[300px] px-8 py-4 rounded-lg bg-[#F7BA41] text-[#272218] font-semibold text-lg transition-colors hover:bg-yellow-500"
            >
              Meet the Our Team
            </Link>
            <Link
              href="/career"
              className="inline-flex items-center justify-center min-w-[300px] px-8 py-4 rounded-lg bg-white text-[#272218] font-semibold text-lg transition-colors hover:bg-gray-100"
            >
              View Open Positions
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
