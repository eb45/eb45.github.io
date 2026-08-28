(function () {
  const win = document.querySelector(".desk .win");
  const path = document.querySelector(".path");
  const panes = Array.from(document.querySelectorAll(".pane[id]"));
  const openers = Array.from(document.querySelectorAll("[data-open]"));
  const menus = Array.from(document.querySelectorAll(".menu"));
  const ids = new Set(panes.map((pane) => pane.id));

  const parent = {
    sea: "projects",
    pediatric: "projects",
    ttc: "projects",
  };
  const projectGroup = document.querySelector(".project-group");
  const spreadBtn = document.querySelector("[data-spread]");
  const backBtn = document.querySelector(".bar .back");

  function setSpread(open) {
    projectGroup?.classList.toggle("is-open", open);
    spreadBtn?.setAttribute("aria-expanded", open ? "true" : "false");
  }
  const labels = {
    about: "C:\\EMMA\\about",
    "about-site": "C:\\EMMA\\about\\site",
    plm: "C:\\EMMA\\plm-research",
    projects: "C:\\EMMA\\projects",
    sea: "C:\\EMMA\\projects\\sea-temp",
    pediatric: "C:\\EMMA\\projects\\pediatric",
    ttc: "C:\\EMMA\\projects\\ttc",
  };

  function closeMenus() {
    menus.forEach((menu) => menu.classList.remove("is-open"));
    const activity = document.getElementById("activity");
    const activityBtn = document.getElementById("activity-btn");
    if (activity) activity.hidden = true;
    activityBtn?.classList.remove("is-open");
    activityBtn?.setAttribute("aria-expanded", "false");
  }

  function show(id) {
    if (!ids.size) {
      if (id) location.href = "/#" + id;
      return;
    }
    if (id === "term") id = "about";
    if (!ids.has(id)) return;

    win?.classList.remove("is-shut");
    panes.forEach((pane) => pane.classList.toggle("is-on", pane.id === id));
    openers.forEach((el) => el.classList.toggle("is-open", el.dataset.open === id));
    if (path) path.textContent = labels[id] || "C:\\EMMA\\" + id;
    if (backBtn) {
      const up = parent[id];
      backBtn.hidden = !up;
      if (up) {
        backBtn.dataset.open = up;
        backBtn.setAttribute("aria-label", "Back to " + up);
      }
    }
    if (projectGroup?.classList.contains("is-open")) spreadBtn?.classList.add("is-open");
    if (location.hash.slice(1) !== id) history.replaceState(null, "", "#" + id);
  }

  function hideWin() {
    win?.classList.add("is-shut");
    panes.forEach((pane) => pane.classList.remove("is-on"));
    openers.forEach((el) => el.classList.remove("is-open"));
    if (path) path.textContent = "C:\\EMMA";
    if (backBtn) backBtn.hidden = true;
    if (projectGroup?.classList.contains("is-open")) spreadBtn?.classList.add("is-open");
    if (location.hash) history.replaceState(null, "", location.pathname);
  }

  menus.forEach((menu) => {
    menu.querySelector(".menu-btn")?.addEventListener("click", (event) => {
      event.stopPropagation();
      const open = menu.classList.contains("is-open");
      closeMenus();
      menu.classList.toggle("is-open", !open);
    });
  });

  document.addEventListener("click", closeMenus);

  openers.forEach((el) => {
    el.addEventListener("click", (event) => {
      if (el.tagName === "A" && el.getAttribute("href")?.startsWith("http")) return;
      event.preventDefault();
      event.stopPropagation();
      closeMenus();
      if (el.hasAttribute("data-spread")) {
        const opening = !projectGroup?.classList.contains("is-open");
        setSpread(opening);
        if (opening) show("projects");
        else {
          const on = panes.find((pane) => pane.classList.contains("is-on"));
          if (on && (on.id === "projects" || parent[on.id])) hideWin();
        }
        return;
      }
      show(el.dataset.open);
    });
  });

  document.querySelector("[data-close]")?.addEventListener("click", hideWin);

  const projects = [
    { label: "PLM Research", open: "plm" },
    { label: "Subsurface sea temp prediction", open: "sea" },
    { label: "Pediatric domain adaptation", open: "pediatric" },
    { label: "Autonomous vehicle TTC prediction", open: "ttc" },
  ];

  const spot = document.getElementById("spot");
  const spotBtn = document.getElementById("spot-btn");
  const spotInput = document.getElementById("spot-input");
  const spotList = document.getElementById("spot-list");
  let spotIndex = 0;

  function renderSpot(query) {
    const q = query.trim().toLowerCase();
    const hits = projects.filter((item) => item.label.toLowerCase().includes(q));
    spotList.innerHTML = "";
    hits.forEach((item, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = item.label;
      if (i === spotIndex) btn.classList.add("is-on");
      btn.addEventListener("click", () => {
        closeSpot();
        show(item.open);
      });
      spotList.appendChild(btn);
    });
    return hits;
  }

  function openSpot() {
    spot.hidden = false;
    spotIndex = 0;
    renderSpot("");
    spotInput.value = "";
    spotInput.focus();
  }

  function closeSpot() {
    spot.hidden = true;
  }

  spotBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    closeMenus();
    if (spot.hidden) openSpot();
    else closeSpot();
  });

  spot?.addEventListener("click", (event) => {
    if (event.target === spot) closeSpot();
  });

  spotInput?.addEventListener("input", () => {
    spotIndex = 0;
    renderSpot(spotInput.value);
  });

  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (spot.hidden) openSpot();
      else closeSpot();
      return;
    }
    if (event.key === "Escape") {
      closeSpot();
      closeMenus();
      return;
    }
    if (spot.hidden) return;
    const hits = projects.filter((item) =>
      item.label.toLowerCase().includes(spotInput.value.trim().toLowerCase())
    );
    if (event.key === "ArrowDown") {
      event.preventDefault();
      spotIndex = Math.min(spotIndex + 1, Math.max(hits.length - 1, 0));
      renderSpot(spotInput.value);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      spotIndex = Math.max(spotIndex - 1, 0);
      renderSpot(spotInput.value);
    }
    if (event.key === "Enter" && hits[spotIndex]) {
      event.preventDefault();
      closeSpot();
      show(hits[spotIndex].open);
    }
  });

  const hash = location.hash.slice(1);
  if (hash && ids.has(hash)) show(hash);
  else show("about");
})();

(function () {
  const clock = document.getElementById("clock");
  if (!clock) return;

  function tick() {
    const now = new Date();
    clock.dateTime = now.toISOString();
    clock.textContent = now.toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  tick();
  setInterval(tick, 15000);
})();

(function () {
  const btn = document.getElementById("activity-btn");
  const pop = document.getElementById("activity");
  const graph = document.getElementById("activity-graph");
  const months = document.getElementById("activity-months");
  const meta = document.getElementById("activity-meta");
  if (!btn || !pop || !graph) return;

  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let loaded = false;

  function closeActivity() {
    pop.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    btn.classList.remove("is-open");
  }

  function weekday(date) {
    return new Date(date + "T00:00:00").getDay();
  }

  function monthOf(day) {
    return day ? new Date(day.date + "T00:00:00").getMonth() : -1;
  }

  function render(data) {
    const days = data.contributions || [];
    if (!days.length) {
      graph.textContent = "No contribution data yet.";
      return;
    }

    const weeks = [];
    let col = new Array(weekday(days[0].date)).fill(null);

    days.forEach((day) => {
      if (col.length === 7) {
        weeks.push(col);
        col = [];
      }
      col.push(day);
    });
    if (col.length) {
      while (col.length < 7) col.push(null);
      weeks.push(col);
    }

    graph.replaceChildren();
    months?.replaceChildren();

    weeks.forEach((week, i) => {
      const column = document.createElement("div");
      column.className = "week";
      week.forEach((day) => {
        const cell = document.createElement("span");
        cell.className = "day";
        if (!day) cell.classList.add("empty");
        else {
          cell.classList.add("l" + day.level);
          const when = new Date(day.date + "T00:00:00").toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          const n = day.count || 0;
          cell.title = (n === 0 ? "No contributions" : n + (n === 1 ? " contribution" : " contributions")) + " on " + when;
        }
        column.appendChild(cell);
      });
      graph.appendChild(column);

      const label = document.createElement("span");
      const current = monthOf(week.find(Boolean));
      const previous = i ? monthOf(weeks[i - 1].find(Boolean)) : -1;
      if (current !== previous && current >= 0) label.textContent = names[current];
      months?.appendChild(label);
    });

    const total = data.total?.lastYear ?? days.reduce((sum, day) => sum + (day.count || 0), 0);
    if (meta) meta.textContent = total + " contributions in the last year";
  }

  async function load() {
    if (loaded) return;
    try {
      const res = await fetch("https://github-contributions-api.jogruber.de/v4/eb45?y=last");
      if (!res.ok) throw new Error("bad response");
      render(await res.json());
      loaded = true;
    } catch (err) {
      graph.textContent = "Could not load the contribution grid.";
      if (meta) meta.innerHTML = '<a href="https://github.com/eb45">Open GitHub instead</a>';
    }
  }

  btn.addEventListener("click", (event) => {
    event.stopPropagation();
    document.querySelectorAll(".menu.is-open").forEach((menu) => menu.classList.remove("is-open"));
    const spot = document.getElementById("spot");
    if (spot) spot.hidden = true;
    if (pop.hidden) {
      pop.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      btn.classList.add("is-open");
      load();
    } else {
      closeActivity();
    }
  });

  pop.addEventListener("click", (event) => event.stopPropagation());
  document.addEventListener("click", closeActivity);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeActivity();
  });
})();
