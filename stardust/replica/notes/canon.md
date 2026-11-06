- 21:44 step0 started; read brief/contract/requests
- 21:46 step1 (b) chrome.css .site-header bg #fff @max-width:480px (live main.css @189787 .header; request said <992, source rule is <=480); (c) a:hover rgba(12,18,28,.8) in tokens.css after a{} (cascade order of main.css @60470). backups /tmp/canon-*.bak
- 21:46 step1 done: (a) chrome.js resync setVars+setShrinkOffset on fonts.ready/load/ResizeObserver(.js-nav-height); (d) onScroll un-shrinks on y<=150 OR y<lastY (scrollTop read first). canon-requests.md 4 lines marked [applied]
- 21:46 step2 done: removed resync from js/image-packs.js, js/namib-orange.js; js/directors.js + js/person-chris-thorp.js reduced to comment stubs (resync + sticky un-shrink); removed .people-listing-holder > a:hover from css/directors.css. backups /tmp/*.bak
- 21:47 step3 launched 14 pixel-only canon1 rounds (run-bg slots 3, hook, --main .view-main; image-packs+news GATE_STITCH_TIMEOUT=600 timeout 1500)
- 21:5x canon1 defender-en-gb 1440 1.48% Δh1 (gated 1.48/1) | 360 11.58% Δh21 (gated 11.58/21) — unchanged
- 21:5x canon1 vehicle-defender-110 1440 9.67% Δh-44 (gated 9.67/44) | 360 2.77% Δh0 (gated 2.77/0) — unchanged
- 21:5x canon1 image-packs 360 1.86% Δh0 (gated 1.86/0) — unchanged
- 21:5x canon1 namib-orange 1440 0.86% Δh1 (gated 2.02/-1) better | 360 3.20% Δh0 (gated 1.86/0) +1.34pp CHECK
- 21:5x canon1 directors 1440 1.07% Δh1 (gated 1.07/1) | 360 2.22% Δh0 (gated 2.22/0) — unchanged
- 21:5x canon1 news 360 20.24% Δh550 (gated 20.24/550) — unchanged
- 21:52 canon1 image-packs 1440 0.92% Δh1 (gated 0.92/-1) — unchanged
- 21:52 canon1 news 1440 8.39% Δh-31 (gated 8.39/-31) — unchanged
- 21:52 canon1 chris-thorp 1440 1.35% Δh1 (gated 1.35/1) | 360 2.65% Δh0 (gated 2.65/0) — unchanged
- 21:52 namib-orange 360 regression diag: chunk 2 (y734) whole viewport incl. fixed header +15px down in build vs live; footer band 1500+ 0→7.8%. sticky-probe (stardust/.work/canon/sticky-probe.mjs) shows live+build identical un-shrunk at 734 — suspect run-to-run (shrink/clamp race), re-running namib 360 as canon1b
STATUS: step3 — only namib-orange-360 open (canon1b rerun); then step4 progress.json
- 21:53 bisect namib 360: RO removed -> 3.02% (not it); up-unshrink removed -> 1.86% (= gated). REVERTED request (d) in canon/chrome.js; restored js/defender-en-gb-person-chris-thorp.js from backup (page-level un-shrink + resync). Re-running namib-360, chris-thorp 1440/360 as canon1c
- 21:59 canon1c namib-orange 360 1.86% Δh0 (= gated) | 1440 2.02% Δh1 (= gated; with (d) it was 0.86) ; chris-thorp 1440 1.35% Δh1 | 360 2.65% Δh0 (= gated)
- 21:59 step4 progress.json canon {appliedRequests:3, requestsQueued:4, revertedRequests:[chris-thorp sticky], regression{…}} merged; canon-requests.md (d) marked REVERTED
STATUS: done — all 14 rounds at gated values; (a)(b)(c) applied, (d) reverted
