import type { CSSProperties, ReactNode } from "react";

export type TimelineItemKey = string;

export type TimelineRowMeta<T> = {
  item: T;
  index: number;
  key: TimelineItemKey;
};

export type TimelineRowRenderArgs<T> = TimelineRowMeta<T> & {
  style: CSSProperties;
  ref: (el: HTMLDivElement | null) => void;
  children: ReactNode;
};

export type TimelineRenderContext = {
  setMeasuredRowHeight: (px: number) => void;
  intersecting: boolean;
};

export type ImageSlotMeasure = {
  slotId: string;
  heightPx: number;
};

export type ImageHeightStore = {
  getRowImageHeight: (rowKey: TimelineItemKey) => number;
  setSlotHeight: (rowKey: TimelineItemKey, slotId: string, heightPx: number) => void;
  clearRow: (rowKey: TimelineItemKey) => void;
};
