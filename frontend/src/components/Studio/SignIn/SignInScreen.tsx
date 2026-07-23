"use client";

// src/components/Studio/SignIn/SignInScreen.tsx
//
// Standalone sign-in for the Content Studio. Prototype auth — any email +
// password is accepted (validation is presentation-only). Replace `submit`
// with a real auth call during API integration.

import { useState } from "react";
import { useRouter } from "next/navigation";
import Wordmark from "../shell/Wordmark";
import { studioColors } from "../shared/format";

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

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("sree@flarize.com");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    const em = email.trim();
    if (!em || em.indexOf("@") < 1) {
      setError("Enter your work email");
      return;
    }
    router.push("/studio/dashboard");
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") submit();
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
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: studioColors.labelGray, marginBottom: 6 }}>Work email</label>
          <input
            type="email"
            aria-label="Work email"
            placeholder="you@flarize.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <div style={{ fontSize: 12, fontWeight: 500, color: studioColors.danger, marginBottom: 10 }}>{error}</div>
        )}
        <div style={{ height: 6 }} />
        <button
          onClick={submit}
          className="transition-[filter] hover:brightness-[.96]"
          style={{ width: "100%", justifyContent: "center", display: "inline-flex", alignItems: "center", height: 46, borderRadius: 12, border: "none", background: studioColors.gold, color: studioColors.goldInk, fontFamily: "var(--font-switzer)", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
        >
          Sign in to the studio
        </button>
        <div style={{ fontSize: 11.5, color: studioColors.faintGray, marginTop: 12, textAlign: "center" }}>
          Prototype sign-in — any email &amp; password work.
        </div>
      </div>
    </section>
  );
}
