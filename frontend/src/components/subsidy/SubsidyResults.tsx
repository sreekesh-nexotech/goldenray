"use client";
import PageIllustration from "@/components/ui/page-illustration";
import LinkingButton from "../ui/LinkingButton";

interface SubsidyResultsProps {
  electricityBill: string;
  propertyType: string;
}

export default function SubsidyResults({
  electricityBill,
  propertyType,
}: SubsidyResultsProps) {
  return (
    <section
      className="relative py-16 sm:py-18 md:py-20 lg:py-24 xl:py-28 2xl:py-32 overflow-hidden"
      style={{
        background:
          "radial-gradient(38.63% 65.14% at 50.97% 56.91%, #F8F2E1 0%, rgba(255, 255, 255, 0) 100%)",
      }}
    >
      <PageIllustration isGradient={false} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8 xl:px-10 2xl:px-12">
        {/* Main Title */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-14 xl:mb-16 2xl:mb-18">
          <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-6xl font-bold text-[#123532] mb-4 sm:mb-5 lg:mb-6 xl:mb-6 2xl:mb-8">
            Good News! You Are Eligible for PM Surya
            <br />
            Ghar Subsidy
          </h1>
        </div>

        {/* Top Info Cards */}
        <div className="flex flex-col md:flex-row justify-start gap-4 sm:gap-5 lg:gap-6 xl:gap-6 2xl:gap-8 mb-8 sm:mb-10 md:mb-12 lg:mb-14 xl:mb-16 2xl:mb-18 max-w-3xl xl:max-w-4xl 2xl:max-w-4xl">
          <div className="flex-1">
            <p className="text-sm text-[#123532] font-medium mb-2">
              Average Monthly Electricity Bill
            </p>
            <div className="bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200 relative">
              <div className="flex items-center justify-between cursor-pointer">
                <p className="text-base font-semibold text-[#123532]">
                  {electricityBill === "above_2000"
                    ? "Above ₹2000"
                    : electricityBill === "1500_2000"
                      ? "₹1500 - ₹2000"
                      : electricityBill === "1000_1500"
                        ? "₹1000 - ₹1500"
                        : "Below ₹1000"}
                </p>
                <svg
                  className="w-4 h-4 text-[#666666]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-[#123532] font-medium mb-2">
              Your Property Type
            </p>
            <div className="bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200 relative">
              <div className="flex items-center justify-between cursor-pointer">
                <p className="text-base font-semibold text-[#123532] capitalize">
                  {propertyType}
                </p>
                <svg
                  className="w-4 h-4 text-[#666666]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8 lg:gap-8 xl:gap-10 2xl:gap-12 max-w-7xl mx-auto">
          {/* Why You're Eligible Card */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl sm:rounded-2xl lg:rounded-3xl xl:rounded-3xl 2xl:rounded-4xl p-6 sm:p-7 md:p-8 lg:p-8 xl:p-10 2xl:p-12 shadow-md">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-4xl 2xl:text-4xl font-semibold text-[#123532] mb-6 sm:mb-7 md:mb-8 lg:mb-8 xl:mb-10 2xl:mb-10">
              Why You&apos;re Eligible?
            </h2>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <span className="text-3xl text-[#123532] flex-shrink-0 leading-none">
                  ✓
                </span>
                <p className="text-xl text-[#123532] pt-1">
                  <span className="font-bold">Residential</span> property
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-3xl text-[#123532] flex-shrink-0 leading-none">
                  ✓
                </span>
                <p className="text-xl text-[#123532] pt-1">
                  Electricity bill above{" "}
                  <span className="font-bold">₹2,000</span>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-3xl text-[#123532] flex-shrink-0 leading-none">
                  ✓
                </span>
                <p className="text-xl text-[#123532] pt-1">
                  Grid-connected location
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-3xl text-[#123532] flex-shrink-0 leading-none">
                  ✓
                </span>
                <p className="text-xl text-[#123532] pt-1">
                  <span className="font-bold">MNRE subsidy</span> available in
                  your area
                </p>
              </div>
            </div>
          </div>

          {/* Estimated Subsidy Card */}
          <div className="bg-white rounded-2xl sm:rounded-2xl lg:rounded-3xl xl:rounded-3xl 2xl:rounded-4xl p-6 sm:p-7 md:p-8 lg:p-8 xl:p-10 2xl:p-12 shadow-lg">
            <div className="mb-6">
              <p className="text-lg text-[#666666] mb-2">
                Your estimated subsidy
              </p>
              <p className="text-5xl mb-2">
                <span className="font-normal text-[#123532]">upto </span>
                <span className="font-bold text-[#ED8723]">₹78,000</span>
              </p>
            </div>
            <div className="mb-8">
              <p className="text-lg text-[#666666] mb-2">
                Your estimated saving
              </p>
              <p className="font-bold text-[#123532]">
                <span className="text-4xl">₹25,000</span>
                <span className="text-lg font-normal"> per year</span>
              </p>
            </div>
            <div className="bg-gray-100 rounded-3xl px-4 py-3 mb-6 border border-gray-300">
              <p className="text-sm text-[#666666] whitespace-nowrap">
                Recommended size: 2-3 kW rooftop solar plant
              </p>
            </div>
          </div>

          {/* Why Trust Us Card */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl sm:rounded-2xl lg:rounded-3xl xl:rounded-3xl 2xl:rounded-4xl p-6 sm:p-7 md:p-8 lg:p-8 xl:p-10 2xl:p-12 shadow-md">
            <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl 2xl:text-4xl font-semibold text-[#123532] mb-4 sm:mb-5 md:mb-6 lg:mb-6 xl:mb-7 2xl:mb-8">
              Why Trust Us?
            </h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h3 className="text-lg font-bold text-[#123532]">
                    Government Approved
                  </h3>
                </div>
                <ul className="ml-8 space-y-1 text-[15px] text-[#666666]">
                  <li>• MNRE registered vendor</li>
                  <li>• KSEB compliant installations</li>
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h3 className="text-lg font-bold text-[#123532]">
                    No Paperwork Stress
                  </h3>
                </div>
                <ul className="ml-8 space-y-1 text-[15px] text-[#666666]">
                  <li>• We apply on the official PM Surya Ghar portal</li>
                  <li>• You don&apos;t visit any office</li>
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h3 className="text-lg font-bold text-[#123532]">
                    Subsidy Assurance
                  </h3>
                </div>
                <ul className="ml-8 space-y-1 text-[15px] text-[#666666]">
                  <li>• 100% customers received subsidy</li>
                  <li>• Direct bank credit, not discounts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-5 lg:gap-6 xl:gap-6 2xl:gap-8 mt-8 sm:mt-10 md:mt-12 lg:mt-14 xl:mt-16 2xl:mt-18">
          <LinkingButton
            content="Book Free Site Visit"
            ButtonLink="#footer"
            ButtonBg="bg-[#F7BA41]"
            Buttontext="text-[#272218]"
            ButtonHover="hover:bg-[#e5a934]"
          />
          <LinkingButton
            content="Talk to Solar Expert"
            ButtonLink="#footer"
            ButtonBorder="border border-[#074A4D]"
            ButtonBg="bg-white"
            Buttontext="text-[#074A4D]"
            ButtonHover="hover:bg-[#eeeeee]"
          />
        </div>
      </div>
    </section>
  );
}
