# defender-en-gb-mobile-vehicle-menu — replica gate notes (mobile-vehicle-menu)

## author (2026-11-05)
- 22:10 author unit start
- 22:13 outline: .view-main / .vehicle-mobile-menu.container / .mobile-section / .scroll-mobile-menu / .mobile-menu / .tw-w-full / 2 groups (h2.bt-vehicle-group-heading Current 3, Past 1 + .tw-w-full list of a.tw-flex cards: 130px 3:2 img | h3.bt-vehicle-title px-5); 4 hidden role=dialog (chrome); live measure 1440/360 in .work/defender-en-gb-mobile-vehicle-menu/live-measure.txt (short page: 1192 @1440, 1790 @360)
- 22:13 content.json (extract-content.mjs reconciled vs slots.groups) + build-page.mjs (canon template read-only, main replaced, no description/og as live, body path-mobile-vehicle-menu) + css (lifted main.css @147418-@148104 + tw utilities @371523-@375493 + container clearfix) + js (short-page un-shrink copied from chris-thorp) = proposed.html written
- 22:14 measure --against #1: 1440 every box Δx/Δw/Δh 0, uniform Δy +10 from .view-main marginTop live 212 vs build 222 (live 218 in the first run: canon nav-height sample jitter class, existing canon request, not pinned); 360 all Δ0 except one Δh +1 (substitute font), scrollHeight 1789=1789
- 22:14 bookkeeping: state prototyped; progress.json types.mobile-vehicle-menu entry; units.json += vehicle-menu-group (n 2), vehicle-menu-entry (n 4); journal section appended. No canon changes/requests. --main for gate: .view-main. 4 hidden role=dialog (chrome) -> GATE_STITCH_TIMEOUT=600 + run-bg --timeout 1500. author unit DONE
STATUS: iter1
- 22:15 iter1 launched pixel-only (coordinator round shape) 1440+360 via run-bg (defender-en-gb-mobile-vehicle-menu-{1440,360}-iter1, slots 2, hook, GATE_STITCH_TIMEOUT=600, --timeout 1500, --main .view-main)
- 22:16 iter1 RESULT: 1440 pixel 1.03 % PASS, Δh +1 (live 1196 / build 1195), overflow ok; 360 pixel 1.57 % PASS, Δh 0 (1789/1789), overflow ok
- 22:16 live top-band crops 1440+360 (crop-compare y0+720 strip): no market dialog, no consent banner; both stitched chunks full header on live and build; progress.json gates pending probes
STATUS: probes (iter1 PASS pixel both widths; run content-diff --profile generic --main .view-main, visual-diff, chrome-parity --region 'header=#main-nav|#main-nav', clip-probe, cap-probe once on the iter1 prototype at 1440+360, timeout 200 each, files <probe>-iter1.txt; then motion)
- 22:18 content-diff iter1 1440+360: Findings none (0 red)
- 22:18 visual-diff iter1 1440+360: 4 STRETCHED IMAGE (vehicle thumbs 288x216 to 130x87) = object-fit cover crop, source side also stretched:true (live identical) -> justified; mainHeight 502/502 both widths
- 22:18 clip-probe iter1 (build) 1440+360: Clipped: 0 (advisory horizontal 2 at 360 only)
- 22:19 chrome-parity iter1: 1440 header 21 = substitute-font Δx/Δw forks (canon-chrome residual class, same as person/directors); footer uniform Δy +6 no internal delta (.view-main marginTop nav-height sample jitter, measure --against class; stitched Δh +1, mainHeight 502/502). 360 footer parity; header 10 = font-sub Δx/Δw forks
- 22:19 cap-probe iter1: PASS (0/3 rows; wrapper 1176=1176, modules full-bleed both). Confirmation probes CLEAN at 1440+360. progress.json mobile-vehicle-menu gates merged (iterations 1440:1, 360:1) + 2 residuals
STATUS: motion (gate PASS at iter1 both widths, probes clean; next: motion-observe live 1440+360 hovering '.mobile-menu a' (2px ink underline scaleX .2s) + build with same pokes, motion-compare, motion1 pixel round)
- 22:19 motion-observe live 1440+360 launched foreground (hover '.vehicle-mobile-menu .mobile-menu a'; no click pokes — plain links)
- 22:20 motion live RESULT 1440+360: hover card a -> color #0c121c -> rgba(12,18,28,.8) on a + img + h3 (inherited; global a:hover); ::after underline scaleX not sampled (pseudo; lifted @147562); header shrink transitions (canon); 0 videos, 0 widget pokes. Build observe launched same pokes
- 22:21 motion-compare 1440: 6 parity / 1 MISSING (transition top .5s on the fixed navbar — canon chrome header, fires on build at 360 (parity 2/2) but the 1440 short-page scroll pass did not trigger it on build; header-only, no page behaviour) / 0 extra; 360: 6 parity / 0 missing / 0 extra / 1 advisory (build transform). Card hover color parity (a/img/h3 rgba .8) from global a:hover + inherited colour; nothing to implement page-level -> motion/defender-en-gb-mobile-vehicle-menu{,-360}-compare.json
- 22:21 motion1 pixel round launched 1440+360 (run-bg defender-en-gb-mobile-vehicle-menu-{1440,360}-motion1, same flags)
