"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sendOtp, verifyOtp } from "@/services/detailedQuoteService";
import {
  registerVerificationHandler,
  VerificationCancelledError,
  type VerificationRequest,
} from "@/services/phoneVerification";

/** The server's first field error or message, else a generic line. */
function otpErrorMessage(error: unknown): string {
  const data = (error as { errorData?: { message?: string; errors?: Record<string, unknown> } })?.errorData;
  const first = data?.errors && Object.values(data.errors)[0];
  if (Array.isArray(first) && typeof first[0] === "string") return first[0];
  if (data?.message) return data.message;
  return "Something went wrong. Please try again.";
}

/**
 * The one-time-code dialog behind requestPhoneVerification(). Mounted once in
 * the root layout; a form submit that needs a verified number opens it, and the
 * submit continues when the customer enters the right code.
 */
export default function PhoneVerificationHost() {
  const [request, setRequest] = useState<VerificationRequest | null>(null);
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef<VerificationRequest | null>(null);

  const send = useCallback(async (req: VerificationRequest) => {
    setBusy(true);
    setError(null);
    try {
      await sendOtp(req.name, req.phone);
      setSent(true);
    } catch (err) {
      setError(otpErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    registerVerificationHandler((req) => {
      // A second request while one is open replaces it; the first form is abandoned.
      requestRef.current?.reject(new VerificationCancelledError());
      requestRef.current = req;
      setRequest(req);
      setSent(false);
      setCode("");
      void send(req);
    });
    return () => registerVerificationHandler(null);
  }, [send]);

  const close = (reason?: Error) => {
    const req = requestRef.current;
    requestRef.current = null;
    setRequest(null);
    if (req && reason) req.reject(reason);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const req = requestRef.current;
    if (!req) return;
    if (!/^\d{6}$/.test(code.replace(/\s/g, ""))) {
      setError("Please enter the 6-digit code.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await verifyOtp(req.phone, code);
      if (res.status === "approved" && res.verification_token) {
        requestRef.current = null;
        setRequest(null);
        req.resolve(res.verification_token);
      } else {
        setError("That code is not correct. Please try again.");
      }
    } catch (err) {
      setError(otpErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  if (!request) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Verify your phone number"
    >
      <form
        onSubmit={handleVerify}
        className="relative w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg"
      >
        <button
          type="button"
          onClick={() => close(new VerificationCancelledError())}
          className="absolute right-4 top-4 text-sm text-gray-500 hover:text-gray-700"
          aria-label="Cancel phone verification"
        >
          Close
        </button>
        <h2 className="text-xl font-semibold text-[#123532]">Verify your number</h2>
        <p className="mt-2 text-sm text-gray-600">
          {sent
            ? `We sent a 6-digit code to ${request.phone}. Enter it to submit your request.`
            : `Sending a code to ${request.phone}…`}
        </p>

        {sent && (
          <div className="mt-4">
            <label htmlFor="pv-code" className="block text-sm font-medium text-gray-700">
              One-time code
            </label>
            <input
              id="pv-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="6-digit code"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        )}

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-5 flex items-center gap-3">
          {sent ? (
            <button
              type="submit"
              disabled={busy}
              className="flex-1 rounded-xl bg-[#F7BA41] px-4 py-2.5 font-semibold text-black disabled:opacity-60"
            >
              {busy ? "Verifying…" : "Verify and submit"}
            </button>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={() => requestRef.current && void send(requestRef.current)}
              className="flex-1 rounded-xl bg-[#F7BA41] px-4 py-2.5 font-semibold text-black disabled:opacity-60"
            >
              {busy ? "Sending…" : "Send code again"}
            </button>
          )}
          {sent && (
            <button
              type="button"
              disabled={busy}
              onClick={() => requestRef.current && void send(requestRef.current)}
              className="text-sm text-gray-600 underline disabled:opacity-60"
            >
              Resend
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
