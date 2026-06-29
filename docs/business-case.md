# Business Case

## Vision

A single bilingual home for the recipes a family actually cooks, that does the practical work around cooking as well as holding the recipe: guiding the cook step by step, scaling portions, estimating the grocery bill, planning the week, and tracking what the week did to your nutrition. Built for a household that lives across Adelaide and Amman and cooks in both English and Levantine Arabic.

## The problem

Everyday recipes are scattered across WhatsApp threads, video links, and screenshots, which makes them hard to find mid-cook. General recipe sites translate stiffly and miss colloquial Levantine Arabic. Most are cluttered with advertising and lack clean cooking tools. The related household jobs, things like budgeting, the pantry, meal planning, and nutrition, get handled in separate places or not at all.

## The proposition

One clean, bilingual, advert-free application that brings together the recipe, the cooking, the cost, the plan, and the nutrition, with authentic Arabic and an interface designed for use while cooking.

## Why it is worth building

Beyond personal use, the project demonstrates end-to-end delivery: requirements, data modelling, a real bilingual product, third-party integration, and a staged release. That is the portfolio value.

## Business case in brief

The cost is time, plus a small hosting fee. Railway has no permanent free tier suitable for a database-backed app, so expect roughly five dollars a month once the trial credit lapses. The return is a genuinely useful tool for the household, and a substantial, honest portfolio artefact.

## Scope

**In scope across the lifecycle.** Bilingual recipe content and viewing; guided cooking; portion scaling; grocery cost estimates; an owner admin area; user accounts and light social features; meal planning, pantry, and shopping lists; nutrition and health tracking; recipe forking; a context-aware AI assistant.

**Out of scope.** Commercial features such as payments, advertising, and monetisation. Native mobile apps; the product is responsive web. Direct enterprise retailer integrations; pricing relies on a public search. Anything implying medical advice; the health feature presents general estimates only.

## Stakeholders and personas

**Primary — the Home Cook.** Family and friends across Adelaide and Amman. Mobile-first, often reading while cooking, switching between English and Arabic. Wants recipes that are easy to find, easy to follow hands-busy, and written in natural language including Levantine Arabic. Cares about portion sizes and rough cost.

**Owner — Lara (Content Owner / Admin).** Desktop-first when adding or editing recipes. Needs an efficient, validated way to enter bilingual content without touching the database by hand. This is the persona the Foundation lookup tables and the Phase 2 admin panel exist to serve.

**Secondary — the Household Manager.** A cook focused on reducing the grocery bill, planning the week, and keeping an eye on nutrition. The Phase 4 audience.

**System actor.** Background processes: the price fetch, future nutrition calculation, and the AI assistant. Non-functional needs such as cost ceilings, key handling, and performance attach here.
