"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import PageIllustration from "@/components/ui/page-illustration";
import Link from "next/link";

// FAQ Categories and their questions
const faqCategories = [
  {
    id: "pricing",
    name: "Pricing & Cost",
    questions: [
      {
        question: "What is the price of a solar panel in India?",
        answer:
          "Solar panel prices in India typically range from Rs.20 to Rs.45 per watt, depending on the type (monocrystalline vs. polycrystalline), brand, and wattage. A standard 1kW system costs roughly Rs.30,000-Rs.50,000 before subsidies. Prices have been falling year-on-year due to increased domestic manufacturing.\n\nTip: Always get at least 3 quotes from certified installers and compare price per watt, not total cost.",
      },
      {
        question: "What is the solar panel price for home use?",
        answer:
          "For a typical Indian home, a 1kW to 10kW rooftop system is suitable. Estimated costs:\n• 1 kW - Rs.40,000-Rs.60,000\n• 3 kW - Rs.1.1-Rs.1.5 lakh (maximum subsidy 78000)\n• 5 kW - Rs.1.8-Rs.2.5 lakh\n• 10 kW - Rs.3.5-Rs.5 lakh\n\nTip: Under PM Surya Ghar Muft Bijli Yojana, subsidies of up to Rs.78,000 are available for 3kW systems.",
      },
      {
        question: "What is the solar panel price for a 5kW system?",
        answer:
          "A 5kW solar system in India typically costs between Rs.1.8 lakh and Rs.2.5 lakh for supply and installation. This includes panels, inverter, mounting structure, wiring, and net-metering charges. A 5kW system can generate 18-25 units per day, enough for a 3-4 BHK home.\n\nTip: Payback period for a 5kW system is typically 4-6 years, depending on electricity tariff and sunlight hours in your city.",
      },
      {
        question: "What is the price of a 500-watt solar panel?",
        answer:
          "A 500-watt solar panel (usually a single large bifacial or monocrystalline PERC panel) costs approximately Rs.12,000-Rs.22,000 per panel in India. Prices vary by brand (Adani, Waaree, Luminous etc.) and efficiency rating. Higher-efficiency panels cost more upfront but generate more per square foot.",
      },
      {
        question: "What is the solar panel price in Delhi / different cities?",
        answer:
          "Prices are broadly similar across India but vary slightly based on local DISCOM rules and labour costs:\n• Delhi NCR - Rs.38-Rs.46/W (BSES/TPDDL net-metering is straightforward)\n• Mumbai - Rs.40-Rs.48/W\n• Bengaluru - Rs.36-Rs.44/W\n• Chennai / Hyderabad - Rs.34-Rs.42/W\n• Rajasthan / Gujarat - often 5-8% cheaper due to high solar irradiance and strong state policies",
      },
      {
        question: "What are the current solar panel rates per unit (kWh) generated?",
        answer:
          "Under net metering, surplus electricity exported to the grid is credited at Feed-in Tariff (FiT) rates, which vary by DISCOM but are typically Rs.2-Rs.4 per unit. Since most DISCOMs are moving to gross metering for larger systems, the effective savings come from offsetting your own consumption, which is worth your full retail tariff (Rs.5-Rs.10/unit depending on your slab).",
      },
      {
        question: "What is the solar panel price for a 3kW system?",
        answer:
          "A 3kW rooftop solar system typically costs Rs.1 lakh-Rs.1.5 lakh before subsidy. After the central government subsidy of Rs.78,000 (for systems up to 3kW), your effective cost can come down to Rs.30,000-Rs.70,000. It generates around 12-15 units/day and is ideal for a 2-3 BHK home with moderate appliance usage.",
      },
      {
        question: "How much does a 5kW rooftop solar system cost in India overall?",
        answer:
          "Total cost of ownership for a 5kW system over 25 years:\n• Upfront cost: Rs.2-Rs.2.5 lakh (installed)\n• Annual maintenance: Rs.3,000-Rs.8,000\n• Inverter replacement (year 10-12): Rs.15,000-Rs.30,000\n• Total 25-year savings on electricity: Rs.8-Rs.15 lakh (depending on tariff hikes)\n\nTip: Net ROI over 25 years can exceed 400% for most grid-connected rooftop systems in India.",
      },
    ],
  },
  {
    id: "installation",
    name: "Installation",
    questions: [
      {
        question: "How do I find reliable solar panel installers near me in India?",
        answer:
          "You can find certified installers through:\n• PM Surya Ghar portal (pmsuryaghar.gov.in) - only empanelled installers are listed here, making it the safest starting point\n• MNRE-empanelled vendors - list available on the Ministry of New & Renewable Energy website\n• State DISCOM portals - DISCOMs often have approved vendor lists for net metering\n• Comparison platforms like SolarClue, Waaree, Luminous dealer locators\n\nTip: Always verify the installer's MNRE/DISCOM empanelment before signing a contract.",
      },
      {
        question: "How much roof space is needed for a solar panel system?",
        answer:
          "As a rule of thumb, you need approximately 10 sq. ft. per 100W of capacity using standard panels. So:\n• 1 kW - approx 100 sq. ft.\n• 3 kW - approx 300 sq. ft.\n• 5 kW - approx 500 sq. ft.\n• 10 kW - approx 1,000 sq. ft.\n\nHigh-efficiency monocrystalline panels can reduce this requirement by 15-20%.",
      },
      {
        question: "How long does a solar panel installation take?",
        answer:
          "Physical installation of a residential rooftop system takes 1-3 days. However, the full process from application to commissioning - including DISCOM approval, net-meter installation, and subsidy registration - can take 4-12 weeks depending on your state and DISCOM.\n\nTip: Apply for net metering approval before installation starts to avoid delays.",
      },
      {
        question: "What is included in a solar panel installation package?",
        answer:
          "A complete solar installation typically includes:\n• Solar PV panels (monocrystalline/polycrystalline)\n• Solar inverter (string, micro, or hybrid)\n• Mounting structure (GI/aluminium frame)\n• DC & AC wiring, junction boxes, earthing\n• Net meter (installed by DISCOM, billed separately in some states)\n• 5-year workmanship warranty from installer\n\nBatteries are not included in standard on-grid systems and cost an additional Rs.30,000-Rs.80,000 for a home-scale battery backup.",
      },
      {
        question: "How do I maintain solar panels after installation?",
        answer:
          "Solar panels require minimal maintenance. Key steps:\n• Cleaning - Dust off panels every 2-4 weeks (more often in dusty/polluted cities). Use soft cloth and plain water - avoid harsh chemicals.\n• Annual inspection - Check wiring connections, MC4 connectors, and inverter health.\n• Monitor generation - Most inverters have apps. A sudden drop in generation can indicate shading, soiling, or a fault.\n• Inverter servicing - Replace air filters (if applicable) annually.",
      },
    ],
  },
  {
    id: "brands",
    name: "Brands",
    questions: [
      {
        question: "What are the best solar panel brands available in India?",
        answer:
          "Top-rated solar panel brands in India include:\n• Waaree Energies - India's largest solar manufacturer; excellent efficiency and warranty.\n• Adani Solar - Highly competitive pricing; strong after-sales network.\n• Tata Power Solar - Trusted brand; best for Tier-1 quality assurance.\n• Luminous Solar - Popular for small home systems; good inverter+panel combos.\n• Vikram Solar - Premium monocrystalline panels; used in large commercial projects.\n• Renewsys - Budget-friendly option without compromising quality.\n\nTip: For rooftop systems, stick to Tier-1 BIS-certified panels. They are eligible for government subsidies.",
      },
      {
        question: "Which solar panel brand is most affordable in India?",
        answer:
          "For budget-conscious buyers, Renewsys, Adani Solar, and UTL Solar offer competitive pricing without sacrificing too much on quality. However, the cheapest panels often use older polycrystalline technology with lower efficiency. It is usually worth paying 10-15% more for a monocrystalline panel from a Tier-1 brand to get better output over 25 years.",
      },
      {
        question: "Are Chinese solar panel brands good? Should I buy them?",
        answer:
          "Brands like JA Solar, LONGi, and Jinko are global Tier-1 manufacturers with excellent quality. However, due to the Basic Customs Duty (BCD) of 40% on imported panels, Chinese panels are no longer cost-competitive in India. Additionally, government subsidies under PM Surya Ghar require use of domestically manufactured (ALMM-listed) panels.\n\nTip: If you want subsidies, always choose ALMM-listed Indian-made panels. Check the MNRE ALMM list before purchasing.",
      },
      {
        question: "What warranty should I expect from solar panel brands?",
        answer:
          "Standard industry warranties in India:\n• Product warranty: 10-12 years (manufacturing defects)\n• Performance warranty: 25-30 years (panels should retain 80% or more efficiency at 25 years)\n• Inverter warranty: 5-10 years depending on brand\n• Mounting structure warranty: 5-10 years\n\nAlways read the fine print - performance warranty is typically on a linear degradation schedule (e.g. 0.5-0.7% or less per year).",
      },
    ],
  },
  {
    id: "subsidy",
    name: "Government Subsidies & Schemes",
    questions: [
      {
        question: "What government subsidies are available for solar panels in India?",
        answer:
          "The main scheme is PM Surya Ghar Muft Bijli Yojana, launched in 2024:\n• Up to 2 kW: Rs.30,000/kW subsidy (Rs.60,000 total)\n• 2-3 kW: Rs.18,000/kW for the additional 1 kW (total Rs.78,000)\n• Above 3 kW: No additional subsidy (capped at Rs.78,000)\n\nThis subsidy is credited directly to your bank account post-installation and DISCOM commissioning. Some states offer additional top-up subsidies.\n\nTip: Apply only through the official portal: pmsuryaghar.gov.in to avoid fraud.",
      },
      {
        question: "Who is eligible for the solar panel subsidy in India?",
        answer:
          "To be eligible:\n• Must be a residential consumer (not commercial/industrial)\n• Must install on your own rooftop or terrace\n• Must use ALMM-listed panels from MNRE-empanelled installers\n• Must apply through the PM Surya Ghar portal before installation\n• One subsidy per electricity consumer number\n\nHousing societies can also apply for common area installations.",
      },
      {
        question: "Are there low-interest solar loans available in India?",
        answer:
          "Yes. Under PM Surya Ghar, nationalised banks (SBI, Bank of Baroda, PNB, etc.) offer collateral-free solar loans at approx 7% interest for up to Rs.2 lakh for residential systems. Some state governments also offer additional interest subvention. Private banks and NBFCs like Tata Capital and HDFC offer solar loans at slightly higher rates (8-12%).",
      },
      {
        question: "What is net metering and how does it work in India?",
        answer:
          "Net metering allows you to export surplus solar electricity to the grid and receive a credit on your electricity bill. How it works:\n• A bi-directional meter records units consumed from and exported to the grid\n• At billing, exported units are offset against imported units\n• If you export more than you consume in a month, the credit carries forward (annual settlement in most states)\n\nNet metering is available for systems up to 500 kW in most states. Check your local DISCOM's net metering regulations as rules differ by state.",
      },
    ],
  },
  {
    id: "types",
    name: "Types & Efficiency",
    questions: [
      {
        question: "What is the difference between monocrystalline and polycrystalline solar panels?",
        answer:
          "Monocrystalline (Mono): Made from single silicon crystal; higher efficiency (19-23%); black appearance; better performance in low light and high temperatures; more expensive.\n\nPolycrystalline (Poly): Made from multiple silicon crystals; lower efficiency (15-17%); blue speckled appearance; cheaper but takes up more space for the same output.\n\nTip: For urban Indian homes with limited rooftop space, monocrystalline panels are almost always the better investment.",
      },
      {
        question: "How do I compare solar panel efficiency for Indian climate conditions?",
        answer:
          "India's climate is hot and sometimes humid, which affects panel performance. Key parameters to compare:\n• Temperature Coefficient (Pmax) - How much output drops per degree C above 25°C. Lower is better (aim for -0.35%/°C or better)\n• Low Irradiance Performance - Matters during monsoons, monocrystalline panels are better here\n• NOCT (Nominal Operating Cell Temperature) - Lower NOCT means better real-world output in hot conditions\n• PID Resistance - Important for humid coastal climates (Kerala, Tamil Nadu, West Bengal)",
      },
      {
        question: "What is a bifacial solar panel and is it worth it in India?",
        answer:
          "Bifacial panels generate electricity from both sides - front (direct sunlight) and rear (reflected light). They can produce 5-25% more energy than monofacial panels depending on the albedo (reflectivity) of the surface beneath. They cost 10-20% more but offer better ROI over time.\n\nTip: Bifacial panels are worth it if installed on light-coloured terraces or elevated ground mounts in sunny states like Rajasthan, Gujarat, and Maharashtra.",
      },
      {
        question: "What are the benefits of a solar panel project for businesses in India?",
        answer:
          "For commercial and industrial (C&I) consumers, solar offers significant advantages:\n• Accelerated depreciation - 40% in Year 1 under Income Tax, reducing tax liability\n• Reduction in electricity bills - C&I tariffs are Rs.8-Rs.14/unit, solar drastically cuts opex\n• CSR & ESG compliance - Helps meet sustainability reporting targets\n• Open Access - Large consumers (>100 kW) can source solar from third-party producers at competitive rates",
      },
    ],
  },
  {
    id: "buying",
    name: "Buying Guide",
    questions: [
      {
        question: "Where can I buy solar panels online in India?",
        answer:
          "You can purchase solar panels and related equipment from:\n• Brand websites - Waaree, Adani Solar, Luminous, Tata Power Solar (direct pricing, easiest for subsidies)\n• B2B marketplaces - IndiaMart, TradeIndia (bulk pricing, compare multiple sellers)\n• E-commerce - Amazon India, Flipkart (suitable for small systems and individual panels)\n• PM Surya Ghar Portal - Best for subsidy-eligible complete rooftop systems\n\nTip: Buying panels and inverters separately and getting a local installer is often cheaper than a turnkey package for savvy buyers.",
      },
      {
        question: "What should I look for when buying a home solar panel system?",
        answer:
          "A checklist for smart solar buying:\n• Panel brand is ALMM-listed (for subsidy eligibility)\n• Inverter brand has a good local service network\n• Installer is MNRE/DISCOM empanelled\n• Quoted capacity matches your actual electricity consumption (check bills)\n• Shadow/shading analysis done for your rooftop\n• Comprehensive warranty documents provided in writing\n• Net metering application process clearly explained by vendor",
      },
      {
        question: "What are common solar panel scams to avoid in India?",
        answer:
          "Watch out for these red flags:\n• Asking for 100% payment before installation\n• Promising 'free electricity' or 'zero bill' for systems that are clearly undersized\n• Non-MNRE empanelled vendors offering government subsidy 'shortcuts'\n• Using recycled/second-hand panels without disclosure\n• No written contract or warranty documents\n\nTip: Never pay more than 30-40% upfront. Balance payment should be tied to commissioning and net meter installation.",
      },
      {
        question: "What are the top hashtags and communities for solar panel buyers in India?",
        answer:
          "Join these communities to learn from real users and share experiences:\n• #SolarPanelInstall and #SolarPanel on Instagram & Twitter (X) - product photos and installation updates\n• r/India on Reddit - frequently has solar ROI calculators and real-world experiences\n• Solar Rooftop India Facebook group - active community with local installer reviews\n• PM Surya Ghar portal forums - official government community for scheme updates",
      },
    ],
  },
  {
    id: "pm-surya-ghar",
    name: "PM Surya Ghar: Muft Bijli Yojana",
    questions: [
      {
        question: "What is PM Surya Ghar Muft Bijli Yojana?",
        answer:
          "PM Surya Ghar: Muft Bijli Yojana is India's flagship rooftop solar scheme, launched on 13 February 2024 by Prime Minister Narendra Modi. It aims to install rooftop solar panels on 1 crore (10 million) households across India, providing up to 300 units of free electricity every month to each beneficiary household.\n\n• Budget: Rs.75,021 crore (approx. US$ 9 billion) until FY 2026-27\n• Target capacity: 30 GW of new residential rooftop solar\n• Free electricity: Up to 300 units/month per household\n• Annual savings per family: Rs.15,000-Rs.18,000 estimated\n• Status (March 2025): 10 lakh homes solarised; 70,000 installations/month\n\nTip: This is the world's largest domestic rooftop solar initiative, according to the Press Information Bureau (PIB), Government of India.",
      },
      {
        question: "Who is eligible for PM Surya Ghar Yojana?",
        answer:
          "To be eligible, you must meet all of the following:\n• Indian citizen - any resident of India\n• Property owner - must own the house/building where panels will be installed (tenants/renters are NOT eligible)\n• Valid electricity connection - must have an active DISCOM consumer number\n• Residential consumer - scheme is for homes, not commercial or industrial connections\n• No prior solar subsidy - should not have already availed any other central government solar subsidy on the same connection\n• Suitable rooftop - structurally sound roof with enough shadow-free area for panel installation\n\nHousing societies can also apply for common-area solar installations at Rs.18,000/kW up to 500 kW.",
      },
      {
        question: "How much subsidy do I get under PM Surya Ghar? (CFA Slab Table)",
        answer:
          "The Central Financial Assistance (CFA) subsidy is structured as follows for general states:\n\n• Up to 2 kW - 60% of system cost (Rs.30,000/kW) - Max subsidy Rs.60,000\n• 2 kW to 3 kW (extra 1 kW) - 40% of system cost (Rs.18,000/kW) - Max subsidy Rs.18,000\n• Maximum (3 kW+) - Capped at 3 kW - Rs.78,000\n• Above 3 kW - No additional subsidy - Rs.78,000 (same cap)\n\nSpecial-category states/UTs (Himalayan states, North-East, J&K, Ladakh, A&N Islands, Lakshadweep) have slightly higher subsidy slabs.\n\nExample: 1.5 kW = Rs.45,000; 2.5 kW = Rs.69,000.\n\nTip: The subsidy is paid as Direct Benefit Transfer (DBT) directly to your bank account within 30 days of commissioning - no middlemen involved.",
      },
      {
        question: "What documents are required to apply for PM Surya Ghar?",
        answer:
          "Keep the following documents ready before you start your application:\n• Aadhaar Card - for identity verification\n• Electricity Bill - latest bill showing your consumer number and DISCOM\n• Property Ownership Proof - sale deed, khata, property tax receipt, or registry document\n• Active mobile number - linked to Aadhaar (for OTP verification)\n• Bank account details - passbook front page or cancelled cheque (for DBT subsidy transfer)\n• Passport-size photograph\n• Vendor installation invoice - after installation, for subsidy claim\n• Rooftop photographs - images of installed panels and surroundings (for commissioning)\n\nAll documents are uploaded digitally on the PM Surya Ghar portal - no physical submission required.",
      },
      {
        question: "How do I apply for PM Surya Ghar step by step?",
        answer:
          "The entire process is digital. Follow these steps:\n\nStep 1 - Register: Visit pmsuryaghar.gov.in. Enter your state, DISCOM, consumer number, mobile number, and email ID to register.\n\nStep 2 - Apply: Log in with your mobile and consumer number. Fill out the rooftop solar application form.\n\nStep 3 - DISCOM Feasibility Check: Your DISCOM will verify your connection and rooftop suitability (usually takes 7-15 days).\n\nStep 4 - Select Vendor: Choose an MNRE-empanelled registered vendor from the portal's list for your state/district.\n\nStep 5 - Installation: Vendor installs the system. Physical installation takes 1-3 days.\n\nStep 6 - Net Meter Application: Apply for net meter connection through the portal. DISCOM installs the bi-directional meter.\n\nStep 7 - Commissioning Certificate: After DISCOM inspection and net meter setup, a commissioning certificate is generated on the portal.\n\nStep 8 - Claim Subsidy: Submit your bank account details and cancelled cheque via the portal. Subsidy is credited within 30 days.\n\nTip: You can track your application status anytime at pmsuryaghar.gov.in using your mobile number and consumer number.",
      },
      {
        question: "Are collateral-free loans available under PM Surya Ghar?",
        answer:
          "Yes. As of September 2025, over 5.79 lakh loans worth Rs.10,907 crore have been sanctioned under PM Surya Ghar. Key loan features:\n\n• Collateral-free - No property or asset pledge needed\n• Processed digitally via the JanSamarth Portal (jansamarth.in)\n• Interest rate - approx 7% per annum from nationalised banks (SBI, Bank of Baroda, PNB, Canara Bank etc.)\n• Loan amount - Up to Rs.2 lakh for residential systems\n• Tenure - Typically 5-10 years\n• EMI-friendly - Many vendors also offer in-house EMI options\n\nTaking a loan is entirely optional - the subsidy alone is available without requiring any loan.",
      },
      {
        question: "What is the current progress of PM Surya Ghar Yojana?",
        answer:
          "As of early 2026, the scheme has seen remarkable momentum:\n\n• 10 lakh+ homes solarised as of March 2025 (milestone achieved)\n• 4,946 MW of rooftop capacity added by July 2025\n• Rs.9,280 crore in subsidies disbursed by July 2025\n• 5.79 lakh loans (Rs.10,907 crore) sanctioned by September 2025\n• Monthly installations: approx 70,000/month (10x the pre-scheme rate)\n• Target: 40 lakh by March 2026, 1 crore by March 2027\n\nTop performing states: Rajasthan, Maharashtra, Gujarat, Tamil Nadu. Chandigarh and Daman & Diu have achieved 100% of government building targets.",
      },
      {
        question: "What are the environmental and financial benefits of the scheme?",
        answer:
          "The scheme delivers benefits at multiple levels:\n\n• Free electricity - Up to 300 units/month per household, saving Rs.15,000-Rs.18,000 annually\n• Extra income - Sell surplus solar power to DISCOM via net metering\n• CO2 reduction - Over 25 years, the scheme is projected to eliminate 720 million tonnes of CO2 emissions\n• Clean energy - Generates an estimated 1,000 BUs (billion units) over 25 years\n• Job creation - Creates approximately 17 lakh jobs in manufacturing, installation, supply chain, and O&M\n• Government savings - Expected to save the government Rs.75,000 crore annually in electricity costs\n• EV charging - Enables low-cost electric vehicle charging from rooftop solar",
      },
      {
        question: "What are common mistakes and challenges when applying for PM Surya Ghar?",
        answer:
          "Avoid these common pitfalls:\n\n• Using non-empanelled vendors - subsidy will be rejected if your vendor is not MNRE-registered on the portal\n• Using non-ALMM panels - only domestically manufactured, ALMM-listed panels qualify for the subsidy\n• Installing before DISCOM approval - always wait for feasibility approval before beginning installation\n• Applying on fake/unofficial websites - only use pmsuryaghar.gov.in (official portal). Many fraud sites collect personal data\n• Paying 100% upfront to vendor - pay maximum 30-40% upfront; balance only after net meter commissioning\n• Not submitting bank details promptly - submit cancelled cheque quickly after commissioning to avoid DBT delays\n\nTip: DISCOM delays (net meter installation, feasibility approval) are the most common cause of overall timeline delays - follow up proactively.",
      },
      {
        question: "What is the ROI (Return on Investment) for a 3 kW system under PM Surya Ghar?",
        answer:
          "A realistic ROI calculation for a 3 kW rooftop system under PM Surya Ghar:\n\n• Total installation cost (3 kW): Rs.1,20,000-Rs.1,50,000\n• Central subsidy (PM Surya Ghar): minus Rs.78,000\n• Net cost to homeowner: Rs.42,000-Rs.72,000\n• Monthly generation (average): 300-360 units\n• Annual electricity bill savings: Rs.18,000-Rs.36,000\n• Payback period: 2-4 years\n• System life: 25+ years\n\nAfter the payback period, you enjoy free electricity for the remaining 20+ years - making this one of the highest-ROI home investments available in India today.\n\nTip: The scheme is expected to save each participating family a cumulative Rs.3-Rs.5 lakh over the 25-year system life.",
      },
    ],
  },
];

// Quick filter options
const quickFilters = [
  { id: "subsidy", label: "I want subsidy info", categoryId: "subsidy" },
  { id: "pricing", label: "I want to know pricing", categoryId: "pricing" },
  {
    id: "installation",
    label: "I want installation info",
    categoryId: "installation",
  },
  { id: "pm-surya", label: "PM Surya Ghar scheme", categoryId: "pm-surya-ghar" },
];

// Solar myths data
const solarMyths = [
  {
    myth: "Solar doesn't work during the  \nmonsoon",
    fact: "Systems still generate 60-70% during rainy months. Panels work on daylight, not just direct sun.",
  },
  {
    myth: "Solar panels damage your  roof \n .",
    fact: "Modern mounting systems are non-penetrating or use sealed fasteners. No damage to roof structure .",
  },
  {
    myth: "Solar is too expensive for middle-class families",
    fact: "With ₹78,000 subsidy and EMI options from ₹2,000/month, solar is accessible to  most households.",
  },
];

export default function FaqMain() {
  const [activeCategory, setActiveCategory] = useState("pricing");
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set(["0"]),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };

    if (showCategoryDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCategoryDropdown]);

  // Get current category data
  const currentCategory = useMemo(() => {
    if (searchQuery.trim()) {
      // Search across all categories
      const results: { question: string; answer: string }[] = [];
      const query = searchQuery.toLowerCase();
      faqCategories.forEach((cat) => {
        cat.questions.forEach((q) => {
          if (
            q.question.toLowerCase().includes(query) ||
            q.answer.toLowerCase().includes(query)
          ) {
            results.push(q);
          }
        });
      });
      return { id: "search", name: "Search Results", questions: results };
    }
    return (
      faqCategories.find((cat) => cat.id === activeCategory) || faqCategories[0]
    );
  }, [activeCategory, searchQuery]);

  // Toggle question expansion
  const toggleQuestion = (index: string) => {
    setExpandedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Expand/collapse all
  const toggleAll = () => {
    if (expandedQuestions.size === currentCategory.questions.length) {
      setExpandedQuestions(new Set());
    } else {
      setExpandedQuestions(
        new Set(currentCategory.questions.map((_, i) => i.toString())),
      );
    }
  };

  // Handle quick filter click
  const handleQuickFilter = (categoryId: string) => {
    setSearchQuery("");
    setActiveCategory(categoryId);
    setExpandedQuestions(new Set(["0"]));
  };

  // Handle category click
  const handleCategoryClick = (categoryId: string) => {
    setSearchQuery("");
    setActiveCategory(categoryId);
    setExpandedQuestions(new Set(["0"]));
    setShowCategoryDropdown(false);
  };

  return (
    <section className="relative">
      {/* Hero Section */}
      <div className="relative w-full overflow-hidden">
        <PageIllustration />
        <div className="relative z-10 container mx-auto px-4 pt-32 pb-10 md:pt-48 md:pb-10 max-w-7xl flex flex-col items-center h-full">
          <div className="w-full text-center">
            <h1 className="text-[40px]/10 sm:text-5xl lg:text-7xl font-bold text-[#123532] mb-4">
              Have any questions?
            </h1>
            <p className="text-base w-full md:w-2/3 mx-auto sm:text-lg md:text-2xl text-[#444444] mb-8">
              Get expert advice and find your ideal solar solution—no
              obligations, just savings!
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <input
                type="text"
                placeholder="Search your question..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pr-14 rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F7BA41] focus:border-transparent text-gray-700"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-[#F7BA41] rounded-full hover:bg-[#e6a73a] transition-colors"
                aria-label="Search"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Filters Section */}
      <div className="px-4 sm:px-6 lg:px-8 xl:px-36 py-8">
        <p className="text-center text-[#444444] mb-4 font-medium">
          What are you looking for?
        </p>
        <div className="flex overflow-x-auto gap-3 pb-2 md:flex-wrap md:justify-center md:overflow-visible md:pb-0">
          {quickFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleQuickFilter(filter.categoryId)}
              className={`px-5 py-2.5 rounded-full border transition-all duration-200 text-sm font-medium cursor-pointer whitespace-nowrap flex-shrink-0 ${
                activeCategory === filter.categoryId
                  ? "bg-[#123532] text-white border-[#123532]"
                  : "bg-white text-[#444444] border-gray-300 hover:border-[#123532] hover:text-[#123532]"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main FAQ Content */}
      <div className="px-4 sm:px-6 lg:px-8 xl:px-36 py-8">
        {/* Mobile Categories Dropdown */}
        <div className="lg:hidden mb-8 max-w-xs">
          <p className="text-[#444444] mb-3 font-medium">Categories</p>
          <div className="relative" ref={dropdownRef}>
            <button
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-left text-[#444444] focus:outline-none focus:ring-2 focus:ring-[#F7BA41] focus:border-transparent flex justify-between items-center"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              <span>{faqCategories.find(cat => cat.id === activeCategory)?.name}</span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showCategoryDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                {faqCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      handleCategoryClick(category.id);
                      setShowCategoryDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 first:rounded-t-lg last:rounded-b-lg transition-colors text-[#444444] hover:text-[#F7BA41] flex justify-between items-center"
                  >
                    <span>{category.name}</span>
                    {activeCategory === category.id && (
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Left Sidebar - Categories */}
          <div className="lg:w-72 flex-shrink-0 hidden lg:block">
            <nav className="bg-[#F6F2EF] rounded-2xl p-4">
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl mb-1 last:mb-0 transition-all duration-200 cursor-pointer ${
                    activeCategory === category.id
                      ? "bg-[#F7BA41] text-[#123532] font-semibold"
                      : "text-[#444444] hover:bg-[#ebe7e3]"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Content - FAQ Accordion */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[#123532]">
                {currentCategory.name}
              </h2>
              <button
                onClick={toggleAll}
                className="text-[#123532] hover:text-[#F7BA41] font-medium text-sm transition-colors cursor-pointer"
              >
                {expandedQuestions.size === currentCategory.questions.length
                  ? "Collapse All"
                  : "Expand All"}
              </button>
            </div>

            {/* Mobile FAQ Cards */}
            <div className="lg:hidden space-y-4">
              {currentCategory.questions.length === 0 ? (
                <p className="text-[#444444] text-center py-8">
                  No questions found matching your search.
                </p>
              ) : (
                currentCategory.questions.map((faq, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-2xl p-4 border border-gray-200 transition-colors duration-200 ${
                      expandedQuestions.has(index.toString())
                        ? "bg-[#F7F4E6] border-[#F7BA41]"
                        : ""
                    }`}
                  >
                    <button
                      className="flex justify-between items-start w-full text-left focus:outline-none cursor-pointer group"
                      onClick={() => toggleQuestion(index.toString())}
                      aria-expanded={expandedQuestions.has(index.toString())}
                    >
                      <span className="text-base font-semibold text-[#444444] pr-4 group-hover:text-[#123532] transition-colors">
                        {faq.question}
                      </span>
                      <span
                        className={`text-2xl font-light text-[#123532] transition-transform duration-300 flex-shrink-0 ${
                          expandedQuestions.has(index.toString())
                            ? "rotate-45"
                            : "rotate-0"
                        }`}
                      >
                        +
                      </span>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        expandedQuestions.has(index.toString())
                          ? "max-h-96 opacity-100 mt-3"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="text-[#444444] text-sm leading-relaxed whitespace-pre-wrap">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop FAQ Accordion */}
            <div className="hidden lg:block bg-[#F6F2EF] rounded-2xl p-6">
              {currentCategory.questions.length === 0 ? (
                <p className="text-[#444444] text-center py-8">
                  No questions found matching your search.
                </p>
              ) : (
                currentCategory.questions.map((faq, index) => (
                  <div
                    key={index}
                    className={`border-b border-gray-200 last:border-b-0 py-4 px-4 -mx-4 rounded-xl transition-colors duration-200 ${
                      expandedQuestions.has(index.toString())
                        ? "bg-[#F7F4E6]"
                        : ""
                    }`}
                  >
                    <button
                      className="flex justify-between items-start w-full text-left focus:outline-none cursor-pointer group"
                      onClick={() => toggleQuestion(index.toString())}
                      aria-expanded={expandedQuestions.has(index.toString())}
                    >
                      <span className="text-base md:text-lg font-semibold text-[#444444] pr-4 group-hover:text-[#123532] transition-colors">
                        {faq.question}
                      </span>
                      <span
                        className={`text-2xl font-light text-[#123532] transition-transform duration-300 flex-shrink-0 ${
                          expandedQuestions.has(index.toString())
                            ? "rotate-45"
                            : "rotate-0"
                        }`}
                      >
                        +
                      </span>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        expandedQuestions.has(index.toString())
                          ? "max-h-96 opacity-100 mt-3"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="text-[#444444] text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Common Solar Myths Section */}
      <div className="px-4 sm:px-6 lg:px-8 xl:px-36 py-12">
        <h2 className="text-3xl md:text-4xl font-semibold text-[#123532] text-center mb-10">
          Common Solar Myths
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-6 xl:gap-8 2xl:gap-8">
          {solarMyths.map((item, index) => {
            const backgroundColors = [
              "#FDF6D280", // Light yellow/cream for first card
              "#ADD6D880", // Light blue/cyan for second card
              "#FBE8DA80", // Light pink/peach for third card
            ];
            return (
              <div
                key={index}
                className="rounded-2xl p-4 sm:p-4 md:p-4 lg:p-6 xl:p-6 2xl:p-8 shadow-sm border border-gray-100 flex flex-col gap-2 sm:gap-2 md:gap-3 lg:gap-3 xl:gap-4 2xl:gap-4"
                style={{ backgroundColor: backgroundColors[index] }}
              >
                {/* Myth */}
                <div className="flex items-start gap-3 sm:gap-4 md:gap-4 lg:gap-4 xl:gap-4 2xl:gap-5">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-10 lg:h-10 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-6 lg:h-6 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm sm:text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-base font-semibold text-red-500 uppercase tracking-wide mb-2">
                      Myth
                    </p>
                    <p className="text-[#444444] font-medium text-sm sm:text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-base leading-relaxed whitespace-pre-wrap">{item.myth}</p>
                  </div>
                </div>

                {/* White separator line */}
                <div className="h-0.5 bg-white rounded-full ml-11 sm:ml-[52px] md:ml-14 lg:ml-14 xl:ml-[60px] 2xl:ml-[68px]"></div>

                {/* Fact */}
                <div className="flex items-start gap-3 sm:gap-4 md:gap-4 lg:gap-4 xl:gap-4 2xl:gap-5">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-10 lg:h-10 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-6 lg:h-6 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm sm:text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-base font-semibold text-green-500 uppercase tracking-wide mb-2">
                      Fact
                    </p>
                    <p className="text-[#444444] text-sm sm:text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-base leading-relaxed whitespace-pre-wrap">
                      {item.fact}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Still Not Sure CTA Section */}
      <div className="px-4 sm:px-6 lg:px-8 xl:px-36 py-12 mb-12">
        <div className=" rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#123532] mb-4">
            Still not sure?
          </h2>
          <p className="text-[#444444] text-lg mb-8 max-w-2xl mx-auto">
            Let us guide you through your solar journey with personalized
            recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/advanced-calculator"
              className="px-8 py-3 bg-[#F7BA41] text-[#123532] font-semibold rounded-lg hover:bg-[#e6a73a] transition-colors duration-200"
            >
              Calculate Your Savings
            </Link>
            <Link
              href="/contactus"
              className="px-8 py-3 border-2 border-[#123532] text-[#123532] font-semibold rounded-lg hover:bg-[#123532] hover:text-white transition-colors duration-200"
            >
              Book a Call
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
