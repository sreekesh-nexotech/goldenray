"use client";

interface PanelFinderBannerProps {
  onStart: () => void;
}

export default function PanelFinderBanner({ onStart }: PanelFinderBannerProps) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-[#F7F4E6] px-6 py-6 sm:px-8 sm:py-7 md:flex-row md:items-center md:justify-between md:gap-8">
      <div className="max-w-2xl">
        <h2 className="text-lg font-semibold text-[#123532] sm:text-xl">
          Not Sure Which Panel Is Right for You?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#444444] sm:text-base">
          Answer 3 quick questions and we&apos;ll recommend a panel that fits
          your home. Skip it if you already know what you are looking for.
        </p>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="shrink-0 self-start rounded-xl bg-[#F7BA41] px-6 py-3.5 text-sm font-semibold text-[#272218] transition-colors hover:bg-[#E5A930] md:self-auto"
      >
        Find My Perfect Panel
      </button>
    </div>
  );
}
