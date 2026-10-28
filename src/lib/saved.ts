'use client';
import { useCallback, useSyncExternalStore } from 'react';

// Favoritos y comparador: viven en localStorage (sin cuenta, sin servidor).
export type ListKey = 'favoritos' | 'comparar';
export const COMPARE_MAX = 3;

const KEY = (k: ListKey) => `vahome:${k}`;
const EMPTY: string[] = [];
const cache: Partial<Record<ListKey, { raw: string | null; value: string[] }>> = {};
const listeners = new Set<() => void>();

function read(k: ListKey): string[] {
  if (typeof window === 'undefined') return EMPTY;
  let raw: string | null = null;
  try { raw = window.localStorage.getItem(KEY(k)); } catch { return EMPTY; }
  const hit = cache[k];
  if (hit && hit.raw === raw) return hit.value;
  let value = EMPTY;
  try { const v = raw ? JSON.parse(raw) : []; if (Array.isArray(v)) value = v.filter((x) => typeof x === 'string'); } catch { /* lista corrupta: se ignora */ }
  cache[k] = { raw, value };
  return value;
}

function write(k: ListKey, value: string[]) {
  try { window.localStorage.setItem(KEY(k), JSON.stringify(value)); } catch { return; }
  listeners.forEach((l) => l());
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  window.addEventListener('storage', cb);
  return () => { listeners.delete(cb); window.removeEventListener('storage', cb); };
};

export function useSaved(k: ListKey) {
  const list = useSyncExternalStore(subscribe, () => read(k), () => EMPTY);
  const has = useCallback((slug: string) => list.includes(slug), [list]);
  const toggle = useCallback((slug: string) => {
    const cur = read(k);
    if (cur.includes(slug)) return write(k, cur.filter((s) => s !== slug));
    if (k === 'comparar' && cur.length >= COMPARE_MAX) return;
    write(k, [...cur, slug]);
  }, [k]);
  const clear = useCallback(() => write(k, []), [k]);
  return { list, has, toggle, clear };
}
