import { Briefcase, MapPin } from "lucide-react";
import LinkingButton from "../ui/LinkingButton";
import type { CareerPosition } from "@/data/career-positions";

/**
 * Shown on a job detail page when the role is not currently open
 * (`position.isHiring === false`). The job description and the application
 * form are hidden — only this message is rendered.
 */
export default function PositionClosed({
  position,
}: {
  position: CareerPosition;
}) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-semibold leading-tight text-[#123532] mb-6">
          {position.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-gray-500 mb-10">
          <span className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4" />
            {position.department}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            {position.location}
          </span>
        </div>

        <div className="bg-[#F4F5F6] rounded-2xl px-6 py-12 md:px-12 md:py-16 text-center">
          <span className="inline-flex items-center rounded-full bg-white px-4 py-1.5 text-xs md:text-sm font-medium text-[#123532] mb-6">
            Not Currently Hiring
          </span>
          <h2 className="text-2xl md:text-3xl font-semibold leading-tight text-[#123532] mb-4">
            This Position Is Not Open Right Now
          </h2>
          <p className="text-sm md:text-lg font-normal leading-relaxed text-[#444444] max-w-2xl mx-auto mb-10">
            We are not accepting applications for the {position.title} role at
            the moment. Roles open up as the team grows — check our open
            positions below, or send us your resume and we will reach out when
            this position opens.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <LinkingButton
              content="View Open Positions"
              ButtonLink="/career#open-positions"
              ButtonBg="bg-[#F7BA41]"
              Buttontext="text-[#272218]"
              ButtonHover="hover:bg-yellow-500"
            />
            <LinkingButton
              content="Send Your Resume"
              ButtonLink="/career/general-application-form"
              ButtonBg="bg-white"
              Buttontext="text-[#123532]"
              ButtonHover="hover:bg-gray-50"
              ButtonBorder="border border-gray-200"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
