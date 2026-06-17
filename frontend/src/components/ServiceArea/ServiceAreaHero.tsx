import { MapPin } from "lucide-react";
import PageIllustration from "@/components/ui/page-illustration";
import LinkingButton from "../ui/LinkingButton";

export default function ServiceAreaHero() {
  return (
    <section className="relative w-full overflow-hidden">
      <PageIllustration />

      <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 md:pt-40 md:pb-16 max-w-7xl flex flex-col items-center text-center">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-[#E4F0E1] text-[#5A8C4E] text-xs md:text-sm font-semibold tracking-wide uppercase">
          <MapPin size={14} />
          Kerala Solar Service Areas
        </span>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight text-[#123532] mb-6">
          Solar Installation <br/> Services  Across Kerala
        </h1>

        {/* Subtext */}
        <p className="text-base md:text-xl font-normal leading-relaxed text-[#444444] mb-8 max-w-2xl">
          Explore residential, commercial, group solar, subsidy assistance, and
          SolarCare support available in your area.
        </p>

        {/* CTA Buttons */}
        <div className="hidden sm:flex flex-col sm:flex-row items-center gap-4">
          <LinkingButton
            content="Get a Free Service Call"
            ButtonLink="/contactus"
            ButtonBg="bg-[#F7BA41]"
            Buttontext="text-[#272218]"
            ButtonHover="hover:bg-yellow-500"
          />
          <LinkingButton
            content="Find Service Near You"
            ButtonLink="#service-areas"
            ButtonBg="bg-[#123532]"
            Buttontext="text-white"
            ButtonHover="hover:bg-[#0c2422]"
          />
        </div>
      </div>
    </section>
  );
}
