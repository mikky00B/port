# Handoff

## Current task
Portfolio pass: featured work, case studies, resume from the updated CV, and pinned writing.

## Status
- [x] Homepage shows DeployDock, WATCHDOG, Gatekeeper, and Swindle, with archived work in an earlier list
- [x] DeployDock and WATCHDOG case studies use live screenshots, the written problem, and the architecture list
- [x] Resume page follows `Michael_Abulude_Backend_Developer_CV.pdf`
- [x] Writing on the homepage leads with the Termii series opener and the DeployDock post
- [x] Title line is "Software Engineer" on the hero, about page, footer, metadata, and resume

## Changes
- `public/resume/Michael_Abulude_Backend_Developer_CV.pdf` — CV moved here from the repo root. The truncated `Michael_Abulude_Backend_Developer_Resu.pdf` is removed.
- `public/projects/deploydock.png`, `public/projects/watchdog.png` — viewport captures of the live homepages. WATCHDOG is cropped to the hero.
- `src/data/socials.ts` — identity, resume path, and download filename.
- `src/data/resume.ts` (new) — roles, selected work, skills, and education taken from the CV.
- `src/data/projects.ts` — Gatekeeper is featured; case-study images; `getFeaturedProjects` and `getEarlierProjects`.
- `src/data/projects.test.ts` (new) — featured and earlier selection.
- `src/lib/posts.ts`, `src/lib/posts.test.ts` — `getPostsInOrder` for the pinned writing.
- `src/app/page.tsx` — featured grid, earlier list, selected writing, CV download.
- `src/app/resume/page.tsx` — experience, skills, and education. Selected work is omitted; those products stay on the homepage and in the PDF. Portrait sits above the PDF download. The contact line sits under the summary, so the photo column does not push it down.
- `public/clevermike.jpeg` — headshot moved from the repo root.
- `src/app/projects/[slug]/page.tsx` — real image, problem, architecture. The placeholder Overview / Metrics / Incidents block is gone.
- `src/app/layout.tsx`, `src/app/about/page.tsx`, `src/components/layout/Footer.tsx` — one title line, and the degree stated as education.

## Decisions
- The CV title is "Software Engineer", so that is the line used across the site.
- Featured order is DeployDock, WATCHDOG, Gatekeeper, Swindle. The shelf slug order is unchanged.
- Homepage writing is the Termii part 1 post, then the DeployDock release post. The blog index still lists every post.
- Resume copy stays with the CV. Venu3D is included as written, without added metrics.
- The phone number from the CV is on the resume page.

## Test results
- `npm test`: 20 passed (projects selection and posts, including `getPostsInOrder`).
- `npm run lint`: passed.
- Dev server checks: `/`, `/resume`, `/about`, `/projects/deploydock`, and `/projects/watchdog` return 200. The CV URL returns `application/pdf`.
- Headless Chrome renders: hero says Software Engineer; DeployDock case study shows the live screenshot, the problem, and the seven architecture steps; the resume page shows both roles, the three products, skills, and education.

## Next action
Commit when the owner confirms. The archived URL shortener still links to the GitHub profile, not a repository.
