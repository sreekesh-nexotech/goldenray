import type { ArticleEligible } from "@/data/blog-content";

interface BlogArticleEligibleProps {
  eligible: ArticleEligible;
}

export default function BlogArticleEligible({
  eligible,
}: BlogArticleEligibleProps) {
  return (
    <section className="mt-10">
      {/* Title */}
      <h2 className="text-lg sm:text-xl md:text-[1.35rem] lg:text-2xl font-bold text-[#1F2937] mb-4 sm:mb-5 leading-snug">
        {eligible.title}
      </h2>

      {/* Intro */}
      <p className="text-sm sm:text-base text-[#374151] leading-relaxed sm:leading-loose mb-5 sm:mb-6">
        {eligible.intro}
      </p>

      {/* Checklist */}
      <ul className="flex flex-col gap-4 sm:gap-5 mb-7 sm:mb-8">
        {eligible.items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 sm:gap-4">
            {/* Green filled circle checkmark */}
            <span className="flex-shrink-0 mt-0.5">
              <svg
                className="w-5 h-5 sm:w-[1.15rem] sm:h-[1.15rem] text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <span className="text-sm sm:text-base text-[#374151] leading-relaxed">
              {item}
            </span>
          </li>
        ))}
      </ul>

      {/* Important box */}
      {eligible.important && (
        <div className="border-l-4 border-l-[#F59E0B] bg-[#FEFCE8] rounded-xl px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center gap-2 mb-2">
            {/* Amber warning triangle */}
            <svg
              className="w-4 h-4 flex-shrink-0 text-[#D97706]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm sm:text-[0.9rem] font-bold text-[#92400E]">
              Important
            </span>
          </div>
          <p className="text-sm sm:text-[0.9rem] text-[#374151] leading-relaxed pl-6">
            {eligible.important}
          </p>
        </div>
      )}
    </section>
  );
}
