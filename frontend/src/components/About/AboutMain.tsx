import Certified from "../certified-by";
import Services from "../Services";
import AboutHero from "./AboutHero";
import Founder from "./Founder";
import MissionVisionGoals from "./MissionVissionGoals";
import StatsSection from "./StatSection";
import TeamSection from "./TeamSection";
import VideoSection from "./VideoSection";
import WhatWeBelieve from "./WhatWeBelieve";

export default function AboutMain(){
    return(
        <section className="relative">
            {/* Hero section */}
            <AboutHero/>

            {/* statistic data */}
            <StatsSection/>

            {/* What we Believe */}
            <WhatWeBelieve />

            {/* Mission vision goals*/}
            <MissionVisionGoals/>

            {/* Founder & CEO */}
            <Founder/>

            {/* Certified by */}
            <Certified/>

            {/* Our Team */}
            <TeamSection/>

            {/* Video section */}
            {/* <VideoSection/> */}

            {/* services*/}
            <Services serviceTitle="Why choose our solar solutions?"/>
        </section>
    )
}