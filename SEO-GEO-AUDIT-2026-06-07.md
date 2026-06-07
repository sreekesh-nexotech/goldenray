# Technical SEO & GEO Audit — Flarize / GoldenRay

**Date:** 2026-06-07
**Branch / Commit:** `claude/inspiring-edison-nbk8w` @ `0f6aa66`
**Scope:** `frontend/` (Next.js 15.5.9 App Router + React 19 + Tailwind 4) and `goldenray-backend/` (Django 5.2 + DRF 3.16)
**Reference:** *Technical SEO & GEO Implementation Guide — Next.js + BunnyCDN + Django DRF (2025–2026)*
**Method:** Static repository audit (config, App Router metadata/rendering, structured data, robots/sitemap, image pipeline, Django caching/security). Live‑site signals (CrUX field data, BunnyCDN pull‑zone toggles, GSC/BWT) could not be measured from the repo and are flagged as *verify‑in‑prod*.

---

## TL;DR — Scorecard

| Bucket | Count | One‑line headline |
|---|---|---|
| 1 · Very Critical | 2 | JSON‑LD injects external CMS data without escaping `<` (XSS + breaks schema); committed insecure secret/DB defaults with fail‑open DEBUG |
| 2 · Critical | 4 | No security headers in `next.config`; `aggregateRating` with no reviews; indexable **mock/placeholder** content; **zero** backend caching |
| 3 · High Priority | 6 | CSR comparison tables hidden from AI crawlers; thin `BlogPosting` schema (no dates/author/image); GTM `beforeInteractive`; static build‑time sitemap; Bunny Optimizer not wired; weak `Organization`/no `WebSite` schema |
| 4 · Low Priority | 7 | Fake `lastmod`; no AI‑bot/scraper robots policy; oversized public images; placeholder `sameAs`; brand‑name drift; no tag‑based revalidation; minor Django/index hardening |
| 5 · Good to Have | 6 | IndexNow; CWV field reporting; dead metadata pipeline; missing JSON‑LD on `/resources` & `/projects`; Lighthouse CI |

**Overall posture:** The frontend foundation is **strong** — App Router with Server Components by default, ISR + `generateStaticParams` on the real blog, per‑page `generateMetadata` with canonicals, `next/font`, `next/image` everywhere with `priority`/`sizes` on the hero. The damage is concentrated in **(a) two security defects, (b) structured‑data correctness/completeness, (c) indexable placeholder content, and (d) a backend with no caching layer.** None of these require a re‑architecture; most are config‑ or data‑level fixes.

---

## Stack Snapshot (as built vs. guide)

| Area | Guide expectation | This repo |
|---|---|---|
| Rendering | RSC/SSG/ISR, never CSR for indexable content | RSC default ✓; blog ISR ✓; **2 comparison tables are `"use client"`** ✗ |
| Metadata | `metadataBase`, `generateMetadata`, per‑page canonical, title template | All present ✓ (29 routes) |
| Sitemap/robots | Native `app/sitemap.ts` + `app/robots.ts`, dynamic discovery, AI‑bot policy | `next-sitemap` (build‑time static) ✗ partial; no AI‑bot policy |
| Structured data | Escaped JSON‑LD; Org+WebSite in root; Article w/ author/dates/image | `JsonLD` **unescaped** ✗; Org minimal, no WebSite ✗; Article thin ✗ |
| Image/CDN | Bunny Optimizer custom loader, `expireTime`, AVIF/WebP | Bunny hostnames in `remotePatterns` only; **no custom loader / `expireTime` / `formats`** ✗ |
| Core Web Vitals | INP/LCP/CLS hygiene; defer 3rd‑party | `next/font` ✓, hero `priority`/`sizes` ✓; **GTM `beforeInteractive`** ✗ |
| Django (origin) | Redis cache, `Cache-Control`/ETag, indexes, IndexNow | **No `CACHES`, no cache headers, no IndexNow** ✗ |
| Security headers | HSTS/CSP/nosniff/frame/referrer in `next.config` | **None at Next layer** ✗ (Django prod block ✓) |

---

## Severity legend

> Mapping to the five requested buckets. Severity reflects **blast radius × likelihood × how live it is today**, judged against the reference guide.

1. **Very Critical** — active security exposure or a defect that silently breaks indexable output. Fix now.
2. **Critical** — materially harms indexing/quality/performance or risks a structured‑data policy action. Fix this sprint.
3. **High Priority** — meaningful SEO/GEO/CWV loss; not breaking but costing visibility. Fix next.
4. **Low Priority** — correctness/hygiene; small individual impact.
5. **Good to Have** — upside/insurance with no downside.

---

## 1 · VERY CRITICAL

### VC‑1 — JSON‑LD renders external CMS data without escaping `<` (XSS + invalid schema)
- **Guide §4** ("Escape `<` to `<` to prevent XSS injection").
- **Evidence:** `frontend/src/components/JsonLD.tsx:5`
  ```tsx
  dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}   // no .replace(/</g, "\\u003c")
  ```
  Used on the blog article page with data sourced from the **Strapi CMS** (`https://blog.flarize.com/api`): `getArticleSchema({ title, excerpt, … })` in `frontend/src/app/blog/[id]/page.tsx:82-95` feeds `article.title` / `article.description` straight in.
- **Why it matters:** (1) **Security** — any `</script>` or markup in a CMS field (a malicious/compromised author, or pasted HTML) executes in the page. (2) **SEO correctness** — even benign content like `"5kW < 10kW"` produces malformed `<script type="application/ld+json">`, so Google/AI parsers **silently drop the schema** for your most important GEO content type (articles). This is the exact failure the guide calls out.
- **Fix:** `JSON.stringify(data).replace(/</g, "\\u003c")` in `JsonLD.tsx` (one line; fixes every call site at once).

### VC‑2 — Committed insecure secret/DB defaults + fail‑open DEBUG
- **Guide §8** (Security & hygiene), Django section.
- **Evidence:** `goldenray-backend/backend/backend/settings.py`
  - `:19` `SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "django-insecure-7d3%3x#…")` — committed insecure fallback.
  - `:22` `DEBUG = ENVIRONMENT != "production"` — **fail‑open**: if `DJANGO_ENV` is unset/typo'd, `DEBUG=True` in production.
  - `:76` `"PASSWORD": os.getenv("DB_PASSWORD", "admin123")` — committed default credential.
- **Why it matters:** A missing env var ships a world‑known `SECRET_KEY` (session/JWT‑signing forgery, tamperable signed cookies) **and** full DEBUG tracebacks (source, settings, SQL disclosure). `.env` itself is correctly git‑ignored (`.gitignore:135`), so the fallbacks *are* the leaked secret. Fail‑open is the dangerous part.
- **Fix:** Make secrets mandatory in prod — `SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]` (no default) and default `DEBUG=False`, opting *into* dev explicitly (`DEBUG = os.getenv("DJANGO_DEBUG") == "1"`). Remove the `admin123` fallback.

---

## 2 · CRITICAL

### C‑1 — No security/response headers at the Next.js layer
- **Guide §8** (HSTS, `X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`, `Permissions-Policy`, CSP via `next.config` `headers()`).
- **Evidence:** `frontend/next.config.ts` has `redirects()` but **no `headers()`** (confirmed: no `headers(`, `formats`, `loader`, or `expireTime` keys). Already raised in `AUDIT-RESULTS-2026-05-18.md` and **still open**.
- **Why it matters:** No HSTS preload, no clickjacking/MIME‑sniffing protection, no Referrer/Permissions policy on the public renderer. These are baseline trust/safety signals and a Lighthouse "Best Practices" drag.
- **Fix:** Add an `async headers()` block returning the six headers for `/(.*)`; start CSP in `Content-Security-Policy-Report-Only`.

### C‑2 — `aggregateRating` published with no `review` nodes (structured‑data policy risk)
- **Guide §4** (Product/LocalBusiness rich results).
- **Evidence:** `frontend/src/data/jsonld.ts:20-24` — `localBusinessSchema` declares `aggregateRating { ratingValue: "4.9", reviewCount: "300" }` with **no `review` array** anywhere and no on‑page reviews backing it.
- **Why it matters:** Google requires ratings to be sourced/visible on the page; a self‑asserted star rating with no reviews is commonly **ignored** and, at worst, draws a **structured‑data manual action**. It's your homepage entity schema, so the blast radius is the whole site's brand entity.
- **Fix:** Either attach real `review` items (with `author`, `reviewRating`, `datePublished`) sourced from genuine reviews, or remove `aggregateRating` until reviews are surfaced on‑page.

### C‑3 — Indexable **mock/placeholder** content (fake case studies & a second blog)
- **Guide §1, §7** (server‑render *real* content; E‑E‑A‑T; topical authority).
- **Evidence:**
  - `frontend/src/app/projects/[id]/page.tsx:8,20` renders from `@/data/Mock-projects` (`Mock-projects.ts`, 15 KB of fabricated case studies). `/projects` is in the **main nav** (`Header.tsx:43`) and **footer** (`Footer.tsx:18`) → fully crawlable.
  - `frontend/src/app/resources/[id]/page.tsx:2-7` renders from `@/data/Mock-Resources`; the page body is only a `ResourceDetailHero` (title/date) — **thin content, no article body, no JSON‑LD**. This is a *second* blog system competing with the real Strapi `/blog`.
- **Why it matters:** Publishing fabricated/thin pages under your brand is the strongest negative E‑E‑A‑T/quality signal in the guide, and it can demote the whole domain in both classic search and AI citation. Project case studies are exactly the original, first‑party content GEO rewards — wasted as mock data.
- **Fix:** Back `/projects` with real data (DRF `customer_installation`/installations or Strapi) and either consolidate `/resources` into `/blog` or remove it. Until real, `noindex` the mock routes.

### C‑4 — Backend has **no caching layer** (TTFB → LCP; nothing edge‑cacheable)
- **Guide §6** (Redis cache; `Cache-Control`/`s-maxage`/`stale-while-revalidate`; ETag/Last‑Modified; TTFB < 200 ms).
- **Evidence:** `settings.py` defines **no `CACHES`**; `requirements.txt` has **no `redis`/`django-redis`/`hiredis`**. No `cache_page`, `cache.get_or_set`, `ConditionalGetMiddleware`, ETag, or `Cache-Control` anywhere in `goldenray/` (only `@never_cache` in the internal `bom` dashboard). Public reads (`solar_panel_views.py`, `solar_inverter_views.py`, etc.) are unauthenticated GETs (`@non_authenticated_view`) but emit **no cache headers**.
- **Why it matters:** Every request recomputes; the public catalog endpoints can't be cached at Bunny's edge, and direct client fetches (the comparison tables, calculators) hit the origin uncached on every interaction. TTFB feeds directly into LCP.
- **Fix:** Add a Redis `CACHES` block (+`hiredis`), `cache_page`/low‑level cache on read‑heavy public viewsets, emit `Cache-Control: public, s-maxage=300, stale-while-revalidate=3600` + `Vary: Accept, Authorization` on anonymous GETs, and enable `ConditionalGetMiddleware` for ETag/304.

---

## 3 · HIGH PRIORITY

### H‑1 — Client‑rendered comparison tables hide extractable data from AI crawlers
- **Guide §1, §7** (never CSR indexable content; tables are prime extractable GEO blocks; GPTBot/ClaudeBot/PerplexityBot don't run JS).
- **Evidence:** `frontend/src/app/comparison-table/page.tsx:1` and `inverter-comparison-table/page.tsx` are `"use client"`; the panel/inverter rows are fetched in `useEffect` (`getAllPanels`/`getPanelsByIds`). Both URLs **are in the sitemap** (`public/sitemap-0.xml`) and have indexable metadata (their `layout.tsx`) — so they're indexed but the spec table itself is invisible to non‑JS bots. (Server‑rendered siblings `/solar-comparison` and `/inverter-comparison` exist, which softens but doesn't remove the loss.)
- **Fix:** Render the table from a Server Component (fetch on the server, hydrate interactivity on top), or server‑render the full panel set and filter client‑side.

### H‑2 — `BlogPosting` schema is incomplete (no `datePublished`/`image`, generic author, no E‑E‑A‑T link)
- **Guide §4, §7** (`headline`, `author` linked `Person` w/ `url`, `datePublished` **and** `dateModified`, `image`, `publisher`; author bio drives AI citation).
- **Evidence:** `frontend/src/data/jsonld.ts:103-124` — `getArticleSchema` emits only `dateModified` (no `datePublished`), **no `image`**, and `author: { name: "Flarize Solar Team" }` with no `url`. The page already loads real `content.author` / `content.reviewedBy` (`blog/[id]/page.tsx:108-109`) but **doesn't pass them into the schema**.
- **Why it matters:** Articles are your top GEO surface; author + dates + image are the cheap, high‑signal fields AI engines lean on. The data already exists in the component — it's just not in the schema.
- **Fix:** Extend `getArticleSchema` to take `author` (linked `Person` with a `/authors/{slug}` URL), `datePublished`, `image`, and (optionally) `reviewedBy`.

### H‑3 — Google Tag Manager loads with `strategy="beforeInteractive"`
- **Guide §2, §3** ("Never put third‑party tags in `app/layout.tsx <head>` synchronously"; use `afterInteractive`/`lazyOnload`; INP is the most‑failed metric).
- **Evidence:** `frontend/src/app/layout.tsx:131-148` injects GTM via `<Script id="gtm" strategy="beforeInteractive" …>` inside `<head>`.
- **Why it matters:** `beforeInteractive` blocks hydration and runs GTM (and everything it injects) before the page is interactive — a direct INP/LCP tax on every route.
- **Fix:** Switch to `strategy="afterInteractive"` (default) or `lazyOnload`; consider `@next/third-parties`'s `GoogleTagManager` (already a dependency).

### H‑4 — Sitemap is build‑time static; dynamic routes missing / real pages excluded
- **Guide §2, §5** (native `app/sitemap.ts`, dynamic discovery via `getAllSlugs()`, accurate coverage).
- **Evidence:** Generated by `next-sitemap` post‑build (`next-sitemap.config.js`). `/resources/[id]` and `/projects/[id]` never appear; `/resources`, `/subsidy`, `/industrial`, `/advanced-calculator` are in `exclude` (some by intent, but `/resources` is then orphaned even though `/solar-blog` 301‑redirects to it). No `app/sitemap.ts` means new dynamic content only enters the sitemap on the next deploy.
- **Why it matters:** Dynamic/CMS‑driven pages depend on a rebuild to be discovered; excluded real pages get no sitemap signal.
- **Fix:** Move to native `app/sitemap.ts` that `await`s real slugs (blog via Strapi, projects/resources via their source) so coverage tracks content, not builds.

### H‑5 — BunnyCDN Optimizer not wired (paying for Bunny, using the default Next optimizer)
- **Guide §3** (`images.loader: 'custom'` + `loaderFile` → Bunny `?width/quality/format`; set `expireTime: 3600`; AVIF/WebP).
- **Evidence:** `frontend/next.config.ts` lists Bunny hostnames in `images.remotePatterns` but defines **no** `images.loader`/`loaderFile`, **no** `expireTime`, and **no** `images.formats`.
- **Why it matters:** Images route through the Next.js optimizer (origin compute) instead of Bunny's edge Optimizer you're paying for; without `expireTime`, ISR responses don't emit an explicit `stale-while-revalidate` delta for Bunny; no AVIF.
- **Fix:** Add the `bunny-image-loader.ts` custom loader, `expireTime: 3600`, and `formats: ['image/avif','image/webp']` (or request AVIF explicitly per the guide's Bunny caveat).

### H‑6 — `Organization` schema is minimal & home‑only; no `WebSite` + `SearchAction`
- **Guide §4** (`Organization` with `sameAs[]` + `contactPoint` in the **root layout**; `WebSite` with `potentialAction: SearchAction`).
- **Evidence:** `frontend/src/data/jsonld.ts:33-41` — `Organization` has `name/url/logo/foundingDate/areaServed` only (**no `sameAs`, no `contactPoint`**). It's rendered only on the homepage (`app/page.tsx:59`), not the root layout. There is **no `WebSite` schema** anywhere.
- **Why it matters:** The brand‑entity graph (the strongest durable GEO signal per §7) is under‑specified and not site‑wide; no sitelinks search box eligibility.
- **Fix:** Enrich `Organization` (add `sameAs`, `contactPoint`), add a `WebSite` schema with `SearchAction`, and render both from `app/layout.tsx` so every page carries them.

---

## 4 · LOW PRIORITY

### L‑1 — `lastmod` is the build timestamp for every URL
`next-sitemap.config.js` `transform()` sets `lastmod: new Date().toISOString()` for *all* paths → every URL shows the same fake "modified now" on each deploy. Use real content `dateModified`. (Guide §5/§7.)

### L‑2 — robots.txt has no AI‑bot policy and blocks no abusive scrapers
`public/robots.txt` is `User-agent: *` allow‑all (which *does* permit OAI‑SearchBot/PerplexityBot/etc., matching the guide default) but there's no explicit AI tier listing and **no `Bytespider`/`CCBot` disallow**. Low impact, but add the explicit policy when moving to `app/robots.ts`. (Guide §5.)

### L‑3 — Oversized source images in `/public`
`ourSolutions1.png` is **9.2 MB**; `Residential-4.png` 1.4 MB; several 0.8–1 MB PNGs. Even via `next/image`, these bloat the repo and the first optimization pass. Pre‑compress/convert to WebP/AVIF. (Guide §3.)

### L‑4 — Placeholder / unverified `sameAs` social URLs
`jsonld.ts:25-29` carries `https://www.facebook.com/flarize` with a literal `// UPDATE with real URLs` comment and guessed LinkedIn/IG handles. Wrong `sameAs` pollutes the entity graph — verify or remove. (Guide §7.)

### L‑5 — Brand‑name drift across schemas
`LocalBusiness.name = "Flarize Solar"` (`alternateName: "Golden Ray Renewable Energy"`) vs `Organization.name = "Flarize Technologies Private Limited"`. Pick one canonical legal name + consistent `alternateName` for entity disambiguation. (Guide §7.)

### L‑6 — No tag‑based revalidation / purge webhook
`blogApiService.ts` fetches use time‑only `next: { revalidate: 3600 }` (no `tags`), and there's no Django `post_save` → `/api/revalidate` → `revalidateTag()` + Bunny purge flow. Content edits wait up to an hour and never purge the edge. (Guide §3/§6.)

### L‑7 — Minor Django hardening & query indexes
`settings.py` sets prod HSTS/SSL/secure cookies ✓ but omits `SECURE_CONTENT_TYPE_NOSNIFF`/`SECURE_REFERRER_POLICY`. Filterable fields on `SolarPanel`/`SolarInverter` (`panel_type`, `overall_rating`, `efficiency`, `brand`) have no `db_index` despite being filtered in `solar_panel_views.py`. (Low real impact given tiny catalog tables.) (Guide §6/§8.)

---

## 5 · GOOD TO HAVE

- **G‑1 · IndexNow** — not implemented. 15‑min Django hook on publish/update/delete → Bing/Yandex/Naver/Seznam/Yep (feeds Copilot/ChatGPT index). Pure upside. (Guide §5/§7.)
- **G‑2 · CWV field reporting** — no `useReportWebVitals`/`web-vitals`; only GA pageviews via `PageTracker`. Wire field LCP/INP/CLS to analytics for real p75. (Guide §9.)
- **G‑3 · Dead metadata pipeline** — `frontend/src/services/metadataService.ts` + Django `Metadata` model/endpoint are unused by any route. Either wire DRF‑driven metadata or delete the dead code. (Guide §2.)
- **G‑4 · JSON‑LD on `/resources` & `/projects` detail** — both detail routes emit **no** structured data and no `generateStaticParams` (add `Article`/`CreativeWork`/`Project` once real). (Guide §4.)
- **G‑5 · Lighthouse CI + budgets** — none in pipeline; add CI gates on LCP/INP/CLS/JS size to prevent regressions. (Guide §9.)
- **G‑6 · `llms.txt`** — **already shipped** and well‑formed (`public/llms.txt`, entity‑definition intro + Q&A). Keep auto‑generating; no further investment needed (guide marks it optional/unproven). ✓

---

## What's already compliant (don't regress these)

- **Rendering:** Server Components by default; real blog uses ISR (`revalidate = 3600`), `generateStaticParams` from the API, and `dynamicParams = true` for new slugs (`blog/[id]/page.tsx:20-30`).
- **Metadata:** `metadataBase` + `title.template` in root (`layout.tsx:70-75`); per‑page `generateMetadata`/`metadata` with absolute `alternates.canonical` on ~all 29 routes; OG/Twitter cards set.
- **Fonts/Images:** `next/font` (Google `DM_Sans` + self‑hosted `Switzer`) with `display: swap`; **no raw `<img>`** — all `next/image`; hero has `priority` + correct `sizes` (`HeroHome.tsx:79-80`); 14 components use `priority`.
- **Routing hygiene:** Permanent (301) `redirects()` for legacy URLs (`next.config.ts`); `error.tsx` + `not-found.tsx` present; `useSearchParams` wrapped in `<Suspense>` on the client tables.
- **Crawl:** `robots.txt` allows AI search/retrieval bots (guide's default); `llms.txt` shipped.
- **Backend security (prod path):** HSTS (1y, preload, subdomains), `SECURE_SSL_REDIRECT`, secure cookies, scoped CORS/CSRF origins, DRF throttling on `affiliate_application`/`warranty_service_request`; some `db_index` on PII/lookup fields.

---

## Per‑guide‑section coverage matrix

| § | Topic | Status | Key gaps (IDs) |
|---|---|---|---|
| 1 | App Router rendering | 🟡 Mostly | CSR tables (H‑1), mock content (C‑3) |
| 2 | Metadata API | 🟢 Good | sitemap static (H‑4), dead metadata svc (G‑3) |
| 3 | Core Web Vitals | 🟡 Mostly | GTM `beforeInteractive` (H‑3), big images (L‑3) |
| 3 | BunnyCDN/image | 🔴 Gaps | no loader/`expireTime`/AVIF (H‑5); pull‑zone toggles *verify‑in‑prod* |
| 4 | Structured data | 🔴 Gaps | unescaped (VC‑1), rating‑no‑reviews (C‑2), thin Article (H‑2), weak Org/no WebSite (H‑6) |
| 5 | Crawlability/indexing | 🟡 Mostly | static sitemap (H‑4), fake `lastmod` (L‑1), robots policy (L‑2), IndexNow (G‑1) |
| 6 | Django backend | 🔴 Gaps | no cache layer (C‑4), no revalidate webhook (L‑6), indexes (L‑7) |
| 7 | GEO / AI citation | 🟡 Mostly | E‑E‑A‑T author (H‑2), mock content (C‑3), entity drift (L‑4/L‑5) |
| 8 | Security & hygiene | 🔴 Gaps | secrets/DEBUG (VC‑2), no Next headers (C‑1) |
| 9 | Monitoring | 🟡 Partial | no CWV field (G‑2), no Lighthouse CI (G‑5) |

Legend: 🟢 good · 🟡 mostly compliant with gaps · 🔴 significant gaps.

---

## Relationship to prior audits

`AUDIT-RESULTS-2026-05-18.md` (general QA: state/security/perf/quality/UI) overlaps on two items that remain **open** and are re‑confirmed here: **no security headers in `next.config.ts`** (→ C‑1) and **insecure backend secrets** (→ VC‑2; note `.env` is *not* tracked — the risk is the committed *fallback defaults* in `settings.py`). This report is narrower and deeper on the **SEO/GEO/structured‑data/CDN/caching** axes of the reference guide.

---

## Suggested remediation order

1. **VC‑1** (one‑line escape) and **VC‑2** (mandatory secrets, default `DEBUG=False`) — minutes, high payoff.
2. **C‑1** (`headers()`), **C‑2** (drop/justify `aggregateRating`) — fast, removes policy/trust risk.
3. **C‑3** (noindex mock routes now; plan real data) and **C‑4** (Redis + cache headers) — biggest quality/perf wins.
4. **H‑2/H‑6** (schema completeness — data already in hand), **H‑3** (GTM strategy), **H‑5** (Bunny loader/`expireTime`).
5. **H‑1/H‑4**, then the Low/Good‑to‑have backlog (IndexNow, CWV field data, Lighthouse CI).

*Items marked verify‑in‑prod (BunnyCDN pull‑zone toggles, CrUX p75, GSC/BWT coverage) require live access and are out of scope for this static repository audit.*
