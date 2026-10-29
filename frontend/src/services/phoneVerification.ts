// src/services/phoneVerification.ts
//
// Promise-based phone verification for the public lead forms. The platform
// backend refuses a lead that carries a phone number without a verification
// token, so submitContactForm() asks for one here. The dialog itself is
// <PhoneVerificationHost /> (mounted once in the root layout), which registers
// itself as the handler; the forms do not change.

export interface VerificationRequest {
  name: string;
  phone: string;
  resolve: (token: string) => void;
  reject: (reason: Error) => void;
}

export class VerificationCancelledError extends Error {
  errorData = { errors: { verification_token: ["Phone verification was cancelled."] } };
  constructor() {
    super("Phone verification was cancelled.");
    this.name = "VerificationCancelledError";
  }
}

// The backend token is a signed, reusable proof valid ~30 minutes (30 min TTL
// on the server); keep it a little shorter so we never send an expired one.
const TOKEN_TTL_MS = 25 * 60 * 1000;
const verified = new Map<string, { token: string; expiresAt: number }>();

let handler: ((request: VerificationRequest) => void) | null = null;

const compact = (phone: string) => phone.replace(/\s+/g, "");

export function registerVerificationHandler(fn: ((request: VerificationRequest) => void) | null) {
  handler = fn;
}

export function rememberVerification(phone: string, token: string) {
  verified.set(compact(phone), { token, expiresAt: Date.now() + TOKEN_TTL_MS });
}

/** A verification token for this number: a recent one, else the customer's OTP. */
export function requestPhoneVerification(name: string, phone: string): Promise<string> {
  const key = compact(phone);
  const cached = verified.get(key);
  if (cached && cached.expiresAt > Date.now()) return Promise.resolve(cached.token);

  return new Promise<string>((resolve, reject) => {
    if (!handler) {
      reject(new Error("Phone verification is not available on this page."));
      return;
    }
    handler({
      name,
      phone: key,
      resolve: (token) => {
        rememberVerification(key, token);
        resolve(token);
      },
      reject,
    });
  });
}
