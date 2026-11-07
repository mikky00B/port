# Review — Blog feature

Date: 2026-10-29
Scope: untracked blog implementation (`content/`, `src/app/blog/`, `src/app/rss.xml/`, `src/app/sitemap.ts`, `src/components/blog/`, `src/lib/posts.ts`, `src/lib/format.ts`) plus the diffs to `layout.tsx`, `page.tsx`, `projects/[slug]/page.tsx`, `CommandPalette.tsx`, `Navbar.tsx`, `globals.css`, `package.json`.

## Outcome: PASS

No unresolved material defects found. The items below are non-blocking suggestions and process notes.

## Checks executed

- `npx tsc --noEmit` — clean.
- `npm run lint` — clean.
- `npm run build` (Next.js 15.5.18) — succeeds; 19/19 pages prerendered, all static: `/blog`, `/blog/[slug]`, `/blog/tag/[tag]` (3 tags), `/rss.xml`, `/sitemap.xml`.
- Production server smoke test:
  - `/rss.xml` — valid RSS 2.0, correct XML escaping, permaLink guids, categories, `lastBuildDate` tied to newest post date.
  - `/sitemap.xml` — contains blog index, post, and all tag routes.
  - TOC hrefs exactly match the `rehype-slug` heading ids in the rendered post HTML (verified for all 6 headings).
  - `rehype-pretty-code` highlighting active (github-dark-dimmed token colors present); copy button renders inside the code block.
  - Unknown post slug and unknown tag both return 404.
  - Home page "Recent notes" and DeployDock case study "Write-ups" sections render with the post link.
  - Desktop (1440px) and mobile (390px) visual pass on `/blog` and the post page: no layout issues, TOC correctly hidden on mobile.
- Draft filtering: built with a temporary `draft: true` post present — page count unchanged, and the draft is absent from all rendered HTML, RSC payloads, `/rss.xml`, and `/sitemap.xml`. Temp file removed afterwards.
- Dependency tree: `shiki@4.5.0` deduped into `rehype-pretty-code@0.14.5`; no duplicate copies.

## What is done well

- Frontmatter validation in `src/lib/posts.ts` (`fail()`, typed readers) gives precise author-facing errors, enforces kebab-case slugs/tags, and validates `project` against `src/data/projects.ts`.
- `buildToc` feeds every heading (including h1) to `GithubSlugger` so ids stay in sync with `rehype-slug` even with duplicate headings — subtle and correct; confirmed matching output.
- Dates handled in UTC end-to-end (`formatPostDate`, RSS `pubDate`, sitemap `lastModified`); no timezone drift or hydration risk.
- Drafts visible in dev, filtered from every production surface (verified, not just read).
- All blog routes fully static; blog pages add no meaningful first-load JS (107 kB vs 106 kB baseline).
- Canonicals, OpenGraph `article` metadata, `time` elements with `dateTime`, and `aria-hidden`/`tabIndex: -1` on heading anchors.

## Findings

### 1. RSS autodiscovery link missing — Suggestion (minor)
`src/app/layout.tsx:8` (metadata) has no `alternates.types` entry, so browsers/feed readers cannot auto-discover `/rss.xml`. Fix:
```ts
alternates: { types: { "application/rss+xml": "/rss.xml" } }
```
(Add to the root metadata or the blog index metadata.)

### 2. Stale handoff — Process
`handoff.md` still describes "Implement user authentication" with empty checklists and does not summarize this change (changed files, decisions, test results), as the working agreement requires. Update before committing.

### 3. TOC fence-toggle edge cases — Suggestion (low)
`src/lib/posts.ts:104-110` toggles `inFence` on any line starting with ``` or ~~~. A post that *displays* fenced examples containing ``` (e.g. a post about markdown), or mixes ```/~~~ fence styles, can desync the toggle and pull fake headings into the TOC. `readingTime` (`src/lib/posts.ts:138-139`) has the same class of edge. Unlikely with current content; worth remembering if you ever write meta-posts about tooling.

### 4. Command palette payload grows with post count — Suggestion (low, no action now)
`src/app/layout.tsx:27` passes all post summaries into the client `CommandPalette`, so every page's payload (including `/resume`, `/contact`) embeds every post title/tags/description. Trivial at 1 post; if the blog grows past dozens, cap it to recent N posts or move palette data to a client-side fetch.

### 5. No tests for the content pipeline — Suggestion
The repo has no test runner. `src/lib/posts.ts` is pure, deterministic logic (validation, TOC, reading time, draft filtering) and would unit-test cheaply if you ever add vitest.

### 6. PostCard tags are not links — Informational
`src/components/blog/PostCard.tsx:29` renders tags as plain text while `PostLayout` links them. This is the correct tradeoff given the stretched-link overlay (`after:absolute after:inset-0`); if clickable tags are wanted later, add `relative z-10` to the tag links.

### 7. Everything is uncommitted — Housekeeping
The entire feature and `agents.md`/`handoff.md` are untracked. Commit the feature (and the working-agreement files) once finding 2 is addressed.

## Uncertainties

- `readDate` (`src/lib/posts.ts:47`) accepts any string `new Date()` can parse; a locale-formatted date such as `Oct 25 2026` would parse but could shift on timezone. The error message documents the ISO convention — risk is author-controlled and low.

---

# Review log — 2026-11-07: identity rebrand, resume overhaul, projects split, case-study redesign

## Outcome: PASS (with process notes)

Scope: the owner's working-tree changes since `8c0069d`, excluding the previously reviewed branding files (`src/app/icon.svg`, `src/app/apple-icon.tsx`, `src/app/opengraph-image.tsx`, the Navbar cm tile, `HANDOFF.md`, `docs/`), which belong to the prior task.

## What changed (owner's diff)

- **Identity rebrand**: `socials.identity` is now "Software Engineer"; layout metadata titles/descriptions, about page, footer, and the home hero derive from it. About page gained the B.Eng. degree line.
- **Resume overhaul**: new `src/data/resume.ts` (profile, roles, skills, education); the resume page is now data-driven with a portrait (`public/clevermike.jpeg`), contact line (mailto + tel), and a real Experience section; PDF renamed to `Michael_Abulude_Backend_Developer_CV.pdf` (old file deleted); download attribute comes from the new `socials.resumeFile`.
- **Home page**: featured/earlier split via new `getFeaturedProjects` (deterministic `FEATURED_ORDER`) and `getEarlierProjects`; new "Earlier work." section for archived projects; "Selected writing." curated via new `getPostsInOrder`.
- **Case studies**: real screenshots via `next/image` (`public/projects/deploydock.png` 1440x900, `watchdog.png` 1440x700), a "The problem" card (`project.challenge`), an "Architecture" section (`project.architecture` + `ArchitectureDiagram`), and the placeholder "Screenshots / UI Mockup" card removed; meta cards now Focus/Category/Stack.
- **Gatekeeper** promoted to featured. Tests added: `src/data/projects.test.ts` (featured order, earlier list) and a `getPostsInOrder` test in `posts.test.ts`.

## Checks executed

- `npm test`: 20/20 passed (18 posts + 2 project-selection tests).
- `npx tsc --noEmit`: clean. `npm run lint`: clean.
- `npm run build` (clean cycle: dev stopped, `.next` wiped): succeeds, 31/31 routes.
- Routes verified live: `/`, `/about`, `/resume`, `/projects/deploydock`, `/projects/watchdog` all 200; new CV PDF 200; old `Resu.pdf` 404 (expected after the rename).
- Rendered content verified: new identity on home, "Earlier work" (3 archived projects), "Selected writing" (2 curated posts), case-study image element (src + srcset), descriptive alt text, "The problem"/"Architecture" sections, portrait on resume.
- No stale references: grep for `Resu.pdf` and `Backend-Focused` across `src` returns nothing.
- `architecture` is a required field on every project, so the case-study Architecture section is safe for future projects.
- Asset dims verified with file inspection: PNGs and the portrait match the dimensions declared in code exactly.

## Findings

1. **Process — `HANDOFF.md` not updated for this change set** (still documents the previous branding task). The working agreement puts this on the developer; update before committing.
2. **Commit hygiene — the old PDF deletion is unstaged** (` D` in status). A plain file-by-file `git add` would leave both PDFs in the repo; use `git add -A` or stage the deletion explicitly. The tree also mixes this change set with the uncommitted branding files from the prior task — two logical commits recommended.
3. **Observation (privacy) — phone and email are now public on `/resume`** (`tel:`/`mailto:` links). This mirrors the CV, so presumably deliberate, but `tel:` links are scraped by bots; confirm it is intended.
4. **Suggestion — case-study coverage is uneven**: 4 featured projects, only DeployDock and Watchdog have case studies (and only those two have images). Not a defect; case studies for Gatekeeper and Swindle would balance the grid.
5. **Suggestion (future polish) — `ProjectCard` on the home grid is text-only**; the new project images currently appear only on case studies. Optional thumbnails on `ProjectCard` would let the new assets do more work.

## Positive notes

- Tests accompany the data changes (working agreement followed): deterministic featured ordering is asserted, and `getPostsInOrder`'s skip-unknown behavior is covered.
- Real screenshots with specific, descriptive alt text replace the placeholder mockup card.
- The rebrand was done through a single source (`socials.identity`) rather than scattered string edits.
- Reviewer note: an early "missing image" signal during verification was caused by the reviewer's own build/dev double-run producing stale artifacts; a clean rebuild confirmed the code was correct.
