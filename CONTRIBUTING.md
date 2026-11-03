# Cómo trabajar sin romper lo de los demás

## Qué es de quién

| Carpeta / archivo | Dueño | ¿Lo puedo editar? |
|---|---|---|
| `miembros/azul/` | AZUL | Solo AZUL |
| `miembros/negro/` | NEGRO | Solo NEGRO |
| `miembros/rosado/` | ROSA | Solo ROSA |
| `miembros/verde/` | VERDE | Solo VERDE |
| `index.html`, `src/style.css`, `src/main.js`, `assets/` | **Todos** (página general) | Solo con PR revisado por el equipo |

Dentro de tu carpeta:

```
miembros/<color>/
  index.html     ← tu portafolio (textos, proyectos, skills, links)
  style.css      ← TU copia de la base: colores, fuentes, nav, footer, secciones
  member.css     ← TU copia del diseño del portafolio: hero, proyectos, skills
  assets/        ← tus fotos e imágenes
```

## Cambiar el diseño de tu página

Tu página carga **solo** tus `style.css` y `member.css`. Son copias tuyas:
cámbialas todo lo que quieras (colores, fuentes, layout, borrar secciones…).
No afecta la página general ni a los demás.

- Colores/fuentes globales → `:root { ... }` al inicio de tu `style.css`
- Tu color de acento → `body[data-member="<color>"]` al inicio de tu `member.css`
- Tus imágenes: `<img src="assets/mi-foto.png">` (relativo a tu carpeta)

`src/style.css` es solo de la página general (`index.html`). No lo toques.

## Flujo con Git (siempre)

1. `git switch main` y `git pull`
2. `git switch -c azul/mis-proyectos` → rama = `<tu-color>/<qué-haces>`
3. Editas SOLO `miembros/azul/`
4. `git add miembros/azul` (nunca `git add .`)
5. `git commit -m "azul: agrego proyectos semana 2"`
6. Subes tu rama (`-u origin azul/mis-proyectos`) y abres Pull Request a `main`

Reglas:
- Nunca subir directo a `main`.
- El check `scope-check` falla si tu rama `<color>/...` toca algo fuera de tu carpeta.

## Cambio para todos (hub, estilos base)

Rama `general/<qué>`, Pull Request, y lo aprueba al menos otro miembro antes de mergear.
