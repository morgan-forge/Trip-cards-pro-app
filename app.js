const STORAGE_KEY_TRIP = "tripCardsPro.trip";
const STORAGE_KEY_THEME = "tripCardsPro.theme";

function parseISO(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-").map((v) => parseInt(v, 10));
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function formatRange(start, end) {
  if (!start || !end) return "";
  const opts = { month: "short", day: "numeric" };
  const s = start.toLocaleDateString(undefined, opts);
  const e = end.toLocaleDateString(undefined, opts);
  if (s === e) return s;
  return `${s} – ${e}`;
}

function dayDiff(a, b) {
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function todayLocal() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

function classifyLeg(leg, today) {
  const start = parseISO(leg.startDate);
  const end = parseISO(leg.endDate || leg.startDate);
  if (!start || !end) return "unknown";
  if (today < start) return "upcoming";
  if (today > end) return "past";
  return "current";
}

function loadTheme() {
  const saved = localStorage.getItem(STORAGE_KEY_THEME);
  return saved || "sunrise";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const select = document.getElementById("theme-select");
  if (select) select.value = theme;
}

function saveTheme(theme) {
  localStorage.setItem(STORAGE_KEY_THEME, theme);
}

function loadTrip() {
  const raw = localStorage.getItem(STORAGE_KEY_TRIP);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      console.warn("Failed to parse stored trip JSON, falling back to default.");
    }
  }
  const el = document.getElementById("default-trip-json");
  if (!el) return null;
  try {
    return JSON.parse(el.textContent || "{}");
  } catch {
    return null;
  }
}

function saveTrip(trip) {
  localStorage.setItem(STORAGE_KEY_TRIP, JSON.stringify(trip, null, 2));
}

function summariseTrip(trip) {
  if (!trip || !Array.isArray(trip.legs)) return "No trip loaded.";
  const count = trip.legs.length;
  const start = parseISO(trip.startDate || trip.legs[0]?.startDate);
  const end = parseISO(trip.endDate || trip.legs[trip.legs.length - 1]?.endDate);
  if (!start || !end) return `${count} legs`;
  const days = dayDiff(start, end) + 1;
  return `${trip.name || "Untitled trip"} • ${count} legs • ${days} days`;
}

function computeDerived(trip) {
  const today = todayLocal();
  const withMeta = (trip.legs || []).map((leg) => {
    const start = parseISO(leg.startDate);
    const end = parseISO(leg.endDate || leg.startDate);
    const kind = classifyLeg(leg, today);
    return { ...leg, _start: start, _end: end, _kind: kind };
  });
  const sorted = withMeta
    .slice()
    .sort((a, b) => (a._start && b._start ? a._start - b._start : 0));
  const todayLeg = sorted.find((l) => l._kind === "current") || null;
  const upcoming = sorted.filter((l) => l._kind === "upcoming");
  const past = sorted.filter((l) => l._kind === "past");
  const nextLeg = upcoming[0] || null;
  return { today, sorted, todayLeg, nextLeg, upcoming, past };
}

function renderTodayView(container, trip) {
  const state = computeDerived(trip);
  container.innerHTML = "";
  const wrapper = document.createElement("article");
  wrapper.className = "tcp-today-card";

  const headerLine = document.createElement("div");
  const pill = document.createElement("span");
  pill.className = "tcp-pill";
  pill.innerHTML = `<span class="tcp-pill-dot"></span><span>Today • ${state.today.toDateString()}</span>`;
  headerLine.appendChild(pill);
  wrapper.appendChild(headerLine);

  const main = document.createElement("div");
  main.className = "tcp-today-main";

  const left = document.createElement("div");
  const title = document.createElement("h2");
  const loc = document.createElement("p");
  title.className = "tcp-today-title";
  loc.className = "tcp-today-location";

  if (state.todayLeg) {
    title.textContent = state.todayLeg.title || "Today on your trip";
    loc.textContent = state.todayLeg.location || "";
  } else if (state.sorted.length === 0) {
    title.textContent = "No trip legs configured yet";
    loc.textContent = "Use the Trip Editor to add your first leg.";
  } else if (state.today < state.sorted[0]._start) {
    title.textContent = "Your trip hasn't started yet";
    loc.textContent = "Enjoy the anticipation.";
  } else {
    title.textContent = "This trip has finished";
    loc.textContent = "Time to plan the next one.";
  }

  left.appendChild(title);
  left.appendChild(loc);

  const meta = document.createElement("div");
  meta.className = "tcp-today-meta";

  if (state.todayLeg) {
    const range = document.createElement("span");
    range.className = "tcp-badge";
    range.textContent = formatRange(state.todayLeg._start, state.todayLeg._end);
    meta.appendChild(range);

    const kind = document.createElement("span");
    kind.className = "tcp-badge";
    kind.textContent = state.todayLeg.type === "travel" ? "Travel day" : "Stay";
    meta.appendChild(kind);

    const totalIndex = state.sorted.findIndex((l) => l.id === state.todayLeg.id);
    const idxBadge = document.createElement("span");
    idxBadge.className = "tcp-badge";
    idxBadge.textContent = `Leg ${totalIndex + 1} of ${state.sorted.length}`;
    meta.appendChild(idxBadge);
  }

  left.appendChild(meta);

  if (state.todayLeg && state.todayLeg.notes) {
    const notes = document.createElement("p");
    notes.className = "tcp-today-notes";
    notes.textContent = state.todayLeg.notes;
    left.appendChild(notes);
  }

  main.appendChild(left);

  const right = document.createElement("div");
  right.className = "tcp-today-secondary";

  if (state.nextLeg) {
    const nextCard = document.createElement("div");
    nextCard.className = "tcp-small-card";
    nextCard.innerHTML = `
      <div class="tcp-small-heading">Next leg</div>
      <div style="font-size:0.9rem;">${state.nextLeg.title || ""}</div>
      <div style="font-size:0.82rem;color:var(--tcp-text-soft);">${state.nextLeg.location || ""}</div>
      <div style="margin-top:0.25rem;font-size:0.8rem;">
        ${formatRange(state.nextLeg._start, state.nextLeg._end)}
      </div>
    `;
    right.appendChild(nextCard);
  }

  if (state.sorted.length > 0) {
    const tripCard = document.createElement("div");
    tripCard.className = "tcp-small-card";
    const start = parseISO(trip.startDate || state.sorted[0].startDate);
    const end = parseISO(trip.endDate || state.sorted[state.sorted.length - 1].endDate);
    const days = start && end ? dayDiff(start, end) + 1 : null;
    tripCard.innerHTML = `
      <div class="tcp-small-heading">Trip overview</div>
      <div style="font-size:0.9rem;">${trip.name || "Untitled trip"}</div>
      <div style="font-size:0.82rem;color:var(--tcp-text-soft);margin-top:0.25rem;">
        ${start && end ? formatRange(start, end) : ""}
      </div>
      <div style="font-size:0.8rem;margin-top:0.25rem;">
        ${state.sorted.length} legs${days ? ` • ${days} days` : ""}
      </div>
    `;
    right.appendChild(tripCard);
  }

  main.appendChild(right);
  wrapper.appendChild(main);
  container.appendChild(wrapper);
}

function renderLegList(container, trip, filterKind) {
  const { sorted, today } = computeDerived(trip);
  container.innerHTML = "";

  if (sorted.length === 0) {
    const empty = document.createElement("div");
    empty.className = "tcp-empty-state";
    empty.textContent = "No legs yet. Use the Trip Editor to add your first destination.";
    container.appendChild(empty);
    return;
  }

  const list = document.createElement("div");
  list.className = "tcp-leg-list";

  sorted.forEach((leg) => {
    if (filterKind && leg._kind !== filterKind) return;
    const card = document.createElement("article");
    card.className = "tcp-leg-card";
    if (leg._kind === "current") card.classList.add("tcp-leg--today");
    if (leg._kind === "past") card.classList.add("tcp-leg--past");

    const header = document.createElement("div");
    header.className = "tcp-leg-card-header";

    const left = document.createElement("div");
    const title = document.createElement("h3");
    const loc = document.createElement("p");
    title.className = "tcp-leg-title";
    loc.className = "tcp-leg-location";
    title.textContent = leg.title || "(No title)";
    loc.textContent = leg.location || "";
    left.appendChild(title);
    left.appendChild(loc);

    const right = document.createElement("div");
    right.className = "tcp-leg-meta";
    const badgeRange = document.createElement("span");
    badgeRange.className = "tcp-badge";
    badgeRange.textContent = formatRange(leg._start, leg._end);
    right.appendChild(badgeRange);
    const badgeType = document.createElement("span");
    badgeType.className = "tcp-badge";
    badgeType.textContent = leg.type === "travel" ? "Travel" : "Stay";
    right.appendChild(badgeType);

    const days = dayDiff(todayLocal(), leg._start);
    if (leg._kind === "upcoming") {
      const badgeCountdown = document.createElement("span");
      badgeCountdown.className = "tcp-badge tcp-badge-strong";
      badgeCountdown.textContent = days === 0 ? "Today" : days === 1 ? "Tomorrow" : `In ${days} days`;
      right.appendChild(badgeCountdown);
    } else if (leg._kind === "past") {
      const badgeAgo = document.createElement("span");
      badgeAgo.className = "tcp-badge";
      badgeAgo.textContent = `${Math.abs(days)} days ago`;
      right.appendChild(badgeAgo);
    }

    header.appendChild(left);
    header.appendChild(right);
    card.appendChild(header);

    if (leg.notes) {
      const notes = document.createElement("p");
      notes.className = "tcp-leg-notes";
      notes.textContent = leg.notes;
      card.appendChild(notes);
    }

    if (Array.isArray(leg.tags) && leg.tags.length) {
      const tagsEl = document.createElement("div");
      tagsEl.className = "tcp-leg-tags";
      leg.tags.forEach((tag) => {
        const t = document.createElement("span");
        t.className = "tcp-tag";
        t.textContent = tag;
        tagsEl.appendChild(t);
      });
      card.appendChild(tagsEl);
    }

    list.appendChild(card);
  });

  container.appendChild(list);
}

function renderTripSummary(trip) {
  const el = document.getElementById("trip-summary");
  if (!el) return;
  el.textContent = summariseTrip(trip);
}

function bindNav(trip) {
  const buttons = Array.from(document.querySelectorAll(".tcp-nav-btn"));
  const views = {
    today: document.getElementById("view-today"),
    upcoming: document.getElementById("view-upcoming"),
    all: document.getElementById("view-all"),
    editor: document.getElementById("view-editor")
  };

  function show(view) {
    buttons.forEach((btn) => {
      btn.classList.toggle("tcp-nav-btn--active", btn.dataset.view === view);
    });
    Object.entries(views).forEach(([key, node]) => {
      if (!node) return;
      node.classList.toggle("tcp-view--active", key === view);
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const v = btn.dataset.view;
      if (!v) return;
      show(v);
    });
  });

  show("today");
  renderTodayView(views.today, trip);
  renderLegList(views.upcoming, trip, "upcoming");
  renderLegList(views.all, trip, null);
}

function validateTrip(trip) {
  const errors = [];
  if (!trip.name) errors.push("Trip name is required.");
  if (!Array.isArray(trip.legs) || trip.legs.length === 0) {
    errors.push("At least one leg is required.");
    return errors;
  }
  let lastEnd = null;
  trip.legs.forEach((leg, index) => {
    const start = parseISO(leg.startDate);
    const end = parseISO(leg.endDate || leg.startDate);
    if (!start || !end) {
      errors.push(`Leg ${index + 1}: invalid dates.`);
      return;
    }
    if (end < start) {
      errors.push(`Leg ${index + 1}: end date is before start date.`);
    }
    if (lastEnd && start < lastEnd) {
      errors.push(`Leg ${index + 1}: overlaps with previous leg.`);
    }
    lastEnd = end;
    if (!leg.title) {
      errors.push(`Leg ${index + 1}: title is required.`);
    }
    if (!leg.location) {
      errors.push(`Leg ${index + 1}: location is required.`);
    }
  });
  return errors;
}

function renderEditor(container, trip, onChange) {
  container.innerHTML = "";
  const form = document.createElement("form");
  form.className = "tcp-form";

  const tripGrid = document.createElement("div");
  tripGrid.className = "tcp-form-grid";
  tripGrid.innerHTML = `
    <div class="tcp-field">
      <label for="trip-name">Trip name</label>
      <input id="trip-name" class="tcp-input" required />
    </div>
    <div class="tcp-field">
      <label for="trip-start">Trip start</label>
      <input id="trip-start" type="date" class="tcp-input" />
    </div>
    <div class="tcp-field">
      <label for="trip-end">Trip end</label>
      <input id="trip-end" type="date" class="tcp-input" />
    </div>
    <div class="tcp-field">
      <label for="trip-description">Description</label>
      <textarea id="trip-description" class="tcp-textarea" rows="2"></textarea>
    </div>
  `;
  form.appendChild(tripGrid);

  const legsSection = document.createElement("div");
  legsSection.className = "tcp-legs-editor";

  const legsHeader = document.createElement("div");
  legsHeader.className = "tcp-leg-edit-header";
  legsHeader.innerHTML = `
    <span>Legs</span>
    <div class="tcp-leg-edit-actions">
      <button type="button" id="btn-add-leg" class="tcp-chip-btn">+ Add leg</button>
    </div>
  `;
  legsSection.appendChild(legsHeader);

  const legsContainer = document.createElement("div");
  legsSection.appendChild(legsContainer);
  form.appendChild(legsSection);

  const errorEl = document.createElement("div");
  errorEl.className = "tcp-error";
  form.appendChild(errorEl);

  const actionsRow = document.createElement("div");
  actionsRow.style.display = "flex";
  actionsRow.style.justifyContent = "flex-end";
  actionsRow.style.gap = "0.5rem";
  actionsRow.innerHTML = `
    <button type="button" id="btn-discard" class="tcp-secondary">Revert changes</button>
    <button type="submit" class="tcp-primary">Save trip</button>
  `;
  form.appendChild(actionsRow);

  function ensureLegIds(legs) {
    return legs.map((leg, idx) => ({
      id: leg.id || `leg-${idx + 1}`,
      ...leg
    }));
  }

  let workingTrip = {
    id: trip.id || "trip-1",
    name: trip.name || "",
    description: trip.description || "",
    startDate: trip.startDate || "",
    endDate: trip.endDate || "",
    timezone: trip.timezone || "local",
    legs: ensureLegIds(trip.legs || [])
  };

  function syncTripFields() {
    document.getElementById("trip-name").value = workingTrip.name;
    document.getElementById("trip-start").value = workingTrip.startDate || "";
    document.getElementById("trip-end").value = workingTrip.endDate || "";
    document.getElementById("trip-description").value = workingTrip.description || "";
  }

  function renderLegEditors() {
    legsContainer.innerHTML = "";
    if (!workingTrip.legs.length) {
      const empty = document.createElement("div");
      empty.className = "tcp-empty-state";
      empty.textContent = "No legs yet. Add your first destination or travel day.";
      legsContainer.appendChild(empty);
      return;
    }

    workingTrip.legs.forEach((leg, index) => {
      const card = document.createElement("div");
      card.className = "tcp-leg-edit";
      card.innerHTML = `
        <div class="tcp-leg-edit-header">
          <span>Leg ${index + 1}</span>
          <div class="tcp-leg-edit-actions">
            <button type="button" class="tcp-chip-btn" data-move="up" data-index="${index}">↑</button>
            <button type="button" class="tcp-chip-btn" data-move="down" data-index="${index}">↓</button>
            <button type="button" class="tcp-chip-btn" data-remove="${index}">Remove</button>
          </div>
        </div>
        <div class="tcp-form-grid">
          <div class="tcp-field">
            <label>Title</label>
            <input class="tcp-input" data-field="title" data-index="${index}" value="${leg.title || ""}" />
          </div>
          <div class="tcp-field">
            <label>Location</label>
            <input class="tcp-input" data-field="location" data-index="${index}" value="${leg.location || ""}" />
          </div>
          <div class="tcp-field">
            <label>Start</label>
            <input type="date" class="tcp-input" data-field="startDate" data-index="${index}" value="${leg.startDate || ""}" />
          </div>
          <div class="tcp-field">
            <label>End</label>
            <input type="date" class="tcp-input" data-field="endDate" data-index="${index}" value="${leg.endDate || ""}" />
          </div>
          <div class="tcp-field">
            <label>Type</label>
            <select class="tcp-select" data-field="type" data-index="${index}">
              <option value="stay"${leg.type === "stay" ? " selected" : ""}>Stay</option>
              <option value="travel"${leg.type === "travel" ? " selected" : ""}>Travel</option>
            </select>
          </div>
          <div class="tcp-field">
            <label>Tags (comma separated)</label>
            <input class="tcp-input" data-field="tags" data-index="${index}" value="${(leg.tags || []).join(", ")}" />
          </div>
        </div>
        <div class="tcp-field">
          <label>Notes</label>
          <textarea class="tcp-textarea" rows="2" data-field="notes" data-index="${index}">${leg.notes || ""}</textarea>
        </div>
      `;
      legsContainer.appendChild(card);
    });
  }

  syncTripFields();
  renderLegEditors();

  form.addEventListener("input", (ev) => {
    const target = ev.target;
    if (!(target instanceof HTMLElement)) return;
    const field = target.getAttribute("data-field");
    const indexStr = target.getAttribute("data-index");
    if (field && indexStr != null) {
      const index = parseInt(indexStr, 10);
      if (Number.isNaN(index)) return;
      if (field === "tags") {
        workingTrip.legs[index].tags = target.value
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      } else {
        workingTrip.legs[index][field] = target.value;
      }
      return;
    }

    if (target.id === "trip-name") workingTrip.name = target.value;
    if (target.id === "trip-start") workingTrip.startDate = target.value;
    if (target.id === "trip-end") workingTrip.endDate = target.value;
    if (target.id === "trip-description") workingTrip.description = target.value;
  });

  form.addEventListener("click", (ev) => {
    const target = ev.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.id === "btn-add-leg") {
      workingTrip.legs.push({
        id: `leg-${workingTrip.legs.length + 1}`,
        title: "New leg",
        location: "",
        startDate: "",
        endDate: "",
        type: "stay",
        notes: "",
        tags: []
      });
      renderLegEditors();
      ev.preventDefault();
      return;
    }
    if (target.id === "btn-discard") {
      workingTrip = JSON.parse(JSON.stringify(trip));
      ensureLegIds(workingTrip.legs || []);
      syncTripFields();
      renderLegEditors();
      errorEl.textContent = "";
      ev.preventDefault();
      return;
    }
    const move = target.getAttribute("data-move");
    const removeIndex = target.getAttribute("data-remove");
    if (move) {
      const idx = parseInt(target.getAttribute("data-index") || "0", 10);
      if (!Number.isNaN(idx)) {
        const delta = move === "up" ? -1 : 1;
        const to = idx + delta;
        if (to >= 0 && to < workingTrip.legs.length) {
          const copy = workingTrip.legs.slice();
          const [item] = copy.splice(idx, 1);
          copy.splice(to, 0, item);
          workingTrip.legs = copy;
          renderLegEditors();
        }
      }
      ev.preventDefault();
      return;
    }
    if (removeIndex != null) {
      const idx = parseInt(removeIndex, 10);
      if (!Number.isNaN(idx)) {
        workingTrip.legs.splice(idx, 1);
        renderLegEditors();
      }
      ev.preventDefault();
      return;
    }
  });

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    errorEl.textContent = "";
    const errors = validateTrip(workingTrip);
    if (errors.length) {
      errorEl.textContent = errors.join(" ");
      return;
    }
    saveTrip(workingTrip);
    onChange(workingTrip);
  });

  container.appendChild(form);
}

function exportTrip(trip) {
  const blob = new Blob([JSON.stringify(trip, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const name = (trip && trip.name ? trip.name : "trip").toLowerCase().replace(/\s+/g, "-");
  a.href = url;
  a.download = `${name}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importTrip(file, onLoaded) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || "{}"));
      if (!parsed || !parsed.legs) throw new Error("Missing legs array");
      saveTrip(parsed);
      onLoaded(parsed);
    } catch (err) {
      alert("Could not import trip JSON. The file must be valid JSON with a top-level \"legs\" array (e.g. [{ \"id\", \"type\", \"startDate\", \"title\", \"location\" }]). Check the file and try again.");
      console.error(err);
    }
  };
  reader.readAsText(file);
}

function registerTheme() {
  const theme = loadTheme();
  applyTheme(theme);
  const select = document.getElementById("theme-select");
  if (!select) return;
  select.addEventListener("change", () => {
    const value = select.value || "sunrise";
    applyTheme(value);
    saveTheme(value);
  });
}

function initTripCardsPro() {
  let trip = loadTrip() || {
    id: "trip-1",
    name: "New trip",
    description: "",
    startDate: "",
    endDate: "",
    timezone: "local",
    legs: []
  };

  registerTheme();
  renderTripSummary(trip);

const viewToday = document.getElementById("view-today");
const viewUpcoming = document.getElementById("view-upcoming");
const viewAll = document.getElementById("view-all");
const viewEditor = document.getElementById("view-editor");
const viewTcp = document.getElementById("view-tcp");



  bindNav(trip);
  renderEditor(viewEditor, trip, (updatedTrip) => {
    trip = updatedTrip;
    renderTripSummary(trip);
    if (viewToday) renderTodayView(viewToday, trip);
    if (viewUpcoming) renderLegList(viewUpcoming, trip, "upcoming");
    if (viewAll) renderLegList(viewAll, trip, null);
  });

  const btnExport = document.getElementById("btn-export");
  const btnImport = document.getElementById("btn-import");
  const fileInput = document.getElementById("file-input");

  if (btnExport) {
    btnExport.addEventListener("click", () => exportTrip(trip));
  }

  if (btnImport && fileInput) {
    btnImport.addEventListener("click", () => {
      fileInput.click();
    });
    fileInput.addEventListener("change", () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;
      importTrip(file, (newTrip) => {
        trip = newTrip;
        renderTripSummary(trip);
        if (viewToday) renderTodayView(viewToday, trip);
        if (viewUpcoming) renderLegList(viewUpcoming, trip, "upcoming");
        if (viewAll) renderLegList(viewAll, trip, null);
        renderEditor(viewEditor, trip, (updatedTrip) => {
          trip = updatedTrip;
          renderTripSummary(trip);
          if (viewToday) renderTodayView(viewToday, trip);
          if (viewUpcoming) renderLegList(viewUpcoming, trip, "upcoming");
          if (viewAll) renderLegList(viewAll, trip, null);
        });
      });
      fileInput.value = ""; // allow selecting the same file again
    });
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("sw.js")
      .catch((err) => console.warn("Service worker registration failed", err));
  }
}

document.addEventListener("DOMContentLoaded", initTripCardsPro);

