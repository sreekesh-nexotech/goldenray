import Link from "next/link";
import type { BlogArticle } from "@/data/blog-data";

interface BlogArticleHeroProps {
  article: BlogArticle;
}

export default function BlogArticleHero({ article }: BlogArticleHeroProps) {
  return (
    <header
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-28 sm:pt-32 pb-10 sm:pb-14">
        {/* Breadcrumb — left aligned */}
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
          <span className="text-[#9CA3AF] mx-0.5">&gt;</span>
          <Link
            href="/blog"
            className="hover:text-[#123532] transition-colors duration-200"
          >
            Blog
          </Link>
          <span className="text-[#9CA3AF] mx-0.5">&gt;</span>
          <span>{article.category}</span>
        </nav>

        {/* Title — centered */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-5xl 2xl:text-[3.25rem] font-bold text-[#123532] leading-tight text-center mb-5 mx-auto max-w-4xl">
          {article.title}
        </h1>

        {/* Description — centered */}
        <p className="text-sm sm:text-base md:text-lg text-[#555555] leading-relaxed text-center mx-auto max-w-2xl">
          {article.description}
        </p>
      </div>
    </header>
  );
}
