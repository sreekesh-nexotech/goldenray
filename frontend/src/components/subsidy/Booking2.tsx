import React from "react";
import Image from "next/image";

const Booking2 = () => {
  return (
    <div className="w-full py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 xl:px-36">
      <div className="max-w-full mx-auto">
        <div
          className="rounded-2xl lg:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8"
          style={{ backgroundColor: "#f7ba41" }}
        >
          {/* Left Content */}
          <div className="flex-1 text-left w-full lg:w-auto lg:max-w-[60%]">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold mb-4 lg:mb-5 leading-tight"
              style={{ color: "#1F2937" }}
            >
              Claim your subsidy now,
              <br />
              upto ₹78000
            </h2>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl mb-6 lg:mb-8 leading-relaxed">
              Our expert calculates your exact savings
              <br />+ subsidy in 15 minutes
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                className="bg-[#1F2937] hover:bg-[#374151] text-white font-semibold px-6 sm:px-7 lg:px-8 py-3 lg:py-3.5 rounded-xl transition-colors duration-200 text-sm sm:text-base whitespace-nowrap"
                onClick={() => {
                  const footer = document.getElementById("footer");
                  if (footer) {
                    footer.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Get my personalised quotation
              </button>
              <button className="bg-white hover:bg-gray-50 text-[#1F2937] font-semibold px-6 sm:px-7 lg:px-8 py-3 lg:py-3.5 rounded-xl transition-colors duration-200 text-sm sm:text-base whitespace-nowrap">
                Call 1800-00-0000
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-shrink-0 flex items-center justify-center w-full lg:w-[35%] xl:w-[38%]">
            <Image
              src="https://golden-ray.b-cdn.net/icons/image%2068.png"
              alt="Solar house illustration"
              width={500}
              height={500}
              className="w-full h-auto max-w-[240px] sm:max-w-[280px] md:max-w-[360px] lg:max-w-none"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking2;
