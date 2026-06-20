import React from "react";
import LinkingButton from "../ui/LinkingButton";

const Booking = () => {
  return (
    <section className="relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col items-center h-full gap-8">
      {/* Heading */}
      <div className="w-full max-w-7xl mx-auto text-center mb-2">
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4">
          Ready to See Your 3 Solar Options?
        </h2>
        <p className="text-sm md:text-xl font-thin leading-relaxed text-[#757575]">
          Book a free site visit. Our engineer assesses your roof. You receive 3
          custom quotes within 24 hours
          <br/>
           — each with a different panel brand and
          budget. No obligation, no pressure. Just the information you need to
          make the right decision
        </p>
      </div>

      <div className="max-w-7xl w-full flex items-center justify-center auto mb-20">
        <LinkingButton
          content="Book Free Visit →"
          ButtonLink="/#booking"
          ButtonBg="bg-[#F7BA41]"
          Buttontext="text-[#272218]"
          ButtonHover="hover:bg-yellow-500"
        />
      </div>

      <div className="w-full max-w-7xl mx-auto">
        <h2 className="text-xl md:text-4xl font-semibold leading-snug text-[#444444] mb-6 text-left md:text-center">
          Solar Installation Across All 14 Kerala Districts
        </h2>
        <p className="text-sm md:text-xl font-normal leading-relaxed text-[#757575] text-center">
          Flarize&apos;s local installer network covers all 14 Kerala districts
          —{" "}
          <span className="text-[#444444] font-medium">
            Ernakulam, Thiruvananthapuram, Kozhikode, Thrissur, Alappuzha,<br/>
            Kollam, Kottayam, Palakkad, Malappuram, Kannur, Kasaragod,
            Pathanamthitta, Idukki, and Wayanad
          </span>
          . When you confirm a solar <br/> system, the nearest certified installer in
          your pincode is automatically assigned — which is why Flarize
          consistently achieves 3-7 day <br/>installation timelines even in districts
          far from a central warehouse
        </p>
      </div>
    </section>
  );
};

export default Booking;
