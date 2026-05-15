// src/components/SolutionsPage/BenefitsApplicationsSection.tsx
import { BenefitsApplicationsData } from "@/data/solutions-page-data";

interface BenefitsApplicationsSectionProps {
  data: BenefitsApplicationsData;
}

export default function BenefitsApplicationsSection({
  data,
}: BenefitsApplicationsSectionProps) {
  return (
    <section className="w-full py-8 md:py-10 lg:py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
          {/* Benefits Column */}
          <div
            className="rounded-2xl md:rounded-3xl p-8 md:p-10 lg:p-12"
            style={{ background: "#E5F4F2" }}
          >
            <h3 className="text-xl md:text-2xl font-semibold leading-snug text-gray-900 mb-6 md:mb-8">
              {data.benefitsTitle}
            </h3>
            <ul className="space-y-4 md:space-y-5">
              {data.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3 md:gap-4">
                  <span className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 mt-1">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full"
                    >
                      {/* Outer light gray circle */}
                      <circle cx="12" cy="12" r="12" fill="#D1D5DB" />
                      {/* Inner dark gray circle */}
                      <circle cx="12" cy="12" r="6" fill="#6B7280" />
                    </svg>
                  </span>
                  <span className="text-gray-700 text-sm md:text-base lg:text-xl font-normal leading-normal">
                    {benefit.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Applications Column */}
          <div
            className="rounded-2xl md:rounded-3xl p-8 md:p-10 lg:p-12"
            style={{ background: "#F9F5E8" }}
          >
            <h3 className="text-xl md:text-2xl font-semibold leading-snug text-gray-900 mb-6 md:mb-8">
              {data.applicationsTitle}
            </h3>
            <ul className="space-y-4 md:space-y-5">
              {data.applications.map((application, index) => (
                <li key={index} className="flex items-start gap-3 md:gap-4">
                  <span className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 mt-1">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full"
                    >
                      {/* Outer light gray circle */}
                      <circle cx="12" cy="12" r="12" fill="#D1D5DB" />
                      {/* Inner dark gray circle */}
                      <circle cx="12" cy="12" r="6" fill="#6B7280" />
                    </svg>
                  </span>
                  <span className="text-gray-700 text-sm md:text-base lg:text-xl font-normal leading-normal">
                    {application.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
