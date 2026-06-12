"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import PageIllustration from "@/components/ui/page-illustration";
import Link from "next/link";
import { faqCategories } from "@/data/faq-data";

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

            {/* Citable Answer Block — first substantive paragraph below the H1 */}
            <p className="text-base w-full md:w-3/4 mx-auto sm:text-lg text-[#444444] text-left leading-relaxed mb-8">
              Kerala homeowners in 2026 can claim up to ₹78,000 under the PM
              Surya Ghar: Muft Bijli Yojana — India&apos;s only active central
              subsidy for residential rooftop solar. A 3 kW on-grid solar system
              costs ₹1,07,000–₹1,37,000 after this subsidy, with a payback
              period of 3–5 years. Solar panels in Kerala generate 12–15 units
              per day for a 3 kW system, even during the monsoon season
              (generation drops 20–30% but panels continue producing from
              ambient light). KSEB net metering allows homeowners to bank
              surplus units and settle them annually at year-end. Systems up to
              10 kW do not require battery backup. Installation through an
              MNRE-empanelled company like Flarize takes 2–3 days. The full
              process from KSEB feasibility approval to subsidy disbursement
              takes approximately 3–5 months.
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
