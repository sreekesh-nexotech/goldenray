import CareerHero from "./CareerHero";
import CareerStats from "./CareerStats";
import BuildingMore from "./BuildingMore";
import WhyFlarize from "./WhyFlarize";
import WhatWeBelieveCareer from "./WhatWeBelieveCareer";
import LifeAtFlarize from "./LifeAtFlarize";
import OpenPositions from "./OpenPositions";
import ResumeCTA from "./ResumeCTA";
import JoinCTA from "./JoinCTA";

export default function CareerMain() {
  return (
    <section className="relative">
      {/* Hero section */}
      <CareerHero />

      {/* Statistic data */}
      <CareerStats />

      {/* We're building more than solar installations */}
      <BuildingMore />

      {/* Why Flarize */}
      <WhyFlarize />

      {/* What we believe in */}
      <WhatWeBelieveCareer />

      {/* Life at Flarize — Official Frames (left for later) */}
      <LifeAtFlarize />

      {/* Open positions */}
      <OpenPositions />

      {/* Send your resume CTA */}
      <ResumeCTA />

      {/* Ready to build something meaningful CTA */}
      <JoinCTA />
    </section>
  );
}
