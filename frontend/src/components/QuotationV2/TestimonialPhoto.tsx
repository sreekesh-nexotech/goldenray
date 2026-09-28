import type { CSSProperties } from "react";

/**
 * The photo on a page-6 testimonial card: the design's stock photo (a
 * `fig-asset-*` class from quotation-v2.css) unless the testimonial has its
 * own, which is then cropped to fill the same box.
 */
const STOCK_PHOTO_CLASS = "fig-asset-a633cb1664c8569f-76d774a5";
const STOCK_PHOTO_FILE = "a633cb1664c8569f.jpg";

export default function TestimonialPhoto({
  image,
  style,
}: {
  image: string | null;
  style?: CSSProperties;
}) {
  // The library reports the stock photo's URL for rows without their own; the
  // CSS class frames that one exactly as the design did.
  if (!image || image.endsWith(STOCK_PHOTO_FILE)) {
    return <div className={STOCK_PHOTO_CLASS} style={style} />;
  }
  return (
    <div
      style={{
        ...style,
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}
