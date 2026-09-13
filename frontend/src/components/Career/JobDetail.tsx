import React from "react";
import type { BulletGroup, CareerPosition } from "@/data/career-positions";

/**
 * What this section needs from a position. `CareerPosition` (the shipped
 * data) satisfies it; so does a posting adapted from the CMS (§6.12), which
 * may leave a group empty — an empty group's section is simply not rendered.
 */
export type JobDetailData = Pick<
  CareerPosition,
  "title" | "overview" | "responsibilities" | "requirements" | "niceToHave" | "whatYoullGet" | "locationDetail" | "employmentType"
> & {
  /** "How to apply" copy from the Studio editor; absent on the shipped data. */
  applicationInstructions?: string;
};

const hasItems = (g: BulletGroup) => g.left.length + g.right.length > 0;

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li
          key={index}
          className="flex gap-2 text-sm md:text-base font-normal leading-relaxed text-[#444444]"
        >
          <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#123532]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-10">
      <h2 className="text-xl md:text-2xl font-semibold text-[#123532] mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

function TwoColBullets({ left, right }: BulletGroup) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
      <BulletList items={left} />
      <BulletList items={right} />
    </div>
  );
}

export default function JobDetail({ position }: { position: JobDetailData }) {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-semibold leading-tight text-[#123532] mb-10">
          {position.title}
        </h1>

        <Section title="Role Overview">
          {position.overview.map((paragraph, index) => (
            <p
              key={index}
              className={`text-sm md:text-base font-normal leading-relaxed text-[#444444] max-w-4xl ${
                index < position.overview.length - 1 ? "mb-4" : ""
              }`}
            >
              {paragraph}
            </p>
          ))}
        </Section>

        {hasItems(position.responsibilities) && (
          <Section title="Responsibilities">
            <TwoColBullets {...position.responsibilities} />
          </Section>
        )}

        {hasItems(position.requirements) && (
          <Section title="Requirements">
            <TwoColBullets {...position.requirements} />
          </Section>
        )}

        {hasItems(position.niceToHave) && (
          <Section title="Nice to Have">
            <TwoColBullets {...position.niceToHave} />
          </Section>
        )}

        {hasItems(position.whatYoullGet) && (
          <Section title="What You'll Get">
            <TwoColBullets {...position.whatYoullGet} />
          </Section>
        )}

        <Section title="Location">
          <p className="text-sm md:text-base font-normal leading-relaxed text-[#444444]">
            {position.locationDetail}
          </p>
        </Section>

        <Section title="Employment Type">
          <p className="text-sm md:text-base font-normal leading-relaxed text-[#444444]">
            {position.employmentType}
          </p>
        </Section>

        {position.applicationInstructions && (
          <Section title="How to Apply">
            <p className="text-sm md:text-base font-normal leading-relaxed text-[#444444] whitespace-pre-line max-w-4xl">
              {position.applicationInstructions}
            </p>
          </Section>
        )}
      </div>
    </section>
  );
}
