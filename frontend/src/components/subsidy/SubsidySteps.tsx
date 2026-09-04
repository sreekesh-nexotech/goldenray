const STEPS = [
  {
    title: "Register",
    description: "Sign up on PM Surya Ghar portal",
  },
  {
    title: "Choose Installer",
    description: "Select Flarize or approved vendor",
  },
  {
    title: "Install",
    description: "Solar plant setup completed",
  },
  {
    title: "Inspection",
    description: "Quality check by DISCOM",
  },
  {
    title: "Transfer",
    description: "Subsidy credited to your bank",
  },
];

export default function SubsidySteps() {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20 xl:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        {/* Heading */}
        <div className="w-full max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532]">
          How the subsidy process works
        </h2>
        <p className="mt-3 text-[#757575] text-sm md:text-lg">
          Most Kerala homeowners go from registration to subsidy transfer in 4–6 weeks when paperwork is filed correctly.
        </p>
      </div>

        {/* Timeline */}
        <div className="relative mt-10 sm:mt-12 lg:mt-14">
          {/* Rail sitting under the numbered badges */}
          <div
            className="hidden lg:block absolute inset-x-0 top-12 h-px bg-[#E5E7EB]"
            aria-hidden="true"
          />

          <ol className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-10">
            {STEPS.map(({ title, description }, index) => (
              <li
                key={title}
                className="flex flex-col items-center text-center px-1"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#123532] text-base font-semibold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-sm md:text-base font-bold leading-snug text-[#123532]">
                  {title}
                </h3>
                <p className="mt-1.5 text-xs md:text-sm leading-relaxed text-[#757575]">
                  {description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
