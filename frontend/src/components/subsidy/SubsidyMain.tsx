"use client";

import React from "react";
import SubsidyHero from "./SubsidyHero";
import SolarAdvantageMain from "../SolarCalculator/SolarAdvantageMain";
import SubsidySteps from "./subsidy-steps";
import WhyFlarize from "./Why-flarize";
import FlarizeReview from "./Flarize-review";
import Booking2 from "./Booking2";
import SubsidyFaq from "./SubsidyFaq";

export default function SubsidyMain() {
  return (
    <section className="font-switzer">
      <SubsidyHero />
      <SolarAdvantageMain showOwnershipField={true} />
      <SubsidySteps />
      <WhyFlarize />
      <FlarizeReview />

      <Booking2 />

      <SubsidyFaq />
    </section>
  );
}
