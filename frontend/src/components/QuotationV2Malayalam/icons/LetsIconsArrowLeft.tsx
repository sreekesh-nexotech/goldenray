// figma node: 1:22 lets-icons:arrow-left
import type { CSSProperties } from "react";

interface LetsIconsArrowLeftProps {
  className?: string;
  style?: CSSProperties;
}

export default function LetsIconsArrowLeft({ className, style }: LetsIconsArrowLeftProps) {
  return <div className={className} style={{
    width: 24,
    height: 24,
    position: "relative",
    color: "rgb(0,0,0)",
    ...style
  }}><svg width={17.414} height={13.414} viewBox="0 0 17.414 13.414" fill="none" style={{
      position: "absolute",
      left: 2.586,
      top: 5.293,
      width: 17.414,
      height: 13.414
    }}><path d="M 1.414 6.707 L 0.707 6 L 0 6.707 L 0.707 7.414 L 1.414 6.707 Z M 16.414 7.707 C 16.679 7.707 16.934 7.602 17.121 7.414 C 17.309 7.227 17.414 6.972 17.414 6.707 C 17.414 6.442 17.309 6.187 17.121 6 C 16.934 5.812 16.679 5.707 16.414 5.707 L 16.414 7.707 Z M 6.707 0 L 0.707 6 L 2.121 7.414 L 8.121 1.414 L 6.707 0 Z M 0.707 7.414 L 6.707 13.414 L 8.121 12 L 2.121 6 L 0.707 7.414 Z M 1.414 7.707 L 16.414 7.707 L 16.414 5.707 L 1.414 5.707 L 1.414 7.707 Z" fill="currentColor" fillRule="evenodd" /></svg></div>;
}
