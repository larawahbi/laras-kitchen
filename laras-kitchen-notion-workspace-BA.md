# Lara's Kitchen · Project Workspace
## Business Analysis repository — content and Notion build specification

**Document purpose.** This is both the reviewable content for the project workspace and the build map for placing it into Notion. Whoever builds it (a new session, or this one) transcribes the content below; they do not invent it. Status is drawn from the verified code audit and Lara's manual checks. Anything not verifiable from the files is marked in the Unverified register rather than asserted.

**Prepared as of** 28 June 2026.

**Elaboration principle.** Near-term work (Foundation, Phase 1) is documented in full. Later phases are described at decreasing detail, which is deliberate progressive elaboration, not omission. They gain detail as they approach build.

---

# PART 0 — NOTION BUILD SPECIFICATION

Read this part first if you are building the workspace in Notion. It defines the page tree, the three databases, and the relations and rollups that make the stats page show real percentages rather than typed-in numbers.

## 0.1 Page tree

```
Lara's Kitchen · Project Workspace   (root page)
├── 00 · Overview & Current Status
├── 01 · Vision & Business Case
├── 02 · Charter & Scope
├── 03 · Stakeholders & Personas
├── 04 · Product Roadmap
├── 05 · Epics (reference)
├── 06 · Requirements Ledger        (DATABASE)
├── 07 · Acceptance Criteria (BDD)
├── 08 · Non-Functional Requirements
├── 09 · System & Process Models
├── 10 · Data Dictionary
├── 11 · RAID & Decision Log         (DATABASE)
├── 12 · UAT Scripts
├── 13 · Phases                      (DATABASE, powers the stats)
└── 14 · Progress Dashboard          (stats, built from 06 and 13)
```

## 0.2 Databases to create

Three databases. Build them in this order, because the relations depend on it: Phases first, then Requirements Ledger (which relates to Phases), then RAID.

### Database A — Phases (build first)
One row per phase. This database exists to drive the per-phase percentages.

| Property | Type | Notes |
|---|---|---|
| Name | Title | Foundation, Phase 1, Phase 2, Phase 3, Phase 4, Phase 5 |
| Goal | Text | One-line phase goal |
| Requirements | Relation → Requirements Ledger | Created automatically once the relation is set up from the Ledger side |
| Total | Rollup | Requirements relation, Count all |
| Done | Rollup | Requirements relation, roll up "Is Done", Checked count |
| % Complete | Rollup | Requirements relation, roll up "Is Done", Percent checked |

### Database B — Requirements Ledger (build second)
One row per requirement. This is the ledger.

| Property | Type | Options / Notes |
|---|---|---|
| Name | Title | Short requirement title |
| Type | Select | Epic, User Story, Tech Task, NFR, Defect |
| Phase | Relation → Phases | Links each requirement to its phase. This relation creates the "Requirements" property on Phases. |
| Epic | Select | See Epics list (Part 1, section 05) |
| Status | Select | Done, In Progress, To Do, Blocked, Backlog |
| Priority | Select | Must, Should, Could, Won't (MoSCoW) |
| Is Done | Formula | `prop("Status") == "Done"` — returns a checkbox value. Used by the Phases rollups. |
| User Story | Text | "As a … I want … so that …" where applicable |
| Acceptance | Text | Short acceptance note; full Gherkin for complex items lives in page 07 |
| Verified | Checkbox | Ticked only where status is backed by the code audit, not assumed |
| Notes | Text | |

Note on the "Is Done" formula rollup: if Notion will not let a rollup compute "Percent checked" over a formula property in your workspace version, replace "Is Done" with a plain checkbox and tick it by hand when an item completes. The dashboard still works either way.

### Database C — RAID & Decision Log (build third)

| Property | Type | Options / Notes |
|---|---|---|
| Name | Title | The risk, assumption, issue, dependency, or decision |
| Category | Select | Risk, Assumption, Issue, Dependency, Decision |
| Likelihood | Select | High, Medium, Low (Risks only) |
| Impact | Select | High, Medium, Low (Risks only) |
| Status | Select | Open, Mitigating, Closed, Decided |
| Owner | Text | Lara |
| Response / Note | Text | Mitigation, or recommended option for a Decision |

## 0.3 Strikethrough for done items (your Rule 1)

Notion cannot automatically strike text based on a property. So the canonical "done" signal is the Status field, not visual strikethrough. To get the effect you wanted (seeing progress build day by day), the Progress Dashboard carries a "Done" view and a "Pending" view side by side. If you still want the struck-through look, apply it manually to a row's title when you close it; it is cosmetic and does not feed the stats.

## 0.4 Progress Dashboard (your Rule 3)

Page 14 is built entirely from linked views of the two databases. No numbers are typed by hand.

1. **Current stage callout** (manual text): a single line stating where the project is. Suggested starting value: *"Current stage: Foundation (ingredient restructure) and closing the two open Phase 1 items."*
2. **Per-phase progress**: a linked view of the **Phases** database as a table, showing Name, % Complete, Done, Total. This gives the per-phase percentages.
3. **Whole-project progress**: a linked view of the **Requirements Ledger** as a table. At the bottom of the "Is Done" column, set the column aggregation to "Percent checked". That footer figure is the whole-project completion percentage.
4. **Status board**: a linked board view of the Ledger grouped by Status, for an at-a-glance read of what sits where.
5. **Done list / Pending list**: two linked views of the Ledger, one filtered Status = Done, one filtered Status is not Done. These are the "what's finished" and "what's left" lists.

This satisfies both denominators you asked for: per phase (item 2) and whole project (item 3).

---

# PART 1 — WORKSPACE CONTENT

---

## 00 · Overview & Current Status

**What this is.** Lara's Kitchen (مطبخ لارا) is a bilingual Arabic and English recipe web application built by Lara Wahbi. It is a personal cooking companion shared with family and friends, not a commercial product. The build also serves as a Business Analysis portfolio piece, so the project is documented to professional standard.

**Architecture.** React frontend on Netlify, FastAPI backend on Railway, PostgreSQL on Railway, GitHub for version control, with auto-deploy on push to main.

**Where the project stands.** The core recipe experience is live and working: bilingual browsing, filtering, a recipe detail page, a guided Cook Mode with timers, Arabic content for ingredients and steps, and Woolworths price estimates shown on cards and in a grocery panel. Recipe photos were corrected manually. The next body of work is foundational: restructuring how ingredient quantities are stored, because three later capabilities (scaling, nutrition, shopping) depend on it.

**Verified status register.** The following are confirmed from the code audit and Lara's manual checks:

- Tech stack matches the documented stack.
- Database schema matches `models.py`.
- Bilingual UI, RTL, language toggle, browse, filter, detail page, Cook Mode, timers: built.
- Arabic content pipeline (`ingredients_ar`, `steps_ar`): built.
- Woolworths price integration and frontend price display: built and wired end to end.
- Price data populated for all 15 recipes.
- Recipe photos: fixed manually (note: the project's CLAUDE.md is stale here and still lists photos as planned; update it).

**Unverified register.** Held as open until confirmed, not asserted:

- Exact dates each migration was applied (never captured).
- Whether every cuisine and meal-type value in the live database is covered by the translation maps in `translations.js`.
- The exact current JSON shape of `ingredients` in the live database (Stage 1 of the restructure will confirm).
- Whether `ingredients_ar` and `steps_ar` are populated for every row.

**Known defects (carried into the backlog and RAID):**

- `App.js` shows "Loading..." in English even when the language is Arabic.
- `Hero.js` bypasses the `tr.*` localisation convention by rendering both an English and an Arabic heading and toggling them with CSS.
- `main.css` holds styling stubs for four features that do not yet exist (search overlay, serving adjuster, shopping list modal, AI widget).
- Arabic gaps remain in four places: ingredient amounts and units (g, clove, tsp), ingredient names in the cost panel (for example "plain yoghurt"), recipe descriptions, and tags.

---

## 01 · Vision & Business Case

**Vision.** A single bilingual home for the recipes a family actually cooks, that does the practical work around cooking as well as holding the recipe: guiding the cook step by step, scaling portions, estimating the grocery bill, planning the week, and tracking what the week did to your nutrition. Built for a household that lives across Adelaide and Amman and cooks in both English and Levantine Arabic.

**The problem.** Everyday recipes are scattered across WhatsApp threads, video links, and screenshots, which makes them hard to find mid-cook. General recipe sites translate stiffly and miss colloquial Levantine Arabic. Most are cluttered with advertising and lack clean cooking tools. And the related household jobs (budgeting, pantry, meal planning, nutrition) are handled in separate places or not at all.

**The proposition.** One clean, bilingual, advert-free application that unifies the recipe, the cooking, the cost, the plan, and the nutrition, with authentic Arabic and an interface designed for use while cooking.

**Why it is worth building.** Beyond personal use, the project demonstrates end-to-end delivery: requirements, data modelling, a real bilingual product, third-party integration, and staged release. That is the portfolio value.

**Business case in brief.** The cost is time, plus a small hosting fee (see RAID: Railway has no permanent free tier for a database-backed app, so expect roughly five dollars a month once the trial lapses). The return is a genuinely useful tool for the household and a substantial, honest portfolio artefact.

---

## 02 · Charter & Scope

**Objective.** Deliver the bilingual recipe and cooking experience first, then layer planning, pricing, nutrition, community, and an AI assistant across five phases, on a data model sound enough to carry all of it.

**In scope (across the lifecycle).** Bilingual recipe content and viewing; guided cooking; portion scaling; grocery cost estimates; an owner admin area; user accounts and light social features; meal planning, pantry, and shopping lists; nutrition and health tracking; recipe forking; a context-aware AI assistant.

**Out of scope.** Commercial features (payments, advertising, monetisation). Native mobile apps; the product is responsive web. Direct enterprise retailer integrations; pricing relies on the existing search method. Anything implying medical advice; the health feature presents general estimates only.

**Phase boundaries.**

- **Foundation** (precedes Phase 2 work). Restructure ingredient storage; add nutrition scaffolding; clear the known defects; complete the Arabic gaps. No new user-facing feature, but the platform the later phases stand on.
- **Phase 1 — Core MVP.** Bilingual viewing, cooking, scaling, link cards. Mostly delivered; two items open (scaling, Open Graph link cards).
- **Phase 2 — Owner Admin.** Authenticated admin to create and edit bilingual recipes, including photo upload.
- **Phase 3 — Accounts & Social.** Registration, profiles, saved recipes, reviews, comments. Flagged as a candidate for descope if it proves heavier than its value.
- **Phase 4 — Planning, Pantry, Nutrition.** Weekly meal prep, pantry inventory, generated shopping list, health and nutrition reporting, extended pricing.
- **Phase 5 — Forking & AI.** Clone, modify, and re-share recipe variants; the AI assistant in its fullest form. The assistant itself is cross-cutting and may appear earlier in thin form.

**Key assumptions.** A single content author for now; a small recipe set (15); nutrition figures entered manually per recipe to begin with.

---

## 03 · Stakeholders & Personas

**Primary persona — the Home Cook.** Family and friends across Adelaide and Amman. Mobile-first, often reading while cooking, switching between English and Arabic. Wants recipes that are easy to find, easy to follow hands-busy, and written in natural language including Levantine Arabic. Cares about portion sizes and rough cost.

**Owner persona — Lara (Content Owner / Admin).** Desktop-first when adding or editing recipes. Needs an efficient, validated way to enter bilingual content without touching the database by hand. This is the persona the Foundation lookup tables and the Phase 2 admin panel exist to serve.

**Secondary persona — the Household Manager.** A cook focused on reducing the grocery bill, planning the week, and keeping an eye on nutrition. The Phase 4 audience.

**System actor.** Background processes: the Woolworths price fetch, future nutrition calculation, and the AI assistant. Non-functional needs (cost ceilings, key handling, performance) attach here.

---

## 04 · Product Roadmap

A staged release plan. Each phase is shippable on its own.

**Foundation — data model and cleanup.** Lookup tables for units and ingredients; a relational recipe-ingredients table; nutrition scaffolding; defect fixes; Arabic completion. Status: To Do, near-term, highest priority. Everything ambitious downstream depends on it.

**Phase 1 — Core MVP.** Delivered apart from portion scaling and Open Graph link cards, both of which depend on the Foundation data model.

**Phase 2 — Owner Admin.** Authenticated create and edit for bilingual recipes, drawing its dropdowns from the Foundation lookup tables. Photo upload included.

**Phase 3 — Accounts & Social.** User identity and light community features. Note the dependency: per-person nutrition and meal logging in Phase 4 need accounts, so either Phase 3 lands first, or Phase 4 ships an interim single-user mode.

**Phase 4 — Planning, Pantry, Nutrition.** The household utility suite, sequenced as: meal-prep planner, pantry, generated shopping list, then health and nutrition reporting.

**Phase 5 — Forking & AI.** Recipe version control and the full assistant.

---

## 05 · Epics (reference)

Epics are capability areas. They cut across phases; a phase is a release, an epic is a theme. This reconciles the earlier "six modules" framing into a clean capability set.

- **E1 · Localisation & Bilingual Content** — translation system, RTL, Arabic content completeness.
- **E2 · Recipe Discovery & Viewing** — browse, filter, search, detail page.
- **E3 · Guided Cooking** — Cook Mode, step timers, scaling.
- **E4 · Pricing & Grocery Costing** — Woolworths integration, cost display, future Jordan pricing.
- **E5 · Recipe Data Model & Admin** — the relational ingredient model, lookup tables, owner admin and auth.
- **E6 · Meal Planning & Pantry** — weekly planner, pantry inventory, shopping list generation.
- **E7 · Nutrition & Health** — nutrition data, intake targets, daily and weekly reporting.
- **E8 · Community & Social** — accounts, profiles, reviews, comments, recipe forking.
- **E9 · AI Assistant** — context-aware help across pages (cross-cutting).
- **E10 · Platform & Non-Functional** — hosting, performance, security, data integrity, cost.

---

## 06 · Requirements Ledger (database content)

Load these as rows in the Requirements Ledger. Status reflects the verified audit. "Verified" ticked means the status is evidence-backed; unticked means planned or assumed.

### Foundation

| Name | Type | Epic | Status | Priority | User Story | Verified |
|---|---|---|---|---|---|---|
| Units lookup table | Tech Task | E5 | To Do | Must | As the owner, I want a units table with English and Arabic names and a type, so units render in Arabic and scaling knows what is measurable. | No |
| Ingredients lookup table | Tech Task | E5 | To Do | Must | As the owner, I want one ingredients table holding Arabic name, staple flag, search term, and nutrition fields, so ingredient data lives in one place. | No |
| Recipe-ingredients relational table + migration | Tech Task | E5 | To Do | Must | As the owner, I want recipe ingredients stored relationally with quantity, unit, and ingredient references, so scaling, nutrition, and shopping can read real numbers. | No |
| Nutrition scaffolding columns | Tech Task | E7 | To Do | Should | As the owner, I want nullable nutrition and gram-conversion columns on ingredients, so the health feature has somewhere to read from later. | No |
| API assembles ingredients from new tables | Tech Task | E5 | To Do | Must | As a cook, I want the recipe to render from the new tables in my chosen language, so ingredient names and units appear correctly in Arabic. | No |
| Fix "Loading..." localisation defect | Defect | E1 | To Do | Should | As an Arabic user, I want the loading text in Arabic, so the interface is consistent. | Yes |
| Refactor Hero.js to the tr.* convention | Defect | E1 | To Do | Could | As a maintainer, I want the hero heading to follow the same localisation pattern as every other component. | Yes |
| Resolve orphan CSS stubs | Defect | E10 | To Do | Could | As a maintainer, I want CSS for unbuilt features either removed or clearly marked, so the stylesheet reflects reality. | Yes |
| Recipe descriptions in Arabic (desc_ar) | User Story | E1 | To Do | Should | As an Arabic user, I want recipe descriptions in Arabic, so the page is fully localised. | Yes |
| Tags in Arabic | User Story | E1 | To Do | Could | As an Arabic user, I want tags in Arabic, so filtering and labels read naturally. | Yes |

### Phase 1 — Core MVP

| Name | Type | Epic | Status | Priority | Verified |
|---|---|---|---|---|---|
| Bilingual UI with full RTL | User Story | E1 | Done | Must | Yes |
| Language toggle | User Story | E1 | Done | Must | Yes |
| Browse recipes | User Story | E2 | Done | Must | Yes |
| Filter by cuisine and meal type | User Story | E2 | Done | Must | Yes |
| Recipe detail page | User Story | E2 | Done | Must | Yes |
| Cook Mode, step by step | User Story | E3 | Done | Must | Yes |
| Step timers | User Story | E3 | Done | Must | Yes |
| Arabic ingredients and steps content | User Story | E1 | Done | Must | Yes |
| Woolworths price integration (backend) | User Story | E4 | Done | Should | Yes |
| Frontend price display | User Story | E4 | Done | Should | Yes |
| Portion / serving scaling | User Story | E3 | To Do | Should | No |
| Open Graph link cards | User Story | E2 | To Do | Could | No |

User stories for the two open Phase 1 items:
- *Portion scaling*: As a cook, I want to change the serving count and have ingredient amounts scale, so I can cook for a different number of people. (Depends on Foundation.)
- *Link cards*: As a cook, I want a pasted source link to show a tidy preview card, so the recipe's origin looks clean.

### Phase 2 — Owner Admin

| Name | Type | Epic | Status | Priority |
|---|---|---|---|---|
| Owner authentication | User Story | E5 | To Do | Must |
| Admin: create recipe with bilingual dropdowns | User Story | E5 | To Do | Must |
| Admin: edit and update recipe | User Story | E5 | To Do | Must |
| Admin: photo upload | User Story | E5 | To Do | Should |
| Admin: preview and validate bilingual entry | User Story | E5 | To Do | Should |

### Phase 3 — Accounts & Social *(candidate for descope; see Decision DEC5)*

| Name | Type | Epic | Status | Priority |
|---|---|---|---|---|
| User registration and login | User Story | E8 | To Do | Should |
| User profile | User Story | E8 | To Do | Should |
| Save / favourite recipes | User Story | E8 | To Do | Should |
| Reviews and ratings | User Story | E8 | To Do | Could |
| Comments | User Story | E8 | To Do | Could |

### Phase 4 — Planning, Pantry, Nutrition

| Name | Type | Epic | Status | Priority |
|---|---|---|---|---|
| Weekly meal-prep planner | User Story | E6 | To Do | Should |
| Pantry inventory with low-stock flags | User Story | E6 | To Do | Should |
| Generated shopping list (plan minus pantry) | User Story | E6 | To Do | Should |
| Tick off cooked and purchased items | User Story | E6 | To Do | Could |
| Health profile to intake target | User Story | E7 | To Do | Should |
| Daily and weekly nutrition report | User Story | E7 | To Do | Should |
| Meal logging (dinner first, then expand) | User Story | E7 | To Do | Should |
| Jordan retail pricing | User Story | E4 | To Do | Could |

Representative stories:
- *Meal prep*: As a household manager, I want to choose recipes for the week ahead and save the plan, so I know what I am cooking.
- *Shopping list*: As a household manager, I want a shopping list built from my plan minus what is in my pantry, so I only buy what I need.
- *Nutrition report*: As a user, I want to enter my age, weight, and gender and see whether my week met my intake and what was lacking, so I understand my eating. (General estimate, not medical advice.)

### Phase 5 — Forking & AI

| Name | Type | Epic | Status | Priority |
|---|---|---|---|---|
| Fork (clone) a recipe | User Story | E8 | To Do | Could |
| Modify and re-share as a variant | User Story | E8 | To Do | Could |
| Variant indexing and discovery | User Story | E8 | To Do | Could |
| AI assistant: substitutions on recipe page | User Story | E9 | To Do | Should |
| AI assistant: tips on health page | User Story | E9 | To Do | Could |
| AI assistant: generic chat on all pages | User Story | E9 | To Do | Could |

The assistant stories carry a note: the assistant is cross-cutting and a thin generic version may be pulled earlier than Phase 5 (Decision DEC2).

---

## 07 · Acceptance Criteria (BDD)

Gherkin for the higher-complexity stories. Written in Given / When / Then.

**RTL language toggle**
```
Scenario: Switching to Arabic flips the layout
  Given I am viewing a recipe in English
  When I switch the language to Arabic
  Then all interface text appears in Arabic
  And the page layout reads right to left
  And ingredient names and units appear in Arabic
  And no English fallback text remains visible on screen
```

**Step timer in Cook Mode**
```
Scenario: A step with a wait time runs a timer
  Given I am in Cook Mode on a step that has a wait time
  When I start the step timer
  Then the timer counts down from the step's wait time
  And I am alerted when it reaches zero
  And I can move to the next step without losing the recipe
```

**Portion scaling (open item)**
```
Scenario: Doubling the servings scales the ingredients
  Given a recipe written for 4 servings
  When I set the servings to 8
  Then each measurable ingredient amount doubles
  And ingredients given as "to taste" or "a pinch" stay unchanged
  And the original recipe is not overwritten
```

**Price display**
```
Scenario: A priced recipe shows its grocery estimate
  Given a recipe with cached Woolworths prices
  When I open the recipe
  Then I see a total estimated grocery cost
  And I see a per-ingredient breakdown with product names and links
  And staple ingredients are excluded from the total
```

---

## 08 · Non-Functional Requirements

**Localisation integrity.** No hardcoded user-facing strings; every component follows the `tr.*` convention; full RTL with no layout breakage. (The two known defects are NFR breaches and sit in the Foundation backlog.)

**Performance.** Frontend served from Netlify's edge. Prices are cached in the database and never fetched on page load, which keeps recipe pages fast.

**Data integrity.** Ingredients stored as structured data (quantity, unit, ingredient reference), not free text, from the Foundation phase onward. This is the precondition for scaling, nutrition, and shopping.

**Security.** API keys held on the backend only, never in the frontend. The owner admin sits behind authentication. The AI assistant is rate-limited or capped to prevent runaway cost on a public site.

**Availability and cost.** Railway has no permanent free tier suitable for a database-backed app; expect roughly five dollars a month on the Hobby plan once the trial credit lapses. Usage beyond that is unlikely at this scale but should be watched.

**Maintainability.** Consistent language handling across components; no dead code; one concern per work session.

---

## 09 · System & Process Models

**System context (described).** The Home Cook's browser loads the React client from Netlify. The client calls the FastAPI backend on Railway over HTTPS. The backend reads and writes PostgreSQL on Railway. A background price-fetch process calls the Woolworths search endpoint and caches results in the database. Future actors: a nutrition calculation process and the AI assistant, the latter calling an external model provider from the backend.

**Process — create a bilingual recipe (target, Phase 2).** Owner authenticates, opens the admin form, selects ingredients and units from dropdowns fed by the lookup tables, enters quantities and bilingual text, previews both languages, and saves. The recipe is written relationally; no hand-editing of JSON.

**Process — weekly meal prep to shopping list (target, Phase 4).** User picks recipes for the week and saves the plan. The system aggregates the plan's ingredients. The user marks what the pantry already holds. The system subtracts pantry stock and produces a shopping list. The user ticks items off as bought or cooked. Optionally, the plan feeds a nutrition report.

A note on the second flow: it depends on the relational ingredient model (to aggregate quantities) and on user accounts (to hold a personal plan and pantry).

---

## 10 · Data Dictionary

**Current state.** The `recipes` table stores ingredients as JSON in the shape `[{group, items:[{amount, name}]}]`, where `amount` is a single text field such as "250 g". Arabic ingredients live in a parallel `ingredients_ar` JSON. Prices live in `recipe_ingredient_prices`; Woolworths search terms in `ingredient_search_terms`; staple logic in code. This works for display but cannot support scaling, nutrition, or shopping, because the quantity is not a number the code can read.

**Target state (Foundation).** Three tables.

*units*

| Column | Type | Notes |
|---|---|---|
| code | string (PK) | tbsp, tsp, cup, g, kg, clove, pinch, to_taste |
| name_en | string | tablespoon |
| name_ar | string | ملعقة كبيرة (singular form; counted-noun grammar is an accepted limitation) |
| unit_type | string | weight, volume, count, informal |
| scalable | boolean | false for pinch and to_taste |

*ingredients*

| Column | Type | Notes |
|---|---|---|
| id | serial (PK) | |
| name_en | string | plain yoghurt |
| name_ar | string | replaces parallel Arabic JSON |
| is_staple | boolean | absorbs the staples logic |
| search_term | string | absorbs `ingredient_search_terms` |
| calories_per_100g | float, null | |
| protein_per_100g | float, null | |
| carbs_per_100g | float, null | |
| fat_per_100g | float, null | |
| grams_per_cup | float, null | weight of one cup of this ingredient |
| grams_per_tbsp | float, null | weight of one tbsp of this ingredient |
| grams_per_unit | float, null | weight of one whole item, for count units |

The gram-conversion columns sit on the ingredient, not the unit, because a cup of flour and a cup of water weigh different amounts. Nutrition is stored per 100g, so a recipe line converts to grams first, then applies the per-100g figure.

*recipe_ingredients*

| Column | Type | Notes |
|---|---|---|
| id | serial (PK) | |
| recipe_id | FK → recipes.id | |
| group_name | string, null | preserves the existing grouping |
| sort_order | integer | preserves order |
| quantity | float, null | null for "to taste" lines |
| unit_code | FK → units.code, null | |
| ingredient_id | FK → ingredients.id | |
| note | string, null | "peeled and sliced" |

The old `ingredients` and `ingredients_ar` JSON columns are retained as a fallback until the new path is verified, then dropped in a later, separate session.

---

## 11 · RAID & Decision Log (database content)

### Risks
| Name | Category | Likelihood | Impact | Response |
|---|---|---|---|---|
| Woolworths endpoint is undocumented and may change | Risk | Medium | Medium | Accept; check fetch output; isolate so a break degrades gracefully. |
| Railway has no free tier for a DB-backed app | Risk | High | Low–Medium | Accept ~5 USD/month on Hobby; or move Postgres to a free-DB provider if staying free becomes a hard requirement. |
| AI assistant cost abuse on a public site | Risk | Medium | Medium | Rate-limit or cap usage; key on backend only. |
| RTL layout shifts when adding new components | Risk | Medium | Medium | Defensive CSS; test both directions on every new component. |
| Ingredient migration mis-parses amounts | Risk | Medium | Low | Log every ambiguous line; resolve by hand (small at 15 recipes). |
| Public repo documents a scraping method against retailer terms | Risk | Low | Low–Medium | Decide how openly to describe the method in public docs. |

### Assumptions
| Name | Category | Note |
|---|---|---|
| Single content author for now | Assumption | Admin built for one owner; multi-author not required yet. |
| Small recipe set (15) | Assumption | Manual migration and manual nutrition entry are feasible at this size. |
| Nutrition entered manually per recipe initially | Assumption | Avoids the harder computed path until later. |

### Issues (current defects)
| Name | Category | Note |
|---|---|---|
| "Loading..." shows English in Arabic | Issue | Foundation backlog. |
| Hero.js bypasses tr.* convention | Issue | Foundation backlog. |
| Orphan CSS stubs for unbuilt features | Issue | Foundation backlog. |
| Arabic gaps: units, ingredient names, desc, tags | Issue | Addressed across Foundation. |

### Dependencies
| Name | Category | Note |
|---|---|---|
| Scaling, nutrition, shopping depend on ingredient restructure | Dependency | Foundation must land first. |
| Health and meal logging depend on user accounts | Dependency | Phase 3 first, or an interim single-user mode. |
| Admin panel depends on the lookup tables | Dependency | Foundation feeds the admin dropdowns. |

### Decisions (open)
| Name | Category | Status | Recommended option |
|---|---|---|---|
| DEC1 · Nutrition numbers manual or computed | Decision | Open | Manual per recipe first; computed later. |
| DEC2 · AI assistant placement in roadmap | Decision | Open | Thin generic assistant earlier; page-tailored prompts later. |
| DEC3 · Auth approach | Decision | Open | Simpler owner-auth first; full JWT when accounts arrive. |
| DEC4 · Jordan retail pricing | Decision | Open | Defer; treat as Could, revisit in Phase 4. |
| DEC5 · Keep or descope Phase 3 social | Decision | Open | Decide at implementation; do not pre-commit the heaviest social features. |

---

## 12 · UAT Scripts

Step-by-step checks to run before a feature is called done.

**Bilingual rendering**
1. Open any recipe in English. Confirm names, ingredients, steps, and interface read in English.
2. Switch to Arabic. Confirm all four read in Arabic, the layout flips right to left, and no English remains on screen.
3. Confirm units (g, tsp, clove) and ingredient names appear in Arabic, not just the recipe title.

**Cook Mode**
1. Enter Cook Mode. Step through to a step with a wait time.
2. Start the timer; confirm countdown and the end alert.
3. Confirm you can move between steps without leaving the recipe.

**Price estimate**
1. Open a priced recipe. Confirm a total estimate and a per-ingredient breakdown with links.
2. Confirm staples are excluded from the total.
3. Confirm the "last checked" date shows.

**Portion scaling (when built)**
1. Note the 4-serving amounts. Set servings to 8.
2. Confirm measurable amounts doubled and "to taste" items did not.
3. Reload; confirm the saved recipe is unchanged.

---

## 13 · Phases (database content)

Create one row per phase. The relation and rollups are defined in Part 0.

| Name | Goal |
|---|---|
| Foundation | Sound ingredient data model, nutrition scaffolding, defects cleared, Arabic complete. |
| Phase 1 | Bilingual viewing and guided cooking, with scaling and link cards. |
| Phase 2 | Authenticated owner admin for bilingual recipes. |
| Phase 3 | User accounts and light social features. |
| Phase 4 | Meal planning, pantry, shopping list, and nutrition reporting. |
| Phase 5 | Recipe forking and the full AI assistant. |

---

## 14 · Progress Dashboard

Built from linked views per Part 0.4. Starting "current stage" line:

> **Current stage:** Foundation (ingredient restructure and defect cleanup), and closing the two open Phase 1 items (portion scaling, link cards).

Per-phase percentages come from the Phases database. The whole-project percentage comes from the "Is Done" column footer on the Requirements Ledger view. Done and Pending lists sit side by side beneath.

---

*End of document.*
