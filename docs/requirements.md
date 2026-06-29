# Requirements

The requirements ledger. Status reflects a code audit. The **Verified** column means the status is evidence-backed; where it is blank, the item is planned or assumed, not yet confirmed in code.

Priority uses MoSCoW: Must, Should, Could, Won't.

## Foundation

| Requirement | Type | Epic | Status | Priority | Verified |
|---|---|---|---|---|---|
| Units lookup table | Tech Task | E5 | To Do | Must | |
| Ingredients lookup table | Tech Task | E5 | To Do | Must | |
| Recipe-ingredients relational table + migration | Tech Task | E5 | To Do | Must | |
| Nutrition scaffolding columns | Tech Task | E7 | To Do | Should | |
| API assembles ingredients from new tables | Tech Task | E5 | To Do | Must | |
| Fix "Loading…" localisation defect | Defect | E1 | To Do | Should | ✓ |
| Refactor Hero.js to the shared localisation convention | Defect | E1 | To Do | Could | ✓ |
| Resolve orphan CSS stubs | Defect | E10 | To Do | Could | ✓ |
| Recipe descriptions in Arabic | User Story | E1 | To Do | Should | ✓ |
| Tags in Arabic | User Story | E1 | To Do | Could | ✓ |

Representative story: *As the owner, I want recipe ingredients stored relationally with quantity, unit, and ingredient references, so scaling, nutrition, and shopping can read real numbers.*

## Phase 1 — Core MVP

| Requirement | Type | Epic | Status | Priority | Verified |
|---|---|---|---|---|---|
| Bilingual UI with full RTL | User Story | E1 | Done | Must | ✓ |
| Language toggle | User Story | E1 | Done | Must | ✓ |
| Browse recipes | User Story | E2 | Done | Must | ✓ |
| Filter by cuisine and meal type | User Story | E2 | Done | Must | ✓ |
| Recipe detail page | User Story | E2 | Done | Must | ✓ |
| Cook Mode, step by step | User Story | E3 | Done | Must | ✓ |
| Step timers | User Story | E3 | Done | Must | ✓ |
| Arabic ingredients and steps content | User Story | E1 | Done | Must | ✓ |
| Price integration (backend) | User Story | E4 | Done | Should | ✓ |
| Frontend price display | User Story | E4 | Done | Should | ✓ |
| Portion / serving scaling | User Story | E3 | To Do | Should | |
| Open Graph link cards | User Story | E2 | To Do | Could | |

The two open items both depend on the Foundation data model. *Portion scaling: as a cook, I want to change the serving count and have ingredient amounts scale, so I can cook for a different number of people.*

## Phase 2 — Owner Admin

| Requirement | Type | Epic | Status | Priority |
|---|---|---|---|---|
| Owner authentication | User Story | E5 | To Do | Must |
| Create recipe with bilingual dropdowns | User Story | E5 | To Do | Must |
| Edit and update recipe | User Story | E5 | To Do | Must |
| Photo upload | User Story | E5 | To Do | Should |
| Preview and validate bilingual entry | User Story | E5 | To Do | Should |

## Phase 3 — Accounts & Social

Candidate for descope; see Decision DEC5 in the [RAID log](./raid-log.md).

| Requirement | Type | Epic | Status | Priority |
|---|---|---|---|---|
| Registration and login | User Story | E8 | To Do | Should |
| User profile | User Story | E8 | To Do | Should |
| Save / favourite recipes | User Story | E8 | To Do | Should |
| Reviews and ratings | User Story | E8 | To Do | Could |
| Comments | User Story | E8 | To Do | Could |

## Phase 4 — Planning, Pantry, Nutrition

| Requirement | Type | Epic | Status | Priority |
|---|---|---|---|---|
| Weekly meal-prep planner | User Story | E6 | To Do | Should |
| Pantry inventory with low-stock flags | User Story | E6 | To Do | Should |
| Generated shopping list (plan minus pantry) | User Story | E6 | To Do | Should |
| Tick off cooked and purchased items | User Story | E6 | To Do | Could |
| Health profile to intake target | User Story | E7 | To Do | Should |
| Daily and weekly nutrition report | User Story | E7 | To Do | Should |
| Meal logging | User Story | E7 | To Do | Should |
| Jordan retail pricing | User Story | E4 | To Do | Could |

*Nutrition report: as a user, I want to enter my age, weight, and gender and see whether my week met my intake and what was lacking. General estimate, not medical advice.*

## Phase 5 — Forking & AI

| Requirement | Type | Epic | Status | Priority |
|---|---|---|---|---|
| Fork (clone) a recipe | User Story | E8 | To Do | Could |
| Modify and re-share as a variant | User Story | E8 | To Do | Could |
| Variant indexing and discovery | User Story | E8 | To Do | Could |
| AI assistant: substitutions on recipe page | User Story | E9 | To Do | Should |
| AI assistant: tips on health page | User Story | E9 | To Do | Could |
| AI assistant: generic chat on all pages | User Story | E9 | To Do | Could |

## Acceptance criteria (sample)

Higher-complexity stories are written in Given / When / Then.

**Switching to Arabic flips the layout**
```
Given I am viewing a recipe in English
When I switch the language to Arabic
Then all interface text appears in Arabic
And the page layout reads right to left
And ingredient names and units appear in Arabic
And no English fallback text remains visible on screen
```

**Doubling the servings scales the ingredients** (open item)
```
Given a recipe written for 4 servings
When I set the servings to 8
Then each measurable ingredient amount doubles
And ingredients given as "to taste" or "a pinch" stay unchanged
And the original recipe is not overwritten
```

## Non-functional requirements

- **Localisation integrity.** No hardcoded user-facing strings; every component follows the shared localisation convention; full RTL with no layout breakage.
- **Performance.** Frontend served from the edge. Prices are cached in the database and never fetched on page load, which keeps recipe pages fast.
- **Data integrity.** Ingredients stored as structured data (quantity, unit, ingredient reference) from Foundation onward. This is the precondition for scaling, nutrition, and shopping.
- **Security.** API keys held on the backend only, never in the frontend. The owner admin sits behind authentication. The AI assistant is rate-limited to prevent runaway cost on a public site.
- **Maintainability.** Consistent language handling across components; no dead code; one concern per work session.
