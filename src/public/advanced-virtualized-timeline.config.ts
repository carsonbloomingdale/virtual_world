import type { CSSProperties, HTMLAttributes, ReactNode, RefObject } from "react";
import type {
  TimelineItemKey,
  TimelineRenderContext,
  TimelineRowMeta,
  TimelineRowRenderArgs,
} from "../timeline-types.js";

/**
 * Advanced timeline options: intersection, PreText, row chrome, image metrics, etc.
 * Kept separate from {@link SimpleVirtualizedTimelineConfig} for bundle and API clarity.
 */
export type AdvancedVirtualizedTimelineConfig<T> = {
  items: readonly T[];
  getItemKey: (item: T, index: number) => TimelineItemKey;
  estimateRowHeight: number;
  renderItem: (meta: TimelineRowMeta<T>, ctx: TimelineRenderContext) => ReactNode;
  getPreText?: (meta: TimelineRowMeta<T>) => ReactNode;
  preText?: {
    lines: number;
    lineHeightPx: number;
    className?: string;
    style?: CSSProperties;
  };
  overscanPx?: number;
  intersectionRoot?: RefObject<Element | null>;
  intersectionRootMargin?: string;
  intersectionThreshold?: number | number[];
  onItemIntersect?: (meta: TimelineRowMeta<T>, entry: IntersectionObserverEntry) => void;
  getRowProps?: (
    meta: TimelineRowMeta<T>,
  ) => HTMLAttributes<HTMLDivElement> & Record<string, unknown>;
  renderRow?: (args: TimelineRowRenderArgs<T>) => ReactNode;
  className?: string;
  style?: CSSProperties;
  scrollParentRef?: RefObject<HTMLElement | null>;
  experimental?: Record<string, unknown>;
};
