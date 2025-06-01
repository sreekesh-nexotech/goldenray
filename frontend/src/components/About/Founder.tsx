import React from 'react';

export default function Founder(){

    const youtubeLink = "https://www.youtube.com/embed/jKLCiCoFngA";//link for the video
  return (
    <div className="flex flex-col gap-5 justify-between lg:flex-row bg-[#074A4D] text-[#DBD8D8] rounded-3xl p-8 lg:p-12 max-w-full mx-auto mb-18">
        {/* Right Section: YouTube Video */}
      <div className="block lg:hidden w-full mb-8 md:mt-0">
        <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={youtubeLink}
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
      {/* Left Section: Quote and Name */}
      <div className="lg:w-[34%] flex flex-col justify-between">
        <p className="text-base sm:text-xl font-normal mb-4 lg:mb-0">
          <q>At the heart of our journey is a simple belief—clean energy should be accessible, affordable, and effortless. We started this company to empower every home and business with solar, and we’re here to guide you every step of the way</q>
        </p>
        <div>
          <h2 className="text-[32px] sm:text-[40px] font-bold">HARIKRISHNAN</h2>
          <p className="text-xl sm:text-xl">Founder & CEO</p>
        </div>
      </div>

      {/* Right Section: YouTube Video */}
      <div className="hidden lg:block md:w-2/3 mt-6 md:mt-0">
        <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={youtubeLink}
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

