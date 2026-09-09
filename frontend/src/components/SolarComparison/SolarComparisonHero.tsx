import PageIllustration from "@/components/ui/page-illustration";

// Server component, deliberately.
//
// The rest of this page lives in SolarComparisonMain, which reads filters from
// useSearchParams and therefore renders client-side only — its Suspense
// fallback is what ends up in the prerendered HTML. Leaving the H1 and the
// Kerala positioning copy in there meant the page's primary content, including
// its only H1, was absent from the server response. Keeping them here puts them
// in the HTML for every crawler, rendered or not.
export default function SolarComparisonHero() {
  return (
    <>
      <section className="relative w-full overflow-hidden">
        <PageIllustration />

        <div className="relative z-10 container mx-auto px-4 pt-20 pb-6 md:pt-24 md:pb-8 max-w-7xl">
          <div className="w-full text-center">
            <h1 className="text-3xl sm:text-3xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-semibold text-[#123532] mb-3">
              Compare Solar Panels for Your Home in Kerala
            </h1>
            <p className="text-base w-full md:w-2/3 mx-auto sm:text-lg md:text-xl text-[#444444] mb-4">
              Browse, filter, and compare panels rated for Kerala&apos;s climate
              — humidity, monsoon season, and high ambient temperatures all
              considered in every rating.
            </p>
          </div>
        </div>
      </section>

      {/* Kerala conditions note */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3">
        <div
          className="bg-[#FBF2EA] border border-[#F1E3D8] rounded-2xl shadow-sm px-5 py-4 sm:px-6 sm:py-5"
          style={{ borderLeft: "3px solid var(--text, #444444)" }}
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-[#3D3D3D] mb-2">
            All panels rated for Kerala conditions
          </h2>
          <p className="text-sm sm:text-md 2xl:text-lg leading-6 text-[#4C4C4C]">
            Humidity resistance, monsoon performance, and temperature
            coefficient are weighted heavily in our Kerala Climate Score. Panels
            that degrade badly above 35°C are flagged accordingly. Every score
            is based on manufacturer datasheets, third-party test data, and real
            installations across Alappuzha, Kottayam, and Ernakulam.
          </p>
        </div>
      </section>
    </>
  );
}
