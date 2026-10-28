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

const images = [largeImage, ...gridImages];

export default function LifeAtFlarize() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
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

        {/* Equal-height swipe gallery on mobile. */}
        <div
          aria-label="Life at Flarize photo gallery"
          role="region"
          tabIndex={0}
          className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory overscroll-x-contain sm:gap-5 lg:hidden"
        >
          {images.map((image) => (
            <div
              key={image.src}
              className="relative aspect-[4/3] w-[82vw] max-w-[360px] shrink-0 snap-center overflow-hidden rounded-2xl sm:w-[55vw]"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 82vw, 55vw"
                className="object-cover object-center"
              />
            </div>
          ))}
        </div>

        {/* Original large-image plus 2x2 gallery layout on desktop. */}
        <div className="hidden gap-4 sm:gap-5 lg:grid lg:grid-cols-2">
          <div className="relative min-h-[280px] overflow-hidden rounded-2xl lg:h-full">
            <Image
              src={largeImage.src}
              alt={largeImage.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-[17%_center]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            {gridImages.map((image) => (
              <div
                key={image.src}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl"
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
