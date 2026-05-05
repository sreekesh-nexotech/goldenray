import Certified from "../certified-by";
import HomeTestimonial from "../Home/Testimomial";
import SolarAdvantageMain from "../SolarCalculator/SolarAdvantageMain";
import Activate from "./Activate";
import GroupLeader from "./GroupLeader";
import Faq from "./GroupPurchaseFAQ";
import GroupPurchaseHero from "./GroupPurchaseHero";
import GroupVsIndividual from "./GroupVsIndividual";
import Reserve from "./Reserve";
import SolarInstallation from "./SolarInstallation";
import SolarSlots from "./SolarSlots";
import What from "./What";

export default function GroupPurchaseMain() {
  return (
    <section className="relative">
      <GroupPurchaseHero />
        <Certified/>
        <SolarAdvantageMain />
        <What />  
        <SolarInstallation />
        <SolarSlots />
        <GroupVsIndividual />
        <Reserve/>
        <GroupLeader/>
        <HomeTestimonial/>
        <Faq/>
        <Activate/>
    </section>
  );
}
