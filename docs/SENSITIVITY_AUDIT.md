# Sensitivity audit – Trip Cards Pro repo

Audit of what is trip-planning (sensitive) vs app-only. **Trip-planning content has been removed from the repo**; app and product docs remain.

---

## Removed from repo (trip-planning / sensitive)

| Path | Reason |
|------|--------|
| **`01 Travel/`** (entire directory) | Personal itineraries, bookings, preferences, and experiments. |
| `01 Travel/_models/` | Dining preferences (Japan), London airport, hotel preferences (Europe), Uk Rail, Trip Cards Pro specification, trip analysis formats. |
| `01 Travel/_models/_archive/` | Superseded preference models. |
| `01 Travel/_plans/Europe/` | Champagne, Málaga, Porto canonical JSON, cards, xlsx. |
| `01 Travel/_plans/Japan/` | Japan 2026 canonical JSON, views, experiments, Niigata/day-trip notes. |
| `01 Travel/_plans/UK/` | Cardiff 2026 plan and HTML. |

**Total:** 33 files under `01 Travel/`. These should live only in your Obsidian vault or local storage, not in GitHub.

---

## Kept in repo (app-only)

| Path | Reason |
|------|--------|
| `index.html`, `app.js`, `styles.css`, `manifest.webmanifest`, `serve.sh` | App code. No personal data. |
| `.gitignore` | Project ignore rules. |
| `README.md` | Project overview; wording made generic (no specific trip names). |
| `STRUCTURE.md` | Folder structure; updated to describe content as outside repo. |
| `docs/CHANGELOG.md` | App version history. |
| `docs/TESTING.md` | How to run and test the app. |
| `docs/Trip Cards Pro – Product Roadmap.md` | Product roadmap (features, releases). Mentions “Japan 2026” as a test case only; no itinerary data. |
| `docs/SENSITIVITY_AUDIT.md` | This file. |

---

## Git history

Removing files in a new commit removes them from the **current** tree. Old commits still contain the deleted content. If the repo might be made public or shared later, consider purging history with `git filter-repo` or BFG so that `01 Travel/` never appears in any commit. Otherwise, keep the repo **private**.

---

## After removal

- Trip content: keep in Obsidian (e.g. `01 Travel/` in your vault) or locally. Use **Import trip JSON** in the app to load a file from your machine.
- Repo: app + docs only. Safe to treat as “app code” for backup or sharing (if you ever create a public app-only clone).
