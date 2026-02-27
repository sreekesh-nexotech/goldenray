export default function BlogHero() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, #F8F2E1 0%, #FFFFFF 100%)",
      }}
    >
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(18,53,50,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(18,53,50,0.06) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 xl:px-36 pt-36 pb-14 md:pt-48 md:pb-16 max-w-7xl flex flex-col items-center text-center">
        {/* Label */}
        <p className="text-sm sm:text-base font-medium text-[#6B7280] tracking-wide mb-4">
          Knowledge Hub
        </p>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#123532] leading-tight mb-5">
          Solar Guides &amp; Insights
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-[#444444] max-w-xl md:max-w-2xl leading-relaxed mb-8">
          Clear, practical guides to help you make confident solar decisions.
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-sm sm:text-base text-[#6B7280]">
          <span>28 Guides</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#6B7280] inline-block" />
          <span>Last updated: Dec 2024</span>
        </div>
      </div>
    </section>
  );
}
