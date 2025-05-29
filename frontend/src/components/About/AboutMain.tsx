import AboutHero from "./AboutHero";
import StatsSection from "./StatSection";
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
        </section>
    )
}