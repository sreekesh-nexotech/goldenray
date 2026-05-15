import PageIllustration from "@/components/ui/page-illustration";

type HeroProps = {
  title: string;
  description: string;
};

export default function Hero({ title, description }: HeroProps) {
  return (
    <section className="relative w-full  overflow-hidden">
      <PageIllustration />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-24 pb-8 md:pt-32 md:pb-8 max-w-7xl flex flex-col md:flex-row items-center h-full lg:gap-40 gap-0">
        {/* Title and description*/}
        <div className="w-full  text-center ">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-semibold leading-tight text-[#123532] mb-4">
            {title}
          </h1>
          <p className="text-sm md:text-xl font-normal leading-relaxed w-full md:w-2/3 mx-auto text-[#444444] mb-6">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
