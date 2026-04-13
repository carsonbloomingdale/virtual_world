# Roadmap issues (virtualization library)

These items track known gaps and next steps for `chrono-virtual`. Convert any line into a GitHub issue as needed.

## #1 — Scroll anchoring when row heights change above the viewport

**Problem:** When a row above the visible window gains height (image load, font swap), `scrollTop` is absolute and the content can jump under the user’s cursor.

**Acceptance criteria:** Optional “maintain visible anchor” strategy (e.g., adjust `scrollTop` by delta of cumulative height above anchor index).

---

## #2 — Sub-linear height index for very large static lists

**Problem:** Recomputing `heights[]` for all indices is \(O(n)\) whenever caches change.

**Acceptance criteria:** Lazy segment tree / packed prefix cache, or recompute only dirty suffix; document tradeoffs.

---

## #3 — First-class Next.js App Router example

**Problem:** Consumers still need to remember client boundaries and scroll container patterns.

**Acceptance criteria:** Minimal `app/timeline/page.tsx` example using `"use client"`, imports from `chrono-virtual/simple` vs `chrono-virtual/advanced`, `scrollParentRef`, and image slots.

---

## #4 — Image slot model: overlaps, side-by-side layouts, and aspect-ratio mode

**Problem:** Current image height aggregation assumes stacked media under text.

**Acceptance criteria:** Layout modes (`stack`, `grid`, `inline`), optional `aspectRatio` preset before decode, and deduplication rules when slots overlap visually.

---

## #5 — IntersectionObserver root lifecycle when `scrollParentRef` mounts late

**Problem:** If `scrollParentRef.current` starts as `null`, the first IO instance may fall back to an unintended root until a remount occurs.

**Acceptance criteria:** Recreate observers when the resolved root element changes; unit test with deferred ref assignment.

---

## #6 — Optional windowing without absolute positioning (flow mode)

**Problem:** Some designs need in-flow measurement (SEO, print, native focus outlines spanning rows).

**Acceptance criteria:** Experimental `layout="flow"` that only toggles `content-visibility` / `hidden` while preserving DOM order; clearly documented limitations.

---

## #7 — Accessibility: keyboard navigation across unmounted rows

**Problem:** Offscreen rows are not in the DOM; screen reader and keyboard flows may skip content unless mirrored.

**Acceptance criteria:** Documented patterns (roving tabindex, `aria-rowcount`, optional “buffer strip” mode) and helpers.

---

## #8 — Public test matrix (Vitest + jsdom)

**Problem:** Geometry helpers and index windowing are easy to regress.

**Acceptance criteria:** Vitest coverage for `buildOffsets`, `findStartIndex`, `findEndIndex`, and a mocked `IntersectionObserver` smoke test.

---

## #9 — `renderRow` ergonomics: merge `ref` with consumer refs

**Problem:** Advanced users often need `composeRefs` for animations or measurements.

**Acceptance criteria:** Export `composeRefs` helper or accept `ref` as `Ref` union in `renderRow` args.

---

## #10 — Sticky headers / grouped chronology

**Problem:** Chronological feeds often cluster by day; sticky section headers interact poorly naive absolute virtualization.

**Acceptance criteria:** Optional section index map + sticky offset compensation in `offsets`.

---

## #11 — First-class row model: Pretext body + measured chrome

**Problem:** `chrono-virtual/pretext` exposes helpers, but the timeline config does not yet accept a “row height recipe” (e.g. Pretext body + image slot sums + padding constants) as a single typed pipeline.

**Acceptance criteria:** Optional `getRowHeight` / `RowVerticalBudget` integration on `AdvancedVirtualizedTimelineConfig`, docs for when DOM width observation is acceptable vs fixed column width, and golden tests against `@chenglou/pretext` `layout()` for a few fonts/widths.
