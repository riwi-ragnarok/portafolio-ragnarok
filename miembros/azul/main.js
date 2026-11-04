// Motion y detalles de contacto. Sin JS el contenido se ve igual.
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const nav = document.querySelector(".nav");
  const hero = document.querySelector(".m-hero");
  const heading = document.querySelectorAll(".m-title, .m-kicker");

  // Al hacer scroll: barra de progreso y parallax del nombre, que se apaga
  // antes de llegar al texto del pie del hero
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    nav.style.setProperty("--progress", max > 0 ? (y / max).toFixed(4) : "0");
    if (!reduce) {
      const top = Math.min(y, window.innerHeight);
      heading.forEach((el) => {
        el.style.translate = `0 ${(top * 0.25).toFixed(1)}px`;
        el.style.opacity = String(Math.max(0, 1 - top / (window.innerHeight * 0.45)));
      });
    }
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  // Correo en computador: abre la redacción de Gmail en otra pestaña, porque
  // mailto: no hace nada útil sin una app de correo instalada. En el celular
  // (y sin JS) queda el mailto:, que abre la app de correo del teléfono.
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
      const to = link.getAttribute("href").slice("mailto:".length);
      link.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}`;
      link.target = "_blank";
      link.rel = "noopener";
    });
  }

  // Copiar correo: solo aparece si el navegador lo permite
  const copy = document.querySelector("[data-copy]");
  if (copy && navigator.clipboard) {
    copy.hidden = false;
    let timer;
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(copy.dataset.copy);
        copy.textContent = "¡Copiado!";
      } catch {
        copy.textContent = "No se pudo";
      }
      clearTimeout(timer);
      timer = setTimeout(() => { copy.textContent = "Copiar"; }, 1800);
    });
  }

  if (!reduce) {
    // Brasas azules subiendo por el hero
    const embers = document.createElement("div");
    embers.className = "embers";
    embers.setAttribute("aria-hidden", "true");
    const total = window.innerWidth < 700 ? 12 : 26;
    for (let i = 0; i < total; i++) {
      const ember = document.createElement("span");
      ember.className = "ember";
      ember.style.setProperty("--l", `${(Math.random() * 100).toFixed(1)}%`);
      ember.style.setProperty("--s", `${(2 + Math.random() * 3).toFixed(1)}px`);
      ember.style.setProperty("--t", `${(7 + Math.random() * 9).toFixed(1)}s`);
      ember.style.setProperty("--dl", `${(-Math.random() * 16).toFixed(1)}s`);
      ember.style.setProperty("--dx", `${(-40 + Math.random() * 80).toFixed(0)}px`);
      embers.append(ember);
    }
    hero.append(embers);
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
