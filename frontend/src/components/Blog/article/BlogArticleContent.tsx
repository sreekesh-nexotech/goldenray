import type { BlogArticle } from "@/data/blog-data";
import type { ArticleContent, ContentSection } from "@/data/blog-content";
import BlogArticleUnderstanding from "./BlogArticleUnderstanding";

interface BlogArticleContentProps {
  article: BlogArticle;
  content?: ArticleContent;
  author?: string;
  reviewedBy?: string;
}

function QuickSummary({ items }: { items: string[] }) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:p-6 mb-10 border-l-4 border-l-[#3B82F6]">
      <h3 className="text-xl md:text-2xl font-semibold leading-snug text-[#123532] mb-4">
        Quick Summary
      </h3>
      <ul className="flex flex-col gap-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <svg
              className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs md:text-base font-normal leading-normal text-[#374151]">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Renders a single titled content section from the API ──────────────────────
function ArticleSection({ section }: { section: ContentSection }) {
  return (
    <section id={section.id} className="mb-10 scroll-mt-24">
      <h2 className="text-xl md:text-2xl font-semibold leading-snug text-[#1F2937] mb-4 sm:mb-5">
        {section.title}
      </h2>
      <div className="flex flex-col gap-3 sm:gap-4">
        {section.paragraphs.map((para, i) => (
          <p
            key={i}
            className="text-sm md:text-xl font-normal leading-relaxed text-[#374151]"
          >
            {para}
          </p>
        ))}
      </div>
    </section>
  );
}

export default function BlogArticleContent({
  article,
  content,
  author,
  reviewedBy,
}: BlogArticleContentProps) {
  const intro = content?.intro ?? [article.description];
  const quickSummary = content?.quickSummary ?? [];
  const sections = content?.sections ?? [];

  return (
    <article className="prose-none">
      {/* Author row — author left, reviewed badge right */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-7 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#123532] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs md:text-base font-semibold leading-normal">
              {(author ?? "G")[0]}
            </span>
          </div>
          <div>
            <p className="text-xs md:text-base font-semibold leading-normal text-[#1F2937]">
              {author ?? "Golden Ray Solar"}
            </p>
            <p className="text-xs md:text-base font-normal leading-normal text-[#6B7280]">
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
            <span className="text-xs md:text-base font-medium leading-normal">
              Reviewed by {reviewedBy}
            </span>
          </div>
        )}
      </div>

      {/* Intro paragraphs */}
      <div className="mb-8 flex flex-col gap-4">
        {intro.map((para, i) => (
          <p
            key={i}
            className="text-sm md:text-xl font-normal leading-relaxed text-[#374151]"
          >
            {para}
          </p>
        ))}
      </div>

      {/* Quick Summary Box */}
      {quickSummary.length > 0 && <QuickSummary items={quickSummary} />}

      {/* Article body sections from API contentBlocks */}
      {sections.length > 0 && (
        <div className="mb-10">
          {sections.map((section) => (
            <ArticleSection key={section.id} section={section} />
          ))}
        </div>
      )}

      {/* Check Subsidy CTA Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 bg-[#F7BA41] rounded-2xl px-5 py-5 sm:px-7 sm:py-5 md:px-8 lg:px-9 xl:px-10 2xl:px-12 mb-10">
        <div className="flex-1 min-w-0">
          <h3 className="text-base md:text-xl font-semibold leading-snug text-white mb-1">
            Check Subsidy Eligibility
          </h3>
          <p className="text-xs md:text-base font-normal leading-normal text-white/80">
            Find out which government subsidies you qualify for.
          </p>
        </div>
        <a
          href="/subsidy"
          className="flex-shrink-0 inline-flex items-center justify-center bg-white text-[#1F2937] font-semibold text-base md:text-xl leading-snug rounded-xl px-5 py-2.5 sm:px-6 sm:py-2.5 md:px-7 md:py-3 xl:px-8 2xl:px-9 hover:bg-gray-100 transition-colors duration-200 whitespace-nowrap"
        >
          Check Eligibility
        </a>
      </div>

      {/* Understanding section */}
      {content?.understanding && (
        <BlogArticleUnderstanding
          article={article}
          understanding={content.understanding}
          eligible={content?.eligible}
        />
      )}
    </article>
  );
}
