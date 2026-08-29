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
  const links = Array.from(document.querySelectorAll(".side-nav a[href^='#']"));
  if (!links.length) return;

  const targets = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  if (!targets.length) return;

  function setOn(id) {
    links.forEach((link) => link.classList.toggle("is-on", link.getAttribute("href") === "#" + id));
  }

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setOn(visible.target.id);
    },
    { threshold: [0.25, 0.5, 0.75], rootMargin: "-15% 0px -55% 0px" }
  );

  targets.forEach((el) => io.observe(el));
})();
