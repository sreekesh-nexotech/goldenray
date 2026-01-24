import React from "react";
import Image from "next/image";
import Link from "next/link";

type SolutionBoxProps = {
  BoxBgColor: string;
  TextColor: string;
  showYellowBtn?: boolean;
  BoxTitle: string;
  BoxDescription: string;
  BoxImg: string;
  flexReverse?: boolean;
};

export default function SolutionBox({
  BoxBgColor,
  TextColor,
  showYellowBtn = false,
  BoxTitle,
  BoxDescription,
  BoxImg,
  flexReverse = false,
}: SolutionBoxProps) {
  return (
    <section className="w-full py-6 px-4 md:px-6 lg:px-8 flex items-center justify-center">
      {/* Main content card with responsive layout */}
      <div
        className={`bg-${BoxBgColor} rounded-3xl shadow-xl flex flex-col ${flexReverse ? "lg:flex-row-reverse" : "lg:flex-row"} max-w-7xl w-full`}
      >
        {/* Right Section: Image with padding - Appears first on mobile */}
        <div className="lg:w-1/2 p-6 md:p-8 lg:p-6 flex items-center">
          <div className="relative w-full h-[350px] md:h-[450px] lg:h-full lg:min-h-[450px] rounded-2xl overflow-hidden">
            <Image
              src={BoxImg}
              fill
              alt={BoxTitle}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Left Section: Text Content - Appears second on mobile */}
        <div
          className={`lg:w-1/2 ${TextColor} flex flex-col justify-between p-6 md:p-8 lg:p-10`}
        >
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 leading-tight">
              {BoxTitle}
            </h2>
            <p className="text-base md:text-lg leading-relaxed mb-8 opacity-95">
              {BoxDescription}
            </p>
          </div>

          {/* Call to action button */}
          <div>
            <Link
              href="/projects"
              className={`block w-full text-center py-3 md:px-12 md:py-5 rounded-xl font-bold text-lg md:text-xl transition-all duration-300 ${
                showYellowBtn
                  ? "bg-[#F7BA41] text-[#272218] hover:bg-[#e6a832]"
                  : "bg-white text-[#272218] hover:bg-gray-100"
              }`}
            >
              View Projects
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
