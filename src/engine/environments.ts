/**
 * Visual environments the page moves through. Each section declares one with `data-env`;
 * the ThemeController blends between them by scroll position.
 */
export type EnvId = "core" | "blueprint" | "industrial" | "network" | "command" | "light";
export type RGBA = [number, number, number, number];

export interface Palette {
  bg: RGBA;
  surface: RGBA;
  text: RGBA;
  muted: RGBA;
  line: RGBA;
  accent: RGBA;
  accent2: RGBA;
  onAccent: RGBA;
}

export interface Environment { id: EnvId; label: string; palette: Palette }

const hex = (h: string, a = 1): RGBA => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255, a];
};

export const ENVIRONMENTS: Environment[] = [
  {
    id: "core", label: "System core",
    palette: { bg: hex("#05070c"), surface: hex("#0d121c", 0.78), text: hex("#e7ebf2"), muted: hex("#8a94a6"), line: hex("#b4c6e6", 0.12), accent: hex("#86aefc"), accent2: hex("#9fe0d4"), onAccent: hex("#05070c") },
  },
  {
    id: "blueprint", label: "Blueprint",
    palette: { bg: hex("#0b1a2c"), surface: hex("#10243a", 0.8), text: hex("#e4edf8"), muted: hex("#93a8c1"), line: hex("#9cc4ee", 0.2), accent: hex("#8fc6ff"), accent2: hex("#cfdcea"), onAccent: hex("#071423") },
  },
  {
    id: "industrial", label: "Industrial signal",
    palette: { bg: hex("#121315"), surface: hex("#1b1c1f", 0.9), text: hex("#ece8e1"), muted: hex("#a29c92"), line: hex("#f2d2a8", 0.12), accent: hex("#e8a24a"), accent2: hex("#c9bba6"), onAccent: hex("#1a1206") },
  },
  {
    id: "network", label: "Network",
    palette: { bg: hex("#0b0d26"), surface: hex("#141838", 0.82), text: hex("#e8eaff"), muted: hex("#9ea4d4"), line: hex("#aeb6ff", 0.15), accent: hex("#98a3ff"), accent2: hex("#78d3f5"), onAccent: hex("#0b0d26") },
  },
  {
    id: "command", label: "Command center",
    palette: { bg: hex("#101112"), surface: hex("#18191b", 0.9), text: hex("#e7e7e4"), muted: hex("#9a9a95"), line: hex("#ffffff", 0.09), accent: hex("#9ed6b4"), accent2: hex("#d9d9d4"), onAccent: hex("#0d1a12") },
  },
  {
    id: "light", label: "Open channel",
    palette: { bg: hex("#f3f2ee"), surface: hex("#ffffff", 0.85), text: hex("#15171c"), muted: hex("#5d616a"), line: hex("#15171c", 0.1), accent: hex("#1e3a6e"), accent2: hex("#47648f"), onAccent: hex("#ffffff") },
  },
];

const byId = new Map(ENVIRONMENTS.map(e => [e.id, e]));
export const envById = (id: EnvId): Environment => byId.get(id) ?? ENVIRONMENTS[0];
export const DEFAULT_ORDER: EnvId[] = ENVIRONMENTS.map(e => e.id);

const smoothstep = (x: number) => { const t = Math.min(1, Math.max(0, x)); return t * t * (3 - 2 * t); };

/**
 * Continuous environment position (0 … n-1) for a viewport centre `center`, given section tops.
 * Inside a section the value is a whole number; it eases across a ±`zone` hand-off around each boundary.
 */
export function envPosition(tops: number[], center: number, zone: number): number {
  let f = 0;
  for (let i = 1; i < tops.length; i++) f += smoothstep((center - (tops[i] - zone)) / (2 * zone));
  return f;
}

const mix = (a: RGBA, b: RGBA, t: number): RGBA => [
  a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, a[3] + (b[3] - a[3]) * t,
];

export function blendPalette(f: number, order: EnvId[] = DEFAULT_ORDER): Palette {
  const max = order.length - 1;
  const c = Math.min(Math.max(f, 0), max);
  const i = Math.min(Math.floor(c), Math.max(0, max - 1));
  const t = max === 0 ? 0 : c - i;
  const A = envById(order[i]).palette;
  const B = envById(order[Math.min(i + 1, max)]).palette;
  const out = {} as Palette;
  (Object.keys(A) as (keyof Palette)[]).forEach(k => { out[k] = mix(A[k], B[k], t); });
  return out;
}

export const rgba = (c: RGBA, alpha = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${+(c[3] * alpha).toFixed(3)})`;

/** Shared, mutable environment state read by canvases every frame (no React re-renders). */
export const envState = {
  order: DEFAULT_ORDER as EnvId[],
  f: 0,
  palette: blendPalette(0),
  /** Weight 0…1 of each environment at the current scroll position. */
  weight: { core: 1, blueprint: 0, industrial: 0, network: 0, command: 0, light: 0 } as Record<EnvId, number>,
};
