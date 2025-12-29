import Image from "next/image";
import PageIllustration from "@/components/ui/page-illustration";
import LinkingButton from "../ui/LinkingButton";

export default function AboutHero() {
  return (
    <section className="relative w-full  overflow-hidden ">
      <PageIllustration />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-28 max-w-7xl flex flex-col md:flex-row items-center h-full xl:gap-40 gap-0">
        {/* Left Side - Text */}
        <div className="w-full  text-center md:text-left">
          <h1 className="text-[40px]/10 sm:text-5xl lg:text-7xl font-bold text-[#123532] mb-4">
            Clean Energy, Made Simple
          </h1>
          <p className="hidden md:block text-base sm:text-lg md:text-2xl text-[#444444] mb-6">
            At Flarize, we believe in harnessing the limitless power of the sun
            to create a cleaner, greener, and more sustainable future.
          </p>

          <LinkingButton
            content="Join Our Team &#10141;"
            ButtonLink="#team"
            ButtonBg="bg-[#F7BA41]"
            Buttontext="text-[#272218]"
            ButtonHover="hover:bg-yellow-500"
          />
        </div>

        {/* Right Side - Image */}
        <div className="w-full mx-auto  mt-10 md:mt-0 flex justify-center">
          <Image
            src="https://golden-ray.b-cdn.net/images/AboutUs1.jpg"
            alt="Solar House"
            width={500}
            height={350}
            className="rounded-xl w-full max-w-[500px] h-auto"
          />
        </div>
      </div>
    </section>
  );
}
