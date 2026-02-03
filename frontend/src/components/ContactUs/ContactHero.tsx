// src/components/ContactUs/ContactHero.tsx

import PageIllustration from "@/components/ui/page-illustration";

export default function ContactHero() {
  return (
    <div className="relative bg-white py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32 mt-16 sm:mt-0 overflow-hidden">
      <PageIllustration />

      <div className="relative z-10 mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-36 2xl:px-48">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-[2.5rem]/10 sm:text-5xl lg:text-7xl font-bold text-[#123532]  mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8">
            Contact Us
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-[#444444] mx-auto leading-normal">
            Get in touch with us to explore smart solar solutions tailored to
            your
            <br className="hidden md:inline" />
            needs. Our team is here to guide you every step of the way.
          </p>
        </div>
      </div>
    </div>
  );
}
