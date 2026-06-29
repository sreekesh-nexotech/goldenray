import LinkingButton from "../ui/LinkingButton";

export default function CareerHero() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* TODO: replace with final background image (provided later) */}
      <div className="absolute inset-0 z-0 bg-[#123532]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24 md:pt-44 md:pb-28 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-semibold leading-tight text-white mb-6 max-w-4xl">
          Join The Team Behind Kerala&apos;s Fastest Growing Solar Platform
        </h1>
        <p className="text-sm md:text-xl font-normal leading-relaxed text-[#DBD8D8] mb-10 max-w-2xl">
          Work on products, operations, technology, and customer experiences
          that power real homes.
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
            ButtonBg="bg-transparent"
            Buttontext="text-white"
            ButtonHover="hover:bg-white/10"
            ButtonBorder="border border-white/40"
          />
        </div>
      </div>
    </section>
  );
}
