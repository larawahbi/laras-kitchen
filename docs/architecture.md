# Architecture

## System context

```mermaid
flowchart LR
    user([Home Cook<br/>browser])
    fe["React client<br/>(Netlify)"]
    be["FastAPI<br/>(Railway)"]
    db[("PostgreSQL<br/>(Railway)")]
    wools["Woolworths<br/>public product search"]
    ai["AI model provider<br/>(future)"]

    user -->|HTTPS| fe
    fe -->|REST over HTTPS| be
    be -->|read / write| db
    be -.->|background price fetch| wools
    be -.->|future| ai
```

The browser loads the React client from Netlify. The client calls the FastAPI backend over HTTPS. The backend reads and writes PostgreSQL. A background process fetches indicative prices from Woolworths' public search and caches them in the database, so nothing third-party is called on page load. Two future actors are shown dotted: a nutrition calculation process, and the AI assistant calling an external model provider from the backend.

## Process — create a bilingual recipe (target, Phase 2)

```mermaid
flowchart TD
    a[Owner authenticates] --> b[Opens the admin form]
    b --> c["Selects ingredients and units<br/>from dropdowns fed by lookup tables"]
    c --> d[Enters quantities and bilingual text]
    d --> e[Previews both languages]
    e --> f[Saves]
    f --> g[(Recipe written relationally<br/>no hand-edited JSON)]
```

## Process — weekly meal prep to shopping list (target, Phase 4)

```mermaid
flowchart TD
    a[User picks recipes for the week] --> b[Saves the plan]
    b --> c[System aggregates the plan's ingredients]
    c --> d[User marks what the pantry holds]
    d --> e[System subtracts pantry stock]
    e --> f[Shopping list produced]
    f --> g[User ticks items off as bought or cooked]
    f -.-> h[Plan optionally feeds a nutrition report]
```

This second flow depends on two things: the relational ingredient model, to aggregate quantities, and user accounts, to hold a personal plan and pantry.

## Localisation approach

User-facing strings live in a single source of truth and are keyed by language. Components read the active language from a shared prop rather than holding their own copies. Right-to-left layout is driven by a body-level class so that switching language flips the whole page in one place. Recipe content falls back to English where an Arabic value is missing, so a partly translated recipe still renders.
