// src/components/ContactUs/ContactHero.tsx

export default function ContactHero() {
  return (
    <div className="relative bg-white py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32 mt-16 sm:mt-0">
      <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-36 2xl:px-48">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-[#2D3748] mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8">
            Contact Us
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-[#4A5568] mx-auto leading-normal">
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
