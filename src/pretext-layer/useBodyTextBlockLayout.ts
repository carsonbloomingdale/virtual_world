import { useMemo } from "react";
import {
  layoutBodyTextBlock,
  prepareBodyText,
  type BodyTextPrepareOptions,
  type LayoutResult,
} from "./bodyTextLayout.js";

export type UseBodyTextBlockLayoutArgs = {
  text: string;
  /** Canvas/CSS `font` shorthand; must match the rendered body text. */
  fontCss: string;
  prepareOptions?: BodyTextPrepareOptions;
  /** Content width for wrapping (often from `useContentWidthPx`). */
  maxWidthPx: number;
  /** CSS `line-height` in px; must match rendered body text. */
  lineHeightPx: number;
};

/**
 * Derives `{ height, lineCount }` from [@chenglou/pretext](https://github.com/chenglou/pretext)
 * without measuring the text subtree in the DOM.
 */
export function useBodyTextBlockLayout(args: UseBodyTextBlockLayoutArgs): LayoutResult {
  const { text, fontCss, prepareOptions, maxWidthPx, lineHeightPx } = args;

  const ws = prepareOptions?.whiteSpace;
  const wb = prepareOptions?.wordBreak;

  const prepared = useMemo(
    () => prepareBodyText(text, fontCss, prepareOptions),
    [text, fontCss, ws, wb],
  );

  return useMemo(
    () => layoutBodyTextBlock(prepared, maxWidthPx, lineHeightPx),
    [prepared, maxWidthPx, lineHeightPx],
  );
}
