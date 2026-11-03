# Cómo trabajar sin romper lo de los demás

## Qué es de quién

| Carpeta / archivo | Dueño | ¿Lo puedo editar? |
|---|---|---|
| `miembros/azul/` | AZUL | Solo AZUL |
| `miembros/negro/` | NEGRO | Solo NEGRO |
| `miembros/rosado/` | ROSA | Solo ROSA |
| `miembros/verde/` | VERDE | Solo VERDE |
| `index.html`, `src/style.css`, `src/member.css`, `src/main.js`, `assets/` | **Todos** | Solo con PR revisado por el equipo |

Dentro de tu carpeta:

```
miembros/<color>/
  index.html     ← tu portafolio (textos, proyectos, skills, links)
  <color>.css    ← TU estilo. Pisa a los compartidos solo en tu página
  assets/        ← tus fotos e imágenes
```

## Cambiar el diseño de tu página

No edites `src/member.css` ni `src/style.css`. Escribe en `miembros/<color>/<color>.css`:

```css
body[data-member="azul"] { --accent: #00d0ff; --rgb: 0 208 255; }
.m-title { letter-spacing: .1em; }
```

Ese CSS solo lo carga tu `index.html`, así que no afecta a nadie más.
Tus imágenes: `<img src="assets/mi-foto.png">` (relativo a tu carpeta).

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
