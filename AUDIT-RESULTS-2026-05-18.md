# Codebase Audit Results — 2026-05-18

**Scope:** Next.js 15 (App Router) + React 19 + TypeScript + Tailwind 4 codebase at `frontend/`.
**Backend:** Django REST Framework at `goldenray-backend/` (security-only review).

Five prompts from `AUDIT.md` were executed in order. This document summarises findings, fixes applied during the session, and remaining work.

---

## Executive Overview

| Prompt | Theme | CRITICAL | HIGH | MEDIUM/LOW | Status |
|---|---|---|---|---|---|
| 1 | State & Data Fetching | 7 | 18 | 12 | 4 critical fixed |
| 2 | Security & Environment | 5 | 8 | — | 0 fixed (blocked on backend access / secrets rotation) |
| 3 | Performance & Bundle | 5 | 7 | 8 | 3 critical fixed; 2 deferred |
| 4 | Code Quality & Deployment | 6 | 14 | 15 | 2 critical fixed; 4 deferred |
| 5 | UI Consistency & Responsive | 6 (HIGH) | 9 (MED) | 5 (LOW) | 0 fixed (presented for review) |

**Build status:** `npm run build` is clean — exit code 0, **zero warnings, zero errors**, 37 routes prerendered, sitemap generated.

**Top systemic risks still open:**
1. **Committed Twilio/DB credentials** in `goldenray-backend/.env` — rotate immediately.
2. **No `error.tsx` / `not-found.tsx`** at app root — unhandled errors crash the tree.
3. **Hardcoded placeholders in production code** — `proposalBy = "XXX"`, bank account `XXXXXXXXXXXX`, IFSC `UBIN0XXXXX`, WhatsApp `919876543210`.
4. **No security headers** in `next.config.ts` (CSP, HSTS, X-Frame-Options, etc).
5. **Brand-color fragmentation** — 5 near-duplicate teal hexes, 6 yellow variants.

---

## Prompt 1 — State & Data Fetching

**Result:** 7 CRITICAL, 18 HIGH, 12 MEDIUM. **Tech-debt score: 4.2 / 10.**

### Fixed in this session

| Issue | File | What changed |
|---|---|---|
| C2 — interval recreation | [AffiliatePrograms/Testimonials.tsx:82](frontend/src/components/AffiliatePrograms/Testimonials.tsx#L82) | Removed `[active]` dep so interval isn't recreated every cycle. |
| C3 — filter state not URL-synced | [SolarComparison/SolarComparisonMain.tsx](frontend/src/components/SolarComparison/SolarComparisonMain.tsx) | `filters`, `sortBy`, `selectedPanelIds` now derive from `useSearchParams`; writes go through `router.replace`. Wrapped in `<Suspense>` at [solar-comparison/page.tsx](frontend/src/app/solar-comparison/page.tsx). |
| C5 — hash mutation | [Projects/ProjectMain.tsx](frontend/src/components/Projects/ProjectMain.tsx) | Replaced `window.location.hash` mutation with `?category=` query param via `useSearchParams` + `router.replace({ scroll: false })`. Filtering became a `useMemo`. Wrapped in `<Suspense>` at [projects/page.tsx](frontend/src/app/projects/page.tsx). |
| C6 — useState fragmentation | [AdvanceCalculator/AdvanceCalculatorMain.tsx](frontend/src/components/AdvanceCalculator/AdvanceCalculatorMain.tsx) | Consolidated 5 UI-flow `useState`s (`currentStep`, `error`, `loading`, `resultData`, `isPopupOpen`) into a typed `flowReducer`. Also fixed a latent bug where `finally` always cleared `error` to `null`. |

### False positives in original audit

| Audit ID | Why dismissed |
|---|---|
| C1 — idle popup loop | `startOffer` is already wrapped in `useCallback(..., [])` → stable identity. No loop. |
| C7 — FloatingPhoneButton missing `"use client"` | Already present at [FloatingPhoneButton.tsx:2](frontend/src/components/common/FloatingPhoneButton.tsx#L2). |

### Still open (CRITICAL)

| # | Location | Issue | Recommended fix |
|---|---|---|---|
| P1-C4 | [app/quotation/page.tsx](frontend/src/app/quotation/page.tsx) | Quotation data lives in `sessionStorage`; refresh wipes it; forced redirect if missing. | Needs backend support — store quote in DB with id, route as `/quotation/[quoteId]`. |

### Still open (HIGH — 17 of original 18)

Highlights of what was *not* touched:
- ~42 components carry `"use client"` unnecessarily; many under `/Home`, `/Quotation`, `/AdvanceCalculator` are pure presentational and could be Server Components.
- Many components init state from props (`SolarBasicResult`) without re-syncing on prop change.
- `AdvanceForm1.tsx:38-50` swallows API errors with `console.error` — no user feedback.
- `ExitIntentPopup` mutates `sessionStorage` inside a `mouseout` handler — not reactive.
- No request deduplication / abort for filter-driven fetches.
- Body-padding mutation in [ConditionalLayout.tsx:22-30](frontend/src/components/common/ConditionalLayout.tsx#L22-L30) without robust cleanup.
- 9 props passed to `SolarBasicResult` — needs context or hook.
- Comparison-table Suspense fallback has no error boundary pair.

---

## Prompt 2 — Security & Environment

**Result:** 5 CRITICAL, 8 HIGH. **Nothing fixed this session** — most require backend access, secret rotation, or sensitive coordination.

### CRITICAL — All still open

| # | Location | Issue |
|---|---|---|
| **P2-C1** | `goldenray-backend/.env` (git-tracked) | Real Twilio Account SID, Auth Token, Verify Service SID + `DB_PASSWORD=root` + Django secret key committed. **Rotate immediately**, scrub history with `git-filter-repo`. |
| **P2-C2** | [goldenray-backend/backend/goldenray/serializers/otp_serializer.py:3-9](goldenray-backend/backend/goldenray/serializers/otp_serializer.py#L3-L9) | OTP serializers accept any string up to max_length — no regex for phone / 6-digit OTP. |
| **P2-C3** | [goldenray-backend/backend/goldenray/views/lead_collection_home_views.py:8-38](goldenray-backend/backend/goldenray/views/lead_collection_home_views.py#L8-L38) | Public `GET` returns full lead list. `POST` returns 200 vs 201 → user enumeration. No rate limit. |
| **P2-C4** | [QuotePopup.tsx:46, :51](frontend/src/components/SolarCalculator/QuotePopup.tsx#L46) | `console.log` of OTP send/verify responses in production. |
| **P2-C5** | [frontend/next.config.ts](frontend/next.config.ts) | No `headers()` function. Missing CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. |

### HIGH — All still open

| # | Location | Issue |
|---|---|---|
| P2-H1 | [frontend/src/utils/fetchApi.ts:11](frontend/src/utils/fetchApi.ts#L11) | Client calls `http://127.0.0.1:8000/api/` directly; no Next API proxy. |
| P2-H2 | [backend/settings.py:140-155](goldenray-backend/backend/backend/settings.py#L140-L155) | `CORS_ALLOW_ALL_ORIGINS = True` in dev — misconfigured `ENVIRONMENT` would ship this. |
| P2-H3 | [JsonLD.tsx:5](frontend/src/components/JsonLD.tsx#L5), [layout.tsx GTM block](frontend/src/app/layout.tsx) | `dangerouslySetInnerHTML` — fine today, XSS-prone if input ever becomes dynamic. |
| P2-H4 | [otp_views.py:27-69](goldenray-backend/backend/goldenray/views/otp_views.py#L27-L69) | OTP throttle uses 30-day window only — no per-hour/minute cap. |
| P2-H5 | [backend/settings.py:131](goldenray-backend/backend/backend/settings.py#L131) | `CSRF_COOKIE_SAMESITE = "None"` + `CORS_ALLOW_CREDENTIALS = True` → wider CSRF surface. |
| P2-H6 | [otp_views.py:141](goldenray-backend/backend/goldenray/views/otp_views.py#L141) | `Response({'error': str(e)})` leaks raw exception text. |
| P2-H7 | [lead_collection_home_serializer.py:4-8](goldenray-backend/backend/goldenray/serializers/lead_collection_home_serializer.py#L4-L8) | No regex validators on name / phone — stored-XSS exposure when rendered later. |
| P2-H8 | Codebase-wide | No auth lifecycle / no logout flow. Quotation flow relies on sessionStorage instead. |

### Flow traces

- **Logout flow:** absent.
- **Auto-login flow:** absent.
- **Account-switch flow:** absent.

---

## Prompt 3 — Performance & Bundle

**Result:** 5 CRITICAL, 7 HIGH, 8 MEDIUM.

### Fixed in this session

| Issue | File | What changed |
|---|---|---|
| P3-C1 — raw `<img>` | [subsidy/Why-flarize.tsx:57](frontend/src/components/subsidy/Why-flarize.tsx#L57) | Replaced with `<Image>` from `next/image`, same Tailwind classes preserved, plus `sizes` for responsive serving. |
| P3-C2 — PDF libs eager-imported | [Quotation/QuotationPdfGenerator.tsx](frontend/src/components/Quotation/QuotationPdfGenerator.tsx) | `jspdf` and `html2canvas-pro` now `await Promise.all([import("jspdf"), import("html2canvas-pro")])` inside `generatePdf`. Saves ~500KB on all non-quotation routes. |
| P3-C3 — GSAP overhead | `Solar-steps-gsap.tsx` (deleted) + [home.tsx](frontend/src/components/Home/home.tsx) + [package.json](frontend/package.json) | Deleted unused GSAP component; removed commented import; `npm uninstall gsap`. |

### Still open

| # | Location | Issue | Notes |
|---|---|---|---|
| **P3-C4** | [frontend/public/](frontend/public/) | 8+ PNGs > 500KB (`Residential-4.png` 1.4MB, `testimonial.png` 1.3MB, `heroImg.png` 875KB, etc.) | **Manual step** — needs `sharp` / `cwebp` / squoosh. Cannot do from code alone. |
| **P3-C5** | [app/comparison-table/page.tsx](frontend/src/app/comparison-table/page.tsx) | Client-side panel fetch should be Server Component | Deferred — backend URL is hardcoded `127.0.0.1:8000`; needs env-var migration first. |
| P3-H1 | 76 files | Too many `"use client"` directives | Audit + push deeper |
| P3-H2 | Quotation pages | `<Image fill>` without parent dimensions | CLS risk |
| P3-H3 | ~38 spots | `.map(... key={index})` | Use stable IDs |
| P3-H4 | [AdvanceResult.tsx:19-28](frontend/src/components/AdvanceCalculator/AdvanceResult.tsx#L19-L28), [SolarCalculator/basic-result.tsx](frontend/src/components/SolarCalculator/basic-result.tsx) | `ChartJS.register(...)` at module load | Defer to mount |
| P3-H5 | [QuotePopup.tsx:46, :51](frontend/src/components/SolarCalculator/QuotePopup.tsx#L46) | `console.log` in prod (also Sec C4) | Remove or env-gate |
| P3-H6 | [data/blog-content.ts](frontend/src/data/blog-content.ts) (1025 lines) | TS module with hardcoded blog content | Strapi already used; remove module |
| P3-H7 | [layout.tsx:145-160](frontend/src/app/layout.tsx#L145-L160) | GTM with `strategy="beforeInteractive"` | Change to `afterInteractive` |
| P3-M1 | [package.json](frontend/package.json) | `@heroicons/react` declared but never imported | Drop |
| P3-M2 | [package.json](frontend/package.json) + [Testimomial.tsx:1](frontend/src/components/Home/Testimomial.tsx#L1) | `react-player` declared, only commented-out import | Drop (~200KB) |

---

## Prompt 4 — Code Quality & Deployment

**Result:** 6 CRITICAL, 14 HIGH, 15 MEDIUM. **Deployment readiness: 6 / 10.**

### Fixed in this session

| Issue | File | What changed |
|---|---|---|
| P4-C4 — dead imports | [app/layout.tsx](frontend/src/app/layout.tsx) | Removed 6 unused imports (`Header`, `Footer`, `IdleTimeoutPopup`, `ExitIntentPopup`, `FloatingChatButton`, `FloatingPhoneButton`) and their `eslint-disable-next-line` comments. All 6 continue to render via `ConditionalLayout`. |
| P4-H4 — 11 `react-hooks/exhaustive-deps` warnings | Multiple files | All 11 hook-dep lint warnings fixed (see "Build cleanup" section below). |

### Still open (CRITICAL)

| # | Location | Issue | Notes |
|---|---|---|---|
| **P4-C1** | [quotation/page.tsx:45](frontend/src/app/quotation/page.tsx#L45) | `proposalBy = "XXX"` | Awaiting real value or backend prop. |
| **P4-C2** | [Page4Content.tsx:544, :548](frontend/src/components/Quotation/Page4Content.tsx#L544) | Bank A/C `XXXXXXXXXXXX`, IFSC `UBIN0XXXXX` | Awaiting real values. |
| **P4-C3** | [QuotationPdfGenerator.tsx:71](frontend/src/components/Quotation/QuotationPdfGenerator.tsx#L71) | Second `proposalBy = "XXX"` | Same root issue. |
| **P4-C5** | `src/app/error.tsx` | **Missing.** | Next.js default crash UI shown on render errors. |
| **P4-C6** | `src/app/not-found.tsx` | **Missing.** | Unmatched routes hit Next's built-in 404. |
| **(was C1)** | [ComparisonCTA.tsx:4](frontend/src/components/SolarComparison/ComparisonCTA.tsx#L4) | Placeholder WhatsApp `919876543210` — replacement was reverted by user; left as-is. |

### Still open (HIGH highlights)

- `target="_blank"` without `rel="noopener noreferrer"` on 6 external links: [StartEarning.tsx:29](frontend/src/components/AffiliatePrograms/StartEarning.tsx#L29), [GroupPurchase/Activate.tsx:34-37](frontend/src/components/GroupPurchase/Activate.tsx#L34-L37), [ComparisonCTA.tsx:23](frontend/src/components/SolarComparison/ComparisonCTA.tsx#L23), [AffiliatePrograms/Form.tsx:175](frontend/src/components/AffiliatePrograms/Form.tsx#L175), [FloatingChatBoat.tsx:16](frontend/src/components/common/FloatingChatBoat.tsx#L16). Two of those also misuse Next's `<Link>` with `target="_blank"` instead of plain `<a>`.
- ~41 unstructured `console.error` calls site-wide — no error tracking integration.
- No security headers in `next.config.ts` (also Sec C5).
- `next.config.ts` has hardcoded `https://www.flarize.com` in ~40 metadata blocks → should be `process.env.NEXT_PUBLIC_SITE_URL`.

### Still open (MEDIUM highlights)

- Mixed file naming: `JsonLD.tsx`, `Services.tsx`, `Header.tsx` (PascalCase) vs `home.tsx`, `certified-by.tsx`, `userOfferTimer.tsx`, `Solar-steps-nogsap.tsx` (kebab/camel).
- 10 files > 300 lines: `ComparisonTable.tsx` (740), `FaqMain.tsx` (726), `Page4Content.tsx` (579), `Page3Content.tsx` (540), `SolarComparisonMain.tsx` (477), `FilterSidebar.tsx` (475), `AdvanceVehicleManager.tsx` (472), `BlogMain.tsx` (441), `Page10Content.tsx` (440), `Header.tsx` (424).
- No `.env.example` file.
- `package.json` version still `0.1.0`.
- Carousels have no `aria-live` for screen readers.
- Calculator forms use `aria-label` instead of `<label htmlFor>` pairs.
- ~30 magic numbers in calculator/financial code.

---

## Prompt 5 — UI Consistency & Responsive

**Result:** 6 HIGH, 9 MEDIUM, 5 LOW. **Nothing fixed this session** — presented for design review.

### HIGH — Open

| # | Location | Issue |
|---|---|---|
| P5-H1 | Site-wide | Primary teal fragmented: `#123532` (256 uses), `#074A4D` (36), `#124944` (16), `#183C39` (4), `#0D2B23` (4). Consolidate to 2 tokens. |
| P5-H2 | [HeroHome.tsx:33](frontend/src/components/Home/HeroHome.tsx#L33), [Testimomial.tsx:171](frontend/src/components/Home/Testimomial.tsx#L171), [Solar-steps-nogsap.tsx:101](frontend/src/components/Home/Solar-steps-nogsap.tsx#L101), [Services.tsx:16](frontend/src/components/Services.tsx#L16) | Section vertical padding *shrinks* on `xl` (e.g. `py-10 xl:py-8`). |
| P5-H3 | [Services.tsx:24](frontend/src/components/Services.tsx#L24) | `grid-cols-2 sm:grid-cols-2 lg:grid-cols-5` — 5 cols hits at lg with no md transition. |
| P5-H4 | Multiple files | `xl:px-36` (144px) used as section padding — should be `xl:px-8`. |
| P5-H5 | Quotation pages, [LegalHero.tsx:22](frontend/src/components/LegalHero.tsx#L22) | Hardcoded `text-[22px]`, `text-[28px]`, `text-[64px]` — not responsive. |
| P5-H6 | [Group-purchase.tsx:44](frontend/src/components/Home/Group-purchase.tsx#L44) | Gap chain includes `xl:gap-x-1` (1px = unusable). |

### MEDIUM/LOW summary

- Body text uses `#444444`, `#666666`, `text-gray-600`, `#4B5563`, `#6B7280` interchangeably.
- 6 cream/off-white background colors for the same surface role.
- 6 brand-yellow variants — consolidate to `#F7BA41` (+ `#e6a73a` hover).
- `@heroicons/react` UserGroupIcon used only twice; rest of site uses `lucide-react`.
- Buttons too small for mobile a11y on a few CTAs (`px-5 py-2` ≈ 40×32px).
- CTA hover colors inconsistent: `hover:bg-[#e6a73a]` vs `hover:bg-yellow-500` vs `hover:bg-[#E5A930]`.
- Card border-radius mixes `rounded-2xl` and `rounded-[20px]` (same look, inconsistent code).
- Shadows mix Tailwind scale with custom hex values.

### Standardization recommendations

**Section heading (h2):**
```
text-4xl md:text-5xl font-semibold leading-tight text-[#123532] mb-8
```

**Section description (p):**
```
text-base md:text-xl font-normal leading-relaxed text-[#444444]
```

**Section container:**
```
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```
(Drop all `xl:px-36`.)

**Section vertical padding:**
```
py-10 md:py-16 lg:py-20
```

**Card:**
```
bg-white rounded-2xl shadow-md p-6
```

**Tailwind color tokens (paste-ready):**
```ts
brand:   { primary: '#123532', accent: '#074A4D' }
text:    { primary: '#123532', body: '#444444', muted: '#666666' }
cta:     { primary: '#F7BA41', hover: '#e6a73a' }
surface: { default: '#F7F7F2', warm: '#FEF3E8', faq: '#F6F2EF' }
status:  { success: '#16A34A', warning: '#ED8723' }
```

---

## Build Cleanup (separate from prompts)

After the prompt-driven fixes, `npm run build` had been emitting 11 `react-hooks/exhaustive-deps` warnings and a workspace-root warning. All cleared:

| Fix | File | Change |
|---|---|---|
| Workspace root | [next.config.ts](frontend/next.config.ts) | Added `outputFileTracingRoot: path.join(__dirname)` |
| Testimonial hooks ×3 | [Testimomial.tsx](frontend/src/components/Home/Testimomial.tsx) | Removed `testimonials.length` from 3 dep arrays (module-level constant) |
| Review hooks ×3 | [Flarize-review.tsx](frontend/src/components/subsidy/Flarize-review.tsx) | Removed `reviews.length` from 3 dep arrays |
| PDF gen deps | [QuotationPdfGenerator.tsx:151](frontend/src/components/Quotation/QuotationPdfGenerator.tsx#L151) | Removed `data.customerName` and `quoteNo` (unused in callback) |
| panelIds dep | [comparison-table/page.tsx:20](frontend/src/app/comparison-table/page.tsx#L20) | Wrapped parse in `useMemo([searchParams])` |
| currentDate dep | [quotation/page.tsx:65-70](frontend/src/app/quotation/page.tsx#L65-L70) | Moved date construction inside the effect |
| Device validate | [AdvanceDeviceManager.tsx:119-138](frontend/src/components/AdvanceCalculator/AdvanceDeviceManager.tsx#L119-L138) | Wrapped `validateDeviceInputs` in `useCallback([newDevice])` |
| Vehicle validate | [AdvanceVehicleManager.tsx:240-254](frontend/src/components/AdvanceCalculator/AdvanceVehicleManager.tsx#L240-L254) | Wrapped `validateVehicleInputs` in `useCallback([newVehicle])` |

**Result:** `npm run build` → exit 0, zero warnings, 37 routes generated, sitemap emitted.

> Note: the earlier `[turbopack]_runtime.js` crash was caused by stale `.next/` artifacts from `next dev --turbopack`. A `prebuild` script that runs `rm -rf .next` would prevent recurrence.

---

## Deployment-Blocker Punch List

Ordered by what must clear before shipping:

1. **Rotate Twilio + DB + Django secrets** (P2-C1). Scrub `goldenray-backend/.env` from git history with `git-filter-repo`. Add `.env` to `.gitignore`.
2. **Replace production placeholders** (P4-C1, P4-C2, P4-C3, and P4-C(WhatsApp)): `proposalBy = "XXX"`, bank A/C, IFSC, WhatsApp number `919876543210`.
3. **Add `src/app/error.tsx` and `src/app/not-found.tsx`** (P4-C5, P4-C6).
4. **Add security headers** in `next.config.ts` (P2-C5 / P4): CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
5. **Remove `console.log` of OTP responses** in [QuotePopup.tsx:46, :51](frontend/src/components/SolarCalculator/QuotePopup.tsx#L46) (P2-C4 / P3-H5).
6. **Add OTP / Lead-collection input validators + rate limiting** (P2-C2, P2-C3, P2-H4).
7. **Sanitize backend error responses** — never return raw `str(e)` (P2-H6).
8. **Add `rel="noopener noreferrer"` to 6 external links** (P4-H), and replace misused `<Link target="_blank">` with `<a>` (2 sites).
9. **Compress `/public` PNGs to WebP/AVIF** with responsive variants (P3-C4).
10. **Move backend URL to env var** + add `.env.example` documenting all required variables.

---

## What's Already Solid

- TypeScript strict mode on; zero `: any` casts; no `@ts-ignore` / `@ts-expect-error`.
- `tsc --noEmit` and `next build` both pass cleanly.
- Most images use `next/image`; CDN hosts whitelisted in `remotePatterns`.
- `sitemap.xml`, `robots.txt`, favicon, apple-icon, OG image all present.
- Fonts via `next/font` (DM Sans Google + Switzer local) with `display: swap`.
- No hardcoded API keys / secrets in frontend source.
- Blog uses Strapi with ISR (`revalidate: 3600`) — proper SSR.
- All audits operate in a single codebase that compiles and ships routes; the issues are layered concerns, not architectural impasses.

---

*End of report. Generated 2026-05-18.*
