import Certified from "../certified-by";
import AboutHero from "./AboutHero";
import Founder from "./Founder";
import FounderNote from "./FounderNote";
import Milestones from "./Milestones";
import MissionVisionGoals from "./MissionVissionGoals";
import StatsSection from "./StatSection";
import TeamSection from "./TeamSection";
import TeamShowcase from "./TeamShowcase";
import WhatWeBelieve from "./WhatWeBelieve";

export default function AboutMain() {
  return (
    <section className="relative">
      {/* Hero section */}
      <AboutHero />

      {/* statistic data */}
      <StatsSection />

      {/* What we Believe */}
      <WhatWeBelieve />

      {/* Mission vision goals*/}
      <MissionVisionGoals />

      {/* Founder's note & strategic advisor */}
      <FounderNote />

      {/* Milestones */}
      <Milestones />

      {/* Certified by */}
      <Certified />

      {/* Founder & CEO */}
      <Founder />

      {/* Our Team */}
      <TeamSection />

      {/* Team showcase */}
      <TeamShowcase />

      {/* Video section */}
      {/* <VideoSection/> */}
    </section>
  );
}
