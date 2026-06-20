import { Suspense } from "react";
import ServiceAreaHero from "./ServiceAreaHero";
import ServiceAreaExplorer from "./ServiceAreaExplorer";
import ExploreByLocation from "./ExploreByLocation";
import LocalSupport from "./LocalSupport";
import ServiceAreaCTA from "./ServiceAreaCTA";

export default function ServiceAreaMain() {
  return (
    <section className="relative">
      {/* 1. Hero section */}
      <ServiceAreaHero />

      {/* 2. Search & filter bar + 3. Popular service areas (shared filter state) */}
      <Suspense fallback={null}>
        <ServiceAreaExplorer />
      </Suspense>

      {/* 4. Explore solar services by location */}
      <ExploreByLocation />

      {/* 5. Local solar support */}
      <LocalSupport />

      {/* 6. Call to action */}
      <ServiceAreaCTA />
    </section>
  );
}
