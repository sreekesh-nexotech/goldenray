// Shared callout boxes for the CMS `insights` and `warning` fields.
//
// These render in one of two places depending on the article's shape:
//   • inside `understanding` / `eligible` when the article has those blocks
//   • standalone at the end of the body when it does not
// Keeping the markup here guarantees both paths look identical.

/** Renders the CMS `insights` field. */
export function KeyInsightBox({ text }: { text: string }) {
  return (
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
        <span className="text-xs md:text-base font-semibold leading-normal text-[#123532]">
          Key Insight
        </span>
      </div>
      <p className="text-sm md:text-base font-normal leading-normal text-[#374151] pl-6">
        {text}
      </p>
    </div>
  );
}

/** Renders the CMS `warning` field. */
export function ImportantBox({ text }: { text: string }) {
  return (
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
        <span className="text-xs md:text-base font-semibold leading-normal text-[#92400E]">
          Important
        </span>
      </div>
      <p className="text-sm md:text-base font-normal leading-normal text-[#374151] pl-6">
        {text}
      </p>
    </div>
  );
}
