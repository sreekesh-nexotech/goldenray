import Certified from "../certified-by";
import SolarAdvantageMain from "../SolarCalculator/SolarAdvantageMain";
import GroupPurchaseHero from "./GroupPurchaseHero";
import GroupVsIndividual from "./GroupVsIndividual";
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
    </section>
  );
}
