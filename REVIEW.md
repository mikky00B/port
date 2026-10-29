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
