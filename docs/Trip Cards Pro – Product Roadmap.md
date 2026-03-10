---
title: Trip Cards Pro – Product Roadmap
type: project.roadmap
status: active
owners:
  - Jeremy Morgan
created: 2026-03-07
last_reviewed: 2026-03-07
tags:
  - trip_cards_pro
  - roadmap
  - product
version: 0.1.0
---

# Trip Cards Pro – Product Roadmap

This roadmap is written from a **product manager / business process** perspective for Trip Cards Pro (TCP).
It assumes:

- Canonical itineraries and models live in Obsidian (e.g. `[[Japan 2026 Canonical JSON]]`, `[[Trip Cards Pro specification]]`).
- TCP is a **local‑first view and execution layer** on top of that data.
- Modes: **Planning**, **On‑Trip**, **Post‑Trip**.

Cool ideas are captured, but the roadmap clearly separates **important/foundational** items from **nice‑to‑have/delight**.

---

## 0. Guiding principles

- **Canonical first**: truth lives in canonical JSON and booking evidence, not in the app.
- **Low cognitive load**: on‑trip cards should answer “what do we do today?” in one glance.
- **Layered depth**: first screen is calm; details appear on demand (concertina / expanders).
- **Local‑first**: everything must work offline on my own devices.
- **Obsidian‑friendly**: notes, schemas, and change logs remain comfortable to manage in Obsidian.

---

## 1. Release themes

High‑level releases, each with **Core (important)** and **Delight (cool)** features.

### Release 0.1 – On‑Trip MVP (Execution first)

**Goal:** Make Trip Cards Pro genuinely useful *during* a real trip (Japan 2026 is the test case).

- **Core (important)**
  - Define a **render schema for on‑trip cards** (e.g. `trip_cards_pro.on_trip.render.json`):
    - One object per calendar day with:
      - Day type (`travel_day_outbound`, `full_day_in_place`, etc.).
      - Headline (city, “Day X of Y”, emotional label).
      - Time‑critical events (flights, JR legs, fixed activities) with times and locations.
      - Meal board rows (PAID / OPEN / `—`) derived from canonical meal rules.
      - Links back to booking IDs and canonical sections.
  - Build an **interpreter script** that reads canonical JSON (Japan 2026) and produces on‑trip render JSON.
  - Update the TCP prototype UI so that:
    - `Today` shows the current day card with headline + key anchors.
    - `Upcoming` and `All` show the stack of future and all days.
    - Each card has **collapsible sections** for:
      - Transport details (flight numbers, bag‑drop windows).
      - Accommodation (hotel name, check‑in/out, breakfast rules, hotel role).
      - Booked activities (names, times, booking references).
  - Ensure **offline use** works (PWA or cached static assets).

- **Delight (cool)**
  - Gentle micro‑interactions: subtle animations when expanding/collapsing detail panels.
  - Visual emphasis on “anchor days” (Ginzan, Taenoyu, USJ, sumo) with special styling.
  - Simple **“what’s next?” strip** at the bottom of Today showing the next 1–2 anchors.

### Release 0.2 – Planning Mode (Pre‑trip emotional spine)

**Goal:** Provide a clear, emotional picture of what the trip will *feel* like before departure, without over‑claiming certainty.

- **Core (important)**
  - Define a **planning render schema** (e.g. `trip_cards_pro.planning.render.json`) that:
    - Shows one entry per day with sleep city, themes, and major anchors.
    - Distinguishes between:
      - `plans.committed` (solid facts or strong intent).
      - `plans.ideas` (softer options like Nara, izakaya experiments).
  - Build a planning interpreter for at least:
    - Japan 2026, Málaga, Champagne.
  - Add a **Planning view** in TCP:
    - Vertical day stack with emotional labels and icons.
    - Visual distinction between committed vs idea‑level items.

- **Delight (cool)**
  - Simple “energy profile” hints per day (heavy, medium, light) based on anchors.
  - Quick filters: show only “anchor days”, or only idea‑heavy days.
  - Ability to toggle “bookings overlay” on/off to see where facts already exist.

### Release 0.3 – Post‑Trip Library (Reflection & reuse)

**Goal:** Turn past trips into a library that helps plan new ones (e.g. Cardiff 2028 informed by Cardiff 2024/2026).

- **Core (important)**
  - Create a **Trip Index** structure that lists:
    - Trip name, date range, primary destinations.
    - Paths to their render JSON files.
  - Add a **Post‑Trip view** per trip:
    - Reuses on‑trip cards but allows:
      - Short per‑day **reflection notes** (what worked, what didn’t).
      - Simple tags (e.g. “too rushed”, “great pubs”, “perfect pacing”).
  - Implement a **destination search**:
    - Query by city (e.g. Cardiff) and show all matching days across all trips.

- **Delight (cool)**
  - A very simple “trip timeline map” (e.g. sequence of stops visually).
  - Aggregate stats per destination (nights spent, number of visits, common anchors).

### Release 0.4 – GenAI context export (late‑phase)

**Goal:** Let on‑device GenAI answer context‑aware questions using the same trip context TCP is using.

- **Core (important)**
  - Define a **“current day context” JSON** that includes:
    - Today’s date, time, timezone.
    - Current city / area and next location.
    - Today’s anchors (with times, locations, categories).
    - High‑level constraints (e.g. must be at station by 16:00).
  - Add an action in TCP to **export or share** this context:
    - V1: copy to clipboard or share as a file.
    - Later: integrate with specific GenAI apps on iPhone.

- **Delight (cool)**
  - Pre‑composed prompt seeds for common tasks:
    - “Suggest 3 dinner options near tonight’s hotel given our constraints.”
    - “Propose a low‑energy afternoon near our current location.”

---

## 2. Cross‑cutting work

These items support multiple releases and don’t belong to a single mode.

- **Schema and documentation**
  - Stabilise the canonical itinerary schema (`travel.itinerary.state.v5.x`) for use by TCP.
  - Define and document:
    - `trip_cards_pro.on_trip.render.json`
    - `trip_cards_pro.planning.render.json`
    - “current day context” JSON for GenAI export.
  - Maintain these specs in Obsidian:
    - `[[Trip Cards Pro specification]]`
    - `[[Trip Cards Pro – Engine & Data Flow]]`

- **Interpreter layer**
  - Implement a small, testable interpreter (likely TypeScript or Python) that:
    - Reads canonical JSON from the vault.
    - Applies interpretation rules (day types, meals, hotel roles).
    - Writes render JSONs into the `trip-cards-pro/` project folder.

- **UX & theming**
  - Ensure card layouts are **iPhone‑first** (440px logical width, safe‑area aware).
  - Support a small set of themes (e.g. Sunrise, Ocean, Forest, Mono) with consistent semantics.

---

## 3. Status and next decisions

At version **0.1.0** of this roadmap:

- A basic local‑only TCP prototype exists (`index.html`, `app.js`, `styles.css`) using a simplified JSON format.
- Canonical itineraries and models for several trips (Japan, Málaga, Champagne) already exist in the vault.

**Next decisions (for future me):**

- Confirm the **first “real” release target**:
  - Most likely **Release 0.1 – On‑Trip MVP** using Japan 2026 as the proving ground.
- Decide whether the interpreter is written in **TypeScript (Node)** or **Python**, based on where I’m more productive.
- Choose whether TCP’s UI stays **vanilla JS + HTML** for a while, or moves to a small framework once render JSON is stable.

---

## 4. Backlog

Items to pick up when capacity allows; not committed to a specific release.

- **Meal board label/content overlap (flat HTML cards)**  
  In the Japan 2026 TCP v2 flat HTML (`01 Travel/_plans/Japan/Views of the Japanese trip/Japan 2026 TCP v2.html`), the breakfast/lunch/dinner label column (e.g. “⏳ Breakfast”) is still overlapping or being overlapped by the description text in the meal board. Table layout + fixed column width + `<colgroup>` were tried; issue persists (e.g. on 2560px display). **Fix:** Revisit with a different approach (e.g. flexbox with `flex: 0 0 auto` on the label, or a two-column layout that doesn’t rely on table; or inspect at target viewport/zoom to find root cause). Priority: UX polish for on‑trip cards.

---

## Change log

- **0.1.1 – 2026‑03‑07**  
  Added **§4. Backlog** and logged meal board label/content overlap fix for Japan 2026 TCP v2 flat HTML.

