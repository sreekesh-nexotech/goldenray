"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { categoryColors, type BlogArticle } from "@/data/blog-data";

// ─── Hero ────────────────────────────────────────────────────────────────────
function BlogHero({
  count,
  lastUpdated,
}: {
  count: number;
  lastUpdated: string;
}) {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 90% 70% at 50% 0%, #F8F2E1 0%, #FFFFFF 100%)",
      }}
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(18,53,50,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(18,53,50,0.06) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-24 pb-4 md:pt-28 md:pb-6 max-w-7xl text-center">
        <p className="text-sm sm:text-base font-medium text-[#6B7280] tracking-wide mb-2">
          Knowledge Hub
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#123532] mb-3 leading-tight">
          Solar Guides &amp; Insights
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-[#444444] mb-4 max-w-xl md:max-w-2xl mx-auto leading-relaxed">
          Clear, practical guides to help you make confident solar decisions.
        </p>
        <div className="flex items-center justify-center gap-3 text-sm sm:text-base text-[#6B7280]">
          <span>{count} Guides</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#6B7280] inline-block" />
          <span>Last updated: {lastUpdated}</span>
        </div>
      </div>
    </section>
  );
}

// ─── Search + Filters ─────────────────────────────────────────────────────────
function BlogFilters({
  search,
  onSearch,
  activeCategory,
  onCategory,
  categories,
}: {
  search: string;
  onSearch: (v: string) => void;
  activeCategory: string;
  onCategory: (c: string) => void;
  categories: string[];
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-2 pb-6">
      {/* Search */}
      <div className="flex justify-center mb-6">
        <div className="relative w-full max-w-lg">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search solar guides..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm text-[#444444] placeholder-[#aaaaaa] focus:outline-none focus:ring-2 focus:ring-[#F7BA41] shadow-sm"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
              activeCategory === cat
                ? "bg-[#F7BA41] text-[#1F2937]"
                : "bg-white border border-gray-200 text-[#444444] hover:border-[#F7BA41] hover:text-[#1F2937]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Featured Post ─────────────────────────────────────────────────────────────
function FeaturedPost({ post }: { post: BlogArticle }) {
  const colorClass =
    categoryColors[post.category] ?? "bg-gray-100 text-gray-700";
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 mb-12">
      <Link href={`/blog/${post.id}`} className="block group">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          {/* Image */}
          <div className="relative h-64 md:h-auto min-h-[280px]">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {/* Content */}
          <div className="bg-white p-8 md:p-10 lg:p-12 flex flex-col justify-center">
            <span
              className={`inline-block self-start px-3 py-1 rounded-full text-xs font-semibold mb-4 ${colorClass}`}
            >
              {post.category}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#123532] mb-3 leading-snug group-hover:text-[#ED8723] transition-colors">
              {post.title}
            </h2>
            <p className="text-[#666666] text-base leading-relaxed mb-6">
              {post.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#888888] mb-6">
              <span>{post.readTime}</span>
              <span>•</span>
              <span>Updated {post.updatedDate}</span>
            </div>
            <span className="text-[#ED8723] font-semibold text-sm group-hover:underline inline-flex items-center gap-1">
              Read Guide
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ─── Blog Card ─────────────────────────────────────────────────────────────────
function BlogCard({ post }: { post: BlogArticle }) {
  const colorClass =
    categoryColors[post.category] ?? "bg-gray-100 text-gray-700";
  return (
    <Link href={`/blog/${post.id}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
        <div className="relative h-48 flex-shrink-0">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="p-5 flex flex-col flex-1">
          <span
            className={`inline-block self-start px-2.5 py-1 rounded-full text-xs font-semibold mb-3 ${colorClass}`}
          >
            {post.category}
          </span>
          <h3 className="text-base font-bold text-[#123532] mb-2 leading-snug group-hover:text-[#ED8723] transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-[#666666] text-sm leading-relaxed line-clamp-2 flex-1 mb-4">
            {post.description}
          </p>
          <div className="flex items-center justify-between text-xs text-[#888888] mt-auto">
            <span>{post.readTime}</span>
            <span>{post.updatedDate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Newsletter ─────────────────────────────────────────────────────────────────
function BlogNewsletter() {
  return (
    <section className=" py-14 px-4 sm:px-6 lg:px-8 mt-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#123532] mb-3">
          Stay Updated on Solar Policy &amp; Subsidy Changes
        </h2>
        <p className="text-[#666666] text-base mb-7">
          Get important updates directly to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full sm:w-auto flex-1 max-w-sm px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#444444] placeholder-[#aaaaaa] focus:outline-none focus:ring-2 focus:ring-[#F7BA41]"
          />
          <button className="bg-[#F7BA41] hover:bg-[#e5a934] text-[#1F2937] font-semibold px-6 py-3 rounded-xl transition-colors text-sm whitespace-nowrap">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────────────
function BlogCta() {
  const cards = [
    {
      icon: (
        <svg
          className="w-7 h-7 text-[#ED8723]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Check Subsidy Eligibility",
      description: "Find out which government subsidies you qualify for.",
      cta: "Check Eligibility",
      href: "/subsidy",
    },
    {
      icon: (
        <svg
          className="w-7 h-7 text-[#ED8723]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Estimate Your Savings",
      description: "Get a personalized solar savings estimate for your home.",
      cta: "Calculate Your Savings",
      href: "/advanced-calculator",
    },
    {
      icon: (
        <svg
          className="w-7 h-7 text-[#ED8723]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      title: "Talk to a Solar Expert",
      description: "Get free consultation from our certified solar engineers.",
      cta: "Book Call",
      href: "/contactus",
    },
  ];

  return (
    <section
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 xl:px-10"
      style={{
        background:
          "radial-gradient(100% 100% at 50% 0%, #F8F2E1 0%, rgba(255, 255, 255, 0) 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#123532] mb-3">
            Not Sure Where to Start?
          </h2>
          <p className="text-[#666666] text-base max-w-xl mx-auto">
            Let us guide you through your solar journey with personalized
            recommendations.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-2xl p-7 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-14 h-14 rounded-full bg-[#FEF3C7] flex items-center justify-center mb-5">
                {card.icon}
              </div>
              <h3 className="text-base font-bold text-[#123532] mb-2">
                {card.title}
              </h3>
              <p className="text-[#666666] text-sm leading-relaxed flex-1 mb-6">
                {card.description}
              </p>
              <Link
                href={card.href}
                className="w-full py-2.5 rounded-xl border border-[#123532] text-[#123532] text-sm font-semibold text-center hover:bg-[#123532] hover:text-white transition-colors duration-200 mt-auto"
              >
                {card.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
const INITIAL_VISIBLE = 6;

interface BlogMainProps {
  articles: BlogArticle[];
  categories: string[];
}

export default function BlogMain({ articles, categories }: BlogMainProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Guides");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const featuredPost = articles.find((a) => a.featured);

  // Derive last-updated text from the most recent article
  const lastUpdated = articles[0]?.updatedDate ?? "";

  const filteredPosts = useMemo(() => {
    return articles
      .filter((a) =>
        activeCategory === "All Guides" ? true : a.category === activeCategory,
      )
      .filter((a) =>
        search.trim()
          ? a.title.toLowerCase().includes(search.toLowerCase()) ||
            a.description.toLowerCase().includes(search.toLowerCase())
          : true,
      );
  }, [articles, search, activeCategory]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  return (
    <div className="bg-white">
      <BlogHero count={articles.length} lastUpdated={lastUpdated} />

      <BlogFilters
        search={search}
        onSearch={(v) => {
          setSearch(v);
          setVisibleCount(INITIAL_VISIBLE);
        }}
        activeCategory={activeCategory}
        onCategory={(c) => {
          setActiveCategory(c);
          setVisibleCount(INITIAL_VISIBLE);
        }}
        categories={categories}
      />

      {/* Featured Post — only show when no filter/search active */}
      {featuredPost &&
        activeCategory === "All Guides" &&
        search.trim() === "" && <FeaturedPost post={featuredPost} />}

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 mb-10">
        {visiblePosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visiblePosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-[#888888] py-16">
            No articles found for &ldquo;{search || activeCategory}&rdquo;
          </p>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setVisibleCount((v) => v + 6)}
              className="px-8 py-3 rounded-xl border border-gray-300 text-[#444444] text-sm font-semibold hover:border-[#123532] hover:text-[#123532] transition-colors duration-200"
            >
              Load More Articles
            </button>
          </div>
        )}
      </div>

      <BlogNewsletter />
      <BlogCta />
    </div>
  );
}
