import PageIllustration from "../ui/page-illustration";

type ProjectHeroProps = {
  title: string;
  PublishDate: string;
};

export default function ProjectHero({ title, PublishDate }: ProjectHeroProps) {
  // Function to split title for Jose V P project
  const renderTitle = () => {
    if (title.includes("Jose V P")) {
      return (
        <>
          <span className="block whitespace-nowrap">Jose V P -Vadackkal,</span>
          <span className="block whitespace-nowrap">Alapuzha</span>
        </>
      );
    }
    return title;
  };

  return (
    <section className="relative w-full  overflow-hidden">
      <PageIllustration />

      {/* Content */}
      <div className="container mx-auto pt-24 pb-8 md:pt-32 md:pb-12 flex flex-col md:flex-row h-full lg:gap-40 gap-0">
        {/* Title and description*/}
        <div className="w-full text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[#123532] mb-2 leading-tight">
            {renderTitle()}
          </h1>
          <p className="block md:hidden text-base sm:text-lg md:text-2xl text-[#444444]">
            Published On{" "}
            <span className="font-semibold text-[#074A4D]">{PublishDate}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
