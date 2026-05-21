"use client";

interface CTASectionProps {
  onGetQuote?: () => void;
  onCompareSelected?: () => void;
  hasSelectedInverters?: boolean;
}

export default function CTASection({
  onGetQuote,
  onCompareSelected,
  hasSelectedInverters = false,
}: CTASectionProps) {
  return (
    <section className="py-6 sm:py-7 md:py-8 lg:py-10 xl:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-4xl 2xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-3 md:mb-4 lg:mb-4 xl:mb-5">
            Not sure which inverter fits your system?
          </h2>

          <p className="text-sm sm:text-base md:text-base lg:text-lg xl:text-lg 2xl:text-xl text-gray-600 max-w-4xl mx-auto mb-4 sm:mb-5 md:mb-5 lg:mb-6 xl:mb-7 leading-relaxed px-4">
            Comparing 2-3 inverters side by side reveals differences that spec
            sheets alone can&apos;t show — especially how each handles
            Kerala&apos;s grid fluctuations, humidity, and heat. Pick the
            inverters that interest you and see exactly how they stack up.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-3 md:gap-4 lg:gap-4">
            <button
              onClick={onGetQuote}
              className="w-full sm:w-auto px-5 sm:px-6 md:px-7 lg:px-8 xl:px-10 py-2 sm:py-2.5 md:py-2.5 lg:py-3 xl:py-3
                         bg-[#F7BA41] hover:bg-[#E5A831] text-gray-900 font-semibold
                         rounded-xl transition-all duration-300
                         text-sm sm:text-sm md:text-base lg:text-base
                         shadow-md hover:shadow-lg"
            >
              Get a Free Quote
            </button>

            <button
              onClick={onCompareSelected}
              disabled={!hasSelectedInverters}
              className={`w-full sm:w-auto px-5 sm:px-6 md:px-7 lg:px-8 xl:px-10 py-2 sm:py-2.5 md:py-2.5 lg:py-3 xl:py-3
                         border-2 border-gray-900 rounded-xl
                         font-semibold transition-all duration-300
                         text-sm sm:text-sm md:text-base lg:text-base
                         ${
                           hasSelectedInverters
                             ? "text-gray-900 hover:bg-gray-900 hover:text-white"
                             : "text-gray-400 border-gray-300 cursor-not-allowed"
                         }`}
            >
              Compare Selected
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
