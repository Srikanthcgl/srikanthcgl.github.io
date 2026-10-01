# Srikanth Chinthaginjala — Systems Portfolio

A portfolio that behaves like a living engineering system. As you scroll, the page moves through six
environments and its colours, geometry and density blend continuously between them:

| Section | Environment | Visual |
| --- | --- | --- |
| Hero | System core | Interactive core + domain nodes, data packets, particles |
| About | Blueprint | Grid, dimension marks, cursor crosshair; method schematic lights up on scroll |
| Work | Industrial signal | System modules with signal chains; amber traces |
| Engineering | Network | Capability graph — hover to trace relationships |
| Experience | Command center | Timeline rail fills with scroll; milestones come online |
| Contact | Open channel | Light, minimal ending |

React 18 · TypeScript (strict) · Vite · plain CSS · SVG + Canvas 2D. No animation library, no WebGL.

## Edit content — one file

Everything is in **[src/portfolio.config.ts](src/portfolio.config.ts)** (cheat sheet at the top):
personal details, hero text and **domains** (the nodes around the core), about + **method phases**,
projects (each with a `flow` signal chain), skill **groups + relations**, experience, contact, glossary.
Mistakes are reported in the dev console and by `npm test`. `TODO` entries are hidden in production.

## How it works

- `src/engine/environments.ts` — palettes per environment, `envPosition()` and `blendPalette()`.
- `src/engine/ThemeController.tsx` — reads `[data-env]` sections, interpolates on scroll (rAF-throttled),
  writes `--bg`, `--accent`, `--accent-rgb`, … on `<html>` only when they change.
- `src/engine/AmbientField.tsx` — one fixed canvas; draws only the current/next environment's geometry.
- `src/engine/CursorField.tsx` — desktop-only cursor field + `[data-magnetic]` elements (CSS `translate`).
- `src/components/system/InteractiveSystem.tsx` — hero diagram (desktop) / system bus (mobile).
- `src/components/sections/*` — About (blueprint), Projects (modules), Skills (graph / cards), Experience, Contact.

## Performance & accessibility

- One continuous loop (ambient canvas); hero/skill animations run only while on screen; loops idle when the tab is hidden.
- No blur filters; capped device-pixel-ratio; ~30fps ambient and reduced density on phones.
- Cursor effects only with a fine, hovering pointer and without `prefers-reduced-motion`; reduced motion = still frames.
- All content is real DOM: nodes and hubs are buttons, canvases are `aria-hidden`, native `<dialog>` for dossiers, skip link.

## Scripts

`npm run dev` · `npm run build` · `npm run lint` · `npm run typecheck` · `npm test`

## Deploy

Vercel / Netlify / Cloudflare Pages — build `npm run build`, output `dist`. Set `meta.url` first.
