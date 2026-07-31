// Right-pointing flow arrow used between the solar-flow cards.
import type { CSSProperties } from "react";

/**
 * The Figma export built this arrow by nesting CSS transforms — a wrapper with
 * `matrix(-1,0,0,1,0,0)` to flip a left-arrow, containing an icon scaled
 * `1.917x`. html2canvas does not compose nested transforms, so the arrow came
 * out small and thin in the generated PDF while looking correct on screen.
 *
 * Here the flip lives inside the SVG instead. html2canvas rasterises an <svg>
 * by serialising it and drawing it as an image, so viewBox scaling and internal
 * <g transform> are applied by the browser itself and survive the capture.
 */
export default function FlowArrow({
  size = 46,
  className,
  style,
}: {
  /** Rendered edge length in design-canvas pixels. */
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={style}
      aria-hidden="true"
    >
      {/* translate+scale(-1,1) mirrors the left-arrow into a right-arrow */}
      <g transform="translate(24, 0) scale(-1, 1)">
        <g transform="translate(2.844, 4.843)">
          <path d="M 0.439 6.097 C 0.158 6.378 0 6.759 0 7.157 C 0 7.554 0.158 7.935 0.439 8.217 L 6.095 13.875 C 6.234 14.014 6.399 14.124 6.581 14.2 C 6.764 14.275 6.959 14.314 7.156 14.314 C 7.353 14.314 7.548 14.275 7.73 14.2 C 7.912 14.124 8.077 14.014 8.217 13.875 C 8.356 13.735 8.467 13.57 8.542 13.388 C 8.617 13.206 8.656 13.011 8.656 12.814 C 8.656 12.617 8.617 12.421 8.542 12.239 C 8.467 12.057 8.356 11.892 8.217 11.753 L 5.121 8.657 L 16.656 8.657 C 17.054 8.657 17.435 8.499 17.716 8.217 C 17.998 7.936 18.156 7.554 18.156 7.157 C 18.156 6.759 17.998 6.377 17.716 6.096 C 17.435 5.815 17.054 5.657 16.656 5.657 L 5.121 5.657 L 8.217 2.561 C 8.498 2.279 8.656 1.898 8.656 1.5 C 8.656 1.102 8.498 0.72 8.216 0.439 C 7.935 0.158 7.553 0 7.155 0 C 6.757 0 6.376 0.158 6.095 0.44 L 0.439 6.097 Z" fill="currentColor" fillRule="nonzero" />
        </g>
      </g>
    </svg>
  );
}
