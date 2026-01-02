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
            BoxTitle="Residential Solar Installation"
            BoxDescription="For a home in Kerala, solar is more than a power choice—it’s a long-term decision for comfort 
and savings. Our residential solar solutions are planned around your home’s electricity usage, roof space, and local conditions like sunlight and weather. Every step, from the first discussion to system activation, is explained clearly so there are no surprises. The installation is neat, safe, and built to last, helping your household reduce electricity bills while enjoying steady, dependable power for years to come. "
            BoxList1="Reduce or eliminate electricity bills"
            BoxList2="Increase property value"
            BoxList3="Qualify for tax incentives and rebates"
            BoxList4="Environmentally friendly renewable energy"
            BoxImg="https://gym-manager-pull.b-cdn.net/golden_ray/solution/Rectangle-12153.png"
        />

        <SolutionBox 
            BoxBgColor="[#ADD6D8]"
            TextColor="text-[#444444]"
            circleBgColor="[#074A4D]"
            showYellowBtn={false}
            showWhiteBtn={true}
            BoxTitle="Commercial Solar Installation"
            BoxDescription="Running a business in Kerala means managing power costs without interrupting daily 
operations. Our commercial solar installations are designed after carefully understanding your 
working hours, power demand, and available rooftop or open space. 
From approvals to commissioning, the process is handled smoothly with clear communication at 
every stage. The result is a reliable solar system that supports stable energy expenses and 
helps businesses plan better for the future. "
            BoxList1="Lower operational costs"
            BoxList2="Enhanced corporate social responsibility"
            BoxList3="Tax benefits and accelerated depreciation"
            BoxList4="Energy independence from utility providers"
            BoxImg="https://golden-ray.b-cdn.net/images/Roof%20solar%20panel%20mounting.jpg"
        />

        <SolutionBox 
            BoxBgColor="[#F7BA41]"
            TextColor="text-[#123532]"
            circleBgColor="[#074A4D]"
            showYellowBtn={false}
            showWhiteBtn={true}
            BoxTitle="Industrial Solar Installation"
            BoxDescription="Industrial facilities in Kerala need solar systems that can handle high power loads and 
continuous operations. Our industrial solar installations are engineered with careful load 
analysis, safety standards, and long-term performance in mind. 
We coordinate closely with plant managers and technical teams to ensure smooth integration 
with existing electrical systems. Every project is executed with precision, focusing on durability, 
compliance, and consistent power generation. "
            BoxList1="High capacity energy production"
            BoxList2="Reduced peak load charges"
            BoxList3="Backup power during outages"
            BoxList4="Scalable to meet growing energy needs"
            BoxImg="https://gym-manager-pull.b-cdn.net/golden_ray/solution/Rectangle-12155.png"
        />

        {/* Services offered */}
        <Services serviceTitle="Why Choose Our Solar Solutions?"/>
        </>
    )
}