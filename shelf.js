/**
 * Shelf: a rack of four trays, one per live portfolio project, newest on top.
 * The tray under the pointer slides out and the read-out names its project;
 * the trays near it follow partway, staggered outwards from it. At rest the
 * newest tray (DeployDock) sits half-out with its LED lit. The slider is how
 * far the pull goes. The plate around the figure maps the read-out's slug to
 * the project it names and opens it on click; the figure itself stays a
 * standalone drawing.
 *
 * The pattern: discrete items. Tweens, a stagger by distance, identity
 * carried by geometry (handle, punch code, LED), and a hit test on each
 * tray's resting top plane, so a tray moving out from under the pointer
 * cannot flip the choice.
 */
const {
  Cam, facing, fit, open, proj, prism, rrect, rings, solid, put, unproj,
  tdone, tset, tval, tween, disposer, mk, place, pointer, reflect, register,
} = HL;

const N = 4, T = 14, G = 6, PIT = T + G;
const BX0 = 6, BX1 = 70, BY0 = 0, BY1 = 40, BR = 3;
const RL = 6, ZT = N * PIT - G;
const REST_OUT = { 0: 14, 2: 5 }, REST_ACT = 0;
const XCM = (BX0 + BX1) / 2, YCM = (BY0 + BY1) / 2;

const SLUGS = ["deploydock", "watchdog", "swindle", "gatekeeper"];
// every tray on the shelf is a live project; the one bright LED means the tray under the pointer
const LIVE = new Set([0, 1, 2, 3]);

/** Terrain's falloff: 1 at the chosen tray, .31 at 42% of the reach, .09 beyond it. */
function fall(d, R) {
  if (d >= R) return 0.09;
  const t = d / R;
  return t < 0.42 ? 1 - (0.69 * t) / 0.42 : 0.31 - (0.22 * (t - 0.42)) / 0.58;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let PULL = value;

  const C = Cam(45, 0.5, 1.9);
  fit(
    C,
    [
      [-3, -3, -10], [79, 47, -10],
      [BX0, BY1 + 30, 0], [BX1, BY1 + 30, ZT],
      [-2, -3, ZT + 6], [78, 47, ZT + 6],
    ],
    200, 166,
  );
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const framePiece = (x0, y0, x1, y1, r, z0, z1) => {
    const [ring, inner] = rings(x0, y0, x1, y1, r, 1.2);
    put(solid(g), prism(P, front, ring, inner, z0, z1));
  };
  reflect(svg, g, P, front, rrect(-3, -3, 79, 47, 4, 6), -10, 12);
  framePiece(-3, -3, 79, 47, 4, -10, 0);
  framePiece(0, 0, RL, 44, 2, 0, ZT);
  framePiece(BX1, 0, BX1 + RL, 44, 2, 0, ZT);

  /** Tray i (0 is the top one): its solid, handle, vents and LED. */
  const trays = [];
  for (let i = 0; i < N; i++) {
    const grp = mk("g", {}, g);
    const sl = solid(grp);
    const handle = mk("path", { class: "nf" }, grp);
    const vents = mk("path", { class: "nf lo" }, grp);
    const led = mk("circle", { r: 1.7, class: LIVE.has(i) ? "dot m" : "dot off" }, grp);
    trays.push({ sl, handle, vents, led, out: tween(REST_OUT[i] ?? 0), drawn: NaN });
  }
  framePiece(-2, -3, 78, 47, 3, ZT, ZT + 6);

  /** Tray i slid out by o: its paths, and where its LED sits. */
  function pose(i, o) {
    const zb = (N - 1 - i) * PIT, yF = BY1 + o;
    const [ring, inner] = rings(BX0, BY0 + o, BX1, yF, BR, 1.2);
    return {
      body: prism(P, front, ring, inner, zb, zb + T),
      handle: open([P(BX0 + 12, yF, zb + T - 3.5), P(BX1 - 12, yF, zb + T - 3.5)]),
      vents: open([P(BX0 + 12, yF, zb + 4), P(BX1 - 26, yF, zb + 4)]) +
        open([P(BX0 + 12, yF, zb + 7.5), P(BX1 - 26, yF, zb + 7.5)]),
      led: P(BX1 - 8, yF, zb + T - 3.5),
    };
  }

  function draw(i, o) {
    if (o === trays[i].drawn) return;
    trays[i].drawn = o;
    const q = pose(i, o), tr = trays[i];
    put(tr.sl, q.body);
    tr.handle.setAttribute("d", q.handle);
    tr.vents.setAttribute("d", q.vents);
    place(tr.led, q.led);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    trays.forEach((tr, i) => {
      const o = tval(tr.out, now);
      draw(i, o);
      if (!tdone(tr.out, now)) moving = true;
    });
    return moving;
  });
  bag.add(B.unregister);

  /** The tray whose resting top plane puts the pointer nearest its middle; -1 outside. */
  function hit([sx, sy]) {
    let best = -1, bestD = Infinity;
    for (let i = 0; i < N; i++) {
      const [wx, wy] = unproj(C, sx, sy, (N - 1 - i) * PIT + T);
      if (wx < BX0 - 4 || wx > BX1 + 4 || wy < BY0 - 6 || wy > BY1 + 10) continue;
      const d = (wx - XCM) ** 2 + 2 * (wy - YCM) ** 2;
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  let act = -1;
  /** Pulls tray a out (-1 puts them all back); the stagger spreads from it. */
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    trays.forEach((tr, i) => {
      const target = a < 0 ? (REST_OUT[i] ?? 0) : a === i ? PULL : PULL * fall(Math.abs(i - a), 1.8);
      tset(tr.out, target, now, Math.abs(i - from) * 40);
      const hot = i === a || (a < 0 && i === REST_ACT);
      tr.sl.sil.classList.toggle("hi", hot);
      tr.handle.classList.toggle("hi", hot);
      tr.led.setAttribute("class", hot ? "dot" : LIVE.has(i) ? "dot m" : "dot off");
    });
    read.textContent = a < 0 ? "rest" : SLUGS[a];
    B.wake();
  }

  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => {
      PULL = v;
      if (act >= 0) { const a = act; act = -1; setActive(a); }
    },
    destroy: bag.dispose,
  };
}

hairline({
  name: "shelf",
  means: "Four projects on the shelf: the tray under the pointer slides out; click it to open the project.",
  rules: [1, 2, 4, 5],
  range: [12, 22, 30],
  mount,
});
