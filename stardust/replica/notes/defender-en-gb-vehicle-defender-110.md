# defender-en-gb-vehicle-defender-110 (vehicle-detail) — unit notes

## author
- 18:23 author unit start; canon present (tokens/chrome/modules), generator idea from .work/defender/build-page.mjs
- 18:30 authored: .work/defender-en-gb-vehicle-defender-110/build-page.mjs (canon template chrome + transcribed records: hero 1 img + 2 thumbs, 7 tabs, 3 filter groups 12/0/4 opts, 15 media cards, pager 1 of 2) + lift.mjs (computed values off captured DOM with local main.css/libraries.css) -> css/defender-en-gb-vehicle-defender-110.css; generated 93 KB
- 18:33 measure.mjs live vs build: hero/caption/tabs/header/refine/card boxes Δ0 at 1440+360 after fix (360 results-h1 margin collapse: col.tw-mb-8 32 collapses h1 mb 10 below 992; ≥992 col floats → flow-root); overflow 0 both widths
- 18:33 remaining deltas = card text wrap forks (substitute font): 1440 card-grid h +45 (row2 teaser cards 4/5 wrap 2 lines vs 1, row3+ offset +16..17), 360 card-grid h −20 (card 5 title 3→... lines: build 62 vs live 83); root Δh 1440 +44, 360 −21. Chrome: earlier run showed page-view y −5 @1440 (live js-nav-height 222 run-dependent), re-run Δ0 — watch in chrome-parity
- 18:33 bookkeeping: state.mjs advance → prototyped; units.json += media-card(15), content-type-tab(7), refine-option(16); progress.json types.vehicle-detail entry created; no canon files edited; canon-requests: none

## iter1
- 18:47 iter1 launched (run-bg slots 2, hook, --full --main .view-main) jobs defender-en-gb-vehicle-defender-110-{1440,360}-iter1
STATUS: iter1 (launched — check run-bg status for the two jobs)
- 18:53 coordinator: iter1 jobs lost to the 18:50 restart; relaunched as iter1b (1440+360, --full --main .view-main)
STATUS: iter1 (iter1b launched — check run-bg status)
- 19:12 coordinator: iter1 RESULT (rounds split: pixel-only gate.sh + direct probes, because --full rounds outlive the restart window) — 1440 iter1b 9.64 % pixel PASS but Δh −44 (build taller: card teaser wraps rows 2, cards 4/5); 360 iter1c 14.19 % FAIL, Δh +21 (build shorter; hot bands 3500–6500 17–34 %, 7500+); content-diff iter1c 0 structural 🔴 both widths (gate dirs content-diff-iter1c.txt). visual-diff/chrome-parity/cap-probe not yet run.
STATUS: iter2 (fix Δh at 1440 and the 360 hot bands; run pixel-only rounds + direct probes)

## iter2
- 19:13 iter2 start; measure.mjs cards live vs build (--all-matches): only forks = 1440 teasers cards 4+5 2 lines vs live 1 (row 2 +22 → Δh +44 incl. later rows), 360 card 5 title 3 lines vs live 4 (−21 from y 2509 = all 360 hot bands 2500–6500 are this offset)
- 19:17 fix (per-archetype CSS, substitute-font compensation; wrap-sweep.mjs): <992 .new-card__title ls .1px → 360 wraps identical to live, build h 7604 = live 7604; ≥992 teaser ls −.1px → card 5 one line; card 4 teaser cannot reach 1 line without card 1 teaser collapsing to 1 (no uniform ls/ws combo fits both; grid swept) → 1440 Δh stays +44 (substitute-font wrap fork)
- 19:17 iter2 pixel-only rounds launched (run-bg slots 2, hook) jobs defender-en-gb-vehicle-defender-110-{1440,360}-iter2
- 19:18 iter2 RESULT: 1440 9.64 % PASS, Δh −44 (gate sign; build +44 taller — card 4 teaser substitute-font wrap fork, hot bands 2000–3000 = row 2/3 offset); 360 3.35 % PASS, Δh 0, no hot band; overflow ok both
- 19:20 direct probes iter2: clip-probe Clipped 0 both widths; content-diff 360 0 structural 🔴 (2 findings); visual-diff both widths: 4 STRETCHED IMAGE flags (natural 100x67) — build used the live lazy placeholder (styles/thumbnail) for cards 11,13,14,15 because the capture's settled DOM had not swapped them
- 19:21 fix: build-page.mjs card img = data-original (styles/widescreen, what the live lazy-loader swaps in) || src; regenerated (15/15 widescreen); launching iter2b pixel rounds (same iteration, image-src fix) both widths
- 19:22 iter2b RESULT: 1440 9.67 % PASS, Δh +44 (build taller; hot bands 2000–3000 = card 4 teaser wrap fork offset); 360 2.77 % PASS, Δh 0, no hot band. progress.json gates updated (iterations 2/2). Not yet run: chrome-parity (both), content-diff 1440 post-fix, visual-diff re-verify, cap-probe (once)
STATUS: iter3 (1440 only: Δh +44 = card 4 teaser substitute-font wrap fork — no uniform ls/ws compensation found; coordinator to accept as residual or allow a per-card nudge; then confirmation probes: chrome-parity 1440+360 (--region 'header=#main-nav|#main-nav' if needed), content-diff 1440, visual-diff both, cap-probe once; then log residuals → STATUS: motion)
- 19:32 coordinator decision: 1440 Δh +44 (card-4 teaser wrap fork, substitute font) ACCEPTED as logged residual — no content-specific nudge. iter3 = confirmation probes (chrome-parity, content-diff 1440, visual-diff, clip, cap-probe) + residual logging, then motion.
- 19:33 iter3 start: confirmation probes (chrome-parity both, content-diff 1440, visual-diff both, clip both, cap-probe once)
- 19:34 chrome-parity iter3 (--region header=#main-nav): 1440 footer uniform Δy +45 (= main Δh +44 card-4 wrap residual offset, no own delta), header 21 = substitute-font text Δx/Δw ≤12 px + market-list Δx +12 (same forks canon logged as justified); 360 footer ✓ parity, header 10 font-sub Δx/Δw + header bg white→transparent (canon-known, same as brand-landing iter3c)
- 19:35 visual-diff iter3: red flags none at 1440 and 360 (stretched-image flags gone after iter2b data-original fix)
- 19:37 content-diff 1440 iter3: 0 structural 🔴 (2: 🟠 font fork NeusaNeu Sub = expected substitute; 🟡 EXTRA ARIA-LABEL build <nav aria-label=Pagination> not on live) → fix: dropped aria-label in build-page.mjs, regenerated (1-line diff); clip-probe iter3 Clipped 0 both widths
- 19:38 content-diff 360 iter3 (post aria fix): 0 structural 🔴 (1: 🟠 font fork, expected); cap-probe iter3 PASS at 2560 (cap 1176 = 1176, 3/3 modules; sections 3 vs 4 advisory) — gates/<slug>-1440/cap-probe-iter3.txt
- 19:38 no extra pixel round: aria-label drop is attribute-only (pixels unchanged); gated values stay iter2b 1440 9.67 % Δh +44, 360 2.77 % Δh 0
- 19:38 residuals logged in progress.json types.vehicle-detail (iterations 3/3): 1440 Δh +44 card-4 teaser substitute-font wrap fork (flaggedFor user, permanent); justified: font fork, chrome-parity header font-sub Δx/Δw, 360 header bg white→transparent (canon-known), 1440 footer Δy +45 = main offset. canon-requests: none
STATUS: motion
- 19:51 motion unit start
- 19:52 motion-observe live 1440 launched (pokes: refine-btn, sidebar-link, hero thumb, pager next, tab Images; hovers: card panel, image-wrap, title link, tab, refine-btn, sidebar-link, pager-btn, thumb)
- 19:55 motion unit resume: 19:52 live motion-observe lost to restart → re-running
- 19:55 proto server was down (restart) → started one http.server 8791
- 19:55 motion-observe live 1440 re-run (foreground, timeout 300; same pokes/hovers as 19:52)
- 19:56 live 1440 observe DONE → motion/defender-en-gb-vehicle-defender-110.json (4 pokes, 7 hovers, 40 class mutations, 1 animation)
- 19:57 live fired: refine-btn → .new-grid__sidebar-panel--open (opacity/width .5s) + .new-grid__content--with-sidebar (width .5s); sidebar-link → a.active-facet + ul.collapse-me--trans→--open (height .6s) + chevron rotate .2s; pager next → API fetch (jlr-loader load8) = dynamic; hover refine-btn color/bg, pager-btn color .2s; img lazy-loaded blur-in (filter/transform/opacity); header shrink/bottom-shadow + nav-link margin .3s (canon). dead: hero thumb click, tab hover, thumb img hover; card hovers not sampled (selector miss)
- 19:59 implemented: js/defender-en-gb-vehicle-defender-110.js (refine sidebar toggle, facet collapse + chevron, mobile close, card img blur-in) + CSS states lifted from live main.css; build-page.mjs += pager rel prev/next (live markup), page script tag; regenerated
- 19:59 motion-observe build 1440 (same pokes/hovers)
- 19:59 motion-compare 1: 14 parity, 6 missing (pager-btn hover+color 200ms, lazy-loaded/filter blur-in, lazy-ready, load8 loader), 0 extra
- 20:00 pager-btn hover MISSING = probe hit hidden prev (live hovered prev only because pager poke had fetched page 2) — build next has same lifted :hover #c4c4c4 .2s → justified; load8/lazy-ready = page-2 fetch (dynamic) → dead; fix: card img blur-in moved to IntersectionObserver below the fold (live lazy mechanics); re-observe build
- 20:00 motion-compare 2: 15 parity (lazy-loaded/filter now parity), 0 extra, 1 advisory (card a.opacity hover — live probe selector miss); remaining missing = pager page-2 fetch (load8, lazy-ready, prev hover/color) dynamic → justified
- 20:00 motion1 pixel rounds launched (run-bg slots 2, hook) jobs defender-en-gb-vehicle-defender-110-{1440,360}-motion1
- 20:01 motion1 RESULT: 1440 9.67 % Δh −44 (= gated iter2b), 360 2.77 % Δh 0 (= gated) — pixel numbers returned exactly; overflow ok both
STATUS: DONE
- 20:10 coordinator: approved (hands-off). 360 sidebar slide-in observation deferred to the finishing pass.
