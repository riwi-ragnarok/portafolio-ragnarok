// JS personal de ROSADO.
// Solo lo carga miembros/rosado/index.html: no afecta al index ni a los demás.
//
// Qué hace: maneja el CARRUSEL de la sección PROYECTOS.
//   - Una tarjeta queda en el centro (la "actual"); las demás se ven a los lados, giradas.
//   - Flechas, teclado (← →), clic en una tarjeta lateral o en una semana = mover el carrusel.
//   - Clic en la tarjeta del centro o en "Ver retos" = abrir el detalle con los 4 retos.
//   - "Volver al carrusel" = cerrar el detalle.

const projects = document.querySelector(".projects");
const flow = document.querySelector(".flow");
const cards = document.querySelectorAll(".flow__card");
const tabs = document.querySelectorAll(".flow__tab");
const label = document.querySelector(".flow__label");
const now = document.querySelector(".flow__now");
const count = document.querySelector(".flow__count");

let current = 0; // número de la tarjeta que está en el centro

// Pone cada tarjeta en su sitio según qué tan lejos está del centro.
function render() {
  cards.forEach((card, i) => {
    const offset = i - current;                    // 0 = centro, -1 = izquierda, 1 = derecha...
    card.style.setProperty("--o", offset);         // el CSS usa --o para girarla y moverla
    card.parentElement.dataset.far = Math.abs(offset) > 2 ? "true" : "false"; // las muy lejanas se ocultan
    card.setAttribute("aria-current", offset === 0 ? "true" : "false");
    card.tabIndex = offset === 0 ? 0 : -1;         // con Tab solo se llega a la del centro
  });

  // textos de la etiqueta y de la barra
  const card = cards[current];
  label.querySelector("b").textContent = card.dataset.title;
  label.querySelector("span").textContent = card.dataset.sub;
  now.querySelector("i").textContent = card.querySelector(".flow__num").textContent;
  now.querySelector("b").textContent = card.querySelector(".flow__topic").textContent;
  now.querySelector("small").textContent = card.querySelector(".flow__week").textContent;
  count.textContent = `${current + 1} / ${cards.length}`;

  // marca la semana activa arriba
  tabs.forEach((tab, w) => tab.setAttribute("aria-current", String(w === Number(card.dataset.week))));
}

// Mueve el carrusel a la tarjeta número "i" (sin salirse de los bordes).
function goTo(i) {
  current = Math.max(0, Math.min(cards.length - 1, i));
  render();
}

// Abre el detalle (los 4 retos) de la tarjeta del centro.
function openDetail() {
  const detail = document.getElementById(cards[current].getAttribute("aria-controls"));
  detail.hidden = false;
  projects.classList.add("is-full"); // oculta el carrusel y deja solo el detalle
  detail.querySelector(".proj-back").focus();
}

// Cierra el detalle y vuelve al carrusel.
function closeDetail() {
  document.querySelectorAll(".proj-detail").forEach((detail) => (detail.hidden = true));
  projects.classList.remove("is-full");
  cards[current].focus();
}

// clic en una tarjeta: si es la del centro abre, si es lateral la trae al centro
cards.forEach((card, i) => {
  card.addEventListener("click", () => (i === current ? openDetail() : goTo(i)));
});

// semanas de arriba: saltan al primer día de esa semana
tabs.forEach((tab) => tab.addEventListener("click", () => goTo(Number(tab.dataset.go))));

// flechas de la barra
document.querySelectorAll(".flow__btn").forEach((btn) => {
  btn.addEventListener("click", () => goTo(current + Number(btn.dataset.step)));
});

// botón "Ver retos"
document.querySelector(".flow__open").addEventListener("click", openDetail);

// botones "Volver al carrusel"
document.querySelectorAll(".proj-back").forEach((btn) => btn.addEventListener("click", closeDetail));

// teclado: flechas izquierda/derecha cuando el foco está dentro del carrusel
flow.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") goTo(current - 1);
  if (event.key === "ArrowRight") goTo(current + 1);
});

flow.classList.add("is-ready"); // con JS activo el CSS lo muestra como carrusel 3D
render();
