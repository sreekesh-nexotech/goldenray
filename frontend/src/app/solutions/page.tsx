import Services from "@/components/Services";
import SolutionBox from "@/components/Solutions/Solution-box";
import Hero from "@/components/ui/Hero";


export default function Solutions(){
    return(
        <>
        <Hero title="Our Solar Solutions" description="Custom solar solutions designed to meet the unique energy needs of homes, businesses, and industries"/>

        {/* Solution Boxes */}
        <SolutionBox 
            BoxBgColor="[#074A4D]"
            TextColor="text-[#FFFFFF]"
            circleBgColor="[#F7BA41]"
            showYellowBtn={true}
            showWhiteBtn={false}
            BoxTitle="Residential Solar Solution"
            BoxDescription="Switch to solar and enjoy lower electricity bills, energy independence, and a greener lifestyle. Our residential solar solutions are designed for individual homes, apartments, and housing communities, ensuring a seamless and cost-effective transition to clean energy."
            BoxList1="Reduce or eliminate electricity bills"
            BoxList2="Increase property value"
            BoxList3="Qualify for tax incentives and rebates"
            BoxList4="Environmentally friendly renewable energy"
            BoxImg="/Rectangle-12153.png"
        />

        <SolutionBox 
            BoxBgColor="[#ADD6D8]"
            TextColor="text-[#444444]"
            circleBgColor="[#074A4D]"
            showYellowBtn={false}
            showWhiteBtn={true}
            BoxTitle="Commercial Solar Solution"
            BoxDescription="Optimize your business’s energy efficiency and reduce operational costs with our custom solar solutions for offices, retail spaces, educational institutions, and more. Enjoy government incentives, long-term savings, and a reputation for sustainability."
            BoxList1="Lower operational costs"
            BoxList2="Enhanced corporate social responsibility"
            BoxList3="Tax benefits and accelerated depreciation"
            BoxList4="Energy independence from utility providers"
            BoxImg="/Commercial-Image-2.png"
        />

        <SolutionBox 
            BoxBgColor="[#F7BA41]"
            TextColor="text-[#123532]"
            circleBgColor="[#074A4D]"
            showYellowBtn={false}
            showWhiteBtn={true}
            BoxTitle="Industrial Solar Solution"
            BoxDescription="For factories, warehouses, and large industrial setups, our high-capacity solar systems ensure uninterrupted power supply, reduced dependency on the grid, and massive cost savings. Experience scalable solutions tailored to your energy demands."
            BoxList1="High capacity energy production"
            BoxList2="Reduced peak load charges"
            BoxList3="Backup power during outages"
            BoxList4="Scalable to meet growing energy needs"
            BoxImg="/Rectangle-12155.png"
        />

        {/* Services offered */}
        <Services serviceTitle="Why Choose Our Solar Solutions?"/>
        </>
    )
}