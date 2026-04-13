import { layout, prepare, type LayoutResult, type PreparedText, type PrepareOptions } from "@chenglou/pretext";

/** Mirrors `@chenglou/pretext` `PrepareOptions`; keep font string in sync with CSS `font`. */
export type BodyTextPrepareOptions = PrepareOptions;

/**
 * One-time work per distinct `(text, font, options)` tuple. Reuse the handle for repeated
 * `layoutBodyTextBlock` calls (e.g. column resize) instead of re-preparing.
 */
export function prepareBodyText(
  text: string,
  fontCss: string,
  options?: BodyTextPrepareOptions,
): PreparedText {
  return prepare(text, fontCss, options);
}

/** Hot path: pure arithmetic from Pretext; no DOM reads. */
export function layoutBodyTextBlock(
  prepared: PreparedText,
  maxWidthPx: number,
  lineHeightPx: number,
): LayoutResult {
  return layout(prepared, maxWidthPx, lineHeightPx);
}

export type { LayoutResult, PreparedText };
