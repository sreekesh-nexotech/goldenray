// Page 1 of the Flarize quotation document (English) — Cover — Stop Worrying About Electricity Bills Forever; proposal details
import type { CSSProperties } from "react";
import FooterLocationPin from "../icons/FooterLocationPin";
import type { QuotationV2Data } from "../quotationV2Data";

interface Page01CoverProps {
  className?: string;
  style?: CSSProperties;
  /** Derived quotation values for this customer. */
  data: QuotationV2Data;
}

const POPPINS =
  'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

/**
 * One "Label : Value" line of the proposal-details panel.
 *
 * The Figma export gave each of the twelve rows a slightly different shape —
 * some sized the value column with `flexGrow`, others pinned it to 271px, and
 * all of them set `lineHeight: 100%`. That left the colons out of line with
 * each other and made any value longer than the column either overflow or wrap
 * into itself. One row component with a fixed label column keeps every colon on
 * the same edge, and lets a long value wrap cleanly under itself instead.
 */
function DetailRow({
  label,
  value,
  labelWidth,
}: {
  label: string;
  value: string;
  /** Width of the label column; the colon sits at its right edge. */
  labelWidth: number;
}) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        flexWrap: "nowrap",
        flexShrink: 0,
        alignSelf: "stretch",
      }}
    >
      <span
        style={{
          position: "relative",
          width: labelWidth,
          flexShrink: 0,
          fontFamily: POPPINS,
          fontWeight: 500,
          fontSize: 22,
          lineHeight: "130%",
          color: "rgb(55,65,81)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          position: "relative",
          flexGrow: 1,
          // Without this a flex item refuses to shrink below its content width,
          // which is what pushes a long value out past the panel edge.
          minWidth: 0,
          fontFamily: POPPINS,
          fontWeight: 600,
          fontSize: 22,
          lineHeight: "130%",
          color: "rgb(18,53,50)",
          whiteSpace: "pre-wrap",
          overflowWrap: "anywhere",
        }}
      >
        : {value}
      </span>
    </div>
  );
}

export default function Page01Cover({
  className,
  style,
  data,
}: Page01CoverProps) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: 1440,
        height: 2038,
        overflow: "hidden",
        backgroundColor: "rgb(255,255,255)",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1440,
          height: 2038,
          display: "flex",
          flexDirection: "column",
          padding: "0px 80px 0px 80px",
          alignItems: "center",
          flexWrap: "nowrap",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 40,
            padding: "40px 0px 40px 0px",
            alignItems: "flex-end",
            flexWrap: "nowrap",
            boxSizing: "border-box",
            flexShrink: 0,
            alignSelf: "stretch",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "row",
              gap: 11,
              justifyContent: "center",
              alignItems: "flex-end",
              flexWrap: "nowrap",
              flexShrink: 0,
            }}
          >
            <div
              className="fig-asset-db0497502244a62d-3df8ef3e"
              style={{
                position: "relative",
                width: 147,
                height: 31,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                position: "relative",
                width: 327,
                fontFamily:
                  'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                fontWeight: 300,
                fontSize: 18,
                lineHeight: 1.399999976158142,
                color: "rgb(18,53,50)",
                flexShrink: 0,
              }}
            >
               by Golden Ray
            </span>
          </div>
        </div>
        <div
          style={{
            position: "relative",
            width: 1440,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "nowrap",
            flexGrow: 1,
          }}
        >
          <div
            style={{
              position: "relative",
              width: 1269,
              height: 408.972,
              overflow: "hidden",
              borderRadius: 1,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 1269,
                height: 408.972,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 1269,
                  height: 408.972,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: 1269,
                    height: 408.9722900390625,
                    clipPath: "inset(0px 0px 0px 0px round 23px)",
                  }}
                >
                  <div
                    className="fig-asset-efb490138fedbb55-85f393ff"
                    style={{
                      position: "absolute",
                      left: -25.788,
                      top: -356.008,
                      width: 1294.788,
                      height: 862.675,
                      borderRadius: 23,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              position: "relative",
              backgroundColor: "rgba(0,0,0,0)",
              display: "flex",
              flexDirection: "column",
              gap: 24,
              padding: "0px 30px 0px 30px",
              alignItems: "center",
              flexWrap: "nowrap",
              boxSizing: "border-box",
              flexShrink: 0,
              alignSelf: "stretch",
            }}
          >
            <span
              style={{
                position: "relative",
                fontFamily:
                  'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                fontWeight: 600,
                fontSize: 58,
                textAlign: "center",
                lineHeight: "75px",
                letterSpacing: "-0.500px",
                color: "rgb(17,24,39)",
                flexShrink: 0,
                alignSelf: "stretch",
              }}
            >
              Stop Worrying About Electricity Bills Forever
            </span>
            <span
              style={{
                position: "relative",
                fontFamily:
                  'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                fontWeight: 600,
                fontSize: 24,
                textAlign: "center",
                lineHeight: "32px",
                letterSpacing: "-0.500px",
                color: "var(--grey)",
                flexShrink: 0,
                alignSelf: "stretch",
              }}
            >
              Empowering Kerala homes with clean energy, smart savings, and the
              joy of sustainability.
            </span>
          </div>
          <div
            style={{
              position: "relative",
              borderTop: "1px solid rgb(229,231,235)",
              borderRight: "1px solid rgb(229,231,235)",
              borderBottom: "2px solid rgb(229,231,235)",
              borderLeft: "1px solid rgb(229,231,235)",
              display: "flex",
              flexDirection: "row",
              gap: 116,
              padding: "24px 0px 24px 0px",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "nowrap",
              boxSizing: "border-box",
              flexShrink: 0,
              alignSelf: "stretch",
            }}
          >
            <div
              style={{
                position: "relative",
                backgroundColor: "rgba(0,0,0,0)",
                display: "flex",
                flexDirection: "row",
                gap: 20,
                alignItems: "center",
                flexWrap: "nowrap",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: 46,
                  height: 46,
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <svg
                  width={42.471}
                  height={46.0}
                  viewBox="0 0 42.471 46.000"
                  fill="none"
                  style={{
                    position: "absolute",
                    left: 1.764,
                    top: 0,
                    width: 42.471,
                    height: 46,
                    color: "var(--green-3)",
                  }}
                >
                  <path
                    d="M 42.471 31.846 C 42.471 41.611 33.623 46 21.236 46 C 8.848 46 0 41.611 0 31.915 C 0 21.298 5.31 15.92 15.926 10.541 L 12.167 3.539 C 11.943 3.188 11.818 2.783 11.806 2.367 C 11.793 1.951 11.894 1.54 12.098 1.176 C 12.301 0.813 12.599 0.512 12.96 0.305 C 13.322 0.098 13.732 -0.007 14.148 0 L 29.154 0 C 29.544 0.01 29.925 0.119 30.262 0.317 C 30.598 0.515 30.879 0.796 31.077 1.132 C 31.275 1.468 31.384 1.849 31.395 2.239 C 31.405 2.629 31.316 3.016 31.135 3.362 L 26.545 10.541 C 37.158 15.847 42.471 21.226 42.471 31.846 Z M 14.523 21.358 L 20.053 21.358 C 20.513 21.496 21.091 21.752 21.554 22.179 C 21.901 22.494 22.157 22.895 22.297 23.342 L 14.526 23.342 C 14.31 23.342 14.097 23.385 13.897 23.467 C 13.698 23.55 13.517 23.671 13.364 23.823 C 13.212 23.976 13.091 24.157 13.008 24.356 C 12.926 24.556 12.883 24.769 12.883 24.985 C 12.883 25.201 12.926 25.414 13.008 25.614 C 13.091 25.813 13.212 25.994 13.364 26.147 C 13.517 26.299 13.698 26.42 13.897 26.503 C 14.097 26.585 14.31 26.628 14.526 26.628 L 21.778 26.628 C 21.213 27.255 20.497 27.727 19.698 27.998 C 18.668 28.374 17.584 28.582 16.488 28.612 L 16.438 28.612 C 16.104 28.613 15.778 28.715 15.503 28.906 C 15.228 29.097 15.018 29.367 14.901 29.68 C 14.784 29.993 14.765 30.335 14.847 30.659 C 14.929 30.983 15.109 31.274 15.361 31.494 L 15.367 31.501 L 15.384 31.51 L 15.426 31.55 C 15.66 31.748 15.9 31.937 16.146 32.118 C 18.979 34.234 22.201 35.771 25.629 36.643 C 25.84 36.701 26.06 36.716 26.277 36.687 C 26.494 36.659 26.704 36.587 26.893 36.476 C 27.082 36.366 27.247 36.219 27.378 36.043 C 27.509 35.868 27.604 35.668 27.657 35.456 C 27.71 35.244 27.72 35.023 27.686 34.806 C 27.653 34.59 27.576 34.383 27.461 34.196 C 27.347 34.01 27.196 33.848 27.017 33.721 C 26.839 33.594 26.637 33.504 26.424 33.456 C 24.414 32.94 22.481 32.162 20.674 31.142 L 20.851 31.077 C 21.962 30.659 23.184 29.996 24.137 28.921 C 24.712 28.281 25.162 27.515 25.441 26.628 L 27.945 26.628 C 28.381 26.628 28.799 26.455 29.107 26.147 C 29.415 25.839 29.588 25.421 29.588 24.985 C 29.588 24.549 29.415 24.131 29.107 23.823 C 28.799 23.515 28.381 23.342 27.945 23.342 L 25.665 23.342 C 25.561 22.649 25.341 21.978 25.014 21.358 L 27.945 21.358 C 28.381 21.358 28.799 21.184 29.107 20.876 C 29.415 20.568 29.588 20.15 29.588 19.715 C 29.588 19.279 29.415 18.861 29.107 18.553 C 28.799 18.245 28.381 18.072 27.945 18.072 L 14.526 18.072 C 14.09 18.072 13.673 18.245 13.364 18.553 C 13.056 18.861 12.883 19.279 12.883 19.715 C 12.883 20.15 13.056 20.568 13.364 20.876 C 13.673 21.184 14.09 21.358 14.526 21.358 L 14.523 21.358 Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <div
                style={{
                  position: "relative",
                  backgroundColor: "rgba(0,0,0,0)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  flexWrap: "nowrap",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    position: "relative",
                    fontFamily:
                      'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 700,
                    fontSize: 32,
                    lineHeight: "35.5px",
                    letterSpacing: "-0.500px",
                    color: "var(--1-2)",
                    flexShrink: 0,
                    alignSelf: "stretch",
                  }}
                >
                  {data.heroStatMain}
                </span>
                <span
                  style={{
                    position: "relative",
                    fontFamily:
                      'var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 400,
                    fontSize: 23,
                    lineHeight: "25.5px",
                    letterSpacing: "-0.500px",
                    color: "rgb(75,85,99)",
                    flexShrink: 0,
                    alignSelf: "stretch",
                  }}
                >
                  {data.heroStatSub}
                </span>
              </div>
            </div>
            <div
              style={{
                position: "relative",
                backgroundColor: "rgba(0,0,0,0)",
                display: "flex",
                flexDirection: "row",
                gap: 20,
                alignItems: "center",
                flexWrap: "nowrap",
                flexShrink: 0,
              }}
            >
              <svg
                width={46}
                height={46}
                viewBox="0 0 46 46"
                fill="none"
                style={{
                  position: "relative",
                  width: 46,
                  height: 46,
                  flexShrink: 0,
                  color: "var(--green-3)",
                }}
              >
                <path
                  d="M 23.05 31.625 C 23.632 23.566 29.052 17.25 35.65 17.25 C 36.29 17.25 36.915 17.313 37.526 17.421 L 22.245 0.629 C 21.814 0.18 21.239 0 20.736 0 C 20.233 0 19.658 0.09 19.155 0.719 L 0.719 20.799 C 0.216 21.428 0 22.146 0 22.955 C 0 24.572 1.006 25.839 2.3 25.839 L 4.6 25.839 L 4.6 32.101 C 4.593 32.182 4.593 32.263 4.593 32.353 L 4.593 42.406 C 4.593 44.392 5.879 46 7.468 46 L 8.618 46 C 8.704 46 8.79 45.991 8.877 45.982 C 8.984 45.991 9.092 46 9.2 46 L 11.5 46 L 13.225 46 C 14.813 46 16.1 44.392 16.1 42.406 L 16.1 40.25 L 16.1 34.5 C 16.1 32.91 17.128 31.625 18.4 31.625 L 23 31.625 L 23.05 31.625 Z M 46 33.063 C 46 29.631 44.91 26.341 42.969 23.914 C 41.028 21.488 38.395 20.125 35.65 20.125 C 32.905 20.125 30.272 21.488 28.331 23.914 C 26.39 26.341 25.3 29.631 25.3 33.063 C 25.3 36.494 26.39 39.784 28.331 42.211 C 30.272 44.637 32.905 46 35.65 46 C 38.395 46 41.028 44.637 42.969 42.211 C 44.91 39.784 46 36.494 46 33.063 Z M 40.487 29.172 C 40.933 29.729 40.933 30.646 40.487 31.203 L 35.312 37.671 C 34.867 38.229 34.133 38.229 33.688 37.671 L 30.813 34.078 C 30.367 33.521 30.367 32.604 30.813 32.047 C 31.258 31.49 31.992 31.49 32.437 32.047 L 34.5 34.626 L 38.863 29.172 C 39.308 28.615 40.042 28.615 40.487 29.172 Z"
                  fill="currentColor"
                  fillRule="nonzero"
                />
              </svg>
              <div
                style={{
                  position: "relative",
                  backgroundColor: "rgba(0,0,0,0)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  flexWrap: "nowrap",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    position: "relative",
                    fontFamily:
                      'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 700,
                    fontSize: 32,
                    lineHeight: "35.5px",
                    letterSpacing: "-0.500px",
                    color: "var(--1-2)",
                    flexShrink: 0,
                    alignSelf: "stretch",
                  }}
                >
                  300+ Homes
                </span>
                <span
                  style={{
                    position: "relative",
                    fontFamily:
                      'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 400,
                    fontSize: 23,
                    lineHeight: "25.5px",
                    letterSpacing: "-0.500px",
                    color: "rgb(75,85,99)",
                    flexShrink: 0,
                    alignSelf: "stretch",
                  }}
                >
                  Installed in Kerala
                </span>
              </div>
            </div>
            <div
              style={{
                position: "relative",
                backgroundColor: "rgba(0,0,0,0)",
                display: "flex",
                flexDirection: "row",
                gap: 20,
                alignItems: "center",
                flexWrap: "nowrap",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: 47,
                  height: 47,
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <svg
                  width={46}
                  height={46}
                  viewBox="0 0 46 46"
                  fill="none"
                  style={{
                    position: "absolute",
                    left: 0.691,
                    top: 0.691,
                    width: 46,
                    height: 46,
                    color: "var(--green-3)",
                  }}
                >
                  <path
                    d="M 34.319 1.944 C 33.862 1.214 33.189 0.645 32.394 0.315 C 31.598 -0.014 30.72 -0.088 29.881 0.106 L 23.926 1.474 C 23.315 1.614 22.681 1.614 22.071 1.474 L 16.116 0.106 C 15.277 -0.088 14.398 -0.014 13.603 0.315 C 12.807 0.645 12.134 1.214 11.677 1.944 L 8.431 7.124 C 8.1 7.654 7.653 8.101 7.123 8.436 L 1.943 11.682 C 1.214 12.138 0.646 12.81 0.317 13.605 C -0.013 14.399 -0.087 15.276 0.105 16.114 L 1.473 22.076 C 1.613 22.685 1.613 23.318 1.473 23.928 L 0.105 29.887 C -0.088 30.725 -0.014 31.603 0.316 32.398 C 0.645 33.193 1.214 33.865 1.943 34.322 L 7.123 37.568 C 7.653 37.899 8.1 38.346 8.435 38.876 L 11.681 44.057 C 12.615 45.551 14.397 46.289 16.116 45.895 L 22.071 44.527 C 22.681 44.387 23.315 44.387 23.926 44.527 L 29.884 45.895 C 30.723 46.087 31.6 46.014 32.395 45.684 C 33.19 45.355 33.862 44.786 34.319 44.057 L 37.565 38.876 C 37.896 38.346 38.343 37.899 38.873 37.568 L 44.057 34.322 C 44.786 33.865 45.354 33.191 45.683 32.396 C 46.012 31.6 46.085 30.722 45.891 29.883 L 44.527 23.928 C 44.387 23.317 44.387 22.683 44.527 22.073 L 45.895 16.114 C 46.087 15.276 46.014 14.398 45.685 13.603 C 45.357 12.809 44.788 12.136 44.06 11.679 L 38.876 8.433 C 38.347 8.101 37.9 7.654 37.568 7.124 L 34.319 1.944 Z M 32.653 15.614 C 32.858 15.237 32.909 14.796 32.795 14.382 C 32.681 13.969 32.411 13.616 32.042 13.397 C 31.673 13.179 31.233 13.112 30.816 13.211 C 30.399 13.31 30.036 13.567 29.805 13.928 L 21.143 28.588 L 15.914 23.58 C 15.758 23.421 15.573 23.294 15.368 23.208 C 15.163 23.122 14.942 23.078 14.72 23.079 C 14.498 23.08 14.278 23.126 14.073 23.214 C 13.869 23.302 13.685 23.43 13.531 23.59 C 13.377 23.751 13.257 23.941 13.178 24.149 C 13.1 24.357 13.064 24.579 13.072 24.801 C 13.081 25.023 13.135 25.241 13.23 25.442 C 13.324 25.643 13.459 25.823 13.625 25.971 L 20.362 32.427 C 20.542 32.6 20.759 32.729 20.996 32.806 C 21.234 32.883 21.485 32.905 21.732 32.871 C 21.98 32.837 22.216 32.747 22.423 32.609 C 22.631 32.471 22.805 32.288 22.932 32.073 L 32.653 15.614 Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <div
                style={{
                  position: "relative",
                  backgroundColor: "rgba(0,0,0,0)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  flexWrap: "nowrap",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    position: "relative",
                    fontFamily:
                      'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 700,
                    fontSize: 32,
                    lineHeight: "35.5px",
                    letterSpacing: "-0.500px",
                    color: "var(--1-2)",
                    flexShrink: 0,
                    alignSelf: "stretch",
                  }}
                >
                  MNRE Empanelled
                </span>
                <span
                  style={{
                    position: "relative",
                    fontFamily:
                      'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 400,
                    fontSize: 23,
                    lineHeight: "25.5px",
                    letterSpacing: "-0.500px",
                    color: "rgb(75,85,99)",
                    flexShrink: 0,
                    alignSelf: "stretch",
                  }}
                >
                  Government certified
                </span>
              </div>
            </div>
          </div>
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              boxShadow: "0px 0.500px 1px 0px rgba(25,33,61,0.04)",
              display: "flex",
              flexDirection: "row",
              gap: 30,
              padding: "16px 80px 16px 80px",
              alignItems: "center",
              flexWrap: "nowrap",
              boxSizing: "border-box",
              flexShrink: 0,
              alignSelf: "stretch",
            }}
          >
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                gap: 24,
                alignItems: "flex-start",
                flexWrap: "nowrap",
                flexGrow: 1,
              }}
            >
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  alignItems: "flex-start",
                  flexWrap: "nowrap",
                  flexShrink: 0,
                  alignSelf: "stretch",
                }}
              >
                <span
                  style={{
                    position: "relative",
                    fontFamily:
                      'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 700,
                    fontSize: 28,
                    whiteSpace: "nowrap",
                    lineHeight: 1.2000000476837158,
                    color: "var(--2-2)",
                    flexShrink: 0,
                    alignSelf: "stretch",
                  }}
                >
                  Dear {data.firstName},
                </span>
                <span
                  style={{
                    position: "relative",
                    fontFamily:
                      'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 400,
                    fontSize: 24,
                    lineHeight: 1.309999942779541,
                    color: "rgb(0,0,0)",
                    flexShrink: 0,
                    alignSelf: "stretch",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  Thank you for considering Flarize for your home. Choosing
                  solar is one of the smartest decisions you can make for your
                  home. It&apos;s more than reducing your electricity
                  bill—it&apos;s about enjoying a better lifestyle, protecting
                  your family from rising electricity costs, and investing in a
                  home that continues to reward you for years to come.
                  We&apos;ve carefully designed this solution specifically for
                  your home&apos;s energy needs, so you can make your decision
                  with complete confidence.
                </span>
              </div>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "row",
                  gap: 21,
                  alignItems: "center",
                  flexWrap: "nowrap",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    position: "relative",
                    fontFamily:
                      'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 400,
                    fontSize: 24,
                    lineHeight: 1.5,
                    color: "rgb(0,0,0)",
                    flexShrink: 0,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: 24,
                    }}
                  >
                    Warm Regards,{" "}
                  </span>
                  {"\n"}
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: 24,
                    }}
                  >
                    Team Flarize
                  </span>
                </span>
                <div
                  className="fig-asset-3505ba533a4c31a4"
                  style={{
                    position: "relative",
                    width: 154.266,
                    height: 64.842,
                    flexShrink: 0,
                  }}
                />
                <div
                  className="fig-asset-fb37b4210913ca92-fba75ad2"
                  style={{
                    position: "relative",
                    width: 94.626,
                    height: 86.201,
                    flexShrink: 0,
                  }}
                />
              </div>
            </div>
          </div>
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              padding: "30px 80px 30px 80px",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "nowrap",
              boxSizing: "border-box",
              flexShrink: 0,
              alignSelf: "stretch",
            }}
          >
            <span
              style={{
                position: "relative",
                fontFamily:
                  'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                fontWeight: 600,
                fontSize: 28,
                lineHeight: "60px",
                letterSpacing: "-0.960px",
                color: "var(--black)",
                flexShrink: 0,
                alignSelf: "stretch",
              }}
            >
              YOUR PROPOSAL DETAILS
            </span>
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "row",
                gap: 28,
                padding: "0px 80px 0px 80px",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "nowrap",
                boxSizing: "border-box",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: 626,
                  overflow: "hidden",
                  borderTop: "1px solid var(--grays-gray-5)",
                  borderRight: "1px solid var(--grays-gray-5)",
                  borderBottom: "1px solid var(--grays-gray-5)",
                  borderLeft: "1px solid var(--grays-gray-5)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 32,
                  padding: "20px 20px 20px 20px",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  flexWrap: "nowrap",
                  boxSizing: "border-box",
                  flexShrink: 0,
                  alignSelf: "stretch",
                }}
              >
                <DetailRow
                  label="Name"
                  value={data.customerName}
                  labelWidth={200}
                />
                <DetailRow
                  label="Address"
                  value={data.address}
                  labelWidth={200}
                />
                <DetailRow
                  label="pincode"
                  value={data.pincode}
                  labelWidth={200}
                />
                <DetailRow
                  label="Phone Number"
                  value={data.phoneNumber}
                  labelWidth={200}
                />
                <DetailRow
                  label="Current Bill"
                  value={data.currentBill}
                  labelWidth={200}
                />
                <DetailRow
                  label="System Size"
                  value={data.systemSize}
                  labelWidth={200}
                />
              </div>
              <div
                style={{
                  position: "relative",
                  width: 626,
                  overflow: "hidden",
                  borderRadius: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 32,
                  padding: "20px 20px 20px 20px",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  flexWrap: "nowrap",
                  boxSizing: "border-box",
                  flexShrink: 0,
                  alignSelf: "stretch",
                }}
              >
                <DetailRow
                  label="Quo No"
                  value={data.quoteNo}
                  labelWidth={260}
                />
                <DetailRow
                  label="Proposal By"
                  value={data.proposalBy}
                  labelWidth={260}
                />
                <DetailRow
                  label="Date"
                  value={data.currentDate}
                  labelWidth={260}
                />
                <DetailRow
                  label="Valid Until"
                  value={data.validUntilDate}
                  labelWidth={260}
                />
                <DetailRow label="GST No" value={data.gstNo} labelWidth={260} />
                <DetailRow
                  label="Company Registration"
                  value={data.companyRegistration}
                  labelWidth={260}
                />
              </div>
            </div>
          </div>
          <div
            style={{
              position: "relative",
              height: 98,
              backgroundColor: "rgb(247,244,230)",
              flexShrink: 0,
              alignSelf: "stretch",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 786,
                top: 14,
                display: "flex",
                flexDirection: "row",
                gap: 36,
                alignItems: "center",
                flexWrap: "nowrap",
              }}
            >
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "row",
                  gap: 7,
                  alignItems: "center",
                  flexWrap: "nowrap",
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "row",
                  gap: 7,
                  alignItems: "center",
                  flexWrap: "nowrap",
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "row",
                  gap: 7,
                  alignItems: "center",
                  flexWrap: "nowrap",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: 18,
                    height: 18,
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <FooterLocationPin />
                </div>
              </div>
            </div>
            <div
              className="fig-asset-db0497502244a62d-3df8ef3e"
              style={{
                position: "absolute",
                left: 85,
                top: 30,
                width: 154,
                height: 33,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 319,
                top: 25,
                display: "flex",
                flexDirection: "row",
                gap: 48,
                alignItems: "center",
                flexWrap: "nowrap",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: 285,
                  display: "flex",
                  flexDirection: "row",
                  gap: 11,
                  alignItems: "center",
                  flexWrap: "nowrap",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "row",
                    gap: 10,
                    padding: "2px 4px 2px 4px",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    boxSizing: "border-box",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width={16}
                    height={23}
                    viewBox="0 0 16 23"
                    fill="none"
                    style={{
                      position: "relative",
                      width: 16,
                      height: 23,
                      flexShrink: 0,
                      color: "rgb(18,53,50)",
                    }}
                  >
                    <path
                      d="M 8 5.175 C 8.758 5.175 9.484 5.478 10.02 6.017 C 10.556 6.556 10.857 7.288 10.857 8.05 C 10.857 8.428 10.783 8.801 10.64 9.15 C 10.496 9.499 10.286 9.816 10.02 10.083 C 9.755 10.35 9.44 10.562 9.093 10.706 C 8.747 10.851 8.375 10.925 8 10.925 C 7.242 10.925 6.516 10.622 5.98 10.083 C 5.444 9.544 5.143 8.812 5.143 8.05 C 5.143 7.288 5.444 6.556 5.98 6.017 C 6.516 5.478 7.242 5.175 8 5.175 Z M 8 0 C 10.122 0 12.157 0.848 13.657 2.358 C 15.157 3.867 16 5.915 16 8.05 C 16 14.087 8 23 8 23 C 8 23 0 14.087 0 8.05 C 0 5.915 0.843 3.867 2.343 2.358 C 3.843 0.848 5.878 0 8 0 Z M 8 2.3 C 6.484 2.3 5.031 2.906 3.959 3.984 C 2.888 5.062 2.286 6.525 2.286 8.05 C 2.286 9.2 2.286 11.5 8 19.216 C 13.714 11.5 13.714 9.2 13.714 8.05 C 13.714 6.525 13.112 5.062 12.041 3.984 C 10.969 2.906 9.516 2.3 8 2.3 Z"
                      fill="currentColor"
                      fillRule="nonzero"
                    />
                  </svg>
                </div>
                <span
                  style={{
                    position: "relative",
                    fontFamily:
                      'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 500,
                    fontSize: 18,
                    lineHeight: 1.399999976158142,
                    color: "rgb(18,53,50)",
                    flexGrow: 1,
                  }}
                >
                  Thannikakal, Thumpoly PO, Alappuzha– 688008
                </span>
              </div>
              <div
                style={{
                  position: "relative",
                  width: 192,
                  flexShrink: 0,
                  alignSelf: "stretch",
                }}
              >
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 18 18"
                  fill="none"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 16,
                    width: 18,
                    height: 18,
                    color: "rgb(18,53,50)",
                  }}
                >
                  <path
                    d="M 9.009 18 C 13.931 18 18 13.921 18 9 C 18 4.088 13.921 0 9 0 C 4.079 0 0 4.088 0 9 C 0 13.921 4.088 18 9.009 18 Z M 6.399 4.305 C 6.934 2.955 7.668 1.985 8.474 1.686 L 8.474 4.514 C 7.731 4.495 7.033 4.423 6.399 4.305 Z M 9.517 1.686 C 10.323 1.985 11.066 2.955 11.592 4.305 C 10.958 4.423 10.269 4.495 9.517 4.514 L 9.517 1.686 Z M 11.429 1.94 C 12.399 2.275 13.278 2.792 14.012 3.471 C 13.613 3.698 13.151 3.888 12.634 4.051 C 12.308 3.208 11.891 2.492 11.429 1.94 Z M 3.979 3.471 C 4.722 2.801 5.601 2.275 6.571 1.94 C 6.1 2.492 5.692 3.208 5.356 4.051 C 4.849 3.888 4.387 3.698 3.979 3.471 Z M 13.495 8.474 C 13.45 7.214 13.26 6.045 12.961 5.012 C 13.64 4.804 14.239 4.541 14.746 4.233 C 15.707 5.393 16.332 6.861 16.441 8.474 L 13.495 8.474 Z M 1.559 8.474 C 1.668 6.861 2.284 5.393 3.254 4.233 C 3.752 4.541 4.36 4.804 5.03 5.012 C 4.731 6.045 4.55 7.214 4.505 8.474 L 1.559 8.474 Z M 9.517 8.474 L 9.517 5.556 C 10.369 5.529 11.175 5.429 11.927 5.275 C 12.199 6.245 12.381 7.332 12.426 8.474 L 9.517 8.474 Z M 5.574 8.474 C 5.61 7.332 5.792 6.245 6.073 5.275 C 6.816 5.429 7.631 5.529 8.474 5.556 L 8.474 8.474 L 5.574 8.474 Z M 1.559 9.517 L 4.505 9.517 C 4.541 10.795 4.731 11.991 5.03 13.033 C 4.369 13.242 3.77 13.495 3.272 13.804 C 2.293 12.625 1.668 11.148 1.559 9.517 Z M 5.565 9.517 L 8.474 9.517 L 8.474 12.489 C 7.631 12.517 6.816 12.607 6.073 12.77 C 5.792 11.792 5.61 10.677 5.565 9.517 Z M 9.517 12.489 L 9.517 9.517 L 12.426 9.517 C 12.39 10.677 12.208 11.792 11.927 12.77 C 11.175 12.607 10.369 12.517 9.517 12.489 Z M 12.961 13.033 C 13.269 11.991 13.45 10.795 13.495 9.517 L 16.441 9.517 C 16.341 11.148 15.716 12.634 14.728 13.804 C 14.23 13.505 13.631 13.242 12.961 13.033 Z M 6.399 13.74 C 7.033 13.622 7.731 13.55 8.474 13.532 L 8.474 16.36 C 7.668 16.06 6.934 15.091 6.399 13.74 Z M 9.517 13.532 C 10.269 13.55 10.958 13.622 11.592 13.74 C 11.066 15.091 10.323 16.06 9.517 16.36 L 9.517 13.532 Z M 4.006 14.556 C 4.405 14.338 4.858 14.148 5.356 13.994 C 5.683 14.81 6.073 15.499 6.526 16.051 C 5.583 15.725 4.731 15.208 4.006 14.556 Z M 12.634 13.994 C 13.142 14.148 13.595 14.338 13.994 14.565 C 13.269 15.218 12.408 15.734 11.465 16.06 C 11.918 15.508 12.317 14.81 12.634 13.994 Z"
                    fill="currentColor"
                    fillRule="nonzero"
                  />
                </svg>
                <span
                  style={{
                    position: "absolute",
                    left: 29,
                    top: 12.5,
                    width: 149,
                    height: 25,
                    fontFamily:
                      'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 500,
                    fontSize: 18,
                    whiteSpace: "nowrap",
                    lineHeight: 1.399999976158142,
                    color: "rgb(18,53,50)",
                  }}
                >
                  www.flarize.com
                </span>
              </div>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "row",
                  gap: 11,
                  alignItems: "center",
                  flexWrap: "nowrap",
                  flexShrink: 0,
                  alignSelf: "stretch",
                }}
              >
                <svg
                  width={19}
                  height={15}
                  viewBox="0 0 19 15"
                  fill="none"
                  style={{
                    position: "relative",
                    width: 19,
                    height: 15,
                    flexShrink: 0,
                    color: "rgb(18,53,50)",
                  }}
                >
                  <path
                    d="M 18.321 0 L 0.679 0 C 0.303 0 0 0.305 0 0.682 L 0 14.318 C 0 14.695 0.303 15 0.679 15 L 18.321 15 C 18.697 15 19 14.695 19 14.318 L 19 0.682 C 19 0.305 18.697 0 18.321 0 Z M 17.473 2.361 L 17.473 13.466 L 1.527 13.466 L 1.527 2.361 L 0.942 1.903 L 1.775 0.827 L 2.682 1.536 L 16.32 1.536 L 17.227 0.827 L 18.061 1.903 L 17.473 2.361 Z M 16.32 1.534 L 9.5 6.861 L 2.68 1.534 L 1.773 0.825 L 0.939 1.901 L 1.525 2.359 L 8.768 8.018 C 8.977 8.18 9.233 8.269 9.497 8.269 C 9.761 8.269 10.017 8.18 10.225 8.018 L 17.473 2.361 L 18.058 1.903 L 17.225 0.827 L 16.32 1.534 Z"
                    fill="currentColor"
                    fillRule="nonzero"
                  />
                </svg>
                <span
                  style={{
                    position: "relative",
                    fontFamily:
                      'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 500,
                    fontSize: 18,
                    whiteSpace: "nowrap",
                    lineHeight: 1.399999976158142,
                    color: "rgb(18,53,50)",
                    flexShrink: 0,
                  }}
                >
                  sales@flarize.com
                </span>
              </div>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "row",
                  gap: 11,
                  alignItems: "center",
                  flexWrap: "nowrap",
                  flexShrink: 0,
                  alignSelf: "stretch",
                }}
              >
                <svg
                  width={17}
                  height={18}
                  viewBox="0 0 17 18"
                  fill="none"
                  style={{
                    position: "relative",
                    width: 17,
                    height: 18,
                    flexShrink: 0,
                    color: "rgb(18,53,50)",
                  }}
                >
                  <path
                    d="M 15.039 18 L 14.928 18 C 2.085 17.218 0.261 5.739 0.006 2.236 C -0.014 1.964 0.016 1.69 0.096 1.43 C 0.175 1.17 0.303 0.929 0.47 0.722 C 0.638 0.514 0.842 0.343 1.072 0.219 C 1.302 0.096 1.553 0.021 1.81 0 L 5.412 0 C 5.673 0 5.929 0.083 6.146 0.238 C 6.363 0.394 6.53 0.615 6.627 0.872 L 7.621 3.462 C 7.716 3.713 7.74 3.989 7.689 4.255 C 7.638 4.521 7.514 4.765 7.333 4.957 L 5.941 6.445 C 6.158 7.754 6.75 8.961 7.636 9.902 C 8.522 10.843 9.66 11.473 10.895 11.707 L 12.314 10.218 C 12.498 10.029 12.73 9.901 12.982 9.85 C 13.235 9.8 13.495 9.829 13.732 9.935 L 16.196 10.98 C 16.436 11.086 16.64 11.265 16.783 11.494 C 16.926 11.723 17.002 11.993 17 12.268 L 17 15.923 C 17 16.474 16.793 17.002 16.426 17.392 C 16.058 17.781 15.559 18 15.039 18 Z M 1.967 1.385 C 1.794 1.385 1.627 1.458 1.505 1.587 C 1.382 1.717 1.313 1.893 1.313 2.077 L 1.313 2.132 C 1.614 6.231 3.542 15.923 15 16.615 C 15.086 16.621 15.172 16.609 15.253 16.579 C 15.335 16.549 15.41 16.503 15.474 16.442 C 15.538 16.382 15.591 16.309 15.628 16.227 C 15.666 16.145 15.688 16.056 15.693 15.965 L 15.693 12.268 L 13.229 11.222 L 11.353 13.195 L 11.039 13.154 C 5.353 12.399 4.581 6.376 4.581 6.314 L 4.542 5.982 L 6.398 3.995 L 5.418 1.385 L 1.967 1.385 Z"
                    fill="currentColor"
                    fillRule="nonzero"
                  />
                </svg>
                <span
                  style={{
                    position: "relative",
                    fontFamily:
                      'var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 500,
                    fontSize: 18,
                    whiteSpace: "nowrap",
                    lineHeight: 1.399999976158142,
                    color: "rgb(18,53,50)",
                    flexShrink: 0,
                  }}
                >
                  +91 9995 073 579
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
