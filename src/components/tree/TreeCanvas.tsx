"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  generateGrass,
  generateStars,
  generateTree,
  type Branch,
  type GrassBlade,
  type NavKey,
  type Star,
  type TreeDot,
  type TreePoint,
} from "@/lib/tree";

const COLORS = {
  bone: "#dedbd2",
  boneDim: "rgba(222,219,210,0.62)",
  boneFaint: "rgba(222,219,210,0.34)",
  accent: "#c9a25e",
};

const LABELS: Record<NavKey, { base: string; hover: string; branch: string }> = {
  work: { base: "work", hover: "see the work", branch: "feat/work" },
  writing: { base: "writing", hover: "read the writing", branch: "docs/writing" },
  me: { base: "me", hover: "who is mike", branch: "about/me" },
  contact: { base: "contact", hover: "say hello", branch: "ping/contact" },
};

const NAV_KEYS: NavKey[] = ["work", "writing", "me", "contact"];

type MapFn = (p: TreePoint) => TreePoint;

interface LabelHit {
  nav: NavKey;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface BranchRender {
  b: Branch;
  dots: TreeDot[];
}

interface Scratch {
  branches: BranchRender[];
  foliageByBranch: Map<number, TreeDot[]>;
  grass: GrassBlade[];
  stars: Star[];
  baseX: number;
  baseY: number;
  scale: number;
  groundY: number;
  vw: number;
  vh: number;
  soil: { x: number; y: number; r: number; a: number }[];
  labelK: Record<string, number>;
  pulse: { id: number; t0: number } | null;
  nextPulseAt: number;
}

export default function TreeCanvas({
  onNavigate,
  className,
}: {
  onNavigate: (nav: NavKey | "home") => void;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scratchRef = useRef<Scratch | null>(null);
  const hitsRef = useRef<LabelHit[]>([]);
  const mouseRef = useRef<{ x: number; y: number; on: boolean }>({
    x: -9999,
    y: -9999,
    on: false,
  });
  const hoverRef = useRef<NavKey | "base" | null>(null);
  const navigateRef = useRef(onNavigate);
  useEffect(() => {
    navigateRef.current = onNavigate;
  }, [onNavigate]);
  const reducedRef = useRef(false);
  const tRef = useRef(0);

  const buildScene = useCallback((vw: number, vh: number): Scratch => {
    const tree = generateTree(vw, vh);
    const rand = (() => {
      let a = 424242;
      return () => {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    })();

    // stipple dots along each branch (rest space)
    const foliageByBranch = new Map<number, TreeDot[]>();
    for (const f of tree.foliage) {
      // keep nav tips clean — skip foliage blobs attached to nav branches
      if (tree.branches[f.branch].nav) continue;
      foliageByBranch.set(f.branch, f.dots);
    }
    const branches: BranchRender[] = tree.branches.map((b) => {
      const dots: TreeDot[] = [];
      const thick = Math.max(0.9, 2.4 - b.depth * 0.24);
      const n = Math.max(10, Math.round(b.len * (b.depth === 0 ? 3.2 : 1.35)));
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        // position along polyline
        const ft = t * (b.points.length - 1);
        const i0 = Math.min(b.points.length - 2, Math.floor(ft));
        const f = ft - i0;
        const px = b.points[i0].x + (b.points[i0 + 1].x - b.points[i0].x) * f;
        const py = b.points[i0].y + (b.points[i0 + 1].y - b.points[i0].y) * f;
        const jx = (rand() - 0.5) * thick * 2.6;
        const jy = (rand() - 0.5) * thick * 2.6;
        dots.push({
          x: px + jx,
          y: py + jy,
          r: thick * (0.55 + rand() * 0.65),
          a: 0.42 + rand() * 0.5,
          tw: 0,
          ph: 0,
        });
      }
      return { b, dots };
    });

    // soil dither strip under the ground line
    const baseY = tree.offsetY;
    const soil: { x: number; y: number; r: number; a: number }[] = [];
    const soilCount = Math.floor(vw / 3.2);
    for (let i = 0; i < soilCount; i++) {
      const depth = Math.pow(rand(), 1.6);
      soil.push({
        x: rand() * vw,
        y: baseY + 2 + depth * 16,
        r: 0.8 + rand() * 0.9,
        a: 0.35 * (1 - depth) + rand() * 0.1,
      });
    }

    return {
      branches,
      foliageByBranch,
      grass: generateGrass(vw, baseY, tree.offsetX),
      stars: generateStars(vw, vh),
      baseX: tree.offsetX,
      baseY,
      scale: tree.scale,
      groundY: baseY,
      vw,
      vh,
      soil,
      labelK: { work: 0, writing: 0, me: 0, contact: 0 },
      pulse: null,
      nextPulseAt: 2.5,
    };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const S = scratchRef.current;
    if (!canvas || !S) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const t = tRef.current;
    const vw = S.vw;
    const vh = S.vh;
    const mobile = vw < 640;
    const wind =
      0.62 +
      0.38 * Math.sin(t * 0.21 + Math.sin(t * 0.083) * 1.7);

    // rest-space mouse
    const mx = (mouseRef.current.x - S.baseX) / S.scale;
    const my = (mouseRef.current.y - S.baseY) / S.scale;
    const mouseOn = mouseRef.current.on;
    void mx;
    void my;

    // --- compose per-branch transform maps (parents before children) ---
    const maps: MapFn[] = new Array(S.branches.length);
    const tips: TreePoint[] = new Array(S.branches.length);
    for (let i = 0; i < S.branches.length; i++) {
      const { b } = S.branches[i];
      let delta = Math.sin(t * b.speed + b.phase) * b.swayAmp * wind;
      if (mouseOn) {
        const midX = ((b.attach.x + b.tip.x) / 2) * S.scale + S.baseX;
        const midY = ((b.attach.y + b.tip.y) / 2) * S.scale + S.baseY;
        const dx = mouseRef.current.x - midX;
        const dy = mouseRef.current.y - midY;
        const d2 = dx * dx + dy * dy;
        const R = 210;
        if (d2 < R * R) {
          const d = Math.sqrt(Math.max(1, d2));
          const push = Math.pow(1 - d / R, 2) * 0.085;
          delta += push * (dx >= 0 ? -1 : 1) * (dy < 0 ? 1 : 0.55);
        }
      }
      const cos = Math.cos(delta);
      const sin = Math.sin(delta);
      const ax = b.attach.x;
      const ay = b.attach.y;
      const rot: MapFn = (p) => ({
        x: ax + (p.x - ax) * cos - (p.y - ay) * sin,
        y: ay + (p.x - ax) * sin + (p.y - ay) * cos,
      });
      maps[i] = b.parentId === null ? rot : (p) => maps[b.parentId as number](rot(p));
      tips[i] = maps[i](b.tip);
    }

    ctx.clearRect(0, 0, vw, vh);

    // --- stars ---
    for (const s of S.stars) {
      const sx = (s.x + t * s.drift) % (vw + 20) - 10;
      const a = s.a * (0.6 + 0.4 * Math.sin(t * s.tw + s.ph));
      ctx.fillStyle = `rgba(222,219,210,${a.toFixed(3)})`;
      ctx.fillRect(sx, s.y, s.r, s.r);
    }

    // --- soil ---
    for (const d of S.soil) {
      ctx.fillStyle = `rgba(222,219,210,${d.a.toFixed(3)})`;
      ctx.fillRect(d.x, d.y, d.r, d.r);
    }

    // --- branches (stipple) ---
    for (let i = 0; i < S.branches.length; i++) {
      const { dots } = S.branches[i];
      const map = maps[i];
      for (let j = 0; j < dots.length; j++) {
        const d = dots[j];
        const p = map(d);
        ctx.fillStyle = `rgba(222,219,210,${(d.a).toFixed(3)})`;
        ctx.fillRect(
          p.x * S.scale + S.baseX,
          p.y * S.scale + S.baseY,
          d.r + 0.4,
          d.r + 0.4
        );
      }
    }

    // --- foliage (transformed with its branch) ---
    for (let i = 0; i < S.branches.length; i++) {
      const { b } = S.branches[i];
      const cluster = S.foliageByBranch.get(b.id);
      if (!cluster) continue;
      const map = maps[i];
      for (const d of cluster) {
        const p = map(d);
        const a = d.tw
          ? d.a * (0.72 + 0.28 * Math.sin(t * d.tw + d.ph))
          : d.a;
        ctx.fillStyle = `rgba(222,219,210,${a.toFixed(3)})`;
        ctx.fillRect(
          p.x * S.scale + S.baseX,
          p.y * S.scale + S.baseY,
          d.r + 0.3,
          d.r + 0.3
        );
      }
    }

    // --- grass (in front of trunk base) ---
    for (const g of S.grass) {
      const sway = wind * g.h * 0.085 * Math.sin(t * 1.15 + g.phase);
      ctx.strokeStyle = g.h > 16 ? COLORS.boneDim : COLORS.boneFaint;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(g.x, S.groundY - g.pts[0].y);
      ctx.quadraticCurveTo(
        g.x + g.pts[1].x + sway,
        S.groundY + g.pts[1].y,
        g.x + g.pts[2].x + sway * 1.6,
        S.groundY + g.pts[2].y
      );
      ctx.stroke();
      if (g.flower) {
        const fx = g.x + g.pts[2].x + sway * 1.6;
        const fy = S.groundY + g.pts[2].y;
        const accent = Math.abs(g.phase - Math.PI) < 0.35;
        ctx.fillStyle = accent ? COLORS.accent : COLORS.boneDim;
        ctx.fillRect(fx - 1, fy - 2, 2, 2);
        ctx.fillRect(fx - 2.5, fy - 1, 2, 2);
        ctx.fillRect(fx + 1, fy - 1, 2, 2);
        ctx.fillRect(fx - 0.5, fy + 0.5, 2, 2);
      }
    }

    // --- commit nodes: terminals get tiny rings ---
    const pulseNow = S.pulse;
    let pulseAge = 0;
    if (pulseNow) {
      pulseAge = t - pulseNow.t0;
      if (pulseAge > 1.4) {
        S.pulse = null;
      }
    }
    for (let i = 0; i < S.branches.length; i++) {
      const b = S.branches[i].b;
      if (!b.terminal || b.nav) continue;
      const tp = tips[i];
      const X = tp.x * S.scale + S.baseX;
      const Y = tp.y * S.scale + S.baseY;
      ctx.strokeStyle = COLORS.boneFaint;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(X, Y, 2.2, 0, Math.PI * 2);
      ctx.stroke();
      if (pulseNow && pulseNow.id === i) {
        const k = pulseAge / 1.4;
        ctx.strokeStyle = `rgba(201,162,94,${(0.75 * (1 - k)).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(X, Y, 2.5 + k * 14, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = `rgba(201,162,94,${(0.9 * (1 - k)).toFixed(3)})`;
        ctx.fillRect(X - 1.5, Y - 1.5, 3, 3);
      }
    }

    // --- base node ("main") ---
    const baseHX = S.baseX;
    const baseHY = S.baseY;
    const baseHover = hoverRef.current === "base";
    ctx.strokeStyle = baseHover ? COLORS.bone : COLORS.boneDim;
    ctx.beginPath();
    ctx.arc(baseHX, baseHY, mobile ? 5 : 6.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = baseHover ? COLORS.bone : COLORS.boneDim;
    ctx.fillRect(baseHX - 1.6, baseHY - 1.6, 3.2, 3.2);
    ctx.font = `${mobile ? 9 : 10}px "JetBrains Mono", monospace`;
    ctx.fillStyle = baseHover ? COLORS.bone : COLORS.boneFaint;
    ctx.textAlign = "left";
    ctx.fillText("main", baseHX + 12, baseHY + 3);

    // --- nav labels ---
    const hits: LabelHit[] = [];
    const fs = mobile ? 11 : 13;
    // crown extents (screen px, rest-space based) — labels must land outside them
    let extentL = 0;
    let extentR = 0;
    for (const br of S.branches) {
      const tx = br.b.tip.x * S.scale;
      if (tx < extentL) extentL = tx;
      if (tx > extentR) extentR = tx;
    }
    // phase 1: geometry per label
    interface LabelGeom {
      nav: NavKey;
      idx: number;
      side: number;
      X: number;
      Y: number;
      ex: number;
      ey: number;
      kk: number;
      hovered: boolean;
      leaderLen: number;
    }
    const geoms: LabelGeom[] = [];
    for (const nav of NAV_KEYS) {
      const idx = S.branches.findIndex((br) => br.b.nav === nav);
      if (idx < 0) continue;
      const tp = tips[idx];
      const X = tp.x * S.scale + S.baseX;
      const Y = tp.y * S.scale + S.baseY;
      const side = tp.x >= 0 ? 1 : -1; // leader direction
      const hovered = hoverRef.current === nav;
      const k = S.labelK[nav];
      const target = hovered ? 1 : 0;
      S.labelK[nav] = k + (target - k) * 0.18;
      if (Math.abs(S.labelK[nav] - target) < 0.01) S.labelK[nav] = target;
      const kk = S.labelK[nav];

      // adaptive leader: extend past the crown edge so labels never bury in leaves
      const margin = mobile ? 16 : 26;
      const reach =
        side > 0
          ? extentR - tp.x * S.scale + margin
          : tp.x * S.scale - extentL + margin;
      const leaderLen =
        Math.min(110, Math.max(mobile ? 18 : 26, reach)) +
        kk * (mobile ? 8 : 12);
      const dxu = side / Math.hypot(side, -0.32);
      const dyu = -0.32 / Math.hypot(side, -0.32);
      geoms.push({
        nav,
        idx,
        side,
        X,
        Y,
        ex: X + dxu * leaderLen,
        ey: Y + dyu * leaderLen,
        kk,
        hovered,
        leaderLen,
      });
    }
    // phase 2: resolve same-side vertical overlaps (topmost stays, rest pushed down)
    const minGapY = fs + 9;
    for (const side of [-1, 1]) {
      const group = geoms
        .filter((g) => g.side === side)
        .sort((a, b) => a.ey - b.ey);
      for (let i = 1; i < group.length; i++) {
        if (group[i].ey - group[i - 1].ey < minGapY) {
          group[i].ey = group[i - 1].ey + minGapY;
        }
      }
    }
    // phase 3: draw
    for (const g of geoms) {
      const { nav, side, X, Y, ex, ey, kk, hovered, leaderLen } = g;

      // leader line (stippled)
      const steps = Math.max(3, Math.round(leaderLen / 3));
      ctx.fillStyle = COLORS.boneDim;
      for (let s2 = 0; s2 <= steps; s2++) {
        const f = s2 / steps;
        ctx.fillRect(X + (ex - X) * f, Y + (ey - Y) * f, 1.2, 1.2);
      }
      // barb
      ctx.strokeStyle = hovered ? COLORS.bone : COLORS.boneDim;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ex + side * 5, ey - 1);
      ctx.lineTo(ex, ey);
      ctx.lineTo(ex + side * 5, ey + 1);
      ctx.stroke();

      // node ring at branch tip
      ctx.strokeStyle = hovered ? COLORS.accent : COLORS.boneDim;
      ctx.beginPath();
      ctx.arc(X, Y, mobile ? 3 : 3.6, 0, Math.PI * 2);
      ctx.stroke();

      // text
      try {
        (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing =
          "0.6px";
      } catch {
        /* older browsers */
      }
      ctx.font = `500 ${fs}px "Libre Franklin", system-ui, sans-serif`;
      ctx.textAlign = side > 0 ? "left" : "right";
      const tx = ex + side * (mobile ? 7 : 9);
      const ty = ey + 4;
      if (kk < 0.98) {
        ctx.fillStyle = `rgba(222,219,210,${(0.92 * (1 - kk)).toFixed(3)})`;
        ctx.fillText(LABELS[nav].base, tx, ty);
      }
      if (kk > 0.02) {
        ctx.fillStyle = `rgba(238,236,229,${kk.toFixed(3)})`;
        ctx.fillText(LABELS[nav].hover, tx, ty);
        ctx.font = `${mobile ? 8 : 9}px "JetBrains Mono", monospace`;
        ctx.fillStyle = `rgba(168,165,156,${(0.85 * kk).toFixed(3)})`;
        ctx.fillText(LABELS[nav].branch, tx, ty + (mobile ? 11 : 13));
      }
      // measure for hit box (with the label font active)
      ctx.font = `500 ${fs}px "Libre Franklin", system-ui, sans-serif`;
      const wTxt = kk > 0.5
        ? ctx.measureText(LABELS[nav].hover).width + 4
        : ctx.measureText(LABELS[nav].base).width + 4;
      try {
        (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing =
          "0px";
      } catch {
        /* noop */
      }
      const hx = side > 0 ? ex : ex - wTxt - 10;
      const hy = ty - fs - 4;
      hits.push({
        nav,
        x: hx - 6,
        y: hy - 8,
        w: wTxt + 18 + (kk > 0.4 ? 30 : 0) + leaderLen,
        h: fs + 22,
      });
    }
    hitsRef.current = hits;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const vw = Math.max(320, rect.width);
      const vh = Math.max(480, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(vw * dpr);
      canvas.height = Math.round(vh * dpr);
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scratchRef.current = buildScene(vw, vh);
      if (reducedRef.current) draw();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    const tick = (now: number) => {
      tRef.current = now / 1000;
      const S = scratchRef.current;
      if (S && !S.pulse && tRef.current > S.nextPulseAt) {
        const terminals = S.branches.filter((br) => br.b.terminal);
        if (terminals.length) {
          const pick = terminals[Math.floor(Math.random() * terminals.length)];
          S.pulse = { id: pick.b.id, t0: tRef.current };
          S.nextPulseAt = tRef.current + 3 + Math.random() * 3.5;
        }
      }
      draw();
      raf = requestAnimationFrame(tick);
    };
    if (!reducedRef.current) {
      raf = requestAnimationFrame(tick);
    }

    const onFonts = () => {
      if (reducedRef.current) draw();
    };
    document.fonts?.ready.then(onFonts).catch(() => {});

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [buildScene, draw]);

  const pickHit = (x: number, y: number): NavKey | "base" | null => {
    for (const h of hitsRef.current) {
      if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) return h.nav;
    }
    const S = scratchRef.current;
    if (S) {
      const d = Math.hypot(x - S.baseX, y - S.baseY);
      if (d < 30) return "base";
    }
    return null;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseRef.current = { x, y, on: true };
    const hit = pickHit(x, y);
    if (hit !== hoverRef.current) {
      hoverRef.current = hit;
      e.currentTarget.style.cursor = hit ? "pointer" : "default";
      if (reducedRef.current) draw();
    } else if (reducedRef.current) {
      draw();
    }
  };

  const onPointerLeave = () => {
    mouseRef.current = { x: -9999, y: -9999, on: false };
    hoverRef.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "default";
    if (reducedRef.current) draw();
  };

  const onClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const hit = pickHit(e.clientX - rect.left, e.clientY - rect.top);
    if (hit) navigateRef.current(hit === "base" ? "home" : hit);
  };

  return (
    <canvas
      ref={canvasRef}
      aria-label="clevermike: work, writing, me, contact — a git tree of everything i've shipped"
      className={className}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onClick={onClick}
    />
  );
}
