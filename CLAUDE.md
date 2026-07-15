# Lara's Kitchen — مطبخ لارا
## Project Briefing for Claude Code

---

## What This Is

A bilingual (Arabic/English) personal recipe website built by Lara Wahbi. Full-stack app with a React frontend and FastAPI backend, deployed publicly and shared with friends and family. The goal is a beautiful, functional cooking companion — not a commercial product.

**Live URLs**
- Frontend: https://helpful-eclair-c9ce27.netlify.app (Netlify)
- Backend: https://laras-kitchen-production.up.railway.app (Railway)
- GitHub: https://github.com/larawahbi/laras-kitchen

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Create React App) |
| Backend | FastAPI (Python) |
| Database | PostgreSQL (Railway) |
| Frontend hosting | Netlify (auto-deploys on push to main) |
| Backend hosting | Railway (auto-deploys on push to main) |
| Version control | GitHub |

**Critical version note:** SQLAlchemy 2.x is in use. All raw SQL executed via `engine.connect()` or `session` must be wrapped in `sqlalchemy.text()`. Never use bare strings in `conn.execute()`.

---

## Project Structure

React Router (react-router-dom) is in use. Routing is handled in `App.js` with `BrowserRouter`, `Routes`, and `Route`. `Layout.js` holds the persistent nav and footer via `Outlet`. Per-recipe URLs take the form `/recipe/:id`.

```
laras-kitchen/
├── CLAUDE.md
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── _redirects          # Netlify SPA fallback — rewrites all paths to index.html
│   ├── src/
│   │   ├── App.js              # Root component, React Router setup, API fetch, lang state
│   │   ├── App.css
│   │   ├── index.js
│   │   ├── index.css
│   │   ├── config.js           # API base URL
│   │   ├── translations.js     # All UI strings in EN and AR — single source of truth
│   │   ├── styles/
│   │   │   └── main.css        # Main stylesheet — imported by App.js
│   │   ├── assets/
│   │   │   ├── logo.png        # Simple logo
│   │   │   ├── logo.svg        # Simple logo (SVG)
│   │   │   └── logo_detailed.png  # Detailed logo — used on About page
│   │   ├── hooks/
│   │   │   └── useInView.js    # Intersection observer hook for scroll-reveal animations
│   │   └── components/
│   │       ├── Layout.js       # Persistent nav, footer, Outlet — wraps all main routes
│   │       ├── Hero.js
│   │       ├── Filters.js
│   │       ├── RecipeCard.js
│   │       ├── RecipeDetail.js
│   │       ├── CookMode.js
│   │       ├── Loading.js      # Animated loading screen (SVG pot) — uses tr.loading
│   │       └── About.js        # About page — structure wired, content is placeholder
│   ├── package.json
│   └── .env                    # REACT_APP_API_URL
└── backend/
    ├── main.py                 # FastAPI app, all routes
    ├── models.py               # SQLAlchemy models
    ├── database.py             # DB connection and session (uses python-dotenv)
    ├── recipes_data.py         # Seed data — source of truth for recipe content
    ├── seed.py                 # Seeds DB from recipes_data.py — skips if rows exist
    ├── migrate.py              # Migration log and script — see migrations section below
    ├── update_arabic.py        # Updates ingredients_ar and steps_ar on existing rows
    ├── woolworths.py           # Woolworths search API integration
    ├── fetch_prices.py         # Manual price fetch script — run with python3 fetch_prices.py
    ├── staples.py              # Staple ingredient list and is_staple() function
    ├── seed_search_terms.py    # Seeds ingredient_search_terms lookup table
    ├── requirements.txt
    ├── Procfile
    ├── railway.json
    └── .env                    # DATABASE_URL (Railway PostgreSQL)
```

---

## Database Schema

### `recipes` table
| Column | Type | Notes |
|---|---|---|
| id | Integer | Primary key |
| name | String | English name |
| name_ar | String | Arabic name |
| cuisine | String | English only |
| meal_type | String | English only |
| prep_time | Integer | Minutes |
| cook_time | Integer | Minutes |
| total_time | Integer | Minutes |
| serves | Integer | |
| rating | String | |
| calories | Integer | |
| estimated_cost | Float | |
| tags | JSON | English only |
| side_dishes | String | English only |
| my_notes | String | English only |
| source_link | String | |
| source_type | String | |
| youtube_id | String | |
| is_side | Boolean | |
| cover_img | String | Filename or URL — do not overwrite |
| desc | String | English only |
| ingredients | JSON | Structure: [{group, items: [{amount, name}]}] |
| steps | JSON | Structure: [{title, text, wait_mins}] |
| ingredients_ar | JSON | Same structure as ingredients — Arabic name only, amounts stay English |
| steps_ar | JSON | Same structure as steps — Arabic title and text |
| price_total | Float | AUD, excludes staples, set by fetch_prices.py |
| price_last_checked | Timestamp | Set by fetch_prices.py |
| desc_ar | Text | Arabic description — added in Migration 8; 5 of 14 recipes populated |

### `recipe_ingredient_prices` table
| Column | Type | Notes |
|---|---|---|
| id | Serial | Primary key |
| recipe_id | Integer | FK to recipes.id |
| ingredient_name | String | Matches item name in ingredients JSON |
| woolworths_product_name | String | |
| woolworths_brand | String | |
| woolworths_weight | String | |
| woolworths_price | Float | AUD |
| woolworths_url | String | Full Woolworths product URL |
| fetched_at | Timestamp | |

### `ingredient_search_terms` table
| Column | Type | Notes |
|---|---|---|
| ingredient_name | String | Primary key — matches item name in ingredients JSON |
| search_term | String | Clean term sent to Woolworths API |

### `units` table
| Column | Type | Notes |
|---|---|---|
| code | VARCHAR | Primary key (e.g. `tbsp`, `tsp`, `cup`, `g`, `kg`, `clove`, `pinch`, `to_taste`) |
| name_en | VARCHAR | English display name |
| name_ar | VARCHAR | Arabic display name |
| unit_type | VARCHAR | `volume`, `weight`, `count`, or `informal` |
| scalable | Boolean | False for `pinch` and `to_taste` |

### `ingredients` table
| Column | Type | Notes |
|---|---|---|
| id | Serial | Primary key |
| name_en | VARCHAR | English name — unique per ingredient |
| name_ar | VARCHAR | Arabic name (may be empty string if no AR translation was found) |
| is_staple | Boolean | True if `is_staple()` matched — skipped in price fetching |
| search_term | VARCHAR | Woolworths search term, seeded from `ingredient_search_terms` |
| calories_per_100g | Float | Null — reserved for future nutrition work |
| protein_per_100g | Float | Null — reserved |
| carbs_per_100g | Float | Null — reserved |
| fat_per_100g | Float | Null — reserved |
| grams_per_cup | Float | Null — reserved |
| grams_per_tbsp | Float | Null — reserved |
| grams_per_unit | Float | Null — reserved |

### `recipe_ingredients` table
| Column | Type | Notes |
|---|---|---|
| id | Serial | Primary key |
| recipe_id | Integer | FK to recipes.id |
| group_name | VARCHAR | Optional group heading (e.g. "For the sauce") |
| sort_order | Integer | Display order within the recipe |
| quantity | Float | Parsed numeric quantity; null for `pinch` / `to_taste` |
| unit_code | VARCHAR | FK to units.code; null if no unit |
| ingredient_id | Integer | FK to ingredients.id |
| note | VARCHAR | Freeform note (e.g. "medium", range string) |

> **Design decision:** `units`, `ingredients`, and `recipe_ingredients` are intentionally queried via the `_RI_QUERY` raw SQL constant in `main.py` — no SQLAlchemy ORM models exist for these three tables. Amount formatting logic lives in `_format_amount_en` / `_format_amount_ar` in `main.py`. `recipes.ingredients` and `recipes.ingredients_ar` JSON columns are kept as fallback. Do not flag the missing ORM models as a gap.

---

## Migrations Applied

All migrations are applied against the live Railway PostgreSQL database. There is no Alembic. Future migrations go in `migrate.py` using `sqlalchemy.text()`.

- **Migration 1** — Added `ingredients_ar` and `steps_ar` columns to `recipes`
- **Migration 2** — Created `recipe_ingredient_prices` table with `coles_*` columns
- **Migration 3** — Renamed `coles_*` columns to `woolworths_*` in `recipe_ingredient_prices`
- **Migration 4** — Created `ingredient_search_terms` table
- **Migration 5** — Added `price_total` and `price_last_checked` to `recipes`
- **Migration 6** — Created `units` and `ingredients` tables; seeded standard units (tbsp, tsp, cup, g, kg, clove, pinch, to_taste)
- **Migration 7** — Created `recipe_ingredients` table; migrated all ingredient rows out of `recipes.ingredients` JSON into relational form; created `recipes_backup` as a safety snapshot
- **Migration 8** — Added `desc_ar` column to `recipes`

---

## Localisation System

- Language toggle in navbar switches between EN and AR
- `lang` prop is passed from `App.js` down to every child component
- All UI strings live in `translations.js` as `t.en` and `t.ar`
- Components derive `const tr = t[lang]` and use `tr.*` keys — never hardcode strings
- RTL layout is handled via `body.ar` CSS class — all RTL rules go there
- Recipe name uses `recipe.name_ar` when `lang === 'ar'`, falls back to `recipe.name`
- Ingredients and steps use `recipe.ingredients_ar` / `recipe.steps_ar` when `lang === 'ar'`, fall back to English if null

---

## Woolworths Price Integration

### How it works
- `woolworths.py` — queries Woolworths' public product search for a term and returns the top match, used for indicative pricing
- `staples.py` — `is_staple(name)` returns True for water, salt, sugar, flour, oil, butter, garlic, onion, common spices etc. — these are skipped entirely
- `ingredient_search_terms` table — maps raw ingredient names to clean Woolworths search terms (e.g. "potatoes, peeled and sliced" → "potatoes")
- `fetch_prices.py` — manual script, run with `python3 fetch_prices.py`. Use `--force` to overwrite existing data
- Prices are cached in the database — not fetched live on page load

### Running a price fetch
```bash
cd backend
python3 fetch_prices.py          # skips already-priced ingredients
python3 fetch_prices.py --force  # overwrites all existing prices
```

### API endpoints
- `GET /api/recipes/{id}/prices` — returns price_total, price_last_checked, and ingredient price list
- `GET /api/recipes/{id}/prices/refresh` — triggers fresh fetch for one recipe

### Important notes
- Pricing relies on Woolworths' public search, which can change without notice; prices are indicative only
- Ingredient search term mismatches can return wrong products — check output when running fetch
- Adding new ingredients requires a new row in `ingredient_search_terms`
- Do not overwrite `cover_img`, `desc`, `my_notes`, or any manually edited field without explicit instruction

---

## Data Safety Rules

- `seed.py` skips entirely if any rows exist — safe to run, will not overwrite
- `update_arabic.py` only writes to `ingredients_ar` and `steps_ar` — does not touch other fields
- `fetch_prices.py` only writes to `price_total`, `price_last_checked`, and `recipe_ingredient_prices` — does not touch recipe content
- Never drop and recreate any table
- Never overwrite a field that has a non-null value unless `--force` is explicitly passed
- `cover_img` values have been manually edited in the database — treat as read-only

---

## Design System

### Typography
| Role | Font |
|---|---|
| Headlines | Playfair Display |
| Body and UI | Inter |
| Decorative accents only | Dancing Script (use sparingly) |

### Colour Palette
| Token | Hex | Use |
|---|---|---|
| Background | `#FAF8F4` | Warm off-white |
| Primary accent | `#7D9B76` | Sage green |
| Secondary accent | `#C4956A` | Dusty terracotta |
| Ingredient box | `#E8EDE6` | Light sage |
| Text primary | `#2C2C2C` | Soft dark charcoal |
| Text secondary | `#6B6560` | Warm mid-grey |

### Visual Style
Editorial, warm, high-end food publication feel. Clean but not sterile. Card borders and shadows should be subtle and warm.

---

## Current State and Next Steps

### Completed
- Bilingual UI with full RTL support
- Recipe browsing and filtering by cuisine and meal type
- Recipe detail page
- Cook Mode with step-by-step instructions and timers
- Arabic content pipeline — ingredients_ar and steps_ar in database
- Woolworths price integration — fetch script, lookup table, API endpoints
- Price and cost data populated in database for all 14 recipes
- Frontend price display — price line on recipe cards, price stat in detail page stat strip, grocery estimate panel with per-ingredient Woolworths product names, prices, and shop links
- React Router — per-recipe URLs (`/recipe/:id`), persistent header via Layout.js, Netlify SPA routing via `public/_redirects`
- Loading screen — animated SVG pot, uses `tr.loading` for bilingual text
- Relational ingredient data model — `units`, `ingredients`, and `recipe_ingredients` tables; `recipes.ingredients` JSON kept as fallback
- `desc_ar` column added to `recipes`; wired through API and frontend; 5 of 14 recipes populated

### Planned (in order)
1. Logo in the top banner
2. Recipe photo strip at the bottom — reorderable, with a short intro to each recipe
3. About page content
4. Contact page content
5. Fix recipe photos — match correct images, fix broken paths
6. Serving size adjuster with dynamic ingredient scaling
7. Shopping list with per-ingredient Woolworths links
8. Admin panel v1 — recipe management and photo upload
9. AI cooking assistant widget
10. desc, my_notes, side_dishes in Arabic
11. Tags in Arabic
12. Staple ingredient proportional pricing
13. Public launch polish

---

## Known Issues

- Recipe photos do not all match their recipes — some broken
- `desc_ar` is wired through model, API, and frontend, but only 5 of 14 recipes have Arabic descriptions; `my_notes` and `side_dishes` have no Arabic equivalent at all
- Tags have no Arabic equivalent yet
- Cuisine and meal type filter labels translated via lookup map in translations.js — verify all values are covered
- `Hero.js` bypasses the `tr.*` convention: renders both an EN and AR `<h1>` simultaneously and toggles visibility via `body.ar` CSS, instead of using `tr.hero_title_line1` / `tr.hero_title_em`
- `main.css` contains CSS stubs for four unbuilt features: search overlay (`.search-overlay`), serving size adjuster (`.serving-adjuster`), shopping list modal (`.modal-overlay`, `.shopping-list-item`), and AI assistant widget (`.ai-fab`, `.ai-panel`)

---

## Coding Preferences

- No quick fixes or patches — do it properly or flag it
- No commented-out dead code
- Consistent patterns across components — if one component handles lang a certain way, all should
- Ask before making structural changes to the backend or database schema
- Always report findings before making changes, especially in a new session
- Keep components clean and readable
- One concern per Claude Code session — do not mix feature work and cleanup

---

## Working with Lara

- Lara reviews and directs — Claude drafts and executes
- Report findings before acting
- When in doubt about scope, ask
- Flag anything that looks like a leftover patch, inconsistency, or unfinished work
- Do not clean up while a feature is still being built — cleanup is a separate session after the feature is complete and committed
