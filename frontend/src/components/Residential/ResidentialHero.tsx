import Image from "next/image";
import { Award, CircleCheck, MapPin } from "lucide-react";
import PageIllustration from "@/components/ui/page-illustration";
import LinkingButton from "../ui/LinkingButton";

const heroImage = "https://golden-ray.b-cdn.net/Residential%20Solar%20Solutions/39f5234048cf5e13aa97b67fd5a3fb7bb7c188ff.png";
const heroImageAlt = "Aerial view of a neighborhood with solar panels";

export default function ResidentialHero() {
  return (
    <section className="relative w-full overflow-hidden">
      <PageIllustration />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-12 md:pt-20 md:pb-16  lg:pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="w-full lg:w-[55%] text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-semibold  leading-tight text-[#171717]">
              Power Your Home with {" "}
                <span className="text-[#F18627]">
                  Smarter Solar Decisions
                </span>
            </h1>
            <p
              className="mt-5 text-base md:text-xl font-normal  leading-snug text-[#444444]"
              lang="ml"
            >
              Thinking about solar but not sure who to trust? Get connected with certified residential solar experts across Kerala. Receive three tailored proposals, complete subsidy assistance, KSEB documentation, and one accountable team managing your project from start to finish.
            </p>
                      
            <div className="flex flex-row justify-center text-xs lg:text-lg md:justify-start lg:gap-4 gap-2 mt-5">
              <LinkingButton
              content="Book a Free Consultation"
              ButtonLink="/contactus"
              ButtonBg="bg-[#F7BA41]"
              Buttontext="text-[#272218]"
              ButtonHover="hover:bg-yellow-500"
            />
            <LinkingButton
              content="Explore Solar Guide"
              ButtonLink="/blog"
              ButtonBorder="border border-[#074A4D]"
              ButtonBg="bg-[#FFFFFF]"
              Buttontext="text-[#074A4D]"
              ButtonHover="hover:bg-[#eeeeee]"
            />
            </div>
            <ul className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3 text-xs md:text-sm font-medium text-[#171717]">
              <li className="flex items-center gap-2">
                <CircleCheck
                  className="h-4 w-4 md:h-5 md:w-5 shrink-0 text-[#074A4D]"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                8+ years on Kerala roofs
              </li>
              <li className="flex items-center gap-2">
                <Award
                  className="h-4 w-4 md:h-5 md:w-5 shrink-0 text-[#074A4D]"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                Kerala Energy Excellence Awards 2026
              </li>
              <li className="flex items-center gap-2">
                <MapPin
                  className="h-4 w-4 md:h-5 md:w-5 shrink-0 text-[#074A4D]"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                All 14 districts
              </li>
            </ul>
          </div>

          <div className="w-full lg:w-[48%]">
            <div className="relative w-full h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] xl:h-[460px]">
              <Image
                src={heroImage}
                alt={heroImageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover rounded-3xl shadow-[0_20px_60px_rgba(18,53,50,0.15)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
