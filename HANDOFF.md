# Handoff

## Current task
Series navigation for the blog ("Inside Termii" deep dive, parts 1 to 4) plus blog header reframe.

## Status
- [x] Termii series posts (lessons 3 to 6) published and cross-linked
- [x] Blog header reframed as "software systems, taken apart." (deep-dive voice)
- [x] DeployDock retrospective section removed per owner decision
- [x] Series support: frontmatter fields, index ordering, card chips, on-post navigator

## Changes
- `src/lib/posts.ts` — new `series` (string) and `seriesOrder` (positive integer) frontmatter fields with validation; the two must be set together. `getAllPosts` now tie-breaks equal dates by series order, then slug. New `getSeries(name)` returns `{ name, parts }` sorted by part.
- `src/components/blog/PostCard.tsx` — cards show `{series} · part {N}` in the meta row when the post belongs to a series.
- `src/components/blog/PostLayout.tsx` — new optional `series` prop renders a series navigator (all parts, current one highlighted, others linked) between the header and the article.
- `src/app/blog/[slug]/page.tsx` — resolves the post's series via `getSeries` and passes it to the layout.
- `content/posts/termii-*.mdx` — the four series posts declare `series: Inside Termii` and `seriesOrder: 1..4`.
- `src/lib/posts.test.ts` — two new tests: same-date series ordering plus `getSeries`, and validation errors (missing pair, non-positive order).
- `src/app/blog/page.tsx` — header/meta now "software systems, taken apart." with a deep-dive description.
- `content/posts/deploydock-release-pipeline.mdx` — removed the "What I would do differently" section (owner decision).

## Decisions
- Numbering lives in frontmatter (`series`/`seriesOrder`), not in titles, so titles stay clean and the UI owns presentation.
- Series navigation is additive: the chronological prev/older links remain, and the navigator covers series order.
- Part ordering uses the existing date sort with a series-order tie-break, so no separate index structure was needed.

## Test results
- `npm test`: 17/17 passed (15 prior + 2 series tests).
- `npx tsc --noEmit`: clean.
- `npm run lint`: clean.
- `npm run build`: succeeds, 28/28 pages static.
- Rendered output verified: index cards show "Inside Termii · part 1..4"; each series post renders the four-part navigator with the current part highlighted.

## Next action
Commit and push the series navigation work when the owner confirms.
