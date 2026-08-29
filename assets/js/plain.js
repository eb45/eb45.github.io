(function () {
  const boxes = Array.from(document.querySelectorAll(".project-box"));
  if (!boxes.length) return;

  boxes.forEach((box) => {
    box.addEventListener("toggle", () => {
      if (!box.open) return;
      boxes.forEach((other) => {
        if (other !== box) other.open = false;
      });
    });
  });
})();
