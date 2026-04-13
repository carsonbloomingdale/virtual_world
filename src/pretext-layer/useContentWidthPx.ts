import { useLayoutEffect, useState, type RefObject } from "react";

/**
 * **Boundary** measurement: one `ResizeObserver` on a container (e.g. row content column).
 * Feed the width into Pretext’s `layout()` so text height stays DOM-free; images/padding still
 * use your own fixed values or targeted DOM/image hooks elsewhere.
 */
export function useContentWidthPx(containerRef: RefObject<HTMLElement | null>): number | undefined {
  const [widthPx, setWidthPx] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const w = el.getBoundingClientRect().width;
      setWidthPx(Number.isFinite(w) && w > 0 ? w : undefined);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  return widthPx;
}
