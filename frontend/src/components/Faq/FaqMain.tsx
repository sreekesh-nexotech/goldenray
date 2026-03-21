"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import PageIllustration from "@/components/ui/page-illustration";
import Link from "next/link";

// FAQ Categories and their questions
const faqCategories = [
  {
    id: "most-asked",
    name: "Most Asked Questions",
    questions: [
      {
        question: "Is subsidy deducted from the system cost?",
        answer:
          "No, the subsidy is not deducted from the system cost upfront.\n You pay the full system amount at the time of installation. After successful installation and approval, the government subsidy is processed and credited directly to your bank account as per official timelines",
      },
      {
        question: "Is subsidy deducted from the system cost?",
        answer:
          "No, the subsidy is not deducted from the system cost upfront.\n You pay the full system amount at the time of installation. After successful installation and approval, the government subsidy is processed and credited directly to your bank account as per official timelines",
      },
      {
        question: "Is subsidy deducted from the system cost?",
        answer:
          "No, the subsidy is not deducted from the system cost upfront.\n You pay the full system amount at the time of installation. After successful installation and approval, the government subsidy is processed and credited directly to your bank account as per official timelines",
      },
      {
        question: "Is subsidy deducted from the system cost?",
        answer:
          "No, the subsidy is not deducted from the system cost upfront.\n You pay the full system amount at the time of installation. After successful installation and approval, the government subsidy is processed and credited directly to your bank account as per official timelines",
      },
      {
        question: "Is subsidy deducted from the system cost?",
        answer:
          "No, the subsidy is not deducted from the system cost upfront.\n You pay the full system amount at the time of installation. After successful installation and approval, the government subsidy is processed and credited directly to your bank account as per official timelines",
      },
      {
        question: "Is subsidy deducted from the system cost?",
        answer:
          "No, the subsidy is not deducted from the system cost upfront.\n You pay the full system amount at the time of installation. After successful installation and approval, the government subsidy is processed and credited directly to your bank account as per official timelines",
      },
      {
        question: "Is subsidy deducted from the system cost?",
        answer:
          "No, the subsidy is not deducted from the system cost upfront.\n You pay the full system amount at the time of installation. After successful installation and approval, the government subsidy is processed and credited directly to your bank account as per official timelines",
      },
    ],
  },
  {
    id: "subsidy",
    name: "Subsidy & Government",
    questions: [
      {
        question: "Who is eligible for PM Surya Ghar subsidy?",
        answer:
          "Any Indian citizen with a valid electricity connection and roof ownership can apply. The property must be residential, and you should have a sanctioned load of at least 1kW. Both individual homes and housing societies are eligible.",
      },
      {
        question: "How do I apply for the solar subsidy?",
        answer:
          "Apply through the National Portal for Rooftop Solar (pmsuryaghar.gov.in). Register with your electricity consumer number, choose a registered vendor like Flarize, complete installation, and the subsidy gets credited directly to your bank account within 30 days of DISCOM approval.",
      },
      {
        question: "Is the subsidy available for commercial properties?",
        answer:
          "No, the PM Surya Ghar Yojana subsidy is only for residential properties. However, commercial and industrial installations benefit from accelerated depreciation (40% in year one) and tax deductions that often deliver faster ROI than the residential subsidy.",
      },
      {
        question: "What documents are needed for subsidy?",
        answer:
          "You need: Aadhaar card, electricity bill, bank account details (for subsidy credit), property ownership proof, and passport-size photos. Flarize helps you compile and submit all documentation.",
      },
    ],
  },
  {
    id: "cost",
    name: "Cost & Savings",
    questions: [
      {
        question: "What is the cost of a home solar system?",
        answer:
          "A 3kW system costs ₹1.85–₹2.15 lakh before subsidy. After the ₹78,000 MNRE subsidy, net cost is approximately ₹1.1–₹1.4 lakh. Price varies by panel brand, inverter type, and roof structure. EMI options available from ₹2,000/month.",
      },
      {
        question: "What is the payback period for solar?",
        answer:
          "With current electricity rates and subsidies, most systems pay for themselves in 4-5 years. After that, you enjoy nearly free electricity for another 20+ years. Total lifetime savings can exceed ₹8-10 lakhs.",
      },
      {
        question: "Are there financing options available?",
        answer:
          "Yes! Flarize partners with banks and NBFCs to offer solar loans with EMIs starting at ₹2,000/month. Many customers find their EMI is less than their previous electricity bill, making solar cash-flow positive from day one.",
      },
      {
        question: "What happens to excess power I generate?",
        answer:
          "With net metering, excess power is exported to the KSEB grid and credited to your account. You get paid or credited for every unit you export. This ensures you benefit from every bit of solar energy your system produces.",
      },
    ],
  },
  {
    id: "installation",
    name: "Installation Process",
    questions: [
      {
        question: "What happens during installation?",
        answer:
          "Our team conducts a site survey, designs your system, handles permits, installs mounting structures and panels, connects the inverter and wiring, tests the system, and coordinates KSEB inspection. You're kept updated at every step.",
      },
      {
        question: "Will installation damage my roof?",
        answer:
          "No. We use non-penetrating mounting systems wherever possible. For RCC roofs, we use weather-sealed fasteners. For sheet roofs, specialized clamps are used. All installations are weatherproofed and don't void roof warranties.",
      },
      {
        question: "How much roof space do I need?",
        answer:
          "Approximately 100 sq ft per kW. A typical 3kW system needs about 300 sq ft of shadow-free roof area. We assess your roof during the free site survey and design the optimal layout.",
      },
      {
        question: "Can solar be installed on any roof type?",
        answer:
          "Yes! We install on RCC/concrete, metal sheet, tile, and even ground-mounted systems. Each roof type has specific mounting solutions. Our engineers design the best approach for your specific roof.",
      },
    ],
  },
  {
    id: "eligibility",
    name: "Eligibility & Requirements",
    questions: [
      {
        question: "What is the minimum system size I can install?",
        answer:
          "The minimum recommended size is 1kW, which requires about 100 sq ft of roof space. However, to maximize subsidy benefits and savings, we typically recommend 3kW or higher for average households.",
      },
      {
        question: "Can tenants install solar panels?",
        answer:
          "Tenants need written consent from the property owner. The electricity connection must be in the applicant's name for subsidy eligibility. Some landlords and tenants work out shared arrangements.",
      },
      {
        question: "Is my home suitable for solar?",
        answer:
          "Most homes are suitable. Key requirements: adequate shadow-free roof space, structural integrity to support panels (minimal - about 15kg per panel), and a valid electricity connection. Our free site survey confirms suitability.",
      },
      {
        question: "What if I have trees shading my roof?",
        answer:
          "Partial shading can be managed with microinverters or optimizers that minimize production loss. We analyze shading patterns during site survey and design around obstacles. In some cases, trimming branches significantly improves output.",
      },
    ],
  },
  {
    id: "technical",
    name: "Technical & Monitoring",
    questions: [
      {
        question: "How do I monitor my solar system?",
        answer:
          "All our systems come with smartphone apps that show real-time generation, daily/monthly production, savings, and system health. You can track performance from anywhere and get alerts for any issues.",
      },
      {
        question: "What is net metering and how does it work?",
        answer:
          "Net metering allows you to export excess solar power to the grid and receive credits. Your meter runs backward when exporting. At billing time, you only pay for net consumption (usage minus export). KSEB settles any excess credits annually.",
      },
      {
        question: "What happens during a power outage?",
        answer:
          "Standard on-grid systems shut down during outages for safety (to protect utility workers). For backup power during outages, you need a hybrid system with battery storage. We recommend the right setup based on your needs.",
      },
      {
        question: "What is the difference between on-grid and hybrid systems?",
        answer:
          "On-grid systems connect to KSEB, use net metering, and are most cost-effective but don't work during outages. Hybrid systems include batteries for backup power during outages. Hybrid costs more but provides energy independence.",
      },
    ],
  },
  {
    id: "support",
    name: "After-Sales & Support",
    questions: [
      {
        question: "What warranty do I get?",
        answer:
          "Flarize provides: 25-year performance warranty on panels, 5-10 year warranty on inverters (brand dependent), 10-year comprehensive warranty covering workmanship, and lifetime support through our platform.",
      },
      {
        question: "What maintenance is required?",
        answer:
          "Minimal maintenance: clean panels every 3-6 months (more frequently during dusty periods) and one annual check-up. Flarize provides scheduled maintenance, performance monitoring, and fast repairs as part of our service.",
      },
      {
        question: "What if my system underperforms?",
        answer:
          "Our monitoring system alerts us to any performance issues. If generation drops below expected levels, our team investigates and fixes the issue — whether it's cleaning, component replacement, or technical adjustment. All covered under warranty.",
      },
      {
        question: "Can I upgrade my system later?",
        answer:
          "Yes! Systems can be expanded if you have additional roof space and your inverter supports it. We design systems with future expansion in mind. Adding capacity is straightforward and you remain eligible for additional subsidies on the expansion.",
      },
    ],
  },
];

// Quick filter options
const quickFilters = [
  { id: "subsidy", label: "I want subsidy info", categoryId: "subsidy" },
  { id: "savings", label: "I want to reduce my bill", categoryId: "cost" },
  {
    id: "installation",
    label: "I want to know installation steps",
    categoryId: "installation",
  },
  { id: "existing", label: "I already have solar", categoryId: "support" },
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
  const [activeCategory, setActiveCategory] = useState("most-asked");
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
