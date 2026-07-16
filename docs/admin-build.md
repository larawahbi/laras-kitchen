# Admin Panel — Build Plan

> **Read this first.** This is the working document for the admin panel build. It is the memory between sessions. Claude Code has no recollection of previous sessions, so anything not written here does not exist.
>
> The general project brief is in `CLAUDE.md` at the repo root. Read that too. This document covers the admin build only.

---

## Purpose

An authenticated owner admin for Lara's Kitchen. It lets the owner add and edit recipes, in English and Arabic, with photo upload, writing directly to the database.

Two goals, and they pull in the same direction:

**A tool.** Recipes are currently added by editing `backend/recipes_data.py` and running `seed.py`. That works at a laptop. It does not work standing in a kitchen having just cooked something.

**A portfolio piece.** The repository is public. The auth design, the API contract, and the data model decisions are part of what the work demonstrates. That raises the bar on how this is built, not just whether it works.

---

## Principles

These are not negotiable and every session is bound by them.

**The backend enforces. The frontend decides what to show.** The API at `laras-kitchen-production.up.railway.app` is public. Anyone can send requests to it directly without touching the React app. Every write endpoint verifies the token independently. Hiding buttons in React is a convenience for the owner, never a control.

**Secrets never enter the repository.** `ADMIN_PASSWORD_HASH` and `JWT_SECRET` live as Railway environment variables, the same as `DATABASE_URL`. Auth code being public is fine and normal. A secret being public is not.

**One source of truth.** Ingredients currently live in both `recipe_ingredients` and the `recipes.ingredients` JSON column, and both are read. An admin that writes to both creates two sources that drift the first time a save half-fails. The JSON fallback is retired before anything writes.

**The admin shares the site's design language.** Same palette, same fonts, same restraint. It is not a bootstrap dashboard bolted to the side of an editorial cookbook.

**Migrations go in `migrate.py` using `sqlalchemy.text()`.** No Alembic. This is the existing pattern and no session introduces a new one.

**One concern per session.** No mixing feature work and cleanup. No refactoring a public component while building an admin form.

**Report before acting.** Every session opens by reporting findings against this document and waits for approval.

---

## Handoff protocol

The order matters. Do not vary it.

1. Lara opens a session and names which session number is next, from the ledger below.
2. Claude Code reads `CLAUDE.md`, then reads this document.
3. Claude Code reports its findings and its plan. It does not write code yet.
4. Lara approves, or corrects.
5. Claude Code builds.
6. **Lara tests.** Nothing is done until she says it is.
7. Lara commits.
8. **Only then** Claude Code updates the ledger below: what was committed, what was tested, what is next. If a decision was made during the session, it is recorded in the Decisions section with its reasoning.

Claude Code does not update the ledger at the end of its own turn. A session is not complete because the code was written. It is complete when it has been tested and committed.

If a session runs out of room before it is finished, the ledger records where it stopped and what remains, and the next session picks up from there rather than starting over.

---

## Decisions

Decisions made, with reasoning, so they are not re-argued in a later session.

| # | Decision | Reasoning |
|---|---|---|
| 1 | Single owner, single password. No users table, no roles. | Only Lara will ever have access. A users table adds schema, a password reset flow, and email delivery for no benefit. |
| 2 | Backend enforces auth on every write route. | The API is publicly reachable. Frontend-only gating is not a control. |
| 3 | Retire the `recipes.ingredients` JSON fallback before building any write path. | Two writable sources of truth will drift. The relational model already exists and is already read. |
| 4 | JSON columns are frozen, not dropped. | They are a safety snapshot. Dropping is irreversible without a restore and costs nothing to keep. |
| 5 | Build backend before frontend. Auth and endpoints are tested with curl before any UI exists. | If the API is not locked, nothing built on top of it matters. |

### Open decisions

These must be resolved before the session that depends on them. Claude Code researches and reports. Lara decides.

**Photo storage.** Railway's filesystem is ephemeral and the app redeploys on every push to `main`, so uploaded files will not survive. Options are a Railway volume or an external service. Needs current research; free tiers and Railway's volume behaviour change. Blocks session 7.

**Token storage in the browser.** `localStorage` is simple and vulnerable to XSS. An httpOnly cookie is safer and requires CORS credentials configuration across two domains, Netlify and Railway. This is a real trade-off and a portfolio-visible one. Blocks session 4.

**Token lifetime.** How long a login lasts before it expires. Blocks session 2.

**`cover_img` conflict.** `CLAUDE.md` lists `cover_img` as manually edited and read-only. An admin with photo upload contradicts that. Either the rule changes or the form excludes the field. Blocks session 7.

**Admin visual signal.** The admin shares the site's design language, which raises the question of how the owner knows she is editing rather than viewing. Needs a deliberate signal. Blocks session 4.

---

## Sessions

Ordered by dependency. Do not reorder without recording why.

### Session 0 — This document
Add this file to `/docs`. Add a pointer to it in `CLAUDE.md`. Check `docs/roadmap.md` and `docs/requirements.md`, which already reference "Phase 2 — Owner Admin", and make them point here rather than duplicate.

**Done when:** the doc is committed and `CLAUDE.md` points to it.

---

### Session 1 — Retire the JSON fallback
Confirm the relational path in `_RI_QUERY` covers all 14 recipes with no gaps. Switch reads to relational only. Leave the JSON columns in place, unwritten and unread.

**Done when:** every recipe renders correctly in both languages with the JSON fallback removed from the read path. Report any recipe where the relational data is incomplete before removing anything.

**Watch:** if any recipe depends on the fallback, that is a data gap and it is fixed here, not worked around later.

---

### Session 2 — Backend auth
`POST /api/admin/login` takes a password, checks it against `ADMIN_PASSWORD_HASH`, returns a signed token. A dependency that verifies the token and rejects with 401. Applied to nothing yet.

Resolve the token lifetime decision first.

**Done when:** login returns a token for the right password and rejects the wrong one, verified with curl. Reads stay public and unaffected.

---

### Session 3 — Write endpoints
Create and update recipes. Text fields, times, serves, tags, in both languages. Ingredients are not in scope. Photos are not in scope. Every route protected by the session 2 dependency. Validation and error handling.

**Done when:** a recipe can be created and updated with curl, with a valid token. Without a token, 401. Still no UI.

---

### Session 4 — Admin shell
Login page, route guard, admin layout. The design language of the site, with a clear signal that this is admin mode.

Resolve the token storage and visual signal decisions first.

**Done when:** the owner can log in, the guard blocks unauthenticated access to admin routes, and the shell matches the site.

---

### Session 5 — Edit a recipe, text fields
The narrowest useful form. English fields first, then Arabic. No ingredients, no photos.

**Done when:** an existing recipe's text can be edited and saved, and the change appears on the public site.

---

### Session 6 — Ingredients editor
The hardest form in the project. Quantity, unit selected from `units`, ingredient looked up in or added to `ingredients`, group name, sort order.

**Done when:** a recipe's ingredients can be edited and saved to the relational tables, and render correctly in both languages.

**Watch:** adding a new ingredient may also need a row in `ingredient_search_terms`. Decide whether that is in scope here or deferred with the rest of the pricing work.

---

### Session 7 — Photo upload
Resolve the storage and `cover_img` decisions first.

**Done when:** a photo can be uploaded, it survives a redeploy, and it renders on the public site.

---

### Session 8 — Create a new recipe
Reuses everything above. Last, not first.

**Done when:** a new recipe can be created end to end, with content, ingredients, and a photo, and appears on the public site.

---

### Session 9 — Portfolio pass
Documentation of the auth design and the API contract. Update `docs/architecture.md` and `docs/data-model.md`. Update the RAID log.

**Done when:** someone reading the repository cold can understand how the admin works and why it was built that way.

---

## Ledger

Updated only after Lara has tested and committed. Newest entry at the top.

| Session | Status | Committed | Tested | Notes |
|---|---|---|---|---|
| 0 | Not started | — | — | — |

**Next session:** 0.

---

## Out of scope

Recorded so it is not quietly picked up.

- **Pricing.** Deliberately hidden behind a feature flag. The data pipeline and endpoints are intact. Not part of this build.
- **Nutrition.** The reserved columns on `ingredients` are null. Paused by decision.
- **Public accounts.** Registration, profiles, saved recipes, reviews. Phase 3 in the roadmap.

---

## Known defects

Found during the mobile Arabic layout diagnosis. Both are dormant — the grocery estimate panel does not render while `SHOW_PRICES` is `false`, so neither can be tested in the current UI. Fixed in the session that re-enables prices, not now.

- **`.grocery-item-name` has no `min-width:0`**, and the grocery row classes (`frontend/src/styles/main.css:236-244`) have no mobile breakpoint at all. At 390px the row overflows the card: the Shop button is pushed past the right edge and the ingredient name column is squeezed to two or three lines while the product name column keeps its space. Identical in both languages — there is no RTL rule for any of these classes.
- **`RecipeDetail.js:40`** builds `allIngredientItems` from `recipe.ingredients` without checking `lang`, so the grocery panel always shows English ingredient names, even in Arabic mode. The ingredient data itself is complete and correctly translated (checked directly against the database, all 72 `ingredients` rows have a non-empty `name_ar`) — this is a code bug, not a data gap. The main ingredient panel is unaffected; it already reads the lang-aware `ingredients` variable.
