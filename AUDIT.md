# Next.js Codebase Audit Guide

A set of structured prompts for running a complete QA audit on this Next.js + TypeScript + Tailwind project using Claude Code.

---

## How to Use

1. Open Claude Code in the project root (`goldenray/`)
2. Run each prompt **in a separate session** so context stays focused
3. Work through the prompts **in order** — Prompt 1 blockers often affect Prompt 3 findings
4. For each issue found, fix it before moving to the next prompt
5. Re-run the relevant prompt after fixes to confirm nothing was missed

**Tip:** If the codebase is large, scope the prompt by appending for example :
```
Focus only on: frontend/src/components/AffiliatePrograms/
```

---

## Prompt 1 — State & Data Fetching Audit

> Finds misplaced client/server boundaries, broken effects, stale closures, and incorrect data fetching patterns.

```
You are a Next.js architect specializing in React state management and data fetching.
Audit this codebase for state and data fetching violations.

### CRITICAL VIOLATIONS
1. useState/useReducer used for server data that belongs in a server component
2. useEffect used to fetch data that should be a Server Component fetch or React Query/SWR
3. Client components ("use client") placed high in the tree unnecessarily, blocking RSC optimizations
4. Mutations (POST/PUT/DELETE) triggered inside useMemo/useCallback without proper invalidation
5. Stale closures in useEffect capturing outdated state without correct dependency arrays
6. Context providers wrapping the entire app for data that only a subtree needs
7. Global state (Zustand/Jotai/Context) storing server data that should stay in URL/server
8. Missing cleanup (return () => ...) in useEffect for subscriptions, intervals, or event listeners
9. Derived state recalculated in render instead of useMemo for expensive computations
10. Form state managed with uncontrolled inputs when validation logic requires controlled state
11. Server Actions called inside useEffect instead of form actions or event handlers
12. setInterval/setTimeout without clearInterval/clearTimeout in useEffect cleanup

### HIGH PRIORITY
13. "use client" directive missing on components using browser APIs (window, document, localStorage)
14. Prop drilling more than 2 levels deep instead of composition or context
15. useState used for URL-synced state (filters, pagination, tabs) instead of useSearchParams
16. Heavy state updates on every keystroke without debounce
17. Multiple related useState calls that should be a single useReducer
18. State initialized from props without handling prop changes (stale initial state bug)
19. useEffect with empty deps array hiding real dependencies (lint warnings suppressed)
20. Client components fetching data on mount when the page could be a Server Component

### OUTPUT FORMAT
For each issue found:
1. **File Path** (relative to project root)
2. **Severity**: CRITICAL | HIGH | MEDIUM
3. **Issue Description**: What is wrong and why it breaks correctness or performance
4. **Code Snippet**: Show the problematic code with line numbers
5. **Fix**: Corrected code example
6. **Impact**: Describe what fails or degrades if left unfixed

### AUDIT SCOPE — check in this order
1. All files with "use client" directive
2. All files using useEffect, useState, useContext
3. All files in /components/ that fetch data
4. All files in /app/ (layout.tsx, page.tsx, loading.tsx)
5. All custom hooks in /hooks/

### DELIVERABLES
1. **Executive Summary**: total files reviewed, critical count, high count, top 3 systemic problems
2. **Detailed Issue Log**: every issue with severity, location, fix
3. **Component Tree Analysis**: which "use client" boundaries are misplaced
4. **Technical Debt Score**: 1-10 (10 = excellent), justified

Start audit now.
```

---

## Prompt 2 — Security & Environment Audit

> Finds exposed secrets, insecure auth flows, missing security headers, and open redirect vulnerabilities.

```
You are a Next.js security architect. Audit this codebase for security vulnerabilities,
environment variable exposure, and authentication flow correctness.

### CRITICAL VIOLATIONS
1. NEXT_PUBLIC_ prefix on secrets (API keys, DB URIs, service role keys) — exposed to browser
2. Environment variables accessed with process.env inside client components without NEXT_PUBLIC_
3. API routes missing authentication/session checks before returning sensitive data
4. API routes missing input validation/sanitization (potential injection)
5. Auth token stored in localStorage instead of httpOnly cookies
6. Hardcoded credentials, API keys, or secrets anywhere in source code
7. .env files committed to git (check .gitignore)
8. dangerouslySetInnerHTML used with user-supplied or external content (XSS risk)
9. CORS headers on API routes set to wildcard (*) without intent
10. Logout flow missing: session/token invalidation on server
11. Logout flow missing: client-side state/cache clear
12. Auto-login without server-side token validation (trusting client storage blindly)
13. next.config.js missing security headers (X-Frame-Options, CSP, HSTS, etc.)
14. Redirect targets not validated (open redirect vulnerability)
15. User A's data accessible to User B after account switch (missing scope isolation)

### HIGH PRIORITY
16. Firebase/Supabase service role key used in client-side code
17. API routes not rate-limited for auth endpoints (login, OTP, password reset)
18. Error messages leaking stack traces or internal paths to the browser
19. Images from external domains not restricted in next.config.js remotePatterns
20. Form submissions without CSRF protection on non-SameSite cookie setups
21. Sensitive data (tokens, OTPs, passwords) appearing in console.log statements
22. fetch() calls to external APIs made from client without a proxy API route (key exposure)
23. Firebase listeners/subscriptions not unsubscribed on logout

## SPECIAL FOCUS — trace these complete flows
- **Logout flow**: list every step — session clear, cookie delete, cache invalidate, redirect
- **Auto-login flow**: list every validation check before trusting stored credentials
- **Account switch flow**: confirm previous user data is wiped before loading new user

## SECURITY HEADERS CHECK
Inspect next.config.js for:
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security
- Referrer-Policy
- Permissions-Policy

## ENVIRONMENT VARIABLE INVENTORY
List all process.env references:
- Variable name
- File where used
- Server-only or client-exposed (NEXT_PUBLIC_)?
- Contains secret? (Y/N)

## OUTPUT FORMAT
For each violation:
**File:** path/to/file.ts:line_number
**Severity:** CRITICAL | HIGH
**Security Risk:** [Describe the attack vector and impact]
**Code:**
[Show problematic code]
**Fix:**
[Show corrected code]

Start audit now.
```

---

## Prompt 3 — Performance & Bundle Audit

> Finds Core Web Vitals risks, unoptimized images, bloated bundles, and missing caching strategies.

```
You are a Next.js performance architect. Audit this codebase for rendering performance,
Core Web Vitals issues, bundle bloat, and image optimization problems.

### CRITICAL VIOLATIONS
1. <img> tags used instead of next/image (missing lazy load, size optimization, modern formats)
2. Large data fetches (lists, tables) without pagination, virtualization, or streaming
3. Heavy synchronous operations (sorting, filtering, parsing) inside render/component body
4. Fonts loaded via <link> from Google Fonts instead of next/font (layout shift, extra request)
5. Dynamic imports not used for large third-party libraries only needed on interaction
6. API routes doing synchronous file I/O or CPU-heavy work blocking the Node event loop
7. fetch() calls in Server Components without { next: { revalidate } } (no caching strategy)
8. Entire page marked "use client" when only a small interactive island needs it

### HIGH PRIORITY
9. next/image used without explicit width/height or fill (causes layout shift — CLS)
10. Images served from CDN not listed in next.config.js remotePatterns (runtime error or unoptimized)
11. Unoptimized video/image assets >500KB in /public
12. Heavy animations running on the main thread (use CSS transforms/opacity, not layout properties)
13. useEffect fetching data on every render due to missing or wrong dependency array
14. Lists of 50+ items rendered with .map() without react-window or pagination
15. Third-party scripts loaded in <head> without next/script strategy (blocks parsing)
16. Tailwind CSS purge not configured (large unused CSS in production)
17. Missing loading.tsx / Suspense boundaries — entire page waterfalls on slow data

### MEDIUM PRIORITY
18. Unused npm packages in package.json increasing bundle size
19. Dependencies imported as full package instead of subpath (e.g. import _ from 'lodash' vs import debounce from 'lodash/debounce')
20. Multiple packages doing the same job (e.g. two animation libraries, two date libraries)
21. SVG files not optimized (use SVGO or import as React components)
22. Console.log left in production code (minor overhead + information leak)
23. API responses not compressed (missing compression middleware)
24. No <meta> viewport or Open Graph tags (SEO/social performance)

## PERFORMANCE ANALYSIS — run these checks
1. List every <img> tag (should be zero — all must use next/image)
2. List all "use client" files and flag any that don't use hooks or browser APIs
3. List all useEffect hooks with empty dependency arrays — are they justified?
4. Check package.json: identify unused, duplicate, or overweight packages
5. Identify all fetch/axios calls in client components that could move to Server Components
6. Find all .map() renders on arrays and flag those without key={stable_id} or without virtualization

## CORE WEB VITALS RISK ASSESSMENT
For each page route found, assess:
- **LCP risk**: Is the largest element an optimized image? Is data available quickly?
- **CLS risk**: Do images have explicit dimensions? Do fonts use size-adjust?
- **INP risk**: Are event handlers doing heavy sync work?

## DEPENDENCY REPORT
- Total dependencies: X
- Unused dependencies: [list with evidence]
- Packages with better Next.js-native alternatives: [list]
- Packages imported without tree-shaking: [list]

## OUTPUT FORMAT
For each issue:
**File:** path/to/file.tsx:line_number
**Severity:** CRITICAL | HIGH | MEDIUM
**Performance Impact:** [LCP / CLS / INP / Bundle / TTFB — which metric is affected and by how much]
**Code:**
[Show problematic code]
**Fix:**
[Show corrected code]

Start audit now.
```

---

## Prompt 4 — Code Quality & Deployment Readiness Audit

> Checks TypeScript correctness, accessibility, production config, SEO metadata, and deployment hygiene.

```
You are a Next.js code quality auditor. Audit this codebase for production readiness,
TypeScript correctness, accessibility, and deployment hygiene.

### CRITICAL VIOLATIONS
1. TypeScript errors (any 'any' cast hiding real type errors, @ts-ignore without explanation)
2. Missing error boundaries — unhandled errors crash the entire page tree
3. Missing not-found.tsx / error.tsx at the app root (Next.js 13+ App Router)
4. API routes returning 200 for error cases instead of correct HTTP status codes
5. Environment variables required at runtime but not validated at startup (use zod/t3-env)
6. Build failing (next build errors) — check for missing types, bad imports
7. ESLint errors not addressed (run next lint)
8. Hardcoded production URLs, phone numbers, or business data that should be in .env or CMS
9. Debug/test routes or pages accessible in production (/test, /debug, /admin without auth)
10. next.config.js missing for a production deployment (no redirects, no headers, no rewrites)

### HIGH PRIORITY
11. Missing alt text on images (accessibility + SEO violation)
12. Interactive elements (buttons, links) missing accessible labels (aria-label, aria-describedby)
13. Color contrast below WCAG AA standard (especially text on teal/yellow brand colors)
14. Forms missing proper label associations (htmlFor / id pairing)
15. Keyboard navigation broken on custom interactive components (dropdowns, modals, carousels)
16. console.log / console.error statements left in production code
17. TODO / FIXME comments in code shipped to production
18. Magic numbers and hardcoded strings that should be named constants
19. Component files exceeding 300 lines — split into smaller units
20. Repeated logic across components that should be a shared utility or custom hook
21. Missing loading states on async operations (user sees blank/stale UI)
22. Missing empty states on lists (nothing shown when data is empty)

### MEDIUM PRIORITY
23. Inconsistent file naming (some PascalCase, some kebab-case components)
24. Unused imports not removed (clutters files, can cause confusion)
25. Prop types not defined (missing TypeScript interfaces on component props)
26. Default exports mixed with named exports inconsistently across the codebase
27. No Prettier/ESLint config committed — formatting inconsistent across contributors
28. package.json version not updated for the release
29. No CHANGELOG or release notes maintained
30. Metadata (title, description, og:image) missing or generic on key pages

## ACCESSIBILITY AUDIT — check every interactive component
- Does every <button> have visible text or aria-label?
- Does every <input> have a <label> with matching htmlFor/id?
- Does every <img> have a meaningful alt attribute?
- Is focus visible on keyboard navigation?
- Does the carousel (Testimonials.tsx) have aria-live for screen readers?

## DEPLOYMENT READINESS CHECKLIST
Verify each item and mark PASS / FAIL / NOT APPLICABLE:
- [ ] `next build` completes without errors
- [ ] `next lint` reports zero errors
- [ ] TypeScript strict mode enabled in tsconfig.json
- [ ] All required .env variables documented in .env.example
- [ ] Sensitive .env values not committed to git
- [ ] next.config.js defines security headers
- [ ] All images use next/image
- [ ] Favicon and Open Graph images present in /app
- [ ] sitemap.xml / robots.txt configured
- [ ] 404 and 500 custom error pages defined
- [ ] External links use target="_blank" rel="noopener noreferrer"
- [ ] WhatsApp/phone numbers in Form.tsx point to real values (not placeholder)

## OUTPUT FORMAT
For each issue:
**Category:** TypeScript | Accessibility | Code Quality | Deployment | SEO
**Severity:** CRITICAL | HIGH | MEDIUM
**Issue:** [Clear description]
**File:** path/to/file.tsx:line_number
**Fix:** [Concrete action to take]

## DEPLOYMENT READINESS SCORE
Rate 1-10 based on:
- Critical blockers found
- Accessibility compliance
- TypeScript strictness
- Production configuration completeness

## TOP 5 ACTIONS BEFORE DEPLOYMENT
List the 5 highest-impact fixes needed before this ships.

Start audit now.
```

---

## Prompt 5 — UI Consistency & Responsive Design Audit

> Checks that typography, spacing, colors, and Tailwind classes are applied consistently across all components, and that every section is fully responsive across mobile / tablet / desktop breakpoints.

```
You are a professional UI consistency and responsive design auditor for a Next.js + Tailwind CSS project.
Audit this codebase for design system violations and responsiveness gaps.

### PART 1 — TYPOGRAPHY CONSISTENCY

Scan every component file and build a table of all heading and text elements.
For each <h1>, <h2>, <h3>, <h4>, <p>, <span> used as a label or heading, record:
- File path
- Element tag
- Tailwind classes applied (font-size, font-weight, text-color, leading)

Then flag these violations:

1. Section headings (h2) with inconsistent font-size across components
   e.g. one section uses text-3xl xl:text-5xl, another uses text-2xl xl:text-4xl — should be identical
2. Section headings (h2) with inconsistent font-weight
   e.g. font-bold in one component, font-semibold in another for the same visual role
3. Section subheadings (h3) with inconsistent sizing or weight across cards/features
4. Body paragraph text (p) with inconsistent text color
   e.g. text-[#4B5563] in one section, text-[#525252] in another for equivalent body copy
5. Section description paragraphs with inconsistent font-size
   e.g. text-[20px] in one, text-base in another for the same visual hierarchy level
6. Inconsistent line-height (leading-*) on equivalent text elements
7. Different text colors used for the same semantic purpose
   e.g. muted/secondary text using text-[#757575], text-[#B2B2B2], text-[#D1D5DB] interchangeably
8. Heading color inconsistency — brand headings should all use the same dark color token
   e.g. text-[#123532] vs text-[#171717] vs text-[#111827] for primary headings

### PART 2 — SPACING & LAYOUT CONSISTENCY

9. Section vertical padding inconsistent across page sections
   e.g. py-10 md:py-20 xl:py-16 in some, py-12 sm:py-14 md:py-16 in others — pick one pattern
10. Section container classes inconsistent
    e.g. container mx-auto px-4 max-w-7xl in some, mx-auto max-w-7xl px-4 sm:px-6 in others
11. Card internal padding inconsistent across similar card components
    e.g. p-5 in one card, px-6 py-4 in another card of equivalent size
12. Gap between grid/flex children inconsistent for equivalent layouts
    e.g. gap-4 in one 3-col grid, gap-6 in another 3-col grid
13. Border-radius inconsistent across similar card surfaces
    e.g. rounded-xl on some cards, rounded-2xl on others without clear hierarchy reason

### PART 3 — COLOR CONSISTENCY

14. Brand primary color inconsistently referenced
    Check if #074A4D, #074a4d, #0B4740, #045457, #0A5A5D, #0B5559 are all being used
    when they should all map to a single token
15. Brand accent/yellow color inconsistently referenced
    Check if #F7BA41, #F7BA41, #F5B301, #FEF3E8, #FBF6E7 are being mixed for similar purposes
16. Success/green color used inconsistently
    e.g. text-[#16A34A], text-[#15803D], text-[#4ADE80] for semantically identical elements
17. Background surface colors inconsistent across section alternates
    e.g. bg-[#F7F4E6], bg-[#FBF6E7], bg-[#FEF3E8] used as the same cream background
18. Button colors inconsistent for the same button variant across components

### PART 4 — RESPONSIVE DESIGN VIOLATIONS

For every component, verify breakpoint coverage at: mobile (default) → sm:640px → md:768px → lg:1024px → xl:1280px

19. Text that is readable on desktop but too small on mobile (below 12px effective size)
20. Text that does not scale up on large screens (missing xl: or 2xl: size classes)
21. Padding/margin that is too tight on mobile (px-4 or less on a card with dense content)
22. Fixed pixel widths that cause overflow on mobile (width: 400px without max-w or responsive override)
23. Grid layouts that don't collapse properly on mobile
    e.g. grid-cols-3 with no sm:grid-cols-1 or sm:grid-cols-2 fallback
24. Flex rows that wrap poorly on mobile — should use flex-col on small screens
25. Buttons too small to tap on mobile (min touch target: 44×44px — check py and px values)
26. Horizontal scroll introduced on mobile due to fixed-width elements or flex-nowrap
27. Images without responsive sizing — width/height fixed without responsive classes
28. Hidden content on mobile that is critical (hidden sm:block on important body copy)
29. Hero sections with text too large and overflowing on small screens
30. Carousel/scrollable sections missing scroll-snap or touch-friendly swipe behavior
31. Missing lg:hidden / sm:hidden to show mobile-specific vs desktop-specific layouts
32. Modals or overlays that don't fit small screens (fixed-size dialogs)
33. Table layouts not converted to card layout on mobile
34. Icon sizes not scaling with text (icon stays w-6 h-6 while text shrinks to xs)

### PART 5 — COMPONENT-LEVEL CONSISTENCY CHECKS

35. Buttons using the same visual role but different Tailwind classes
    e.g. primary CTA has different padding, radius, or font-weight across pages
36. Badge/pill components styled differently for the same intent
    e.g. feature badges in one component use rounded-full, another uses rounded-md
37. Section dividers or separators styled inconsistently
38. Card shadow inconsistent — some cards use shadow-lg, others use custom shadow-[...]
    for the same elevation level
39. Icon library mixed — lucide-react and heroicons used interchangeably for same icon types
40. Link styling inconsistent — some links underlined, some not, some use hover:underline

### OUTPUT FORMAT

#### Typography Audit Table
| File | Element | font-size | font-weight | text-color | Issue? |
|------|---------|-----------|-------------|------------|--------|
| ... | h2 | text-3xl xl:text-5xl | font-bold | #123532 | — |
| ... | h2 | text-2xl xl:text-4xl | font-semibold | #171717 | INCONSISTENT |

#### Color Token Inventory
List every unique color hex found in the codebase and how many files use it.
Flag colors that appear to be duplicates serving the same role.

#### Responsive Gap Report
For each component, one line:
| Component | Mobile OK? | Tablet OK? | Desktop OK? | Issues |
|-----------|-----------|-----------|-------------|--------|

#### Issue Log
For each violation:
**File:** path/to/file.tsx:line_number
**Severity:** HIGH | MEDIUM | LOW
**Category:** Typography | Spacing | Color | Responsive | Component Consistency
**Issue:** [Specific description — quote the differing class names]
**Fix:** [Exact Tailwind classes to standardize to]

### STANDARDIZATION RECOMMENDATIONS
After the audit, propose:
1. A standard section heading class string (copy-paste ready)
2. A standard section description class string
3. A standard section container class string
4. A standard section vertical padding class string
5. A standard card class string
6. A color token map (name → hex) to replace all the inconsistent raw hex values

Start audit now.
```

---

## Recommended Audit Order

| Step | Prompt | Why First |
|------|--------|-----------|
| 1 | State & Data Fetching | Structural issues affect everything else |
| 2 | Security & Environment | Blockers that can't ship under any circumstances |
| 3 | Performance & Bundle | Fixes here improve user-facing scores |
| 4 | Code Quality & Deployment | Final gate before production |
| 5 | UI Consistency & Responsive Design | Polish pass — catches visual debt and mobile gaps |

---

## Scoping Tips

Append any of these to narrow the audit to a specific area:

```
Focus only on: frontend/src/components/AffiliatePrograms/
```
```
Focus only on: frontend/src/app/
```
```
Skip: node_modules, .next, public
```

---

## After Each Audit

1. Copy the output into a `AUDIT-RESULTS-[date].md` file for the record
2. Fix all CRITICAL issues before moving to the next prompt
3. Re-run `next build` and `next lint` after each batch of fixes
4. Mark resolved issues in the results file with `[FIXED]`
