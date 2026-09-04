# theolemague.github.io

My personal site, live at **https://theolemague.github.io**.

It is not one portfolio, it is two. The site opens on a single question:

> **Serious version** or **Not serious version** ?

Both answers lead to the same content — the same career, the same projects, the same
resume data — rendered through two completely different lenses. One is a clean,
typographic, recruiter-friendly page. The other is a 3D space scene where a ship flies
you from one section to the next.

The point is that a portfolio should show _how_ someone builds, not just _what_ they
built. So it shows both hands: the disciplined one and the playful one.

---

## The concept

### The gate — `/`

A full-screen entry with one binary choice. No nav, no scroll, no content. Just the
question and two doors. The choice is remembered in `localStorage`, and either version
carries a small switch so you can cross over at any time without going back.

### Serious version — `/serious`

A restrained, content-first page. Sticky side navigation, generous typography, sections
that fade in as you scroll: about, education, experience, skills, projects. Fast, quiet,
readable on a phone in a waiting room. This is the version you send with a job
application.

### Not serious version — `/fun`

A real WebGL scene built with **React Three Fiber**. The sections are not stacked down a
page — they are **waypoints in 3D space**. Clicking a navigation link launches a ship
that flies along a curve from where you are to where you're going, and the camera
follows it. The content itself is rendered as HTML anchored in the 3D world, so it stays
readable and selectable.

It degrades honestly: no WebGL, or `prefers-reduced-motion`, and it falls back to the
serious layout with a note explaining why.

---

## Stack

| Concern         | Choice                                                        |
| --------------- | ------------------------------------------------------------- |
| Package manager | Bun                                                           |
| Build           | Vite 7                                                        |
| UI              | React 19 + TypeScript                                         |
| Styling         | Tailwind CSS 4 (CSS-first config, no `tailwind.config.js`)    |
| 3D              | three.js + `@react-three/fiber` + `@react-three/drei`         |
| Animation (2D)  | framer-motion                                                 |
| Routing         | react-router-dom 7                                            |
| i18n            | i18next + react-i18next — French and English                  |
| Hosting         | GitHub Pages, published by GitHub Actions on push to `master` |

---

## Project structure

```
.github/workflows/deploy.yml   # build + publish to GitHub Pages on push to master
scripts/build-map.mjs          # generates the Europe map SVG paths (bun run build:map)

src/
  main.tsx                     # React entry
  app.tsx                      # router — mounts the gate and both versions
  index.css                    # Tailwind import + design tokens

  data/
    resume.json                # single source of truth: profile, education, work, projects, places
    europe-map.json            # GENERATED — SVG paths + projected pin coordinates

  lang/
    i18n.ts                    # i18next setup
    fr.json                    # UI strings — French
    en.json                    # UI strings — English

  components/                  # shared across both versions
    lang-switcher.tsx
    version-switcher.tsx

  pages/
    gate/
      index.tsx                # the "serious or not serious ?" entry
    serious/
      index.tsx                # declares its own <Routes>
      home.tsx                 # the one-pager: intro, parcours, projects, contact
      components/
        nav-bar.tsx            # vertical rail, scroll-spy
        parcours-map.tsx       # full-width Europe map + hover readout
        github-repos.tsx       # public repos, one API call
    fun/
      index.tsx
      home.tsx
      components/
        scene.tsx              # the <Canvas> and camera rig
        ship.tsx               # the ship + its flight path between waypoints
```

**Conventions.** Files are kebab-case, including components. Imports use the `@/` alias
for `src/`. Each page folder owns its own `<Routes>`; `app.tsx` only mounts them.
Components used by a single page live in that page's `components/` folder. Formatting is
Prettier — never format by hand.

### Content lives in one place

`src/data/resume.json` holds every fact about my background, with each field carrying
both `fr` and `en`. Both versions of the site read from it. Adding a job means editing
one JSON file, and it appears in both skins, in both languages. `src/lang/*.json` holds
only interface strings (button labels, section titles).

---

## Install

```zsh
git clone https://github.com/theolemague/theolemague.github.io.git
cd theolemague.github.io
bun install
```

## Run

```zsh
bun run dev        # http://localhost:3000
```

## Other commands

```zsh
bun run build      # type-check, then build to dist/
bun run build:map  # regenerate the Europe map after changing places in resume.json
bun run preview    # serve the production build locally
bun run format     # Prettier over the whole project
```

## Deployment

There is nothing to run. Pushing to `master` triggers `.github/workflows/deploy.yml`,
which builds the site and publishes `dist/` to GitHub Pages.

Two details make a single-page app work on Pages: the workflow copies `index.html` to
`404.html` so deep links like `/serious` survive a refresh, and it writes a `.nojekyll`
file so Jekyll doesn't eat the hashed asset filenames.

---

## Roadmap

The site has been restarted more than once. This is the list that ends it — small steps,
each one shippable on its own.

- [x] Audit the old project, decide the concept, write this README
- [x] **Design direction** — locked as "mission dossier", written up in `DESIGN.md`
- [x] **Foundation** — clean `src/`, upgrade dependencies, Prettier config, GitHub Actions
- [x] **The gate** — the entry choice, remembered between visits
- [x] **Serious version** — one page: intro, parcours, projects, contact
- [x] **Language switcher** — rebuild `en.json` against the real schema, wire the toggle
- [ ] **Ship it** — first deploy, live at theolemague.github.io
- [ ] **Fun version, scene** — canvas, camera, waypoints, stars
- [ ] **Fun version, ship** — flight path between sections, camera follow
- [ ] **Fun version, fallback** — no-WebGL and reduced-motion paths
- [ ] **Content pass** — LinkedIn URL, API Engagement stack, GitHub repo descriptions
- [ ] Mobile polish, social preview image, skills section if wanted

### Known debt, for the record

The rebuild starts from a broken state, and these are the reasons why:

- `Works.tsx` and `Resume.tsx` were pre-TypeScript leftovers importing JSON files that no
  longer exist — they broke `npm run build` even though nothing rendered them.
- `en.json` and `fr.json` used two different, non-overlapping key schemas, so English was
  unreachable and would have rendered raw key names.
- `npm run deploy` published `build/`, but Vite writes to `dist/` — the deploy command
  had never worked.
- Three sections in the about page shared `id="education"`, so the scroll-spy nav could
  never highlight correctly.

---

## Credit

The original version of this site was an adaptation of
[Brittany Chiang](https://brittanychiang.com)'s portfolio, built to learn React. This
rewrite keeps the debt of that inspiration for the serious version, and goes somewhere
else entirely for the other one.
