import React from "react";
import Image from "next/image";
import LinkingButton from "../ui/LinkingButton";

const layers = [
  {
    level: "LEVEL 01",
    badge: "INSTANT",
    percent: "80%",
    sub: "ISSUES FIXED HERE",
    icon: "📱",
    title: "Phone & WhatsApp",
    description:
      "Send a WhatsApp message and receive a response in under a minute. Our team diagnoses faults remotely using your inverter's cloud monitoring portal — no site visit required.",
    bullets: [
      "Inverter error code diagnosis",
      "KSEB bill analysis (send photo)",
      "Generation output troubleshooting",
    ],
  },
  {
    level: "LEVEL 02",
    badge: "24-48 HRS",
    percent: "15%",
    sub: "ISSUES DIAGNOSED HERE",
    icon: "🔍",
    title: "Remote Diagnosis",
    description:
      "You share panel photos via WhatsApp. Our team cross-references live inverter portal data, identifies anomalies, and generates a Solar Health Report. Guided self-fix steps included where safe to attempt.",
    bullets: [
      "Panel photo analysis",
      "Inverter portal data cross-check",
      "Guided self-fix where applicable",
    ],
  },
  {
    level: "LEVEL 03",
    badge: "48 HRS MAX",
    percent: "05%",
    sub: "NEED A PHYSICAL VISIT",
    icon: "🛠️",
    title: "Technician Dispatch",
    description:
      "When remote resolution is not possible, a KSEB certified Kerala technician is dispatched within 48 hours. We cover all 14 districts — from Thiruvananthapuram to Kasaragod.",
    bullets: [
      "KSEB-certified Kerala technician",
      "Physical panel and wiring inspection",
      "Post-repair performance test",
    ],
  },
];

const ThreeLayerSupport = () => {
  return (
    <section className="relative w-full bg-white py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight text-[#123532] mb-4">
            Our 3-Layer Solar Support System
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#757575] max-w-5xl xl:max-w-6xl leading-relaxed">
            80% of solar system issues in Kerala are resolved without a single
            site visit. Here is exactly how we <br/>work through every problem — from
            inverter error codes to physical panel faults.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {layers.map((layer) => (
            <div
              key={layer.title}
              className="bg-[#0E3A3A] rounded-2xl p-6 sm:p-7 text-white flex flex-col"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs tracking-widest font-semibold text-white/70">
                  {layer.level}
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#1B5C5C] text-[#A9E3C3] tracking-wider">
                  {layer.badge}
                </span>
              </div>

              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F7BA41] leading-none mb-2">
                {layer.percent}
              </div>
              <div className="text-xs tracking-widest font-semibold text-white/70 mb-5">
                {layer.sub}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{layer.icon}</span>
                <h3 className="text-lg sm:text-xl font-semibold text-white">
                  {layer.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-white/85 mb-5">
                {layer.description}
              </p>

              <ul className="mt-auto space-y-2">
                {layer.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 text-xs sm:text-sm text-white/90"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="mt-0.5 shrink-0"
                      aria-hidden="true"
                    >
                      <path
                        d="m5 12 5 5L20 7"
                        stroke="#3DD68C"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-10">
          <LinkingButton
            content="Get a Free Service Call"
            ButtonLink="#contact"
            ButtonBg="bg-[#F7BA41]"
            Buttontext="text-[#272218]"
            ButtonHover="hover:bg-yellow-500"
            className="min-w-56 md:min-w-60 h-12 sm:h-14 px-6 text-sm md:text-base rounded-xl"
          />
          <LinkingButton
            content={
              <div className="flex items-center gap-3">
                <Image
                  src="/images/sollarWarranty/imageComponentsBreakpoints/Whatsappicon.png"
                  alt="WhatsApp icon"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <span>Send a WhatsApp message</span>
              </div>
            }
            ButtonLink="https://wa.me/919995010043"
            ButtonBorder="border border-[#074A4D]"
            ButtonBg="bg-white"
            Buttontext="text-[#074A4D]"
            ButtonHover="hover:bg-[#F3F4F6]"
            className="min-w-64 md:min-w-72 h-12 sm:h-14 px-6 text-sm md:text-base rounded-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default ThreeLayerSupport;
