"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import {
  FINDER_STEPS,
  type PanelFinderAnswers,
} from "./panelFinder";

interface PanelFinderModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (answers: PanelFinderAnswers) => void;
}

export default function PanelFinderModal({
  open,
  onClose,
  onComplete,
}: PanelFinderModalProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<PanelFinderAnswers>({});
  const dialogRef = useRef<HTMLDivElement>(null);

  const step = FINDER_STEPS[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === FINDER_STEPS.length - 1;
  const selected = answers[step.key] as string | undefined;

  // Every opening starts a fresh run.
  useEffect(() => {
    if (open) {
      setStepIndex(0);
      setAnswers({});
      dialogRef.current?.focus();
    }
  }, [open]);

  // Hold the page still behind the overlay.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const advance = useCallback(() => {
    if (isLastStep) {
      onComplete(answers);
      return;
    }
    setStepIndex((i) => i + 1);
  }, [isLastStep, onComplete, answers]);

  if (!open) return null;

  const select = (value: string) =>
    setAnswers((prev) => ({ ...prev, [step.key]: value }));

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#0F1B1A]/55 p-4 py-10 backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-finder-question"
        tabIndex={-1}
        className="relative my-auto w-full max-w-[660px] rounded-3xl bg-white p-6 shadow-[0_30px_80px_rgba(15,27,26,0.35)] outline-none sm:p-9"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close panel finder"
          className="absolute right-4 top-4 rounded-full p-1.5 text-[#9AA3A2] transition-colors hover:bg-[#F2F4F5] hover:text-[#123532]"
        >
          <X className="h-4 w-4" strokeWidth={2.5} />
        </button>

        <p className="text-[13px] font-semibold text-[#123532]">
          Step {stepIndex + 1} of {FINDER_STEPS.length}
        </p>
        <h2
          id="panel-finder-question"
          className="mt-2 pr-8 text-xl font-bold leading-snug text-[#123532] sm:text-[1.7rem]"
        >
          {step.question}
        </h2>
        <p className="mt-1.5 text-sm text-[#7C8582] sm:text-base">
          {step.subtitle}
        </p>

        <div className="mt-6 flex flex-col gap-3">
          {step.options.map((option) => {
            const isSelected = selected === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => select(option.value)}
                className={`rounded-2xl px-5 py-4 text-left text-sm font-medium text-[#123532] transition-colors sm:text-base ${
                  isSelected
                    ? "bg-[#FFF6E4] ring-2 ring-[#F7BA41]"
                    : "bg-[#F2F4F5] ring-2 ring-transparent hover:bg-[#E9ECEE]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="mt-7 flex items-center justify-between gap-4">
          {isFirstStep ? (
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-sm text-[#8A8A8A] transition-colors hover:text-[#123532]"
            >
              Skip for now
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStepIndex((i) => i - 1)}
              className="cursor-pointer text-sm text-[#8A8A8A] transition-colors hover:text-[#123532]"
            >
              Back
            </button>
          )}

          <button
            type="button"
            disabled={!selected}
            onClick={advance}
            className={`rounded-xl px-6 py-3 text-sm font-semibold transition-colors ${
              selected
                ? "cursor-pointer bg-[#F7BA41] text-[#272218] hover:bg-[#E5A930]"
                : "cursor-not-allowed bg-[#FBE3AC] text-[#A0987F]"
            }`}
          >
            {isLastStep ? "See My Recommendation" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
