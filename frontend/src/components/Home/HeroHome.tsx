import Image from 'next/image'; 
import PageIllustration from '@/components/ui/page-illustration';
import LinkingButton from '../ui/LinkingButton';


export default function HeroHome() {


  const heroImg = "https://gym-manager-pull.b-cdn.net/golden_ray/home/heroImg.png?width=500&format=webp";
  return (
    <section className="relative w-full  overflow-hidden ">
     <PageIllustration/>
      

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-32 max-w-7xl flex flex-col md:flex-row items-center h-full xl:gap-40 gap-0">
        {/* Left Side - Text */}
        <div className="w-full  text-center md:text-left">
            <h1 className="text-[40px]/10 sm:text-5xl lg:text-7xl font-bold text-[#123532] mb-4">
            We help you go solar in <span className="text-[#ED8723] line-through">months</span>
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-[#444444] mb-6">
            Save more, live sustainably, and enjoy a brighter future with effortless solar solutions.
          </p>

          <div className="flex flex-row justify-center text-xs lg:text-lg md:justify-start lg:gap-4 gap-2 ">
            <LinkingButton content="Calculate Solar Advantage" ButtonLink="#solar-advantage" ButtonBg='bg-[#F7BA41]' Buttontext='text-[#272218]' ButtonHover='hover:bg-yellow-500'/>
            <LinkingButton content="Book Consultation" ButtonLink="#booking" ButtonBorder='border border-[#074A4D]' ButtonBg='bg-[#FFFFFF]' Buttontext='text-[#074A4D]' ButtonHover='hover:bg-[#eeeeee]'/>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-full mx-auto  mt-10 md:mt-0 flex justify-center">
          <Image
            src={heroImg}
            alt="Solar House"
            width={500}
            height={350}
            priority={true}
            className="rounded-xl w-full max-w-[500px] h-auto"
          />
        </div>
      </div>
    </section>
  );
};
