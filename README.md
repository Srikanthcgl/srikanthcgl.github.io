# Portfolio

A calm, modern portfolio themed as a live cloud-architecture blueprint: clients, API gateway, MQTT, services, data, AWS and a CI/CD → Terraform → Deploy lane, with small robot agents carrying data along the wires. Scrolling glides the camera across the diagram (and speeds up the flow). Includes a phone-mockup hero and a showcase for Android apps.
React 18 · TypeScript (strict) · Vite · no UI framework. Fonts are self-hosted.

## Edit your content — one file

Everything shown on the site comes from **[src/portfolio.config.ts](src/portfolio.config.ts)**:

- personal details, photo, résumé, social links, availability
- hero text, about, **Android apps**, projects, skills, experience, education, contact, footer
- which sections appear and in what order (`sections`), and their menu names (`navLabels`)
- a `glossary` of plain-English explanations — any tag matching a glossary key gets a “?” tooltip
- page title, description and share-card details (`meta`) — injected into `index.html` at build time

Put images and your résumé in `public/` and reference them as `"/me.jpg"`, `"/resume.pdf"`.

### Adding an Android app

In `apps.items`, copy one block and edit it. Put screenshots in `public/apps/` and list them as
`screenshots: ["/apps/myapp-1.png", ...]` (leave `[]` for an auto-generated preview). Add your Google Play link under
`links`. The app appears as a swipeable phone mockup; delete the block to remove it.

### Safety net

If you make a mistake in the config (duplicate id, bad colour, unknown section…), `npm run dev` prints a friendly
warning in the browser console and `npm test` fails with a clear message.

### Placeholders

Anything containing `TODO` is a placeholder. In `npm run dev` it is shown so you can find it; in the
production build unfinished entries are **hidden automatically**, and sections left with no content disappear.

### Change the look

- Colours and fonts: the `:root` block at the top of [src/styles/index.css](src/styles/index.css)
- The architecture diagram (node names, positions, wires): [src/scenery/network.ts](src/scenery/network.ts)
- Camera path, robot look and drawing: [src/scenery/Backdrop.tsx](src/scenery/Backdrop.tsx)

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm run lint` | ESLint (includes accessibility rules) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest — validates the config (unique ids, valid sections, placeholder handling) |

## Accessibility & performance

- Plain-language copy, glossary tooltips (hover, focus or tap; Esc closes)
- Skip link, semantic landmarks, `aria-current` menu, native `<dialog>` for project stories
- The background is a decorative canvas (`aria-hidden`); `prefers-reduced-motion` gives a still frame
- Pixel density capped, fewer particles on phones, animation pauses when the tab is hidden

## Deploy

Vercel / Netlify / Cloudflare Pages: build `npm run build`, output `dist`. Set `meta.url` in the config first so
canonical and share tags are correct. CI (lint, typecheck, test, build) is in `.github/workflows/ci.yml`.
