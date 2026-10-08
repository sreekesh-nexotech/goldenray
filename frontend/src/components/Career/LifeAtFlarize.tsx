import Image from "next/image";

const largeImage = {
  src: "https://golden-ray.b-cdn.net/Career%20page/IMG_20260207_095455.jpg",
  alt: "Flarize team on a Kerala houseboat during a field visit",
};

const gridImages = [
  {
    src: "https://golden-ray.b-cdn.net/Career%20page/IMG_20260207_123122.jpg",
    alt: "Engineer inspecting a rooftop solar panel during a site visit",
  },
  {
    src: "https://golden-ray.b-cdn.net/Career%20page/IMG_20260207_132232.jpg",
    alt: "The Flarize team gathered in the workshop",
  },
  {
    src: "https://golden-ray.b-cdn.net/Career%20page/IMG_20260207_135532.jpg",
    alt: "Product planning session mapping ideas on a sticky-note board",
  },
  {
    src: "https://golden-ray.b-cdn.net/Career%20page/IMG_5687%20(1).JPG",
    alt: "Team members walking outside the office at sunset",
  },
];

export default function LifeAtFlarize() {
  return (
    <section  className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-4">
            Life at Flarize
          </h2>
          <p className="text-sm md:text-lg font-normal leading-relaxed text-[#444444]">
            From field visits and customer meetings to product planning and team discussions, every day looks different.
          </p>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {/* Large image */}
          <div className="relative rounded-2xl overflow-hidden aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto lg:h-full min-h-[280px]">
            <Image
              src={largeImage.src}
              alt={largeImage.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-[17%_center]"
            />
          </div>

          {/* 2x2 grid */}
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            {gridImages.map((image, index) => (
              <div
                key={index}
                className="relative rounded-2xl overflow-hidden aspect-[4/3]"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
