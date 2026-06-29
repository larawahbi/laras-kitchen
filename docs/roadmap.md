# Roadmap

A staged release plan. Each phase is shippable on its own. Foundation comes first because everything ambitious downstream depends on it.

## Foundation — data model and cleanup

Lookup tables for units and ingredients, a relational recipe-ingredients table, nutrition scaffolding, defect fixes, and Arabic completion. No new user-facing feature, but the platform the later phases stand on. Highest priority, next to build.

## Phase 1 — Core MVP

Bilingual viewing, guided cooking, scaling, and link cards. Mostly delivered. Two items remain open, both depending on the Foundation data model:

- Portion / serving scaling
- Open Graph link cards (rich previews when a recipe is shared)

## Phase 2 — Owner Admin

Authenticated create and edit for bilingual recipes, with the form's dropdowns drawn from the Foundation lookup tables. Photo upload included.

## Phase 3 — Accounts & Social

User identity and light community features: registration, profiles, saved recipes, reviews, comments. Flagged as a candidate for descope if it proves heavier than its value.

There is a dependency to watch: per-person nutrition and meal logging in Phase 4 need accounts. So either Phase 3 lands first, or Phase 4 ships an interim single-user mode.

## Phase 4 — Planning, Pantry, Nutrition

The household utility suite, sequenced as: meal-prep planner, pantry inventory, generated shopping list, then health and nutrition reporting. Nutrition is presented as a general estimate, never as medical advice.

## Phase 5 — Forking & AI

Recipe version control (clone, modify, and re-share a variant) and the AI assistant in its fullest form. The assistant is cross-cutting and a thin generic version may appear earlier than this phase.

## Epics

Epics are capability areas that cut across phases. A phase is a release; an epic is a theme.

| Epic | Area |
|---|---|
| E1 | Localisation & Bilingual Content |
| E2 | Recipe Discovery & Viewing |
| E3 | Guided Cooking |
| E4 | Pricing & Grocery Costing |
| E5 | Recipe Data Model & Admin |
| E6 | Meal Planning & Pantry |
| E7 | Nutrition & Health |
| E8 | Community & Social |
| E9 | AI Assistant |
| E10 | Platform & Non-Functional |
