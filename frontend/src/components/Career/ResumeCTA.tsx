import Image from "next/image";
import LinkingButton from "../ui/LinkingButton";

export default function ResumeCTA() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/career/resume.png"
        alt="Team members walking outside the office at sunset"
        fill
        sizes="100vw"
        className="object-cover object-center z-0"
        priority={false}
      />
      {/* Overlay for text contrast */}
      <div className="absolute inset-0 z-0 bg-[#123532]/30" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-40 flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-5xl font-semibold leading-tight text-white mb-8 whitespace-normal md:whitespace-nowrap">
          Great People Don&apos;t Always Fit Job <br/> Descriptions
        </h2>
        <p className="text-sm md:text-lg font-normal leading-relaxed text-[#DBD8D8] mb-12 max-w-2xl">
          Think you can add value in a way we haven&apos;t listed? We&apos;re
          always looking for exceptional talent to join our mission.
        </p>
        <LinkingButton
          content="Send Your Resume"
          ButtonLink="/contactus"
          ButtonBg="bg-[#F7BA41]"
          Buttontext="text-[#272218]"
          ButtonHover="hover:bg-yellow-500"
        />
        <a
          href="mailto:careers@flarize.com"
          className="mt-8 text-xs md:text-sm font-normal text-white/70 hover:text-white transition-colors"
        >
          careers@flarize.com
        </a>
      </div>
    </section>
  );
}
