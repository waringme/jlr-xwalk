# defender-en-gb-image-packs — replica gate notes (media-listing)

## author (2026-11-05)
- 18:23 author unit start
- 18:27 live measure 1440+360 of listing boxes → /tmp/ip-scripts/live-measure.{txt,json}
- 18:29 live 360 DOM differs: Vue mobile card .gallery-item.hidden-md.hidden-lg (image-top + .tw-p-4 body date/title/actions, h394) vs 1440 overlay card (.gallery-contents 350x197, overlay opacity 0); author both variants (probe: .work/defender-en-gb-image-packs/dom360.mjs)
- 18:32 content transcribed: .work/defender-en-gb-image-packs/extract-content.py -> content.json (filters 6 groups/46 options, 18 cards, pager 1 of 11)
- 18:35 generator .work/defender-en-gb-image-packs/build-page.mjs (canon page-template.html read-only, main replaced) + css/defender-en-gb-image-packs.css + js/defender-en-gb-image-packs.js (desktop/mobile card swap at 991px, as live Vue) -> proposed.html written
- 18:37 measure --against #1: 360 all boxes Δ0 (Δw font forks <=4); 1440 everything from .image-listing Δy -12 (chrome above main shorter on this page) + bottom-pager extra -10
- 18:43 1440 .page-view margin-top live 216 vs build 204/209 (canon chrome.js --nav-height timing, header itself 222=222): pinned 216 @>=992 in page CSS + canon request appended
- 18:46 measure --against #2 (after pin): 1440 page-view/h1/card-grid/bottom-pager/newsletter/footer Δy -1 (live jitters 216/217), scrollHeight Δ-2; 360 all Δ0, scrollHeight Δ0, overflow 0 both
- 18:46 bookkeeping: units.json += listing-pack-card, listing-image-count-badge (n 6); progress.json types.media-listing entry; state advanced -> prototyped. Open for iter1: hidden overlay date/title Δy -12/-22 (opacity 0, not painted); hover/expander/refine behaviours deferred to motion. --main for gate: .view-main. author unit DONE
STATUS: iter1
- 18:47 iter1 launched --full --main .view-main 1440+360 (run-bg slots 2, hook)
- 18:53 coordinator: iter1 jobs lost to the 18:50 restart; relaunched as iter1b (1440+360, --full --main .view-main)
STATUS: iter1 (iter1b launched — check run-bg status)
- 19:12 coordinator: iter1 RESULT — 360 iter1c 1.86 % PASS, Δh 0; content-diff iter1c: 1440 18 structural 🔴 (all MISSING ICON — see gates/defender-en-gb-image-packs-1440/content-diff-iter1c.txt), 360 0 🔴. 1440 pixel round: live capture hit the 300 s deadline (exit 124) → re-run as iter1d (launched 19:12).
STATUS: iter2 (fix 18 MISSING ICON at 1440; read iter1d pixel verdict via run-bg log defender-en-gb-image-packs-1440-iter1d; pixel-only rounds + direct probes)
- 19:15 iter2 start: 18 MISSING ICON @1440 = hidden .image-pack-slide__close (live: arrow_left glyph U+E905 + 'Back' text; build had icon-close, no text) -> build-page.mjs fixed (+ .slider-image-pack wrapper as live)
- 19:24 iter1d 1440 = exit 124 again (2nd capture deadline). Diagnosed: live-session dismissOverlays hangs >30 s per call at 1440 — MODAL_ROOTS '[role=dialog]' matches the 18 .gallery-expander dialogs; their close controls are click-attempted (3 s timeouts) each sweep, lateWindow loop repeats; stitch-shot calls it twice (probe /tmp/ip-scripts/ast2.mjs). Not a page defect; 360 unaffected (expanders hidden-xs). Workaround: GATE_STITCH_TIMEOUT=600 + run-bg --timeout 1500
- 19:24 prototype regenerated (slide Back fix, 18 buttons)
- 19:24 iter2 1440 pixel-only launched (run-bg defender-en-gb-image-packs-1440-iter2, GATE_STITCH_TIMEOUT=600)
- 19:25 content-diff iter2 1440: 0 structural 🔴 (was 18), 2 findings total; text nodes 244/244
- 19:32 iter2 1440 RESULT: pixel 12.16 % FAIL, Δh -7 (live 2283 / build 2276), bands 0-500 7.5 / 500-1000 14.8 / 1000-1500 20.8 ◄◄ / 1500-2000 9.4 / 2000-2276 5.3; overflow ok; live top-band crop: no market dialog. live.png now cached (422 s round)
- 19:32 removed build-only aria-label 'Listing tools' on nav.new-grid__tools (content-diff 🟡 EXTRA ARIA-LABEL); prototype regenerated (pixel-neutral). progress.json media-listing gates.1440 updated
STATUS: iter3 (1440 only: fix hot band y 1000-1500 (card grid row 2-3?) off anchor/measure/one crop-compare, Δh -7 → ≤8 ok; then pixel-only round iter3 at 1440 with GATE_STITCH_TIMEOUT=600 + run-bg --timeout 1500, then visual-diff/chrome-parity/clip-probe/cap-probe at 1440. 360 PASSED iter1c 1.86 %)
- 19:32 coordinator decision: use GATE_STITCH_TIMEOUT=600 + run-bg --timeout 1500 for 1440 rounds (dismissOverlays stall on hidden expander dialogs); shared instrument left unedited.
- 19:33 iter3 start (1440)
- 19:39 iter3 diagnosis: hot band 300-1700 = stitched-chunk offset, not cards. Scroll probe (/tmp/ip-scripts/scrollstate.mjs): live .page-view margin-top = --nav-height, 222 at rest -> 206 after shrink re-sample (doc 2283->2267); build page-CSS pin 216 froze it (chunk1 -6, chunk2 +10). Fix: removed pin, js/<slug>.js re-dispatches scroll after fonts.ready/load so canon setVars re-samples; build now 222/222/206, doc 2282/2266 (live 2283/2267)
- 19:39 iter3 pixel-only launched 1440 + 360 (360 = regression check for the JS resync; run-bg defender-en-gb-image-packs-{1440,360}-iter3, GATE_STITCH_TIMEOUT=600, --timeout 1500)
- 19:43 iter3 RESULT: 1440 pixel 0.92 % PASS (was 12.16), Δh -1 (live 2283 / build 2282), overflow ok; 360 regression round 1.86 % PASS Δh 0 (unchanged). clip-probe 1440 first try exit 124 (browser closed) -> re-run
- 19:46 cap-probe iter3: PASS (0 of 4 rows failed). clip-probe 1440 re-run exit 124 again ('Target page closed' at 200 s, build-only) -> instrument stall, not counted; unresolved
- 19:50 visual-diff iter3 1440: build red flags none. chrome-parity 1440 (--region header=#main-nav|#main-nav) exit 124 ('Target page closed' — live dialog stall class) -> not counted. progress.json media-listing gates.1440 updated (iterations 1440:3). canon request (page-view nav-height sample timing) still stands; page now compensates via JS resync instead of a pin
STATUS: motion (1440 + 360 pixel PASS; open: clip-probe 1440 + chrome-parity 1440 both stall at 200 s — retry with longer timeout (e.g. timeout 500) at start of motion unit; residuals: substitute-font forks only)
- 19:51 motion unit start; retry clip-probe 1440 + chrome-parity 1440 under timeout 500 (bg, -> clip-probe-motion.txt / chrome-parity-motion.txt)
- 19:55 motion resume: 19:51 clip-probe/chrome-parity retries lost to restart (clip-probe-motion.txt = launch warning only, chrome-parity-motion.txt empty); proto server was down -> restarted one on 8791
- 19:55 (correction: server was answering again by start — another agent's; my nohup exited 1 port-in-use, none started by me)
- 19:56 ONE retry (final): clip-probe 1440 (--plain, build) + chrome-parity 1440 (--region header) launched via run-bg (-clipb/-parityb, timeout 330) -> clip-probe-motionb.txt / chrome-parity-motionb.txt
- 20:00 retry RESULT (completed, not stalled): clip-probe 1440 Clipped: 0 (docH 2266, 80 text/167 controls; clip-probe-motionb.txt). chrome-parity 1440 32 deltas (chrome-parity-motionb.txt): footer 10/10 paired, uniform Δy -6 only (page offset above footer, = nav-height shrink re-sample timing; no internal footer delta); header 23/23 texts 3/3 icons paired, deltas = font-sub Δx/Δw forks (nav items, Defender, Search Defender) + hidden market-list items Δx +12 (same class as canon defender-en-gb iter3c header deltas) -> canon-chrome residual, no page-level fix
- 20:00 next: motion-observe live 1440 (pokes: card hover .gallery-contents, card click .gallery-trigger, filter heading .refine-item, share .new-share__btn) + 360 (filter heading, mobile share)
- 20:00 motion-observe live launched (run-bg defender-en-gb-image-packs-motion-live-{1440,360}); 1440 clicks refine-btn/refine-item/gallery-trigger/share, hovers gallery-contents/pager-btn; 360 clicks refine-btn/refine-item/share
- 20:03 live 360 observed: refine-btn -> .new-grid__sidebar-panel--open (+content--with-sidebar) w/ .5s left/height/bg/box-shadow transitions; refine-item -> a.active-facet + ul.collapse-me--trans(height .6s)->--open, fa-angle-right transform .2s; share click = no mutation
- 20:04 live 1440 observed: refine-btn -> panel--open + content--with-sidebar (opacity/width .5s); refine-item -> active-facet + collapse-me--trans(.6s)->--open, icon rotate .2s; gallery-trigger click -> .gallery-item.active (expander open; anims load8 loader, hvr-icon-push); share click -> cart-btn--active; lazy-loaded on card bgs; hover .gallery-contents changed [] (observer samples only children, overlay opacity not sampled), pager hover changed []
- 20:05 implemented (js/defender-en-gb-image-packs.js + css): refine panel --closed<->--open + content--with-sidebar (lifted @350002/@350142/@349616/@349659), facet active-facet + collapse-me --trans(.6s)->--open + icon rotate .2s (@353033-@353246), card trigger -> .gallery-item.active expander open (@354932, fixed 80vh), cart-btn--active toggle. NOT implemented: load8 loader + hvr-icon-push (AJAX pack load / close-icon hover — data-dependent), lazy-loaded (no visual rule on .image-back), gallery-contents hover overlay (observer changed [] -> not 'fired'; source @126157 has it — coordinator decision)
- 20:05 build motion-observe launched 1440+360 same pokes (run-bg defender-en-gb-image-packs-motion-build-{1440,360})
- 20:07 compare 360 #1: 15 parity / 0 missing / 0 extra / 1 advisory (cart-btn--active extra on build) -> cart toggle scoped to >=992 (live 360 share click: no mutation); re-observe build 360
- 20:07 compare 1440 (motion/defender-en-gb-image-packs-compare.json): 16 parity / 3 MISSING / 0 extra / 0 advisory. MISSING justified: load8 loader + hvr-icon-push = AJAX pack-content load inside the opened expander (dynamic feature, not replicated statically); lazy-loaded = lazysizes marker, no visual rule on .image-back (only .lazy-blur), build images load eagerly
- 20:08 compare 360 #2 (motion/defender-en-gb-image-packs-360-compare.json): 15 parity / 0 missing / 0 extra / 0 advisory
- 20:08 motion1 pixel-only rounds launched 1440+360 (run-bg defender-en-gb-image-packs-{1440,360}-motion1, GATE_STITCH_TIMEOUT=600, --timeout 1500)
- 20:09 motion1 360: 1.86 % PASS Δh 0 overflow ok (= gated iter3)
- 20:10 motion1 1440: 0.92 % PASS Δh -1 overflow ok (= gated iter3) -> motion code inert at rest
- 20:10 progress.json media-listing motion/residuals/clipped merged; journal section appended. MOTION UNIT DONE
STATUS: DONE
- 20:10 coordinator: approved (hands-off). FOLLOW-UP approved for the finishing pass: add the live card hover overlay (source CSS @126157, pseudo-element mechanics the sampler misses) as plain CSS, then one pixel round.
