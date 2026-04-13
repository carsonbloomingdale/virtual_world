import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { ChronoItemKey, ImageHeightStore } from "./types.js";

type RowSlots = Map<string, number>;

type InternalStore = ImageHeightStore & {
  subscribe: (cb: () => void) => () => void;
  getVersion: () => number;
};

function createStore(): InternalStore {
  const rows = new Map<ChronoItemKey, RowSlots>();
  const listeners = new Set<() => void>();
  let version = 0;

  const bump = () => {
    version += 1;
    for (const l of listeners) l();
  };

  return {
    getVersion: () => version,
    getRowImageHeight(rowKey) {
      const slots = rows.get(rowKey);
      if (!slots) return 0;
      let sum = 0;
      for (const h of slots.values()) sum += h;
      return sum;
    },
    setSlotHeight(rowKey, slotId, heightPx) {
      let slots = rows.get(rowKey);
      if (!slots) {
        slots = new Map();
        rows.set(rowKey, slots);
      }
      const prev = slots.get(slotId);
      if (prev === heightPx) return;
      slots.set(slotId, heightPx);
      bump();
    },
    clearRow(rowKey) {
      if (rows.delete(rowKey)) bump();
    },
    subscribe(cb) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
  };
}

const Ctx = createContext<InternalStore | null>(null);

export function ChronoImageHeightProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<InternalStore | null>(null);
  if (!storeRef.current) storeRef.current = createStore();

  const value = storeRef.current;

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useChronoImageHeightStore(): ImageHeightStore | null {
  const s = useContext(Ctx);
  return s as ImageHeightStore | null;
}

/** Subscribe to slot height mutations (for recomputing row metrics). */
export function useChronoImageHeightVersion(): number {
  const s = useContext(Ctx);
  return useSyncExternalStore(
    s ? s.subscribe : () => () => {},
    s ? s.getVersion : () => 0,
    s ? s.getVersion : () => 0,
  );
}

/** Report intrinsic (or laid-out) image height for a slot inside a row. */
export function useChronoImageSlot(rowKey: ChronoItemKey, slotId: string) {
  const store = useContext(Ctx);

  const onImgLoad = useCallback(
    (e: { currentTarget: HTMLImageElement }) => {
      if (!store) return;
      const el = e.currentTarget;
      const h = el.getBoundingClientRect().height;
      if (h > 0) store.setSlotHeight(rowKey, slotId, h);
    },
    [rowKey, slotId, store],
  );

  const clear = useCallback(() => {
    store?.clearRow(rowKey);
  }, [rowKey, store]);

  return { onImgLoad, clear, hasStore: Boolean(store) };
}
