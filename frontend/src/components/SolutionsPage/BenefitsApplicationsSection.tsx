// src/components/SolutionsPage/BenefitsApplicationsSection.tsx
import { BenefitsApplicationsData } from "@/data/solutions-page-data";

interface BenefitsApplicationsSectionProps {
  data: BenefitsApplicationsData;
}

export default function BenefitsApplicationsSection({
  data,
}: BenefitsApplicationsSectionProps) {
  return (
    <section className="w-full py-12 md:py-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Benefits Column */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
              {data.benefitsTitle}
            </h3>
            <ul className="space-y-4">
              {data.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 mt-0.5">
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full"
                    >
                      <rect width="20" height="20" rx="4" fill="#074A4D" />
                      <path
                        d="M6 10L9 13L14 7"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-gray-700 text-base">
                    {benefit.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Applications Column */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
              {data.applicationsTitle}
            </h3>
            <ul className="space-y-4">
              {data.applications.map((application, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 mt-0.5">
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full"
                    >
                      <rect width="20" height="20" rx="4" fill="#074A4D" />
                      <path
                        d="M6 10L9 13L14 7"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-gray-700 text-base">
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
