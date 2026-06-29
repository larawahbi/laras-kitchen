# RAID Log

Risks, Assumptions, Issues, Dependencies, and Decisions. Kept current as the project moves.

## Risks

| Risk | Likelihood | Impact | Response |
|---|---|---|---|
| Pricing depends on a third-party public search that can change or restrict access | Medium | Medium | Accept; check fetch output; isolate the integration so a break degrades gracefully and prices simply go stale rather than breaking the page. |
| Railway has no permanent free tier for a database-backed app | High | Low–Medium | Accept roughly five dollars a month on the Hobby plan, or move Postgres to a free-DB provider if staying free becomes a hard requirement. |
| AI assistant cost abuse on a public site | Medium | Medium | Rate-limit and cap usage; keep the key on the backend only. |
| RTL layout shifts when adding new components | Medium | Medium | Defensive CSS; test both directions on every new component. |
| Ingredient migration mis-parses amounts | Medium | Low | Log every ambiguous line and resolve by hand. Small task at 15 recipes. |

## Assumptions

| Assumption | Note |
|---|---|
| Single content author for now | Admin built for one owner; multi-author not required yet. |
| Small recipe set (15) | Manual migration and manual nutrition entry are feasible at this size. |
| Nutrition entered manually per recipe initially | Avoids the harder computed path until later. |

## Issues (current defects)

| Issue | Note |
|---|---|
| "Loading…" shows English when the language is Arabic | Foundation backlog. |
| Hero heading bypasses the shared localisation convention | Foundation backlog. |
| Orphan CSS stubs for features not yet built | Foundation backlog. |
| Arabic gaps: units, some ingredient names, descriptions, tags | Addressed across Foundation. |

## Dependencies

| Dependency | Note |
|---|---|
| Scaling, nutrition, and shopping depend on the ingredient restructure | Foundation must land first. |
| Health and meal logging depend on user accounts | Phase 3 first, or an interim single-user mode in Phase 4. |
| Admin panel depends on the lookup tables | Foundation feeds the admin dropdowns. |

## Decisions (open)

| ID | Decision | Status | Leaning |
|---|---|---|---|
| DEC1 | Nutrition numbers: manual or computed | Open | Manual per recipe first; computed later. |
| DEC2 | AI assistant placement in the roadmap | Open | Thin generic assistant earlier; page-tailored prompts later. |
| DEC3 | Auth approach | Open | Simpler owner-auth first; full token auth when accounts arrive. |
| DEC4 | Jordan retail pricing | Open | Defer; treat as Could, revisit in Phase 4. |
| DEC5 | Keep or descope Phase 3 social | Open | Decide at implementation; do not pre-commit the heaviest social features. |
