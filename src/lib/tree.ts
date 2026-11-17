// Procedural "git tree" generator — deterministic, seeded.
// The whole interface grows out of one living tree: branches end in commit
// nodes and four of them carry the navigation (work / writing / me / contact).

export type NavKey = "work" | "writing" | "me" | "contact";

export interface TreePoint {
  x: number;
  y: number;
}

export interface TreeDot {
  x: number; // rest-space position
  y: number;
  r: number;
  a: number; // alpha
  tw: number; // twinkle freq (0 = steady)
  ph: number; // twinkle phase
}

export interface Branch {
  id: number;
  parentId: number | null;
  depth: number;
  attach: TreePoint; // attachment point in rest space
  points: TreePoint[]; // rest-space polyline (attach is points[0])
  tip: TreePoint;
  tipDir: TreePoint; // unit vector pointing away from the tree at the tip
  len: number;
  restAngle: number;
  phase: number;
  speed: number;
  swayAmp: number;
  terminal: boolean;
  foliage: boolean;
  nav: NavKey | null;
}

export interface FoliageCluster {
  branch: number; // branch id
  dots: TreeDot[];
}

export interface GeneratedTree {
  branches: Branch[];
  foliage: FoliageCluster[];
  base: TreePoint; // trunk base (rest space)
  scale: number;
  offsetX: number;
  offsetY: number;
}

export interface GrassBlade {
  x: number;
  pts: TreePoint[]; // rest space, relative to base line
  h: number;
  phase: number;
  flower: boolean;
}

export interface Star {
  x: number;
  y: number;
  r: number;
  a: number;
  tw: number;
  ph: number;
  drift: number;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MAX_DEPTH = 7;

export function generateTree(vw: number, vh: number): GeneratedTree {
  const rand = mulberry32(20261116);
  const branches: Branch[] = [];
  const foliage: FoliageCluster[] = [];

  // Virtual space: trunk base at (0, 0), grows upward (negative y).
  const base: TreePoint = { x: 0, y: 0 };

  function branch(
    attach: TreePoint,
    angle: number,
    len: number,
    depth: number,
    parentId: number | null
  ): number {
    const id = branches.length;
    const pts: TreePoint[] = [{ ...attach }];
    const segs = Math.max(4, Math.round(len / 14));
    let a = angle;
    let x = attach.x;
    let y = attach.y;
    const curveDrift = (rand() - 0.5) * 0.16;
    for (let i = 0; i < segs; i++) {
      a += curveDrift / segs + (rand() - 0.5) * 0.07;
      const step = len / segs;
      x += Math.cos(a) * step;
      y += Math.sin(a) * step;
      pts.push({ x, y });
    }
    const tip = pts[pts.length - 1];
    const restAngle = Math.atan2(tip.y - attach.y, tip.x - attach.x);
    const terminal =
      depth >= 5 && rand() < 0.55
        ? true
        : depth >= MAX_DEPTH || len < 26 || (depth >= 3 && rand() < 0.08);

    const b: Branch = {
      id,
      parentId,
      depth,
      attach: { ...attach },
      points: pts,
      tip,
      tipDir: { x: Math.cos(restAngle), y: Math.sin(restAngle) },
      len,
      restAngle,
      phase: rand() * Math.PI * 2,
      speed: 0.5 + rand() * 0.4,
      swayAmp: 0.006 + depth * 0.0055,
      terminal,
      foliage: false,
      nav: null,
    };
    branches.push(b);

    if (!terminal) {
      const childCount = depth === 0 ? 2 : rand() < 0.72 ? 2 : 3;
      // keep the trunk's first fork narrow so the stem reads clearly
      const spread = depth === 0 ? 0.22 + rand() * 0.12 : 0.42 + rand() * 0.3;
      const childLen = len * (0.7 + rand() * 0.12);
      for (let c = 0; c < childCount; c++) {
        let ca: number;
        if (childCount === 2) {
          ca = a + (c === 0 ? -spread : spread) * (0.75 + rand() * 0.5);
        } else {
          ca = a + (c - 1) * spread * (0.8 + rand() * 0.4);
        }
        // bias upward (phototropism) — branches want to reach the light
        if (ca > -0.25) ca = -0.25 - rand() * 0.25;
        if (ca < -Math.PI + 0.25) ca = -Math.PI + 0.25 + rand() * 0.25;
        branch({ ...tip }, ca, childLen, depth + 1, id);
      }
    } else if (
      (depth >= 2 && len >= 26 && rand() < 0.85) ||
      (!terminal && depth >= 2 && rand() < 0.25)
    ) {
      b.foliage = true;
    }

    if (b.foliage) {
      const count = 34 + Math.floor(rand() * 52);
      const sigma = Math.max(12, len * 0.5);
      const dots: TreeDot[] = [];
      for (let i = 0; i < count; i++) {
        // gaussian-ish cluster around the tip
        const gx = (rand() + rand() + rand() - 1.5) * sigma;
        const gy = (rand() + rand() + rand() - 1.5) * sigma * 0.85;
        dots.push({
          x: tip.x + gx,
          y: tip.y + gy,
          r: 0.8 + rand() * 1.5,
          a: 0.3 + rand() * 0.6,
          tw: rand() < 0.3 ? 0.6 + rand() * 1.2 : 0,
          ph: rand() * Math.PI * 2,
        });
      }
      foliage.push({ branch: id, dots });
    }
    return id;
  }

  // trunk
  branch(
    base,
    -Math.PI / 2 + (rand() - 0.5) * 0.12,
    Math.min(vh * 0.34, 215),
    0,
    null
  );

  // --- crown extents (rest space) — computed first so the nav bands below
  // can be expressed relative to the tree's real height ---
  let minY = 0,
    minX = 0,
    maxX = 0;
  for (const b of branches) {
    for (const p of b.points) {
      minY = Math.min(minY, p.y);
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
    }
  }
  const treeW = Math.max(1, maxX - minX);
  const treeH = Math.max(1, -minY);

  // --- assign navigation to four branches — one per quadrant ---
  // with four nav items the labels ring the crown: one anchor near each
  // corner (top-left, bottom-left, top-right, bottom-right), scored by
  // corner proximity so the four labels spread around the tree instead of
  // clustering at the crown's widest point and leaving the top bare.
  const candidates = branches.filter((b) => b.depth >= 2 && b.len >= 30);
  const leftCands = candidates.filter((b) => b.tip.x < 0);
  const rightCands = candidates.filter((b) => b.tip.x > 0);
  const edgePick = (
    pool: Branch[],
    score: (b: Branch) => number,
    taken: Branch[],
    minGapY: number
  ): Branch | null => {
    const ranked = [...pool].sort((a, b) => score(a) - score(b));
    const hit = ranked.find(
      (b) =>
        !taken.includes(b) &&
        taken.every((t) => Math.abs(b.tip.y - t.tip.y) > minGapY)
    );
    return hit ?? ranked.find((b) => !taken.includes(b)) ?? null;
  };
  // corner scores — lower is better: 0 sits exactly on the target corner.
  // outness dominates the upper picks so both top labels hug the crown's
  // top corners; height dominates the lower picks (the crown is V-shaped,
  // so low anchors sit deeper toward the trunk and the adaptive leader
  // lines carry their labels out past the edge).
  const hFrac = (b: Branch) => (b.tip.y - minY) / treeH; // 0 = crown top
  const outLeft = (b: Branch) => (b.tip.x - minX) / treeW; // 0 = left edge
  const outRight = (b: Branch) => (maxX - b.tip.x) / treeW; // 0 = right edge
  const corner =
    (hTarget: number, out: (b: Branch) => number, outWeight: number) =>
    (b: Branch) =>
      Math.abs(hFrac(b) - hTarget) + outWeight * out(b);
  const gap = treeH * 0.15; // minimum vertical gap between same-side labels
  const work = edgePick(leftCands, corner(0.12, outLeft, 0.9), [], 0);
  const writing = edgePick(
    leftCands,
    corner(0.62, outLeft, 0.25),
    work ? [work] : [],
    gap
  );
  const me = edgePick(rightCands, corner(0.12, outRight, 0.9), [], 0);
  const contact = edgePick(
    rightCands,
    corner(0.62, outRight, 0.25),
    me ? [me] : [],
    gap
  );
  const fallbacks = [work, writing, me, contact];
  const navs: NavKey[] = ["work", "writing", "me", "contact"];
  let fi = 0;
  for (let i = 0; i < navs.length; i++) {
    let target = fallbacks[i];
    if (!target) {
      // fallback: any unused candidate, ordered by height
      const pool = candidates.filter((b) => b.nav === null);
      if (!pool.length) break;
      pool.sort((a, b) => a.tip.y - b.tip.y);
      target = pool[Math.min(fi++, pool.length - 1)];
    }
    target.nav = navs[i];
    // keep nav tips clean — no foliage blob burying the commit node
    target.foliage = false;
  }

  // scale to fit the canvas
  const isMobile = vw < 640;
  const scale =
    Math.min((vw * (isMobile ? 0.58 : 0.46)) / treeW, (vh * 0.66) / treeH) *
    (isMobile ? 0.78 : 1);
  const offsetX = isMobile ? vw * 0.5 : vw * 0.47;
  const offsetY = vh * (isMobile ? 0.62 : 0.82);

  return { branches, foliage, base, scale, offsetX, offsetY };
}

export function generateGrass(
  vw: number,
  groundY: number,
  baseX: number
): GrassBlade[] {
  const rand = mulberry32(77031);
  const blades: GrassBlade[] = [];
  const count = Math.floor(vw / 7);
  for (let i = 0; i < count; i++) {
    const x = rand() * vw;
    const h = 5 + rand() * 20 * (1 - Math.abs(x - baseX) / (vw * 0.75));
    const lean = (rand() - 0.5) * 1.6;
    const pts: TreePoint[] = [
      { x: 0, y: 0 },
      { x: lean * h * 0.35, y: -h * 0.55 },
      { x: lean * h, y: -h },
    ];
    blades.push({
      x,
      pts,
      h,
      phase: rand() * Math.PI * 2,
      flower: rand() < 0.06 && h > 14,
    });
  }
  void groundY;
  return blades;
}

export function generateStars(vw: number, vh: number): Star[] {
  const rand = mulberry32(90210);
  const stars: Star[] = [];
  const count = Math.floor((vw * vh) / 16000);
  for (let i = 0; i < count; i++) {
    stars.push({
      x: rand() * vw,
      y: rand() * vh * 0.78,
      r: rand() < 0.85 ? 1 : 1.6,
      a: 0.1 + rand() * 0.5,
      tw: 0.4 + rand() * 1.4,
      ph: rand() * Math.PI * 2,
      drift: 1.5 + rand() * 3.5,
    });
  }
  return stars;
}
