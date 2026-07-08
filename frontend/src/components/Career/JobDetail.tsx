import React from "react";

type BulletGroup = {
  left: string[];
  right: string[];
};

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

const responsibilities: BulletGroup = {
  left: [
    "Create user flows, wireframes, and prototypes",
    "Conduct UX research and competitor analysis",
    "Collaborate with developers during implementation",
    "Present design solutions and rationale to stakeholders",
  ],
  right: [
    "Design responsive web and mobile experiences",
    "Maintain and improve design systems",
    "Translate business requirements into intuitive user experiences",
  ],
};

const requirements: BulletGroup = {
  left: [
    "1–3 years of UI/UX or Product Design experience",
    "Understanding of UX principles and user-centered design",
    "Basic understanding of front-end technologies is a plus",
  ],
  right: [
    "Strong proficiency in Figma",
    "Experience designing responsive web and mobile interfaces",
    "Strong communication and problem-solving skills",
  ],
};

const niceToHave: BulletGroup = {
  left: ["Experience with Design Systems", "Basic HTML/CSS understanding"],
  right: ["Framer knowledge", "SaaS, Dashboard, or Marketplace experience"],
};

const whatYoullGet: BulletGroup = {
  left: [
    "Work directly with decision-makers",
    "Fast learning environment",
    "Career growth as the company expands",
  ],
  right: [
    "Ownership of real products",
    "SaaS, Dashboard, or Marketplace experience",
  ],
};

export default function JobDetail() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-semibold leading-tight text-[#123532] mb-10">
          UI/UX Designer
        </h1>

        <Section title="Role Overview">
          <p className="text-sm md:text-base font-normal leading-relaxed text-[#444444] mb-4 max-w-4xl">
            We are looking for a UI/UX Designer who enjoys solving real user
            problems and designing products that balance customer needs with
            business goals.
          </p>
          <p className="text-sm md:text-base font-normal leading-relaxed text-[#444444] max-w-4xl">
            You will work closely with founders, developers, and stakeholders to
            create user-friendly experiences across websites, mobile
            applications, dashboards, and internal platforms.
          </p>
        </Section>

        <Section title="Responsibilities">
          <TwoColBullets {...responsibilities} />
        </Section>

        <Section title="Requirements">
          <TwoColBullets {...requirements} />
        </Section>

        <Section title="Nice to Have">
          <TwoColBullets {...niceToHave} />
        </Section>

        <Section title="What You'll Get">
          <TwoColBullets {...whatYoullGet} />
        </Section>

        <Section title="Location">
          <p className="text-sm md:text-base font-normal leading-relaxed text-[#444444]">
            Kochi, Kerala / Hybrid (based on role)
          </p>
        </Section>

        <Section title="Employment Type">
          <p className="text-sm md:text-base font-normal leading-relaxed text-[#444444]">
            Full Time
          </p>
        </Section>
      </div>
    </section>
  );
}
