(function () {
  const pops = Array.from(document.querySelectorAll(".project-pop"));

  function openPop(id) {
    const pop = document.getElementById("project-" + id);
    if (pop && typeof pop.showModal === "function") pop.showModal();
  }

  function closePop(pop) {
    if (pop.open) pop.close();
  }

  document.querySelectorAll("[data-open-project]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-open-project");
      if (id) openPop(id);
    });
  });

  pops.forEach((pop) => {
    pop.querySelector(".project-pop-close")?.addEventListener("click", () => closePop(pop));
    pop.addEventListener("click", (event) => {
      const box = pop.getBoundingClientRect();
      const outside =
        event.clientX < box.left ||
        event.clientX > box.right ||
        event.clientY < box.top ||
        event.clientY > box.bottom;
      if (outside) closePop(pop);
    });
  });
})();

(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const jobs = Array.from(document.querySelectorAll(".timeline > li:not(:first-child)"));
  const items = Array.from(
    document.querySelectorAll(
      ".plain-intro, .plain section:not(#experience):not(#projects), .project-card"
    )
  );
  if ((!items.length && !jobs.length) || reduce) return;

  items.forEach((el) => el.classList.add("reveal"));
  jobs.forEach((el) => {
    el.classList.add("reveal");
    if (el.matches(".timeline > li:nth-child(odd)")) el.classList.add("from-left");
    if (el.matches(".timeline > li:nth-child(even)")) el.classList.add("from-right");
  });

  function revealOn(entries, observer) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      observer.unobserve(entry.target);
    });
  }

  const early = new IntersectionObserver(revealOn, {
    threshold: 0,
    rootMargin: "0px 0px 20% 0px",
  });
  items.forEach((el) => early.observe(el));

  const later = new IntersectionObserver(revealOn, {
    threshold: 0.18,
    rootMargin: "-12% 0px -22% 0px",
  });
  jobs.forEach((el) => later.observe(el));
})();

(function () {
  const nav = document.querySelector(".side-nav");
  const links = Array.from(document.querySelectorAll(".side-nav a[href^='#']"));
  if (!links.length) return;

  const targets = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  if (!targets.length) return;

  function setOn(id) {
    links.forEach((link) => link.classList.toggle("is-on", link.getAttribute("href") === "#" + id));
  }

  function markerY() {
    const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    if (window.matchMedia("(max-width: 1100px)").matches && nav) {
      return Math.max(nav.getBoundingClientRect().bottom, pad) + 12;
    }
    return Math.max(pad, Math.min(180, window.innerHeight * 0.22));
  }

  let pinned = null;
  let pinTimer = 0;

  function sync() {
    if (pinned) {
      setOn(pinned);
      return;
    }
    const y = markerY();
    let current = targets[0];
    for (const el of targets) {
      if (el.getBoundingClientRect().top <= y) current = el;
    }
    setOn(current.id);
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      sync();
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  sync();

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      pinned = target.id;
      setOn(pinned);
      link.blur();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", link.getAttribute("href"));
      window.clearTimeout(pinTimer);
      pinTimer = window.setTimeout(() => {
        pinned = null;
        sync();
      }, 700);
    });
  });
})();

(function () {
  document.querySelectorAll(".portrait-flip").forEach((btn) => {
    btn.addEventListener("click", () => {
      const on = btn.classList.toggle("is-flipped");
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  });
})();
