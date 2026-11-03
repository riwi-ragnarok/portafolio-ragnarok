// Solo motion. Sin JS el contenido se ve igual.
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Parallax: el título del hero se queda atrás al hacer scroll
  const title = document.querySelector(".m-title");
  if (title && !reduce) {
    let ticking = false;
    const move = () => {
      const y = Math.min(window.scrollY, window.innerHeight);
      title.style.translate = `0 ${(y * 0.35).toFixed(1)}px`;
      title.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.9)));
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(move); }
    }, { passive: true });
  }

  // Revela secciones al entrar en pantalla
  const items = document.querySelectorAll("[data-reveal]");
  const show = (el) => el.classList.add("is-in");
  if (!("IntersectionObserver" in window) || reduce) {
    items.forEach(show);
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          show(e.target);
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
  );
  items.forEach((el) => io.observe(el));
})();
