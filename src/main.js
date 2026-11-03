// Solo motion. Sin JS el contenido se ve igual.
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Brasas que suben en el hero (decorativas)
  if (!reduce) {
    const colors = ["#ffb27a", "#ff8a3d", "#ff6a1f", "#ffd2a6", "#ff4fa3", "#4a74ff", "#2bff88"];
    document.querySelectorAll(".embers").forEach((box) => {
      const count = window.innerWidth < 700 ? 14 : 28;
      const frag = document.createDocumentFragment();
      for (let i = 0; i < count; i++) {
        const e = document.createElement("i");
        e.className = "ember";
        const size = 2 + Math.random() * 3;
        e.style.cssText =
          `--l:${(Math.random() * 100).toFixed(1)}%;` +
          `--s:${size.toFixed(1)}px;` +
          `--t:${(6 + Math.random() * 8).toFixed(1)}s;` +
          `--dl:${(-Math.random() * 12).toFixed(1)}s;` +
          `--dx:${(Math.random() * 120 - 60).toFixed(0)}px;` +
          `--c:${colors[i % 5 === 4 ? 4 + (i % 3) : i % 4]};`;
        frag.appendChild(e);
      }
      box.appendChild(frag);
    });
  }

  // Parallax: el título del hero se queda atrás al hacer scroll (usa `translate`, no pisa la animación)
  const title = document.querySelector(".hero__title, .m-title");
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
