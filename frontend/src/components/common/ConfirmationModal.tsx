"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Check } from "lucide-react";

type ActionConfig = {
  label: string;
  /** If set, the button renders as a link to this route. */
  href?: string;
  /** Extra handler run on click (the modal also closes afterwards). */
  onClick?: () => void;
};

export type ConfirmationModalProps = {
  /** Controls visibility. */
  open: boolean;
  /** Called on overlay click, Escape, or after an action fires. */
  onClose: () => void;
  /** Bold heading, e.g. "Application Received." */
  title: string;
  /** Supporting copy — plain text or rich nodes (paragraphs, links). */
  description?: React.ReactNode;
  /** Primary (filled) button. Omit to hide. */
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  /** Secondary (outlined) button, shown to the left of the primary. */
  secondaryLabel?: string;
  secondaryHref?: string;
  onSecondaryAction?: () => void;
  /** Small centered node under the buttons (e.g. a "learn more" link). */
  footer?: React.ReactNode;
};

const ConfirmationModal = ({
  open,
  onClose,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  secondaryLabel,
  secondaryHref,
  onSecondaryAction,
  footer,
}: ConfirmationModalProps) => {
  // Close on Escape and lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const renderButton = (
    action: ActionConfig | undefined,
    variant: "primary" | "secondary",
  ) => {
    if (!action) return null;
    const cls =
      variant === "primary"
        ? "bg-[#F7BA41] text-[#123532] hover:bg-yellow-500"
        : "border border-[#0B4740] text-[#123532] hover:bg-[#0B4740]/5";
    const base = `inline-flex w-full items-center justify-center whitespace-nowrap rounded-lg px-4 py-3 text-sm md:text-base font-semibold transition-colors ${cls}`;
    const handle = () => {
      action.onClick?.();
      onClose();
    };
    return action.href ? (
      <Link href={action.href} onClick={handle} className={base}>
        {action.label}
      </Link>
    ) : (
      <button type="button" onClick={handle} className={base}>
        {action.label}
      </button>
    );
  };

  const primary = actionLabel
    ? { label: actionLabel, href: actionHref, onClick: onAction }
    : undefined;
  const secondary = secondaryLabel
    ? { label: secondaryLabel, href: secondaryHref, onClick: onSecondaryAction }
    : undefined;
  const hasButtons = Boolean(primary || secondary);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-white px-8 py-10 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success check */}
        <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#0B4740]">
          <Check size={26} className="text-white" strokeWidth={3} />
        </span>

        <h2 className="mb-3 text-2xl font-bold text-[#123532]">{title}</h2>

        {description && (
          <div className="space-y-3 text-sm leading-relaxed text-[#6B7280]">
            {description}
          </div>
        )}

        {hasButtons && (
          <div
            className={`mt-6 grid gap-3 border-t border-[#EEE] pt-6 ${
              primary && secondary ? "sm:grid-cols-2" : "grid-cols-1"
            }`}
          >
            {renderButton(secondary, "secondary")}
            {renderButton(primary, "primary")}
          </div>
        )}

        {footer && (
          <div className="mt-4 text-sm text-[#6B7280]">{footer}</div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default ConfirmationModal;
