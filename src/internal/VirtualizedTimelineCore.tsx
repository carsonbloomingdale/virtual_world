import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
} from "react";
import { buildOffsets, findEndIndex, findStartIndex } from "../geometry.js";
import { PreText } from "../PreText.js";
import type {
  TimelineRenderContext,
  TimelineRowMeta,
  TimelineRowRenderArgs,
} from "../timeline-types.js";

function useLatest<T>(value: T | undefined) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

export type VirtualizedTimelineCoreProps<T> = {
  items: readonly T[];
  getItemKey: (item: T, index: number) => string;
  estimateRowHeight: number;
  overscanPx: number;
  intersectionRootMargin: string;
  intersectionThreshold: number | number[];
  intersectionRoot?: RefObject<Element | null>;
  onItemIntersect?: (meta: TimelineRowMeta<T>, entry: IntersectionObserverEntry) => void;
  getPreText?: (meta: TimelineRowMeta<T>) => ReactNode;
  preTextCfg?: { lines: number; lineHeightPx: number; className?: string; style?: CSSProperties };
  getRowProps?: (meta: TimelineRowMeta<T>) => HTMLAttributes<HTMLDivElement> & Record<string, unknown>;
  renderRow?: (args: TimelineRowRenderArgs<T>) => ReactNode;
  className?: string;
  style?: CSSProperties;
  scrollParentRef?: RefObject<HTMLElement | null>;
  renderItem: (meta: TimelineRowMeta<T>, ctx: TimelineRenderContext) => ReactNode;
  getRowImageHeight?: (key: string) => number;
  imageLayoutVersion: number;
};

export function VirtualizedTimelineCore<T>(props: VirtualizedTimelineCoreProps<T>): ReactNode {
  const {
    items,
    getItemKey,
    estimateRowHeight,
    overscanPx,
    intersectionRootMargin,
    intersectionThreshold,
    intersectionRoot,
    onItemIntersect,
    getPreText,
    preTextCfg,
    getRowProps,
    renderRow,
    className: outerClassName,
    style: outerStyle,
    scrollParentRef,
    renderItem,
    getRowImageHeight,
    imageLayoutVersion,
  } = props;

  const internalScrollRef = useRef<HTMLDivElement | null>(null);
  const scrollRootRef = scrollParentRef ?? internalScrollRef;
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportH, setViewportH] = useState(0);

  const measuredRef = useRef<Map<string, number>>(new Map());
  const [, bumpMeasure] = useState(0);

  const keys = useMemo(
    () => items.map((item, index) => getItemKey(item, index)),
    [items, getItemKey],
  );

  const preMin = preTextCfg ? preTextCfg.lines * preTextCfg.lineHeightPx : 0;

  const reportRowHeight = useCallback(
    (key: string, px: number) => {
      const prev = measuredRef.current.get(key);
      if (prev === px) return;
      measuredRef.current.set(key, px);
      bumpMeasure((x) => x + 1);
    },
    [],
  );

  const heights = useMemo(() => {
    void imageLayoutVersion;
    const out: number[] = new Array(items.length);
    for (let i = 0; i < items.length; i++) {
      const key = keys[i]!;
      const measured = measuredRef.current.get(key);
      const img = getRowImageHeight?.(key) ?? 0;
      const floor =
        getPreText && preTextCfg ? Math.max(estimateRowHeight, preMin) : estimateRowHeight;
      const base = measured ?? floor;
      out[i] = measured != null ? measured : Math.max(base, floor + img);
    }
    return out;
  }, [
    items,
    keys,
    estimateRowHeight,
    getPreText,
    preMin,
    preTextCfg,
    getRowImageHeight,
    imageLayoutVersion,
  ]);

  const offsets = useMemo(() => buildOffsets(heights), [heights]);
  const totalHeight = offsets[offsets.length - 1] ?? 0;

  const start = useMemo(
    () => findStartIndex(offsets, scrollTop, overscanPx),
    [offsets, scrollTop, overscanPx],
  );
  const end = useMemo(
    () => findEndIndex(offsets, scrollTop, viewportH, overscanPx),
    [offsets, scrollTop, viewportH, overscanPx],
  );

  const onScroll = useCallback(() => {
    const el = scrollParentRef?.current ?? internalScrollRef.current;
    if (!el) return;
    setScrollTop(el.scrollTop);
  }, [scrollParentRef]);

  useLayoutEffect(() => {
    const el = scrollParentRef?.current ?? internalScrollRef.current;
    if (!el) return;
    setScrollTop(el.scrollTop);
    setViewportH(el.clientHeight);
  }, [scrollParentRef, items.length]);

  useEffect(() => {
    const el = scrollParentRef?.current ?? internalScrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setViewportH(el.clientHeight);
      setScrollTop(el.scrollTop);
    });
    ro.observe(el);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", onScroll);
    };
  }, [onScroll, scrollParentRef]);

  const onIntersectRef = useLatest(onItemIntersect);

  const scrollShellStyle: CSSProperties | undefined = scrollParentRef
    ? undefined
    : { overflow: "auto", position: "relative", maxHeight: "100%" };

  return (
    <div className={outerClassName} style={outerStyle}>
      <div ref={scrollParentRef ? undefined : internalScrollRef} style={scrollShellStyle}>
        <div style={{ height: totalHeight, position: "relative" }}>
          {items.slice(start, end + 1).map((item, sliceIndex) => {
            const index = start + sliceIndex;
            const key = keys[index]!;
            const meta: TimelineRowMeta<T> = { item, index, key };
            const rowTop = offsets[index] ?? 0;

            return (
              <VirtualRow<T>
                key={key}
                meta={meta}
                top={rowTop}
                scrollRootRef={scrollRootRef}
                getRowProps={getRowProps}
                renderRow={renderRow}
                intersectionRoot={intersectionRoot}
                intersectionRootMargin={intersectionRootMargin}
                intersectionThreshold={intersectionThreshold}
                onItemIntersect={onIntersectRef.current}
                getPreText={getPreText}
                preTextCfg={preTextCfg}
                renderItem={renderItem}
                reportRowHeight={reportRowHeight}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

type VirtualRowProps<T> = {
  meta: TimelineRowMeta<T>;
  top: number;
  scrollRootRef: RefObject<HTMLElement | null>;
  getRowProps?: (meta: TimelineRowMeta<T>) => HTMLAttributes<HTMLDivElement> & Record<string, unknown>;
  renderRow?: (args: TimelineRowRenderArgs<T>) => ReactNode;
  intersectionRoot?: RefObject<Element | null>;
  intersectionRootMargin: string;
  intersectionThreshold: number | number[];
  onItemIntersect?: (meta: TimelineRowMeta<T>, entry: IntersectionObserverEntry) => void;
  getPreText?: (meta: TimelineRowMeta<T>) => ReactNode;
  preTextCfg?: { lines: number; lineHeightPx: number; className?: string; style?: CSSProperties };
  renderItem: (meta: TimelineRowMeta<T>, ctx: TimelineRenderContext) => ReactNode;
  reportRowHeight: (key: string, px: number) => void;
};

function VirtualRow<T>(props: VirtualRowProps<T>) {
  const {
    meta,
    top,
    scrollRootRef,
    getRowProps,
    renderRow,
    intersectionRoot,
    intersectionRootMargin,
    intersectionThreshold,
    onItemIntersect,
    getPreText,
    preTextCfg,
    renderItem,
    reportRowHeight,
  } = props;

  const elRef = useRef<HTMLDivElement | null>(null);
  const [intersecting, setIntersecting] = useState(false);
  const metaRef = useRef(meta);
  metaRef.current = meta;

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const root = intersectionRoot?.current ?? scrollRootRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setIntersecting(entry.isIntersecting);
        if (onItemIntersect) onItemIntersect(metaRef.current, entry);
      },
      {
        root: root ?? null,
        rootMargin: intersectionRootMargin,
        threshold: intersectionThreshold,
      },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [
    intersectionRoot,
    intersectionRootMargin,
    intersectionThreshold,
    meta.key,
    onItemIntersect,
    scrollRootRef,
  ]);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const h = el.getBoundingClientRect().height;
      if (h > 0) reportRowHeight(meta.key, h);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [meta.key, reportRowHeight]);

  const setMeasuredRowHeight = useCallback(
    (px: number) => {
      reportRowHeight(meta.key, px);
    },
    [meta.key, reportRowHeight],
  );

  const ctx: TimelineRenderContext = useMemo(
    () => ({ setMeasuredRowHeight, intersecting }),
    [intersecting, setMeasuredRowHeight],
  );

  const rowStyle: CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    top,
    transform: "translateZ(0)",
  };

  const extraProps = getRowProps?.(meta) ?? {};
  const { style: extraStyle, ...restExtra } = extraProps;

  const mergedStyle: CSSProperties = { ...rowStyle, ...(extraStyle as CSSProperties | undefined) };

  const assignRef = useCallback(
    (node: HTMLDivElement | null) => {
      elRef.current = node;
    },
    [],
  );

  const inner = (
    <>
      {getPreText && preTextCfg ? (
        <PreText
          lines={preTextCfg.lines}
          lineHeightPx={preTextCfg.lineHeightPx}
          className={preTextCfg.className}
          style={preTextCfg.style}
        >
          {getPreText(meta)}
        </PreText>
      ) : null}
      {renderItem(meta, ctx)}
    </>
  );

  if (renderRow) {
    return renderRow({
      ...meta,
      style: mergedStyle,
      ref: assignRef,
      children: inner,
    });
  }

  return (
    <div {...restExtra} ref={assignRef} style={mergedStyle}>
      {inner}
    </div>
  );
}
