(function () {
  const win = document.querySelector(".desk .win");
  const path = document.querySelector(".path");
  const panes = Array.from(document.querySelectorAll(".pane[id]"));
  const openers = Array.from(document.querySelectorAll("[data-open]"));
  const menus = Array.from(document.querySelectorAll(".menu"));
  const ids = new Set(panes.map((pane) => pane.id));

  const backBtn = document.querySelector(".bar .back");
  const labels = {
    about: "C:\\EMMA\\about",
    "about-site": "C:\\EMMA\\about\\site",
    plm: "C:\\EMMA\\plm-research",
    projects: "C:\\EMMA\\projects",
    sea: "C:\\EMMA\\projects\\sea-temp",
    pediatric: "C:\\EMMA\\projects\\pediatric",
    ttc: "C:\\EMMA\\projects\\ttc",
    work: "C:\\EMMA\\experience",
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
    if (backBtn) backBtn.hidden = true;
    if (location.hash.slice(1) !== id) history.replaceState(null, "", "#" + id);
    if (id === "about") {
      resetWelcome();
      requestAnimationFrame(focusWelcome);
    }
  }

  function hideWin() {
    win?.classList.add("is-shut");
    panes.forEach((pane) => pane.classList.remove("is-on"));
    openers.forEach((el) => el.classList.remove("is-open"));
    if (path) path.textContent = "C:\\EMMA";
    if (backBtn) backBtn.hidden = true;
    if (location.hash) history.replaceState(null, "", location.pathname);
  }

  menus.forEach((menu) => {
    if (!menu.querySelector(".menu-list")) return;
    menu.querySelector(".menu-btn")?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const open = menu.classList.contains("is-open");
      closeMenus();
      menu.classList.toggle("is-open", !open);
    });
    menu.querySelector(".menu-list")?.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest(".menu")) return;
    closeMenus();
  });

  openers.forEach((el) => {
    el.addEventListener("click", (event) => {
      if (el.tagName === "A" && el.getAttribute("href")?.startsWith("http")) return;
      event.preventDefault();
      event.stopPropagation();
      closeMenus();
      show(el.dataset.open);
    });
  });

  document.querySelector("[data-close]")?.addEventListener("click", hideWin);

  const projects = [
    { label: "Work experience", open: "work" },
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
    focusWelcome();
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

  const welcomeLog = document.getElementById("welcome-log");
  const welcomeForm = document.getElementById("welcome-form");
  const welcomeIn = document.getElementById("welcome-in");
  const HOME = "/Users/emma";
  const files = {
    ".profile": "Duke University\nElectrical/Computer Engineering and Computer Science",
  };
  const listings = {
    "": [".profile", "hobbies/", "projects/"],
    hobbies: ["running", "reading", "baking", "playing piano", "playing guitar"],
    projects: [
      "PLM Research",
      "Subsurface sea temp",
      "Pediatric domain adaptation",
      "AV TTC prediction",
    ],
  };
  const openMap = {
    projects: "projects",
    project: "projects",
    plm: "plm",
    research: "plm",
    sea: "sea",
    "sea-temp": "sea",
    pediatric: "pediatric",
    ttc: "ttc",
    about: "about",
    site: "about-site",
    "about-site": "about-site",
    work: "work",
    experience: "work",
    job: "work",
    jobs: "work",
  };
  const cmdHistory = [];
  let historyAt = 0;

  function welcomeReady() {
    if (!welcomeIn) return false;
    if (!document.getElementById("about")?.classList.contains("is-on")) return false;
    if (win?.classList.contains("is-shut")) return false;
    if (spot && !spot.hidden) return false;
    const activity = document.getElementById("activity");
    if (activity && !activity.hidden) return false;
    return true;
  }

  function resetWelcome() {
    welcomeLog?.replaceChildren();
    if (welcomeIn) welcomeIn.value = "";
    cmdHistory.length = 0;
    historyAt = 0;
    document.getElementById("about")?.scrollTo(0, 0);
  }

  function focusWelcome() {
    if (!welcomeReady()) return;
    welcomeIn.focus({ preventScroll: true });
  }

  function normalize(raw) {
    if (!raw || raw === "~" || raw === "." || raw === "./") return "";
    let path = String(raw).trim();
    if (path === HOME || path === HOME + "/") return "";
    if (path.startsWith("~/")) path = path.slice(2);
    else if (path.startsWith(HOME + "/")) path = path.slice(HOME.length + 1);
    else if (path.startsWith("/")) return null;
    path = path.replace(/\/+$/, "");
    const parts = [];
    for (const part of path.split("/")) {
      if (!part || part === ".") continue;
      if (part === "..") parts.pop();
      else parts.push(part);
    }
    return parts.join("/");
  }

  function kind(path) {
    if (path === null) return "missing";
    if (Object.prototype.hasOwnProperty.call(listings, path)) return "dir";
    if (Object.prototype.hasOwnProperty.call(files, path)) return "file";
    return "missing";
  }

  function resolvePath(raw) {
    const path = normalize(raw);
    if (kind(path) !== "missing") return path;
    if (path === null) return null;
    const name = String(raw).replace(/\/+$/, "").split("/").pop();
    if (!name) return path;
    const fileHits = Object.keys(files).filter((key) => key === name || key.endsWith("/" + name));
    if (fileHits.length === 1) return fileHits[0];
    const dirHits = Object.keys(listings).filter((key) => key === name);
    if (dirHits.length === 1) return dirHits[0];
    return path;
  }

  function echo(text, className) {
    if (!welcomeLog || text == null || text === "") return;
    const pre = document.createElement("pre");
    pre.className = className || "welcome-echo welcome-out";
    pre.textContent = text;
    welcomeLog.appendChild(pre);
  }

  function replay(cmd) {
    if (!welcomeLog) return;
    const line = document.createElement("div");
    line.className = "welcome-replay";
    const ps1 = document.createElement("span");
    ps1.className = "welcome-ps1";
    ps1.textContent = "emma@duke ~ %";
    const typed = document.createElement("span");
    typed.className = "welcome-cmd";
    typed.textContent = cmd;
    line.append(ps1, typed);
    welcomeLog.appendChild(line);
  }

  function helpText() {
    return [
      "try:",
      "  help                 this list",
      "  ls [dir]             list files",
      "                       ls hobbies",
      "                       ls projects",
      "  cat <file>           read a file",
      "  whoami",
      "  pwd",
      "  about",
      "  experience",
      "  contact",
      "  github",
      "  clear",
    ].join("\n");
  }

  function runLs(args) {
    const targets = args.length ? args : [""];
    const blocks = [];
    for (const arg of targets) {
      if (arg.startsWith("-")) continue;
      const path = resolvePath(arg === "" ? "~" : arg);
      const type = kind(path);
      if (type === "dir") {
        const body = listings[path].join("\n");
        blocks.push(targets.length > 1 ? (path || "~") + ":\n" + body : body);
      } else if (type === "file") {
        blocks.push(path.split("/").pop());
      } else {
        blocks.push("ls: " + arg + ": No such file or directory");
      }
    }
    return blocks.join("\n\n") || listings[""].join("\n");
  }

  function runCat(args) {
    if (!args.length) return "cat: missing file operand";
    return args
      .map((arg) => {
        const path = resolvePath(arg);
        const type = kind(path);
        if (type === "dir") return "cat: " + arg + ": Is a directory";
        if (type === "file") return files[path];
        return "cat: " + arg + ": No such file or directory";
      })
      .join("\n\n");
  }

  function runOpen(args) {
    const target = (args[0] || "").toLowerCase();
    if (!target) return "usage: open projects|work";
    if (target === "github" || target === "gh") {
      window.open("https://github.com/eb45", "_blank", "noopener");
      return "https://github.com/eb45";
    }
    if (target === "linkedin") {
      window.open("https://www.linkedin.com/in/emma-bennett4", "_blank", "noopener");
      return "https://www.linkedin.com/in/emma-bennett4";
    }
    if (target === "contact") {
      window.open("https://www.linkedin.com/in/emma-bennett4", "_blank", "noopener");
      return "https://www.linkedin.com/in/emma-bennett4";
    }
    const id = openMap[target];
    if (id) {
      show(id);
      return "opening " + target + "…";
    }
    return "open: " + target + ": nothing to open";
  }

  function dispatch(line) {
    const tokens = line.trim().split(/\s+/).filter(Boolean);
    if (!tokens.length) return { text: "" };
    const cmd = tokens[0];
    const args = tokens.slice(1);

    if (cmd === "help" || cmd === "?" || cmd === "man") return { text: helpText() };
    if (cmd === "ls") return { text: runLs(args) };
    if (cmd === "cat" || cmd === "less" || cmd === "more") return { text: runCat(args) };
    if (cmd === "whoami") return { text: "Emma Bennett" };
    if (cmd === "pwd") return { text: HOME };
    if (cmd === "clear") {
      if (welcomeLog) welcomeLog.replaceChildren();
      return { text: "", silent: true };
    }
    if (cmd === "open") return { text: runOpen(args) };
    if (cmd === "about") {
      return {
        text: "Emma Bennett\nDuke University\nElectrical/Computer Engineering and Computer Science",
      };
    }
    if (cmd === "experience" || cmd === "work") {
      show("work");
      return { text: "opening experience…" };
    }
    if (cmd === "contact") {
      return {
        text: "https://github.com/eb45\nhttps://www.linkedin.com/in/emma-bennett4",
      };
    }
    if (cmd === "github" || cmd === "gh") {
      return { text: "https://github.com/eb45" };
    }
    if (cmd === "linkedin") {
      return { text: "https://www.linkedin.com/in/emma-bennett4" };
    }
    if (cmd === "cd") {
      if (!args[0] || args[0] === "~" || args[0] === HOME) return { text: "" };
      return { text: "cd: this shell stays in ~" };
    }
    if (cmd === "sudo") return { text: "emma is not in the sudoers file. This incident will be reported." };
    if (cmd === "vim" || cmd === "vi" || cmd === "nvim") return { text: "not today. try cat." };
    if (cmd === "emacs" || cmd === "nano") return { text: "read-only. try cat." };
    if (cmd === "exit" || cmd === "logout" || cmd === "quit") {
      return { text: "this is a website. use the red ×, or keep typing." };
    }
    if (cmd === "rm" || cmd === "mkdir" || cmd === "touch" || cmd === "mv" || cmd === "cp") {
      return { text: cmd + ": read-only file system" };
    }
    if (cmd === "ssh") return { text: "ssh: connection refused" };
    if (cmd === "ping") return { text: "pong" };
    if (cmd === "date") return { text: new Date().toString() };
    if (cmd === "uname") return { text: "Darwin emma.duke 24.0.0" };
    if (cmd === "echo") return { text: args.join(" ") };
    if (cmd === "history") {
      return { text: cmdHistory.map((item, i) => String(i + 1).padStart(4, " ") + "  " + item).join("\n") };
    }
    if (cmd === "neofetch") {
      return {
        text: [
          "emma@duke",
          "-----------",
          "OS: Duke ECE + CS",
          "Host: this desktop",
          "Shell: pretend zsh",
          "Try: help",
        ].join("\n"),
      };
    }
    return { text: "zsh: command not found: " + cmd };
  }

  function run(line) {
    replay(line);
    if (line.trim()) {
      cmdHistory.push(line);
      historyAt = cmdHistory.length;
    }
    const result = dispatch(line);
    if (!result.silent && result.text) echo(result.text, result.tone);
    welcomeIn?.scrollIntoView({ block: "nearest" });
    focusWelcome();
  }

  welcomeForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    run(welcomeIn.value);
    welcomeIn.value = "";
  });

  document.querySelectorAll("[data-cmd]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      run(btn.dataset.cmd);
    });
  });

  function historyKey(key) {
    if (key === "ArrowUp") {
      if (!cmdHistory.length) return;
      historyAt = Math.max(0, historyAt - 1);
      welcomeIn.value = cmdHistory[historyAt] || "";
      welcomeIn.setSelectionRange(welcomeIn.value.length, welcomeIn.value.length);
    }
    if (key === "ArrowDown") {
      historyAt = Math.min(cmdHistory.length, historyAt + 1);
      welcomeIn.value = cmdHistory[historyAt] || "";
    }
  }

  welcomeIn?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      historyKey(event.key);
    }
  });

  function typeIntoWelcome(event) {
    if (!welcomeReady()) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key === "Tab" || event.key === "Escape") return;

    const t = event.target;
    if (t && t !== welcomeIn && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) {
      return;
    }

    if (t === welcomeIn) return;

    welcomeIn.focus({ preventScroll: true });

    if (event.key === "Enter") {
      event.preventDefault();
      run(welcomeIn.value);
      welcomeIn.value = "";
      return;
    }
    if (event.key === "Backspace") {
      event.preventDefault();
      welcomeIn.value = welcomeIn.value.slice(0, -1);
      return;
    }
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      historyKey(event.key);
      return;
    }
    if (event.key.length === 1) {
      event.preventDefault();
      welcomeIn.value += event.key;
    }
  }

  window.addEventListener("keydown", typeIntoWelcome, true);

  document.addEventListener("pointerup", (event) => {
    if (event.target.closest(".menu, .bar-icon, .icon, .spot, .activity, a, button")) return;
    requestAnimationFrame(focusWelcome);
  });

  window.addEventListener("pageshow", (event) => {
    if (event.persisted && document.getElementById("about")?.classList.contains("is-on")) {
      resetWelcome();
    }
    focusWelcome();
  });
  window.addEventListener("focus", focusWelcome);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) focusWelcome();
  });
  requestAnimationFrame(focusWelcome);
  setTimeout(focusWelcome, 0);
  setTimeout(focusWelcome, 200);

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
      if (meta) meta.innerHTML = '<a href="https://github.com/eb45" target="_blank" rel="noopener noreferrer">Open GitHub instead</a>';
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
