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

// Selección de personaje: roster (tabs) que cambia el guerrero del escenario
(() => {
  const root = document.querySelector("[data-select]");
  if (!root) return;
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));
  if (!tabs.length || panels.some((p) => !p)) return;

  const select = (i, focus = false) => {
    tabs.forEach((t, j) => {
      const on = i === j;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      panels[j].hidden = !on;
    });
    const panel = panels[i];
    // reinicia la entrada (imagen + barras) en el siguiente frame
    panel.classList.add("is-entering");
    requestAnimationFrame(() => requestAnimationFrame(() => panel.classList.remove("is-entering")));
    if (focus) tabs[i].focus();
  };

  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(i));
    t.addEventListener("keydown", (e) => {
      const n = tabs.length;
      const map = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: n - 1 };
      if (!(e.key in map)) return;
      e.preventDefault();
      select((map[e.key] + n) % n, true);
    });
  });

  const start = Math.max(0, tabs.findIndex((t) => t.getAttribute("aria-selected") === "true"));
  select(start);
})();

// Carrusel "Código de guerra": avanza solo y sin fin con transform (no depende del scroll).
// Se mueve aunque el sistema pida menos animación (pedido explícito), solo que más lento.
(() => {
  const root = document.querySelector("[data-carousel]");
  if (!root) return;
  const track = root.querySelector(".vows__track");
  if (!track || !track.children.length) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // copia de las tarjetas para el bucle (oculta a lectores de pantalla)
  const originals = [...track.children];
  originals.forEach((li) => {
    const c = li.cloneNode(true);
    c.setAttribute("aria-hidden", "true");
    c.querySelectorAll("a").forEach((a) => { a.tabIndex = -1; });
    track.appendChild(c);
  });
  // distancia de un ciclo = desde la 1ra tarjeta hasta su copia
  const loop = () => track.children[originals.length].offsetLeft - originals[0].offsetLeft;

  const SPEED = reduce ? 22 : 45; // px por segundo
  let x = 0, last = 0, held = false;
  track.addEventListener("touchstart", () => { held = true; }, { passive: true });
  track.addEventListener("touchend", () => { held = false; }, { passive: true });

  const tick = (t) => {
    const dt = last ? Math.min(t - last, 64) : 0;
    last = t;
    if (!held && !document.hidden) {
      const w = loop();
      x += (SPEED * dt) / 1000;
      if (w > 0 && x >= w) x -= w;
      track.style.transform = `translate3d(${-x}px, 0, 0)`;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();
