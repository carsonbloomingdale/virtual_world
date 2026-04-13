import type { ReactNode } from "react";
import type { TimelineRenderContext, TimelineRowMeta } from "../timeline-types.js";

/**
 * All simple-timeline options live here so the component surface stays `{ config }` only.
 * Additive changes belong on this type (semver-minor) rather than on component props.
 */
export type SimpleVirtualizedTimelineConfig<T> = {
  items: readonly T[];
  estimateRowHeight: number;
  renderItem: (meta: TimelineRowMeta<T>, ctx: TimelineRenderContext) => ReactNode;
  /**
   * Reserved namespace for forward-compatible extensions without widening component props.
   * @example experimental: { prefetch: true } // future
   */
  experimental?: Record<string, unknown>;
};
