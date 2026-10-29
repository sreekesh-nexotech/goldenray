import Image from "next/image";

type Award = {
  title: string;
  description: string;
  image: string;
};

const awards: Award[] = [
  {
    title: "Best Technology-Enabled Solar Solutions Provider",
    description: "Kerala Energy Excellence Awards 2026.",
    image:
      "https://golden-ray.b-cdn.net/About%20us/Best%20Technology-Enabled%20Solar%20Solutions%20Provider%20award.jpg",
  },
  {
    title: "Visionary Leader of the Year",
    description: "Harikrishnan K.R, Kerala Energy Excellence Awards 2026.",
    image:
      "https://golden-ray.b-cdn.net/About%20us/080A4064.jpg",
  },
];

function TrophyIcon() {
  return (
    <div className="relative h-8 w-8 overflow-hidden rounded-full sm:h-9 sm:w-9">
      <Image
        src="https://golden-ray.b-cdn.net/About%20us/awardicon.png"
        alt="Award icon"
        fill
        sizes="36px"
        className="object-cover"
      />
    </div>
  );
}

export default function Recognition() {
  return (
    <section className="px-4 pb-10 pt-8 sm:px-6 sm:pt-12 sm:pb-12 lg:px-8 lg:pt-16 lg:pb-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center sm:mb-10 lg:mb-12">
          <p className="mb-3 text-sm font-semibold text-[#123532] sm:text-base">
            Recognised &amp; Trusted
          </p>
          <h2 className="text-[2.2rem] font-bold leading-tight text-[#123532] sm:text-[2.5rem] lg:text-[3rem]">
            Recognised in Kerala
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:gap-7 lg:grid-cols-2">
          {awards.map((award, index) => (
            <article
              key={index}
              className="overflow-hidden rounded-[22px] border border-[#E9E5DE] bg-[#F7F6F5] shadow-[0_4px_18px_rgba(18,53,50,0.04)]"
            >
              <div className="relative aspect-[2.2/1] w-full overflow-hidden sm:aspect-[2.4/1] lg:aspect-[2.1/1]">
                <Image
                  src={award.image}
                  alt={award.title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="flex items-center gap-3 bg-[#F6F5F3] px-4 py-3 sm:px-4 sm:py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D9BC6B] bg-[#F5E8C5] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)] sm:h-11 sm:w-11">
                  <TrophyIcon />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold leading-snug text-[#123532] sm:text-[1rem] lg:text-[1.08rem]">
                    {award.title}
                  </h3>
                  <p className="mt-1 text-sm text-[#4B4B4B] sm:text-[0.9rem]">
                    {award.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
