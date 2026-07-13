import Image from "next/image";

const largeImage = {
  src: "/images/career/Container%20(2).png",
  alt: "Flarize team on a Kerala houseboat during a field visit",
};

const gridImages = [
  {
    src: "/images/career/AB6AXuBId2AJrz-fQ5FBcUdK8DVSfI-BZmnK_1YB6fej3edKiwA8rRPWzLZ6jC7EqWrFrFjczW3S8sBYCIm9qn0QQgYkZhySeEYyZyZcCT0LiO1xZqd_uCVeLEZBm6HvkcmXW8X0ftm9xJUcdR_fW-j1f3ZC0WRIYPGGaTbIjeSA2rkMIyXFNqoa5JNOSCh09XKKIfQOP4ur1FHysqfK1YNVycLyRpLRKdhwUe3cyiWyly5j.png",
    alt: "Engineer inspecting a rooftop solar panel during a site visit",
  },
  {
    src: "/images/career/AB6AXuC34ERaLQbcLtT2-2AehIL3Uz7vvSctuYWsiwvaD09g0XQvv56KRloOxsTwO8RGeVj9sTPLdmDHI8s_oqSPfrw0HngxmD1qcnSoBP-Kon4u178FqdoNS-oBnJEN57TMFpeHfKDlto6cnbbfqrEjKT_QF0z1ndst5cDnlGc4GQjMEUfzoqhhTaSzeKlgGXwCnBlA1ofkstGjsOoWmHZl-iz1VxZPaFXtCx_x5yCH4GGr.png",
    alt: "The Flarize team gathered in the workshop",
  },
  {
    src: "/images/career/AB6AXuDDx_Stu3awgcJOkSpwt5NCRCeIlb7KQpoku-wPVsik3aITgkXwBDjPx36g4G0S96KC4cp9TC9BJ0mY9pk9ntBZILBL9o-LGao4LrOq7Y6SZb9vTeYTU6GHhAuXA_TXDG28RuMDBecTClvkUKSrqDj8Yz-NR8IRW9LNDEM3p3C-EG8tQZJ_lWiEfIC5U73Q75ApQQyrCt2qgiHVy4OROLMFkurO9BYrdk5SGOgo6uSb.png",
    alt: "Product planning session mapping ideas on a sticky-note board",
  },
  {
    src: "/images/career/Container%20(3).png",
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
              className="object-cover object-center"
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
