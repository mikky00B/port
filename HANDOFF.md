# Handoff

## Current task
Replace the portfolio homepage with the "living git tree" design from `newplan/workspace-742c3d36-9036-4036-9da1-de05db3d359b.tar`. The site becomes a single-page experience; only the blog keeps its own full pages.

## Status
- [x] Tree design ported from the tar prototype and adapted to this repo (Next 15 + Tailwind v3, the prototype used Tailwind v4)
- [x] Panels wired to the site's real data (`src/data/projects.ts`, MDX posts via `src/lib/posts.ts`, `src/data/socials.ts`, `src/data/now.ts`) instead of the prototype's hardcoded copy
- [x] Blog (`/blog`, `/blog/[slug]`) and case studies (`/projects/[slug]`) keep their full-page views; panel links point into them
- [x] Old routes (`/about`, `/contact`, `/projects`, `/resume`, `/lab`) still resolve for direct hits but are no longer linked from the homepage
- [x] Prototype tar extracted to temp; only the needed design files were ported (no Prisma/db/shadcn scaffolding carried over)

## Changes
- `src/lib/tree.ts` — procedural git-tree generator (copied verbatim from the prototype)
- `src/hooks/useHashRoute.ts` — hash-based SPA routing for `#/work`, `#/writing`, `#/me`, `#/contact`
- `src/components/tree/TreeCanvas.tsx` — animated canvas scene (copied; fixed TS strictness: `pulseNow` narrowing, `base` → `home` navigation mapping, removed two unused vars that tripped eslint)
- `src/components/tree/TreeHome.tsx` — homepage scene: tree, vignette, grain, hand notes, intro, mobile nav pill
- `src/components/tree/Panels.tsx` — work/writing/me/contact panels; internal links use `next/link`, external links open in new tabs, resume link carries `download`
- `src/lib/tree-content.ts` — server-side adapter mapping real data to panel view models; decorative per-slug commit hash (FNV-1a), `feat/` vs `archive/` branch names, live/archived partition, 5 newest posts
- `src/lib/tree-content.test.ts` — vitest coverage for the adapter
- `src/app/page.tsx` — server component that builds `TreeContent` and renders `TreeHome`
- `src/app/layout.tsx` — self-hosted variable fonts via `next/font/local` (`--font-app-sans` Libre Franklin, `--font-app-hand` Caveat, `--font-app-mono` JetBrains Mono); Footer wrapped in `HiddenOnHome`
- `src/app/fonts/*.woff2` — latin variable font subsets downloaded from Google Fonts
- `src/app/globals.css` — appended tree-scene styles (sheet frame, grain jitter, panel entrance, nice-scroll, scoped gold selection); blog styles untouched
- `tailwind.config.ts` — added tree palette (`bark`, `sheet`, `soot`, `bone`, `glint`, `note`, `ash`, `fog`, `moss`, `gilt`), `hand` font family, font CSS vars in `sans`/`mono` stacks
- `src/components/layout/Navbar.tsx` — returns `null` on `/` (tree carries its own nav)
- `src/components/layout/HiddenOnHome.tsx` — client gate that hides the Footer on `/`
- Legibility fix: soft radial "clearings" (bark-colored gradients matching the scene background) sit behind the bottom-left intro block and the bottom-right "currently building" note. On large screens the grass band (drawn at ~82% of viewport height) crossed both text blocks; the clearings mute the grass under the text while leaving it bright around the trunk base.
- New intro copy (owner-written): "focused on backend systems, infrastructure and developer tools. i build reliable software that solves practical engineering problems." — also applied to the me-panel opening sentence and the root layout meta description; the old "scalable APIs, monitoring tools..." phrasing is gone everywhere.
- Nav-label spread: `generateTree` now computes crown extents before the nav assignment and picks anchors by quadrant-corner score — topmost corner per side (outness-weighted) for work/me, bottom-corner per side (height-weighted) for writing/contact, with a `treeH * 0.15` minimum same-side gap. Candidate pool widened from depth 2–4 to depth ≥ 2 with `len >= 30`. The hand annotation moved from 46% to 38% viewport height so the relocated lower-left label stays clear, and `TreeCanvas` skips nav branches in the terminal-ring pass (nav anchors are now terminals and already draw their own ring).
- "Me" panel bio rewritten from the owner's answers (self-taught, freelancing, chess every day, tennis, technical papers) — replaces the generic "systems that observe themselves" copy. The hand note "the short version: i make servers behave." stays.
- Bio paragraphs then finalized with the owner's verbatim text ("i learned by shipping things…", "day to day i freelance…", "away from software, i play chess every day, some tennis, read technical papers for fun. i also write about how the pieces fit: system designs and other technical concepts") in `Panels.tsx`.
- Top-left site title changed from "clevermike.studio" to "Clevermike's studio" in `TreeHome.tsx`.
- Blog restyled to match the tree design: shared palette tokens (`background`, `panel`, `panel2`, `line`, `text`, `muted`, `dim`, `accent`, `success/warning/error`) retargeted to the warm bark/sheet/soot/bone/moss/ash/gilt family in `tailwind.config.ts`, and `font-heading` now resolves to the tree's self-hosted Libre Franklin. `globals.css` body/selection updated and `prose-dev` rewritten with tree tokens (soot code blocks, gilt inline code, gilt-tinted blockquote rules, bone links with gilt underline). Blog chrome got the tree's voice: `$ git log --oneline writing` / `$ git log --tag #x` headers, lowercase copy, `cd /blog` back links, `PostCard` restyled as a sheet card with a stable `commitHash(slug)` decoration, warm series nav, related-project block, prev/next cards and TOC. `SectionHeader` is no longer used by blog pages (still used by legacy pages, which warmed via the token remap).

## Decisions
- `next/font/google` broke the build ("Cannot read properties of null" in Next 15.5.18's vendored font loader against the current Google css2 API), so fonts are self-hosted woff2 via `next/font/local`. This also keeps builds offline-safe.
- Tailwind v3's opacity scale does not include values like `/12` or `/92`, so the ported components use theme colors with bracket alpha (e.g. `bg-sheet/[0.92]`, `border-bone/[0.12]`).
- The prototype's hardcoded `content.ts` was not ported; `tree-content.ts` derives everything from the existing data modules so content stays in sync site-wide.
- `document.title` effect from the prototype kept ("clevermike (⌐■_■)" on home, "<route> — clevermike" per panel).
- Reduced-motion handling: canvas animation stops via `prefers-reduced-motion` in `TreeCanvas`; CSS animations disabled in globals. The prototype's global `transition-duration: 0.01ms` nuke was intentionally not ported (it would affect blog pages).
- Non-blog routes were left in place rather than deleted to avoid breaking sitemap/RSS/palette links; deleting them is a follow-up decision for the owner.

## Test results
- `npm test` — 26 passed (3 files), including the new `tree-content.test.ts` (re-run after the blog restyle)
- `npm run lint` — clean (re-run after the blog restyle)
- `npm run build` — passes; 40 routes prerendered, `/` static at 115 kB first load (re-run after the blog restyle)
- Verified in the browser against `next start`: tree renders with no console errors; `#/work` panel shows DeployDock/WATCHDOG from real data; `#/me` panel shows the owner's final verbatim bio; title link renders "Clevermike's studio (⌐■_■)"; `/blog` and `/blog/system-design-01` verified with the warm palette (bark body, soot code blocks, gilt inline code) and zero console errors; `/projects/deploydock` renders with the standard navbar/footer

## Next action
Review the homepage in the browser and confirm you like the tree as the front door. Optional follow-ups: delete the now-unlinked legacy routes (`/about`, `/contact`, `/projects`, `/lab`) if you want them gone, and consider refreshing `browserslist` data (build warning only).
