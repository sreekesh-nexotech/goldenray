# Content Studio cutover runbook (PLAN.md step C3)

Written for: whoever runs the Studio release — one engineer plus the Content Manager who smoke-tests it.

The Studio now talks to the platform staff API (`/api/v1/`) instead of the Django CMS at
`/studio-api/admin-api/`. `docs/PLAN.md` §6.2 specifies this as a single release with **no legacy shim**,
because the auth model differs. There is no per-screen fallback: when this build ships, every Studio
screen is on the new backend at once.

This is as much an operational event as a code change, because **CMS passwords are deliberately not
migrated** and the login identifier changes from a username to an e-mail address.

---

## Before the release

1. **Confirm `import_cms` has run against the target database.** It brings over users, roles, media,
   content (collections/templates/entries + slug history), pages, FAQs, careers and the settings
   singleton. See `docs/PLAN.md` §7.2 for the per-table rules and run `verify_migration` for the counts.

2. **Review the per-role grant diff.** CMS module/action pairs are re-keyed onto the platform's
   permission registry, and anything outside it is **dropped**. Check each role in the Studio's Roles
   screen (or `GET /api/v1/roles/`) and re-grant what the import could not map. A role with no grants
   leaves its users with an empty sidebar.

3. **Fix placeholder e-mail addresses.** A CMS account with no e-mail is imported as
   `<username>@migrated.invalid`. E-mail is now the login, so those users cannot sign in until the
   address is corrected.

4. **Set the environment.** `NEXT_PUBLIC_STAFF_API_BASE_URL` must point at the platform API
   (`https://flarize.com/api/v1/` in production). It is read server-side only — the browser never sees
   it. `NEXT_PUBLIC_ADMIN_API_BASE_URL` is no longer used and can be removed from the deployment config.

   Note the BFF makes the Studio same-origin, so `CORS_ALLOWED_ORIGINS` does **not** need to list the
   site for the Studio to work. (It is still needed for the public website's direct calls to
   `/api/public/v1/`.)

## Releasing

5. **Deploy the frontend.** Rollback is redeploying the previous image; the old CMS should still be
   running at this point, so a rollback restores the previous Studio exactly.

6. **Issue password resets.** Every imported account has `must_reset_password = true` — this is by
   design, and the API refuses the account until the password is set. Trigger
   `POST /api/v1/auth/password/reset-request/` for each active user.

7. **Tell the Content Managers**, in these words:
   - Sign in at `/studio/login` with **your e-mail address**, not your old username.
   - Use the reset link to set a new password; old CMS passwords will not work.
   - You will be signed out after 7 days of inactivity, and after 30 days regardless.

## Smoke test (Content Manager, with an engineer watching the network tab)

Work through each screen and confirm a full round trip — list, edit, and each workflow button:

- Dashboard (counts render, recent entries and activity populate)
- Entries: list, open, edit, save, publish, unpublish, duplicate
- Collections, Templates (add/rename an image group and an attribute slot), Taxonomy
- Media: **upload an image** (this is the one most likely to fail — see below), edit alt text, delete
- Pages and the Career page: edit a text slot and an image slot, save SEO, publish
- FAQs: create, edit, publish, reorder within a section
- Careers: departments, positions (publish/close/archive), **applications** (status moves, notes,
  assign to a posting, resume download)
- Enquiries, EMI calculator (all four tables plus settings), Roles, Users, Settings, BOM calculator

### Six things that fail quietly — check these deliberately

These were the riskiest parts of the migration and none of them would be caught by a build:

1. **Applications list is not empty.** The old endpoint returned a bare array; the new one is paginated.
2. **Applications show job titles, not UUIDs.** The `position` field changed meaning (it is now the
   posting's uid; the readable label is `display_position`).
3. **Error messages are real sentences.** Force a validation failure — publish an entry that is missing
   a required field — and confirm you see the server's message, not "Request failed (400)".
4. **Media upload works.** The platform requires `visibility` and `kind` on upload; without them every
   upload 400s.
5. **Application statuses are the new pipeline:** New → Screening → Interview → Offered → Hired, plus
   Rejected and Withdrawn. "Reviewing" and "Selected" no longer exist.
6. **A 409 is handled.** Try deleting a media asset that an entry still uses — it should be refused with
   an explanation, not silently succeed (the old CMS deleted it and let the entry lose its image).

Also confirm, in devtools: **no token is readable from `document.cookie`**, and the session cookie is
flagged `HttpOnly`. Open the Studio in two tabs and use both — the session must survive (the old
client's token handling would have revoked it).

## After

8. Once the Content Manager signs off, stop the `legacy-cms` container (PLAN.md step C4). Keep it for two
   weeks before removing it, and archive the `blog_cms` database.

---

## Note for the backend team (not actioned here)

`docs/PLAN.md:302` says `emi_system_size` is **removed** and that "sizes and prices come from
`packs_release_pack`". The implemented code disagrees: `emi/services/rows.py:45` registers a
`SYSTEM_SIZES` spec over a live `SystemSize` model, and `/api/v1/emi/system-sizes/` is a working CRUD
endpoint. The Studio's EMI screen migrated onto it one-for-one, so nothing is blocked.

Worth an entry in `goldenray-backend/docs/DEVIATIONS.md` — not added from here, because that is a
separate repository and currently on an unrelated branch (`feat/bom-staff-quote`).
