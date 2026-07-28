/**
 * Quotation PDF copy, keyed by page.
 *
 * `en` is the source of truth for both the text and the shape of the catalog.
 * `ml` holds the Malayalam counterpart and may be filled in page by page —
 * anything missing falls back to the English string, so a partially translated
 * catalog still produces a complete PDF.
 *
 * NOT translated (kept English everywhere by design): the header and footer,
 * numbers, ₹ amounts, dates, quote number, GST number, brand and product names,
 * data coming from the backend (BOM, sales person), and customer-entered
 * details such as name, address, phone and pincode.
 */

export type QuotationLanguage = "English" | "Malayalam";

const en = {
  page1: {
    headline: "Stop Worrying About Electricity Bills Forever",
    subheadline:
      "Empowering Kerala homes with clean energy, smart savings, and the joy of sustainability.",
    statSubsidyMain: "₹78,000 Subsidy",
    statSubsidySub: "PM Surya Ghar – guaranteed",
    statWarrantyMain: "25-Year Warranty",
    statWarrantySub: "Performance guaranteed",
    statHomesMain: "300+ Homes",
    statHomesSub: "Installed in Kerala",
    statMnreMain: "MNRE Empanelled",
    statMnreSub: "Government certified",
    greeting: "Dear {name},",
    thanks: "Thank you for considering Flarize for your home.",
    letterBody1:
      "Choosing solar is one of the smartest decisions you can make for your home. It's more than reducing your electricity bill—it's about enjoying a better lifestyle, protecting your family from rising electricity costs, and investing in a home that continues to reward you for years to come.",
    letterBody2:
      "We've carefully designed this solution specifically for your home's energy needs, so you can make your decision with complete confidence.",
    warmRegards: "Warm Regards,",
    teamName: "Team Flarize",
    proposalDetailsTitle: "YOUR PROPOSAL DETAILS",
    labelName: "Name",
    labelQuoteNo: "Quo No",
    labelAddress: "Address",
    labelProposalBy: "Proposal By",
    labelPincode: "pincode",
    labelDate: "Date",
    labelPhoneNumber: "Phone Number",
    labelValidUntil: "Valid Until",
    labelCurrentBill: "Current Bill",
    labelGstNo: "GST No",
    labelSystemSize: "System Size",
    labelCompanyRegistration: "Company Registration",
    currentBillValue: "₹{amount}/month",
  },

  page2: {
    title: "See Exactly What Your Solar Powers Every Day",
    subtitle: "Real numbers calculated from your usage — not estimates.",
    dailyGenerationLabel: "Your Daily Solar Generation",
    dailyGenerationValue: "{min}–{max} units",
    dailyGenerationNote: "Average across all seasons",
    monthlyValueLabel: "Monthly Value at KSEB Rate",
    monthlyValueNote: "Worth of free electricity",
    applianceTitle: "Your Daily Appliance Usage",
    colAppliance: "Appliance",
    colQuantity: "Quantity",
    colHoursPerDay: "Hours/Day",
    colUnitsPerDay: "Units/Day",
    appliances: [
      { name: "Air Conditioner", qty: "1", hours: "6 hrs", units: "7.2 units" },
      { name: "Refrigerator", qty: "1", hours: "24 hrs", units: "1.5 units" },
      { name: "Washing Machine", qty: "1", hours: "1 hr", units: "0.5 units" },
      { name: "TV + OTT", qty: "1", hours: "5 hrs", units: "0.5 units" },
      { name: "Lights + Fans", qty: "10", hours: "6 hrs", units: "0.6 units" },
      {
        name: "Inverter + Chargers",
        qty: "-",
        hours: "24 hrs",
        units: "0.5 units",
      },
      { name: "EV Charging", qty: "-", hours: "1 hr", units: "0.8 units" },
    ],
    totalDailyUsage: "Total Daily Usage:",
    totalUnitsValue: "{units} units",
    solarGenerates: "Solar Generates",
    homeUses: "Your Home Uses",
    surplusExported: "Surplus Exported",
    unitsPerDayAverage: "units/day (average)",
    unitsPerDayAppliances: "units/day (all appliances)",
    unitsPerDayCredits: "units/day — KSEB credits",
    lifeNowTitle: "Your Life Now",
    lifeSolarTitle: "Your Life with Solar",
    lifeNow: [
      {
        title: "Limiting AC Usage",
        desc: "Constantly adjusting temperature, turning off rooms, compromising comfort",
      },
      {
        title: "Fuel Dependency",
        desc: "Petrol prices control your budget, long queues at fuel stations",
      },
      {
        title: "Electricity Anxiety",
        desc: "Constant worry about power cuts, generator costs, UPS limitations",
      },
    ],
    lifeWithSolar: [
      {
        title: "Comfort Without Guilt",
        desc: "Use AC freely, perfect temperature always, no compromises needed",
      },
      {
        title: "Self-Generated Power",
        desc: "Your roof becomes your power station, independence from grid fluctuations",
      },
      {
        title: "Complete Confidence",
        desc: "Peace of mind, future-ready home, smart investment that pays daily",
      },
    ],
  },

  page3: {
    // Heading reads prefix + "Flarize" + suffix, so a translation can place the
    // verb after the brand name the way Malayalam needs.
    whyChoosePrefix: "Why Choose ",
    whyChooseSuffix: "?",
    intro:
      "A solar system is one of the smartest investments you'll make for your home—but its long-term performance depends on choosing the right installer. At Flarize, we combine quality workmanship, premium components, transparent pricing, and dependable after-sales support to help you enjoy worry-free solar for years to come.",
    promiseLabel: "Our Promise:",
    promiseBody:
      " Your solar journey doesn't end on installation day. We're committed to helping you enjoy reliable performance, lower electricity bills, and dependable support for years to come.",
    stats: [
      { main: "300+", sub: "Successful Installations" },
      { main: "8+ Years", sub: "Industry Experience" },
      { main: "CERTIFIED", sub: "INSTALLATION TEAM" },
      { main: "KERALA", sub: "Wide Service" },
      { main: "MNRE", sub: "Government Certified" },
    ],
    homesPoweredTitle: "Homes We've Powered Across Kerala",
    projectsCount: "300+ Projects Across Kerala",
    handPickedTitle: "We Hand Picked For Your Home",
    handPicked: [
      { title: "Tier 1 Brand", sub: "Bloomberg-listed manufacture" },
      { title: "PVEL Top Performer", sub: "Independently lab tested" },
      { title: "ALMM2 Listed", sub: "Domestic cell manufacturing" },
      { title: "Easy Warranty Claims", sub: "Direct manufacturer support" },
      { title: "Local stock available", sub: "Fast replacement parts" },
    ],
  },

  page4: {
    title: "Three Options. One Smart Choice.",
    subtitle:
      "All prices shown after ₹78,000 PM Surya Ghar subsidy. Pick what fits your home.",
    subtitleNoSubsidy:
      "All prices shown are the full system cost — PM Surya Ghar subsidy is not applicable. Pick what fits your home.",
    premiumName: "Premium System",
    smartName: "Smart System",
    basicName: "Basic System",
    systemSizeLabel: "5 kW Solar System",
    afterSubsidy: "after ₹78,000 subsidy",
    recommendedBadge: "★ Recommended – Most Popular",
    premiumEmi: "EMI (5yr): ~₹5,390/mo",
    premiumEmiNote:
      "Near break-even during EMI; full ₹5,200–5,700/mo becomes pure savings once EMI ends",
    smartEmi: "EMI (5yr): ~₹3,940/mo",
    smartEmiNote: "Net positive from Day 1: saving +₹1,280–1,760/mo",
    basicEmi: "EMI (5yr): ~₹2,490/mo",
    basicEmiNote: "Net saving: +₹2,710–3,210/mo even during EMI",
    emiNoSubsidy: "EMI (5yr): ~₹{amount}/mo",
    emiNoteNoSubsidy: "On the full system cost, without subsidy",
    itemsHeader: "Items",
    comparisonRows: [
      {
        label: "Installation:",
        premium: "5–10 Working Days",
        smart: "10–15 Working Days",
        basic: "15–20 Working Days",
      },
      {
        label: "Service Response:",
        premium: "24×7 Priority Support",
        smart: "Priority Support",
        basic: "Business Hours",
      },
      {
        label: "Standard Warranty Support",
        premium: "check",
        smart: "check",
        basic: "check",
      },
      {
        label: "Emergency Visit",
        premium: "check",
        smart: "check",
        basic: "check",
      },
      {
        label: "WhatsApp Support",
        premium: "check",
        smart: "check",
        basic: "check",
      },
      {
        label: "Preventive Maintenance",
        premium: "5 years",
        smart: "5 years",
        basic: "5 years",
      },
      {
        label: "Annual Health Check",
        premium: "2  Free Visits (1st Year)",
        smart: "2  Free Visits (1st Year)",
        basic: "2  Free Visits (1st Year)",
      },
      {
        label: "Panel Cleaning Visit",
        premium: "2  Free Visits (1st Year)",
        smart: "2  Free Visits (1st Year)",
        basic: "dash",
      },
      {
        label: "Standby Inverter Access",
        premium: "check",
        smart: "check",
        basic: "dash",
      },
      {
        label: "Priority Service Queue",
        premium: "check",
        smart: "check",
        basic: "dash",
      },
      {
        label: "Annual Energy Audit & Report",
        premium: "check",
        smart: "check",
        basic: "dash",
      },
      {
        label: "Emergency Support",
        premium: "check",
        smart: "check",
        basic: "dash",
      },
      {
        label: "AMC Discount",
        premium: "check",
        smart: "dash",
        basic: "dash",
      },
    ],
  },

  page41: {
    campaignTitleSuffix: "SOLAR CAMPAIGN",
    limitedToFirst: "LIMITED TO FIRST",
    limitedHomes: "100 HOMES",
    campaignBadge: "ONAM SOLAR PROSPERITY CAMPAIGN",
    heroTitlePart1: "Book Early.",
    heroTitlePart2: "Unlock Bigger Rewards.",
    heroSubtitle:
      "Exclusive festive rewards available only for the first 100 confirmed residential bookings.",
    slotsClaimed: "6 / 10 Slots Claimed",
    slotsRemaining: "Only 4 Premium Slots Remaining",
    urgencyNote: "Book today before the Grand Feast Tier closes permanently.",
    grandFeastSlotLabel: "GRAND FEAST SLOT",
    firstTenBookings: "FIRST 10 BOOKINGS ONLY",
    grandFeastFeatures: [
      {
        title: "11-Year Inverter Protection",
        sub: "Extended manufacturer warranty.",
      },
      {
        title: "FREE 2-Year Solar Care+",
        sub: "Quarterly professional cleaning.",
      },
      {
        title: "Hybrid Upgrade Promise",
        sub: "Lock-in battery upgrade prices.",
      },
      { title: "Festive Onam Sadhya Kit", sub: "Premium kit for the family." },
    ],
    rewardRibbon: "MOST VALUABLE REWARD",
    rewardTitle: "WIN A FAMILY TOUR",
    rewardSubtitle: "PACKAGE TO MUNNAR",
    rewardTierBadge: "🎉 EXCLUSIVE TIER 1",
    currentLiveTier: "CURRENT LIVE TIER",
    grandFeastTierName: "GRAND FEAST",
    grandFeastTierItems: [
      "All Primary Rewards",
      "Munnar Tour Entry",
      "Hybrid Upgrade",
    ],
    grandFeastBookings: "Bookings 1 - 10",
    tiers: [
      {
        name: "EARLY BIRD",
        items: [
          { text: "Solar Care+ (1yr)", type: "check" },
          { text: "No Munnar Tour", type: "lock" },
          { text: "Sadhya Kit", type: "check" },
        ],
        bookings: "Bookings 11 - 30",
      },
      {
        name: "FESTIVE RUSH",
        items: [
          { text: "Standard Warranty", type: "check" },
          { text: "No Hybrid Upgrade", type: "lock" },
          { text: "No Care+", type: "check" },
        ],
        bookings: "Bookings 31 - 70",
      },
      {
        name: "LAST CHANCE",
        items: [
          { text: "Base Setup", type: "check" },
          { text: "Standard Pricing", type: "lock" },
          { text: "No Add-ons", type: "check" },
        ],
        bookings: "Bookings 71 - 100",
      },
    ],
    reserveTitle: "Reserve Your Slot Today",
    reserveSubtitle:
      "Talk to our experts and secure your Onam Solar Prosperity benefits.",
    reserveBenefits: [
      {
        title: "Limited Campaign",
        sub: "Only for the Onam season window.",
        icon: "calendar",
      },
      {
        title: "Reserve Installation",
        sub: "Priority scheduling before peak rush.",
        icon: "install",
      },
      {
        title: "Lock Pricing",
        sub: "Avoid upcoming material price hikes.",
        icon: "lock",
      },
      {
        title: "Exclusive Rewards",
        sub: "Tier-specific benefits for winners.",
        icon: "star",
      },
    ],
    bookNow: "Book Now",
    scanQrTitle: "Scan QR Code",
    scanQrSubtitle: "Check Live Availability",
  },

  page6: {
    headlinePart1: "Homeowners Around You Have Already ",
    headlinePart2: "Switched to Solar",
    subtitle: "While you're still paying full KSEB bills every month",
    socialProofHomes: "{homes} homes in {district} ({pincode})",
    socialProofMiddle: " are already running on Flarize solar. ",
    socialProofInstallations: "{count} installations",
    socialProofTail: " across {district} district in {year} alone.",
    testimonials: [
      {
        systemSize: "5 kW System",
        installedDate: "Installed on June 2025",
        quote:
          '"The solar panel installation process was smooth from the very beginning. The team clearly explained each stage – from understanding our energy needs to system design, installation, and final activation. All timelines were communicated in advance, and the execution stayed on track without unnecessary delays. The overall experience felt well-planned and dependable."',
      },
      {
        systemSize: "5 kW System",
        installedDate: "Installed on March 2025",
        quote:
          '"Our commercial solar installation brought better predictability to our monthly power expenses. The team maintained transparent communication throughout the project and handled the technical and approval processes professionally. The transition to solar was structured, efficient, and free from operational disruption, which made the decision feel reassuring"',
      },
      {
        systemSize: "5 kW System",
        installedDate: "Installed on May 2024",
        quote:
          '"What stood out most was the honest guidance we received on system capacity and realistic expectations around savings. The team took time to explain what would work best for our usage rather than overselling. From planning to completion, the project felt reliable, transparent, and well managed."',
      },
    ],
    savesLabel: "Saves ₹{amount}/mo",
    qrTitle: "📹 Watch Real Kerala Homeowners Share Their Experience",
    qrBody:
      "Scan the QR code to watch 2-minute video interviews with customers in Alappuzha, Kochi, and Thrissur. See their rooftop installations and hear their savings stories.",
  },

  page7: {
    titleBold: "Technical Specifications",
    titleSuffix: "(Equivalent to {watts})",
    subtitle:
      "Every component, every specification — total transparency for your peace of mind.",
    itemsHeader: "Items",
    premiumName: "Premium System",
    smartName: "Smart System",
    basicName: "Basic System",
    sizeLabel: "{size} kW Solar System",
    specLabels: [
      "Solar Module Brand",
      "Module Power (W) and Type",
      "Panel Warranty",
      "Inverter Type",
      "Inverter Brand & Warranty",
      "Mounting Structure",
      "ACDB / DCDB",
      "DC Cable (mm²)",
      "AC Cable (sqmm)",
      "Earthing Wire",
      "Earthing Wire",
    ],
    totalSystemCost: "Total System Cost",
    subsidyAmount: "Subsidy Amount",
    totalAfterSubsidy: "Total System Cost After Subsidy",
  },

  page8: {
    title: "Your Savings Over Time",
    chartTitle: "Cumulative Electricity Costs Over 25 Years",
    legendKseb: "KSEB Costs",
    legendSolar: "Solar + Bills",
    monthlyBillReduction: "Monthly Bill Reduction",
    currentKsebBill: "Current KSEB Bill",
    withSolar: "With Solar",
    withSolarValue: "₹300-800/month",
    monthlySavings: "Monthly Savings",
    netSavings25: "25-Year Net Savings",
    keyTakeaway: "Key Takeaway",
    keyTakeawayBody:
      "Your solar system pays for itself within the first few years. After that, the next 20+ years are pure savings of ₹{amount}+.",
    withoutSolar: "Without Solar",
    withSolarLabel: "With Solar",
    foreverIncreasing: "forever increasing",
    fixedLowBill: "fixed low bill",
    paidToKsebAmount: "₹{amount}+ lakh",
    paidToKsebText: " paid to KSEB in 25 years",
    billIncreasesText: "Bill increases ",
    billIncreasesValue: "8-12% yearly",
    noOwnership: "No ownership, no control",
    savedAmount: "₹{amount} lakh",
    savedText: " saved over 25 years",
    protectedFromText: "Protected from ",
    protectedFromValue: "tariff hikes",
    ownYourPowerText: "Own your power, ",
    ownYourPowerValue: "25+ year warranty",
    bookNow: "Book now",
    qrCode: "QR Code",
    upiIdLabel: "UPI ID: ",
    bankTransfer: "Bank Transfer",
    bankLabel: "Bank: ",
    accountNameLabel: "A/c Name: ",
    accountNoLabel: "A/c No: ",
    ifscLabel: "IFSC: ",
    refNote: "UPI Ref / NEFT Ref will be your project ID",
    requiredDocuments: "Required Documents:",
    documentsLeft: [
      "Bank Account",
      "Proof of Address",
      "Land tax, Building tax",
      "KSEB Feasibility Report",
    ],
    documentsRight: [
      "Proof of Identity(Aadhar & PAN Card)",
      "Salary Slips/Bank Statements (above 2L)",
      "Latest KSEB Bill (2 months)",
      "ITR ( above 2L)",
    ],
    additionalStructureCost: "Additional Structure cost ",
    additionalStructureNote: "( if needed )",
    additionalStructureValue: "₹4500/kw",
  },

  page9: {
    titlePart1: "From Booking to Savings — ",
    titlePart2: "Step by Step",
    daysLabel: "Days",
    steps: [
      {
        day: "1",
        title: "Pay ₹5,000 – Slot Locked",
        description:
          "Lock your installation slot with a small booking fee and we'll begin the technical assessment right away.",
      },
      {
        day: "3-4",
        title: "Site Inspection & Documentation",
        description:
          "Our team visits your site to evaluate roof, wiring, and shading. All measurements and documentation are managed by us.",
      },
      {
        day: "5-7",
        title: "Payment and Material Delivery",
        description:
          "Deliver solar panel, inverters and structures; follow up with the next payment installation (80% loan amount)",
      },
      {
        day: "9-13",
        title: "Installation",
        description:
          "We handle the full installation and system integration. Once commissioned, your solar system begins producing clean energy.",
      },
      {
        day: "14",
        title: "Commissioning and Customer Orientation",
        description:
          "Commission the system and orient the customer on operation and maintenance.",
      },
      {
        day: "15-17",
        title: "Net Meter Installation and Activation",
        description:
          "Install net meter for grid integration, enabling the customer to start using solar power",
      },
    ],
    refundTitle: "Refund from KSEB",
    refundNote:
      "(80% of Pre-tax value of registration fee) ( 1000 per kw + 18% tax )",
    refundValue: "5kw – Rs 4000",
    whatWeHandle: "What We Handle",
    whatYouNeedToDo: "What You Need To Do",
    weHandle: [
      "Design the panels according to site-specific requirements",
      "Analyze the site for shading and optimize panel placement",
      "Procure Solar Panels, inverter, Structure and BOQ according to project requirements",
      "Install all required components, fittings, and equipment",
      "Test and commission the solar power plant, Invite authorities for final approval before commissioning",
      "Installation scope is limited to the DC side; solar meter installation is included",
      "Train client's personal on system operation, safety, and maintenance",
    ],
    youNeedToDo: [
      "Provide a shade-free roof area and a safe, weather-protected space for the inverter.",
      "Arrange basic installation support, including water, electricity, storage space, and site access.",
      "Provide necessary technical provisions such as internet connectivity, termination points, CT/AC components, and upgrades required for HT or generator setups.",
      "Complete any KSEB-related requirements, including net metering formalities, load enhancement, consumer name change, ownership transfer, or other utility-related modifications, if applicable.",
      "Pay applicable statutory fees, deposits, registration charges, and other charges imposed by KSEB or relevant authorities.",
      "Any civil work, roof repairs, waterproofing, structural modifications, trenching, masonry work, painting, restoration work, or additional structural work required for installation shall be under the customer's scope unless specifically included in the quotation.",
    ],
  },

  page10: {
    title: "Terms and Conditions",
    terms: [
      {
        title: "1. Warranty :",
        body: "Golden Ray Renewable Energy provides a five (5) year warranty for the complete solar power system against manufacturing and technical defects, subject to the terms and conditions mentioned herein. Solar panels, inverters, and other OEM products shall carry warranty coverage as provided by their respective manufacturers.",
      },
      {
        title: "2. Warranty Exclusions :",
        body: "The warranty shall not apply to defects or damages resulting from misuse, negligence, unauthorized modifications, third-party interference, improper operation, storage, or maintenance. Warranty coverage also excludes damage caused by accidents, natural calamities, lightning, flooding, landslides, external grid surges, or any other Force Majeure events.",
      },
      {
        title: "3. Consumables :",
        body: "Consumable and protective components such as Fuses, Surge Protection Devices (SPDs), connectors, and similar accessories are not covered under warranty and may require periodic replacement as part of normal maintenance.",
      },
      {
        title: "4. Customer Responsibilities :",
        body: "The customer shall provide a shade-free area suitable for solar panel installation along with adequate space for inverters, meters, and associated equipment. Water access for panel cleaning, site accessibility, internet connectivity for monitoring systems, and any loading or unloading arrangements at site shall be arranged by the customer. If vehicle access to the installation site is restricted or unavailable, the customer shall arrange the necessary manpower or alternate transportation required for material movement, installation, servicing, or maintenance activities. Any additional costs arising due to restricted site access shall be borne by the customer.",
      },
      {
        title: "5. Service & Training :",
        body: "Basic service and maintenance training shall be provided to the customer at the time of commissioning. Standby inverter support may be provided during inverter repair periods, subject to availability.",
      },
      {
        title: "6. Payment Terms :",
        body: "Payments shall be made as per the payment schedule agreed in the quotation and are due immediately upon completion of each project stage. In case the project duration is extended, invoices for completed work, supplied materials, or specially ordered materials may be raised periodically and shall be payable upon receipt. Any additional charges arising from scope changes, statutory requirements, material variations, or customer-requested modifications shall be paid before the related work is undertaken. The agreed project price shall be considered final upon acceptance of the quotation and requests for price reductions, discounts, or renegotiation after order confirmation shall not be entertained. Payments shall be made only to the official bank account of Golden Ray Renewable Energy, and the Company shall not be responsible for payments made to employee or third-party accounts. Eligible refunds shall be processed within seven (7) working days, subject to banking procedures.",
      },
      {
        title: "7. Price Variations :",
        body: "If payments are not made as agreed, any increase in labour costs, material costs, taxes, duties, or statutory charges occurring after the quotation date may be charged additionally to the customer. Such revisions shall be reflected in the final invoice.",
      },
      {
        title: "8. GST & Tax Changes :",
        body: "Prices quoted are inclusive of applicable GST and taxes prevailing on the date of quotation. Any revision in GST, government levies, duties, or statutory charges shall be reflected in the final invoice.",
      },
      {
        title: "9. System Capacity & Product Confirmation:",
        body: "Once the customer confirms the system capacity, panel make/model, inverter make/model, and quotation, subsequent changes may not be possible. Any changes requested thereafter may result in revised pricing, additional charges, material replacement costs, or project delays.",
      },
    ],
  },

  page101: {
    terms: [
      {
        title: "10. Project Completion Timeline :",
        body: "The Company shall endeavour to complete the project within the timeline specified in the quotation or within a reasonable period where no timeline is specified. However, the Company shall not be responsible for delays caused by approvals, shipment delays, transportation issues, weather conditions, or other factors beyond its reasonable control.",
      },
      {
        title: "11. Statutory & KSEB Related Scope :",
        body: "Golden Ray Renewable Energy shall assist with statutory approvals and KSEB-related procedures as applicable. Any charges, deposits, penalties, load enhancement costs, tariff changes, name changes, ownership transfers, meter shifting, or similar modifications shall be borne by the customer.",
      },
      {
        title: "12. Government Subsidy Disclaimer :",
        body: "Government subsidy schemes, eligibility criteria, approval procedures, and reimbursement timelines are governed by the respective authorities and may change without prior notice. The Company shall not be responsible for delays, rejections, policy changes, reduction in subsidy amount, or subsidy disbursement timelines.",
      },
      {
        title: "13. Data Privacy :",
        body: "The Company reserves the right to monitor, record, and utilize customer information and solar production data obtained directly from the system or through remote monitoring platforms. Such information may be shared with vendors, technical support teams, regulatory authorities, and other relevant agencies for warranty support, compliance requirements, research, service improvement, and promotional activities.",
      },
      {
        title: "14. Additional Expenses & Civil Works :",
        body: "Unless specifically included in the quotation, charges relating to KSEB applications, registration, documentation, testing, agreements, net meter connections, additional structures, extended cable runs, site-specific modifications, and any civil work including foundation work, roof repairs, waterproofing, structural modifications, masonry work, painting, trenching, cutting, restoration work, or related activities shall be borne by the customer.",
      },
      {
        title: "15. Retention of Title :",
        body: "All materials, equipment, and goods supplied by the Company shall remain its property until full payment has been received and all outstanding dues have been cleared. Ownership shall transfer to the customer only upon complete settlement of outstanding dues.",
      },
      {
        title: "16. Liability :",
        body: "The Company shall not be liable for business interruption, loss of profit, loss of savings, or any indirect or consequential damages arising from the use or performance of the solar power system. Claims arising from non-compliance with operating, maintenance, or installation instructions shall also be excluded.",
      },
      {
        title: "17. Force Majeure :",
        body: "The Company shall not be liable for delays or failure to perform its obligations due to circumstances beyond its reasonable control. Such circumstances include natural disasters, strikes, transportation disruptions, utility delays, government actions, regulatory changes, or other Force Majeure events.",
      },
      {
        title: "18. Confidentiality :",
        body: "Both parties shall treat all non-public commercial and technical information exchanged during the course of the project as confidential. Such information shall not be disclosed to any third party without prior written consent, except where required by law.",
      },
      {
        title: "19. Jurisdiction :",
        body: "This quotation and all related agreements shall be governed by the laws of India. Any disputes arising out of or in connection with this agreement shall be subject to the jurisdiction of the courts of Kerala.",
      },
    ],
  },

  page11: {
    title: "Your Investment Summary",
    subtitle: "A controlled, predictable, one-time decision",
    packageHeader: "5 kW Solar System — Recommended Package",
    systemCostPreSubsidy: "System Cost (Pre-Subsidy)",
    pmSuryaGharSubsidy: "PM Surya Ghar Subsidy",
    yourInvestment: "Your Investment",
    monthlySavings: "Monthly Savings",
    paybackPeriod: "Payback Period",
    paybackValue: "~{years} years",
    netSavings25: "25-Year Net Savings",
    emiOption: "EMI Option (5yr, ~9%)",
    emiValue: "~₹{amount}/month",
    netMonthlyDuringEmi: "Net monthly during EMI",
    netMonthlyValue: "+₹{min}–{max} (positive from Day 1)",
    netMonthlyValuePlain: "₹{min}–{max}",
    readyTitle: "💡 Keep the Power On, Even During Outages.",
    readySubtitle:
      "Call us to learn more about hybrid solar — the new solution more Kerala homes are choosing.",
    priorityTitle: "Priority 10-Day Installation",
    prioritySubtitle: "Fast-tracked scheduling and execution",
    offerValid: "Offer valid for bookings confirmed before {date}",
    badgeMnre: "MNRE Empanelled",
    badgeHomes: "127+ Kerala Homes",
    badgeRating: "4.9★ Google Rating",
    guaranteeRefundable: "100% Refundable",
    guaranteeRefundableSub: "₹5,000 booking fee",
    guaranteeNoObligation: "No Obligation",
    guaranteeNoObligationSub: "If roof unsuitable",
    guaranteePriceLocked: "Price Locked",
    guaranteePriceLockedSub: "For 90 days only",
    guaranteeInstallation: "Installation",
    guaranteeInstallationSub: "in 15–20 day",
    closingQuoteLine1:
      "Most homeowners tell us the hardest part was deciding —",
    closingQuoteLine2: "everything after that was surprisingly easy.",
  },
};

export type QuotationStrings = typeof en;

/**
 * A translation may fill in whole pages or individual keys; anything omitted
 * falls back to `en`. Arrays are replaced as a unit — supply every item.
 */
type QuotationTranslation = {
  [P in keyof QuotationStrings]?: Partial<QuotationStrings[P]>;
};

/**
 * Malayalam copy. Every key left out renders in English.
 *
 * GENERATED from `malayalam-checklist.md` — edit the Malayalam column there and
 * run `node scripts/sync-quotation-ml.mjs`, don't hand-edit the block below.
 */
// ml:start
const ml: QuotationTranslation = {
  page1: {
    headline: "വൈദ്യുതി ബില്ലിനെ കുറിച്ചുള്ള ആശങ്കകൾക്ക് ഇനി വിട",
    subheadline:
      "സുരക്ഷിതമായ ഊർജ്ജം, മികച്ച ലാഭം, ദീർഘകാല സാമ്പത്തിക സുരക്ഷ — നിങ്ങളുടെ വീടിനായി.",
    statSubsidyMain: "₹78,000 സബ്സിഡി",
    statSubsidySub: "PM സൂര്യ ഘർ പദ്ധതിയിലൂടെ",
    statWarrantyMain: "25 വർഷ വാറന്റി",
    statWarrantySub: "പ്രകടനം ഉറപ്പ്",
    statHomesMain: "300+ വീടുകളിൽ",
    statHomesSub: "വിജയകരമായ ഇൻസ്റ്റലേഷനുകൾ",
    statMnreMain: "MNRE Government",
    statMnreSub: "അംഗീകൃത സ്ഥാപനം",
    greeting: "പ്രിയ {name}",
    thanks:
      "നിങ്ങളുടെ വീടിനായി Flarize തിരഞ്ഞെടുക്കാൻ താൽപര്യം പ്രകടിപ്പിച്ചതിന് നന്ദി.",
    letterBody1:
      "സോളാർ തിരഞ്ഞെടുക്കുന്നത് വൈദ്യുതി ബിൽ കുറയ്ക്കാൻ മാത്രമല്ല. അത് നിങ്ങളുടെ കുടുംബത്തിന്റെ ഭാവിയിലേക്കുള്ള ഒരു മികച്ച നിക്ഷേപമാണ്. ഓരോ മാസവും ലാഭം നേടാനും, ഉയരുന്ന വൈദ്യുതി നിരക്കുകളിൽ നിന്ന് സംരക്ഷണം നേടാനും, വർഷങ്ങളോളം സ്വന്തം വൈദ്യുതി ഉപയോഗിക്കാനും ഇത് സഹായിക്കുന്നു.",
    letterBody2:
      "നിങ്ങളുടെ വീട്ടിലെ വൈദ്യുതി ഉപയോഗം, ആവശ്യകത, ബജറ്റ് എന്നിവ കണക്കിലെടുത്താണ് ഈ സോളാർ പദ്ധതി പ്രത്യേകം തയ്യാറാക്കിയിരിക്കുന്നത്. അതിനാൽ നിങ്ങൾക്ക് ആത്മവിശ്വാസത്തോടെ തീരുമാനമെടുക്കാം",
    warmRegards: "സ്നേഹപൂർവ്വം",
    teamName: "Flarize ടീം",
    proposalDetailsTitle: "YOUR PROPOSAL DETAILS",
    labelName: "പേര്",
    labelQuoteNo: "നിർദ്ദേശം നൽകുന്നത്",
    labelAddress: "വിലാസം",
    labelProposalBy: "ക്വട്ടേഷൻ നമ്പർ",
    labelPincode: "പിൻകോഡ്",
    labelDate: "തീയതി",
    labelPhoneNumber: "ഫോൺ നമ്പർ",
    labelValidUntil: "കാലവധി",
    labelCurrentBill: "നിലവിലെ വൈദ്യുതി ബിൽ",
    labelGstNo: "GST നമ്പർ",
    labelSystemSize: "സോളാർ സിസ്റ്റം",
    labelCompanyRegistration: "കമ്പനി രജിസ്ട്രേഷൻ നമ്പർ",
  },
  page2: {
    title:
      "നിങ്ങളുടെ Solar ഓരോ ദിവസവും എന്തെല്ലാം പ്രവർത്തിപ്പിക്കുന്നുവെന്ന് നോക്കാം",
    subtitle:
      "നിങ്ങളുടെ വൈദ്യുതി ഉപയോഗത്തെ അടിസ്ഥാനമാക്കി കണക്കാക്കിയ യഥാർത്ഥ വിവരങ്ങൾ",
    dailyGenerationLabel: "പ്രതിദിന ഉൽപ്പാദനം",
    dailyGenerationValue: "{min}–{max} units",
    dailyGenerationNote: "എല്ലാ സീസണുകളിലെയും ശരാശരി ഉൽപ്പാദനം",
    monthlyValueLabel: "നിലവിലെ KSEB നിരക്കിൽ മാസത്തിലെ മൂല്യം",
    monthlyValueNote: "ഓരോ മാസവും ലഭിക്കുന്ന സൗജന്യ വൈദ്യുതിയുടെ മൂല്യം",
    applianceTitle: "നിങ്ങളുടെ വീടിന്റെ പ്രതിദിന വൈദ്യുതി ഉപയോഗം",
    colAppliance: "ഉപകരണം",
    colQuantity: "എണ്ണം",
    colHoursPerDay: "ദിവസേന",
    colUnitsPerDay: "യൂണിറ്റ് / ദിവസം",
    appliances: [
      {
        name: "Air Conditioner",
        qty: "1",
        hours: "6 മണിക്കൂർ",
        units: "7.2 യൂണിറ്റ്",
      },
      {
        name: "Refrigerator",
        qty: "1",
        hours: "24 മണിക്കൂർ",
        units: "1.5 യൂണിറ്റ്",
      },
      {
        name: "Washing Machine",
        qty: "1",
        hours: "1 മണിക്കൂർ",
        units: "0.5 യൂണിറ്റ്",
      },
      {
        name: "TV + OTT",
        qty: "1",
        hours: "5 മണിക്കൂർ",
        units: "0.5 യൂണിറ്റ്",
      },
      {
        name: "Lights + Fans",
        qty: "10",
        hours: "6 മണിക്കൂർ",
        units: "0.6 യൂണിറ്റ്",
      },
      {
        name: "Inverter + Chargers",
        qty: "-",
        hours: "24 മണിക്കൂർ",
        units: "0.5 യൂണിറ്റ്",
      },
      {
        name: "EV Charging",
        qty: "-",
        hours: "1 മണിക്കൂർ",
        units: "0.8 യൂണിറ്റ്",
      },
    ],
    totalDailyUsage: "ആകെ പ്രതിദിന ഉപയോഗം",
    totalUnitsValue: "{units} യൂണിറ്",
    solarGenerates: "Solar ഉൽപ്പാദിപ്പിക്കുന്നത്",
    homeUses: "നിങ്ങളുടെ വീടിന്റെ ഉപയോഗം",
    surplusExported: "അധിക വൈദ്യുതി KSEB-ലേക്ക്",
    unitsPerDayAverage: "യൂണിറ്റ് / ദിവസം",
    unitsPerDayAppliances: "യൂണിറ്റ് / ദിവസം",
    unitsPerDayCredits: "യൂണിറ്റ് / ദിവസം",
    lifeNowTitle: "ഇപ്പോഴത്തെ അവസ്ഥ",
    lifeSolarTitle: "Solar-നൊപ്പം നിങ്ങളുടെ ജീവിതം",
    lifeNow: [
      {
        title: "AC ഉപയോഗത്തിൽ നിയന്ത്രണം",
        desc: "വൈദ്യുതി ബിൽ കൂടുമോ എന്ന ആശങ്ക കാരണം AC ഉപയോഗം പരിമിതപ്പെടുത്തേണ്ടി വരുന്നു.",
      },
      {
        title: "ഇന്ധനച്ചെലവിനെ ആശ്രയിക്കൽ",
        desc: "പെട്രോൾ, ഡീസൽ വില വർധിക്കുന്നത് കുടുംബ ബജറ്റിനെ ബാധിക്കുന്നു.",
      },
      {
        title: "ഗ്യാസ്, ഇന്ധന ചെലവുകൾ",
        desc: "എൽ.പി.ജി. ഗ്യാസ് നിറയ്ക്കുന്നതിനും ഇന്ധന വില വർധനവിനും ഓരോ മാസവും അധിക ചെലവ് വരുന്നു.",
      },
    ],
    lifeWithSolar: [
      {
        title: "ആശങ്കകളില്ലാത്ത സൗകര്യം",
        desc: "ബിൽ കൂടുമെന്ന ഭയം കൂടാതെ ACയും മറ്റ് ഉപകരണങ്ങളും കൂടുതൽ സ്വതന്ത്രമായി ഉപയോഗിക്കാം.",
      },
      {
        title: "സ്വന്തം വൈദ്യുതി ഉൽപ്പാദനം",
        desc: "നിങ്ങളുടെ വീട് തന്നെ ഒരു ചെറിയ പവർ സ്റ്റേഷനായി മാറുന്നു. Grid-നെ ആശ്രയിക്കുന്നത് കുറയുന്നു.",
      },
      {
        title: "ഊർജ്ജ ചെലവ് കുറയും",
        desc: "വൈദ്യുതിക്കും മറ്റ് ഊർജ്ജ ആവശ്യങ്ങൾക്കും വരുന്ന മാസച്ചെലവ് കുറയും.",
      },
    ],
  },
  page3: {
    whyChoosePrefix: "എന്തുകൊണ്ട്",
    whyChooseSuffix: "തിരഞ്ഞെടുക്കണം?",
    intro:
      "ഒരു സോളാർ സിസ്റ്റം നിങ്ങളുടെ വീട്ടിലേക്കുള്ള ഏറ്റവും മികച്ച നിക്ഷേപങ്ങളിൽ ഒന്നാണ്. എന്നാൽ അതിന്റെ ദീർഘകാല പ്രവർത്തനക്ഷമത ശരിയായ സ്ഥാപനത്തെ തിരഞ്ഞെടുക്കുന്നതിലാണ് ആശ്രയിക്കുന്നത്. Flarize-ൽ, മികച്ച നിലവാരമുള്ള ഉൽപ്പന്നങ്ങൾ, ഗുണമേന്മയുള്ള ഇൻസ്റ്റലേഷൻ, വ്യക്തമായ വിലനിർണ്ണയം, വിശ്വസനീയമായ സേവനം എന്നിവയിലൂടെ വർഷങ്ങളോളം ആശങ്കകളില്ലാത്ത സോളാർ ഉപയോഗിക്കാനാണ് ഞങ്ങൾ സഹായിക്കുന്നത്.",
    promiseLabel: "ഞങ്ങളുടെ വാഗ്ദാനം:",
    promiseBody:
      "ഇൻസ്റ്റലേഷൻ പൂർത്തിയായാലും ഞങ്ങളുടെ സേവനം അവസാനിക്കുന്നില്ല. വർഷങ്ങളോളം നിങ്ങളുടെ സോളാർ സിസ്റ്റം മികച്ച രീതിയിൽ പ്രവർത്തിക്കാനും, വൈദ്യുതി ബിൽ കുറയാനും, ആവശ്യമായപ്പോൾ വിശ്വസനീയമായ സഹായം ലഭിക്കാനും ഞങ്ങൾ ഒപ്പമുണ്ടാകും.",
    stats: [
      {
        main: "300+",
        sub: "വിജയകരമായ ഇൻസ്റ്റലേഷനുകൾ",
      },
      {
        main: "8+ Years",
        sub: "സോളാർ മേഖലയിലെ പ്രവർത്തന പരിചയം",
      },
      {
        main: "CERTIFIED",
        sub: "ഇൻസ്റ്റലേഷൻ ടീം",
      },
      {
        main: "KERALA",
        sub: "മുഴുവൻ സേവനം ലഭ്യമാണ്",
      },
      {
        main: "MNRE",
        sub: "Government അംഗീകൃത സ്ഥാപനം",
      },
    ],
    homesPoweredTitle: "കേരളത്തിലുടനീളം ഞങ്ങൾ സ്ഥാപിച്ച സോളാർ പദ്ധതികൾ",
    projectsCount: "കേരളത്തിലാകെ 300+ വിജയകരമായ പ്രോജക്ടുകൾ",
    handPickedTitle: "നിങ്ങളുടെ വീടിനായി ഞങ്ങൾ ശ്രദ്ധയോടെ തിരഞ്ഞെടുക്കുന്നത്",
  },
  page4: {
    title: "മൂന്ന് ഓപ്ഷനുകൾ. ഒരു മികച്ച തീരുമാനം.",
    subtitle:
      "₹78,000 പി.എം. സൂര്യ ഘർ സബ്‌സിഡിക്ക് ശേഷമുള്ള വിലകൾ താഴെ നൽകിയിരിക്കുന്നു.",
    subtitleNoSubsidy:
      "കാണിച്ചിരിക്കുന്ന വിലകൾ സിസ്റ്റത്തിന്റെ മൊത്തം വിലയാണ് — പി.എം. സൂര്യ ഘർ സബ്‌സിഡി ബാധകമല്ല.",
    premiumName: "പ്രീമിയം സിസ്റ്റം",
    smartName: "സ്മാർട്ട് സിസ്റ്റം",
    basicName: "ബേസിക് സിസ്റ്റം",
    afterSubsidy: "₹78,000 Subsidy ലഭിച്ച ശേഷം",
    emiNoSubsidy: "EMI (5 വർഷം): ~₹{amount}/മാസം",
    emiNoteNoSubsidy: "സബ്‌സിഡി ഇല്ലാതെ, മൊത്തം വിലയ്ക്ക്",
    itemsHeader: "ഇനം",
    comparisonRows: [
      {
        label: "ഇൻസ്റ്റലേഷൻ",
        premium: "5–10 പ്രവൃത്തി ദിവസങ്ങൾ",
        smart: "10–15 പ്രവൃത്തി ദിവസങ്ങൾ",
        basic: "15–20 പ്രവൃത്തി ദിവസങ്ങൾ",
      },
      {
        label: "സർവീസ് റെസ്‌പോൺസ്",
        premium: "24×7 മുൻഗണനാ സേവനം",
        smart: "മുൻഗണനാ സേവനം",
        basic: "ഓഫീസ് പ്രവർത്തന സമയങ്ങളിൽ",
      },
      {
        label: "സ്റ്റാൻഡേർഡ് വാറന്റി സപ്പോർട്ട്",
        premium: "check",
        smart: "check",
        basic: "check",
      },
      {
        label: "എമർജൻസി വിസിറ്റ്",
        premium: "check",
        smart: "check",
        basic: "check",
      },
      {
        label: "വാട്‌സ്ആപ്പ് സപ്പോർട്ട്",
        premium: "check",
        smart: "check",
        basic: "check",
      },
      {
        label: "പ്രിവന്റീവ് മെയിന്റനൻസ്",
        premium: "5 വർഷം",
        smart: "5 വർഷം",
        basic: "5 വർഷം",
      },
      {
        label: "വാർഷിക പരിശോധന",
        premium: "2 ഫ്രീ വിസിറ്റ് (1 വർഷം)",
        smart: "2 ഫ്രീ വിസിറ്റ് (1 വർഷം)",
        basic: "2 ഫ്രീ വിസിറ്റ് (1 വർഷം)",
      },
      {
        label: "പാനൽ ക്ലീനിംഗ് സന്ദർശനം",
        premium: "2 ഫ്രീ വിസിറ്റ് (1 വർഷം)",
        smart: "2 ഫ്രീ വിസിറ്റ് (1 വർഷം)",
        basic: "dash",
      },
      {
        label: "സ്റ്റാൻഡ്‌ബൈ ഇൻവെർട്ടർ",
        premium: "check",
        smart: "check",
        basic: "dash",
      },
      {
        label: "പ്രയോറിറ്റി സർവീസ് ക്യൂ",
        premium: "check",
        smart: "check",
        basic: "dash",
      },
      {
        label: "വാർഷിക എനർജി ഓഡിറ്റ് & റിപ്പോർട്ട്",
        premium: "check",
        smart: "check",
        basic: "dash",
      },
      {
        label: "എമർജൻസി സപ്പോർട്ട്",
        premium: "check",
        smart: "check",
        basic: "dash",
      },
      {
        label: "AMC ഡിസ്‌കൗണ്ട്",
        premium: "check",
        smart: "dash",
        basic: "dash",
      },
    ],
  },
  page6: {
    headlinePart1: "നിങ്ങളുടെ അയൽവാസികൾ ഇതിനകം",
    headlinePart2: "Solar-ലേക്ക് മാറി. നിങ്ങളോ?",
    subtitle: "നിങ്ങൾ ഇപ്പോഴും എല്ലാ മാസവും മുഴുവൻ KSEB ബിൽ അടയ്ക്കുമ്പോൾ...",
    socialProofHomes: "{district} ({pincode}) പ്രദേശത്തെ {homes} വീടുകൾ",
    socialProofMiddle:
      "ഇതിനകം Flarize Solar ഉപയോഗിക്കുന്നു. {year}-ൽ മാത്രം {district} ജില്ലയിൽ",
    socialProofInstallations: "{count} ഇൻസ്റ്റലേഷനുകൾ",
    socialProofTail: "പൂർത്തിയാക്കി.",
    testimonials: [
      {
        systemSize: "5 kW System",
        installedDate: "ജൂൺ 2025",
        quote:
          '"തുടക്കം മുതൽ അവസാനം വരെ മുഴുവൻ പ്രക്രിയയും വളരെ സുഗമമായിരുന്നു. ഞങ്ങളുടെ ആവശ്യങ്ങൾ മനസ്സിലാക്കി ശരിയായ സിസ്റ്റം നിർദേശിക്കുകയും എല്ലാ കാര്യങ്ങളും സമയബന്ധിതമായി പൂർത്തിയാക്കുകയും ചെയ്തു. ടീമിന്റെ സമീപനവും സേവനവും വളരെ മികച്ചതായിരുന്നു."',
      },
      {
        systemSize: "5 kW System",
        installedDate: "മാർച്ച് 2025",
        quote:
          '"സോളാർ സ്ഥാപിച്ചതോടെ ഞങ്ങളുടെ വൈദ്യുതി ചെലവുകൾ കൂടുതൽ നിയന്ത്രണവിധേയമായി. എല്ലാ ഘട്ടങ്ങളിലും വ്യക്തമായ വിവരങ്ങൾ ലഭിച്ചു. KSEB നടപടികളും സാങ്കേതിക കാര്യങ്ങളും ടീം വളരെ പ്രൊഫഷണലായി കൈകാര്യം ചെയ്തു."',
      },
      {
        systemSize: "5 kW System",
        installedDate: "മേയ് 2024",
        quote:
          '"വിൽപ്പനയ്ക്കായി അധിക വാഗ്ദാനങ്ങൾ നൽകാതെ, ഞങ്ങൾക്ക് യഥാർത്ഥത്തിൽ അനുയോജ്യമായ സിസ്റ്റം നിർദേശിച്ചതാണ് ഏറ്റവും ഇഷ്ടപ്പെട്ടത്. പ്ലാനിംഗ് മുതൽ ഇൻസ്റ്റലേഷൻ വരെ മുഴുവൻ പ്രക്രിയയും സുതാര്യവും വിശ്വസ്തതയുള്ളതുമായിരുന്നു."',
      },
    ],
    savesLabel: "പ്രതിമാസ ലാഭം ₹{amount}",
    qrTitle: "📹 കേരളത്തിലെ ഉപഭോക്താക്കളുടെ യഥാർത്ഥ അനുഭവങ്ങൾ കാണൂ",
    qrBody:
      "QR Code സ്കാൻ ചെയ്ത് ആലപ്പുഴ, കൊച്ചി, തൃശ്ശൂർ എന്നിവിടങ്ങളിലെ ഉപഭോക്താക്കളുടെ അനുഭവങ്ങൾ വീഡിയോയായി കാണാം. അവരുടെ വീടുകളിലെ Solar ഇൻസ്റ്റലേഷനും ലഭിച്ച ലാഭവും നേരിട്ട് അറിയുക.",
  },
  page7: {
    titleBold: "സാങ്കേതിക വിവരങ്ങൾ",
    titleSuffix: "",
    subtitle: "ഓരോ ഘടകത്തിന്റെയും വിവരങ്ങൾ വ്യക്തമായി അവതരിപ്പിക്കുന്നു.",
    itemsHeader: "ഇനങ്ങൾ",
    premiumName: "പ്രീമിയം സിസ്റ്റം",
    smartName: "സ്മാർട്ട് സിസ്റ്റം",
    basicName: "ബേസിക് സിസ്റ്റം",
    specLabels: [
      "സോളാർ പാനൽ ബ്രാൻഡ്",
      "പാനൽ ശേഷിയും ടൈപ്പും",
      "പാനൽ വാറന്റി",
      "ഇൻവെർട്ടർ ടൈപ്പ്",
      "ഇൻവെർട്ടർ ബ്രാൻഡും വാറന്റിയും",
      "മൗണ്ടിംഗ് സ്ട്രക്ചർ",
      "ACDB / DCDB",
      "DC Cable (mm²)",
      "AC Cable (sqmm)",
      "Earthing Wire",
      "Earthing Wire",
    ],
    totalSystemCost: "ആകെ സിസ്റ്റം വില",
    subsidyAmount: "Subsidy തുക",
    totalAfterSubsidy: "Subsidy കഴിഞ്ഞുള്ള അന്തിമ വില",
  },
  page8: {
    title: "കാലക്രമേണ ഉള്ള ലാഭം",
    monthlyBillReduction: "നിങ്ങളുടെ വൈദ്യുതി ബില്ലിലെ കുറവ്",
    monthlySavings: "പ്രതിമാസ ലാഭം",
    netSavings25: "25 വർഷത്തെ ആകെ ലാഭം",
    keyTakeaway: "",
    keyTakeawayBody:
      "ഏകദേശം 25 മാസത്തിനുള്ളിൽ നിങ്ങളുടെ സോളാർ സിസ്റ്റം സ്ഥാപിക്കാനുള്ള ചിലവ് തിരികെ കണ്ടെത്താം.",
    withoutSolar: "Solar ഇല്ലെങ്കിൽ",
    withSolarLabel: "Solar ഉണ്ടെങ്കിൽ",
    foreverIncreasing: "(2 മാസത്തെ KSEB ബിൽ)",
    paidToKsebAmount: "₹{amount} ലക്ഷത്തിലധികം",
    paidToKsebText: "KSEB-യ്ക്ക് നൽകേണ്ടി വരും",
    billIncreasesText: "വൈദ്യുതി നിരക്ക് വർഷംതോറും",
    billIncreasesValue: "8-12% വർധിക്കും",
    noOwnership: "സ്വന്തമായി വൈദ്യുതി ഉൽപ്പാദനം ഇല്ല",
    savedAmount: "25 വർഷത്തിൽ ഏകദേശം ₹{amount} ലക്ഷം",
    savedText: "വരെ ലാഭം",
    protectedFromText: "ഭാവിയിലെ വൈദ്യുതി നിരക്ക് വർധനവിൽ നിന്നും",
    protectedFromValue: "സംരക്ഷണം",
    ownYourPowerText: "25+ വർഷ",
    ownYourPowerValue: "Warranty സംരക്ഷണം",
    bookNow: "ഇപ്പോൾ ബുക്ക് ചെയ്യൂ",
    bankTransfer: "ബാങ്ക് ട്രാൻസ്ഫർ",
    bankLabel: "ബാങ്ക്:",
    accountNameLabel: "അക്കൗണ്ട് നെയിം:",
    accountNoLabel: "അക്കൗണ്ട് നമ്പർ:",
    refNote: "UPI Ref / NEFT Ref നമ്പർ നിങ്ങളുടെ Project ID ആയി പരിഗണിക്കും",
    requiredDocuments: "ആവശ്യമായ രേഖകൾ",
    documentsLeft: [
      "ബാങ്ക് അക്കൗണ്ട് വിവരങ്ങൾ",
      "അഡ്രസ് പ്രൂഫ് (Address Proof)",
      "ഭൂനികുതി / കെട്ടിട നികുതി രസീത്",
      "KSEB ഫീസിബിലിറ്റി റിപ്പോർട്ട്",
    ],
    documentsRight: [
      "ആധാർ കാർഡും PAN കാർഡും",
      "ശമ്പള സ്ലിപ്പ് / ബാങ്ക് സ്റ്റേറ്റ്മെന്റ് (ലോൺ ₹2 ലക്ഷത്തിന് മുകളിൽ ആണെങ്കിൽ)",
      "ഏറ്റവും പുതിയ 2 മാസത്തെ KSEB ബിൽ",
      "ITR (ലോൺ ₹2 ലക്ഷത്തിന് മുകളിൽ ആണെങ്കിൽ)",
    ],
    additionalStructureCost: "അധിക Structure Cost",
    additionalStructureNote: "(ആവശ്യമെങ്കിൽ)",
  },
  page9: {
    titlePart1: "ബുക്കിംഗ് മുതൽ ലാഭം വരെ —",
    titlePart2: "ഓരോ ഘട്ടവും വ്യക്തമായി",
    daysLabel: "ദിവസം",
    steps: [
      {
        day: "1",
        title: "₹5,000 നൽകി നിങ്ങളുടെ സ്ലോട്ട് ഉറപ്പാക്കൂ",
        description:
          "ഒരു ചെറിയ ബുക്കിംഗ് തുക നൽകി ഇൻസ്റ്റലേഷൻ സ്ലോട്ട് ഉറപ്പാക്കുകയും, സാങ്കേതിക പരിശോധന ആരംഭിക്കുകയും ചെയ്യും.",
      },
      {
        day: "3-4",
        title: "സൈറ്റ് പരിശോധനയും ഡോക്യുമെന്റേഷൻ നടപടികളും",
        description:
          "ഞങ്ങളുടെ ടീം നിങ്ങളുടെ വീടും മേൽക്കൂരയും പരിശോധിക്കും. ആവശ്യമായ അളവുകളും രേഖകളും ഞങ്ങൾ കൈകാര്യം ചെയ്യും.",
      },
      {
        day: "5-7",
        title: "പേയ്‌മെന്റും മെറ്റീരിയൽ ഡെലിവറിയും",
        description:
          "സോളാർ പാനൽ, ഇൻവെർട്ടർ, സ്ട്രക്ചർ എന്നിവ സൈറ്റിലെത്തിക്കും. തുടർന്ന് ഇൻസ്റ്റലേഷൻ ഘട്ടത്തിലെ പേയ്‌മെന്റ് പൂർത്തിയാക്കാം.",
      },
      {
        day: "9-13",
        title: "ഇൻസ്റ്റലേഷൻ",
        description:
          "സിസ്റ്റത്തിന്റെ മുഴുവൻ ഇൻസ്റ്റലേഷനും ഞങ്ങൾ നിർവഹിക്കും. ഇൻസ്റ്റലേഷൻ പൂർത്തിയായാൽ നിങ്ങളുടെ Solar System ഉൽപ്പാദിപ്പിക്കാൻ തുടങ്ങും.",
      },
      {
        day: "14",
        title: "കമ്മീഷനിംഗും ഉപഭോക്തൃ പരിശീലനവും",
        description:
          "സിസ്റ്റം പ്രവർത്തനക്ഷമമാക്കി ഉപയോഗ രീതികൾ, സുരക്ഷാ നിർദേശങ്ങൾ, അറ്റകുറ്റപ്പണികൾ എന്നിവ വിശദീകരിക്കും.",
      },
      {
        day: "15-17",
        title: "Net Meter ഇൻസ്റ്റലേഷനും ആക്ടിവേഷനും",
        description:
          "Net Meter സ്ഥാപിച്ച് Grid-ലേക്ക് കണക്ട് ചെയ്യും. തുടർന്ന് Solar വഴി വൈദ്യുതി ഉപയോഗം ആരംഭിക്കാം.",
      },
    ],
    refundTitle: "KSEB-യിൽ നിന്ന് ലഭിക്കുന്ന റീഫണ്ട്",
    refundNote:
      "രജിസ്ട്രേഷൻ ഫീസിന്റെ Pre-Tax തുകയുടെ 80% വരെ KSEB-യിൽ നിന്ന് തിരികെ ലഭിക്കും. (₹1,000 per kW + 18% GST അടിസ്ഥാനത്തിൽ)",
    refundValue: "5 kW സിസ്റ്റത്തിന് ഏകദേശം ₹4,000 വരെ റീഫണ്ട്",
    whatWeHandle: "ഞങ്ങൾ കൈകാര്യം ചെയ്യുന്നത്",
    whatYouNeedToDo: "നിങ്ങൾ ചെയ്യേണ്ടത് ( CUSTOMER SCOPE)",
    weHandle: [
      "നിങ്ങളുടെ വീടിന് അനുയോജ്യമായ Solar System ഡിസൈനിംഗ്",
      "നിഴൽ പരിശോധനയും പാനൽ സ്ഥാപിക്കാനുള്ള മികച്ച സ്ഥാനം കണ്ടെത്തലും",
      "Solar Panel, Inverter, Structure, BOQ എന്നിവയുടെ ക്രമീകരണം",
      "ആവശ്യമായ എല്ലാ ഉപകരണങ്ങളുടെയും ഇൻസ്റ്റലേഷൻ",
      "സിസ്റ്റം പരിശോധന, കമ്മീഷനിംഗ്, ആവശ്യമായ അനുമതി നടപടികൾ",
      "Solar Meter ഇൻസ്റ്റലേഷൻ ഉൾപ്പെടെയുള്ള DC Side ജോലികൾ",
      "സിസ്റ്റത്തിന്റെ ഉപയോഗം, സുരക്ഷ, പരിപാലനം എന്നിവയെക്കുറിച്ചുള്ള പരിശീലനം",
    ],
    youNeedToDo: [
      "നിഴൽ ഇല്ലാത്ത മേൽക്കൂരയും ഇൻവെർട്ടറിനായി സുരക്ഷിതമായ സ്ഥലവും ഒരുക്കുക",
      "വെള്ളം, വൈദ്യുതി, സ്റ്റോറേജ് സൗകര്യം, സൈറ്റ് ആക്‌സസ് എന്നിവ ലഭ്യമാക്കുക",
      "Internet Connection, CT/AC Components തുടങ്ങിയ ആവശ്യമായ സാങ്കേതിക സൗകര്യങ്ങൾ ഒരുക്കുക (ആവശ്യമെങ്കിൽ)",
      "Net Metering, Load Enhancement, Name Change, Ownership Transfer തുടങ്ങിയ KSEB നടപടികൾ പൂർത്തിയാക്കുക (ബാധകമെങ്കിൽ)",
      "KSEB അല്ലെങ്കിൽ മറ്റ് അധികാരികൾ ഈടാക്കുന്ന ഫീസ്, ഡെപ്പോസിറ്റ്, രജിസ്ട്രേഷൻ ചാർജുകൾ എന്നിവ അടക്കുക",
      "Civil Work, Roof Repair, Waterproofing, Structural Modification, Trenching, Masonry Work തുടങ്ങിയ ജോലികൾ ക്വട്ടേഷനിൽ ഉൾപ്പെടുത്തിയിട്ടില്ലെങ്കിൽ ഉപഭോക്താവിന്റെ ഉത്തരവാദിത്വമായിരിക്കും.",
    ],
  },
  page10: {
    title: "നിബന്ധനകളും വ്യവസ്ഥകളും",
    terms: [
      {
        title: "1. വാറന്റി :",
        body: "Golden Ray Renewable Energy നൽകുന്ന മുഴുവൻ Solar System-നും നിർമ്മാണപരമായും സാങ്കേതികപരമായും ഉണ്ടാവാവുന്ന തകരാറുകൾക്കെതിരെ 5 വർഷത്തെ വാറന്റി ലഭിക്കും. പാനൽ, ഇൻവെർട്ടർ, മറ്റ് ഉപകരണങ്ങൾ എന്നിവയ്ക്ക് അതത് നിർമ്മാതാക്കൾ നൽകുന്ന വാറന്റി ബാധകമായിരിക്കും.",
      },
      {
        title: "2. വാറന്റിയിൽ ഉൾപ്പെടാത്തവ :",
        body: "തെറ്റായ ഉപയോഗം, അശ്രദ്ധ, അനധികൃത മാറ്റങ്ങൾ, മൂന്നാം കക്ഷികളുടെ ഇടപെടൽ, തെറ്റായ പരിപാലനം, അപകടങ്ങൾ, മിന്നൽ, വെള്ളപ്പൊക്കം, ഉരുൾപൊട്ടൽ, പ്രകൃതി ദുരന്തങ്ങൾ, വൈദ്യുതി ലൈൻ സർജുകൾ എന്നിവ മൂലമുള്ള കേടുപാടുകൾ വാറന്റിയിൽ ഉൾപ്പെടുന്നതല്ല.",
      },
      {
        title: "3. ഉപഭോഗ വസ്തുക്കൾ (Consumables) :",
        body: "Fuse, SPD (Surge Protection Device), Connectors എന്നിവയുൾപ്പെടെയുള്ള ഉപഭോഗ വസ്തുക്കൾ വാറന്റിയിൽ ഉൾപ്പെടില്ല. സാധാരണ പരിപാലനത്തിന്റെ ഭാഗമായി ഇവ ആവശ്യാനുസരണം മാറ്റിസ്ഥാപിക്കേണ്ടതാണ്.",
      },
      {
        title: "4. ഉപഭോക്താവിന്റെ ഉത്തരവാദിത്തങ്ങൾ :",
        body: "Solar Panel സ്ഥാപിക്കുന്ന നിഴൽ തടസ്സമില്ലാത്ത സ്ഥലം, ഇൻവെർട്ടറിനും മറ്റ് ഉപകരണങ്ങൾക്കും ആവശ്യമായ ഇടം എന്നിവ ഉപഭോക്താവ് ഒരുക്കണം. വെള്ളം, ഇന്റർനെറ്റ്, സൈറ്റ് ആക്‌സസ്, ലോഡിംഗ്/അൺലോഡിംഗ് സൗകര്യങ്ങൾ എന്നിവയും ഉപഭോക്താവിന്റെ ഉത്തരവാദിത്തമാണ്. വാഹന പ്രവേശനം ലഭ്യമല്ലെങ്കിൽ ആവശ്യമായ ആളുകളെയോ മറ്റ് സൗകര്യങ്ങളെയോ ഉപഭോക്താവ് ഒരുക്കണം.",
      },
      {
        title: "5. സേവനവും പരിശീലനവും :",
        body: "സിസ്റ്റം പ്രവർത്തനം ആരംഭിക്കുന്ന സമയത്ത് അടിസ്ഥാന സേവന-പരിപാലന പരിശീലനം നൽകും. ഇൻവെർട്ടർ അറ്റകുറ്റപ്പണി നടക്കുന്ന സമയത്ത്, ലഭ്യതയ്ക്ക് വിധേയമായി Standby Inverter Support നൽകാവുന്നതാണ്.",
      },
      {
        title: "6. പണമടയ്ക്കൽ നിബന്ധനകൾ :",
        body: "Quotation-ൽ വ്യക്തമാക്കിയിരിക്കുന്ന Payment Schedule അനുസരിച്ച് ഓരോ ഘട്ടവും പൂർത്തിയാകുമ്പോൾ പണമടയ്ക്കണം. Scope മാറ്റങ്ങൾ, അധിക ജോലികൾ, മെറ്റീരിയൽ വ്യത്യാസങ്ങൾ എന്നിവ മൂലമുള്ള അധിക തുക ബന്ധപ്പെട്ട ജോലി ആരംഭിക്കുന്നതിന് മുമ്പ് അടയ്ക്കേണ്ടതാണ്. Quotation അംഗീകരിച്ചതിന് ശേഷം വില അന്തിമമായി കണക്കാക്കും. പിന്നീട് വിലക്കുറവ്, ഡിസ്‌കൗണ്ട്, പുനഃചർച്ച എന്നിവ അനുവദിക്കില്ല. പണമടയ്ക്കൽ കമ്പനിയുടെ ഔദ്യോഗിക ബാങ്ക് അക്കൗണ്ടിലേക്ക് മാത്രമേ നടത്താവൂ. അർഹമായ Refund-കൾ 7 പ്രവൃത്തി ദിവസത്തിനുള്ളിൽ നൽകുന്നതാണ്.",
      },
      {
        title: "7. വില വ്യത്യാസങ്ങൾ :",
        body: "കരാറനുസരിച്ചുള്ള പണമടയ്ക്കൽ വൈകുകയാണെങ്കിൽ, തൊഴിൽ ചെലവ്, മെറ്റീരിയൽ വില, നികുതി, സർക്കാർ ഫീസ് എന്നിവയിലെ വർധനവ് ഉപഭോക്താവിൽ നിന്ന് ഈടാക്കും.",
      },
      {
        title: "8. GST & നികുതി മാറ്റങ്ങൾ :",
        body: "Quotation നൽകുന്ന സമയത്തെ GSTയും മറ്റ് നികുതികളും ഉൾപ്പെടുത്തിയതാണ് വില. പിന്നീട് സർക്കാർ നികുതികളിൽ മാറ്റമുണ്ടായാൽ അത് അന്തിമ ബില്ലിൽ ഉൾപ്പെടുത്തും.",
      },
      {
        title: "9. സിസ്റ്റം സ്ഥിരീകരണം :",
        body: "സിസ്റ്റം ശേഷി, പാനൽ മോഡൽ, ഇൻവെർട്ടർ മോഡൽ, Quotation എന്നിവ ഉപഭോക്താവ് അംഗീകരിച്ച ശേഷം മാറ്റങ്ങൾ വരുത്തുന്നത് അധിക ചെലവിനും കാലതാമസത്തിനും കാരണമായേക്കാം.",
      },
    ],
  },
  page101: {
    terms: [
      {
        title: "10. പദ്ധതി പൂർത്തീകരണ സമയം :",
        body: "Quotation-ൽ പറഞ്ഞ സമയപരിധിക്കുള്ളിൽ പദ്ധതി പൂർത്തിയാക്കാൻ ഞങ്ങൾ ശ്രമിക്കും. എന്നാൽ സർക്കാർ അനുമതികൾ, കാലാവസ്ഥ, ഗതാഗത പ്രശ്നങ്ങൾ, ഷിപ്പിംഗ് വൈകൽ തുടങ്ങിയ നിയന്ത്രണാതീത സാഹചര്യങ്ങൾ ഉണ്ടാകുന്ന കാലതാമസത്തിൽ കമ്പനി ഉത്തരവാദിയായിരിക്കില്ല.",
      },
      {
        title: "11. KSEB & നിയമപരമായ നടപടികൾ :",
        body: "KSEB-യുമായി ബന്ധപ്പെട്ട അപേക്ഷകൾക്കും നടപടികൾക്കും കമ്പനി സഹായം നൽകും. എന്നാൽ Load Enhancement, Tariff Change, Name Change, Ownership Transfer, Meter Shifting തുടങ്ങിയവയുമായി ബന്ധപ്പെട്ട എല്ലാ ചെലവുകളും ഉപഭോക്താവാണ് വഹിക്കേണ്ടത്.",
      },
      {
        title: "12. സർക്കാർ സബ്‌സിഡി :",
        body: "സബ്‌സിഡി പദ്ധതികൾ, അർഹതാ മാനദണ്ഡങ്ങൾ, അംഗീകാര നടപടികൾ, പണമടയ്ക്കൽ സമയം എന്നിവ സർക്കാർ നയങ്ങൾക്ക് വിധേയമാണ്. സബ്‌സിഡി വൈകുക, കുറയുക, നിരസിക്കപ്പെടുക തുടങ്ങിയ കാര്യങ്ങൾക്ക് കമ്പനി ഉത്തരവാദിയായിരിക്കില്ല.",
      },
      {
        title: "13. ഡാറ്റാ സ്വകാര്യത :",
        body: "സിസ്റ്റത്തിൽ നിന്നോ Remote Monitoring Platform-കളിൽ നിന്നോ ലഭിക്കുന്ന ഉപഭോക്തൃ വിവരങ്ങളും ഉൽപ്പാദന വിവരങ്ങളും കമ്പനി നിരീക്ഷിക്കാനും രേഖപ്പെടുത്താനും ഉപയോഗിക്കാനും അധികാരമുള്ളതാണ്. Warranty, Service Support, ഗവേഷണം, സേവന മെച്ചപ്പെടുത്തൽ, പ്രചാരണ പ്രവർത്തനങ്ങൾ എന്നിവയ്ക്കായി ബന്ധപ്പെട്ട സ്ഥാപനങ്ങളുമായി ഈ വിവരങ്ങൾ പങ്കിടാവുന്നതാണ്.",
      },
      {
        title: "14. അധിക ചെലവുകളും സിവിൽ ജോലികളും :",
        body: "Quotation-ൽ പ്രത്യേകം ഉൾപ്പെടുത്തിയിട്ടില്ലെങ്കിൽ KSEB Fees, Registration, Documentation, Net Meter Charges, അധിക Structure, Cable Extension, Foundation Work, Roof Repair, Waterproofing, Painting, Trenching, Masonry Work തുടങ്ങിയ ചെലവുകൾ ഉപഭോക്താവ് വഹിക്കേണ്ടതാണ്.",
      },
      {
        title: "15. ഉടമസ്ഥാവകാശം :",
        body: "കമ്പനി നൽകുന്ന എല്ലാ മെറ്റീരിയലുകളും ഉപകരണങ്ങളും പൂർണ്ണമായും പണമടയ്ക്കുന്നതുവരെ കമ്പനിയുടെ ഉടമസ്ഥതയിൽ തുടരും. എല്ലാ കുടിശ്ശികയും തീർത്തതിന് ശേഷം ഉടമസ്ഥാവകാശം ഉപഭോക്താവിലേക്ക് മാറ്റപ്പെടും.",
      },
      {
        title: "16. ബാധ്യതാ പരിമിതി :",
        body: "Solar System ഉപയോഗിക്കുന്നതിലൂടെ ഉണ്ടാകുന്ന ലാഭനഷ്ടം, വരുമാന നഷ്ടം, പരോക്ഷ നഷ്ടങ്ങൾ തുടങ്ങിയവയ്ക്ക് കമ്പനി ഉത്തരവാദിയായിരിക്കില്ല. പ്രവർത്തന നിർദേശങ്ങൾ പാലിക്കാത്തതിൽ നിന്നുള്ള പ്രശ്നങ്ങൾ ഇതിൽ ഉൾപ്പെടുന്നു.",
      },
      {
        title: "17. നിയന്ത്രണാതീത സാഹചര്യങ്ങൾ (Force Majeure) :",
        body: "പ്രകൃതി ദുരന്തങ്ങൾ, പണിമുടക്ക്, ഗതാഗത തടസ്സങ്ങൾ, സർക്കാർ ഉത്തരവുകൾ, നിയമപരമായ മാറ്റങ്ങൾ തുടങ്ങിയ നിയന്ത്രണാതീത സാഹചര്യങ്ങൾ മൂലമുള്ള കാലതാമസത്തിനും പ്രവർത്തന തടസ്സങ്ങൾക്കും കമ്പനി ഉത്തരവാദിയായിരിക്കില്ല.",
      },
      {
        title: "18. രഹസ്യാത്മകത :",
        body: "പദ്ധതിയുമായി ബന്ധപ്പെട്ട വാണിജ്യ-സാങ്കേതിക വിവരങ്ങൾ ഇരുകൂട്ടരും രഹസ്യമായി സൂക്ഷിക്കണം. നിയമപരമായി ആവശ്യമായ സാഹചര്യങ്ങൾ ഒഴികെ മൂന്നാം കക്ഷികളുമായി വിവരങ്ങൾ പങ്കിടാൻ പാടില്ല.",
      },
      {
        title: "19. നിയമപരമായ അധികാരപരിധി :",
        body: "ഈ Quotation-നും അതുമായി ബന്ധപ്പെട്ട എല്ലാ കരാറുകൾക്കും ഇന്ത്യൻ നിയമങ്ങൾ ബാധകമാണ്. തർക്കങ്ങൾ ഉണ്ടാകുമ്പോൾ കേരളത്തിലെ കോടതികളുടെ അധികാരപരിധിയിലായിരിക്കും അവ പരിഗണിക്കുക.",
      },
    ],
  },
  page11: {
    title: "നിങ്ങളുടെ നിക്ഷേപത്തിന്റെ സംഗ്രഹം",
    subtitle: "ഒറ്റ തീരുമാനം — വർഷങ്ങളോളം ലാഭം",
    packageHeader: "5 kW സോളാർ സിസ്റ്റം — ശുപാർശ ചെയ്യുന്ന പാക്കേജ്",
    systemCostPreSubsidy: "സിസ്റ്റത്തിന്റെ മൊത്തം വില (സബ്‌സിഡിക്ക് മുമ്പ്)",
    pmSuryaGharSubsidy: "പി.എം. സൂര്യ ഘർ സബ്‌സിഡി",
    yourInvestment: "നിങ്ങളുടെ നിക്ഷേപം",
    monthlySavings: "പ്രതിമാസ ലാഭം",
    paybackPeriod: "നിക്ഷേപം തിരികെ ലഭിക്കാൻ വേണ്ട സമയം",
    netSavings25: "25 വർഷത്തെ മൊത്തം ലാഭം",
    emiOption: "EMI പദ്ധതി (5 വർഷം, ഏകദേശം 9%)",
    netMonthlyDuringEmi: "EMI അടയ്ക്കുന്ന കാലത്തും പ്രതിമാസ ലാഭം",
    netMonthlyValue: "+₹{min}–{max} ആദ്യ മാസം മുതൽ ലാഭം",
    netMonthlyValuePlain: "₹{min}–{max}",
    readyTitle: "💡 പവർ കട്ട് സമയത്തും വൈദ്യുതി ഉറപ്പാക്കാം.",
    readySubtitle:
      "ഹൈബ്രിഡ് സോളാർ സിസ്റ്റത്തെക്കുറിച്ച് കൂടുതൽ അറിയാം ഇപ്പോൾ തന്നെ വിളിക്കൂ — കേരളത്തിലെ വീടുകൾ കൂടുതൽ തിരഞ്ഞെടുക്കുന്ന പുതിയ പരിഹാരം.",
    priorityTitle: "10 ദിവസത്തിനുള്ളിൽ മുൻഗണനാ ഇൻസ്റ്റലേഷൻ",
    prioritySubtitle: "വേഗത്തിലുള്ള ഷെഡ്യൂളിംഗും ഇൻസ്റ്റലേഷനും",
    offerValid: "{date}-ന് മുമ്പ് ബുക്കിംഗ് സ്ഥിരീകരിക്കുന്നവർക്ക് മാത്രം",
    badgeMnre: "MNRE അംഗീകൃത സ്ഥാപനം",
    badgeHomes: "300+ വീടുകളുടെ വിശ്വാസം",
    badgeRating: "ഗൂഗിളിൽ 4.9★ റേറ്റിംഗ്",
  },
};
// ml:end

const translations: Record<QuotationLanguage, QuotationTranslation> = {
  English: {},
  Malayalam: ml,
};

/** Resolve the catalog for a language, falling back to English key by key. */
export function getQuotationStrings(
  language: QuotationLanguage,
): QuotationStrings {
  const overrides = translations[language] ?? {};

  const merge = <K extends keyof QuotationStrings>(
    page: K,
  ): QuotationStrings[K] =>
    ({ ...en[page], ...(overrides[page] ?? {}) }) as QuotationStrings[K];

  return {
    page1: merge("page1"),
    page2: merge("page2"),
    page3: merge("page3"),
    page4: merge("page4"),
    page41: merge("page41"),
    page6: merge("page6"),
    page7: merge("page7"),
    page8: merge("page8"),
    page9: merge("page9"),
    page10: merge("page10"),
    page101: merge("page101"),
    page11: merge("page11"),
  };
}

/** Replace `{placeholder}` tokens in a catalog string with runtime values. */
export function fill(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in values ? String(values[key]) : match,
  );
}

export const englishQuotationStrings = en;
