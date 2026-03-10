# Trip Cards Pro – Folder structure

Recommended layout and how it fits Obsidian + the web app.

---

## Target structure

```
trip-cards-pro/
├── README.md                 # Project overview (stays at root for GitHub)
├── STRUCTURE.md              # This file
├── .gitignore
│
├── index.html                # App entry (web root for serve.sh)
├── app.js
├── styles.css
├── manifest.webmanifest
├── serve.sh                  # Run from repo root; serves this tree
│
├── _archive/                 # Optional; for one-off / non-TCP files (keep or remove when empty)
│
├── docs/                     # Project docs (not part of the app)
│   ├── CHANGELOG.md          # What shipped (per version)
│   ├── TESTING.md
│   ├── Product Roadmap.md    # What we're building next
│   └── (future: Engine & Data Flow.md)
│
└── 01 Travel/                # Obsidian content – canonical itineraries & models
    ├── _models/              # Specs, preferences, reusable travel models
    │   └── _archive/         # Superseded models (was "99 archived superceded...")
    └── _plans/               # Trip-specific plans and outputs
        ├── Europe/
        ├── Japan/
        │   ├── (canonical JSON, cards, views)
        │   └── _experiments/ # Was "Experiments with the Japan trip planning"
        └── UK/
```

---

## Changelog vs roadmap vs GitHub

| What | Where | Purpose |
|------|--------|--------|
| **Changelog** | `docs/CHANGELOG.md` | *What shipped* – version history, release notes. Edit in the repo (and Obsidian); stays in the vault. |
| **Product roadmap** | `docs/Trip Cards Pro – Product Roadmap.md` | *What we're building next* – milestones, priorities, future features. |
| **GitHub Releases** | GitHub → Releases | Optional. Use if you want version tags (e.g. v0.2.0), a download/zip per release, and release notes on GitHub. You can paste from CHANGELOG.md or write short notes there; CHANGELOG.md remains the in-repo source of truth. |

**Recommendation:** Keep **change notes in the repo** (`docs/CHANGELOG.md`) and **roadmap in the repo** (`docs/Product Roadmap.md`) so they live in your vault and work with Obsidian. Use **GitHub Releases** only if you want tagged versions and a visible “Releases” tab on GitHub – then create a release when you ship a version and copy or summarise from CHANGELOG.

---

## Rationale

| Choice | Reason |
|--------|--------|
| **App files at repo root** | `serve.sh` serves the repo root so `index.html` and `01 Travel/...` URLs work. No path changes in the app. |
| **`docs/`** | Keeps TESTING, Roadmap, and future design docs in one place; README stays at root for GitHub and Obsidian. |
| **`01 Travel/` unchanged** | Your Obsidian links use this path (`[[Japan 2026 Canonical JSON]]` etc.). Renaming would break links. |
| **`_archive` under _models** | Clearer than "99 archived superceded..."; leading `_` keeps it at the bottom in file lists. |
| **`_experiments` under Japan** | Short, consistent name; keeps experiments next to the Japan plan they belong to. |

---

## Optional: group assets (e.g. `js/`, `css/`)

If you prefer a bit more structure for the app:

- Move `app.js` → `js/app.js`, `styles.css` → `css/styles.css`.
- In `index.html`: `href="css/styles.css"`, `src="js/app.js"`.
- In `manifest.webmanifest`, adjust paths if it references icons or similar.

Then the only “loose” files at root are `index.html`, `manifest.webmanifest`, and `serve.sh`. Not required for the app to work.

---

## Cleanups applied

1. **Morgans-Movies-Digital-Collection-fixed.html** → removed (wrong project); see “Recommended deletions” below.
2. **Double extensions** – `travel.hotel.preferences.europe.weekend.v2.md.md` and the Niigata file → renamed to `.md`.
3. **"99 archived superceded travel model files"** → renamed to `_archive` under `_models`.
4. **"Experiments with the Japan trip planning"** → renamed to `_experiments` under `01 Travel/_plans/Japan/`.

**Optional later:** Shorten "Views of the Japanese trip" to `_views` if you prefer; update `serve.sh` if you do.

---

## Recommended deletions (wrong folder / not TCP)

| File | Reason |
|------|--------|
| **`_archive/Morgans-Movies-Digital-Collection-fixed.html`** | Different project (movies collection). Not Trip Cards Pro. **Safe to delete.** |
| **`01 Travel/_plans/Europe/champagne_JC_May_2026.xlsx`** | Source spreadsheet. If `Champagne France May 2026 Canonical JSON.md` is the source of truth and you keep the xlsx elsewhere, delete to avoid duplication. |
| **`01 Travel/_plans/Japan/_experiments/`** (whole folder or selected files) | Drafts and experiments (e.g. "Japan 2026 Canonical JSON 1", "Nara to merge", "Claude shorter json"). After you’ve merged what you need into the main Japan plan and views, delete superseded files or the whole folder. |
| **`01 Travel/_models/_archive/European Weekend Hotel Preferences (Evidence-Based).md`** | Superseded by `travel.hotel.preferences.europe.weekend.v2.md`. Delete if you don’t need the old version for history. |

After deleting everything you don’t need from `_archive/`, you can remove the empty `_archive/` folder (or keep it for future one-offs).

---

## Obsidian notes

- This repo can live inside your vault (e.g. `vault/trip-cards-pro/`) or alongside it. The app and `serve.sh` assume they are run from the repo root.
- Canonical itinerary paths in the README and in your links should stay as `01 Travel/_plans/...` and `01 Travel/_models/...` so Obsidian resolution keeps working.
