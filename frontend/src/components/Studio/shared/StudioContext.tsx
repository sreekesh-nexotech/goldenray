"use client";

// src/components/Studio/shared/StudioContext.tsx
//
// Client state for the Content Studio:
//  - session data loaded once from the admin API (`me`, `config`, `dashboard`)
//  - `tips`    — whether the amber explainer tips are shown
//  - `toast()` — transient bottom-right notifications
//
// If the API session turns out to be invalid (refresh failed), the tokens are
// cleared and the user is sent back to the sign-in screen.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  endStudioSession,
  getConfig,
  getDashboard,
  getMe,
  isSessionExpired,
  type StudioAction,
  type StudioConfig,
  type StudioDashboard,
  type StudioMe,
  type StudioModule,
  type StudioScope,
} from "@/services/studioService";

export type ToastKind = "success" | "error";

interface Toast {
  id: number;
  msg: string;
  kind: ToastKind;
}

interface StudioContextValue {
  tips: boolean;
  setTips: (v: boolean) => void;
  toasts: Toast[];
  /** Bottom-right notification; pass "error" for failures (red, ⚠ icon). */
  toast: (msg: string, kind?: ToastKind) => void;
  /** Signed-in user (null while loading). */
  me: StudioMe | null;
  /** Shell metadata from GET config/ (null while loading). */
  config: StudioConfig | null;
  /** Counts + recent entries from GET dashboard/ (null while loading). */
  dashboard: StudioDashboard | null;
  /** True until the initial me/config/dashboard load settles. */
  shellLoading: boolean;
  /** Non-auth load failure message, if any. */
  shellError: string | null;
  /**
   * Phase 1 permission check (§6.17): does the signed-in user hold `action` on
   * `module`? Resolved from `me.permissions`, which the API has already reduced
   * through superuser override and legacy fallback — so this is a lookup, not
   * a re-encoding of role rules. False while `me` is still loading, which
   * keeps action buttons hidden rather than briefly visible.
   */
  can: (module: StudioModule, action?: StudioAction) => boolean;
  /**
   * The record scope the signed-in user holds on `module`, from `me.scopes`.
   *
   * The backend applies this inside `get_queryset()`, so a `leads: owned` user
   * sees only their own rows and an otherwise-populated list can come back
   * empty. Screens use this to say *why* a list is empty, never to filter —
   * the filtering already happened server-side. Defaults to `"all"` (the widest
   * reading) while `me` is loading or when the module carries no scope.
   */
  scope: (module: StudioModule) => StudioScope;
}

const StudioCtx = createContext<StudioContextValue | null>(null);

let toastSeq = 0;

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [tips, setTips] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [me, setMe] = useState<StudioMe | null>(null);
  const [config, setConfig] = useState<StudioConfig | null>(null);
  const [dashboard, setDashboard] = useState<StudioDashboard | null>(null);
  const [shellLoading, setShellLoading] = useState(true);
  const [shellError, setShellError] = useState<string | null>(null);

  // Load the session + shell data once per studio visit.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [meData, configData, dashData] = await Promise.all([
          getMe(),
          getConfig(),
          getDashboard(),
        ]);
        if (cancelled) return;
        setMe(meData);
        setConfig(configData);
        setDashboard(dashData);
      } catch (err) {
        if (cancelled) return;
        if (isSessionExpired(err)) {
          // Session expired / revoked — drop it and go sign in again. A 403 or
          // a server hiccup falls through to the error banner instead.
          endStudioSession();
          return;
        }
        setShellError(err instanceof Error ? err.message : "Failed to load the studio");
      } finally {
        if (!cancelled) setShellLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Send the user to sign in once the session is really over, even if they're
  // idle on a screen that won't make another call.
  //
  // The token now lives in an HttpOnly cookie, so its expiry can't be read
  // here any more (and shouldn't be — the server is the authority). Instead,
  // when the tab comes back to the foreground we ask the API who we are: a 401
  // means the session is gone, which also covers signing out in another tab and
  // a laptop that slept past the deadline. `getMe` routes through the BFF, so a
  // merely-expired access token is refreshed transparently and this stays quiet.
  useEffect(() => {
    let cancelled = false;
    const check = () => {
      if (cancelled || document.visibilityState !== "visible") return;
      getMe().catch((err) => {
        if (!cancelled && isSessionExpired(err)) endStudioSession();
      });
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", check);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", check);
    };
  }, []);

  const toast = useCallback((msg: string, kind: ToastKind = "success") => {
    const id = ++toastSeq;
    setToasts((t) => [...t, { id, msg, kind }]);
    // Errors linger a little longer so they can actually be read.
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === "error" ? 4600 : 2800);
  }, []);

  const can = useCallback(
    (module: StudioModule, action: StudioAction = "view") =>
      Boolean(me?.permissions?.[module]?.includes(action)),
    [me]
  );

  const scope = useCallback(
    (module: StudioModule): StudioScope => me?.scopes?.[module] ?? "all",
    [me]
  );

  const value = useMemo(
    () => ({ tips, setTips, toasts, toast, me, config, dashboard, shellLoading, shellError, can, scope }),
    [tips, toasts, toast, me, config, dashboard, shellLoading, shellError, can, scope]
  );

  return <StudioCtx.Provider value={value}>{children}</StudioCtx.Provider>;
}

export function useStudio(): StudioContextValue {
  const ctx = useContext(StudioCtx);
  if (!ctx) throw new Error("useStudio must be used within a StudioProvider");
  return ctx;
}

