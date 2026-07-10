import Image from "next/image";
import { getServiceAreaContent } from "@/data/service-area-content";

const RecentInstalls = ({ district }: { district?: string }) => {
  const { intro, items } = getServiceAreaContent(district).recentInstalls;

  // No install photos for this district yet — hide the section entirely.
  if (items.length === 0) return null;

  return (
    <section className="relative px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <h2 className="mb-4 text-3xl font-semibold text-[#123532] md:text-5xl">
            Recent Installs in {district ?? "Kerala"}
          </h2>
          <p className="text-base leading-relaxed text-[#757575]">{intro}</p>
        </div>

        {/* Cards — horizontal snap-scroll carousel on mobile, grid from sm up */}
        <ul className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:py-0 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={`${item.system}-${item.location}`}
              className="flex min-w-[82%] snap-start flex-col rounded-2xl bg-white p-4 shadow-[0_10px_30px_-14px_rgba(18,53,50,0.22)] sm:min-w-0"
            >
              {/* Install photo */}
              <div className="relative mb-5 aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#eef1f5]">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 82vw"
                  className="object-cover"
                />
              </div>

              {/* Text */}
              <div className="px-2 pb-2">
                <h3 className="mb-1 text-lg font-semibold text-[#123532]">
                  {item.system}
                </h3>
                <p className="mb-3 text-sm font-semibold text-[#5A8C4E]">
                  {item.location}
                </p>
                <p className="text-sm leading-relaxed text-[#4B5563]">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default RecentInstalls;
