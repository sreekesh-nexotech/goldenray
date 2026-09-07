"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { SubsidyAnswers } from "./eligibility";

interface SubsidyQuizModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (answers: SubsidyAnswers) => void;
}

type AnswerKey = keyof SubsidyAnswers;

interface Option {
  value: string;
  label: string;
  /** Only used by the card layout. */
  illustration?: "house" | "building";
  /** Only used by the list layout. */
  glyph?: "yes" | "no";
}

interface Step {
  key: AnswerKey;
  question: string;
  layout: "cards" | "list";
  /** Centres each row and shows its glyph — the yes/no step. */
  centered?: boolean;
  options: Option[];
}

const STEPS: Step[] = [
  {
    key: "propertyType",
    question: "What type of property do you have?",
    layout: "cards",
    options: [
      { value: "residential", label: "Residential", illustration: "house" },
      { value: "commercial", label: "Commercial", illustration: "building" },
    ],
  },
  {
    key: "connection",
    question: "Do you have an active electricity connection?",
    layout: "list",
    centered: true,
    options: [
      { value: "yes", label: "Yes", glyph: "yes" },
      { value: "no", label: "No", glyph: "no" },
    ],
  },
  {
    key: "billRange",
    question: "What's your average monthly electricity bill?",
    layout: "list",
    options: [
      { value: "under_2000", label: "Under ₹2,000" },
      { value: "2000_5000", label: "₹2,000 – ₹5,000" },
      { value: "5000_10000", label: "₹5,000 – ₹10,000" },
      { value: "above_10000", label: "Above ₹10,000" },
    ],
  },
  {
    key: "systemSize",
    question: "How much solar system are you considering?",
    layout: "list",
    options: [
      { value: "not_sure", label: "Not sure" },
      { value: "2_3kw", label: "2–3 kW" },
      { value: "3_5kw", label: "3–5 kW" },
      { value: "5kw_plus", label: "5 kW+" },
    ],
  },
];

/** Matched illustration pair for the property-type cards. */
function Illustration({ kind }: { kind: "house" | "building" }) {
  const common = {
    width: 96,
    height: 96,
    viewBox: "0 0 96 96",
    fill: "none",
    "aria-hidden": true,
  } as const;

  if (kind === "house") {
    return (
      <svg {...common}>
        <path d="M14 44 48 18l34 26v32a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V44Z" fill="#DDEFE3" />
        <path d="M10 45 48 15l38 30" stroke="#0E7A55" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 44 48 24l26 20v30H22V44Z" fill="#fff" stroke="#0E7A55" strokeWidth="3" strokeLinejoin="round" />
        <rect x="40" y="54" width="16" height="20" rx="1.5" fill="#123532" />
        <path d="M30 30 48 16l18 14-9 7-9-7-9 7-9-7Z" fill="#F7BA41" />
        <path d="M32 31 48 19l16 12" stroke="#C98A18" strokeWidth="1.6" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="16" y="30" width="30" height="48" rx="3" fill="#DDEFE3" stroke="#0E7A55" strokeWidth="3" />
      <rect x="46" y="18" width="34" height="60" rx="3" fill="#fff" stroke="#0E7A55" strokeWidth="3" />
      <g fill="#123532">
        <rect x="23" y="38" width="7" height="7" rx="1" />
        <rect x="33" y="38" width="7" height="7" rx="1" />
        <rect x="23" y="50" width="7" height="7" rx="1" />
        <rect x="33" y="50" width="7" height="7" rx="1" />
        <rect x="53" y="28" width="8" height="8" rx="1" />
        <rect x="65" y="28" width="8" height="8" rx="1" />
        <rect x="53" y="42" width="8" height="8" rx="1" />
        <rect x="65" y="42" width="8" height="8" rx="1" />
      </g>
      <rect x="57" y="60" width="12" height="18" rx="1.5" fill="#123532" />
      <path d="M50 18h26l4-8H54l-4 8Z" fill="#F7BA41" />
      <path d="M56 10 52 18M64 10l-4 8M72 10l-4 8" stroke="#C98A18" strokeWidth="1.6" />
    </svg>
  );
}

export default function SubsidyQuizModal({
  open,
  onClose,
  onComplete,
}: SubsidyQuizModalProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<SubsidyAnswers>({});
  const dialogRef = useRef<HTMLDivElement>(null);

  const step = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;
  const selected = answers[step.key] as string | undefined;

  // Every opening starts a fresh estimate.
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

  const advance = useCallback(
    (next: SubsidyAnswers) => {
      if (isLastStep) {
        onComplete(next);
        return;
      }
      setStepIndex((i) => i + 1);
    },
    [isLastStep, onComplete],
  );

  if (!open) return null;

  const select = (value: string) =>
    setAnswers((prev) => ({ ...prev, [step.key]: value }));

  const optionClasses = (isSelected: boolean) =>
    isSelected
      ? "bg-[#FFF6E4] ring-2 ring-[#F7BA41]"
      : "bg-[#F2F4F5] ring-2 ring-transparent hover:bg-[#E9ECEE]";

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
        aria-labelledby="subsidy-quiz-question"
        tabIndex={-1}
        className="relative my-auto w-full max-w-[640px] rounded-3xl bg-white p-6 shadow-[0_30px_80px_rgba(15,27,26,0.35)] outline-none sm:p-9"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close eligibility check"
          className="absolute right-4 top-4 rounded-full p-1.5 text-[#9AA3A2] transition-colors hover:bg-[#F2F4F5] hover:text-[#123532]"
        >
          <X className="h-4 w-4" strokeWidth={2.5} />
        </button>

        <p className="text-[13px] font-semibold text-[#123532]">
          Step {stepIndex + 1} of {STEPS.length}
        </p>
        <h2
          id="subsidy-quiz-question"
          className="mt-2 pr-8 text-xl font-bold leading-snug text-[#123532] sm:text-[1.6rem]"
        >
          {step.question}
        </h2>

        {step.layout === "cards" ? (
          <div className="mt-6 grid grid-cols-2 gap-4">
            {step.options.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected === option.value}
                onClick={() => select(option.value)}
                className={`flex flex-col items-center gap-3 rounded-2xl px-4 py-6 transition-colors sm:py-8 ${optionClasses(
                  selected === option.value,
                )}`}
              >
                <Illustration kind={option.illustration ?? "house"} />
                <span className="text-sm font-medium text-[#123532] sm:text-base">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            {step.options.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected === option.value}
                onClick={() => select(option.value)}
                className={`flex items-center gap-2 rounded-2xl px-5 py-4 text-sm text-[#123532] transition-colors sm:text-base ${
                  step.centered ? "justify-center" : "justify-start"
                } ${optionClasses(selected === option.value)}`}
              >
                {option.glyph === "yes" && (
                  <span className="text-[#0E7A55]" aria-hidden="true">
                    ✓
                  </span>
                )}
                {option.glyph === "no" && (
                  <span className="text-[#C0344A]" aria-hidden="true">
                    ✕
                  </span>
                )}
                <span className="font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        )}

        <div className="mt-7 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => advance(answers)}
            className="cursor-pointer text-sm text-[#8A8A8A] transition-colors hover:text-[#123532]"
          >
            Skip for now
          </button>

          <button
            type="button"
            disabled={!selected}
            onClick={() => advance(answers)}
            className={`rounded-xl px-6 py-3 text-sm font-semibold transition-colors ${
              selected
                ? "cursor-pointer bg-[#F7BA41] text-[#272218] hover:bg-[#e5a934]"
                : "cursor-not-allowed bg-[#FBE3AC] text-[#A0987F]"
            }`}
          >
            {isLastStep ? "Check my eligibility →" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
