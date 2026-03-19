import Hero from "@/components/ui/Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solar Subsidy & Rooftop Solar FAQs in Kerala",
  description:
    "Find answers on solar subsidies, pricing, net metering, and rooftop solar systems in Kerala before going solar.",
  keywords: [
    "solar subsidy kerala",
    "rooftop solar FAQ kerala",
    "net metering kerala solar",
    "solar panel price kerala FAQ",
    "on grid solar subsidy kerala",
  ],
  openGraph: {
    title: "Solar Subsidy & Rooftop Solar FAQs in Kerala",
    description:
      "Find answers on solar subsidies, pricing, net metering, and rooftop solar systems in Kerala before going solar.",
    url: "https://www.flarize.com/faq",
    siteName: "Flarize",
    images: [
      { url: "/heroImg.png", width: 1200, height: 630, alt: "Solar FAQ" },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar Subsidy & Rooftop Solar FAQs in Kerala",
    description:
      "Find answers on solar subsidies, pricing, net metering, and rooftop solar systems in Kerala before going solar.",
    images: ["/heroImg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.flarize.com/faq",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FaqMain() {
  // Array of FAQ data (questions and answers)
  const faqs = [
    {
      question: "What maintenance is required for solar panels?",
      answer:
        "Solar panels require minimal maintenance. Typically, they need to be cleaned a few times a year to remove dirt, dust, or debris that might accumulate and affect efficiency. Regular inspections can also help identify any potential issues early on.",
    },
    {
      question: "Can I run my home completely on solar power?",
      answer:
        "Yes, it is possible to run your home completely on solar power, especially with a properly sized system and battery storage. The feasibility depends on your energy consumption, the amount of sunlight your location receives, and the capacity of your solar system.",
    },
    {
      question: "What is the lifespan of solar panels?",
      answer:
        "Most solar panels come with a performance warranty of 20-25 years, guaranteeing a certain percentage of their original power output. However, solar panels can continue to produce electricity for 30 years or even more, albeit with a gradual decrease in efficiency over time.",
    },
    {
      question: "How long does it take to install a solar system?",
      answer:
        "The actual installation process for a residential solar system typically takes 1-3 days. However, the entire process, including design, permitting, and inspections, can take several weeks to a few months depending on local regulations and scheduling.",
    },
    {
      question: "What is the cost of installing solar panels at home?",
      answer:
        "The cost of installing solar panels varies widely based on system size, panel type, installation complexity, and location. It's best to get a personalized quote, but there are often government incentives and tax credits available to help offset the initial investment.",
    },
    {
      question: "How much can I save by switching to solar?",
      answer:
        "Savings from switching to solar can be substantial and depend on your current electricity rates, energy consumption, system size, and available incentives. Many homeowners see significant reductions in their monthly electricity bills, and over the lifespan of the system, the savings can amount to tens of thousands of dollars.",
    },
    {
      question: "What happens during a power outage?",
      answer:
        "Without a battery backup system, grid-tied solar systems typically shut down during a power outage for safety reasons (to prevent back-feeding the grid and endangering utility workers). If you have a battery storage system, your home can continue to be powered by the stored solar energy during an outage.",
    },
  ];
  return (
    <section className="relative mb-12">
      {/* Hero section */}
      <Hero
        title="Have any questions?"
        description="Get expert advice and find your ideal solar solution—no obligations, just savings!"
      />

      {/* faq content */}
      <div className="relative  px-4 sm:px-6 lg:px-8 xl:px-36 rounded-3xl">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border-b border-gray-200 last:border-b-0 py-4"
          >
            <span className="text-base md:text-2xl font-semibold text-[#444444] pr-4">
              {faq.question}
            </span>
            <div className="mt-3 text-[#444444] text-sm md:text-lg leading-relaxed">
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
