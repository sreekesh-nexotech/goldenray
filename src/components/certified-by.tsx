import Image from "next/image";
import logo1 from "../../public/image-33.png";
import logo2 from "../../public/image-36.png";
import logo3 from "../../public/image-34.png";
import logo4 from "../../public/image-37.png";
import logo5 from "../../public/image-32.png";

export default function Certified() {
  return (
    <section className="bg-white lg:py-8">
      <div className="max-w-7xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
          Certified by the Best
        </h2>

        {/* Logos */}
        <div className="flex justify-center items-center space-x-6 md:space-x-24 mt-6 flex-wrap">
          {/* ISO Logo */}
          <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20">
            <Image
              src={logo1}
              alt="ISO Certified"
              width={80}
              height={80}
              className="object-contain max-h-full max-w-full"
            />
          </div>

          {/* Startup India Logo (Increased Size) */}
          <div className="flex items-center justify-center w-24 h-24 md:w-32 md:h-32">
            <Image
              src={logo2}
              alt="Startup India"
              width={128}
              height={128}
              className="object-contain"
            />
          </div>

          {/* KSEB Logo */}
          <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20">
            <Image
              src={logo3}
              alt="KSEB"
              width={80}
              height={80}
              className="object-contain max-h-full max-w-full"
            />
          </div>

          {/* Kerala Startup Mission Logo */}
          <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20">
            <Image
              src={logo4}
              alt="Kerala Startup Mission"
              width={80}
              height={80}
              className="object-contain max-h-full max-w-full"
            />
          </div>

          {/* Award Logo */}
          <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20">
            <Image
              src={logo5}
              alt="Award"
              width={80}
              height={80}
              className="object-contain max-h-full max-w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}