import type { SectionBlock, SectionTable } from "@/data/blog-content";

/** A pipe-authored data table. */
function ArticleTable({ table }: { table: SectionTable }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {table.headers.map((header, i) => (
              <th
                key={i}
                className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 text-xs md:text-base font-semibold leading-normal text-[#374151] whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors"
            >
              {row.cells.map((cell, ci) => (
                <td
                  key={ci}
                  className={`px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 text-xs md:text-base font-normal leading-normal ${
                    ci === (table.highlightColumnIndex ?? -1)
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
  );
}

/** A bullet list, rendered as a green-check checklist. */
function ArticleChecklist({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-4 sm:gap-5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 sm:gap-4">
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
          <span className="text-sm md:text-base font-normal leading-normal text-[#374151]">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Renders one block of a section body, in document order. */
export default function ArticleBlock({ block }: { block: SectionBlock }) {
  switch (block.kind) {
    case "paragraph":
      return (
        <p className="text-sm md:text-xl font-normal leading-relaxed text-[#374151]">
          {block.text}
        </p>
      );
    case "list":
      return <ArticleChecklist items={block.items} />;
    case "table":
      return <ArticleTable table={block.table} />;
  }
}
