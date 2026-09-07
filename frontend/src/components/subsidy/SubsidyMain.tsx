"use client";

import { useCallback, useState } from "react";
import SubsidyHero from "./SubsidyHero";
import SubsidyDeadline from "./SubsidyDeadline";
import SubsidyAmountTable from "./SubsidyAmountTable";
import SubsidyQuizModal from "./SubsidyQuizModal";
import SubsidyOutcome from "./SubsidyOutcome";
import SubsidySteps from "./SubsidySteps";
import SubsidyEligibility from "./SubsidyEligibility";
import Activate from "../GroupPurchase/Activate";
import SubsidyMistakes from "./SubsidyMistakes";
import KeralaSubsidyInfo from "./KeralaSubsidyInfo";
import SubsidyResources from "./SubsidyResources";
import Faq from "./SubsidyFaq";
import { estimateSubsidy, type SubsidyEstimate } from "./eligibility";

export default function SubsidyMain() {
  const [quizOpen, setQuizOpen] = useState(false);
  const [estimate, setEstimate] = useState<SubsidyEstimate | null>(null);

  const openQuiz = useCallback(() => {
    setEstimate(null);
    setQuizOpen(true);
  }, []);

  const closeQuiz = useCallback(() => setQuizOpen(false), []);

  const handleComplete = useCallback<
    React.ComponentProps<typeof SubsidyQuizModal>["onComplete"]
  >((answers) => {
    setEstimate(estimateSubsidy(answers));
    setQuizOpen(false);
    // The result renders under the hero, so bring it into view once painted.
    requestAnimationFrame(() => {
      document
        .getElementById("subsidy-result")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  return (
    <section className="font-switzer">
      <SubsidyHero onCheckEligibility={openQuiz} />

      {estimate && (
        <SubsidyOutcome estimate={estimate} onRestart={openQuiz} />
      )}

      <SubsidyDeadline />
      <SubsidyAmountTable />
      <SubsidyEligibility />
      <SubsidySteps />
      <SubsidyMistakes />
      <KeralaSubsidyInfo />
      <SubsidyResources />
      <Faq />
      <Activate />

      <SubsidyQuizModal
        open={quizOpen}
        onClose={closeQuiz}
        onComplete={handleComplete}
      />
    </section>
  );
}
