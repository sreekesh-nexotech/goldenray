"use client";

// src/components/Studio/shared/StudioContext.tsx
//
// Lightweight client state for the Content Studio presentation layer:
//  - `role`    — the "Preview as" role that drives capability gating visuals
//  - `tips`    — whether the amber explainer tips are shown
//  - `toast()` — transient bottom-right notifications
//
// This is UI-only state (no persistence, no server). When the admin API is
// integrated, `role`/`tips` can be sourced from the session instead.

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { Role } from "@/types/studio";

interface Toast {
  id: number;
  msg: string;
}

interface StudioContextValue {
  role: Role;
  setRole: (r: Role) => void;
  tips: boolean;
  setTips: (v: boolean) => void;
  toasts: Toast[];
  toast: (msg: string) => void;
}

const StudioCtx = createContext<StudioContextValue | null>(null);

let toastSeq = 0;

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("Admin");
  const [tips, setTips] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((msg: string) => {
    const id = ++toastSeq;
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  const value = useMemo(
    () => ({ role, setRole, tips, setTips, toasts, toast }),
    [role, tips, toasts, toast]
  );

  return <StudioCtx.Provider value={value}>{children}</StudioCtx.Provider>;
}

export function useStudio(): StudioContextValue {
  const ctx = useContext(StudioCtx);
  if (!ctx) throw new Error("useStudio must be used within a StudioProvider");
  return ctx;
}

/** Capability checks derived from the previewed role. */
export function useCapabilities() {
  const { role } = useStudio();
  return {
    role,
    canManageStructure: role === "Admin",
    canPublish: role === "Admin" || role === "Editor",
    canDelete: role === "Admin" || role === "Editor",
    isAdmin: role === "Admin",
  };
}
