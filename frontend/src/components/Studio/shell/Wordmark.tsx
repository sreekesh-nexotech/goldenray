// src/components/Studio/shell/Wordmark.tsx
import type { CSSProperties } from "react";

/**
 * Typographic Flarize wordmark used in the studio brand card and sign-in card.
 * Set in DM Sans per the design system (no logo asset exists for the mark).
 */
export default function Wordmark({ style }: { style?: CSSProperties }) {
  return (
    <span
      className="font-dm-sans"
      style={{
        fontSize: 21,
        fontWeight: 700,
        letterSpacing: "-.01em",
        lineHeight: 1,
        color: "#123532",
        ...style,
      }}
    >
      Flarize
    </span>
  );
}
