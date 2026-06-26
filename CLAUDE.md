# Lara's Kitchen — مطبخ لارا
## Project Briefing for Claude Code

---

## What This Is

A bilingual (Arabic/English) personal recipe website built by Lara Wahbi. It is a full-stack app with a React frontend and a FastAPI backend, deployed publicly and shared with friends and family. The goal is a beautiful, functional cooking companion — not a commercial product.

**Live URLs**
- Frontend: https://helpful-eclair-c9ce27.netlify.app (Netlify)
- Backend: https://laras-kitchen-production.up.railway.app (Railway)
- GitHub: https://github.com/larawahbi/laras-kitchen

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend | FastAPI (Python) |
| Database | PostgreSQL |
| Frontend hosting | Netlify |
| Backend hosting | Railway |
| Version control | GitHub |

---

## Language and Localisation

- The site is bilingual: **English (EN)** and **Arabic (AR)**
- A language toggle sits in the navbar — switching it flips the entire UI to RTL for Arabic
- **Current state:** UI headers and navigation labels are translated into Arabic. Recipe content (ingredients and instructions) remains in English only.
- Arabic uses right-to-left (RTL) layout — all layout logic must account for this
- The `lang` prop is passed down through components; there is a translations object for UI strings
- Do not translate recipe body content (ingredients, steps) — only UI chrome

---

## Project Structure

```
laras-kitchen/
├── CLAUDE.md
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js              # Root component, routing
│   │   ├── App.css
│   │   ├── index.js            # Entry point
│   │   ├── index.css           # Global styles
│   │   ├── config.js           # API base URL and env config
│   │   ├── styles/             # Shared CSS / style modules
│   │   └── components/         # All React components live here
│   ├── package.json
│   └── .env                    # REACT_APP_API_URL etc.
└── backend/
    ├── main.py                 # FastAPI app, all routes
    ├── models.py               # SQLAlchemy models
    ├── database.py             # DB connection and session
    ├── recipes_data.py         # Seed data / static recipe content
    ├── seed.py                 # Script to seed the database
    ├── requirements.txt
    ├── Procfile                # Railway process config
    ├── railway.json            # Railway deployment config
    └── .env                    # DATABASE_URL etc.
```

**Note:** `frontend/src/components/` contains all UI components. When auditing or editing the frontend, start here and in `App.js`. The backend entry point for all API routes is `main.py`.

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
| Background | `#FAF8F4` | Warm off-white / cream |
| Primary accent | `#7D9B76` | Sage green |
| Secondary accent | `#C4956A` | Dusty terracotta |
| Ingredient box | `#E8EDE6` | Light sage |
| Text primary | `#2C2C2C` | Soft dark charcoal |
| Text secondary | `#6B6560` | Warm mid-grey |

Card borders and shadows should be subtle and warm — no harsh lines or high-contrast outlines.

### Visual Style
Editorial, warm, high-end food publication feel. Think Ottolenghi cookbook meets a personal blog. Clean but not sterile.

---

## Confirmed Features and Layout

### Navigation
- Minimal navbar: Home, Cuisine, Meal Type, About, search icon, EN/AR toggle
- Full RTL flip when Arabic is active

### Home Page
- Hero section: title, tagline, banner food photo
- Recipe cards below: photo, name, cuisine tag, meal type, total time, serves — whole card is clickable

### Recipe Page
- Large photo at top for mains; bottom-left for sides
- Icons row (time, serves, etc.)
- Ingredients panel on the left in a sage-coloured box (`#E8EDE6`)
- Numbered steps on the right
- Step checkboxes in cooking mode
- Serving size adjuster that scales ingredient quantities and cost estimate dynamically
- Calories and AUD price estimate per recipe

### Additional Features
- AI assistant widget embedded (Claude-powered)
- Shopping list with Frugl links per ingredient
- Coles/Woolworths price scraping in the FastAPI backend (in progress)
- Admin panel for Lara to add, edit, and manage recipes with photos (planned)

---

## Known Issues to Fix

- Recipe photos do not match their recipes — some photos are not displaying at all
- Arabic translation is incomplete — not all components have been wired to the lang toggle
- Recipe content (ingredients, instructions) is English only and should stay that way for now

---

## Planned Next Steps (in order)

1. Full Arabic translation pass — every UI component wired to the lang/translations system
2. Fix recipe photos — match correct images to recipes, fix broken image paths
3. Coles/Woolworths price scraping added to FastAPI backend
4. Admin panel — authenticated interface for managing recipes and uploading photos
5. Public GitHub hosting polish — README, clean repo, shareable with friends

---

## Coding Preferences

- No quick fixes or patches left in the code — if something needs doing properly, do it properly or flag it
- No commented-out dead code left behind
- Consistent patterns across components — if one component handles lang a certain way, all should
- Ask before making structural changes to the backend or database schema
- Always report what you find before making changes, especially in a new session
- Keep components clean and readable — avoid deeply nested logic

---

## Working with Lara

- Lara reviews and directs — Claude drafts and executes
- Report findings before acting
- When in doubt about scope, ask
- Flag anything that looks like a leftover patch, inconsistency, or unfinished work

