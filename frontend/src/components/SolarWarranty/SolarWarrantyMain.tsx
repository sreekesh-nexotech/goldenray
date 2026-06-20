import React from "react";
import Hero from "./Hero";
import Metrics from "./Metrics";
import ThreeLayerSupport from "./ThreeLayerSupport";
import FreeVsChargeable from "./FreeVsChargeable";
import WarrantyGrid from "./WarrantyGrid";
import PerformanceGuarantee from "./PerformanceGuarantee";
import ZeroStressSupport from "./ZeroStressSupport";
import LongTermSupport from "./LongTermSupport";
import RealComplaints from "./RealComplaints";
import SupportContact from "./SupportContact";
import ProtectInvestment from "./ProtectInvestment";
import Faq from "./WarrantyFaq";

const SolarWarrantyMain = () => {
  return (
    <section className="relative overflow-x-hidden">
      <Hero />
      <Metrics />
      <ThreeLayerSupport />
      <FreeVsChargeable />
      <WarrantyGrid />
      <PerformanceGuarantee />
      <ZeroStressSupport />
      <LongTermSupport />
      <RealComplaints />
      <SupportContact />
      <ProtectInvestment />
      <Faq />
    </section>
  );
};

export default SolarWarrantyMain;
