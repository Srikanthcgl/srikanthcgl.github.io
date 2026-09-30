/** The decorative "system architecture" that lives behind the page: layout + a tiny flow simulation. */
export interface NodeDef { id: string; label: string; x: number; y: number; w: number; tone: "client" | "edge" | "service" | "data" | "cloud" | "ops" }
export interface EdgeDef { a: string; b: string; dashed?: boolean; pipeline?: boolean }

export const WORLD_W = 2700;
export const WORLD_H = 1560;

const n = (id: string, label: string, x: number, y: number, tone: NodeDef["tone"], w = 158): NodeDef => ({ id, label, x, y, w, tone });

export const nodes: NodeDef[] = [
  n("android", "Android app", 280, 330, "client"),
  n("web", "Web dashboard", 280, 680, "client"),
  n("devices", "IoT devices", 280, 1030, "client"),
  n("gateway", "API gateway", 800, 430, "edge"),
  n("mqtt", "MQTT broker", 800, 1000, "edge"),
  n("auth", "Auth", 1310, 250, "service", 120),
  n("services", "Microservices", 1310, 640, "service", 172),
  n("workers", "Workers", 1310, 1010, "service", 132),
  n("db", "Database", 1830, 370, "data", 136),
  n("s3", "Storage (S3)", 1830, 760, "data"),
  n("queue", "Queue", 1830, 1110, "data", 120),
  n("aws", "AWS cloud", 2350, 600, "cloud", 158),
  n("monitor", "Monitoring", 2350, 1010, "cloud", 150),
  n("code", "Code", 560, 1410, "ops", 110),
  n("build", "Build", 1000, 1410, "ops", 110),
  n("test", "Test", 1440, 1410, "ops", 110),
  n("tf", "Terraform", 1880, 1410, "ops", 140),
  n("deploy", "Deploy", 2300, 1410, "ops", 120),
];

export const edges: EdgeDef[] = [
  { a: "android", b: "gateway" }, { a: "web", b: "gateway" }, { a: "devices", b: "mqtt" },
  { a: "gateway", b: "auth" }, { a: "gateway", b: "services" }, { a: "mqtt", b: "services" }, { a: "mqtt", b: "workers" },
  { a: "services", b: "db" }, { a: "services", b: "s3" }, { a: "workers", b: "queue" }, { a: "workers", b: "db" },
  { a: "db", b: "aws" }, { a: "s3", b: "aws" }, { a: "queue", b: "aws" }, { a: "aws", b: "monitor" },
  { a: "code", b: "build", pipeline: true }, { a: "build", b: "test", pipeline: true }, { a: "test", b: "tf", pipeline: true }, { a: "tf", b: "deploy", pipeline: true },
  { a: "deploy", b: "aws", dashed: true, pipeline: true },
];

const byId = new Map(nodes.map(v => [v.id, v]));
export const node = (id: string): NodeDef => byId.get(id)!;

export interface Pt { x: number; y: number }

/** Point on the S-curve between two node centres. */
export function edgePoint(e: EdgeDef, t: number): Pt {
  const A = node(e.a), B = node(e.b);
  const dx = B.x - A.x;
  const c1x = A.x + dx * 0.5, c2x = B.x - dx * 0.5;
  const u = 1 - t;
  return {
    x: u * u * u * A.x + 3 * u * u * t * c1x + 3 * u * t * t * c2x + t * t * t * B.x,
    y: u * u * u * A.y + 3 * u * u * t * A.y + 3 * u * t * t * B.y + t * t * t * B.y,
  };
}

export const edgeLength: number[] = edges.map(e => {
  let len = 0, prev = edgePoint(e, 0);
  for (let i = 1; i <= 24; i++) { const p = edgePoint(e, i / 24); len += Math.hypot(p.x - prev.x, p.y - prev.y); prev = p; }
  return len;
});

const roamEdges = edges.map((e, i) => (e.pipeline ? -1 : i)).filter(i => i >= 0);
const pipelineEdges = edges.map((e, i) => (e.pipeline && !e.dashed ? i : -1)).filter(i => i >= 0);
const deployEdge = edges.findIndex(e => e.dashed);

export interface Packet { e: number; t: number; speed: number; rev: boolean }
export interface Bot { e: number; t: number; dir: 1 | -1; speed: number; phase: number }
export interface PipeBot { stage: number; t: number; state: "wait" | "move" | "deploy" | "reset"; timer: number; onEdge: number }

export class Flow {
  packets: Packet[] = [];
  bots: Bot[] = [];
  pipe: PipeBot = { stage: 0, t: 0, state: "wait", timer: 0.6, onEdge: -1 };
  pulse = new Map<string, number>();
  time = 0;
  private spawn = edges.map(() => Math.random() * 1.5);

  constructor(botCount: number) {
    for (let i = 0; i < botCount; i++) {
      this.bots.push({ e: roamEdges[Math.floor(Math.random() * roamEdges.length)], t: Math.random(), dir: Math.random() > 0.5 ? 1 : -1, speed: 55 + Math.random() * 35, phase: Math.random() * 6 });
    }
  }

  private ping(id: string) { this.pulse.set(id, 1); }

  private nextEdgeFrom(nodeId: string, avoid: number): number {
    const opts = roamEdges.filter(i => i !== avoid && (edges[i].a === nodeId || edges[i].b === nodeId));
    const pool = opts.length ? opts : roamEdges.filter(i => edges[i].a === nodeId || edges[i].b === nodeId);
    return pool.length ? pool[Math.floor(Math.random() * pool.length)] : avoid;
  }

  /** `boost` >= 0 speeds everything up while the page is being scrolled. */
  update(dt: number, boost: number): void {
    this.time += dt;
    const k = 1 + boost;

    for (let i = 0; i < edges.length; i++) {
      this.spawn[i] -= dt * (0.55 + boost * 1.1);
      if (this.spawn[i] <= 0) {
        this.spawn[i] = 0.9 + Math.random() * 1.8;
        if (this.packets.length < 70) this.packets.push({ e: i, t: 0, speed: 130 + Math.random() * 90, rev: !edges[i].pipeline && Math.random() < 0.3 });
      }
    }
    for (let i = this.packets.length - 1; i >= 0; i--) {
      const p = this.packets[i];
      p.t += (p.speed * k * dt) / edgeLength[p.e];
      if (p.t >= 1) {
        this.ping(p.rev ? edges[p.e].a : edges[p.e].b);
        this.packets.splice(i, 1);
      }
    }

    for (const b of this.bots) {
      b.t += b.dir * ((b.speed * k * dt) / edgeLength[b.e]);
      if (b.t >= 1 || b.t <= 0) {
        const at = b.t >= 1 ? edges[b.e].b : edges[b.e].a;
        this.ping(at);
        const next = this.nextEdgeFrom(at, b.e);
        b.e = next;
        if (edges[next].a === at) { b.dir = 1; b.t = 0; } else { b.dir = -1; b.t = 1; }
      }
    }

    const p = this.pipe;
    if (p.state === "wait") {
      p.timer -= dt * k;
      if (p.timer <= 0) { p.state = "move"; p.onEdge = pipelineEdges[p.stage]; p.t = 0; }
    } else if (p.state === "move") {
      p.t += (150 * k * dt) / edgeLength[p.onEdge];
      if (p.t >= 1) {
        p.stage++;
        this.ping(edges[p.onEdge].b);
        if (p.stage >= pipelineEdges.length) { p.state = "deploy"; p.onEdge = deployEdge; p.t = 0; } else { p.state = "wait"; p.timer = 0.7; }
      }
    } else if (p.state === "deploy") {
      p.t += (130 * k * dt) / edgeLength[p.onEdge];
      if (p.t >= 1) { this.ping("aws"); p.state = "reset"; p.timer = 1.2; }
    } else {
      p.timer -= dt;
      if (p.timer <= 0) { p.stage = 0; p.state = "wait"; p.timer = 0.6; p.onEdge = -1; }
    }

    for (const [id, v] of this.pulse) {
      const nv = v - dt * 1.6;
      if (nv <= 0) this.pulse.delete(id); else this.pulse.set(id, nv);
    }
  }
}

export const pipelineStageIds = ["code", "build", "test", "tf", "deploy"];
