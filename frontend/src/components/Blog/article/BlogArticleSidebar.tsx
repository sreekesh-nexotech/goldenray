import Link from "next/link";
import type { ArticleContent } from "@/data/blog-content";

const POPULAR_TAGS = [
  "Solar Panels",
  "Energy Savings",
  "Tax Credits",
  "ROI",
  "Installation",
  "Maintenance",
  "Battery Storage",
  "Net Metering",
];

interface BlogArticleSidebarProps {
  content?: ArticleContent;
}

export default function BlogArticleSidebar({
  content,
}: BlogArticleSidebarProps) {
  const sections = content?.sections ?? [];
  const tags = content?.tags ?? POPULAR_TAGS;

  return (
    <aside className="flex flex-col gap-6">
      {/* On This Page */}
      {sections.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-[#123532] mb-4 uppercase tracking-wide">
            On This Page
          </h3>
          <nav className="flex flex-col gap-1">
            {sections.map((section, idx) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`text-sm py-1.5 px-2 rounded-lg transition-colors duration-150 ${
                  idx === 0
                    ? "text-[#ED8723] font-semibold bg-amber-50"
                    : "text-[#555555] hover:text-[#123532] hover:bg-gray-50"
                }`}
              >
                {section.title.length > 38
                  ? section.title.slice(0, 38) + "…"
                  : section.title}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* Popular Tags */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-[#123532] mb-4 uppercase tracking-wide">
          Popular Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-[#444444] hover:bg-[#F7BA41] hover:text-[#1F2937] cursor-pointer transition-colors duration-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Need Help CTA */}
      <div className="bg-[#F7BA41] rounded-2xl p-5 flex flex-col items-center text-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center mb-3">
          <svg
            className="w-6 h-6 text-[#1F2937]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </div>
        <h3 className="text-base font-bold text-[#1F2937] mb-1">Need Help?</h3>
        <p className="text-xs text-[#3D3D3D] leading-relaxed mb-4">
          Talk to a solar expert and get personalised guidance for your home.
        </p>
        <Link
          href="/contactus"
          className="w-full py-2.5 bg-white text-[#1F2937] text-sm font-semibold rounded-xl hover:bg-[#f0f0f0] transition-colors duration-200 text-center"
        >
          Schedule a Call
        </Link>
      </div>

      {/* Back to Blog */}
      <Link
        href="/blog"
        className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#123532] transition-colors duration-200 px-1"
      >
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to all guides
      </Link>
    </aside>
  );
}
