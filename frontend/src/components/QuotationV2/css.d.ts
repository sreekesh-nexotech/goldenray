import "react";

declare module "react" {
  interface CSSProperties {
    /**
     * CSS `text-box` (leading trim), used throughout the Figma-extracted
     * quotation pages; not yet part of React's CSSProperties.
     */
    textBox?: string;
  }
}
