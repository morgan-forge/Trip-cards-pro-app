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

- **Source of truth**: canonical itineraries (e.g. Japan 2026, Málaga, Champagne) live as JSON +
  markdown in Obsidian under `01 Travel/...`.
- **TCP’s job** is to *interpret* those itineraries and render:
  - pre‑trip planning views (emotional spine of the trip),
  - on‑trip daily cards with enough detail that I do not need to open Gmail,
  - post‑trip views that make it easy to reuse past days/trips when planning new ones.
- **Local‑first**: no shared backend, no multi‑user accounts. All data is either:
  - canonical JSON in the vault, or
  - derived render JSON / browser storage on my own devices.

---

## Where the truth lives

- **Canonical itineraries (authoritative)**:
  - Japan 2026: `[[Japan 2026 Canonical JSON]]`
  - Málaga weekend: `[[Málaga Spain 2026 canonical JSON]]`
  - Champagne short break: `[[Champagne France May 2026 Canonical JSON]]`
  - Shared models/spec:
    - `[[Trip Cards Pro specification]]`
    - `[[Dining Bands (Japan)]]`
    - Other travel models under `01 Travel/_models/…`

- **Email → JSON workflow**:
  - Booking emails land in Gmail.
  - Gemini converts them into structured JSON.
  - I paste/save those JSON blocks into Obsidian canonical notes.
  - TCP treats those booking records as *facts* and never silently edits them.

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
- Ability to search by **destination** (e.g. “Cardiff”) and pull up relevant past days across trips.
- Supports reuse: when planning a new trip, bring forward days/ideas that worked well before.

---

## Code & data locations (high level)

- This README and the web‑app prototype live in this folder:
  - `trip-cards-pro/README.md` (this file)
  - `trip-cards-pro/index.html`, `styles.css`, `app.js`, `manifest.webmanifest` (prototype UI)
- Canonical itineraries and models live under:
  - `trip-cards-pro/01 Travel/_plans/...`
  - `trip-cards-pro/01 Travel/_models/...`

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

- **0.1.0 – 2026‑03‑07**
  - Initial Obsidian‑first README for Trip Cards Pro.
  - Documented core modes (Planning / On‑trip / Post‑trip).
  - Linked to canonical itinerary notes and future roadmap documents.

