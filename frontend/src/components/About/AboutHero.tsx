import Image from "next/image";
import PageIllustration from "@/components/ui/page-illustration";
import LinkingButton from "../ui/LinkingButton";

export default function AboutHero() {
  return (
    <section className="relative w-full  overflow-hidden ">
      <PageIllustration />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-28 pb-1 max-w-7xl flex flex-col md:flex-row items-center h-full xl:gap-40 gap-0">
        {/* Left Side - Text */}
        <div className="w-full  text-center md:text-left">
          <h1 className="text-[40px]/10 sm:text-5xl lg:text-7xl font-bold text-[#123532] mb-4">
            Clean Energy, Made Simple
          </h1>
          <p className="hidden md:block text-base sm:text-lg text-[#444444] mb-6">
            Solar means running your AC without guilt. Working from home
            comfortably. Raising kids without constantly checking the meter.
          </p>
          <p className="hidden md:block text-base sm:text-lg text-[#444444] mb-2">
            But here&apos;s something most installers won&apos;t tell you:
          </p>
          <p className="hidden md:block text-base sm:text-lg text-[#444444] font-semibold mb-2">
            What happens when they shut down?
          </p>
          <p className="hidden md:block text-base sm:text-lg text-[#444444] mb-6">
            Most solar companies don&apos;t last. Your system needs to work for
            25 years. That gap is the real problem—and it&apos;s exactly what we
            built Flarize to solve.
          </p>

          <LinkingButton
            content="Explore Now &#10141;"
            ButtonLink="#team"
            ButtonBg="bg-[#F7BA41]"
            Buttontext="text-[#272218]"
            ButtonHover="hover:bg-yellow-500"
          />
        </div>

        {/* Right Side - Image */}
        <div className="w-full mx-auto  mt-10 md:mt-0 flex justify-center">
          <Image
            src="https://golden-ray.b-cdn.net/About%20us/d44d8059-d21e-4d21%20ENHANCED.jpeg"
            alt="Solar House"
            width={700}
            height={350}
            className="rounded-xl w-full max-w-[700px] h-auto"
          />
        </div>
      </div>
    </section>
  );
}
