# Handoff

## Current task
Teaching post on network monitoring for backend and DevOps developers. General explainer, not a product write-up.

## Status
- [x] `content/posts/network-monitoring-for-backend-developers.mdx` published (`draft: false`, 2026-11-09)
- [x] No `project` link, so it does not appear on a case study
- [ ] Homepage selected writing is unchanged
- [x] Earlier teaching post `patch-update-hotfix-three-policies` stays as written, also without a project link

## Changes
- `content/posts/network-monitoring-for-backend-developers.mdx` — rewritten as a technical explainer. Covers the four kinds of network measurement, cumulative `curl -w` stage timings, DNS and errno classes, `tcp_syn_retries`, accept-queue `ListenOverflows` and `ss` column meanings, idle-pool resets versus TCP keepalive defaults, loss and retransmits, ephemeral ports, and conntrack. No incident narrative.

## Decisions
- Title is "Network monitoring for backend developers".
- Tags are `monitoring`, `networking`, `reliability`.
- WATCHDOG is not mentioned. The previous correction was that teaching posts stay independent of a product.
- Homepage pins were left as they are.

## Test results
- Dev server on port 3000. `/blog/network-monitoring-for-backend-developers` returns 200. The title, `curl -w` timings, and `ListenOverflows` are in the article. The 14:10 incident frame is gone.

## Next action
Read `/blog/network-monitoring-for-backend-developers`.
