(function () {
  const cards = Array.from(document.querySelectorAll("[data-project]"));
  const pops = Array.from(document.querySelectorAll(".project-pop"));
  if (!cards.length) return;

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
})();
