(function () {
  const triggers = Array.from(document.querySelectorAll("[data-lightbox]"));
  if (!triggers.length) return;

  const overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.hidden = true;
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Full screen image");
  overlay.innerHTML =
    '<button type="button" class="lightbox-close" aria-label="Close">Close</button>' +
    '<img alt="">';
  document.body.appendChild(overlay);

  const img = overlay.querySelector("img");
  const closeBtn = overlay.querySelector(".lightbox-close");
  let lastFocus = null;

  function open(src, alt) {
    lastFocus = document.activeElement;
    img.src = src;
    img.alt = alt || "";
    overlay.hidden = false;
    document.body.classList.add("lightbox-on");
    closeBtn.focus();
  }

  function close() {
    if (overlay.hidden) return;
    overlay.hidden = true;
    img.removeAttribute("src");
    document.body.classList.remove("lightbox-on");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  triggers.forEach((el) => {
    el.addEventListener("click", () => {
      const src = el.getAttribute("data-lightbox");
      const thumb = el.querySelector("img");
      open(src, thumb ? thumb.alt : el.getAttribute("aria-label") || "");
    });
  });

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay || event.target === img || event.target === closeBtn) {
      close();
    }
  });

  document.addEventListener(
    "keydown",
    (event) => {
      if (!overlay.hidden && event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        close();
      }
    },
    true
  );
})();
