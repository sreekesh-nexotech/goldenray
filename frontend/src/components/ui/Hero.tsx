import PageIllustration from "@/components/ui/page-illustration";

type HeroProps = {
  title:string;
  description:string;
}

export default function Hero({
  title,
  description,
}:HeroProps) {
  return (
      <section className="relative w-full  overflow-hidden">
      <PageIllustration/>
      

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-40 pb-20 md:pt-60 md:pb-40 max-w-7xl flex flex-col md:flex-row items-center h-full lg:gap-40 gap-0">
        {/* Title and description*/}
        <div className="w-full  text-center ">
            <h1 className="text-[40px]/10 sm:text-5xl lg:text-7xl font-bold text-[#123532] mb-4">
            {title}
          </h1>
          <p className="text-base w-full md:w-2/3 mx-auto sm:text-lg md:text-2xl text-[#444444] mb-6">
            {description}
          </p>
        </div>
      </div>
</section>
  );
}
