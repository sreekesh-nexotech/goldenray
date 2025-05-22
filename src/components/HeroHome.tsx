import Image from 'next/image'; 
import heroImg from '../../public/heroImg.png'
import Link from 'next/link';

export default function HeroHome() {
  return (
    <section className="relative w-full  overflow-hidden min-h-screen">
      {/* Grid Background Layer */}
      <div
        className="absolute inset-0 z-0 opacity-50 pointer-events-none 
          bg-[url('../../public/grid.svg')] 
          bg-no-repeat 
          bg-auto 
          mask-[linear-gradient(to_right,transparent,black_20%,black_70%,transparent)] 
          [-webkit-mask-image:linear-gradient(to_right,transparent,black_20%,black_70%,transparent)]"
      />

      {/* Radial Gradients Layer */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 80% at 0% 18%, #F8F2E1 0%, rgba(255, 255, 255, 0) 70%),
            radial-gradient(ellipse 80% 80% at 100% 18%, #F8F2E1 0%, rgba(255, 255, 255, 0) 70%)
          `,
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-5 py-32 max-w-7xl flex flex-col md:flex-row items-center h-full lg:gap-8 gap-0">
        {/* Left Side - Text */}
        <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-[40px]/10 sm:text-5xl lg:text-7xl font-bold text-[#123532] mb-4">
            We help you go solar in <span className="text-[#ED8723] line-through">months</span>
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-[#444444] mb-6">
            Save more, live sustainably, and enjoy a brighter future with effortless solar solutions.
          </p>

          <div className="flex flex-row justify-center text-xs lg:text-lg md:justify-start lg:gap-4 gap-2 ">
            <Link href='/' className="btn bg-[#F7BA41] text-[#272218] hover:bg-yellow-500">
              Calculate solar advantage
            </Link>
            <Link href="/" className="btn border border-[#074A4D] text-[#074A4D] hover:bg-yellow-100">
              Book Consultation
            </Link>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <Image
            src={heroImg}
            alt="Solar House"
            width={500}
            height={350}
            className="rounded-xl w-full max-w-[500px] h-auto"
          />
        </div>
      </div>
    </section>
  );
};
