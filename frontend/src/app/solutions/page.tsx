import Faq from "@/components/Home/Faq";
import Services from "@/components/Services";
import SolutionBox from "@/components/Solutions/Solution-box";
import Hero from "@/components/ui/Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Residential & Commercial Solar Solutions in Kerala | Flarize",
  description:
    "Discover custom solar solutions in Kerala for homes and businesses. Expert installation, high-efficiency panels, and trusted support.",
  keywords: [
    "residential solar installation kerala",
    "commercial solar installation kerala",
    "home solar panels kerala",
    "rooftop solar solutions kerala",
    "solar EPC company kerala",
  ],
  openGraph: {
    title: "Residential & Commercial Solar Solutions in Kerala | Flarize",
    description:
      "Discover custom solar solutions in Kerala for homes and businesses. Expert installation, high-efficiency panels, and trusted support.",
    url: "https://flarize.com/solar-solutions-kerala",
    siteName: "Flarize",
    images: [
      { url: "/heroImg.png", width: 1200, height: 630, alt: "Solar Solutions" },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Residential & Commercial Solar Solutions in Kerala | Flarize",
    description:
      "Discover custom solar solutions in Kerala for homes and businesses. Expert installation, high-efficiency panels, and trusted support.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.flarize.com/solar-solutions-kerala",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Solutions() {
  return (
    <>
      <Hero
        title="Our Solar Solutions"
        description="Custom solar solutions designed to meet the unique energy needs of homes, businesses, and industries"
      />

      {/* Solution Boxes */}
      <SolutionBox
        BoxBgColor="[#074A4D]"
        TextColor="text-[#FFFFFF]"
        showYellowBtn={true}
        BoxTitle="Residential Solar Installation"
        BoxDescription="For a home in Kerala, solar is more than a power choice—it’s a long-term decision for comfort 
and savings. Our residential solar solutions are planned around your home’s electricity usage, roof space, and local conditions like sunlight and weather. Every step, from the first discussion to system activation, is explained clearly so there are no surprises. The installation is neat, safe, and built to last, helping your household reduce electricity bills while enjoying steady, dependable power for years to come. "
        BoxImg="https://gym-manager-pull.b-cdn.net/golden_ray/solution/Rectangle-12153.png"
      />

      <SolutionBox
        BoxBgColor="[#ADD6D8]"
        TextColor="text-[#444444]"
        showYellowBtn={false}
        BoxTitle="Commercial Solar Installation"
        BoxDescription="Running a business in Kerala means managing power costs without interrupting daily 
operations. Our commercial solar installations are designed after carefully understanding your 
working hours, power demand, and available rooftop or open space. 
From approvals to commissioning, the process is handled smoothly with clear communication at 
every stage. The result is a reliable solar system that supports stable energy expenses and 
helps businesses plan better for the future. "
        BoxImg="https://golden-ray.b-cdn.net/images/Roof%20solar%20panel%20mounting.jpg"
      />

      {/* Services offered */}
      <Services serviceTitle="Why Choose Our Solar Solutions?" />

      <Faq />
    </>
  );
}
