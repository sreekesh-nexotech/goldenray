import Certified from "../certified-by";
import Activate from "./Activate";
import CalculateRewards from "./CalculateRewards";
import GroupLeader from "./GroupLeader";
import Faq from "./GroupPurchaseFAQ";
import GroupPurchaseHero from "./GroupPurchaseHero";
import Reserve from "./Reserve";
import SolarInstallation from "./SolarInstallation";
import SolarSlots from "./SolarSlots";
import What from "./What";

export default function GroupPurchaseMain() {
  return (
    <section className="relative">
      <GroupPurchaseHero />
        <Certified/>
        <SolarInstallation />
        <What />
        <CalculateRewards />
        <SolarSlots />
        <Reserve/>
        <GroupLeader/>
        <Faq/>
        <Activate/>
    </section>
  );
}
