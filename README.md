<div align="center">

# Lara's Kitchen · مطبخ لارا

**A digital cookbook with an editorial feel. Guided cooking, portion scaling, and real grocery costs, in Arabic and English.**

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?logo=netlify&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?logo=railway&logoColor=white)

[**Live site**](https://helpful-eclair-c9ce27.netlify.app) · [**API**](https://laras-kitchen-production.up.railway.app) · [**Business analysis docs**](./docs)

</div>

---

## What it is

A digital cookbook for the recipes a household actually cooks, built to feel like a food publication rather than a side project. A guided Cook Mode walks you through each dish with timers. Every recipe carries an indicative grocery cost, so you know what a meal runs before you shop. And each one reads in both English and colloquial Levantine Arabic, with a full right-to-left layout.

The build doubles as a portfolio piece. It is documented to a professional standard, from the business case through to a relational data model and a phased roadmap. That documentation lives in [`/docs`](./docs).

## The problem it solves

Everyday recipes get scattered across WhatsApp threads, video links, and screenshots, which makes them hard to find mid-cook. General recipe sites translate stiffly and miss natural Levantine Arabic, and most are cluttered with advertising. Lara's Kitchen puts the recipe, the cooking, and the cost in one clean, advert-free place, in both languages.

## Screenshots

<!--
  Drop the images below into a /screenshots folder at the repo root, named to match.
  Suggested set: english-view, arabic-rtl, cook-mode, cost-panel.
  Until the files are added, these will show as broken images, so add them before going public.
-->

| English | Arabic (RTL) | 
|---|---|
| ![English view](./screenshots/english-view.png) | ![Arabic RTL view](./screenshots/arabic-view.png) |
| ![English Recipe](./screenshots/english-view-recipe.png) | ![Arabic Recipe](./screenshots/arabic-view-recipe.png) |

| Cook Mode | Recipes View |
|---|---|
| ![Cook Mode](./screenshots/english-view-cook-mode.png) | ![Recipe View](./screenshots/english-view-grid.png) |

## Features

These are live today:

- Bilingual content for recipe names, ingredients, and steps, with a one-tap English/Arabic toggle
- Full right-to-left layout in Arabic, including units and ingredient names
- Browse and filter by cuisine and meal type
- A recipe detail page with prep and cook times, servings, and notes
- Cook Mode: a step-by-step guided view with countdown timers on timed steps
- Indicative grocery cost per recipe, with a per-ingredient breakdown and shop links, using Woolworths' public product search
- 14 recipes seeded with both languages and price data

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React (Create React App) |
| Backend | FastAPI (Python) |
| Database | PostgreSQL |
| Frontend hosting | Netlify, auto-deploy on push to `main` |
| Backend hosting | Railway, auto-deploy on push to `main` |
| Version control | GitHub |

## Architecture

```mermaid
flowchart LR
    user([Home Cook<br/>browser])
    fe["React client<br/>(Netlify)"]
    be["FastAPI<br/>(Railway)"]
    db[("PostgreSQL<br/>(Railway)")]
    wools["Woolworths<br/>public product search"]

    user -->|HTTPS| fe
    fe -->|REST over HTTPS| be
    be -->|read / write| db
    be -.->|background price fetch| wools
```

Prices are fetched in the background and cached in the database, so recipe pages stay fast and never call a third-party service on load.

## Running locally

The app is two parts. You'll need Python 3, Node, and a PostgreSQL database.

**Backend**

```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# create backend/.env with your database connection
echo "DATABASE_URL=postgresql://user:pass@host:5432/dbname" > .env

python3 seed.py            # seeds recipes if the table is empty
uvicorn main:app --reload  # serves the API on http://localhost:8000
```

**Frontend**

```bash
cd frontend
npm install

# create frontend/.env pointing at your local API
echo "REACT_APP_API_URL=http://localhost:8000" > .env

npm start                  # serves the site on http://localhost:3000
```

> The commands above follow the documented project structure. Check `backend/Procfile` and `frontend/package.json` if your setup differs.

## Project status and roadmap

The core recipe and cooking experience is live. The next body of work is foundational: moving ingredient quantities from text into a relational model, because portion scaling, nutrition, and shopping lists all depend on it.

| Phase | Focus | Status |
|---|---|---|
| Foundation | Relational ingredient data model, nutrition scaffolding, defect fixes, Arabic completion | In progress |
| Phase 1 — Core MVP | Bilingual viewing, guided cooking, scaling, link cards | Mostly done |
| Phase 2 — Owner Admin | Authenticated admin to add and edit bilingual recipes | Planned |
| Phase 3 — Accounts & Social | Registration, profiles, saved recipes, reviews | Planned |
| Phase 4 — Planning, Pantry, Nutrition | Meal planning, pantry, shopping list, nutrition reporting | Planned |
| Phase 5 — Forking & AI | Recipe variants and a context-aware AI assistant | Planned |

The full roadmap, requirements, and risk log are in [`/docs`](./docs).

## Business analysis

This project was specified before it was built. The [`/docs`](./docs) folder holds the working analysis behind it:

- [Business case](./docs/business-case.md) — the problem, the proposition, and why it is worth building
- [Roadmap](./docs/roadmap.md) — the staged release plan
- [Requirements](./docs/requirements.md) — the requirements ledger, epics, and MoSCoW priorities
- [RAID log](./docs/raid-log.md) — risks, assumptions, issues, dependencies, and open decisions
- [Architecture](./docs/architecture.md) — system context and process models
- [Data model](./docs/data-model.md) — the current state, the target relational model, and an ERD

## Design system

Editorial and warm, with a high-end food publication feel. Playfair Display for headlines, Inter for body and interface, on a warm off-white background with sage green and dusty terracotta accents.

## Author

Built by Lara Wahbi.
[LinkedIn](https://www.linkedin.com/in/laraamro/)

## License

Personal project. See [LICENSE](./LICENSE). The code is here to look through and learn from; please ask before reusing it. Recipe content is personal to the author.
