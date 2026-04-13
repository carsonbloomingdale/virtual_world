import type { CSSProperties } from "react";
import { useBodyTextBlockLayout, type UseBodyTextBlockLayoutArgs } from "./useBodyTextBlockLayout.js";

export type PretextBodyBlockProps = Pick<
  UseBodyTextBlockLayoutArgs,
  "text" | "fontCss" | "prepareOptions" | "maxWidthPx" | "lineHeightPx"
> & {
  className?: string;
  style?: CSSProperties;
};

/**
 * Renders body copy with height driven by [@chenglou/pretext](https://github.com/chenglou/pretext)
 * (`layout`), not by measuring this node’s text in the DOM. Keep `fontCss` / `lineHeightPx`
 * aligned with the inner styles below.
 *
 * For empty strings, Pretext returns `{ lineCount: 0, height: 0 }`; browsers often still
 * reserve one line — clamp in your virtualizer if you need that behavior.
 */
export function PretextBodyBlock({
  text,
  fontCss,
  prepareOptions,
  maxWidthPx,
  lineHeightPx,
  className,
  style,
}: PretextBodyBlockProps) {
  const { height } = useBodyTextBlockLayout({
    text,
    fontCss,
    prepareOptions,
    maxWidthPx,
    lineHeightPx,
  });

  const whiteSpace = prepareOptions?.whiteSpace ?? "normal";

  return (
    <div
      className={className}
      style={{
        height,
        overflow: "hidden",
        boxSizing: "border-box",
        ...style,
      }}
    >
      <div style={{ font: fontCss, lineHeight: `${lineHeightPx}px`, whiteSpace }}>{text}</div>
    </div>
  );
}
