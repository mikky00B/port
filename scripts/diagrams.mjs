// Generates hand-drawn-style system design diagrams as static SVGs.
//
// Usage:   node scripts/diagrams.mjs [scene-name ...]   (no args = all scenes)
// Output:  public/diagrams/<name>.svg
//
// Style: roughjs 4.x for sketchy strokes, Virgil for handwritten labels.
// Virgil font (c) The Excalidraw Authors, SIL Open Font License 1.1
// (downloaded from unpkg @excalidraw/excalidraw, embedded as a data URI so the
// SVG renders correctly when referenced through <img>).

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import rough from "roughjs";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(scriptDir);
const outDir = join(projectRoot, "public", "diagrams");

const fontB64 = readFileSync(join(scriptDir, "assets", "Virgil.woff2")).toString("base64");

const INK = "#1F1F1F";
const PAPER = "#FFFDF6";
const YELLOW = "#FFDF5E";
const SEED = 7;

const gen = (() => {
  const roughMod = rough.default ?? rough;
  return roughMod.generator();
})();

function opsToPath(ops) {
  let d = "";
  for (const op of ops) {
    if (op.op === "move") d += `M ${op.data[0]} ${op.data[1]} `;
    else if (op.op === "lineTo") d += `L ${op.data[0]} ${op.data[1]} `;
    else if (op.op === "bcurveTo") d += `C ${op.data.join(" ")} `;
  }
  return d.trim();
}

function setsToSvg(drawable, opts) {
  const parts = [];
  for (const set of drawable.sets) {
    const d = opsToPath(set.ops);
    if (!d) continue;
    if (set.type === "fillPath") {
      parts.push(`<path d="${d}" fill="${opts.fill}" stroke="none"/>`);
    } else if (set.type === "fillSketch") {
      parts.push(
        `<path d="${d}" fill="none" stroke="${opts.fill}" stroke-width="${opts.fillWeight ?? 1}" stroke-linecap="round"/>`
      );
    } else {
      parts.push(
        `<path d="${d}" fill="none" stroke="${opts.stroke}" stroke-width="${opts.strokeWidth ?? 1.25}" stroke-linecap="round" stroke-linejoin="round"/>`
      );
    }
  }
  return parts;
}

function text(cx, cy, label, { size = 17, fill = INK, anchor = "middle" } = {}) {
  return `<text x="${cx}" y="${cy}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" dominant-baseline="middle" paint-order="stroke" stroke="${PAPER}" stroke-width="5">${label}</text>`;
}

function box(cx, cy, w, h, label, opts = {}) {
  const o = { stroke: INK, strokeWidth: 1.75, fill: YELLOW, fillStyle: "solid", seed: SEED, ...opts };
  const x = cx - w / 2;
  const y = cy - h / 2;
  return setsToSvg(gen.rectangle(x, y, w, h, o), o).join("\n") + "\n" + text(cx, cy, label);
}

function stack(cx, cy, w, h, label, n = 3, offset = 7, opts = {}) {
  const o = { stroke: INK, strokeWidth: 1.75, fill: YELLOW, fillStyle: "solid", seed: SEED, ...opts };
  const parts = [];
  for (let i = n - 1; i >= 0; i--) {
    const x = cx - w / 2 + i * offset;
    const y = cy - h / 2 + i * offset;
    parts.push(...setsToSvg(gen.rectangle(x, y, w, h, { ...o, seed: SEED + i }), o));
  }
  parts.push(text(cx, cy + offset, label));
  return parts.join("\n");
}

function ellipseNode(cx, cy, w, h, label, opts = {}) {
  const o = { stroke: INK, strokeWidth: 1.75, fill: YELLOW, fillStyle: "solid", seed: SEED, ...opts };
  return setsToSvg(gen.ellipse(cx, cy, w, h, o), o).join("\n") + "\n" + text(cx, cy, label);
}

function cylinder(cx, cy, w, h, label, opts = {}) {
  const o = { stroke: INK, strokeWidth: 1.75, fill: YELLOW, fillStyle: "solid", seed: SEED, ...opts };
  const eh = Math.min(24, h * 0.28);
  const left = cx - w / 2;
  const right = cx + w / 2;
  const top = cy - h / 2;
  const bottom = cy + h / 2;
  const bodyD = `M ${left} ${top + eh / 2} L ${left} ${bottom - eh / 2} Q ${cx} ${bottom + eh / 2} ${right} ${bottom - eh / 2} L ${right} ${top + eh / 2}`;
  const parts = [
    ...setsToSvg(gen.path(bodyD, { ...o, fill: YELLOW, fillStyle: "solid", seed: SEED }), o),
    ...setsToSvg(gen.ellipse(cx, top + eh / 2, w, eh, { ...o, seed: SEED + 3 }), o)
  ];
  parts.push(text(cx, cy, label));
  return parts.join("\n");
}

function arrow(x1, y1, x2, y2, { label, labelAt, dash = false, size = 15 } = {}) {
  const o = {
    stroke: INK,
    strokeWidth: 1.5,
    seed: SEED,
    ...(dash ? { strokeLineDash: [7, 6] } : {})
  };
  const line = gen.line(x1, y1, x2, y2, o);
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headLen = 11;
  const headAngle = 0.42;
  const p1 = [x2 - headLen * Math.cos(angle - headAngle), y2 - headLen * Math.sin(angle - headAngle)];
  const p2 = [x2 - headLen * Math.cos(angle + headAngle), y2 - headLen * Math.sin(angle + headAngle)];
  const head = gen.linearPath([[p1[0], p1[1]], [x2, y2], [p2[0], p2[1]]], o);
  const parts = [...setsToSvg(line, o), ...setsToSvg(head, o)];
  let svgText = "";
  if (label) {
    const t = labelAt ?? [(x1 + x2) / 2, (y1 + y2) / 2 - 9];
    svgText = text(t[0], t[1], label, { size, fill: "#444444" });
  }
  return `${parts.join("\n")}\n${svgText}`;
}

const scenes = {
  "system-design-01": () => {
    const parts = [];

    // clients and edge
    parts.push(box(100, 310, 150, 70, "Client"));
    parts.push(ellipseNode(265, 100, 180, 85, "CDN"));

    // traffic path
    parts.push(arrow(175, 310, 255, 310, {}));
    parts.push(arrow(118, 272, 220, 138, { label: "static assets", labelAt: [128, 200], dash: true }));
    parts.push(box(350, 310, 175, 70, "Load balancer"));
    parts.push(arrow(438, 310, 558, 302, {}));

    // app tier
    parts.push(stack(645, 295, 150, 55, "API servers", 3, 7));

    // storage tier
    parts.push(cylinder(965, 310, 155, 95, "Primary DB"));
    parts.push(cylinder(855, 505, 145, 85, "Read replica"));
    parts.push(cylinder(1065, 505, 145, 85, "Read replica"));
    parts.push(stack(625, 495, 140, 50, "Cache (Redis)", 3, 7));

    // async stats path
    parts.push(cylinder(880, 105, 155, 80, "Events queue"));
    parts.push(stack(1080, 105, 125, 55, "Stats workers", 3, 7));

    // arrows: reads and writes
    parts.push(arrow(722, 300, 887, 298, { label: "writes: ~12/s", labelAt: [800, 279] }));
    parts.push(arrow(712, 320, 830, 458, { label: "reads: ~1.2k/s", labelAt: [755, 395] }));
    parts.push(arrow(645, 325, 630, 458, { label: "cache-aside", labelAt: [568, 393] }));

    // replication
    parts.push(arrow(935, 360, 878, 458, { label: "replication", labelAt: [868, 415], dash: true }));
    parts.push(arrow(990, 360, 1048, 455, { dash: true }));

    // async click stats
    parts.push(arrow(700, 268, 805, 128, { label: "click events (async)", labelAt: [742, 190], dash: true }));
    parts.push(arrow(958, 105, 1025, 105, {}));
    parts.push(arrow(1075, 140, 1000, 262, { label: "write stats", labelAt: [1082, 205], dash: true }));

    return parts.join("\n");
  }
};

function generate(name) {
  const build = scenes[name];
  if (!build) {
    throw new Error(`unknown scene: ${name} (known: ${Object.keys(scenes).join(", ")})`);
  }
  const W = 1180;
  const H = 640;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs>
<style>
@font-face { font-family: "Virgil"; src: url("data:font/woff2;base64,${fontB64}") format("woff2"); }
text { font-family: "Virgil", "Comic Sans MS", "Segoe Print", cursive; }
</style>
</defs>
<rect width="${W}" height="${H}" fill="${PAPER}"/>
${build()}
</svg>
`;
  mkdirSync(outDir, { recursive: true });
  const out = join(outDir, `${name}.svg`);
  writeFileSync(out, svg);
  console.log(`wrote ${out} (${(svg.length / 1024).toFixed(1)} KB)`);
}

const names = process.argv.slice(2).length > 0 ? process.argv.slice(2) : Object.keys(scenes);
for (const name of names) {
  generate(name);
}
