import Image from "next/image";

type Award = {
  title: string;
  description: string;
  date: string;
  image: string;
};

const awards: Award[] = [
  {
    title: "Best Technology-Enabled Solar Solutions Provider",
    description: "Kerala Energy Excellence Awards 2026.",
    date: "Dec 10, 2024",
    image:
      "https://golden-ray.b-cdn.net/About%20us/8fa3547a2edbe08b3398a7781582510c6fb4b6b7.jpg",
  },
  {
    title: "Visionary Leader of the Year",
    description: "Harikrishnan K.R, Kerala Energy Excellence Awards 2026.",
    date: "Dec 10, 2024",
    image:
      "https://golden-ray.b-cdn.net/About%20us/8fa3547a2edbe08b3398a7781582510c6fb4b6b7.jpg",
  },
];

export default function Recognition() {
  return (
    <section className="px-4 pt-8 pb-8 sm:pt-12 sm:pb-12 lg:pt-16 lg:pb-16 sm:px-6 lg:px-8 ">

      {/* Heading */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <p className="text-sm md:text-base font-semibold text-[#123532] mb-3">
          Recognised &amp; Trusted
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#123532]">
          Recognised in Kerala
        </h2>
      </div>

      {/* Award cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {awards.map((award, index) => (
          <div
            key={index}
            className="flex overflow-hidden rounded-xl bg-[#F5F6F5]"
          >
            <div className="relative w-40 sm:w-48 md:w-56 flex-shrink-0">
              <Image
                src={award.image}
                alt={award.title}
                fill
                sizes="(min-width: 768px) 224px, (min-width: 640px) 192px, 160px"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col justify-center gap-2 px-6 py-5">
              <h3 className="text-lg font-bold text-[#123532] leading-snug">
                {award.title}
              </h3>
              <p className="text-sm text-gray-600">{award.description}</p>
              <p className="text-xs text-gray-400">{award.date}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
