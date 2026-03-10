---
title: Trip Cards Pro
type: project.readme
status: active
owners:
  - Jeremy Morgan
scope:
  - personal_travel
  - local_first_app
created: 2026-03-07
last_reviewed: 2026-03-07
tags:
  - trip_cards_pro
  - travel
  - product
  - obsidian-first
version: 0.1.0
---

# Trip Cards Pro (TCP)

Trip Cards Pro is my **personal trip companion** for me and Christy.

It sits **on top of canonical itinerary data in Obsidian** and turns that into calm, glanceable
cards for three phases of a trip:

- **Planning mode** – what the trip will *feel* like before we go.
- **On‑trip mode** – what we need to know *today* so the day feels guided and calm.
- **Post‑trip mode** – what actually happened, and what we want to reuse next time.

This README is written **Obsidian‑first**: the default place I expect to open and edit it is inside
my vault. The implementation lives in the `trip-cards-pro/` folder that this file sits in.

---

## High‑level intent

- **Source of truth**: canonical itineraries live as JSON + markdown in Obsidian (e.g. under a folder like `01 Travel/...`), or in local files you load via the app.
- **TCP’s job** is to *interpret* those itineraries and render:
  - pre‑trip planning views (emotional spine of the trip),
  - on‑trip daily cards with enough detail that I do not need to open Gmail,
  - post‑trip views that make it easy to reuse past days/trips when planning new ones.
- **Local‑first**: no shared backend, no multi‑user accounts. All data is either:
  - canonical JSON in the vault, or
  - derived render JSON / browser storage on my own devices.

---

## Where the truth lives

- **Canonical itineraries** stay in your Obsidian vault (e.g. under `01 Travel/_plans/`, `01 Travel/_models/`) or in local files. This repo contains only the app code and product docs; no trip data. See `docs/SENSITIVITY_AUDIT.md`.
- **In the app**: use **Import trip JSON** to load a trip file from your machine. TCP treats booking records as *facts* and never silently edits them.

---

## Modes (business view)

### 1. Planning mode (pre‑trip)

**Job:** help us *feel* the trip and spot issues before we book everything.

- TCP acts as a **view layer** over canonical JSON:
  - shows a “trip spine” (days 1–N, sleep city, big anchors),
  - clearly distinguishes between **committed plans** and softer **ideas/options**,
  - keeps evidence and editing in Obsidian (not in TCP).
- Example inputs:
  - `plans.committed` and `plans.ideas` from canonical JSON,
  - booking snippets that anchor specific days or constraints.

### 2. On‑trip mode (execution)

**Job:** remove friction on the day. One glance should answer:

- Where are we today?
- What are the **time‑critical** things (flights, trains, fixed bookings)?
- What are we doing roughly morning/afternoon/evening?

Principles:

- Cards should be **glanceable first**, but have **deep details on demand**
  (e.g. concertina sections for bookings, transport, and activities).
- TCP should surface enough from canonical JSON that I rarely need to open Gmail.
- Future roadmap: be able to export **“current context”** (today + bookings + constraints)
  to an on‑device GenAI on iPhone for context‑aware questions.

### 3. Post‑trip mode (reflection and reuse)

**Job:** make past experience easy to mine when planning new trips.

- Static but rich look‑back per trip: what actually happened, what we liked, what we’d change.
- Ability to search by **destination** and pull up relevant past days across trips.
- Supports reuse: when planning a new trip, bring forward days/ideas that worked well before.

---

## Code & data locations (high level)

- This repo contains the **app** only: `README.md`, `index.html`, `styles.css`, `app.js`, `manifest.webmanifest`, `serve.sh`, and `docs/`. No canonical itineraries or trip data are stored here.
- Canonical itineraries and models live in your Obsidian vault or local storage; you load them into the app via **Import trip JSON**.

The long‑term intent is:

- **Obsidian**: canonical JSON + narrative + evidence.
- **Interpreter layer** (scripts): convert canonical JSON into TCP “render JSON”.
- **TCP web app**: pure view + light local state (theme, last trip, last view).

---

## Related notes & roadmap

- **Product roadmap** (to be built next):
  - `[[Trip Cards Pro – Product Roadmap]]`
- **Technical/engine design** (interpretation rules, schemas, data flow):
  - `[[Trip Cards Pro – Engine & Data Flow]]`

These notes should capture the evolving roadmap, milestones, and implementation details.
The README should stay relatively stable, describing *what* TCP is and *how* it fits into my vault.

---

## Change log

See **[[docs/CHANGELOG]]** (or `docs/CHANGELOG.md`) for version history. README stays stable; the changelog is the place for “what shipped.”

