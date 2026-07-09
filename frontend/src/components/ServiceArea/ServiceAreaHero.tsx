import Image from "next/image";
import { Sun, CheckCircle2 } from "lucide-react";
import LinkingButton from "../ui/LinkingButton";

const HERO_IMAGE =
  "https://golden-ray.b-cdn.net/service-area/839ea80d753ce8e485cfc4da0b15f662129a2ac8.png";

const FEATURES = [
  "Lower Electricity Bills",
  "₹78,000 Subsidy Available",
  "25-Year Warranty",
];

export default function ServiceAreaHero({ district }: { district?: string }) {
  const area = district ?? "Kerala";
  const heading = `Solar Panel Installation in ${area}`;
  const subtext = district
    ? `Clean, affordable rooftop solar solutions for homes and businesses across ${district} district. Government subsidies available. Get paid for excess power through KSEB net metering.`
    : "Clean, affordable rooftop solar solutions for homes and businesses across Kerala. Government subsidies available. Get paid for excess power through KSEB net metering.";
  const ctaText = district
    ? `Get Free Solar Quote in ${district}`
    : "Get Free Solar Quote";
  const trustLine =
    "Backed by Golden Ray Renewable Energy — 8 years, 300+ installations, 4.9-star rated, KSEB-empaneled and MNRE-approved.";
  const imageAlt = `Rooftop solar panel installation in ${area}, Kerala by Golden Ray Renewable Energy`;

  return (
    <section className="relative w-full overflow-hidden">
      {/*  Desktop hero */}
      <div className="relative hidden md:block isolate">
        <Image
          src={HERO_IMAGE}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-10 object-cover"
        />
        {/* Dark overlay  */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/30 via-black/5 to-black/75" />

        <div className="mx-auto flex max-w-7xl flex-col items-center px-8 pt-20 pb-24 text-center text-white lg:pt-30 lg:pb-28">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full  bg-[#F7BA4130] px-4 py-1.5 text-[10px] font-bold  tracking-wide text-[#F7BA41] backdrop-blur-sm lg:text-sm">
            <Sun size={15} />
            Affordable Rooftop Solar Solutions with 25-Year Warranty
          </span>

          <h1 className="mb-6 text-5xl font-bold leading-tight lg:text-6xl xl:text-7xl">
            {heading}
          </h1>

          <p className="mb-9 text-lg max-w-6xl font-font-medium leading-relaxed text-white/85 lg:text-xl">
            {subtext}
          </p>

          <LinkingButton
            content={ctaText}
            ButtonLink="/contactus"
            ButtonBg="bg-[#F7BA41]"
            Buttontext="text-[#272218]"
            ButtonHover="hover:bg-yellow-500"
          />

          <p className="mt-9 text-xl font-bold text-[#F7BA41]">{trustLine}</p>

          <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm font-medium text-white/90"
              >
                <CheckCircle2 size={18} className="text-[#FFB400]" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile: layout  */}
      <div className="flex flex-col px-5 pt-10 pb-12 md:hidden">
        <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-[#F7BA4130] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wide  text-[#F7BA41]">
          <Sun size={13} />
          Affordable Rooftop Solar Solutions with 25-Year Warranty
        </span>

        <h1 className="mb-4 text-[32px] font-bold leading-tight text-[#123532]">
          {heading}
        </h1>

        <p className="mb-6 text-base leading-relaxed text-[#444444]">{subtext}</p>

        {/* Image card */}
        <div className="relative mb-6 aspect-[16/10] w-full overflow-hidden rounded-2xl">
          <Image
            src={HERO_IMAGE}
            alt={imageAlt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <LinkingButton
          content={ctaText}
          ButtonLink="/contactus"
          ButtonBg="bg-[#F7BA41]"
          Buttontext="text-[#272218]"
          ButtonHover="hover:bg-yellow-500"
          className="w-full justify-center"
        />

        <p className="mt-6 text-xs font-bold leading-relaxed text-[#444444]">{trustLine}</p>

        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
          {FEATURES.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-1.5 text-xs font-medium text-[#444444]"
            >
              <CheckCircle2 size={15} className="text-[#FFB400]" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
