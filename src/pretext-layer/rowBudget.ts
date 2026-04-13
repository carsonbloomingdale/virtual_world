/**
 * Split vertical budget so Pretext covers **text** and the app owns **chrome**
 * (padding, media, embeds). Virtual row height is typically `text + chrome`.
 *
 * DOM-heavy work should stay on the chrome side (or use one-shot width like
 * `useContentWidthPx`); avoid per-frame `getBoundingClientRect` on the text body.
 */
export type RowVerticalBudget = {
  bodyTextHeightPx: number;
  chromeHeightPx: number;
};

export function totalRowHeightPx(budget: RowVerticalBudget): number {
  return budget.bodyTextHeightPx + budget.chromeHeightPx;
}

/** Sum fixed or measured chrome blocks (images, padding, embed chrome, etc.). */
export function sumVerticalChrome(...parts: number[]): number {
  let s = 0;
  for (const p of parts) s += p;
  return s;
}
