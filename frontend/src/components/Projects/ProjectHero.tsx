import PageIllustration from "../ui/page-illustration";

type ProjectHeroProps = {
  title: string;
  PublishDate: string;
}

export default function ProjectHero({
  title,
  PublishDate,
<<<<<<< HEAD
}: ProjectHeroProps) {
    return (
        <section className="relative w-full overflow-hidden">
            <PageIllustration />

            {/* Content */}
            <div className="relative z-10 mx-auto px-4 pt-32 pb-8 md:pt-48 md:pb-12 max-w-7xl flex flex-col md:flex-row h-full lg:gap-40 gap-0">
                {/* Title and description */}
                <div className="w-full lg:w-2xl text-center lg:text-left">
                    <h1 className="text-[40px]/10 sm:text-5xl lg:text-7xl font-medium text-[#123532] mb-4">
=======
}:ProjectHeroProps) {
    return(
         <section className="relative w-full  overflow-hidden">
              <PageIllustration/>
        
              {/* Content */}
              <div className="relative z-10  mx-auto px-4 pt-32 pb-8 md:pt-48 md:pb-12 max-w-7xl flex flex-col md:flex-row  h-full lg:gap-40 gap-0">
                {/* Title and description*/}
                <div className="w-full lg:w-2xl text-center lg:text-left ">
                    <h1 className="text-[40px]/10 sm:text-5xl lg:text-7xl font-medium text-[#123532] mb-4 ">
>>>>>>> Hari-development
                        {title}
                    </h1>
                    <p className="block md:hidden text-base sm:text-lg md:text-2xl text-[#444444]">
                        Published On <span className="font-semibold text-[#074A4D]">{PublishDate}</span>
                    </p>
                </div>
            </div>
        </section>
    )
}
