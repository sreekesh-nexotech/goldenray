import React from "react";
import Image from "next/image";

const Booking2 = () => {
  return (
    <div className="w-full py-12 sm:py-14 md:py-16 lg:py-20 xl:py-24 2xl:py-28 px-4 sm:px-6 lg:px-8 xl:px-36 2xl:px-40">
      <div className="max-w-full mx-auto">
        <div
          className="rounded-2xl sm:rounded-2xl lg:rounded-3xl xl:rounded-3xl 2xl:rounded-4xl p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 2xl:p-16 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-7 lg:gap-8 xl:gap-10 2xl:gap-12"
          style={{ backgroundColor: "#f7ba41" }}
        >
          {/* Left Content */}
          <div className="flex-1 text-left w-full lg:w-auto lg:max-w-[60%]">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold mb-4 sm:mb-4 lg:mb-5 xl:mb-6 2xl:mb-7 leading-tight"
              style={{ color: "#1F2937" }}
            >
              Ready to Go Solar?
              <br />
              Claim up to ₹78,000 Subsidy
            </h2>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg lg:text-lg xl:text-lg 2xl:text-xl mb-6 sm:mb-7 lg:mb-8 xl:mb-9 2xl:mb-10 leading-relaxed">
              Our expert calculates your exact savings
              <br />+ handles all KSEB paperwork for free
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                className="bg-[#1F2937] hover:bg-[#374151] text-white font-semibold px-6 sm:px-7 lg:px-8 xl:px-9 2xl:px-10 py-3 sm:py-3 lg:py-3.5 xl:py-4 2xl:py-4.5 rounded-xl transition-colors duration-200 text-sm sm:text-base lg:text-base xl:text-lg 2xl:text-lg whitespace-nowrap"
                onClick={() => {
                  const footer = document.getElementById("footer");
                  if (footer) {
                    footer.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Get my personalised quotation
              </button>
              <button className="bg-white hover:bg-gray-50 text-[#1F2937] font-semibold px-6 sm:px-7 lg:px-8 xl:px-9 2xl:px-10 py-3 sm:py-3 lg:py-3.5 xl:py-4 2xl:py-4.5 rounded-xl transition-colors duration-200 text-sm sm:text-base lg:text-base xl:text-lg 2xl:text-lg whitespace-nowrap">
                Call 1800-00-0000
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-shrink-0 flex items-center justify-center w-full lg:w-[35%] xl:w-[38%] 2xl:w-[38%]">
            <Image
              src="https://golden-ray.b-cdn.net/icons/image%2068.png"
              alt="Solar house illustration"
              width={500}
              height={500}
              className="w-full h-auto max-w-[240px] sm:max-w-[280px] md:max-w-[360px] lg:max-w-none xl:max-w-none 2xl:max-w-none"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking2;
