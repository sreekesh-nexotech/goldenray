import PageIllustration from "../ui/page-illustration";

type ProjectHeroProps = {
  title:string;
  description?:string;
  PublishDate:string;
  readTime:string;
}

export default function ResourceDetailHero({
  title,
  description,
  PublishDate,
  readTime,
}:ProjectHeroProps) {
    return(
         <section className="relative w-full  overflow-hidden">
              <PageIllustration/>
        
              {/* Content */}
              <div className="relative z-10  mx-auto px-4 pt-40 pb-10 md:pt-60 md:pb-15 max-w-7xl flex flex-col md:flex-row  h-full lg:gap-40 gap-0">
                {/* Title and description*/}
                <div className="w-full  text-left ">
                    <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-semibold text-[#123532] mb-4 ">
                        {title}
                    </h1>
                    <p className="text-base sm:text-lg md:text-2xl text-[#444444] mb-4">
                        {description || null}
                    </p>
                    <p className="text-xs md:text-sm text-[#B2B2B2]">
                        published on <span className="font-medium text-[#124944]">{PublishDate} • {readTime}</span>
                    </p>
                </div>
              </div>
        </section>
    )
}
