import PageIllustration from "./ui/page-illustration";

type ProjectHeroProps = {
  title: string;
  effectiveDate: string;
  lastUpdated: string;
};

export default function LegalHero({
  title,
  effectiveDate,
  lastUpdated,
}: ProjectHeroProps) {
  return (
    <section className="relative w-full  overflow-hidden">
      <PageIllustration />

      {/* Content */}
      <div className="relative z-10  mx-auto px-4 pt-32 pb-8 md:pt-48 md:pb-12 max-w-7xl flex flex-col md:flex-row  h-full lg:gap-40 gap-0">
        {/* Title and description*/}
        <div className="w-full  text-left ">
          <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-semibold text-[#123532] mb-4 ">
            {title}
          </h1>
          <p className="text-xs md:text-sm text-[#444444]">
            Effective Date:{" "}
            <span className="font-medium text-[#124944]">{effectiveDate}</span>
          </p>
          <p className="text-xs md:text-sm text-[#444444]">
            Last Updated:{" "}
            <span className="font-medium text-[#124944]">{lastUpdated}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
