# Guía de Git para RAGNAROK

Chuleta para usar la terminal sin miedo. Busca tu situación y copia el comando.
Lo que va entre `< >` lo cambias por lo tuyo (sin los `< >`).

**Quién es quién:**

| Color | Persona | Carpeta |
|---|---|---|
| negro | Samuel | `miembros/negro/` |
| rosado | María | `miembros/rosado/` |
| azul | Oscar | `miembros/azul/` |
| verde | Juan | `miembros/verde/` |

---

## 0. Palabras que vas a ver

| Palabra | Qué es |
|---|---|
| **repositorio (repo)** | La carpeta del proyecto con todo su historial. |
| **commit** | Una "foto" guardada de tus cambios, con un mensaje. |
| **rama (branch)** | Una copia paralela del proyecto para trabajar sin dañar lo de otros. |
| **main** | La rama principal. Lo que está aquí es lo "oficial". Nadie trabaja directo en ella. |
| **origin** | El repositorio en GitHub (la nube). |
| **push** | Subir tus commits a GitHub. |
| **pull** | Bajar de GitHub lo que otros subieron. |
| **merge** | Unir los cambios de una rama dentro de otra. |
| **PR (Pull Request)** | Pedir en GitHub que tu rama se una a `main`. Los demás lo revisan. |
| **conflicto** | Dos personas cambiaron la misma línea; Git no sabe cuál dejar y te pregunta. |

---

## 1. Antes de hacer cualquier cosa: ¿dónde estoy?

```
git status
```
Te dice en qué rama estás, qué archivos cambiaste y si tienes cosas sin subir.
**Úsalo siempre que tengas dudas.** No cambia nada, solo mira.

```
git branch
```
Lista tus ramas. La que tiene `*` es en la que estás.

```
git log --oneline -5
```
Muestra los últimos 5 commits (los más nuevos arriba). Para salir si se queda pegado: tecla `q`.

---

## 2. Empezar a trabajar (cada vez que te sientas)

```
git switch main
git pull
git switch -c <color>/<que-vas-a-hacer>
```
Ejemplo: `git switch -c negro/proyectos-semana-3`

1. Te vas a `main`.
2. Bajas lo último que hay en GitHub.
3. Creas tu rama nueva desde ahí y te pasas a ella.

> Si la rama ya existe y solo quieres volver a ella: `git switch <nombre-de-la-rama>`

---

## 3. Guardar tus cambios (commit)

```
git add miembros/<color>
git commit -m "<color>: lo que hice"
```
Ejemplo:
```
git add miembros/negro
git commit -m "negro: agrego proyecto de la calculadora"
```

- `git add` elige **qué** archivos van en el commit.
- Agrega solo tu carpeta. Si cambiaste algo general (index, `src/`, `assets/`), mira la sección 8.
- `git add -A` agrega **todo** lo que cambió. Úsalo solo si revisaste con `git status` que todo es tuyo.

---

## 4. Subir tus cambios a GitHub (push)

La primera vez que subes una rama:
```
git push -u origin <nombre-de-tu-rama>
```
Las siguientes veces, en esa misma rama:
```
git push
```

---

## 5. Pasar tus cambios a `main` (Pull Request)

1. Haz `git push` de tu rama (sección 4).
2. Entra al repo en GitHub. Sale un botón amarillo **"Compare & pull request"**. Dale clic.
3. Revisa que diga **base: main ← compare: tu-rama**. Escribe qué hiciste y dale **Create pull request**.
4. Espera que el check `scope-check` salga en verde ✅ y que alguien del equipo lo mire.
5. Dale **Merge pull request** → **Confirm merge**.
6. En tu compu, actualiza `main`:
```
git switch main
git pull
```

> Con la herramienta `gh` (si la tienes instalada) los pasos 2-5 son:
> `gh pr create --base main --fill` y luego `gh pr merge --merge`

---

## 6. Traer cambios de otros

### Lo nuevo de `main` a tu rama
Hazlo seguido para no quedarte atrás.
```
git switch <tu-rama>
git pull origin main
```

### Lo que hizo un compañero en su rama (sin esperar a que llegue a main)
```
git fetch
git merge origin/<rama-del-compañero>
```
Ejemplo: `git merge origin/oscar-portafolio`

- `git fetch` baja la información de todas las ramas de GitHub, **sin cambiar tus archivos**.
- `git merge` une esa rama a la tuya.

### Solo mirar qué cambió alguien, sin traer nada
```
git fetch
git log --oneline main..origin/<rama-del-compañero>
git diff main origin/<rama-del-compañero> --stat
```

### Traer un solo archivo o carpeta de otra rama
```
git fetch
git checkout origin/<rama> -- <ruta>
```
Ejemplo: `git checkout origin/oscar-portafolio -- miembros/azul`
Ojo: **reemplaza** lo que tengas en esa ruta por lo de la otra rama.

---

## 7. Deshacer cosas sin miedo

| Situación | Comando | Qué pasa |
|---|---|---|
| Dañé un archivo y quiero dejarlo como en el último commit | `git restore <archivo>` | Se pierden los cambios de ese archivo **que no habías guardado en commit**. |
| Hice `git add` de algo que no quería | `git restore --staged <archivo>` | Lo saca del commit. **No borra** tus cambios. |
| Quiero guardar mis cambios a un lado para cambiar de rama | `git stash` | Los guarda en una "caja" y deja los archivos limpios. |
| Quiero recuperar lo que guardé con stash | `git stash pop` | Te devuelve los cambios. |
| Me equivoqué en el mensaje del último commit (y **no** lo he subido) | `git commit --amend -m "mensaje nuevo"` | Cambia el mensaje. |
| Quiero deshacer el último commit pero **dejar** los cambios en los archivos (no subido) | `git reset --soft HEAD~1` | Quita el commit; tus cambios quedan listos para volver a hacer commit. |
| Quiero deshacer un commit que **ya subí** | `git revert <id-del-commit>` | Crea un commit nuevo que hace lo contrario. Es la forma segura cuando ya está en GitHub. |
| Empecé un merge y se complicó, quiero cancelar | `git merge --abort` | Vuelve todo a como estaba antes del merge. |

El `<id-del-commit>` es el código corto que sale en `git log --oneline` (ej. `5213e95`).

> **VS Code dice "sin guardar" y el archivo se ve viejo** después de un merge o de cambiar de rama:
> NO le des Ctrl+S. Usa `Ctrl+Shift+P` → **"File: Revert File"** para que cargue la versión real.

---

## 8. Reglas del equipo

1. **Nunca trabajes directo en `main`.** Siempre en tu rama y con PR.
2. Cada uno edita **solo su carpeta** `miembros/<color>/`.
3. Lo general (`index.html` de la raíz, `src/`, `assets/`, `.github/`) se cambia en una rama `general/<qué>` y con PR que otro revise.
4. Nombre de rama: `<color>/<qué-haces>` → el check `scope-check` revisa que no toques archivos de otros.
5. Antes de abrir un PR: `git pull origin main` en tu rama, para que no haya conflictos.
6. Mensajes de commit cortos y claros: `"negro: arreglo foto del hero"`.

---

## 9. Cuando sale un CONFLICTO

Git te avisa con `CONFLICT (content): Merge conflict in <archivo>`.

1. Abre el archivo en VS Code. Verás bloques así:
   ```
   <<<<<<< HEAD
   lo que tenías tú
   =======
   lo que viene de la otra rama
   >>>>>>> otra-rama
   ```
2. VS Code muestra botones arriba de cada bloque: **Accept Current** (lo tuyo), **Accept Incoming** (lo otro) o **Accept Both** (ambos). Elige uno.
3. Revisa que no queden `<<<<<<<`, `=======` ni `>>>>>>>`.
4. Guarda y termina:
   ```
   git add <archivo>
   git commit --no-edit
   ```
5. Si te enredaste: `git merge --abort` y pide ayuda.

---

## 10. Errores comunes

| Mensaje | Qué significa | Qué hacer |
|---|---|---|
| `! [rejected] ... (fetch first)` | Alguien subió cambios a esa rama antes que tú. | `git pull` y luego `git push`. |
| `Your local changes ... would be overwritten` | Tienes cambios sin commit y Git no quiere pisarlos. | Haz commit (sección 3) o `git stash`, y repite el comando. |
| `fatal: not a git repository` | Estás en otra carpeta. | Abre la terminal dentro de la carpeta del proyecto. |
| `error: pathspec '...' did not match` | Escribiste mal el nombre de la rama o archivo. | Revisa con `git branch -a` o `git status`. |
| `There is no tracking information for the current branch` | Tu rama nunca se subió. | `git push -u origin <tu-rama>` |
| Se abre una pantalla rara (Vim) al hacer commit o merge | Git te pide un mensaje. | Escribe `:wq` y Enter para guardar y salir. |

---

## 11. ⚠️ Comandos peligrosos (no usar sin preguntar)

| Comando | Por qué |
|---|---|
| `git push --force` | Borra en GitHub lo que otros subieron a esa rama. |
| `git reset --hard` | Borra tus cambios sin commit para siempre. |
| `git clean -fd` | Borra archivos nuevos que no estén en Git. |
| `git branch -D <rama>` | Borra una rama aunque tenga trabajo sin unir. |
| `git push origin main` | Sube directo a `main` saltándose el PR. |

---

## Resumen de un día normal

```
git switch main
git pull
git switch -c negro/lo-que-voy-a-hacer
# ... trabajas y guardas en VS Code ...
git status
git add miembros/negro
git commit -m "negro: lo que hice"
git push -u origin negro/lo-que-voy-a-hacer
# → abres el PR en GitHub y lo unes a main
git switch main
git pull
```
