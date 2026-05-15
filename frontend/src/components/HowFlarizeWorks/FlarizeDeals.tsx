import { UserGroupIcon } from "@heroicons/react/16/solid";
import { User, Zap } from "lucide-react";
import React from "react";

const iconClass = "flex flex-col items-center justify-center text-center gap-2";

const FlarizeDeals = () => {
  return (
    <section className="relative z-10 container mx-auto px-4 py-10 pb-6 md:py-20 xl:py-16 max-w-7xl flex flex-col items-center h-full gap-8">
      {/* Heading and description */}
      <div className="w-full max-w-7xl mx-auto text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4">
          You Deal with Flarize. We Deal with Everyone Else.
        </h2>
        <p className="hidden sm:block text-sm md:text-xl font-normal leading-relaxed text-[#4B5563]">
          Most solar installations in Kerala involve multiple vendors — a panel
          supplier, a local installer, a separate service technician, and KSEB
          for net metering. Coordinating all of them is time-consuming and
          leaves homeowners stuck in the middle when something goes wrong after
          installation.
        </p>
      </div>

      {/* Icons and flow */}
      <div className="flex flex-row items-center justify-between w-full max-w-3xl mb-8">
        {/* Homeowner */}
        <div className={iconClass}>
          <div className="w-20 h-20 sm:w-30 sm:h-30 rounded-full border-2 border-[#074A4D] flex items-center justify-center mb-2">
            <User size={36} color="#074A4D" fill="#074A4D" />
          </div>
          <div className="text-base md:text-xl font-semibold leading-snug text-[#074A4D]">
            Homeowner
          </div>
          <div className="text-xs md:text-base font-normal leading-normal text-[#757575]">
            Single Interface
          </div>
        </div>
        {/* Arrow */}
        <div className="text-3xl text-[#B0B0B0]">&#8594;</div>
        {/* Flarize */}
        <div className={iconClass}>
          <div className="w-20 h-20 sm:w-30 sm:h-30  rounded-full bg-[#074A4D] flex items-center justify-center mb-2">
            <Zap size={36} color="#ffffff" strokeWidth={1.75} fill="#ffffff" />
          </div>
          <div className="text-base md:text-xl font-semibold leading-snug text-[#074A4D]">
            Flarize
          </div>
          <div className="text-xs md:text-base font-normal leading-normal text-[#757575]">
            The Coordinator
          </div>
        </div>
        {/* Arrow */}
        <div className="text-3xl text-[#B0B0B0]">&#8594;</div>
        {/* Local Installers */}
        <div className={iconClass}>
          <div className="w-20 h-20 sm:w-30 sm:h-30 rounded-full border-2 border-[#074A4D] flex items-center justify-center mb-2">
            <UserGroupIcon className="w-10 h-10 text-[#074A4D]" />
          </div>
          <div className="text-base md:text-xl font-semibold leading-snug text-[#074A4D]">
            Local Installers
          </div>
          <div className="text-xs md:text-base font-normal leading-normal text-[#757575]">
            Local Installers
          </div>
        </div>
      </div>

      {/* Highlighted box */}
      <div className="max-w-full bg-[#F7BA41] bg-opacity-90 rounded-xl p-6 md:p-8 flex flex-col gap-4">
        <div className="text-[#123532] text-sm md:text-xl font-normal leading-relaxed mb-2">
          Flarize works differently. You have one point of contact — Flarize —
          from your first site assessment to your 25th year of solar generation.
          Behind the scenes, Flarize coordinates everything your installation
          requires:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          <ul className="list-none space-y-2 text-[#074A4D] font-semibold text-sm md:text-xl leading-relaxed">
            <li className="flex items-center gap-2">
              <span className="text-xl">✔</span>Certified local solar installers
            </li>
            <li className="flex items-center gap-2">
              <span className="text-xl">✔</span>BIS-certified solar panel
              suppliers
            </li>
            <li className="flex items-center gap-2">
              <span className="text-xl">✔</span>Post-installation service
              technicians
            </li>
          </ul>
          <ul className="list-none space-y-2 text-[#074A4D] font-semibold text-sm md:text-xl leading-relaxed">
            <li className="flex items-center gap-2">
              <span className="text-xl">✔</span>KSEB net metering application
              and approval
            </li>
            <li className="flex items-center gap-2">
              <span className="text-xl">✔</span>PM Surya Ghar subsidy
              documentation
            </li>
          </ul>
        </div>
        <div className="bg-white bg-opacity-90 rounded-lg p-4 text-[#123532] text-base md:text-xl font-normal md:font-semibold leading-snug border-l-4 border-[#074A4D]">
          &quot;You never deal with installers or suppliers. Flarize is your
          single point of contact for the full 25-year life of your solar
          system.&quot;
        </div>
      </div>
    </section>
  );
};

export default FlarizeDeals;
