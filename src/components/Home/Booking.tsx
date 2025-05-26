'use client'; 

import React from 'react';

export default function Booking(){

    //form handling
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string; // Type assertion for string
    const mobileNumber = formData.get('mobileNumber') as string; // Type assertion for string
    // API calling goes here
      e.currentTarget.reset()

  };

  return (
    <div className="relative xl:min-h-screen bg-cover bg-no-repeat md:bg-center bg-center scroll-mt-10" style={{ backgroundImage: "url('/Image-1-3.png')" }} id='booking'>

      <div className="absolute inset-0 bg-black opacity-20"></div>      {/* Overlay for better text readability */}

      <div className="relative z-10 xl:min-h-screen flex items-center justify-start p-4 py-20 md:px-12 sm:p-8 md:p-12 lg:p-20 ">
        <div className="text-white max-w-xl text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-semibold leading-tight mb-4">
            Book your free consultation
          </h1>
          <p className="text-base sm:text-2xl mb-8">
            Get expert advice and find your ideal solar solution—no obligations, just savings!
          </p>

          {/* Form */}
        <form className="flex flex-col gap-4 w-full max-w-sm max-sm:max-w-full" onSubmit={handleSubmit} id='form'>
          <input
            type="text"
            name='name'
            placeholder="Name"
            className="px-4 py-3 rounded-xl text-black bg-white focus:outline-none"
            required
            pattern="[A-Za-z\s]{3,}"
            title="Please enter at least 3 alphabetic characters."
          />
          <input
            type="text"
            name='mobileNumber'
            placeholder="Mobile Number"
            className="px-4 py-3 rounded-xl text-black bg-white mb-3 focus:outline-none"
            required
            pattern="[0-9]{*}"
            title="Enter a valid phone number"
          />
          <button  className="btn md:w-2/5 w-full bg-[#F7BA41] text-[#272218] hover:bg-yellow-500">
              Book Now
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};
