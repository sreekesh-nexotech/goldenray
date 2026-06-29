import LinkingButton from "../ui/LinkingButton";

export default function ResumeCTA() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-7xl mx-auto rounded-2xl overflow-hidden">
        {/* TODO: replace with final background image (provided later) */}
        <div className="absolute inset-0 z-0 bg-[#123532]" />

        {/* Content */}
        <div className="relative z-10 px-6 py-16 md:py-20 flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-5xl font-semibold leading-tight text-white mb-5 whitespace-normal md:whitespace-nowrap">
            Great People Don&apos;t Always Fit Job Descriptions
          </h2>
          <p className="text-sm md:text-lg font-normal leading-relaxed text-[#DBD8D8] mb-8 max-w-2xl">
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
        </div>
      </div>
    </section>
  );
}
