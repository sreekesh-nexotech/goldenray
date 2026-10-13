"use client";

// src/components/Studio/shared/useEditableRows.ts
//
// Row-level edit state for the Studio's admin grids: edit in place, then Save
// or Discard that one row. Each panel owns its own list; nothing is written
// until a row is explicitly saved, so a half-typed rate never reaches the
// public calculator -- the reason this is explicit Save rather than the
// per-field `onBlur` PUT the source BOM tool uses.
//
// `toInput` is supplied by the caller, which is where a versioned endpoint
// threads its `expected_version` through: the platform's CRUD rows carry a
// `version`, and a PATCH that omits it silently overwrites a concurrent edit.
//
// New rows get a temporary client-side uid (prefixed "new:") until the API
// returns the real record; platform ids are uuid strings, never numbers.

import { useCallback, useRef, useState } from "react";

export interface RowApi<TRow, TInput> {
  create: (body: TInput) => Promise<TRow>;
  update: (uid: string, body: TInput) => Promise<TRow>;
  remove: (uid: string) => Promise<void>;
}

const NEW_ROW_PREFIX = "new:";

export function isNewRow(uid: string): boolean {
  return uid.startsWith(NEW_ROW_PREFIX);
}

export function useEditableRows<TRow extends { uid: string }, TInput extends object>(
  initial: TRow[],
  api: RowApi<TRow, TInput>,
  toInput: (row: TRow) => TInput,
  notify: { success: (msg: string) => void; error: (msg: string) => void }
) {
  const [rows, setRows] = useState<TRow[]>(initial);
  // Server-side truth per uid, for dirty-checking and Discard.
  const [saved, setSaved] = useState<Map<string, TRow>>(
    () => new Map(initial.map((r) => [r.uid, r]))
  );
  const [busyId, setBusyId] = useState<string | null>(null);
  const tempId = useRef(0);

  const isDirty = useCallback(
    (row: TRow) => {
      if (isNewRow(row.uid)) return true; // unsaved rows are always dirty
      const base = saved.get(row.uid);
      return !base || JSON.stringify(base) !== JSON.stringify(row);
    },
    [saved]
  );

  const patch = useCallback((uid: string, changes: Partial<TRow>) => {
    setRows((prev) => prev.map((r) => (r.uid === uid ? { ...r, ...changes } : r)));
  }, []);

  const add = useCallback((blank: Omit<TRow, "uid">) => {
    const uid = `${NEW_ROW_PREFIX}${tempId.current++}`;
    setRows((prev) => [...prev, { ...blank, uid } as TRow]);
  }, []);

  const discard = useCallback(
    (uid: string) => {
      if (isNewRow(uid)) {
        setRows((prev) => prev.filter((r) => r.uid !== uid));
        return;
      }
      const base = saved.get(uid);
      if (base) setRows((prev) => prev.map((r) => (r.uid === uid ? base : r)));
    },
    [saved]
  );

  const save = useCallback(
    async (uid: string) => {
      const row = rows.find((r) => r.uid === uid);
      if (!row) return;
      setBusyId(uid);
      try {
        const body = toInput(row);
        const result = isNewRow(uid) ? await api.create(body) : await api.update(uid, body);
        // Swap the temp uid for the real record the API returned.
        setRows((prev) => prev.map((r) => (r.uid === uid ? result : r)));
        setSaved((prev) => {
          const next = new Map(prev);
          next.delete(uid);
          next.set(result.uid, result);
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
    async (uid: string) => {
      if (isNewRow(uid)) {
        setRows((prev) => prev.filter((r) => r.uid !== uid));
        return;
      }
      setBusyId(uid);
      try {
        await api.remove(uid);
        setRows((prev) => prev.filter((r) => r.uid !== uid));
        setSaved((prev) => {
          const next = new Map(prev);
          next.delete(uid);
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
