import Image from "next/image";
import Link from "next/link";
import type { BlogArticle } from "@/data/blog-data";
import { categoryColors } from "@/data/blog-data";

interface BlogArticleHeroProps {
  article: BlogArticle;
  author?: string;
  reviewedBy?: string;
}

export default function BlogArticleHero({
  article,
  author,
  reviewedBy,
}: BlogArticleHeroProps) {
  const colorClass =
    categoryColors[article.category] ?? "bg-gray-100 text-gray-700";

  return (
    <header
      className="w-full"
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
            "linear-gradient(to right, rgba(18,53,50,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(18,53,50,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-28 sm:pt-32 pb-8">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-1.5 text-xs sm:text-sm text-[#6B7280] mb-6"
          aria-label="Breadcrumb"
        >
          <Link
            href="/"
            className="hover:text-[#123532] transition-colors duration-200"
          >
            Home
          </Link>
          <svg
            className="w-3.5 h-3.5 text-[#9CA3AF] flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <Link
            href="/blog"
            className="hover:text-[#123532] transition-colors duration-200"
          >
            Blog
          </Link>
          <svg
            className="w-3.5 h-3.5 text-[#9CA3AF] flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
          >
            {article.category}
          </span>
        </nav>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[2.75rem] 2xl:text-5xl font-bold text-[#123532] leading-snug mb-4 max-w-4xl">
          {article.title}
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg text-[#555555] max-w-3xl leading-relaxed mb-8">
          {article.description}
        </p>

        {/* Author row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#123532] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-semibold">
                {(author ?? "G")[0]}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1F2937]">
                {author ?? "Golden Ray Solar"}
              </p>
              <p className="text-xs text-[#6B7280]">
                Updated {article.updatedDate} &nbsp;·&nbsp; {article.readTime}
              </p>
            </div>
          </div>

          {reviewedBy && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-3.5 py-1.5 rounded-full self-start sm:self-auto">
              <svg
                className="w-3.5 h-3.5 text-green-500 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs font-medium">
                Reviewed by {reviewedBy}
              </span>
            </div>
          )}
        </div>

        {/* Hero Image */}
        <div className="relative w-full h-56 sm:h-72 md:h-80 lg:h-96 xl:h-[420px] 2xl:h-[460px] rounded-2xl overflow-hidden shadow-sm">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw"
          />
        </div>
      </div>
    </header>
  );
}
