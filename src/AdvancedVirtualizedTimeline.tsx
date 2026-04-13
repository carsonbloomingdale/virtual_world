import { useCallback, useMemo, type ReactNode } from "react";
import { useChronoImageHeightStore, useChronoImageHeightVersion } from "./ImageHeightContext.js";
import {
  VirtualizedTimelineCore,
  type VirtualizedTimelineCoreProps,
} from "./internal/VirtualizedTimelineCore.js";
import type { AdvancedVirtualizedTimelineConfig } from "./public/advanced-virtualized-timeline.config.js";
import type { VirtualizedTimelineRootProps } from "./public/virtualized-timeline-root.js";

function advancedConfigToCore<T>(
  config: AdvancedVirtualizedTimelineConfig<T>,
  getRowImageHeight: (key: string) => number,
  imageLayoutVersion: number,
): VirtualizedTimelineCoreProps<T> {
  const {
    experimental: _experimental,
    items,
    getItemKey,
    estimateRowHeight,
    renderItem,
    getPreText,
    preText,
    overscanPx,
    intersectionRoot,
    intersectionRootMargin,
    intersectionThreshold,
    onItemIntersect,
    getRowProps,
    renderRow,
    className,
    style,
    scrollParentRef,
  } = config;

  return {
    items,
    getItemKey,
    estimateRowHeight,
    overscanPx: overscanPx ?? 0,
    intersectionRootMargin: intersectionRootMargin ?? "0px",
    intersectionThreshold: intersectionThreshold ?? 0,
    intersectionRoot,
    onItemIntersect,
    getPreText,
    preTextCfg: preText,
    getRowProps,
    renderRow,
    className,
    style,
    scrollParentRef,
    renderItem,
    getRowImageHeight,
    imageLayoutVersion,
  };
}

export function AdvancedVirtualizedTimeline<T>(
  props: VirtualizedTimelineRootProps<AdvancedVirtualizedTimelineConfig<T>>,
): ReactNode {
  const store = useChronoImageHeightStore();
  const imageLayoutVersion = useChronoImageHeightVersion();
  const getRowImageHeight = useCallback(
    (key: string) => store?.getRowImageHeight(key) ?? 0,
    [store],
  );
  const core = useMemo(
    () => advancedConfigToCore(props.config, getRowImageHeight, imageLayoutVersion),
    [props.config, getRowImageHeight, imageLayoutVersion],
  );
  return <VirtualizedTimelineCore<T> {...core} />;
}
