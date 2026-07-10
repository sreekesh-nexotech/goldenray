import Image from "next/image";
import { getServiceAreaContent } from "@/data/service-area-content";

const LocalStory = ({ district }: { district?: string }) => {
  const { image, imageAlt, quote } = getServiceAreaContent(district).narrative;

  // No bespoke local story for this district yet — hide the section.
  if (!quote || !image) return null;

  return (
    <section className="relative isolate w-full overflow-hidden">
      {/* Full-bleed background image */}
      <Image
        src={image}
        alt={imageAlt}
        fill
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover"
      />
      {/* Dark overlay for legibility */}
      <div className="absolute inset-0 -z-10 bg-[#0B1F1D]/75" />

      <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:px-8 lg:py-28">
        <blockquote className="text-base font-normal leading-relaxed text-[#CBD5E1] sm:text-lg sm:leading-loose">
          <span aria-hidden="true">“</span>
          {quote}
          <span aria-hidden="true">”</span>
        </blockquote>
      </div>
    </section>
  );
};

export default LocalStory;
