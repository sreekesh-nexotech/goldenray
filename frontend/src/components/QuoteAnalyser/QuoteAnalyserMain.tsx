import React from "react";
import QuoteHero from "./QuoteHero";
import QuoteAnalyzerSection from "./QuoteAnalyzerSection";
import HowAIWorks from "./HowAIWorks";
import QuotePreview from "./QuotePreview";
import WhatAIDetects from "./WhatAIDetects";
import Certified from "../certified-by";
import HomeTestimonial from "../Home/Testimomial";
import Faq from "../Home/Faq";

const QuoteAnalyserMain = () => {
  return (
    <section className="relative">
      <QuoteHero />
      <QuoteAnalyzerSection />
      <HowAIWorks />
      <QuotePreview />
      <WhatAIDetects />
      <Certified />
      <HomeTestimonial />
      <Faq />
    </section>
  );
};

export default QuoteAnalyserMain;
