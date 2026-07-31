import type { ReactNode } from "react";

interface A4PageFrameProps {
  children: ReactNode;
  /** Debug/testing hook identifying the page, e.g. "02-onam-fest". */
  pageId?: string;
}

/**
 * One printable A4 sheet of the quotation. The design pages are authored on a
 * fixed 1440×2038 canvas; .qv2-sheet/.qv2-canvas (quotation-v2.css) scale that
 * canvas down to exactly 210mm wide so the browser prints one design page per
 * A4 sheet.
 */
export default function A4PageFrame({ children, pageId }: A4PageFrameProps) {
  return (
    <section className="qv2-sheet" data-page={pageId}>
      <div className="qv2-canvas">{children}</div>
    </section>
  );
}
