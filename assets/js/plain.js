(function () {
  const cards = Array.from(document.querySelectorAll("[data-project]"));
  const pops = Array.from(document.querySelectorAll(".project-pop"));

  function openPop(id) {
    const pop = document.getElementById("project-" + id);
    if (pop && typeof pop.showModal === "function") pop.showModal();
  }

  function closePop(pop) {
    if (pop.open) pop.close();
    pop.querySelectorAll("video").forEach((video) => video.pause());
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => openPop(card.dataset.project));
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
    pop.addEventListener("close", () => {
      pop.querySelectorAll("video").forEach((video) => video.pause());
    });
  });

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
