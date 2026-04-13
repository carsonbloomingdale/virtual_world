import { useMemo, type ReactNode } from "react";
import {
  VirtualizedTimelineCore,
  type VirtualizedTimelineCoreProps,
} from "./internal/VirtualizedTimelineCore.js";
import type { SimpleVirtualizedTimelineConfig } from "./public/simple-virtualized-timeline.config.js";
import type { VirtualizedTimelineRootProps } from "./public/virtualized-timeline-root.js";

function simpleConfigToCore<T>(
  config: SimpleVirtualizedTimelineConfig<T>,
): VirtualizedTimelineCoreProps<T> {
  const { experimental: _experimental, items, estimateRowHeight, renderItem } = config;
  return {
    items,
    getItemKey: (_item: T, index: number) => String(index),
    estimateRowHeight,
    overscanPx: 0,
    intersectionRootMargin: "0px",
    intersectionThreshold: 0,
    renderItem,
    getRowImageHeight: undefined,
    imageLayoutVersion: 0,
  };
}

export function SimpleVirtualizedTimeline<T>(
  props: VirtualizedTimelineRootProps<SimpleVirtualizedTimelineConfig<T>>,
): ReactNode {
  const core = useMemo(() => simpleConfigToCore(props.config), [props.config]);
  return <VirtualizedTimelineCore<T> {...core} />;
}
