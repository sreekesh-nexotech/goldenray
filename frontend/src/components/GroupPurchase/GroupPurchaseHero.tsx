import Image from "next/image";
import Link from "next/link";
import PageIllustration from "@/components/ui/page-illustration";

const heroImage = "https://golden-ray.b-cdn.net/images/slide1.jpg";
const heroImageAlt = "Aerial view of a neighborhood with solar panels";

export default function GroupPurchaseHero() {
  return (
    <section className="relative w-full overflow-hidden">
      <PageIllustration />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-12 md:pt-28 md:pb-16 lg:pt-32 lg:pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="w-full lg:w-[52%] text-center lg:text-left">
            <h1 className="text-[1.75rem]/[1.12] sm:text-[2.25rem]/[1.12] md:text-[2.75rem]/[1.12] lg:text-[3.25rem]/[1.12] xl:text-[3.5rem]/[1.12] 2xl:text-[3.75rem]/[1.12] text-[#123532]">
              <span className="block">Group Solar Purchase</span>
              <span className="block">in Kerala &mdash;</span>
              <span className="block">
                <span className="text-[#F18627]">Save ₹10,000</span> with
              </span>
              <span className="block">Your Neighbours</span>
            </h1>
            <p
              className="mt-5 text-sm sm:text-base md:text-lg lg:text-lg xl:text-lg 2xl:text-xl text-[#4B4B4B] font-medium"
              lang="ml"
            >
              എല്ലാ മാസവും KSEB ബിൽ കൂടുകയാണോ? ഗ്രൂപ്പ് സോളാർ മാറിയാൽ ₹10,000
              വരെ ലാഭിക്കാം.
            </p>
            <div className="mt-6 flex justify-center lg:justify-start">
              <Link
                href="/contactus"
                className="btn bg-[#F7BA41] text-[#272218] hover:bg-[#f0b235]"
              >
                Reserve Your Group Spot
              </Link>
            </div>
            <p className="mt-5 text-xs sm:text-sm md:text-base lg:text-base xl:text-lg 2xl:text-lg text-[#5A5A5A]">
              Kerala families pay{" "}
              <span className="font-semibold text-[#E13B2E]">₹36,000+</span> per
              year on electricity. After group solar installation, most pay
              under <span className="font-semibold text-[#1C9C4A]">₹6,000</span>
              .
            </p>
          </div>

          <div className="w-full lg:w-[48%]">
            <div className="relative w-full h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] xl:h-[460px]">
              <Image
                src={heroImage}
                alt={heroImageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover rounded-3xl shadow-[0_20px_60px_rgba(18,53,50,0.15)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
