import { Lightbulb } from "lucide-react";
import LinkingButton from "../ui/LinkingButton";

const QuoteAnalyserCTA = () => {
  return (
    <section className="relative z-10 container mx-auto px-4 py-6 md:py-10 max-w-7xl">
      <div className="rounded-3xl bg-[#FEF3E8] px-6 py-6 md:px-10 md:py-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-10">
          <div className="flex items-start gap-3 lg:gap-4">
            <Lightbulb
              className="mt-0.5 h-5 w-5 md:h-6 md:w-6 shrink-0 text-[#F7BA41]"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <p className="text-sm lg:text-lg font-medium leading-relaxed text-[#123532]">
              <span className="font-bold">Already Have a Solar Quote?</span>{" "}
              Upload your existing quotation and let our experts review it for
              pricing, specifications, and hidden costs—completely free.
            </p>
          </div>

          <div className="flex lg:ml-auto lg:shrink-0">
            <LinkingButton
              content="Analyze My Quote"
              ButtonLink="/quote-analyser"
              ButtonBg="bg-[#F7BA41]"
              Buttontext="text-[#272218]"
              ButtonHover="hover:bg-yellow-500"
              className="w-full justify-center px-10 py-3 lg:w-auto lg:px-12"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteAnalyserCTA;
