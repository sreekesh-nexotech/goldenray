import LinkingButton from "../ui/LinkingButton";
import { fetchPageContent } from "@/services/publicCmsService";

// Shipped defaults. The Studio's Career Page screen (§6.16) can replace the
// background (`hero_background` slot) and correct the two lines of copy
// (`hero_title`, `hero_subtitle`); anything not overridden renders as below.
const DEFAULT_BACKGROUND =
  "https://golden-ray.b-cdn.net/images/568f4aca0ddfc431cf07eb3eb195f26e8bfbe791.jpg";
const DEFAULT_TITLE = "Join The Team Behind Kerala's Fastest Growing Solar Platform";
const DEFAULT_SUBTITLE =
  "Work on products, operations, technology, and customer experiences that power real homes.";

export default async function CareerHero() {
  const content = await fetchPageContent("/career");
  const background = content?.images?.hero_background?.url ?? DEFAULT_BACKGROUND;
  const title = content?.text?.hero_title ?? DEFAULT_TITLE;
  const subtitle = content?.text?.hero_subtitle ?? DEFAULT_SUBTITLE;

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        role="img"
        aria-label={content?.images?.hero_background?.alt || undefined}
        style={{ backgroundImage: `url('${background}')` }}
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 z-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24 md:pt-44 md:pb-28 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-semibold leading-tight text-white mb-6 max-w-4xl">
          {title}
        </h1>
        <p className="text-sm md:text-xl font-normal leading-relaxed text-[#DBD8D8] mb-10 max-w-2xl">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <LinkingButton
            content="View Open Positions"
            ButtonLink="#open-positions"
            ButtonBg="bg-[#F7BA41]"
            Buttontext="text-[#272218]"
            ButtonHover="hover:bg-yellow-500"
          />
          <LinkingButton
            content="Explore Life at Flarize"
            ButtonLink="#why-flarize"
            ButtonBg="bg-white"
            Buttontext="text-black"
            ButtonHover="hover:bg-white/10"
            ButtonBorder="border border-white/40"
          />
        </div>
      </div>
    </section>
  );
}
