import type { CSSProperties } from "react";

/**
 * Location pin for the contact footer that every page carries.
 *
 * The Figma export dropped this glyph and left a dashed placeholder box
 * reading "Vector" in its place on all eleven non-Onam pages. Drawn as a
 * viewBox-scaled SVG (rather than the 88px `MingcuteLocation2Fill` shrunk with
 * a CSS transform) so it rasterises correctly in the PDF capture.
 */
export default function FooterLocationPin({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      className={className}
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      style={style}
      aria-hidden="true"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
