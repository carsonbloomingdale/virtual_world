import type { CSSProperties, HTMLAttributes, ReactNode, RefObject } from "react";

export type ChronoItemKey = string;

/** Per-row context passed to `renderItem` / intersection callbacks. */
export type ChronoRowMeta<T> = {
  item: T;
  index: number;
  key: ChronoItemKey;
};

/** Advanced: customize the outer row wrapper. */
export type ChronoRowRenderArgs<T> = ChronoRowMeta<T> & {
  style: CSSProperties;
  ref: (el: HTMLDivElement | null) => void;
  children: ReactNode;
};

export type ChronoRenderContext = {
  /** Report measured total row height (including PreText + media). */
  setMeasuredRowHeight: (px: number) => void;
  /** Whether this row is intersecting per `IntersectionObserver`. */
  intersecting: boolean;
};

export type ChronoVirtualSimpleProps<T> = {
  mode?: "simple";
  items: readonly T[];
  /** Fallback height (px) before measure / when no PreText. */
  estimateRowHeight: number;
  /** `ctx` is always provided; simple integrations can ignore it. */
  renderItem: (meta: ChronoRowMeta<T>, ctx: ChronoRenderContext) => ReactNode;
};

export type ChronoVirtualAdvancedProps<T> = {
  mode: "advanced";
  items: readonly T[];
  getItemKey: (item: T, index: number) => ChronoItemKey;
  estimateRowHeight: number;
  renderItem: (meta: ChronoRowMeta<T>, ctx: ChronoRenderContext) => ReactNode;
  /** PreText block: predictable min-height from line metrics. */
  getPreText?: (meta: ChronoRowMeta<T>) => ReactNode;
  preText?: {
    lines: number;
    lineHeightPx: number;
    className?: string;
    style?: CSSProperties;
  };
  /** Extra pixels to render above/below the viewport (beyond IO margin). */
  overscanPx?: number;
  /** Passed to `IntersectionObserver` (defaults to scroll container). */
  intersectionRoot?: RefObject<Element | null>;
  intersectionRootMargin?: string;
  intersectionThreshold?: number | number[];
  onItemIntersect?: (
    meta: ChronoRowMeta<T>,
    entry: IntersectionObserverEntry,
  ) => void;
  /** Props merged onto each row `div`. */
  getRowProps?: (
    meta: ChronoRowMeta<T>,
  ) => HTMLAttributes<HTMLDivElement> & Record<string, unknown>;
  /** Full control of row wrapper (must apply `style` + `ref` for correctness). */
  renderRow?: (args: ChronoRowRenderArgs<T>) => ReactNode;
  className?: string;
  style?: CSSProperties;
  /** External scroll parent; when omitted, component owns `overflow: auto`. */
  scrollParentRef?: RefObject<HTMLElement | null>;
};

export type ChronoVirtualProps<T> =
  | ChronoVirtualSimpleProps<T>
  | ChronoVirtualAdvancedProps<T>;

export type ImageSlotMeasure = {
  /** Unique within the list row (e.g. image URL or id). */
  slotId: string;
  heightPx: number;
};

export type ImageHeightStore = {
  /** Sum of registered slot heights for a row key (best-effort cache). */
  getRowImageHeight: (rowKey: ChronoItemKey) => number;
  setSlotHeight: (rowKey: ChronoItemKey, slotId: string, heightPx: number) => void;
  clearRow: (rowKey: ChronoItemKey) => void;
};
