import Image from "next/image";
import logo1 from "../../public/image-33.png";
import logo2 from "../../public/image-36.png";
import logo3 from "../../public/image-34.png";
import logo4 from "../../public/image-37.png";
import logo5 from "../../public/image-32.png";

export default function Certified() {
  return (
    <section className="bg-white py-1 md:py-3 xl:py-2 2xl:py-3">
      <div className="max-w-[95%] lg:max-w-[90rem] mx-auto text-center">
        {/* Heading */}
        <h2 className="text-base md:text-xl lg:text-xl xl:text-2xl 2xl:text-3xl font-semibold text-gray-800 uppercase tracking-wider">
          Certified & KSEB Approved Solar Installer
        </h2>

        {/* Logos */}
        <div className="flex justify-center items-center gap-4 lg:gap-[clamp(3rem,7vw,6rem)] mt-[clamp(1.5rem,4vw,2rem)] flex-wrap">
          {/* ISO Logo */}
          <div className="flex items-center justify-center min-w-[4rem] min-h-[4rem] sm:min-w-[5rem] sm:min-h-[5rem] lg:min-w-[7rem] lg:min-h-[7rem] xl:min-w-[9rem] xl:min-h-[9rem]">
            <Image
              src={logo1}
              alt="ISO Certified"
              width={180}
              height={180}
              className="object-contain max-w-full max-h-full w-20 h-20 lg:w-[7rem] lg:h-[7rem] xl:w-[9rem] xl:h-[9rem]"
            />
          </div>

          {/* Startup India Logo (Increased Size) */}
          <div className="flex items-center justify-center min-w-[6rem] min-h-[6rem] sm:min-w-[8rem] sm:min-h-[8rem] lg:min-w-[9rem] lg:min-h-[9rem] xl:min-w-[12rem] xl:min-h-[12rem]">
            <Image
              src={logo2}
              alt="Startup India"
              width={240}
              height={240}
              className="object-contain max-w-full max-h-full w-32 h-32 lg:w-[9rem] lg:h-[9rem] xl:w-[12rem] xl:h-[12rem]"
            />
          </div>

          {/* KSEB Logo */}
          <div className="flex items-center justify-center min-w-[4rem] min-h-[4rem] sm:min-w-[5rem] sm:min-h-[5rem] lg:min-w-[7rem] lg:min-h-[7rem] xl:min-w-[9rem] xl:min-h-[9rem]">
            <Image
              src={logo3}
              alt="KSEB"
              width={180}
              height={180}
              className="object-contain max-w-full max-h-full w-20 h-20 lg:w-[7rem] lg:h-[7rem] xl:w-[9rem] xl:h-[9rem]"
            />
          </div>

          {/* Kerala Startup Mission Logo */}
          <div className="flex items-center justify-center min-w-[4rem] min-h-[4rem] sm:min-w-[5rem] sm:min-h-[5rem] lg:min-w-[7rem] lg:min-h-[7rem] xl:min-w-[9rem] xl:min-h-[9rem]">
            <Image
              src={logo4}
              alt="Kerala Startup Mission"
              width={180}
              height={180}
              className="object-contain max-w-full max-h-full w-20 h-20 lg:w-[7rem] lg:h-[7rem] xl:w-[9rem] xl:h-[9rem]"
            />
          </div>

          {/* Award Logo */}
          <div className="flex items-center justify-center min-w-[4rem] min-h-[4rem] sm:min-w-[5rem] sm:min-h-[5rem] lg:min-w-[7rem] lg:min-h-[7rem] xl:min-w-[9rem] xl:min-h-[9rem]">
            <Image
              src={logo5}
              alt="Award"
              width={180}
              height={180}
              className="object-contain max-w-full max-h-full w-20 h-20 lg:w-[7rem] lg:h-[7rem] xl:w-[9rem] xl:h-[9rem]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
