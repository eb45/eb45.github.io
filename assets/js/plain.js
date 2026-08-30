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
  const items = Array.from(
    document.querySelectorAll(".plain-intro, .plain section, .timeline > li, .project-card")
  );
  if (!items.length || reduce) return;

  items.forEach((el) => {
    el.classList.add("reveal");
    if (el.matches(".timeline > li:nth-child(odd)")) el.classList.add("from-left");
    if (el.matches(".timeline > li:nth-child(even)")) el.classList.add("from-right");
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
  );

  items.forEach((el) => io.observe(el));
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
    if (window.matchMedia("(max-width: 1100px)").matches && nav) {
      return nav.getBoundingClientRect().bottom + 16;
    }
    return Math.min(180, window.innerHeight * 0.22);
  }

  function sync() {
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
      setOn(target.id);
      link.blur();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", link.getAttribute("href"));
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
