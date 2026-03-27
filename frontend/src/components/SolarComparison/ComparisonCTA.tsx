"use client";

export default function ComparisonCTA() {
  const whatsappNumber = "919876543210"; // Replace with actual WhatsApp number
  const whatsappMessage = encodeURIComponent(
    "Hi! I'm comparing solar panels on your website and would like help choosing the right one. Here's my KSEB bill:",
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section className="mt-12 sm:mt-14 md:mt-16 lg:mt-20 py-10 sm:py-12 md:py-14 lg:py-16">
      <div className="text-center">
        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-[#183C39] leading-tight mb-4 sm:mb-5">
          Still not sure? Let&apos;s figure it out.
        </h3>
        <p className="text-sm sm:text-base md:text-lg text-[#4B5563] mb-6 sm:mb-8 leading-relaxed">
          Send your KSEB bill and rooftop photo on WhatsApp — we&apos;ll
          recommend the right panel for your specific roof, location, and
          budget. No pressure.
        </p>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#F7BA41] hover:bg-[#E5A930] text-[#272218] px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-200 hover:shadow-lg"
        >
          Whatsapp us your KSEB bill
        </a>
      </div>
    </section>
  );
}
