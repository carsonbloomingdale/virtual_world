/** offset[i] = y-position of row i's top; length = n + 1. */
export function buildOffsets(heights: readonly number[]): readonly number[] {
  const out: number[] = new Array(heights.length + 1);
  out[0] = 0;
  for (let i = 0; i < heights.length; i++) out[i + 1] = out[i] + heights[i]!;
  return out;
}

export function findStartIndex(offset: readonly number[], scrollTop: number, overscan: number): number {
  const top = scrollTop - overscan;
  const n = offset.length - 1;
  if (n <= 0) return 0;
  let lo = 0;
  let hi = n - 1;
  let start = n - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const rowEnd = offset[mid + 1]!;
    if (rowEnd <= top) lo = mid + 1;
    else {
      start = mid;
      hi = mid - 1;
    }
  }
  return Math.max(0, Math.min(start, n - 1));
}

export function findEndIndex(
  offset: readonly number[],
  scrollTop: number,
  viewport: number,
  overscan: number,
): number {
  const bottom = scrollTop + viewport + overscan;
  const n = offset.length - 1;
  if (n <= 0) return 0;
  let lo = 0;
  let hi = n - 1;
  let end = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const rowStart = offset[mid]!;
    if (rowStart < bottom) {
      end = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return Math.max(0, Math.min(end, n - 1));
}
