import React from "react";
import Image from "next/image";

const Booking2 = () => {
  return (
    <div className="w-full px-4 py-16 md:py-20">
      <div className="max-w-7xl mx-auto">
        <div
          className="rounded-3xl p-10 md:p-14 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-8"
          style={{ backgroundColor: "#f7ba41" }}
        >
          {/* Left Content */}
          <div className="flex-[0.8] text-left">
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              style={{ color: "#123532" }}
            >
              Book Free Site Visit — See Your Exact Savings
            </h2>
            <p className="text-gray-800 text-lg md:text-xl mb-8">
              Our expert calculates your exact savings
              <br />+ subsidy in 15 minutes
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
                onClick={() => {
                  const footer = document.getElementById("footer");
                  if (footer) {
                    footer.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Book free visit
              </button>
              <button className="bg-white hover:bg-gray-50 text-gray-900 font-semibold px-8 py-3 rounded-lg transition-colors duration-200">
                Call 1800-00-0000
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-shrink-0 flex items-center justify-center w-auto">
            <Image
              src="https://golden-ray.b-cdn.net/icons/image%2068.png"
              alt="Solar house illustration"
              width={400}
              height={500}
              className="h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking2;
