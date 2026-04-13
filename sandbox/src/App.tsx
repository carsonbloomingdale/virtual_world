import { useMemo, useState } from "react";
import { SimpleVirtualizedTimeline } from "chrono-virtual";

type Row = { id: string; title: string; body: string };

function makeItems(count: number): Row[] {
  const out: Row[] = new Array(count);
  for (let i = 0; i < count; i++) {
    out[i] = {
      id: String(i),
      title: `Row ${i}`,
      body:
        i % 17 === 0
          ? "Taller content: virtualization keeps DOM small while preserving scroll position and variable row heights via ResizeObserver."
          : "Scroll this list: only visible rows (plus internal windowing) are mounted.",
    };
  }
  return out;
}

export function App() {
  const [count, setCount] = useState(12_000);
  const items = useMemo(() => makeItems(count), [count]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>chrono-virtual sandbox</h1>
        <p>
          Live demo of <code>SimpleVirtualizedTimeline</code> from the package source (Vite alias).
        </p>
      </header>

      <div className="controls">
        <label>
          Rows
          <input
            type="range"
            min={500}
            max={50_000}
            step={500}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
          <span className="value">{count.toLocaleString()}</span>
        </label>
      </div>

      <section className="timeline-shell" aria-label="Virtualized timeline demo">
        <div className="bar">Virtualized list (resize the window to change viewport)</div>
        <div className="timeline-scroll">
          <SimpleVirtualizedTimeline
            config={{
              items,
              estimateRowHeight: 64,
              renderItem: (meta, ctx) => (
                <div className={`row${ctx.intersecting ? " intersecting" : ""}`}>
                  <div className="row-index">
                    #{meta.index.toLocaleString()} — {meta.item.title}
                  </div>
                  <div className="row-body">{meta.item.body}</div>
                </div>
              ),
            }}
          />
        </div>
      </section>
    </div>
  );
}
