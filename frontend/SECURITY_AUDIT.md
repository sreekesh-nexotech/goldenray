# Security Audit — Golden Ray / Flarize Next.js Frontend

**Audited:** 2026-05-11
**Target:** `goldenray/frontend` (Next.js 15.5.9, React 19, App Router) deployed on an Ubuntu VPS via Docker Compose
**Scope:** Frontend application source, Dockerfile, docker-compose files, dependency lockfile. The backend (Django, in `goldenray-backend/`) and Nginx host config are referenced but not audited here.

> **Architectural note (important for severity calibration).** This frontend exposes **no API routes, no middleware, no authentication, no server actions, and no user-session storage**. All dynamic data is fetched from a separate backend at `https://flarize.com/api/` via client-side `fetch`. The frontend is effectively a marketing/SSR site that posts lead forms to the backend. That sharply narrows the realistic attack surface — most "auth/session/CSRF/JWT/SSRF" classes in the brief are **N/A**. Findings that would be Critical on an app with auth are downgraded accordingly and clearly marked.

---

## Part 1 — Vulnerable & Outdated Packages

`npm audit` reports **11 vulnerabilities (1 critical, 5 high, 5 moderate)**. Installed versions confirmed from [package-lock.json](package-lock.json).

| Package | Installed | Severity | CVE / Advisory | Nature | Fix |
|---|---|---|---|---|---|
| **jspdf** | 4.1.0 | **Critical** | GHSA-9vjf-qc39-jprp, GHSA-67pg-wm7f-q7fj, GHSA-p5xg-68wr-hm3m, GHSA-7x6v-j9x4-qf24, GHSA-wfv2-pwc8-crg5 | PDF Object Injection via unsanitized `addJS`, AcroForm JS exec, FreeText injection, GIF DoS, HTML injection in new-window paths | Upgrade to **≥ 4.2.1** (`npm i jspdf@latest`) |
| **next** | 15.5.9 | High | GHSA-9g9p-9gw9-jx7f (Image Optimizer DoS via remotePatterns), GHSA-h25m-26qc-wcjf (RSC deserialization DoS), GHSA-ggv3-7p47-pfv8 (request smuggling in rewrites), GHSA-3x4c-7xq6-9pq8 (next/image cache exhaustion), GHSA-q4gf-8mx6-v5v3 (RSC DoS) | DoS, request smuggling | Upgrade to **≥ 15.6.x / 16.x** (latest stable patch) |
| **tar** | 7.4.3 | High | GHSA-34x7-hfp2-rc4v, GHSA-8qq5-rm4j-mr97, GHSA-83g3-92jg-28cx, GHSA-qffp-2rhf-9h96, GHSA-9ppj-qmqm-q256, GHSA-r6q2-hw4h-h46w | Hardlink path traversal, symlink poisoning, arbitrary file write | Upgrade to **≥ 7.5.11** (transitive via npm — bump root, then `npm audit fix`) |
| **picomatch** | 2.3.1 / 4.0.2 | High | GHSA-3v7f-55p6-f55p, GHSA-c2c7-rcm5-vvqj | Method injection, ReDoS via extglob | `npm audit fix` |
| **minimatch** | 3.1.2, 9.0.5 | High | GHSA-3ppc-4f35-3m26, GHSA-7r86-cg39-jmmj, GHSA-23c5-xmqv-rm74 | ReDoS in glob matching | `npm audit fix` |
| **flatted** | 3.3.3 | High | GHSA-25h7-pfq9-p65f, GHSA-rf6f-7fwh-wjgh | Unbounded recursion DoS, prototype pollution in `parse()` | Upgrade to **≥ 3.4.2** |
| **dompurify** | 3.3.1 | Moderate (×8 advisories) | GHSA-v2wj-7wpq-c8vv, GHSA-cjmm-f4jc-qw8r, GHSA-cj63-jhhr-wcxv, GHSA-39q2-94rc-95cp, GHSA-h7mw-gpvr-xq4m, GHSA-crv5-9vww-q3g8, GHSA-v9jr-rg53-9pgp, GHSA-h8r8-wccr-v5f2 | XSS bypasses, prototype pollution, mutation-XSS | Upgrade to **≥ 3.4.0** (transitive via `jspdf` — fixed by upgrading jspdf) |
| **postcss** | 8.4.31 (nested under next), 8.5.3 (root) | Moderate | GHSA-qx2v-qp2m-jg93 | XSS via unescaped `</style>` in stringify output | `npm audit fix` (bring all to ≥ 8.5.10) |
| **uuid** | 11.1.0 | Moderate | GHSA-w5hq-g745-h8pq | Missing buffer-bounds check in v3/v5/v6 with `buf` param | Upgrade to **≥ 11.1.1** |
| **brace-expansion** | 1.1.12 / 2.0.2 | Moderate | GHSA-f886-m6hf-6m8v | Process hang / memory exhaustion on zero-step sequence | `npm audit fix` |
| **ajv** | 6.12.6 | Moderate | GHSA-2g4f-4pwh-qvx6 | ReDoS via `$data` option | `npm audit fix` (transitive) |

**Additional outdated/abandoned packages (not currently CVEs but risky):**
- **`@next/font` 14.2.15** — deprecated in favour of the built-in `next/font` already used in [src/app/layout.tsx](src/app/layout.tsx). Remove this dependency.
- **`swipeable` 1.0.5** — unmaintained, last published ~9 years ago. `react-swipeable` is already installed; remove `swipeable`.
- **`react-player` 2.16.0** — v2 deprecated; upgrade to v3.

**Remediation commands**

```bash
# 1. Cover transitive + safe semver bumps
npm audit fix

# 2. Force-bump the critical / unfixed-by-semver ones
npm i jspdf@latest next@latest flatted@latest uuid@latest react-player@latest

# 3. Remove deprecated / duplicate packages
npm rm @next/font swipeable

# 4. Re-audit
npm audit --audit-level=moderate
```

Add `npm audit --audit-level=high --omit=dev` (or `npx audit-ci --high`) to CI and fail the build on regressions.

---

## Part 2 — Next.js Application Security

### 2a. API Routes & Server Actions
**Status: N/A.** A full traversal under `src/app/**` shows **zero `route.ts`/`route.tsx`** handlers and zero `"use server"` actions. All data flows out via client-side `fetch` to `https://flarize.com/api/` ([src/utils/fetchApi.ts](src/utils/fetchApi.ts)). There is therefore no server-side input handling to audit here — those concerns live in the Django backend.

One informational note: [src/utils/fetchApi.ts:49-58](src/utils/fetchApi.ts#L49-L58) does `console.error` the full upstream error payload. In production builds Next.js still ships `console.error` to the browser console — backend error payloads may leak there. Strip messages in production (`if (process.env.NODE_ENV !== 'production')`).

### 2b. Authentication & Session Management
**Status: largely N/A.** No client-side auth flow, no JWT issuance/verification, no session cookies, no OAuth in this app. The only persistent client state is:

- [src/hooks/userOfferTimer.tsx:16-23](src/hooks/userOfferTimer.tsx#L16-L23) — stores promo expiry timestamps in `localStorage`. **Non-sensitive**, informational.
- [src/components/SolarCalculator/CustomerDetailsPopup.tsx:97-98](src/components/SolarCalculator/CustomerDetailsPopup.tsx#L97-L98) and [src/app/quotation/page.tsx:72-73](src/app/quotation/page.tsx#L72-L73) — store the user's quotation form (name, phone, address-level details) in `sessionStorage` to survive page nav. PII in `sessionStorage` is readable by any script on the origin (XSS amplifier). **Low/Medium**. Mitigation: pass via Next router state/query or encrypted server-side draft; if you must keep it client-side, scrub on quotation submit/exit.

**No hard-coded credentials or secrets** were found in `src/`. Only the GTM container ID (`GTM-5H47L3GM`, public by design) is in [src/config.ts](src/config.ts).

### 2c. Data Exposure
- **`NEXT_PUBLIC_API_BASE_URL`** in [src/config.ts:1](src/config.ts#L1) is intentional and points to a public backend — OK.
- Default API base is **hard-coded** to `https://flarize.com/api/`. If the env var is forgotten in any deployment, the app will silently call production. **Low** — make the default `throw new Error("API_BASE_URL not set")` in production, or fall back to a relative `/api/` proxy.
- Verbose `console.error` of upstream errors (see 2a) — **Low**, browser-side only.

### 2d. Rendering & XSS
Only two uses of `dangerouslySetInnerHTML`:
1. [src/app/layout.tsx:146](src/app/layout.tsx#L146) — inline GTM bootstrap with a static template literal interpolating the static `GTM_ID` constant. **Safe / Informational.**
2. [src/components/JsonLD.tsx:5](src/components/JsonLD.tsx#L5) — `JSON.stringify(data)` inside a `<script type="application/ld+json">`. The `data` argument originates from local TypeScript objects in `src/data/jsonld.ts`, not user input — safe today. **However**, `JSON.stringify` does **not** escape `</script>` sequences, so if `data` ever incorporates remote/user content (e.g. blog metadata fetched from the backend), the page becomes XSS-able. **Medium / latent.** Fix:

   ```tsx
   __html: JSON.stringify(data).replace(/</g, '\\u003c')
   ```

No other `innerHTML`, `eval`, `new Function`, or `document.write` usage was found.

**Open redirect:** `router.push("/comparison-table?panels=…")` in [src/components/SolarComparison/SolarComparisonMain.tsx:91](src/components/SolarComparison/SolarComparisonMain.tsx#L91) and [SolarComparisonMain.tsx:292](src/components/SolarComparison/SolarComparisonMain.tsx#L292) use static paths only. No `next/redirect` with attacker-controlled targets. **OK.**

### 2e. Next.js Configuration ([next.config.ts](next.config.ts))
**Multiple Highs here — this is the area to fix first.**

| # | Finding | Severity |
|---|---|---|
| 2e-1 | **No security headers at all.** No `async headers()` block. The app ships without `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`, `Permissions-Policy`, or any CSP. | High |
| 2e-2 | **No CSP.** Given the inline GTM script in `layout.tsx` (line 146) and JSON-LD inline scripts, CSP needs `script-src` with a nonce or `'strict-dynamic'`. Currently the page is wide-open to injected `<script>` if XSS is ever achieved. | High |
| 2e-3 | `reactStrictMode: true` ✅, `poweredByHeader` left default (true). Set `poweredByHeader: false`. | Low |
| 2e-4 | `images.remotePatterns` lists three hostnames — acceptable scope, but combined with the **next** advisory GHSA-9g9p-9gw9-jx7f, an unpatched Next exposes the Image Optimizer to DoS. Patch Next (Part 1). | Medium |
| 2e-5 | All seven `redirects()` are static `source → destination` pairs with no user-controlled segments. No open-redirect risk. ✅ | Info |

**Suggested `next.config.ts` block:**

```ts
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'Content-Security-Policy', value:
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; " +
      "img-src 'self' data: blob: https://gym-manager-pull.b-cdn.net https://golden-ray.b-cdn.net https://blog.flarize.com https://www.googletagmanager.com https://www.google-analytics.com; " +
      "connect-src 'self' https://flarize.com https://www.google-analytics.com; " +
      "style-src 'self' 'unsafe-inline'; " +
      "font-src 'self' data:; " +
      "frame-src https://www.googletagmanager.com; " +
      "frame-ancestors 'self'; base-uri 'self'; form-action 'self';" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  // …existing config
};
```

> `'unsafe-inline'` for `script-src` is required by the current GTM bootstrap. Strongly consider switching to a **nonce-based** CSP using `next/script` + middleware nonce, which is the modern Next.js pattern.

### 2f. Middleware
No `middleware.ts` exists. There's nothing to bypass. ✅

---

## Part 3 — Docker Security

[Dockerfile](Dockerfile):

| # | Finding | Severity |
|---|---|---|
| 3-1 | **`FROM node:18-alpine`** — Node 18 reaches end-of-life **2026-04-30** (already past as of this audit, 2026-05-11). Bump to `node:22-alpine` (active LTS) or `node:20-alpine` (maintenance LTS until 2026-04 — already EOL). | **High** |
| 3-2 | **Image is not digest-pinned.** `node:18-alpine` resolves to a moving target. Pin by digest: `FROM node:22-alpine@sha256:…` for reproducible, supply-chain-safe builds. | Medium |
| 3-3 | **Runs as root.** No `USER` directive in the production stage. Any RCE in Next or a dep gets root in the container. | **High** |
| 3-4 | **Stale build deps shipped.** `apk add build-base vips-dev` runs only in the builder stage ✅, but the final stage copies the full `node_modules` from the builder (including dev dependencies installed by `npm install`). Use `npm ci --omit=dev` in a separate stage, or run `next build` with `output: 'standalone'` and copy only `.next/standalone` + `.next/static` + `public`. | High |
| 3-5 | `npm install` is used instead of `npm ci`. `ci` is reproducible and respects the lockfile; `install` can mutate it. | Medium |
| 3-6 | No `HEALTHCHECK` inside the Dockerfile (compose has one, but image-level is preferred for portability). | Low |
| 3-7 | No `.dockerignore` shown alongside the Dockerfile. `COPY . .` will copy `.git/`, `.env*`, `node_modules/`, etc. if not ignored. **Confirm a `.dockerignore` exists and includes `.git`, `.env*`, `node_modules`, `.next/cache`.** | High (if missing) |
| 3-8 | `EXPOSE 3000` and `CMD ["npm", "start"]` — fine, but `npm start` forks an extra process; use `CMD ["node", "node_modules/next/dist/bin/next", "start"]` or the standalone server for cleaner signal handling. | Low |
| 3-9 | No `NODE_ENV=production` `ENV` directive in the runtime stage. Next.js infers it from `next start`, but explicit is safer. | Low |

[docker-compose.yml](../../docker-compose.yml) at repo root:

| # | Finding | Severity |
|---|---|---|
| 3-10 | `golden-frontend` is correctly bound to `127.0.0.1:3001:3000` ✅. **But [docker-compose.override.yml](../../docker-compose.override.yml) overrides it to `"3000:3000"`** — that publishes the Next.js dev server directly on `0.0.0.0:3000`, bypassing whatever Nginx/firewall hardening exists. If the override is loaded in production (compose loads `docker-compose.override.yml` automatically), the app is exposed without TLS, CSP, or rate limiting. | **Critical (operational)** |
| 3-11 | `golden-bom` volume mount is malformed: `./goldenbomnode/Golden-Ray-BOM/data:/app/data:/app/data` (three colons — the last `:/app/data` will be parsed as mount options and may fail or behave unexpectedly). Fix: `./goldenbomnode/Golden-Ray-BOM/data:/app/data:rw`. | Medium |
| 3-12 | No `read_only: true`, no `cap_drop: [ALL]`, no `security_opt: [no-new-privileges:true]` on any service. | Medium |
| 3-13 | No CPU/memory limits (`deploy.resources.limits` or `mem_limit`). One runaway container can starve the host. | Medium |
| 3-14 | Postgres container exposes no port to host ✅ — good. | Info |
| 3-15 | No Docker socket (`/var/run/docker.sock`) mount anywhere ✅. | Info |
| 3-16 | `.env` files at `/home/nexoadmin/apps/goldenray/.env`, `envs/golden-backend.env`, `envs/global.env` referenced by compose. Verify they are `chmod 600` and **not** committed (root `.gitignore` here only covers the frontend dir). | High (operational) |
| 3-17 | `docker-compose.yml.save` and `docker-compose.yml.backup` exist alongside the live file. These often contain old secrets or older configs. Remove or move out of the repo tree. | Low |

---

## Part 4 — Ubuntu VPS & Infrastructure

I could not introspect the live host, but from the compose layout (`# using host nginx instead`) the intended posture is: host Nginx → `127.0.0.1:3001` (frontend) / `127.0.0.1:8000` (backend). Verify:

| # | Check | Action |
|---|---|---|
| 4-1 | Confirm `docker-compose.override.yml` is **not** loaded in prod (rename to `docker-compose.dev.yml` and load explicitly with `-f`). | **Critical** |
| 4-2 | UFW/iptables: only **22, 80, 443** open from the internet. `sudo ufw status verbose`. | High |
| 4-3 | SSH: `PasswordAuthentication no`, `PermitRootLogin no`, key-only auth. `/etc/ssh/sshd_config`. | High |
| 4-4 | TLS: HTTPS enforced, HTTP → HTTPS 301, `Strict-Transport-Security` set at Nginx (in addition to Next). Certificate auto-renews (`certbot renew --dry-run`). | High |
| 4-5 | Unattended security upgrades: `sudo dpkg-reconfigure --priority=low unattended-upgrades`. | Medium |
| 4-6 | Docker daemon: confirm `/var/run/docker.sock` is not exposed via TCP and not bind-mounted into any container. | High |
| 4-7 | Log shipping: compose uses json-file with 10 MB × 3 rotation ✅. Consider forwarding to a host log aggregator (journald/Loki/CloudWatch) for retention. | Low |
| 4-8 | Secrets: `.env` files exist outside the repo but on disk in plaintext. Ensure `chmod 600`, owner `root` or the deploy user, and confirm none are committed (`git ls-files | grep -E '\.env'`). | High |
| 4-9 | Nginx config (not in this repo) should set: HSTS, CSP (or defer to Next), rate-limit `/contactus` and any lead-collection paths, and proxy timeout sanity. | High |

---

## Part 5 — Findings Table & Remediation Roadmap

### Summary

| # | Finding | Category | Severity | Location | Fix |
|---|---|---|---|---|---|
| F1 | `jspdf 4.1.0` — critical PDF object injection + 4 more advisories | Deps | **Critical** | package.json | `npm i jspdf@latest` |
| F2 | `docker-compose.override.yml` publishes frontend on `0.0.0.0:3000` | Infra | **Critical** | docker-compose.override.yml | Rename to `*.dev.yml`, load explicitly |
| F3 | Next.js 15.5.9 — 5 high CVEs (DoS, smuggling, cache exhaustion) | Deps | High | package.json | `npm i next@latest` |
| F4 | `tar 7.4.3` — 6 path-traversal/symlink advisories | Deps | High | package-lock.json | `npm audit fix` |
| F5 | `picomatch`, `minimatch`, `flatted` — ReDoS / proto pollution | Deps | High | package-lock.json | `npm audit fix` |
| F6 | No security headers / no CSP | App config | High | next.config.ts | Add `headers()` block (see 2e) |
| F7 | Container runs as root | Docker | High | Dockerfile | Add `USER node` in runtime stage |
| F8 | Dev `node_modules` shipped to production image | Docker | High | Dockerfile | Use `next build` standalone output OR `npm ci --omit=dev` final stage |
| F9 | Node 18 base image is EOL | Docker | High | Dockerfile L2 / L11 | `FROM node:22-alpine@sha256:…` |
| F10 | Verify `.dockerignore` excludes `.env`, `.git`, `node_modules` | Docker | High | `.dockerignore` | Create/verify |
| F11 | Confirm `.env` files mode 0600 and not in git | Infra | High | host filesystem | `chmod 600`, `git ls-files \| grep env` |
| F12 | UFW + SSH hardening + HSTS + TLS verified | Infra | High | host | Manual checklist (Part 4) |
| F13 | `dompurify ≤ 3.3.1` — 8 XSS/bypass advisories (transitive via jspdf) | Deps | Medium | package-lock.json | Bumped automatically when F1 lands |
| F14 | `postcss < 8.5.10` — XSS via stringify | Deps | Medium | package-lock.json | `npm audit fix` |
| F15 | `JsonLD.tsx` doesn't escape `</script>` in `JSON.stringify` | XSS (latent) | Medium | src/components/JsonLD.tsx:5 | `.replace(/</g,'\\u003c')` |
| F16 | PII stored in `sessionStorage` for quotation flow | Data exposure | Medium | CustomerDetailsPopup.tsx:97-98, quotation/page.tsx:72-73 | Move to router state / encrypted server draft, clear on submit |
| F17 | Image not digest-pinned; `npm install` not `npm ci` | Supply chain | Medium | Dockerfile | Pin digest, use `npm ci` |
| F18 | `golden-bom` volume mount has malformed third colon | Docker | Medium | docker-compose.yml | `./…/data:/app/data:rw` |
| F19 | No `read_only`, `cap_drop`, `no-new-privileges`, resource limits | Docker | Medium | docker-compose.yml | Add hardening keys |
| F20 | `uuid 11.1.0`, `brace-expansion`, `ajv` — moderate ReDoS / bounds | Deps | Moderate | package-lock.json | `npm audit fix` + `npm i uuid@latest` |
| F21 | `fetchApi.ts` logs raw upstream errors via `console.error` in prod | Info leak | Low | src/utils/fetchApi.ts:49-58, 60 | Gate on `NODE_ENV !== 'production'` |
| F22 | `API_BASE_URL` falls back to hard-coded prod URL | Config | Low | src/config.ts:1 | Throw if unset, or use relative `/api/` proxy |
| F23 | `@next/font` 14.2.15 deprecated; `swipeable` 1.0.5 abandoned; `react-player` v2 | Deps | Low | package.json | Remove / upgrade |
| F24 | `poweredByHeader` not disabled | Info leak | Low | next.config.ts | `poweredByHeader: false` |
| F25 | `docker-compose.yml.save` / `.backup` left in repo | Hygiene | Low | repo root | Delete |

### Step-by-step remediation order

**Day 0 (do today)**
1. **F2** — Rename `docker-compose.override.yml` → `docker-compose.dev.yml`. On the prod host, redeploy with `docker compose -f docker-compose.yml up -d` (no override). Verify `ss -tlnp | grep 3000` shows only `127.0.0.1`.
2. **F1, F3, F4, F5, F13, F14, F20**: in `frontend/`
   ```bash
   npm audit fix
   npm i jspdf@latest next@latest flatted@latest uuid@latest
   npm rm @next/font swipeable
   npm audit --audit-level=high
   ```
   Rebuild image, smoke-test PDF generation and the calculator flow.
3. **F11** — `chmod 600 /home/nexoadmin/apps/goldenray/.env /home/nexoadmin/apps/goldenray/envs/*.env`; confirm `git ls-files | grep -E '\.env$'` returns nothing.

**Week 1**
4. **F6** — add `headers()` + CSP to `next.config.ts` (block above). Test in staging — GTM, JSON-LD, images, fonts all need to load. Start CSP in `Content-Security-Policy-Report-Only` for 48 h, then enforce.
5. **F7, F8, F9** — rewrite `Dockerfile`:
   ```dockerfile
   FROM node:22-alpine@sha256:<pin> AS deps
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci

   FROM node:22-alpine@sha256:<pin> AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   ENV NEXT_TELEMETRY_DISABLED=1
   RUN npm run build

   FROM node:22-alpine@sha256:<pin> AS runner
   WORKDIR /app
   ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
   RUN addgroup -S app && adduser -S app -G app
   COPY --from=builder --chown=app:app /app/.next/standalone ./
   COPY --from=builder --chown=app:app /app/.next/static ./.next/static
   COPY --from=builder --chown=app:app /app/public ./public
   USER app
   EXPOSE 3000
   HEALTHCHECK --interval=30s --timeout=5s --start-period=30s CMD wget -qO- http://127.0.0.1:3000/ >/dev/null || exit 1
   CMD ["node", "server.js"]
   ```
   Add `output: 'standalone'` to `next.config.ts`. Confirm a `.dockerignore` (F10) with `.git`, `node_modules`, `.next`, `.env*`, `Dockerfile`, `*.md`.
6. **F19** — add to each service in `docker-compose.yml`:
   ```yaml
   read_only: true
   tmpfs: [/tmp]
   cap_drop: [ALL]
   security_opt: [no-new-privileges:true]
   mem_limit: 512m
   pids_limit: 200
   ```
7. **F18** — fix the `golden-bom` volume line.
8. **F12** — host checklist: `ufw status`, `sshd_config`, `certbot renew --dry-run`, `apt list --installed | grep unattended-upgrades`.

**Week 2**
9. **F15, F16, F21, F22, F24** — code fixes (small, low-risk).
10. **F25** — remove `*.yml.save` / `*.yml.backup`.

---

## Hardening Checklist (going forward)

**CI / SDLC**
- [ ] `npm audit --audit-level=high --omit=dev` (or `npx audit-ci --high`) on every PR — fail build on regressions.
- [ ] Dependabot or Renovate enabled, weekly grouped PRs for minor/patch, security PRs immediate.
- [ ] **Secret scanning** on every push: `gitleaks` or `trufflehog` in CI; pre-commit hook for the same.
- [ ] **SAST**: GitHub CodeQL (free for public/internal) or `semgrep --config=p/nextjs`.
- [ ] **Container scan**: `trivy image golden-frontend` in CI; fail on Critical/High.
- [ ] Lockfile required: `npm ci` in CI, no `npm install`.
- [ ] Branch protection on `main`: require review + green checks.

**Runtime**
- [ ] Strict CSP (move to nonce-based when GTM is the only inline script).
- [ ] Rate-limit lead-form / contact / quotation endpoints at Nginx (`limit_req_zone`).
- [ ] Centralised log shipping (Loki / CloudWatch / Papertrail) with alerts on 5xx spikes and Next/Node panics.
- [ ] Monthly `apt update && apt upgrade` + reboot window; `unattended-upgrades` for security patches.
- [ ] Quarterly review of `images.remotePatterns` and CSP allowlists.

**Recommended Next.js / React libraries**
- **`zod`** — validate any backend response your UI relies on, and any data you put through `JsonLD.tsx`. Schemas are free documentation too.
- **`isomorphic-dompurify`** — if you ever render backend-supplied HTML (currently you don't, but the blog content path is the obvious risk).
- **`next-safe`** — declarative CSP builder; integrates cleanly with `next.config.ts`.
- **`@next/bundle-analyzer`** — not security per se, but helps spot unexpected new transitive deps.
- **`next-auth` / `@auth/core`** — if/when the frontend grows authenticated areas, don't roll your own.

---

## Items flagged as informational / not vulnerabilities

- `dangerouslySetInnerHTML` in `layout.tsx` (static GTM bootstrap) — safe.
- `localStorage` use in `userOfferTimer.tsx` — non-sensitive timer state.
- `window.location.hash` reads in `ProjectMain.tsx` — only used for tab switching, never reflected as HTML.
- Static `redirects()` in `next.config.ts` — no user-controlled segments.
- No `route.ts`, no `middleware.ts`, no `"use server"` actions — so the entire "API auth/authorization/rate limiting/SSRF" section of the brief is N/A for this codebase; those concerns belong to the Django backend audit.

---

*Report saved to [SECURITY_AUDIT.md](SECURITY_AUDIT.md). Re-run `npm audit` after applying the Day-0 fixes and update Part 1 — most rows should drop out.*
