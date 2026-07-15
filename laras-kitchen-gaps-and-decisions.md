# Lara's Kitchen: Vision vs Reality
## Gaps, grey areas, and decisions to make before building

Purpose: hold the distance between what the project is today and where the five-phase vision points, so the gaps are visible and decided on before they reach the backlog. This is a thinking document. Nothing here is final.

Status as of 28 June 2026, based on the CLAUDE.md code audit.

---

## 1. What is actually built (verified)

A solid foundation, and more complete than the old CLAUDE.md claimed:

- Bilingual UI with full RTL, language toggle, Arabic content for ingredients and steps
- Recipe browse and filter by cuisine and meal type
- Recipe detail page
- Cook mode with step timers
- Woolworths price integration, now including the full frontend display (cards, stat strip, grocery estimate panel). The audit confirmed this is wired end to end, so it moves to Done.

Two caveats the audit surfaced:
- `App.js` has a hardcoded "Loading..." in English, so Arabic users see English while data loads. Small bug.
- `Hero.js` renders two titles and toggles them with CSS instead of the `tr.*` pattern used everywhere else. It works, but it is an undocumented exception to the convention.

CSS stubs exist with no components behind them for: search overlay, serving size adjuster, shopping list modal, AI widget. Styling was laid down early. The features themselves are not built.

---

## 2. The one decision everything else waits on

**How ingredient quantities are stored.**

Right now the `ingredients` JSON holds each item as `{amount, name}`, where `amount` looks like free text such as "2 cups". I have not seen the raw row data, so confirm what `amount` actually contains before trusting this read.

Three headline features cannot work on free-text amounts:
- Fractional scaling (Phase 1) needs a number it can multiply.
- Health and nutrition (Phase 4) needs a quantity it can convert and feed into nutrient maths.
- Shopping list and pantry logic (Phase 4) needs quantities it can add up and subtract.

Your own vision doc already names this under Data Integrity Dependencies: ingredients cannot be raw strings if Phases 4 and 5 are to work. So this is not a fresh objection, it is the dependency you already flagged, still open.

Likely decision: restructure `amount` into something such as `{quantity, unit, note}`, for example `{quantity: 2, unit: "cup", note: "peeled"}`, before scaling, health, or shopping is built. Without that restructure, those three features stall no matter how well everything else is documented.

Resolve this first. The backlog, the user stories, and the data dictionary all change depending on the answer.

---

## 3. Feature by feature: ask, reality, gap

### Phase 1: Core MVP

| Feature | Status | Gap or note |
|---|---|---|
| Bilingual RTL/LTR layout | Built | Two caveats from section 1 |
| Cook mode and timers | Built | None |
| External link cards via Open Graph parsing | Not built | No parsing exists in code. Build it, or move it to a later phase. |
| Fractional ingredient scaling | Not built | Depends on the ingredient structure decision (section 2). CSS stub only, no logic. |

Phase 1 as written in the vision is not finished. Scaling and Open Graph parsing are still open. Either show Phase 1 as partly done with those two outstanding, or move them out of Phase 1. It cannot be marked complete.

### Phase 2: Admin

Owner-only admin with JWT to create and edit bilingual recipes. Not started.
- JWT inside a React SPA carries a known question: where the token lives (memory vs browser storage) affects security. Standard problem, deserves a deliberate choice, not a blocker.
- For a single owner, simpler auth may do the job. Worth asking whether full JWT is needed now or later.

### Phase 3: Multi-user social

Accounts, saved recipes, reviews, comments. Not started.
- This is where the schema grows a users table, with everything user-owned hanging off it.
- See the sequencing note in section 6: the health tracker you placed in Phase 4 actually needs accounts from Phase 3, because intake is per person.

### Phase 4: Utility suite (pantry, meal prep, shopping, health)

The flow you described:
1. User builds a weekly meal prep, choosing recipes for the week ahead.
2. App aggregates ingredients into a pantry and grocery requirement.
3. User marks what they already have; the rest becomes a grocery list.
4. User crosses items off as they cook.
5. Health report: user enters gender, weight, age, and gets a breakdown of protein, carbs, calories, and whether they met their intake for the day or week.

The flow is coherent and buildable. Two real gaps sit inside it.

**Gap A: where the nutrition numbers come from.**
Logging which recipe was eaten tells the app *that* a recipe was eaten. It does not tell the app how much protein is in it. That number has to exist somewhere. Two routes:
- *Manual.* Enter total calories, protein, carbs, and fat per recipe by hand. Trivial for 15 recipes, tedious as the list grows, no extra dependency. The pragmatic path.
- *Computed.* Derive recipe nutrition from its ingredients. Needs structured quantities (section 2) plus a nutrient-per-ingredient reference dataset. Harder for Levantine ingredients that may not appear in standard nutrition databases.

Worth considering: start manual per recipe, keep computed as a later upgrade. That sidesteps the hard dependency while still delivering the full health feature.

**Gap B: the intake target.**
Turning gender, weight, and age into an allocated daily intake is a known calculation (a standard BMR formula, then a macro split). Well defined, no data sourcing problem. One note: present it as a general-interest estimate, not dietary or medical advice, since this is a public site.

Everything else in Phase 4 (pantry table, meal-plan table, grocery list as recipes minus pantry) depends on the ingredient structure in section 2.

### Phase 5: Version control and AI

"GitHub for Food": clone a recipe, modify it, re-share it as a variant. This is heavy engineering (forking, diffing, indexing variants). Reasonable as vision. I would keep it as narrative for now and not write full user stories or UAT scripts for it, since it is the least likely to be built soon.

---

## 4. The AI assistant (revised scope)

You have moved this from a single Phase 5 widget to a chat present on every page, aware of its context:
- Recipe page: substitutions ("I don't have X", "can I swap butter for oil").
- Health page: tips.
- Generic advice everywhere, with page-tailored prompts in later phases.

Good fit for an LLM, and the substitution case especially. Decisions to settle before it is built:
- Provider, model, and cost. A public site shared with family means people other than you can trigger paid API calls. A rate limit or usage cap matters.
- How much context the assistant receives. Reading the recipe's ingredient list to answer substitution questions is the useful version, and it leans (again) on structured ingredients.
- Where the API key lives. Backend only, never in the frontend.
- Guardrails on the health page. Generic cooking and nutrition tips are fine. Specific dietary or medical claims should be avoided on a public site.

Moving this to "every page" is a real scope increase. It may deserve to appear earlier than Phase 5 as a thin generic assistant, then gain page-tailored prompts later. Worth deciding where it sits in the roadmap.

---

## 5. Cross-cutting risks and open items

**Woolworths scraping.** Already in use against an undocumented endpoint. It can change or break without warning, which your notes acknowledge. Two added points: this is a public portfolio a hiring manager may open, and the method runs against a retailer's terms. Neither stops the project. Both belong in the RAID log, with a conscious decision on how openly to describe the method.

**Jordanian retail pricing.** The vision mentions Australian and Jordanian retail. That is a second scraping or data problem stacked on top of Woolworths. Decide whether Jordan pricing is in scope or dropped.

**Photos.** The audit could not tell which recipe images are broken or mismatched from files alone. Needs a manual pass against the live data.

**Label coverage.** The cuisine and meal-type translation maps cover a fixed set (Italian, Middle Eastern, Turkish, Other for cuisine; Dessert, Dinner, Side for meal type). If the live database holds values outside these, they will not translate. Worth checking against real data.

**Epics vs phases.** The BA checklist says six system modules; the roadmap has five phases. Epics are capability areas, phases are releases. Reconcile the two so the backlog and roadmap agree.

---

## 6. Sequencing note (a dependency that crosses your phase numbers)

The health tracker sits in Phase 4, but it needs user accounts, which sit in Phase 3, because intake is tracked per person. Meal logging has the same need. So either:
- Phase 3 (accounts) lands before the health and meal-log features, or
- An interim single-user "owner only" version of meal logging and health is built first, with no accounts.

Worth deciding early. It affects what you can demo before accounts exist.

---

## 7. Decisions already taken (recorded so they stay settled)

- Requirement ledger: Notion database with status and phase tags, feeding the stats view. Not a static page of struck-through lines.
- Stats denominator: report both, per phase and across the whole project.
- Nutrition logging UX: user self-logs by selecting recipes eaten, dinner first, expanding to breakfast, lunch, and snacks later.
- AI assistant: present on every page, context-aware.

---

## 8. Open decisions checklist

- [ ] Confirm what `amount` actually stores, then decide the structured ingredient format
- [ ] Phase 1: build scaling and Open Graph parsing, or move them to a later phase
- [ ] Nutrition numbers: manual per recipe, or computed from ingredients
- [ ] AI assistant: provider, cost cap, and where it sits in the phases
- [ ] Auth: full JWT now or simpler owner-auth first, and resolve the Phase 3 before Phase 4 dependency
- [ ] Woolworths: how openly to document the scraping method in a public repo
- [ ] Jordan pricing: in scope or out
- [ ] Reconcile six epics against five phases
- [ ] Fix or log the two localisation caveats (hardcoded "Loading...", Hero.js exception)
