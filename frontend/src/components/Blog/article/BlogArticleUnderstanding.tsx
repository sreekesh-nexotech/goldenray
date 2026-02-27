import Image from "next/image";
import type { BlogArticle } from "@/data/blog-data";
import type {
  ArticleUnderstanding,
  ArticleEligible,
} from "@/data/blog-content";
import BlogArticleEligible from "./BlogArticleEligible";

interface BlogArticleUnderstandingProps {
  article: BlogArticle;
  understanding: ArticleUnderstanding;
  eligible?: ArticleEligible;
}

export default function BlogArticleUnderstanding({
  article,
  understanding,
  eligible,
}: BlogArticleUnderstandingProps) {
  return (
    <section>
      {/* Article image */}
      <div className="relative w-full h-56 sm:h-72 md:h-80 lg:h-96 xl:h-[420px] 2xl:h-[460px] rounded-2xl overflow-hidden shadow-sm mb-7">
        <Image
          src={article.image}
          alt={understanding.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 60vw"
        />
      </div>

      {/* Section title */}
      <h2 className="text-lg sm:text-xl md:text-[1.35rem] lg:text-2xl font-bold text-[#1F2937] mb-4 sm:mb-5 leading-snug">
        {understanding.title}
      </h2>

      {/* Intro paragraphs */}
      {understanding.paragraphs.length > 0 && (
        <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-7">
          {understanding.paragraphs.map((para, i) => (
            <p
              key={i}
              className="text-sm sm:text-base text-[#374151] leading-relaxed sm:leading-loose"
            >
              {para}
            </p>
          ))}
        </div>
      )}

      {/* Data table */}
      {understanding.table && (
        <div className="overflow-x-auto mb-6 sm:mb-7 rounded-xl border border-gray-200">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {understanding.table.headers.map((header, i) => (
                  <th
                    key={i}
                    className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-[#374151] whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {understanding.table.rows.map((row, ri) => (
                <tr
                  key={ri}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors"
                >
                  {row.cells.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 text-xs sm:text-sm ${
                        ci === (understanding.table?.highlightColumnIndex ?? -1)
                          ? "text-green-600 font-semibold"
                          : "text-[#374151]"
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* After-table paragraphs */}
      {understanding.afterTableParagraphs &&
        understanding.afterTableParagraphs.length > 0 && (
          <div className="flex flex-col gap-3 sm:gap-4 mb-7">
            {understanding.afterTableParagraphs.map((para, i) => (
              <p
                key={i}
                className="text-sm sm:text-base text-[#374151] leading-relaxed sm:leading-loose"
              >
                {para}
              </p>
            ))}
          </div>
        )}

      {/* Key Insight */}
      {understanding.keyInsight && (
        <div className="border-l-4 border-l-[#123532] bg-[#EFF7F4] rounded-xl px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-4 h-4 flex-shrink-0 text-[#123532]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
              <path d="M9 18h6" />
              <path d="M10 22h4" />
            </svg>
            <span className="text-sm sm:text-[0.9rem] font-bold text-[#123532]">
              Key Insight
            </span>
          </div>
          <p className="text-sm sm:text-[0.9rem] text-[#374151] leading-relaxed pl-6">
            {understanding.keyInsight}
          </p>
        </div>
      )}

      {/* Eligible section */}
      {eligible && <BlogArticleEligible eligible={eligible} />}
    </section>
  );
}
