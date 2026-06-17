import ServiceAreaHero from "./ServiceAreaHero";
import ServiceAreaSearch from "./ServiceAreaSearch";
import PopularServiceAreas from "./PopularServiceAreas";
import ExploreByLocation from "./ExploreByLocation";
import LocalSupport from "./LocalSupport";
import ServiceAreaCTA from "./ServiceAreaCTA";

export default function ServiceAreaMain() {
  return (
    <section className="relative">
      {/* 1. Hero section */}
      <ServiceAreaHero />

      {/* 2. Search & filter bar */}
      <ServiceAreaSearch />

      {/* 3. Popular service areas */}
      <PopularServiceAreas />

      {/* 4. Explore solar services by location */}
      <ExploreByLocation />

      {/* 5. Local solar support */}
      <LocalSupport />

      {/* 6. Call to action */}
      <ServiceAreaCTA />
    </section>
  );
}
