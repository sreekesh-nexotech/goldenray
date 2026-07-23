"use client";

// src/components/Studio/SignIn/SignInScreen.tsx
//
// Standalone sign-in for the Content Studio. Authenticates against the admin
// API (POST auth/login/) via studioService; on success the JWT pair is stored
// and the user lands on the dashboard (or the ?next= destination the
// middleware preserved).

import { useState } from "react";
import { useRouter } from "next/navigation";
import Wordmark from "../shell/Wordmark";
import { studioColors } from "../shared/format";
import { login, StudioApiError } from "@/services/studioService";

const fieldRing = `inset 0 0 0 1px ${studioColors.inputRing},0 1px 2px rgba(10,13,18,.05)`;
const fieldRingFocus = "inset 0 0 0 1.5px #074A4D,0 1px 2px rgba(10,13,18,.05)";

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  border: "none",
  borderRadius: 12,
  background: "#ffffff",
  boxShadow: fieldRing,
  fontFamily: "var(--font-switzer)",
  fontSize: 14,
  lineHeight: "20px",
  color: studioColors.tealDeep,
};

/** Safe post-login destination from ?next= (internal studio paths only). */
function nextDestination(): string {
  if (typeof window !== "undefined") {
    const next = new URLSearchParams(window.location.search).get("next");
    if (next && next.startsWith("/studio/") && !next.startsWith("//")) return next;
  }
  return "/studio/dashboard";
}

export default function SignInScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const user = username.trim();
    if (!user) {
      setError("Enter your username");
      return;
    }
    if (!pw) {
      setError("Enter your password");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await login(user, pw);
      router.replace(nextDestination());
    } catch (err) {
      setBusy(false);
      if (err instanceof StudioApiError) {
        setError(
          err.status === 401
            ? "Wrong username or password"
            : err.message
        );
      } else {
        setError("Can’t reach the studio API — check your connection and try again");
      }
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !busy) submit();
  };

  return (
    <section
      role="main"
      aria-label="Sign in"
      style={{ position: "fixed", inset: 0, zIndex: 200, background: "#074A4D", display: "grid", placeItems: "center", overflow: "auto", fontFamily: "var(--font-switzer)" }}
    >
      <img
        src="/studio/footer-texture.svg"
        alt=""
        style={{ position: "absolute", left: -80, bottom: -100, width: 560, opacity: 0.5, pointerEvents: "none" }}
      />
      <div
        style={{ position: "relative", isolation: "isolate", width: "min(400px,calc(100vw - 32px))", background: "#ffffff", borderRadius: 24, padding: "30px 30px 24px", boxShadow: "0 24px 60px rgba(0,0,0,.3)", margin: "20px 0", boxSizing: "border-box" }}
      >
        <Wordmark />
        <div style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: ".14em", color: "#757575", textTransform: "uppercase", marginTop: 2 }}>
          Content studio
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-.02em", color: studioColors.tealDeep, marginTop: 20, fontFamily: "var(--font-switzer)" }}>
          Sign in
        </h2>
        <p style={{ fontSize: 13, color: studioColors.bodyGray, margin: "4px 0 18px", lineHeight: 1.5 }}>
          Manage the flarize.com blog — entries, media and templates.
        </p>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: studioColors.labelGray, marginBottom: 6 }}>Username</label>
          <input
            type="text"
            autoComplete="username"
            aria-label="Username"
            placeholder="your.username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={onKey}
            onFocus={(e) => (e.currentTarget.style.boxShadow = fieldRingFocus)}
            onBlur={(e) => (e.currentTarget.style.boxShadow = fieldRing)}
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: studioColors.labelGray, marginBottom: 6 }}>Password</label>
          <input
            type="password"
            autoComplete="current-password"
            aria-label="Password"
            placeholder="••••••••"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={onKey}
            onFocus={(e) => (e.currentTarget.style.boxShadow = fieldRingFocus)}
            onBlur={(e) => (e.currentTarget.style.boxShadow = fieldRing)}
            style={inputStyle}
          />
        </div>
        {error && (
          <div role="alert" style={{ fontSize: 12, fontWeight: 500, color: studioColors.danger, marginBottom: 10 }}>{error}</div>
        )}
        <div style={{ height: 6 }} />
        <button
          onClick={submit}
          disabled={busy}
          className="transition-[filter] hover:brightness-[.96]"
          style={{ width: "100%", justifyContent: "center", display: "inline-flex", alignItems: "center", height: 46, borderRadius: 12, border: "none", background: studioColors.gold, color: studioColors.goldInk, fontFamily: "var(--font-switzer)", fontSize: 15, fontWeight: 600, cursor: busy ? "default" : "pointer", opacity: busy ? 0.7 : 1 }}
        >
          {busy ? "Signing in…" : "Sign in to the studio"}
        </button>
        <div style={{ fontSize: 11.5, color: studioColors.faintGray, marginTop: 12, textAlign: "center" }}>
          Access is limited to invited team accounts.
        </div>
      </div>
    </section>
  );
}
