export type ContentSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export type UnderstandingRow = {
  cells: string[];
};

export type UnderstandingTable = {
  headers: string[];
  rows: UnderstandingRow[];
  highlightColumnIndex?: number;
};

export type ArticleUnderstanding = {
  title: string;
  paragraphs: string[];
  table?: UnderstandingTable;
  afterTableParagraphs?: string[];
  keyInsight?: string;
};

export type ArticleEligible = {
  title: string;
  intro: string;
  items: string[];
  important?: string;
};

export type ArticleContent = {
  author: string;
  reviewedBy?: string;
  tags: string[];
  quickSummary: string[];
  intro: string[];
  sections: ContentSection[];
  understanding?: ArticleUnderstanding;
  eligible?: ArticleEligible;
};

export const blogContentMap: Record<string, ArticleContent> = {
  "complete-guide-kerala-solar-subsidies-2024": {
    author: "Rajesh Kumar",
    reviewedBy: "Solar Engineer",
    tags: ["Subsidy", "MNRE", "Kerala", "Tax Credits", "Net Metering", "ROI"],
    intro: [
      "Installing solar panels in Kerala has never been more affordable. With the MNRE subsidy program, homeowners can reduce their installation costs by up to ₹78,000 — making solar energy accessible to more families than ever before.",
      "But navigating the subsidy application process can be confusing. Many homeowners miss out on benefits simply because they don't know the right steps or requirements.",
      "This guide walks you through everything: eligibility criteria, exact subsidy amounts, the application process, common mistakes to avoid, and real examples from Kerala homes.",
    ],
    quickSummary: [
      "Who this is for: Kerala homeowners with residential electricity connections looking to install rooftop solar",
      "Key benefit: Save ₹18,000 to ₹78,000 on installation costs through MNRE subsidy",
      "Timeline: Subsidy credited within 30-60 days after installation and inspection",
      "Payback period: 4–6 years with subsidy (vs 7–9 years without)",
      "Eligibility: Must use MNRE-approved vendors and meet technical specifications",
    ],
    sections: [
      {
        id: "solar-basics",
        title: "Understanding Solar Subsidies in Kerala",
        paragraphs: [
          "The Government of India's MNRE (Ministry of New and Renewable Energy) offers a central financial assistance (CFA) subsidy for rooftop solar installations. Kerala homeowners benefit from both the MNRE central subsidy and state-level incentives from ANERT (Agency for Non-conventional Energy and Rural Technology).",
          "The PM Surya Ghar Muft Bijli Yojana, launched in 2024, significantly increased the subsidy amounts. For a 1–2 kW system, the subsidy is ₹30,000 per kW. For a 2–3 kW system, the additional kW gets ₹18,000. Systems above 3 kW receive a flat ₹78,000 maximum benefit.",
          "These subsidies are disbursed directly to your bank account after DISCOM (KSEB in Kerala) verification and net metering connection — not deducted from the installer's bill upfront.",
        ],
      },
      {
        id: "installation",
        title: "Eligibility Criteria You Must Meet",
        paragraphs: [
          "To qualify for the MNRE subsidy in Kerala, you must be a residential consumer with a valid KSEB electricity connection. The installation must be on your rooftop — ground-mounted systems do not qualify for the residential subsidy category.",
          "You are required to use only MNRE-empanelled vendors for the installation. Golden Ray Solar is an MNRE-certified installer, which means we handle the entire documentation process on your behalf.",
          "The system must use BIS-certified solar panels and inverters that appear on MNRE's approved models list. Installing non-certified equipment will disqualify you from receiving the subsidy, so always verify before purchasing.",
          "Importantly, you can only avail the subsidy once per household. If you have previously received a subsidy for a solar installation, you are not eligible for a second subsidy even if you upgrade your system.",
        ],
      },
      {
        id: "financing",
        title: "Exact Subsidy Amounts for 2024–25",
        paragraphs: [
          "For 1 kW system: ₹30,000 subsidy. Total installed cost after subsidy: approximately ₹45,000–₹55,000 depending on your chosen panel brand and inverter type.",
          "For 2 kW system: ₹60,000 subsidy (₹30,000 × 2). This is the most popular size for Kerala homes with monthly bills of ₹2,000–₹4,000.",
          "For 3 kW system: ₹78,000 subsidy (₹30,000 + ₹30,000 + ₹18,000). This covers most homes with monthly consumption up to 400–500 units.",
          "For systems above 3 kW: The subsidy is capped at ₹78,000 regardless of system size. So there is no additional subsidy benefit for 4 kW, 5 kW, or larger systems in the residential category.",
        ],
      },
      {
        id: "maintenance",
        title: "Step-by-Step Application Process",
        paragraphs: [
          "Step 1 — Register on the PM Surya Ghar Portal (pmsuryaghar.gov.in). Create an account using your KSEB consumer number and Aadhaar-linked mobile number. This registration is mandatory before installation.",
          "Step 2 — Apply for a feasibility study. KSEB will assess your roof capacity, sanctioned load, and grid compatibility within 15–30 days. Approval comes via SMS and portal notification.",
          "Step 3 — Get the installation done using an MNRE-empanelled vendor (like Golden Ray Solar). This installation must happen after you receive KSEB's feasibility approval — not before.",
          "Step 4 — Submit commissioning documents. After installation, your vendor will submit the installation report, panel/inverter certificates, and photos through the contractor portal.",
          "Step 5 — KSEB net meter installation. KSEB will install the bidirectional net meter within 15–30 days of commissioning approval.",
          "Step 6 — Subsidy disbursement. Once the net meter is installed and the system is commissioned, you submit your bank details on the portal. The subsidy amount is credited to your account within 30 days.",
        ],
      },
      {
        id: "technology",
        title: "Common Mistakes That Delay or Disqualify Subsidies",
        paragraphs: [
          "Installing before getting KSEB approval is the most common mistake. Many homeowners, eager to start saving, install panels before the feasibility study is complete. This can disqualify you from getting the subsidy entirely.",
          "Using non-empanelled vendors is another major pitfall. Even if you save money upfront with a cheaper installer who isn't MNRE-certified, you lose ₹60,000–₹78,000 in subsidy. Always verify empanelment status on the MNRE website.",
          "Incorrect bank account details cause significant delays. Submit a cancelled cheque with your application and double-check the IFSC code and account number. Even a single digit error means re-verification, which can take 4–6 extra weeks.",
          "Not following up with KSEB for net meter installation is also common. KSEB can take longer than 15 days if there is a backlog. Politely follow up every 2 weeks through the portal's grievance section.",
        ],
      },
      {
        id: "case-studies",
        title: "Real Savings: Kerala Homeowner Case Studies",
        paragraphs: [
          "The Nair family in Ernakulam installed a 3 kW system in March 2024. Their total cost was ₹1,85,000. After the ₹78,000 MNRE subsidy, their net investment was ₹1,07,000. Their monthly KSEB bill dropped from ₹3,200 to ₹380 — saving ₹33,840 annually. Their payback period is just 3.2 years.",
          "In Kozhikode, the Menon family chose a 5 kW system for their larger home. Total cost: ₹2,90,000. Subsidy received: ₹78,000 (capped). Net investment: ₹2,12,000. Annual savings on electricity: ₹52,000. With net metering credits, their payback period is 4.1 years, and they expect to earn back ₹8,00,000+ over 25 years.",
          "Both families worked with Golden Ray Solar as their MNRE-certified installer, which ensured smooth documentation, timely net meter application, and hassle-free subsidy processing.",
        ],
      },
    ],
    understanding: {
      title: "Understanding the MNRE Solar Subsidy in Kerala",
      paragraphs: [
        "The Ministry of New and Renewable Energy (MNRE) offers direct subsidies to residential consumers who install rooftop solar systems. This subsidy is credited directly to your bank account after successful installation and inspection.",
        "Kerala has one of the highest adoption rates in South India, with over 45,000 homes already benefiting from this program.",
      ],
      table: {
        headers: ["System Size", "Total Cost", "MNRE Subsidy", "Payback Period"],
        highlightColumnIndex: 2,
        rows: [
          { cells: ["1–2 kW", "₹60,000 – ₹1,20,000", "₹18,000 – ₹36,000", "5–6 years"] },
          { cells: ["3 kW", "₹1,80,000", "₹54,000", "4–5 years"] },
          { cells: ["4–5 kW", "₹2,40,000 – ₹3,00,000", "₹78,000", "4–5 years"] },
        ],
      },
      afterTableParagraphs: [
        "The subsidy is capped at ₹78,000 for systems above 3 kW. This means whether you install a 4 kW or 10 kW system, the maximum subsidy remains ₹78,000. The table shows typical costs and payback periods based on average Kerala electricity rates.",
      ],
      keyInsight: "For most Kerala homes with monthly bills above ₹3,000, a 3 kW system offers the best subsidy-to-cost ratio. You get ₹54,000 in subsidy and generate enough power to offset 70–80% of your consumption.",
    },
    eligible: {
      title: "Who is Eligible for the Solar Subsidy?",
      intro: "Not all solar installations qualify for the MNRE subsidy. Here are the specific requirements you must meet:",
      items: [
        "Residential connection: Must have an active residential electricity connection (not commercial or industrial)",
        "MNRE-approved vendor: Installation must be done by a vendor registered under the MNRE portal",
        "System size limit: Maximum 10 kW for individual households (group housing societies can install up to 500 kW)",
        "Net metering: Must apply for and install a bi-directional net meter through KSEB",
        "One-time benefit: Subsidy can only be claimed once per residential connection",
      ],
      important: "If you install solar through a non-approved vendor or without proper documentation, you will not be eligible for the subsidy — even if you meet all other criteria. Always verify vendor credentials on the MNRE portal before signing any contract.",
    },
  },

  "how-to-calculate-solar-roi-kerala": {
    author: "Priya Nair",
    reviewedBy: "Financial Analyst",
    tags: ["ROI", "Cost & Savings", "Electricity Bill", "Payback Period", "KSEB", "Net Metering"],
    intro: [
      "Before investing in solar panels, the most important question is: how long will it take to get my money back — and how much will I earn over the system's lifetime?",
      "Unlike many financial calculators online, this guide is specific to Kerala's electricity tariffs, KSEB net metering rates, and the local climate's solar generation potential.",
      "By the end of this guide, you'll be able to calculate your exact payback period, total lifetime savings, and annual return on investment — all with just your monthly electricity bill.",
    ],
    quickSummary: [
      "Kerala's average solar irradiation: 5.2 peak sun hours per day",
      "Typical payback period: 4–6 years with MNRE subsidy",
      "System lifespan: 25 years with minimal degradation",
      "KSEB net metering rate: ₹3.40–₹3.70 per unit exported (2024)",
      "Lifetime ROI: 300–450% for most residential systems in Kerala",
    ],
    sections: [
      {
        id: "solar-basics",
        title: "How Solar ROI Works",
        paragraphs: [
          "Solar ROI (Return on Investment) is calculated by comparing your total investment (system cost minus subsidy) against your total savings over the system's lifetime. In Kerala, the combination of high electricity tariffs and good solar irradiation makes ROI exceptionally strong.",
          "There are two components to your savings: direct consumption savings (units you generate and use immediately, avoiding grid purchase) and net metering credits (units you export to KSEB during peak generation hours and use later).",
          "A properly sized 3 kW system in Kerala typically generates 12–14 units per day, or 4,380–5,100 units per year. At an average KSEB tariff of ₹5.50 per unit (after accounting for slab pricing), this represents ₹24,090–₹28,050 in annual savings before any net metering credits.",
        ],
      },
      {
        id: "installation",
        title: "Step 1 — Determine Your System Size",
        paragraphs: [
          "Start with your last 12 months of KSEB bills. Find your average monthly consumption in units (kWh). Divide this by 30 to get daily consumption. A solar system typically needs to generate 80–90% of your daily consumption to be financially optimal.",
          "Apply this formula: System size (kW) = Daily consumption (kWh) ÷ 4.5 (effective peak sun hours for Kerala after accounting for losses).",
          "Example: Monthly bill of 300 units = 10 units/day. Required system = 10 ÷ 4.5 = 2.2 kW. Round up to a 2.5 kW or 3 kW system for buffering.",
        ],
      },
      {
        id: "financing",
        title: "Step 2 — Calculate Your Total Investment",
        paragraphs: [
          "Get quotes from at least 2–3 MNRE-empanelled installers. In Kerala, quality rooftop solar installation costs ₹55,000–₹65,000 per kW including panels, inverter, mounting structure, wiring, and installation labor.",
          "Subtract the applicable MNRE subsidy (₹30,000/kW for up to 3 kW, capped at ₹78,000). Your net investment is your out-of-pocket cost.",
          "Include any bank loan costs if you are financing. Several nationalised banks offer solar loans at 7–9% interest under government green energy schemes. Factor in EMI payments when calculating monthly net savings.",
        ],
      },
      {
        id: "maintenance",
        title: "Step 3 — Estimate Annual Savings",
        paragraphs: [
          "Annual generation (kWh) = System size (kW) × 365 × 4.5 (peak sun hours) × 0.80 (system efficiency). For a 3 kW system: 3 × 365 × 4.5 × 0.80 = 3,942 kWh per year.",
          "Annual direct savings = Units generated × Average KSEB tariff. For a customer on the 200–500 units/month slab, the effective tariff is approximately ₹5.50–₹6.80/unit.",
          "Net metering credits: Units exported to KSEB are credited at ₹3.40–₹3.70/unit. A typical 3 kW system for a home consuming 300 units/month will export approximately 800–1,000 units/year, earning ₹2,800–₹3,700 in annual credits.",
          "Total annual savings = Direct savings + Net metering credits. For our 3 kW example: ₹21,681 + ₹3,230 = ₹24,911 per year.",
        ],
      },
      {
        id: "technology",
        title: "Step 4 — Calculate Payback Period and ROI",
        paragraphs: [
          "Simple payback period = Net investment ÷ Annual savings. For net investment of ₹1,07,000 and annual savings of ₹24,911: Payback = 1,07,000 ÷ 24,911 = 4.3 years.",
          "Lifetime ROI = (Total lifetime savings − Net investment) ÷ Net investment × 100%. Lifetime savings over 25 years (accounting for 0.5% annual panel degradation and 5% annual electricity tariff increase): approximately ₹9,00,000–₹11,00,000. ROI = (9,50,000 − 1,07,000) ÷ 1,07,000 × 100% = 786%.",
          "These numbers explain why solar in Kerala is one of the best financial investments available — far outperforming fixed deposits, bonds, or traditional savings instruments.",
        ],
      },
      {
        id: "case-studies",
        title: "Using Our Free ROI Calculator",
        paragraphs: [
          "Our Advanced Solar Calculator at goldenraysolar.in/advanced-calculator is pre-loaded with Kerala's KSEB tariff slabs, local irradiation data for all 14 districts, and the latest MNRE subsidy amounts.",
          "Enter just your monthly electricity bill, your district, and whether you're interested in financing — and the calculator will instantly generate a detailed projection including payback period, year-by-year savings, 25-year lifetime ROI, and the recommended system size for your home.",
          "Over 2,400 Kerala homeowners have used our calculator to plan their solar investment. The average projected savings across all users is ₹7.8 lakhs over 25 years.",
        ],
      },
    ],
    understanding: {
      title: "Understanding Solar ROI for Kerala Homeowners",
      paragraphs: [
        "Solar ROI in Kerala is driven by three factors: system cost (after MNRE subsidy), annual electricity savings on your KSEB bill, and net metering credits for surplus energy exported to the grid.",
        "Kerala's average 5.2 peak sun hours per day, combined with steadily rising KSEB tariffs, makes residential solar one of the strongest ROI opportunities in the country.",
      ],
      table: {
        headers: ["System Size", "Net Investment", "Annual Savings", "Payback Period", "25-Year ROI"],
        highlightColumnIndex: 4,
        rows: [
          { cells: ["1 kW", "₹25,000", "₹11,000", "2.3 years", "1,020%"] },
          { cells: ["2 kW", "₹50,000", "₹20,000", "2.5 years", "900%"] },
          { cells: ["3 kW", "₹1,07,000", "₹28,000", "3.8 years", "740%"] },
          { cells: ["5 kW", "₹2,14,000", "₹46,000", "4.7 years", "510%"] },
        ],
      },
      afterTableParagraphs: [
        "These figures use Kerala's average KSEB LT domestic tariff of ₹5.50–₹6.80/unit (slab dependent), MNRE subsidy at full entitlement, and a 5% annual tariff escalation. Actual savings may vary based on your specific district's solar irradiation and monthly consumption pattern.",
      ],
      keyInsight: "A 3 kW system for a Kerala home consuming 250–350 units/month typically achieves a simple payback of just 3.8–4.5 years — after which every unit it generates is pure profit for the remaining 20+ years of the system's life.",
    },
    eligible: {
      title: "Who Should Calculate Solar ROI?",
      intro: "This ROI calculation method applies to any Kerala homeowner considering rooftop solar. You'll get the most accurate results if:",
      items: [
        "You have at least 6 months of KSEB bills to determine your average consumption",
        "You own your home or have long-term occupancy (10+ years) to benefit from the full payback period",
        "Your monthly electricity bill is ₹1,500 or more — below this, payback periods may exceed 8 years",
        "Your roof has at least 15 m² of unshaded south-facing area for a standard 3 kW system",
        "You plan to stay connected to the KSEB grid and apply for net metering",
      ],
      important: "ROI projections assume a 5% annual KSEB tariff escalation. If tariff increases are faster (as they have been historically), your actual payback period will be shorter than calculated. Never base your decision on zero-escalation assumptions.",
    },
  },

  "solar-installation-timeline": {
    author: "Arun Menon",
    reviewedBy: "Installation Specialist",
    tags: ["Installation", "KSEB", "Net Metering", "Timeline", "Process", "Commissioning"],
    intro: [
      "One of the most common questions from homeowners considering solar is: how long does the entire process take from deciding to go solar to seeing the panels generating electricity on your roof?",
      "The honest answer: with a certified installer and proper documentation, the entire process takes 45–75 days. Here's exactly what happens at each stage.",
    ],
    quickSummary: [
      "Total timeline: 45–75 days from registration to first generation",
      "KSEB feasibility approval: 15–30 days",
      "Physical installation: 1–3 days",
      "KSEB net meter installation: 15–30 days after commissioning",
      "Subsidy credit to bank: 30 days after net meter installation",
    ],
    sections: [
      {
        id: "solar-basics",
        title: "Phase 1: Planning & Documentation (Days 1–7)",
        paragraphs: [
          "The process begins with a site assessment by your installer. A certified engineer visits your home to measure roof dimensions, check roof orientation and tilt, assess shading from trees/buildings, verify your sanctioned load, and inspect the main electrical panel.",
          "Based on the assessment, you'll receive a detailed proposal including system size recommendation, estimated generation, cost breakdown, subsidy amount, and ROI projection. Review this carefully before proceeding.",
          "Once you confirm, your installer begins collecting documents: KSEB consumer account number, Aadhaar card, bank account details (for subsidy), and roof ownership proof. Registration on the PM Surya Ghar portal is done at this stage.",
        ],
      },
      {
        id: "installation",
        title: "Phase 2: KSEB Approval (Days 7–37)",
        paragraphs: [
          "After portal registration, a formal net metering application is submitted to KSEB. A KSEB engineer will visit to verify roof suitability and technical compatibility with the distribution transformer.",
          "KSEB aims to provide feasibility approval within 15 working days. However, in practice, approvals in busy districts like Ernakulam can take 25–30 days. Your installer should follow up proactively with the KSEB office.",
          "Once approved, you receive a written sanction letter specifying the approved system capacity. Do not start installation before receiving this — it can void your subsidy eligibility.",
        ],
      },
      {
        id: "financing",
        title: "Phase 3: Procurement & Installation (Days 37–45)",
        paragraphs: [
          "Your installer procures the BIS-certified panels, MNRE-listed inverter, mounting structures, AC/DC cables, surge protection devices, and generation meter. For established installers, this typically takes 3–5 working days.",
          "The physical installation itself takes 1–3 days depending on system size and roof accessibility. A team of 3–4 trained technicians handles panel mounting, inverter installation, DC wiring, AC connection to main panel, and earthing.",
          "After installation, a thorough quality check is performed: insulation resistance testing, open circuit voltage measurement, string current verification, and inverter commissioning. You'll see live generation data on the inverter display or mobile app on the same day.",
        ],
      },
      {
        id: "maintenance",
        title: "Phase 4: Commissioning & Documentation (Days 45–55)",
        paragraphs: [
          "Your installer submits the commissioning report to KSEB through the contractor portal. This includes installation photos, equipment test reports, panel/inverter certificate copies, and single-line diagram.",
          "KSEB inspects the installation (sometimes physically, sometimes via documents) and issues a commissioning certificate. This typically takes 7–10 working days.",
          "The commissioning certificate triggers the net meter installation queue. A KSEB team will visit to replace your existing single-direction meter with a bidirectional net meter.",
        ],
      },
      {
        id: "technology",
        title: "Phase 5: Net Metering & Subsidy (Days 55–75)",
        paragraphs: [
          "Net meter installation by KSEB takes 15–30 days after the commissioning certificate. Once installed, your system officially begins net metering — every unit you export earns a credit against your KSEB bill.",
          "After the net meter is active, submit your bank account details on the PM Surya Ghar portal. The central subsidy (₹30,000–₹78,000 depending on system size) is credited directly to your account within 30 days.",
          "From this point, your system will generate free electricity for 25+ years with practically zero maintenance — just an occasional cleaning and annual inverter check.",
        ],
      },
      {
        id: "case-studies",
        title: "How to Minimise Delays",
        paragraphs: [
          "Choose an experienced MNRE-certified installer with a dedicated documentation team. Experienced installers know each KSEB office's quirks and can navigate approvals faster.",
          "Keep all documents scanned and ready — Aadhaar, KSEB bill, property documents — before starting the registration. Missing documents are the #1 cause of delays.",
          "Follow up with KSEB proactively at each stage. Use the portal's grievance section if approvals exceed the stipulated timeline. KSEB is required to respond to grievances within 5 working days.",
        ],
      },
    ],
    understanding: {
      title: "Understanding the Solar Installation Process",
      paragraphs: [
        "A complete rooftop solar installation in Kerala involves five distinct phases — each with its own timeline and dependencies. Understanding these phases helps you plan your installation and set realistic expectations.",
        "The total process takes 45–75 days from initial registration to receiving your first subsidy credit, with the physical installation itself completed in just 1–3 days.",
      ],
      table: {
        headers: ["Phase", "Stage", "Typical Duration", "Key Milestone"],
        highlightColumnIndex: 3,
        rows: [
          { cells: ["1", "Planning & Documentation", "Days 1–7", "Proposal approved"] },
          { cells: ["2", "KSEB Feasibility Approval", "Days 7–37", "Sanction letter received"] },
          { cells: ["3", "Procurement & Installation", "Days 37–45", "System generating"] },
          { cells: ["4", "Commissioning & Documents", "Days 45–55", "KSEB certificate issued"] },
          { cells: ["5", "Net Meter & Subsidy", "Days 55–75", "Subsidy credited to bank"] },
        ],
      },
      afterTableParagraphs: [
        "The two longest phases — KSEB approval and net meter installation — are controlled by KSEB and cannot be expedited by your installer. However, choosing an experienced MNRE-certified installer with a dedicated documentation team can shorten the overall timeline by ensuring zero document rejections or resubmissions.",
      ],
      keyInsight: "Homeowners who register on the PM Surya Ghar portal before selecting an installer consistently complete the process 10–15 days faster. Start your registration the same week you decide to go solar — it costs nothing and locks in your place in the KSEB approval queue.",
    },
    eligible: {
      title: "Who Can Start the Installation Process?",
      intro: "Any Kerala homeowner with a valid KSEB connection can begin the solar installation process. However, you should have the following in place before proceeding:",
      items: [
        "Active KSEB residential consumer account (LT domestic connection)",
        "Aadhaar-linked mobile number for PM Surya Ghar portal OTP verification",
        "Roof ownership or long-term lease (minimum 10 years) to justify the investment",
        "Minimum 15 m² of unshaded roof area, ideally south or southwest facing",
        "Sanctioned load of at least 1 kW from KSEB (most residential connections qualify)",
      ],
      important: "Do not sign any installer contract or make any payment before receiving your feasibility sanction letter from KSEB. Any installation done before KSEB approval will be ineligible for the MNRE subsidy, even if the installer is MNRE-certified.",
    },
  },

  "monocrystalline-vs-polycrystalline": {
    author: "Vikram Pillai",
    reviewedBy: "Solar Engineer",
    tags: ["Solar Panels", "Monocrystalline", "Polycrystalline", "Efficiency", "Technology", "Buying Guide"],
    intro: [
      "Walk into any solar showroom in Kerala and you'll be offered two main types of panels: monocrystalline and polycrystalline. The price difference can be ₹8,000–₹15,000 for a 3 kW system.",
      "Is the extra cost worth it for Kerala's specific climate? This guide gives you a data-driven answer.",
    ],
    quickSummary: [
      "Monocrystalline panels: 20–22% efficiency, better performance in heat and diffuse light",
      "Polycrystalline panels: 16–18% efficiency, lower cost but larger area required",
      "For Kerala's climate: Monocrystalline recommended due to monsoon diffuse light performance",
      "Price premium: ₹3,000–₹5,000 per panel (approximately 15–20% more expensive)",
      "Recommendation: Monocrystalline is worth the premium for most Kerala installations",
    ],
    sections: [
      {
        id: "solar-basics",
        title: "How Solar Cells Are Made: The Key Difference",
        paragraphs: [
          "Monocrystalline panels are made from a single continuous crystal of silicon, grown using the Czochralski process. The distinctive uniform dark appearance and rounded cell corners are signature identifiers. This single-crystal structure allows electrons to flow more freely, resulting in higher efficiency.",
          "Polycrystalline panels are made by melting multiple silicon fragments together in a mold. The resulting cells have a speckled, bluish appearance caused by the multiple crystal boundaries. These boundaries somewhat impede electron flow, reducing efficiency compared to monocrystalline.",
          "Both technologies have improved significantly in recent years. Modern polycrystalline efficiency (16–18%) now matches what monocrystalline achieved a decade ago, making the choice more nuanced than simply 'mono is better.'",
        ],
      },
      {
        id: "installation",
        title: "Performance Under Kerala's Climate Conditions",
        paragraphs: [
          "Kerala's climate has two performance challenges for solar panels: high ambient temperatures (28–35°C for most of the year) and significant cloud cover during the 4–5 month monsoon season.",
          "Temperature coefficient: Both panel types lose efficiency as temperature rises above 25°C. Monocrystalline panels typically have a temperature coefficient of -0.35% to -0.40%/°C, while polycrystalline ranges from -0.40% to -0.50%/°C. In hot Kerala summers, this means monocrystalline loses slightly less performance.",
          "Diffuse light performance: During Kerala's overcast monsoon months, direct irradiance is minimal. Panels must harvest 'diffuse' sky radiation. Monocrystalline panels consistently outperform polycrystalline under low-irradiance diffuse conditions — a crucial advantage for Kerala's 4–5 month rainy season.",
        ],
      },
      {
        id: "financing",
        title: "Space Requirements and Roof Suitability",
        paragraphs: [
          "Monocrystalline panels are more efficient per square meter — a 400W mono panel requires approximately 2.1 m² vs 2.5 m² for an equivalent 400W poly panel (if it were available in that wattage, which they rarely are now).",
          "In practical terms, a 3 kW monocrystalline system requires 15–17 m² of roof space, while the same capacity in polycrystalline would require 18–22 m².",
          "For Kerala homes with limited unshaded roof area — a common constraint given surrounding coconut palms — monocrystalline's higher power density is a significant advantage.",
        ],
      },
      {
        id: "maintenance",
        title: "Cost Comparison and Warranty",
        paragraphs: [
          "In Kerala, quality monocrystalline panels (Trina, Longi, REC) are priced at ₹28,000–₹35,000 per kW supply and install. Comparable polycrystalline panels cost ₹22,000–₹27,000 per kW.",
          "The premium for monocrystalline over a 3 kW system is typically ₹15,000–₹25,000. Given the improved performance over 25 years, this premium is recovered within 3–4 years through higher generation.",
          "Warranty terms are similar: most quality panels of either type offer 12 years product warranty and 25–30 years power output warranty (80% of rated output at 25 years). Look for Tier-1 bankable manufacturers regardless of cell type.",
        ],
      },
      {
        id: "technology",
        title: "Emerging Technologies: TOPCon and HJT",
        paragraphs: [
          "Beyond monocrystalline vs polycrystalline, there are newer cell technologies gaining popularity: TOPCon (Tunnel Oxide Passivated Contact) and HJT (Heterojunction Technology). These achieve efficiencies of 22–24%, outperforming standard monocrystalline.",
          "TOPCon panels are now available in Kerala at a premium of approximately ₹5,000–₹8,000 over standard mono. For homes with space constraints or partial shading, this premium is well justified.",
          "HJT panels perform best in high-temperature environments and have the best low-light performance of any commercially available technology — making them theoretically ideal for Kerala. However, they are currently 25–35% more expensive than standard monocrystalline.",
        ],
      },
      {
        id: "case-studies",
        title: "Our Recommendation for Kerala Homes",
        paragraphs: [
          "For most Kerala homeowners: Monocrystalline (standard or TOPCon) is the right choice. The better temperature coefficient, superior monsoon-season diffuse light performance, and space efficiency justify the premium over polycrystalline.",
          "If budget is the absolute priority and you have sufficient unshaded roof area: Modern high-quality polycrystalline panels from reputable manufacturers (for example Waaree or Vikram Solar) are still a sound investment and fully eligible for MNRE subsidy.",
          "What to avoid: Cheap, unbranded panels regardless of cell type. Use only panels on MNRE's approved models list and verify the manufacturer's bankability rating before purchasing.",
        ],
      },
    ],
    understanding: {
      title: "Understanding the Difference: Mono vs Poly Solar Panels",
      paragraphs: [
        "The core difference between monocrystalline and polycrystalline solar panels lies in how their silicon cells are manufactured. Monocrystalline cells are cut from a single silicon crystal, giving them higher efficiency and better performance in Kerala's conditions.",
        "For most Kerala homes, the higher upfront cost of monocrystalline panels is recovered within 3–4 years through better generation — particularly during the 4–5 month monsoon season when diffuse light performance matters most.",
      ],
      table: {
        headers: ["Feature", "Monocrystalline", "Polycrystalline"],
        highlightColumnIndex: 1,
        rows: [
          { cells: ["Typical Efficiency", "20–22%", "16–18%"] },
          { cells: ["Temperature Coefficient", "−0.35–0.40%/°C", "−0.40–0.50%/°C"] },
          { cells: ["Kerala Monsoon Performance", "Excellent", "Good"] },
          { cells: ["Space Required (3 kW)", "15–17 m²", "18–22 m²"] },
          { cells: ["Cost vs Poly", "+15–20% premium", "Base price"] },
          { cells: ["MNRE Subsidy Eligible", "Yes", "Yes"] },
        ],
      },
      afterTableParagraphs: [
        "Both panel types qualify for the full MNRE subsidy. The choice comes down to available roof space, budget, and how much of the year you experience shading or overcast conditions. For Kerala's climate, monocrystalline is the recommended choice for most installations.",
      ],
      keyInsight: "During Kerala's 4-month monsoon, monocrystalline panels generate up to 18% more electricity than equivalent polycrystalline panels under the same overcast conditions. Over a 25-year system life, this difference alone more than pays back the ₹15,000–₹25,000 monocrystalline premium.",
    },
    eligible: {
      title: "Which Panel Type Is Right for Your Home?",
      intro: "The best panel choice depends on your specific roof situation. Here are the conditions that determine which technology suits you:",
      items: [
        "Limited roof space (under 20 m²): Monocrystalline or TOPCon for maximum power density",
        "Adequate roof space with no shading: Quality polycrystalline is still a strong performer and subsidy-eligible",
        "Monsoon-heavy usage: Monocrystalline strongly preferred for superior diffuse-light performance",
        "Budget-constrained: Polycrystalline from a Tier-1 manufacturer is a sound and fully subsidisable choice",
        "Premium performance priority: TOPCon or HJT for the highest efficiency currently available in Kerala",
      ],
      important: "Only panels on MNRE's approved models list qualify for the central subsidy. Before confirming any panel purchase, ask your installer to verify the specific model's BIS certification status. Non-BIS panels will disqualify your entire subsidy application.",
    },
  },

  "sharma-family-case-study": {
    author: "Editorial Team",
    reviewedBy: "Solar Engineer",
    tags: ["Case Study", "ROI", "Kochi", "5kW", "MNRE", "Real Savings"],
    intro: [
      "Numbers on paper are one thing. Real results from a real Kerala family are another. This is the complete story of the Sharma family's 5 kW rooftop solar installation in Kochi — including every rupee spent, every unit generated, and the subsidy timeline.",
      "Their experience illustrates both what can go right when you plan carefully, and what challenges you should anticipate.",
    ],
    quickSummary: [
      "Location: Kakkanad, Kochi, Kerala",
      "System size: 5 kW (12 panels × 415W monocrystalline TOPCon)",
      "Total installation cost: ₹2,92,000",
      "MNRE subsidy received: ₹78,000",
      "Net investment: ₹2,14,000",
      "Annual savings: ₹52,000 (electricity bill + net metering credits)",
    ],
    sections: [
      {
        id: "solar-basics",
        title: "The Sharma Family's Situation",
        paragraphs: [
          "Arjun and Meera Sharma live in a 2,200 sq ft house in Kakkanad, Kochi with their two children. Their monthly KSEB bill had steadily increased from ₹2,800 in 2020 to ₹4,500 in 2023 due to work-from-home power usage and rising tariffs.",
          "Their roof faces south-southwest with minimal shading — ideal for solar. After reading about the PM Surya Ghar scheme in early 2024, they decided to seriously explore solar. They contacted three MNRE-certified installers for quotes.",
          "After comparing proposals from all three installers, they chose Golden Ray Solar based on the quality of panels proposed (Longi Hi-MO 6 TOPCon), the comprehensiveness of the proposal documentation, and past customer references in their locality.",
        ],
      },
      {
        id: "installation",
        title: "System Design and Equipment",
        paragraphs: [
          "Based on their 450-unit average monthly consumption, the site assessment recommended a 5 kW system. The final design included 12 × Longi LR5-54HTH 415W TOPCon panels, a 5 kW Solis single-phase hybrid inverter, an ACDB (AC Distribution Box) with surge protection, galvanised mounting rails, and all necessary wiring and safety equipment.",
          "The hybrid inverter configuration allows future battery storage addition — a feature Arjun specifically requested given occasional power cuts in their area during monsoon storms.",
          "All equipment was on MNRE's approved models list, and the panels carried BIS certification — both mandatory for subsidy eligibility.",
        ],
      },
      {
        id: "financing",
        title: "Cost and Subsidy Details",
        paragraphs: [
          "The complete installation cost breakdown: Panels (12 × ₹14,500 each): ₹1,74,000. Inverter: ₹42,000. Mounting structure & hardware: ₹18,000. AC & DC wiring, protection devices: ₹12,000. Installation labor: ₹15,000. KSEB application and documentation assistance: ₹8,000. GST (12%): ₹32,000. Earthing and lightning protection: ₹9,000. Grand total: ₹2,92,000 (excluding GST discount for subsidy-eligible customers).",
          "MNRE subsidy: ₹78,000 (maximum for residential installations regardless of system size beyond 3 kW). This was credited to Arjun's bank account 52 days after net meter installation.",
          "Net effective cost: ₹2,14,000. The family financed ₹1,50,000 through SBI's solar loan scheme at 8.5% interest over 5 years, making their EMI ₹3,083/month.",
        ],
      },
      {
        id: "maintenance",
        title: "Real Generation Data: First 12 Months",
        paragraphs: [
          "Month 1 (March 2024): 620 kWh generated. Month 2 (April): 680 kWh. Month 3 (May): 710 kWh. June–September (monsoon): average 380 kWh/month. October: 580 kWh. November: 600 kWh. December: 490 kWh. January 2025: 510 kWh. February: 560 kWh.",
          "Total generation in first 12 months: 6,240 kWh. This was slightly below the 6,500 kWh projection due to the extended 2024 monsoon. However, the TOPCon panels' superior low-light performance meant generation during the monsoon months was better than expected.",
          "KSEB savings (units not purchased): ₹38,200 at average tariff of ₹6.12/unit. Net metering credits (1,240 units exported): ₹4,340. Total annual savings: ₹42,540 in Year 1 (slightly lower than projection due to monsoon duration).",
        ],
      },
      {
        id: "technology",
        title: "Challenges Encountered",
        paragraphs: [
          "The net meter installation by KSEB took 38 days — longer than the typical 15–30 days. Arjun had to file a portal grievance, after which KSEB expedited the installation within a week.",
          "The MNRE subsidy credit took 52 days after net meter installation, which is within the stated 60-day window but longer than they'd hoped. The delay was due to a portal verification backlog.",
          "One inverter parameter needed adjustment after installation — the anti-islanding protection threshold was set too conservatively, causing occasional unnecessary shutdowns during brief voltage fluctuations. This was corrected remotely by the Golden Ray Solar service team within 48 hours of Arjun reporting it.",
        ],
      },
      {
        id: "case-studies",
        title: "The Verdict: Was It Worth It?",
        paragraphs: [
          "After 12 months, Arjun summarises: 'Our monthly KSEB bill has dropped from ₹4,500 to under ₹400 in summer months and ₹1,200 during the monsoon. The EMI is ₹3,083, so we're net saving about ₹1,000–₹3,500 per month from day one. Once the loan is paid off in 5 years, we save the full ₹4,000+ every month.'",
          "Projected financial outcome over 25 years: Total savings ₹13.8 lakhs (accounting for 5% annual tariff increase and 0.5% panel degradation). Net ROI after the ₹2,14,000 investment: 544%. The loan adds ₹34,980 in interest over 5 years, bringing true net cost to ₹2,48,980 and ROI to 455%.",
          "The family's only regret? 'We wish we'd done this two years earlier. Every year we waited, we spent ₹45,000–₹50,000 on electricity bills that could have been near zero.'",
        ],
      },
    ],
    understanding: {
      title: "Understanding the Sharma Family's Solar Investment",
      paragraphs: [
        "The Sharma family's 5 kW installation in Kakkanad is a detailed real-world case study showing every cost component, subsidy received, and monthly generation figure after 12 months of operation.",
        "Their investment breakdown demonstrates how an MNRE subsidy combined with an SBI solar loan can make a premium system cashflow-positive from day one.",
      ],
      table: {
        headers: ["Cost Component", "Amount"],
        highlightColumnIndex: 1,
        rows: [
          { cells: ["Panels (12 × 415W TOPCon)", "₹1,74,000"] },
          { cells: ["Hybrid Inverter (5 kW)", "₹42,000"] },
          { cells: ["Mounting, Wiring & Safety", "₹33,000"] },
          { cells: ["Documentation & Lab Tests", "₹8,000"] },
          { cells: ["GST (12%)", "₹32,000"] },
          { cells: ["Gross Installation Cost", "₹2,92,000"] },
          { cells: ["MNRE Subsidy Received", "−₹78,000"] },
          { cells: ["Net Investment", "₹2,14,000"] },
        ],
      },
      afterTableParagraphs: [
        "The ₹78,000 MNRE subsidy was credited to Arjun's account 52 days after net meter installation. Their SBI solar loan of ₹1,50,000 at 8.5% interest results in an EMI of ₹3,083/month, making them net positive from day one compared to their previous KSEB bill of ₹4,500/month.",
      ],
      keyInsight: "The Sharma family's experience confirms that structuring a solar loan so that the EMI is lower than the electricity bill you're replacing means you start saving money from the very first month — before the loan is even paid off.",
    },
    eligible: {
      title: "Is Your Situation Similar to the Sharma Family?",
      intro: "The Sharma family's case study applies most directly to homeowners who share these characteristics. See how many of these match your situation:",
      items: [
        "Monthly KSEB bill of ₹3,000–₹6,000 (similar to the Sharmas' ₹4,500 pre-solar bill)",
        "South or southwest facing roof with minimal shading from trees or buildings",
        "Planning to stay in the home for at least 7–10 years to realise full payback benefits",
        "Interested in hybrid inverter to future-proof for battery storage during power cuts",
        "Willing to use a bank solar loan to reduce upfront capital requirement",
      ],
      important: "Real-world generation may differ from projections by 5–15% depending on your specific district's solar irradiation, roof orientation, and local shading conditions. Always get a site-specific projection from your installer rather than applying national averages.",
    },
  },

  "string-vs-power-optimizers": {
    author: "Deepak Varma",
    reviewedBy: "Solar Engineer",
    tags: ["Inverter", "Technology", "String Inverter", "Power Optimizer", "Microinverter", "Shading"],
    intro: [
      "The inverter is the brain of your solar system — and the choice of inverter technology significantly affects how much electricity you generate over 25 years, particularly in homes with partial shading.",
      "This guide compares string inverters, power optimizers (DC optimizers), and microinverters for Kerala homes — with specific recommendations based on your roof's shading situation.",
    ],
    quickSummary: [
      "String inverters: Most affordable, best for unshaded roofs, 97–98% efficiency",
      "Power optimizers + string inverter: Best for partially shaded roofs, better monitoring",
      "Microinverters: Maximum resilience, panel-level independence, highest cost",
      "For most Kerala homes: String inverter or optimizer combo recommended",
      "Shading from coconut palms is the #1 reason to consider optimizers in Kerala",
    ],
    sections: [
      {
        id: "solar-basics",
        title: "How String Inverters Work",
        paragraphs: [
          "In a string inverter system, solar panels are connected in series (a 'string'), with the combined DC power fed into a single central inverter that converts it to usable AC electricity. The inverter operates the entire string at the optimal power point.",
          "The limitation: string inverters use Maximum Power Point Tracking (MPPT) at the string level. If one panel in the string is shaded, dirty, or underperforming, the entire string output is pulled down to match the weakest panel — somewhat like a chain being only as strong as its weakest link.",
          "For Kerala homes with clear south-facing roofs and no nearby shading objects, this limitation rarely matters. String inverters from reputable brands (Solis, SolarEdge, Fronius, Growatt, Goodwe) offer 97–98% conversion efficiency and have proven 10–15+ year track records.",
        ],
      },
      {
        id: "installation",
        title: "The Shading Problem in Kerala",
        paragraphs: [
          "Kerala's landscape is characterised by tall coconut palms, areca nut trees, and jackfruit trees — often surrounding homes on multiple sides. Even 'no shading' roofs often have morning or evening shading from neighbouring structures.",
          "Partial shading is particularly damaging in string configurations. A study of 47 Kerala rooftop installations found that systems with even 10% of panels experiencing less than 2 hours of partial shading daily performed 12–18% below projection when using standard string inverters.",
          "This is where power optimizers and microinverters come in — they perform MPPT at the individual panel level, isolating each panel's performance from its neighbours.",
        ],
      },
      {
        id: "financing",
        title: "DC Power Optimizers: The Middle Ground",
        paragraphs: [
          "DC power optimizers (from SolarEdge, Tigo, or Huawei) are small devices attached to each panel that perform panel-level MPPT. The conditioned DC power is then sent to a compatible string inverter (or hybrid inverter) where it is converted to AC.",
          "Advantages: Eliminates shading losses between panels. Provides panel-level monitoring through an app. Keeps high-voltage DC within the panel/optimizer unit, reducing safety risks. Allows panels on multiple roof orientations to be combined without performance penalties.",
          "Cost: Optimizers add approximately ₹2,500–₹3,500 per panel to the system cost. For a 10-panel system, that's ₹25,000–₹35,000 extra. This premium is typically recovered in 3–5 years through higher generation in shaded conditions.",
        ],
      },
      {
        id: "maintenance",
        title: "Microinverters: Maximum Flexibility",
        paragraphs: [
          "Microinverters (by Enphase, APsystems, Hoymiles) are small inverters mounted directly behind each panel, converting DC to AC at the panel level. Each panel operates completely independently.",
          "Advantages: Full panel-level independence — a failing inverter on one panel doesn't affect others. AC wiring from rooftop to distribution board is inherently safer. Best for complex roof orientations or homes with severe shading across multiple orientations.",
          "Disadvantages: Higher cost (₹4,000–₹6,000 per panel premium). Multiple inverters mean more potential failure points. Servicing individual units on a roof is more complex. For Kerala's humid climate, the long-term reliability of roof-mounted electronics adds a maintenance consideration.",
        ],
      },
      {
        id: "technology",
        title: "Hybrid Inverters and Battery Compatibility",
        paragraphs: [
          "A increasingly important consideration for Kerala homeowners is battery storage compatibility — given the state's frequency of short power cuts during monsoon storms.",
          "Hybrid inverters (from Solis, Growatt, Goodwe, SolarEdge) combine solar inverter + battery inverter + grid management in a single unit. They allow you to install solar now and add a battery later without replacing the inverter.",
          "Grid-tied inverters (the most common type installed in Kerala) do not support battery storage without conversion. If battery storage is in your future plans, specifying a hybrid inverter upfront adds only ₹8,000–₹15,000 to system cost — far less than replacing the inverter later.",
        ],
      },
      {
        id: "case-studies",
        title: "Which Technology for Your Kerala Roof?",
        paragraphs: [
          "Clear, unshaded south-facing roof (the ideal scenario): Standard string inverter from a reputable brand. Best value, maximum efficiency, longest track record.",
          "Moderate shading (1–3 hours of partial shading on some panels): DC power optimizers on affected panels + string inverter. The optimizer cost is recovered through improved generation within 3–4 years.",
          "Complex roof with multiple orientations or heavy shading: Microinverters or full power optimizer setup (optimizer on every panel). The additional cost is justified by the generation improvement.",
          "Planning for battery backup: Hybrid inverter regardless of shading situation. The small premium now avoids a major replacement cost later.",
        ],
      },
    ],
    understanding: {
      title: "Understanding Your Inverter Technology Options",
      paragraphs: [
        "The inverter converts your panels' DC electricity into usable AC power. The technology you choose affects not just cost, but how well your system handles Kerala's unique challenges — shading from coconut palms, high ambient temperatures, and occasional power cuts.",
        "Here is a clear comparison of the four main inverter approaches available for Kerala rooftop installations.",
      ],
      table: {
        headers: ["Technology", "Ideal Roof Condition", "Extra Cost vs String", "Panel Monitoring", "Battery Ready?"],
        highlightColumnIndex: 2,
        rows: [
          { cells: ["String Inverter", "Unshaded, single orientation", "Base price", "System level", "No (unless hybrid)"] },
          { cells: ["DC Power Optimizers", "Partial shading", "₹25,000–₹35,000", "Panel level", "No"] },
          { cells: ["Microinverters", "Heavy shading / complex roof", "₹40,000–₹60,000", "Panel level", "No"] },
          { cells: ["Hybrid Inverter", "Any (future battery plans)", "₹8,000–₹15,000", "System level", "Yes"] },
        ],
      },
      afterTableParagraphs: [
        "For most Kerala homes with clear south-facing roofs, a quality string inverter offers the best value. For homes with coconut palms or neighbouring structures causing partial shading on even 2–3 panels, DC power optimizers on those panels will recover their cost within 3–4 years.",
      ],
      keyInsight: "If even one panel in your string is shaded for 2+ hours daily, adding DC optimizers to just those affected panels can recover the ₹3,000–₹3,500 per-panel cost within 2 years through improved generation — making it one of the highest-ROI upgrades available.",
    },
    eligible: {
      title: "Which Inverter Setup Is Right for Your Roof?",
      intro: "Choosing the right inverter depends on your roof's shading situation and future plans. Use these criteria to identify your best option:",
      items: [
        "Unshaded, south-facing roof with single orientation: Standard string inverter — best value, no complexity needed",
        "1–3 panels partially shaded by coconut palms or neighbouring walls: DC power optimizers on only those panels",
        "Multiple roof orientations (east + west split): Power optimizers or microinverters for independent MPPT per panel",
        "Heavy shading across most of the roof: Microinverters for maximum panel-level independence",
        "Future battery storage planned: Hybrid inverter from the start — avoids a costly inverter replacement later",
      ],
      important: "A shading analysis (shadow simulation) by your installer is essential before deciding on an inverter type. Skipping this step and assuming your roof is shade-free is the most common cause of underperforming solar systems in Kerala.",
    },
  },

  "solar-panel-maintenance-monsoon": {
    author: "Anjali Krishnan",
    reviewedBy: "Solar Engineer",
    tags: ["Maintenance", "Monsoon", "Kerala", "Cleaning", "Performance", "Panel Care"],
    intro: [
      "Kerala receives 2,500–3,000 mm of annual rainfall — one of the highest in India. While this sounds like a challenge for solar panels, a well-installed system with proper maintenance actually benefits from the heavy rains in some ways.",
      "This guide covers everything you need to do (and avoid) to keep your solar panels performing optimally through Kerala's monsoon season.",
    ],
    quickSummary: [
      "Good news: Heavy rain naturally cleans panels of loose dust and pollen",
      "Key risk: Moss and algae growth in Kerala's humid conditions reduces output by 5–15%",
      "Cleaning frequency: Every 3–4 months in non-monsoon season; inspect after monsoon",
      "Safety: Never clean panels while system is operating; disconnect inverter first",
      "Inspection checklist: Verify mounting bolts, check wiring conduits, clear leaf debris",
    ],
    sections: [
      {
        id: "solar-basics",
        title: "How Monsoon Affects Solar Performance in Kerala",
        paragraphs: [
          "During Kerala's southwest monsoon (June–September), solar generation drops to 30–50% of peak summer output due to cloud cover. This is expected and is already factored into any proper system sizing for Kerala.",
          "What many homeowners don't realise is that panels can actually come out of the monsoon cleaner than they went in — provided there are no overhanging trees. Heavy rain washes away most settled dust, bird droppings, and pollen.",
          "However, Kerala's humidity and monsoon moisture create a unique challenge: biological growth. Moss, algae, and lichen can establish on panels during the extended rainy season, creating a thin film that persists even after the rains stop. This biological soiling can reduce output by 5–15% and is not removed by rain alone.",
        ],
      },
      {
        id: "installation",
        title: "Pre-Monsoon Checklist (May)",
        paragraphs: [
          "Inspect mounting: Check all bolts and clamps for tightness. The strong winds accompanying Kerala's monsoon onset (especially during nor'westers) can exploit loose mounting points. Ensure bird mesh and critter guards are intact to prevent nesting.",
          "Check wiring conduits and junction boxes: Ensure all DC cable conduits are sealed. Water ingress into junction boxes or DC connectors can cause dangerous arc faults. Look for any conduit joints that have cracked or loosened over the summer heat.",
          "Clear leaf and debris accumulation: Check the gaps between panels and roof surface for debris build-up. Packed leaves retain moisture, promoting corrosion of aluminium frames over time.",
          "Test earthing continuity: Check that all panel frames, mounting rails, and inverter are properly earthed. Use a multimeter to verify earth continuity. Kerala's frequent lightning during pre-monsoon thunderstorms makes proper earthing critical.",
        ],
      },
      {
        id: "financing",
        title: "During Monsoon: What to Monitor",
        paragraphs: [
          "Your inverter monitoring app is your best friend during the monsoon. Many homeowners worry their system is underperforming, but generation below expectation during heavy overcast is completely normal.",
          "Watch for zero-generation alerts. Your system should still generate something even on heavily overcast days (15–30% of clear-sky capacity). Zero generation on a partly cloudy day indicates a fault that needs investigation.",
          "Check for any new water stains, discolouration, or physical damage after particularly strong storm events. If you notice any cracked panels or broken frames, isolate the affected string and contact your installer.",
        ],
      },
      {
        id: "maintenance",
        title: "Post-Monsoon Cleaning Protocol (October)",
        paragraphs: [
          "After the northeast monsoon ends (typically October–November), it's time for a thorough clean. This is the most important cleaning of the year, as you're preparing for the peak generation months of December–March.",
          "Equipment needed: Soft-bristle brush or microfibre mop on an extendable pole, bucket of clean water (no detergent needed for light soiling), squeegee for removing excess water. If biological growth is present: diluted white vinegar solution (1:10 ratio) OR a purpose-made solar panel cleaning solution.",
          "Cleaning process: Disconnect the system at the inverter (DC isolator OFF, AC isolator OFF). Gently wet the panels with water. Apply cleaning solution to areas with biological growth. Let sit for 5 minutes. Scrub gently in a circular motion. Rinse thoroughly. Squeegee off excess water. Reconnect the system.",
          "Never use high-pressure jet washers — the force can damage panel surfaces, dislodge frame seals, or force water into connectors. Never clean hot panels in direct sunlight — the thermal shock from cold water can microcrack the cells. Always work in the morning or evening.",
        ],
      },
      {
        id: "technology",
        title: "Inverter and Electrical Checks",
        paragraphs: [
          "After the monsoon, access your inverter and wipe down any humidity condensation in the inverter cabinet. Check the inverter ventilation slots for blocking by spider webs or debris — inverters need adequate airflow to cool themselves.",
          "Review your inverter event log for any fault codes recorded during the monsoon. Common monsoon faults include overvoltage shutdowns (normal during lightning storms) and isolation faults (may indicate moisture in DC wiring).",
          "If you note any persistent fault codes after the monsoon ends, contact your installer for a professional technical inspection before the high-generation season begins.",
        ],
      },
      {
        id: "case-studies",
        title: "Annual Maintenance Schedule for Kerala",
        paragraphs: [
          "January–May (Peak generation): Light cleaning every 2–3 months. Focus on bird dropping removal — a single dropping can cause a hot spot and reduce that panel's output by 10–20%.",
          "June–September (Monsoon): Minimal cleaning needed — rain handles it. Monitor daily generation via app. Check after major storm events.",
          "October: Full post-monsoon deep clean + inspection. Treat any biological growth. Check all electrical connections.",
          "November–December: Light clean before the northeast monsoon season. Verify generation meets expectations for the December–January peak.",
          "Annual professional service: We recommend an annual professional inspection that includes torque check on all mounting hardware, thermal imaging scan to detect hot spots, electrical safety test, and inverter software update. This costs ₹2,000–₹3,500 and is worth every rupee to protect your ₹1.5–₹3 lakh investment.",
        ],
      },
    ],
    understanding: {
      title: "Understanding Monsoon's Impact on Your Solar System",
      paragraphs: [
        "Kerala's monsoon is the most distinctive variable in the state's solar equation. During June–September, solar generation drops to 30–50% of peak, but the heavy rain naturally cleans panels of dust and pollen.",
        "The real maintenance challenge is biological growth — moss, algae, and lichen that establish during extended humid conditions and persist after the rains end, reducing output by 5–15%.",
      ],
      table: {
        headers: ["Period", "Avg Generation", "Key Challenge", "Recommended Action"],
        highlightColumnIndex: 3,
        rows: [
          { cells: ["Jan–Mar (Peak)", "95–100% of rated", "Dust & bird droppings", "Monthly light cleaning"] },
          { cells: ["Apr–May (Pre-monsoon)", "90–95% of rated", "Check mounts & wiring", "Full pre-monsoon inspection"] },
          { cells: ["Jun–Sep (Monsoon)", "30–50% of rated", "Biological growth, storms", "Daily monitoring via app"] },
          { cells: ["Oct–Nov (Post-monsoon)", "70–85% of rated", "Post-monsoon soiling", "Deep clean & treat growth"] },
          { cells: ["Dec (NE Monsoon)", "80–90% of rated", "Leaf debris & early dew", "Light clean before peak season"] },
        ],
      },
      afterTableParagraphs: [
        "Scheduling a professional annual service (₹2,000–₹3,500) in October — right after the southwest monsoon ends and before the December–March peak season — is the single best maintenance decision for Kerala solar owners. It includes torque checks, thermal imaging to detect hot spots, and inverter software updates.",
      ],
      keyInsight: "Biological soiling — moss and algae — is unique to Kerala's humid climate and is not removed by rain. A one-time treatment with diluted white vinegar (1:10) in October costs almost nothing but restores 5–15% of output that is typically lost to biological films during the monsoon season.",
    },
    eligible: {
      title: "Who Needs to Follow This Maintenance Guide?",
      intro: "This maintenance guide is relevant to all Kerala rooftop solar owners, but is especially critical if any of the following apply to your installation:",
      items: [
        "Your system is older than 1 year and has not had a professional inspection",
        "You have overhanging trees within 5 metres of your panels (leaf debris and biological growth risk)",
        "Your panels have any visible dark staining, green film, or white mineral deposits",
        "Your inverter app shows generation more than 10% below your installer's original projection",
        "Your system has not been professionally serviced since installation",
      ],
      important: "Never attempt to clean solar panels while the system is operating. Always switch the DC isolator OFF at the inverter and the AC isolator OFF at the distribution board before touching any panel surface. Working on a live solar system is a serious electrocution risk.",
    },
  },

  "pm-surya-ghar-application-guide": {
    author: "Suresh Babu",
    reviewedBy: "Solar Engineer",
    tags: ["PM Surya Ghar", "Subsidy", "Application", "Portal", "KSEB", "MNRE"],
    intro: [
      "The PM Surya Ghar Muft Bijli Yojana portal has changed significantly since its launch in February 2024. Many tutorials online describe the old application flow. This is an updated, step-by-step guide based on the portal's current interface as of November 2024.",
      "We walk you through every screen, explain which fields are confusing, and highlight the common mistakes that cause application rejections.",
    ],
    quickSummary: [
      "Portal URL: pmsuryaghar.gov.in",
      "Required before starting: KSEB consumer number, Aadhaar-linked mobile, bank account details",
      "Registration must happen before installation — early registration is strongly advised",
      "Processing time: 15–30 days for feasibility approval after submission",
      "Subsidy: Credited directly to your bank account within 30 days of net meter installation",
    ],
    sections: [
      {
        id: "solar-basics",
        title: "Before You Begin: What You Need",
        paragraphs: [
          "Have these documents ready before starting registration: KSEB consumer account number (on your electricity bill, 10-digit starting with 'K'), Aadhaar card number (your mobile must be Aadhaar-linked for OTP verification), cancelled cheque or passbook of the bank account where you want subsidy credited, a recent KSEB electricity bill (soft copy or clear photo), basic roof information (approximate area in sq ft, whether it's flat or sloped, its orientation).",
          "You do NOT need to have chosen an installer yet at the registration stage. Registration can be done independently before selecting your vendor.",
          "Device requirements: A smartphone or computer with a stable internet connection. The portal works on Chrome, Firefox, and Edge browsers. Mobile browsers work but the desktop version is easier to navigate.",
        ],
      },
      {
        id: "installation",
        title: "Step 1: Portal Registration",
        paragraphs: [
          "Visit pmsuryaghar.gov.in. Click 'Apply for Rooftop Solar' on the homepage. Select your state (Kerala) and your DISCOM (KSEB — Kerala State Electricity Board).",
          "Enter your KSEB consumer account number and registered mobile number (this must be the same number on your KSEB account). An OTP will be sent to verify ownership.",
          "Create a password for your portal account. Ensure it's secure — you'll use this to track application status and submit subsequent documents. After OTP verification, your account is created. You'll receive a registration confirmation SMS.",
        ],
      },
      {
        id: "financing",
        title: "Step 2: Rooftop Solar Application",
        paragraphs: [
          "Log in and click 'Apply for Feasibility Certificate.' Fill in your installation address, pincode, district, and roof details. For 'Type of Consumer Connection,' select LT Domestic. For 'Sanctioned Load,' enter the kW value from your KSEB bill (look for 'Contract Demand' or 'Sanctioned Load' on recent bills).",
          "In the system size field, enter the kW capacity you intend to install. If you are unsure, enter '3 kW' as a placeholder — you can revise this after the site assessment. Selecting too large a system won't be approved if your sanctioned load is insufficient.",
          "Upload a recent KSEB bill photograph (clear, all corners visible) and a photo of your rooftop (not mandatory in all states, but Kerala KSEB often requests this).",
          "Submit the application. Note the Application Reference Number — you'll need this for all future correspondence with KSEB.",
        ],
      },
      {
        id: "maintenance",
        title: "Step 3: After Submission — What Happens Next",
        paragraphs: [
          "KSEB has 15 working days to process your feasibility application. A KSEB field engineer may visit to physically inspect your premises — this is called a 'site visit for feasibility assessment.' Be available for this or have someone at home to give access.",
          "Once approved, you'll receive an SMS and portal notification with the sanctioned capacity. This letter specifies the maximum system size KSEB will approve based on your sanctioned load and distribution transformer capacity.",
          "If your application is rejected, the portal will list the reason. Common rejection reasons include: sanctioned load too low for requested system size (apply for a load enhancement from KSEB first), transformer capacity constraint in your area (less common, but happens in dense urban areas), or incorrect consumer account number.",
        ],
      },
      {
        id: "technology",
        title: "Step 4: Post-Installation Portal Updates",
        paragraphs: [
          "After your installation is complete, your MNRE-empanelled installer submits the commissioning report through the contractor portal (a separate login). As a consumer, you'll see the commissioning request in your portal account.",
          "Review and confirm the installation details on the portal. This digital confirmation triggers the KSEB net meter installation process.",
          "After the net meter is installed by KSEB, log in to the portal and submit your bank details for subsidy disbursement: account holder name (must match Aadhaar), bank name, 11-digit IFSC code, and account number. Double-check every character before submitting.",
        ],
      },
      {
        id: "case-studies",
        title: "Troubleshooting Common Portal Issues",
        paragraphs: [
          "OTP not received: The portal sends OTPs from a central government number that some telecom operators filter as spam. Check your spam messages folder. If still not received, wait 10 minutes and request a resend.",
          "Consumer number not recognized: Ensure you are entering the 10-digit numeric consumer number, NOT the meter number (a different field on your bill). Consumer numbers for KSEB start with 'K' — enter only the digits after 'K.'",
          "Application stuck at 'Under Review' for more than 30 days: Use the portal's grievance module to file a complaint citing the application reference number. KSEB is required to resolve grievances within 5 working days. If unresolved, escalate to the Kerala Electricity Regulatory Commission (KERC) consumer helpline.",
        ],
      },
    ],
    understanding: {
      title: "Understanding the PM Surya Ghar Portal Process",
      paragraphs: [
        "The PM Surya Ghar Muft Bijli Yojana portal (pmsuryaghar.gov.in) is the central point for all subsidy applications. Every Kerala homeowner must complete this online process before and after installation to qualify for the MNRE subsidy.",
        "The portal has 8 key steps spanning approximately 45–75 days. Here is a stage-by-stage breakdown with the documents and timeframes involved.",
      ],
      table: {
        headers: ["Step", "Action", "Timeframe", "Key Document Required"],
        highlightColumnIndex: 2,
        rows: [
          { cells: ["1", "Portal Registration", "Day 1", "KSEB consumer number + Aadhaar OTP"] },
          { cells: ["2", "Feasibility Application", "Day 1–3", "KSEB bill photo, roof details"] },
          { cells: ["3", "KSEB Site Assessment", "Days 7–37", "KSEB sanction letter (via portal)"] },
          { cells: ["4", "Solar Installation", "Days 37–45", "MNRE vendor invoice"] },
          { cells: ["5", "Commissioning Submission", "Days 45–50", "Equipment certificates, photos"] },
          { cells: ["6", "KSEB Net Meter Install", "Days 50–70", "Bidirectional meter fitted by KSEB"] },
          { cells: ["7", "Bank Details Submission", "Day 70", "Cancelled cheque / passbook copy"] },
          { cells: ["8", "Subsidy Credit", "Within 30 days", "Bank account confirmation"] },
        ],
      },
      afterTableParagraphs: [
        "Steps 1–2 and Step 7 are consumer-controlled and take only a few hours each. Steps 3, 6, and 8 are KSEB and government-controlled — these are the stages that require patient follow-up. Use the portal's built-in grievance module if any step exceeds its stated timeline.",
      ],
      keyInsight: "Your PM Surya Ghar Application Reference Number is your most important document throughout the entire process. Save it immediately after registration — you'll need it for every follow-up with KSEB, and it's the only way to file a grievance if your application is delayed.",
    },
    eligible: {
      title: "Who Can Apply on the PM Surya Ghar Portal?",
      intro: "The PM Surya Ghar portal is open to all residential electricity consumers in India. To complete the Kerala-specific application successfully, you must have:",
      items: [
        "A valid KSEB LT domestic consumer account number (10-digit number on your electricity bill)",
        "An Aadhaar-linked mobile number for OTP-based portal verification",
        "A bank account in your name for subsidy credit (nationalised or scheduled commercial bank)",
        "Ownership or long-term occupancy rights over the property where installation will occur",
        "A roof that can structurally support solar panel mounting (flat RCC or tiled sloped roof)",
      ],
      important: "Tenants can apply for the PM Surya Ghar portal registration if they have a KSEB account in their name. However, landlord written consent is strongly recommended before proceeding with installation, as the solar system becomes a fixture of the property.",
    },
  },

  "net-metering-kseb-guide": {
    author: "Meera Pillai",
    reviewedBy: "Solar Engineer",
    tags: ["Net Metering", "KSEB", "Billing", "Energy Credits", "Surplus Units", "Settlement"],
    intro: [
      "Net metering is what transforms your solar panels from an electricity generator into a virtual battery connected to KSEB's grid — letting you bank surplus daytime generation and use it at night or on cloudy days.",
      "Kerala has one of India's better net metering policies, but the billing mechanism confuses most new solar owners. This guide explains exactly how your KSEB bill changes after solar installation.",
    ],
    quickSummary: [
      "Net metering allows export of surplus solar generation to the KSEB grid",
      "Exported units are credited at ₹3.40–₹3.70 per unit (import tariff minus distribution charges)",
      "Monthly billing: You pay only for net units consumed (import minus export)",
      "Annual settlement: Surplus credits carried forward; KSEB pays out unused credits annually",
      "Billing cycle does not change — remains monthly",
    ],
    sections: [
      {
        id: "solar-basics",
        title: "How Net Metering Works",
        paragraphs: [
          "Your solar panels generate maximum electricity from 9 AM to 3 PM on sunny days. During these hours, if your panels generate more than your home's instantaneous consumption, the surplus flows backwards through your meter into the KSEB grid.",
          "This exported energy is tracked by the bidirectional net meter (installed by KSEB after commissioning). The meter records two values: units imported from the grid and units exported to the grid.",
          "Your monthly KSEB bill calculates the difference: Net units = Units imported − Units exported. You pay only for the net units at the applicable LT domestic tariff slab. If net units are negative (you exported more than you imported), you have a net credit that is carried forward.",
        ],
      },
      {
        id: "installation",
        title: "KSEB's Net Metering Tariff Structure",
        paragraphs: [
          "Under KSEB's current net metering policy (revised 2023), exported units are credited at the 'avoided cost rate' — not the full import tariff. The current avoided cost rate is ₹3.40–₹3.70 per unit depending on voltage level.",
          "This means exported units are valued less than imported units. Example: If you export 100 units at ₹3.50 and import 200 units at an average of ₹6.50 (because you're in a higher consumption slab), your net bill is for 100 units, but the effective saving per exported unit is ₹3.50, not ₹6.50.",
          "The practical implication: it's financially optimal to maximise self-consumption (use your own solar power directly) rather than export. Run washing machines, dishwashers, water heaters during 10 AM–2 PM peak solar hours.",
        ],
      },
      {
        id: "financing",
        title: "Reading Your New KSEB Bill After Solar",
        paragraphs: [
          "After net meter installation, your KSEB bill format changes. The bill will now show: Units imported from grid (previous reading minus current reading on the 'import' register), Units exported to grid (previous reading minus current reading on the 'export' register), Net units for billing (import minus export), Applicable tariff slab calculation based on net consumption, and a separate line for net metering adjustments.",
          "In months where your generation exceeds consumption (typically February–May), your bill may show a 'banked energy credit' — surplus units carried forward. KSEB's policy allows credits to be carried forward for 12 months.",
          "At the annual settlement (typically in March), any unconsumed banked credits are paid out to you at the avoided cost rate (₹3.40–₹3.70/unit). This is done via a credit note or bank transfer from KSEB.",
        ],
      },
      {
        id: "maintenance",
        title: "Maximising Your Net Metering Benefits",
        paragraphs: [
          "Shift high-consumption appliances to solar hours (10 AM–2 PM): Water heater (geyser) — run during solar peak instead of mornings. Washing machine — run one full cycle between 10–11 AM. Electric vehicle charging — schedule AC charging to 10 AM–3 PM if your EV has scheduling capability.",
          "Consider a smart home energy management system: Devices like the Luminous SmartHub or SolarEdge Home Control can automatically switch on high-load appliances when solar generation exceeds consumption, maximising self-consumption without manual intervention.",
          "Monitor export patterns monthly: If your monthly export consistently exceeds 30% of total generation, your system may be oversized for your current consumption — or there's significant potential to add load-shifting. Our energy consultants can review your generation and consumption data to optimise your usage pattern.",
        ],
      },
      {
        id: "technology",
        title: "The Net Metering Policy Fine Print",
        paragraphs: [
          "Capacity limits: KSEB approves net metering for residential systems up to the consumer's sanctioned load (kW). If you want a system larger than your sanctioned load, you must first apply for a load enhancement.",
          "Connection type requirement: Only LT domestic consumers with a single-phase or three-phase connection at 240V or 415V respectively qualify. Industrial or commercial connections have different net metering tariff rates.",
          "Modification and sale: Net metering benefits are linked to the consumer account. If you sell your house, the solar system and net metering agreement transfer to the new owner as part of the property. Inform KSEB of the ownership change to update records.",
        ],
      },
      {
        id: "case-studies",
        title: "Net Metering in Practice: A Sample Monthly Bill",
        paragraphs: [
          "The Thomas family in Thrissur (3 kW system, average monthly consumption 280 units). February 2025 bill: Units imported: 95. Units exported: 175. Net units: −80 (credit). Amount billed: ₹0 plus fixed charges of ₹70. Banked credit: 80 units carried forward.",
          "June 2025 bill (monsoon peak consumption): Units imported: 310. Units exported: 80. Net units: 230. Use 80 banked units from February: Net billable: 150 units. Bill at ₹5.80/unit slab: ₹870 + ₹70 fixed = ₹940. Without solar, this bill would have been ₹2,020.",
          "Over 12 months, the Thomas family's average monthly bill dropped from ₹1,850 to ₹420 — a saving of ₹17,160 in the first year. Their projected annual saving crosses ₹25,000 by Year 3 as tariffs increase.",
        ],
      },
    ],
    understanding: {
      title: "Understanding KSEB Net Metering and Your New Bill",
      paragraphs: [
        "After your bidirectional net meter is installed by KSEB, your electricity bill format changes. The bill now shows units imported from the grid and units exported to it — and you pay only for the net difference.",
        "The Thomas family's billing history below illustrates how net metering works across different months and how banked credits offset monsoon bills.",
      ],
      table: {
        headers: ["Month", "Units Imported", "Units Exported", "Net Units", "Monthly Bill"],
        highlightColumnIndex: 4,
        rows: [
          { cells: ["February (Peak Sun)", "95", "175", "−80 (credit)", "₹70 fixed charges only"] },
          { cells: ["June (Monsoon)", "310", "80", "230", "₹940 (vs ₹2,020 without solar)"] },
          { cells: ["September (Late Monsoon)", "280", "60", "220", "₹870 (vs ₹1,850 without solar)"] },
          { cells: ["November (Post-monsoon)", "140", "110", "30", "₹180 (vs ₹870 without solar)"] },
          { cells: ["Annual Average", "1,800", "1,600", "200 net", "₹420/month vs ₹1,850"] },
        ],
      },
      afterTableParagraphs: [
        "Surplus banked credits from high-generation months (November–March) are carried forward for 12 months and automatically offset your consumption in low-generation months. At the annual settlement in March, any remaining unconsumed credits are paid out by KSEB at ₹3.40–₹3.70 per unit.",
      ],
      keyInsight: "Shifting just two appliances — your water heater and washing machine — to run between 10 AM and 2 PM can increase your self-consumption ratio from 60% to over 80%, reducing the units you export at the lower ₹3.50/unit avoided cost rate and increasing savings at the full ₹6.50/unit import tariff rate.",
    },
    eligible: {
      title: "Who Qualifies for KSEB Net Metering?",
      intro: "KSEB's net metering scheme is available to most residential solar owners, but there are specific technical and administrative requirements to meet:",
      items: [
        "LT domestic electricity connection (single-phase 240V or three-phase 415V)",
        "Solar system capacity within your KSEB sanctioned load limit",
        "MNRE-empanelled installer who submits commissioning documents through the contractor portal",
        "BIS-certified panels and MNRE-listed inverter (required for net meter application approval)",
        "Completed PM Surya Ghar portal registration and feasibility approval before installation",
      ],
      important: "Commercial and industrial KSEB connections have different net metering tariff rates and capacity limits. The avoided cost rate of ₹3.40–₹3.70/unit applies specifically to LT domestic connections. If your home has a commercial connection for any reason, verify the applicable tariff with KSEB before sizing your system.",
    },
  },
};
