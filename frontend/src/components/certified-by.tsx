import Image from "next/image";
import logo1 from "../../public/image-33.png";
import logo2 from "../../public/image-36.png";
import logo3 from "../../public/image-34.png";
import logo4 from "../../public/image-37.png";
import logo5 from "../../public/image-32.png";

export default function Certified() {
  return (
    <section className="bg-white py-[clamp(2rem,5vw,3rem)]">
      <div className="max-w-[90%] lg:max-w-[80rem] mx-auto text-center">
        {/* Heading */}
        <h2 className="text-[clamp(0.75rem,2vw,0.875rem)] font-semibold text-gray-800 uppercase tracking-wider">
          Certified by the Best
        </h2>

        {/* Logos */}
        <div className="flex justify-center items-center gap-[clamp(1rem,3vw,1.5rem)] mt-[clamp(1.5rem,4vw,2rem)] flex-wrap">
          {/* ISO Logo */}
          <div className="flex items-center justify-center min-w-[4rem] min-h-[4rem] sm:min-w-[5rem] sm:min-h-[5rem]">
            <Image
              src={logo1}
              alt="ISO Certified"
              width={80}
              height={80}
              className="object-contain max-w-full max-h-full"
            />
          </div>

          {/* Startup India Logo (Increased Size) */}
          <div className="flex items-center justify-center min-w-[6rem] min-h-[6rem] sm:min-w-[8rem] sm:min-h-[8rem]">
            <Image
              src={logo2}
              alt="Startup India"
              width={128}
              height={128}
              className="object-contain max-w-full max-h-full"
            />
          </div>

          {/* KSEB Logo */}
          <div className="flex items-center justify-center min-w-[4rem] min-h-[4rem] sm:min-w-[5rem] sm:min-h-[5rem]">
            <Image
              src={logo3}
              alt="KSEB"
              width={80}
              height={80}
              className="object-contain max-w-full max-h-full"
            />
          </div>

          {/* Kerala Startup Mission Logo */}
          <div className="flex items-center justify-center min-w-[4rem] min-h-[4rem] sm:min-w-[5rem] sm:min-h-[5rem]">
            <Image
              src={logo4}
              alt="Kerala Startup Mission"
              width={80}
              height={80}
              className="object-contain max-w-full max-h-full"
            />
          </div>

          {/* Award Logo */}
          <div className="flex items-center justify-center min-w-[4rem] min-h-[4rem] sm:min-w-[5rem] sm:min-h-[5rem]">
            <Image
              src={logo5}
              alt="Award"
              width={80}
              height={80}
              className="object-contain max-w-full max-h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}