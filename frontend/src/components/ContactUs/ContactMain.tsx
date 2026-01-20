// src/components/ContactUs/ContactMain.tsx

import ContactHero from "./ContactHero";
import ContactForm from "./ContactForm";
import Services from "../Services";
import Image from "next/image";

export default function ContactMain() {
  return (
    <section className="relative">
      {/* Hero section */}
      <ContactHero />

      {/* Contact Form and Image Section */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-36 py-12 md:py-16 lg:py-20">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-5 gap-8 lg:gap-12 xl:gap-16 max-w-7xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

          {/* Image */}
          <div className="lg:col-span-2 relative w-full h-64 sm:h-80 md:h-96 lg:h-full min-h-[400px] rounded-2xl overflow-hidden">
            <Image
              src="https://golden-ray.b-cdn.net/images/slide1.jpg"
              alt="Solar panel installation on house"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Services */}
      <Services serviceTitle="Why choose our solar solutions?" />
    </section>
  );
}
