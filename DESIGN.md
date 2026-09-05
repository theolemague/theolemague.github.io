# Design system — theolemague.github.io

## 1. Visual theme and atmosphere

**Mission dossier.** A near-black instrument panel: engineered, precise, warm at the
edges. Sections are numbered like a flight manual. Structure is carried by hairline
rules and typographic width rather than by cards and shadows. One amber accent, used
like a cockpit warning light — sparingly, and always to mean something.

The two versions of the site are one idea seen twice. The serious version is the
**manual**; the not-serious version is the **flight**. This is why the ship is not a
gimmick: the whole visual system was already describing a machine.

Density is medium — generous vertical rhythm, tight horizontal measure. Nothing floats.

## 2. Colour palette and roles

All values OKLCH. Neutrals are tinted toward the amber hue (chroma 0.005–0.008) so the
greys feel warm rather than dead.

| Token               | Value                  | Role                                           |
| ------------------- | ---------------------- | ---------------------------------------------- |
| `--color-canvas`    | `oklch(0.16 0.006 62)` | Page background. The panel.                    |
| `--color-surface`   | `oklch(0.21 0.007 62)` | Raised region — hovered gate panel only        |
| `--color-ink`       | `oklch(0.94 0.008 62)` | Primary text. Never `#fff` — too harsh on dark |
| `--color-muted`     | `oklch(0.68 0.008 62)` | Body secondary, descriptions                   |
| `--color-faint`     | `oklch(0.60 0.008 62)` | Labels, metadata, inactive nav                 |
| `--color-rule`      | `oklch(0.30 0.008 62)` | Hairline rules and dividers                    |
| `--color-amber`     | `oklch(0.78 0.16 62)`  | **The** accent — indices, active state, focus  |
| `--color-amber-dim` | `oklch(0.58 0.11 62)`  | Accent at rest, engine glow at distance        |

**60-30-10.** 60% canvas, 30% ink/muted/rule, 10% amber. If amber is covering more than
a tenth of the screen, it has stopped meaning anything.

## 3. Typography

Two families, both variable, both chosen for their **width axis** — width is the primary
hierarchy tool in this system, more than weight.

| Family           | Axes                            | Use                                               |
| ---------------- | ------------------------------- | ------------------------------------------------- |
| **Archivo**      | `wdth` 62–125, `wght` 100–900   | Everything. Expanded for display, normal for body |
| **Martian Mono** | `wdth` 75–112.5, `wght` 100–800 | Indices, dates, labels, metadata                  |

Archivo is an engineered grotesque whose expanded width reads like a label stencilled
onto equipment — the exact register this system wants. Martian Mono is deliberately
mechanical and slightly over-wide, which makes small metadata feel like instrument
readout rather than fine print.

| Level        | Size    | Family / width          | Weight  | Tracking          |
| ------------ | ------- | ----------------------- | ------- | ----------------- |
| Display      | 56–80px | Archivo, `wdth` 110–125 | 600     | -0.022em          |
| Section head | 32–40px | Archivo, `wdth` 115     | 600     | -0.022em          |
| Sub head     | 20–24px | Archivo, `wdth` 100     | 600     | -0.012em          |
| Body         | 16–18px | Archivo, `wdth` 100     | 400     | normal            |
| Label / date | 11–13px | Martian Mono            | 400–500 | 0.08em, uppercase |

Body copy gets `text-wrap: pretty`; headings get `text-wrap: balance`. Dates and any
numeric column get `font-variant-numeric: tabular-nums`.

## 4. Component styling

**Radius scale — committed: `{0, 2px, 4px}`.** This is an instrument panel. Corners are
sharp on purpose. Nothing in this project is a rounded card. Buttons take 2px, the rare
raised surface takes 4px, rules and dividers take 0.

**Section header.** Amber index (`01`, Martian Mono) + hairline rule + expanded Archivo
title. The rule runs to the edge of the measure. No background, no box.

**Data rows** (education, experience). Two columns: a mono date range in `--color-faint`
on the left, content on the right. Rows are separated by a hairline, never boxed.

**Buttons / links.** Text + a 1px underline offset 4px in `--color-rule`; on hover the
underline goes amber and the text goes ink. `active:scale-[0.98]`. Focus ring is amber,
2px, offset 2px — never removed.

**Navigation.** A hairline-wide rail on the left at `lg` and up: labels set in Martian
Mono and rotated to read bottom-to-top (`writing-mode: vertical-rl` plus a 180° turn), so
the nav costs 44px of width instead of a block of horizontal text. Each item carries its
own amber tick that scales in on `transform` alone — horizontal on mobile, vertical on the
rail. Below `lg` the rail becomes a sticky top bar with the labels set normally.

**Map.** The parcours has two views, switched by a toggle in the section header: a
full-width map (default) and the classic chronological list. The map is a Mercator
projection of Europe (900×860 — the proportion falls out of the frame rather than being
chosen: Gibraltar to southern Scandinavia is close to square), generated at build time by
`scripts/build-map.mjs` so the browser ships plain SVG paths rather than d3-geo and a
TopoJSON file. Coastlines are hairlines in `--color-rule`; pins are amber; the dashed
amber route is the path actually walked, ordered by arrival.

A country is drawn whole or not at all: a shape the frame would slice reads as a mistake,
so the generator drops it — which is why Finland, Ukraine and Greece are absent rather than
half-present. The southern edge sits below Tarifa so that Iberia and Italy make it in
whole. Two countries are drawn anyway, cut by the top edge: Sweden, which holds a pin and
at 69°N cannot fit whole alongside France in any frame that is not portrait, and Norway,
without which Sweden reads as an island.

Pins are numbered discs ordered by arrival, so the map reads chronologically without a
legend. Hover and focus light the pin alone — it fills amber, the number inverts to canvas,
a ring scales out — which says *click me* and nothing more. Clicking opens a **readout
card** pinned to that pin, on whichever side of it has room, with a close button; Escape
closes it too, and the other pins drop to 35% opacity. Below `md` the card stops being an
overlay and stacks under the map, since there is no hover on touch.

## 5. Layout

Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128.
Body measure caps at `68ch`. Content column caps at `1100px`.
Whitespace is vertical, not horizontal — sections breathe apart, columns stay tight.

## 6. Depth and elevation

Dark-mode rules: depth comes from **luminance stepping**, not drop shadows (dark on dark
is invisible). Canvas is the base. A raised surface is a semi-transparent white overlay
at 2–4%. Borders are `rgba(255,255,255,0.06)` subtle, `0.10` standard. There are no
decorative shadows anywhere in this project.

## 7. Do's and don'ts

- **Do** use type width to signal hierarchy before reaching for weight or size.
- **Do** keep every rule a true hairline (1px, `--color-rule`). It is the main structural device.
- **Do** give dates and numbers `tabular-nums`. Columns must align.
- **Don't** put content in a rounded card with a shadow. There are no cards in this system.
- **Don't** let amber become decorative. It marks indices, active state and focus. Nothing else.
- **Don't** use pure white or pure black. Both ends are tinted.
- **Don't** add a second accent colour, including in the 3D version. Engine glow is amber.
- **Don't** use cyan/violet for the space scene — it is the exact cliché this direction exists to avoid.
- **Don't** hand-edit `src/data/europe-map.json` — it is generated. Change the frame or the
  Places table in `content/en.md` and run `bun run build:map`.
- **Don't** centre body text. The grid is left-aligned throughout.

## 8. Responsive

Breakpoints: `sm` 640, `md` 768, `lg` 1024. Below `md` the side nav becomes a top bar and
the gate's two panels stack with a horizontal hairline between them. Touch targets are a
minimum of 44px. Hover states are wrapped in `@media (hover: hover)` so a tap does not
leave a stuck hover.

The 3D version drops to a lower pixel ratio below `md`, and falls back entirely to the
serious layout with no WebGL or under `prefers-reduced-motion`.

## 9. Agent prompt guide

```
canvas  oklch(0.16 0.006 62)     ink     oklch(0.94 0.008 62)
surface oklch(0.21 0.007 62)     muted   oklch(0.68 0.008 62)
rule    oklch(0.30 0.008 62)     faint   oklch(0.60 0.008 62)
amber   oklch(0.78 0.16 62)      dim     oklch(0.58 0.11 62)
radius  0 / 2px / 4px            fonts   Archivo (wdth), Martian Mono
```

Example prompts, ready to paste:

- "Build a section header: Martian Mono index `03` at 12px/0.08em uppercase in `--color-amber`, a 1px `--color-rule` hairline filling the remaining width, then an Archivo title at 36px weight 600 `font-stretch: 115%` letter-spacing -0.022em in `--color-ink`. No background, no border, 24px gap between index and title."
- "Build an experience row: left column 140px wide, Martian Mono 12px `tabular-nums` `--color-faint`, format `2023 — AUJOURD'HUI`. Right column: Archivo 20px weight 600 `--color-ink` for the role, 16px `--color-muted` for company · city, then task lines at 16px `--color-muted` each prefixed by a 4px amber square. 1px `--color-rule` top border, 32px vertical padding. No card."
- "Build the nav: vertical list, Archivo 15px `--color-faint`, 12px gap. Active item is `--color-ink` with a 12px×1px `--color-amber` tick absolutely positioned to its left, moved between items with `transform: translateY()` and a 400ms `cubic-bezier(0.16,1,0.3,1)` transition."
