"use client";

// src/components/Studio/EmiCalculator/useEditableRows.ts
//
// Row-level edit state for the EMI calculator panels: edit in place, then Save
// or Discard that one row. Each panel owns its own list; nothing is written
// until a row is explicitly saved, so a half-typed rate never reaches the
// public calculator.
//
// New rows get a negative temporary id until the API returns a real one.

import { useCallback, useRef, useState } from "react";

export interface RowApi<TRow, TInput> {
  create: (body: TInput) => Promise<TRow>;
  update: (id: number, body: TInput) => Promise<TRow>;
  remove: (id: number) => Promise<void>;
}

export function isNewRow(id: number): boolean {
  return id < 0;
}

export function useEditableRows<TRow extends { id: number }, TInput extends object>(
  initial: TRow[],
  api: RowApi<TRow, TInput>,
  toInput: (row: TRow) => TInput,
  notify: { success: (msg: string) => void; error: (msg: string) => void }
) {
  const [rows, setRows] = useState<TRow[]>(initial);
  // Server-side truth per id, for dirty-checking and Discard.
  const [saved, setSaved] = useState<Map<number, TRow>>(
    () => new Map(initial.map((r) => [r.id, r]))
  );
  const [busyId, setBusyId] = useState<number | null>(null);
  const tempId = useRef(-1);

  const isDirty = useCallback(
    (row: TRow) => {
      if (isNewRow(row.id)) return true; // unsaved rows are always dirty
      const base = saved.get(row.id);
      return !base || JSON.stringify(base) !== JSON.stringify(row);
    },
    [saved]
  );

  const patch = useCallback((id: number, changes: Partial<TRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...changes } : r)));
  }, []);

  const add = useCallback((blank: Omit<TRow, "id">) => {
    const id = tempId.current--;
    setRows((prev) => [...prev, { ...blank, id } as TRow]);
  }, []);

  const discard = useCallback(
    (id: number) => {
      if (isNewRow(id)) {
        setRows((prev) => prev.filter((r) => r.id !== id));
        return;
      }
      const base = saved.get(id);
      if (base) setRows((prev) => prev.map((r) => (r.id === id ? base : r)));
    },
    [saved]
  );

  const save = useCallback(
    async (id: number) => {
      const row = rows.find((r) => r.id === id);
      if (!row) return;
      setBusyId(id);
      try {
        const body = toInput(row);
        const result = isNewRow(id) ? await api.create(body) : await api.update(id, body);
        // Swap the temp id for the real record the API returned.
        setRows((prev) => prev.map((r) => (r.id === id ? result : r)));
        setSaved((prev) => {
          const next = new Map(prev);
          next.delete(id);
          next.set(result.id, result);
          return next;
        });
        notify.success("Saved");
      } catch (err) {
        notify.error(err instanceof Error ? err.message : "Could not save");
      } finally {
        setBusyId(null);
      }
    },
    [rows, api, toInput, notify]
  );

  const remove = useCallback(
    async (id: number) => {
      if (isNewRow(id)) {
        setRows((prev) => prev.filter((r) => r.id !== id));
        return;
      }
      setBusyId(id);
      try {
        await api.remove(id);
        setRows((prev) => prev.filter((r) => r.id !== id));
        setSaved((prev) => {
          const next = new Map(prev);
          next.delete(id);
          return next;
        });
        notify.success("Deleted");
      } catch (err) {
        notify.error(err instanceof Error ? err.message : "Could not delete");
      } finally {
        setBusyId(null);
      }
    },
    [api, notify]
  );

  return { rows, isDirty, patch, add, discard, save, remove, busyId };
}
