import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  CreditCard,
  FileText,
  XCircle,
} from "lucide-react";
import LinkingButton from "../ui/LinkingButton";

const MISTAKES = [
  {
    icon: AlertCircle,
    title: "Early Installation",
    description:
      "Installing solar before portal registration often leads to automatic rejection.",
  },
  {
    icon: FileText,
    title: "Missing Docs",
    description:
      "Incomplete inspection paperwork or missing site photos after installation.",
  },
  {
    icon: CreditCard,
    title: "Bank Detail Errors",
    description:
      "Typos in IFSC or account numbers cause significant payment delays.",
  },
  {
    icon: XCircle,
    title: "Unapproved Vendors",
    description:
      "Choosing installers not listed on the national empanelled list.",
  },
];

export default function SubsidyMistakes() {
  return (
    <section className="w-full bg-gradient-to-b from-[#FAF5E9] to-white px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-12 sm:py-14 lg:py-16">
      <div className="w-full max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#123532]">
          Mistakes That Can Delay Your Solar Subsidy
        </h2>
        <p className="mt-3 text-[#757575] text-sm md:text-lg">
          Avoid these common pitfalls to ensure a smooth financial transition
        </p>
      </div>

      <div className="mx-auto mt-8 sm:mt-10 lg:mt-12 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-6">
          {/* Pitfalls */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 lg:w-[48%]">
            {MISTAKES.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                className="rounded-2xl border border-[#F0EEE8] bg-white p-5 sm:p-6 shadow-[0_4px_20px_rgba(18,53,50,0.05)]"
              >
                <Icon
                  className="h-5 w-5 text-[#E5484D]"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <h3 className="mt-6 text-sm md:text-base font-semibold leading-snug text-[#123532]">
                  {title}
                </h3>
                <p className="mt-2 text-xs md:text-sm leading-relaxed text-[#757575]">
                  {description}
                </p>
              </li>
            ))}
          </ul>

          {/* Solution */}
          <div className="relative overflow-hidden rounded-2xl bg-[#F5B324] p-6 sm:p-8 lg:p-10 lg:w-[52%] flex flex-col justify-center">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10"
              aria-hidden="true"
            />

            <div className="relative flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white">
                <BadgeCheck
                  className="h-5 w-5 text-[#123532]"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>
              <h3 className="text-lg md:text-xl font-bold text-[#3F3108]">
                The Flarize Solution
              </h3>
            </div>

            <p className="relative mt-5 text-sm md:text-base font-medium leading-relaxed text-[#4A3A10]">
              Flarize handles all portal registrations, double-checks your
              documentation, and only works with certified installers to ensure
              your subsidy is never delayed. We act as your end-to-end
              consultant, taking the paperwork stress off your shoulders.
            </p>

            <div className="relative mt-7">
              <LinkingButton
                content={
                  <span className="inline-flex items-center gap-6">
                    Talk to Solar Expert
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                }
                ButtonLink="#footer"
                ButtonBg="bg-white"
                Buttontext="text-[#123532]"
                ButtonHover="hover:bg-[#F7F7F5]"
                className="w-full sm:w-auto text-sm md:text-base"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
