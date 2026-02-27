import type { BlogArticle } from "@/data/blog-data";
import type { ArticleContent } from "@/data/blog-content";

interface BlogArticleContentProps {
  article: BlogArticle;
  content?: ArticleContent;
}

function QuickSummary({ items }: { items: string[] }) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:p-6 mb-10">
      <h3 className="text-base font-bold text-[#123532] mb-4">Quick Summary</h3>
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
            <span className="text-sm text-[#374151] leading-relaxed">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function BlogArticleContent({
  article,
  content,
}: BlogArticleContentProps) {
  const intro = content?.intro ?? [article.description];
  const sections = content?.sections ?? [];
  const quickSummary = content?.quickSummary ?? [];

  return (
    <article className="prose-none">
      {/* Intro paragraphs */}
      <div className="mb-8 flex flex-col gap-4">
        {intro.map((para, i) => (
          <p
            key={i}
            className="text-sm sm:text-base text-[#374151] leading-relaxed sm:leading-loose"
          >
            {para}
          </p>
        ))}
      </div>

      {/* Quick Summary Box */}
      {quickSummary.length > 0 && <QuickSummary items={quickSummary} />}

      {/* Sections */}
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="mb-10 scroll-mt-24"
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#123532] mb-4 leading-snug">
            {section.title}
          </h2>
          <div className="flex flex-col gap-4">
            {section.paragraphs.map((para, i) => (
              <p
                key={i}
                className="text-sm sm:text-base text-[#374151] leading-relaxed sm:leading-loose"
              >
                {para}
              </p>
            ))}
          </div>
        </section>
      ))}

      {/* Divider */}
      <hr className="my-10 border-gray-100" />
    </article>
  );
}
