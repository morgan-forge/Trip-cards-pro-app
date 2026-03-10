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
└── docs/                     # Project docs (not part of the app)
    ├── CHANGELOG.md          # What shipped (per version)
    ├── TESTING.md
    ├── Product Roadmap.md    # What we're building next
    ├── SENSITIVITY_AUDIT.md  # What was removed from repo (trip content)
    └── (future: Engine & Data Flow.md)
```

**Trip content (canonical itineraries, models) is not in this repo.** Keep it in your Obsidian vault (e.g. `01 Travel/_plans/`, `01 Travel/_models/`) or locally. Use the app’s **Import trip JSON** to load a file from your machine.

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
| **App files at repo root** | `serve.sh` serves the repo root so `index.html` works. No path changes in the app. |
| **`docs/`** | Keeps TESTING, Roadmap, changelog, and sensitivity audit in one place; README stays at root for GitHub. |
| **No trip content in repo** | Canonical itineraries and models stay in Obsidian or local storage; see `docs/SENSITIVITY_AUDIT.md`. |

---

## Optional: group assets (e.g. `js/`, `css/`)

If you prefer a bit more structure for the app:

- Move `app.js` → `js/app.js`, `styles.css` → `css/styles.css`.
- In `index.html`: `href="css/styles.css"`, `src="js/app.js"`.
- In `manifest.webmanifest`, adjust paths if it references icons or similar.

Then the only “loose” files at root are `index.html`, `manifest.webmanifest`, and `serve.sh`. Not required for the app to work.

---

## Sensitivity audit

Trip-planning content (canonical itineraries, models, plans) has been **removed from this repo**. See **`docs/SENSITIVITY_AUDIT.md`** for what was removed and what remains. Trip data should live only in your Obsidian vault or local storage.

---

## Obsidian / local use

- This repo can live inside your vault or alongside it. The app and `serve.sh` assume they are run from the repo root.
- Keep canonical itineraries and models in your vault (e.g. `01 Travel/_plans/`, `01 Travel/_models/`); use **Import trip JSON** in the app to load a file from your machine.
