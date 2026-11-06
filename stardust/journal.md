# Journal

## Extract — 352 en-gb pages captured live after suppressing a geo market dialog (2026-11-05)

**Scope.** User-scoped list of 352 en-gb paths (`stardust/.work/scope-paths.txt`): `/en-gb` plus the seven brand newsrooms (range-rover, defender, defenderrally, discovery, jaguar, jaguar-tcs-racing, classic). Discovery bypassed with `--pages`; other locales and `/corporate` out of scope.

**What happened.**
- First crawl (headless, medium, concurrency 4) was aborted at 210/352: media.jlr.com geo-detects a non-UK visitor and opens a Drupal AJAX dialog ("Location detected: United States … switch?") via `POST <site>/en-gb/recommend-market`. It sat over the hero in every screenshot and its h1 entered the heading lists. The crawler's consent dismissal runs before the dialog arrives and has no "No thanks" label.
- Fix without touching the plugin: a preload hook `stardust/.work/no-market-modal.mjs` (`node --import`) answers `recommend-market` with an empty Drupal AJAX command list on every context and page. The page-level route matters: live-session registers its own context route later, which shadowed a context-only hook (the first style-census pass still showed the dialog as a 100 % occluder).
- Second crawl: 351/352, one `page.goto` timeout recaptured on a single-page retry (the retry run overwrote the roll-ups; `_crawl-log.json` restored from the full-run log, retry kept under `crawl.retried[]`).
- Phase 2.5 vision: 352 pages / 462 thumbnail slices read by 7 sub-agents. 17 flagged; 15 recaptured at `--wait slow` and re-read. Final: 337 ok, 11 recaptured, 4 suspect. The 4 suspects are article galleries whose jQuery-lazyload thumbnails (`img.lazy[data-original]`) never swap in during the 4-step scroll, even at slow; the URLs are in the DOM. 32 pages carry at least one unloaded lazy thumbnail in their screenshot.
- Style census at 1440 over 344/352 pages (8 navigation timeouts; aggregate is still evidence). Header contract recorded for `/en-gb` and `/range-rover/en-gb`. Cap-probe over 12 archetypes: content cap 1176 px, shell fluid.

**Findings that matter downstream.**
- One Drupal theme and one `main.css` for all eight sites. A brand swaps only its typeface (JLR Emeric / Helvetica Now Text / Neusa Neu / Avenir Next + Land Rover Web / Jaguar Exuberant), header mark, vehicle menu and favicon. The type scale is identical.
- UI is monochrome (ink #0c121c on white, footer #1e1e1e); colour comes only from photography.
- 12 structural page types inferred from Drupal body classes (`path-*`, `page-node-type-*`) plus DOM components. Cross-checked against `catalog/template-catalog.json`: 54 disagreements, all resolved by DOM evidence. Examples: vehicle pages are a filtered media archive, not content-detail; person pages are their own type.
- 6 percent-encoded duplicate URL pairs (`(…)` vs `%28…%29`) are flagged `duplicateOf`. `/jaguar-tcs-racing/en-gb/directors` redirects to the root landing.
- Capture gap: `/en-gb/cart` is linked from the main landing and not captured (utility page, outside the scope list).
- Fonts: 30 files, all private brand cuts (verify licence before redeploying). Icon font `jlr-media-site-new` plus Font Awesome.

**Artifacts.** `stardust/current/` (PRODUCT.md, DESIGN.md, DESIGN.json with `extensions.breakpoints`, brand-review.html, `_brand-extraction.json`, `_computed-styles.json`, `_crawl-log.json`, pages/ 352 × json+html, assets/{screenshots,fonts,logos,favicons}). `stardust/state.json`: 352 extracted, `flow: replica`. Evidence table: `stardust/.work/extract-evidence.md`.

## Preserve direction — verbatim promotion, empty register, 17-row dynamics triage (2026-11-05)

- Promoted `stardust/current/{PRODUCT.md,DESIGN.md,DESIGN.json}` byte-for-byte to the project root (full-prep branch). No `--target-breakpoints`: source breakpoints kept.
- `stardust/direction.md` written in preserve mode. Inconsistency register empty — pure replica (no audit requested, no user items; hands-off adopts none).
- Archetypes fixed in `stardust/replica/archetypes.json`: `/en-gb` for main-landing, the Defender sub-site for the other 11 types (all brands share one theme; per-brand deltas are typeface, logo, vehicle menu, favicon).
- Dynamics: detector over the 12 archetypes → 32 findings; plan drafted 34 rows, curated to 17 in `stardust/dynamic-features.md` + `-plan.md`. Every row has a disposition. Self: listings/facets, rails, site search, header menu, share popover, download modal, hero carousel, Vimeo, people listing. Decision batch (interim ships): asset CDN, newsletter backend, media basket, sign-in, geo market recommendation, non-en-gb locales, martech. Nothing decided-out by assumption.
- Fonts: all 30 captured faces are licensed brand typefaces (JLR Emeric, Helvetica Now Text, Neusa Neu, Avenir Next, Land Rover Web, Jaguar Exuberant/Modern, Proxima Nova) — never rehosted; Phase 3 uses metric-matched substitutes with the brand family first in each stack.

## Recreate + gate defender-en-gb — iteration 2: 1440 pixel PASS 1.48 %, 360 still FAIL 16.41 % (2026-11-05)
- Fixes: hero initial slide 1 (capture freeze), hero gap 23 px, .home-page wraps strips + mobile .home-page .date rule. 360 residual is a card-title wrap fork from the Urbanist substitute; newsletter/footer @360 short. Full probes still not run to verdict. Notes: stardust/replica/notes/defender-en-gb.md

## Recreate + gate defender-en-gb — canon archetype gated (2026-11-05)
- Archetype: brand-landing, live https://media.jlr.com/defender/en-gb → stardust/prototypes/defender-en-gb-proposed.html (generated by stardust/.work/defender/build-page.mjs + page-template.html; content root `.page-view`). 3 iterations per width (cap reached).
- Gates (iter3c, confirmed by pixel round motion1): 1440 PASS — pixel 1.48 %, Δh +1, 0 structural 🔴, visual flags none, cap-probe PASS (2560), clipped 0, overflow ok. 360 FAIL on pixel only — 11.58 %, Δh −21, 0 🔴, visual none, cap-probe PASS, clipped 0, overflow ok.
- Residual (permanent, flagged for user): 360 news-card title t2 wraps 2 lines vs live 3 under the Urbanist substitute for NeusaNeu-Regular (no uniform tweak reaches it) → cumulative −21 px below the news grid, hot bands y 2500–5000 / 6000+. Justified forks: content-diff 🟠 font fork ×1, header nav Δx/Δw substitute-font advance widths.
- Fonts (SUBSTITUTE, brand family first in every stack): NeusaNeu → Urbanist (WideBold → Golos Text), JLR Emeric → Hanken Grotesk, Helvetica Now Text → Public Sans; full mapping in progress.json `fonts`, files under prototypes/canon/fonts/.
- Canon created: canon/tokens.css, canon/chrome.css, canon/chrome.js, canon/modules.css, canon/fonts/, canon/img/; units.json families news-card, pack-card, footer-social-button; canon-requests 0.
- Motion (observed on live with motion-observe, 1440 + 360 burger; replica/motion/defender-en-gb*.json): header shrink/bottom-shadow >150 px, burger overlay .is-open + scroll lock, market switcher --active (chevron bounce), Vehicles mega .open with fadeIn .3s/slideDown .5s, Search Defender --open (+ input .15s border transition), hero dot click + autoplay 5 s (slick fade 500 ms linear, per live slider-init.js). All implemented in canon/chrome.js + canon/chrome.css. Dead: card share trigger click/hover (no mutation, no style diff); .new-card hover not found. motion-compare: all fired behaviours parity, 0 EXTRA; the one MISSING (media auto-advance) is the observer's 1.5 s idle-window phase — build verified rotating every 5 s. Pixel after motion returned exactly to gated values (1.48 % / 11.58 %). Hero autoplay frozen at slide 1 for capture → captureState restoreAtDelivery.
- Notes: stardust/replica/notes/defender-en-gb.md; facts: stardust/replica/progress.json types.brand-landing.

## Recreate + gate defender-en-gb-vehicle-defender-110 — motion parity, pixel unchanged (2026-11-05)
- Motion observed on live 1440 (motion-observe, hook; the 19:52 run was lost to a restart and re-run): refine sidebar toggle (panel --open, content --with-sidebar, .5s), facet collapse (.active-facet chevron .2s, .collapse-me--trans height .6s), below-fold card image blur-in (.lazy-blur → .lazy-loaded), refine/pager hovers; header shrink is canon.
- Implemented page-only in prototypes/js/defender-en-gb-vehicle-defender-110.js + lifted state CSS; generator adds pager rel=prev/next and the page script. No canon files edited, no canon requests.
- motion-compare: 15 parity, 0 extra; missing only the pager page-2 API fetch (loader, lazy-ready, prev hover) = dynamic, justified. Dead: hero thumb click, tab/thumb hovers.
- Pixel round motion1 returned exactly to gated values: 1440 9.67 % Δh +44 (card-4 teaser substitute-font wrap residual), 360 2.77 % Δh 0.

## Recreate + gate defender-en-gb-image-packs — motion unit: interaction parity, gate numbers hold (2026-11-05)

- Resumed after the restart. Ran clip-probe and chrome-parity at 1440 one more time and both finished: clip-probe Clipped: 0. chrome-parity: the footer is only shifted Δy −6 as a whole (a page offset); the header deltas are substitute-font Δx/Δw forks plus the hidden market-list items at Δx +12 (canon chrome, the same class of delta as defender-en-gb).
- motion-observe on live (1440 + 360) caught: refine sidebar open (panel --open, content --with-sidebar, .5s), facet collapse (active-facet, collapse-me --trans .6s → --open, icon rotate .2s), the card trigger opening the pack expander (.gallery-item.active) and cart-btn--active (1440 only).
- Implemented page-only in prototypes/js/defender-en-gb-image-packs.js, with state CSS lifted from main.css (@349616–@354932). No canon files edited and no new canon requests.
- motion-compare: 1440 16 parity / 3 missing / 0 extra. The missing ones are justified: the load8 loader and hvr-icon-push both come from the expander's AJAX pack load, and lazy-loaded is a non-visual lazysizes marker. 360 15 parity / 0 missing / 0 extra.
- Open: hovering a card on live shows the overlay (source CSS @126157), but the observer's hover check missed it, so it was not implemented. Coordinator decision.
- Pixel round motion1 came back to the gated values: 1440 0.92 % Δh −1, 360 1.86 % Δh 0, overflow ok on both.

## Recreate + gate defender-en-gb-image-packs-defender-110-namib-orange — motion parity, both widths hold (2026-11-05)
- motion-observe live 1440/360 (hook): fired = viewer open/close (.hide toggle), close-icon hvr-icon-push + color .3s, mobile drp-slider wrapper left .6s, canon header shrink. Dead on live: tile click/hover sample, share-trigger click.
- Implemented only those: js/defender-en-gb-image-packs-defender-110-namib-orange.js (viewer open/close, Esc, focus return; slider prev/next), lifted hvr-icon-push CSS, generator emits live's inline left:0% on the slider wrapper (needed for the left transition to fire).
- motion-compare: 1440 8 parity / 0 missing / 1 advisory; 360 6 parity / 0 missing. motion1 pixel rounds return to gated values (1440 2.02 % Δh -1; 360 1.86 % Δh 0).

## Recreate + gate defender-en-gb-directors — authored, box-level parity before gate (2026-11-05)
- grid-overview archetype (people-card-grid): canon page template + authored main (title strip with 1 px / 5 px rules, h1, PLC intro link, CEO grid of 2 + committee grid of 11 portrait cards, empty frontline strip, three hidden person-modal shells as live). Generator `stardust/.work/defender-en-gb-directors/build-page.mjs` from `content.json` (verbatim transcription via `extract-content.mjs`); live list is a client-rendered Drupal view shipped as a static snapshot (dynamic-features #15).
- Page CSS `css/defender-en-gb-directors.css` (main.css .people-listing* + Bootstrap grid/clearfix lifted); `js/defender-en-gb-directors.js` = fonts.ready nav-height resync (same canon timing issue as image-packs). measure --against: 1440 all boxes Δ0, 360 Δy -1, scrollHeight Δ-1 both, overflow 0. units.json += people-card (n 13). No canon requests. Next: iter1 gate.

## Recreate + gate defender-en-gb-directors — PASS at iter1 both widths, motion parity (2026-11-05)
- Pixel-only iter1: 1440 1.07 % Δh +1, 360 2.22 % Δh 0, overflow ok. content-diff 0 🔴 (3 hidden-modal icon glyph diffs fixed iter1b). cap-probe PASS (0/4 @2560). clip-probe Clipped: 0 both. visual-diff: 3 SURFACE flags = empty hidden-modal `h1.white` → page rule `.view-main .modal .white` (main.css @283763) → none.
- chrome-parity: footer parity @1440; header deltas = substitute-font forks + hidden market-list Δx +12 (canon chrome residual); 360 header bg transparent vs white (existing canon request), footer uniform Δy -5 (nav-height timing).
- Motion: no animations/widgets; card hover changes the portrait link colour via live global `a:hover` (@60470), missing in canon → page rule `.people-listing-holder > a:hover` + canon request. motion-compare 1440 8/0/0, 360 6/0/0. motion1 returns to gated values (1.07 % / 2.22 %).

## Recreate + gate defender-en-gb-news-2026-07-tough-luxury-new-defender-vertex-leads-design-and-accessory-update — iter3: 360 related-packs settled state replicated, residual forks logged (2026-11-05)
- 360 Δh 993 → 550: live .related-content-packs is bistable (tabs JS puts the slider block in flow, band h566 in the settled/gated state); build now replicates the settled state (CSS only). Remaining 360 Δh/pixel = substitute-font wrap forks (body −309, footnotes table −296 via auto column widths) — logged as permanent residuals. 1440 pixel 8.39 % PASS, Δh −31 (font forks). visual-diff SURFACE/GROUND ×8 = text-keyed matcher artifact (justified); clip 36 = live 36. Next: motion.

## Recreate + gate defender-en-gb-person-chris-thorp — authored person-profile prototype (2026-11-05)
- person-detail archetype. Content transcribed verbatim from the captured DOM (`.work/defender-en-gb-person-chris-thorp/extract-content.mjs`, reconciled against the page-JSON slots); page generated from the canon page template (read-only) by `build-page.mjs`, `<main>` replaced by the person-profile module (radial-gradient panel, centred portrait, name/role, grey 310 px scrolling bio box, Download Biography, empty related-tabs rule, Back).
- CSS lifted from main.css (@110783–@283781) + libraries.css, checked with measure.mjs --against: 1440 all main boxes Δ0 bar substitute-font width forks; 360 boxes Δ0 relative to a uniform .view-main offset (canon --nav-height sample timing, live itself jitters 165/171). No canon changes; no new canon requests. units.json += person-bio-paragraph (n 6). State -> prototyped. Next: iter1 gate.
- Gate (pixel-only rounds): iter1 1440 10.72 % FAIL — on this short page (1501 px) live main.js sticky.c shrinks the header at chunk 2, the doc shrinks with --nav-height, the scroll clamps upward and the `i<o` branch un-shrinks it again; canon has no scroll-up un-shrink. Page JS replicates it (capture-phase scrollTop read, since canon's handler forces the clamped layout first); canon request appended. iter2b: 1440 1.35 % Δh +1, 360 2.65 % Δh 0, overflow ok. Confirmation probes + motion next.

## Recreate + gate defender-en-gb-news-2026-07-tough-luxury-new-defender-vertex-leads-design-and-accessory-update — motion parity (2026-11-05)
- motion-observe live 1440/360 (hook) + a quoted re-poke of the figure Download toggle (the first run's '.hover-prt-wrapper .dropdown-toggle' was shell-split). Fired: pack card click → .gallery-item.active (fixed expander modal), viewer .hide toggle, close/download icon hvr-icon-push, figure dropdown .open (bootstrap focuses the toggle → :focus colour .3s), overlay opacity .5s linear, hover-bar transform, 360 slider wrapper left .6s, tab --active. Dead: share triggers, tile hover sample.
- Implemented in js/defender-en-gb-news-2026-07-tough-luxury-new-defender-vertex-leads-design-and-accessory-update.js (expander/viewer/slider logic reused from js/defender-en-gb-image-packs{,-defender-110-namib-orange}.js) + lifted CSS + generator tweaks (hvr-icon-push classes, div.jlr-tabs__block wrapper). motion-compare 1440 10/0/0, 360 8/0/0, dropdown 8/0/0. motion1 pixel rounds return to the gated values (1440 8.39 % Δh −31; 360 20.24 % Δh 550 — accepted substitute-font residuals).

## Recreate + gate defender-en-gb-person-chris-thorp — gate PASS 1440 + 360, motion parity (2026-11-05)

- Pixel: iter1 1440 10.72 % FAIL (live sticky header un-shrinks on any upward scroll; canon only at <=150 px) -> page JS capture-phase scroll-up un-shrink -> iter2b 1440 1.35 % / Δh +1, 360 2.65 % / Δh 0 (2 iterations each). One canon request appended.
- Confirmation probes: content-diff found 1 🔴 ROLE SWAP (live h1 wraps the name in div.field--name-name) -> generator now emits the same wrapper -> 0 🔴 at both widths. visual-diff: 1440 none; 360 STRETCHED portrait 128x174 also on live (justified). chrome-parity: canon font-sub forks + market-list Δx +12, 360 header bg (existing canon request), 1440 footer uniform Δy +6 (nav-height sample jitter). clip-probe Clipped 0; cap-probe PASS.
- Motion (motion-observe live + build, 1440 + 360): download/back button hover flips, hvr-icon-push, canon header shrink -> 9 parity / 0 missing / 0 extra; h1 hover dead. motion1 pixel round returned exactly to 1.35 % / 2.65 %.

## Recreate + gate defender-en-gb-contact-china-3 — authored contact-detail-panel on canon chrome (2026-11-05)

- Contact-detail archetype (`/defender/en-gb/contact/china-3`): grey `.contact-detail` band with component heading, rule and customer-support text. The contacts grid is empty on this page (`slots.contacts` is `[]`), so the build emits none, same as live.
- Generator `stardust/.work/defender-en-gb-contact-china-3/` (extract-content.mjs → content.json, reconciled against the page slots; build-page.mjs on the read-only canon template). Page CSS is lifted from main.css @268156–@269045 plus `.bt-component-heading` / `.bt-contact-page-description`. Page JS is the short-page header un-shrink copied from chris-thorp, per the coordinator rule.
- measure --against: every box Δ0 at 1440 and 360 once a bootstrap `.container` clearfix was added. The only differences are the `here.` link advance (substitute font) and root Δh -1/0. No canon edits, no canon requests, no repeated-unit families (the grid is empty).

## Recreate + gate defender-en-gb-contact — authored contact-region-cards prototype (2026-11-05)
- contact-listing archetype (`/defender/en-gb/contact`): grey `.contact-page` band, hero picture (2 sources + img), "Customer support" component heading + rule, grid of 7 region cards (3 / 2 @≤991 / 1 @≤768 columns) linking to the contact-detail pages, each with an arrow glyph.
- Generator `stardust/.work/defender-en-gb-contact/` (extract-content.mjs -> content.json, reconciled against page-JSON headings/body; build-page.mjs on the read-only canon template). CSS lifted from main.css @265814–@269862 + bt-contact-*/bt-component-heading type rules. Page JS = short-page header un-shrink copied from chris-thorp (coordinator rule).
- measure --against: 1440 the "United Kingdom" description wrapped (Urbanist run 2–4 % wider, live 297 of 303 px) -> uniform -0.2px tracking at ≥992 (desc-widths.mjs sweep; at 360 it would un-wrap North America, so not applied there) -> every box Δh 0 at both widths; residual uniform Δy +3/+6 = canon nav-height sample jitter.
- Live hero image is randomised per request (Gorillaz at capture, DEF_110 exterior and Defender Awards on later loads): the build ships the captured image verbatim; the hero band is authored-volatile and will be masked in pixel-compare (gate doc § authored-volatile). units.json += contact-region-card (n 7). No canon requests. Next: iter1 gate.

## Recreate + gate defender-en-gb-contact — PASS at iter1 both widths (hero masked as authored-volatile), motion parity (2026-11-05)
- Pixel-only iter1: raw 1440 20.09 % / 360 7.84 % — hot bands are the hero picture only (live serves a random hero per request). Hero rows located identically on both stitched sides and masked (pixel-compare --mask, gate doc § authored-volatile): 1440 1.17 % Δh +1, 360 2.22 % Δh 0, overflow ok.
- content-diff 0 🔴 / Findings none at both widths; cap-probe PASS (0/3 @2560); clip-probe Clipped 0; visual-diff 1440 one STRETCHED flag = hero object-fit:cover crop (same rule on live, justified), 360 none; chrome-parity = canon font-sub forks + market-list Δx +12, 1440 footer uniform Δy +10 (live nav-height jitter).
- Motion: card hover border/shadow + arrow translate, header shrink — motion-compare 13/0/0 at both widths; heading hover dead on live. motion1 returns to 1.17 % / 2.22 %. No canon requests. Coordinator: the random hero needs a dynamic-features entry.
- Gate (pixel-only rounds, as the contract requires): iter1 passed at both widths. 1440 was 1.38 % with Δh +1; 360 was 4.62 % with Δh 0. Probes were clean: content-diff 0 🔴, visual-diff flags none, cap-probe PASS, Clipped 0, no overflow. The 360 chunk-2 header difference is not a layout bug. On this short page the sticky header flips between shrunk and full size on both live and build (scroll-anchoring loop at the clamped max scroll), so whichever state the stitched capture catches is a coin flip on each side. Logged as a justified residual.
- Motion: the `here.` link hover was MISSING because the page link-colour rule beat canon `a:hover`. Removing the rule gave parity (1440 1/0/0, 360 6/0/0). motion1 pixel: 1440 1.38 % (same as gated), 360 5.08 % (the same oscillation phase variance). Status: DONE, awaiting coordinator approval.

## Recreate + gate defender-en-gb-terms-and-conditions — authored legal-page prototype from canon template (2026-11-05)
- Text-only legal page: h1.page-title + .field--name-body (5 p, h2 COPYRIGHT, 1 p), content verbatim from the settled capture (inner HTML kept: &nbsp;, 3 inline links, U+2011), reconciled against page JSON slots.
- Generator stardust/.work/defender-en-gb-terms-and-conditions/build-page.mjs reuses the canon page template read-only (main replaced; no meta description/og as live; footer Terms link is-active). CSS lifted: bootstrap col-md-8/offset-2, body h1/h2 30px (22px ≤991), h1.page-title #777.
- measure --against: geometry Δ0; height deltas are substitute-font wrap forks only (1440 +26, 360 +77). Page JS copies the short-page header un-shrink pattern. Next: iter1 gate rounds.

## Recreate + gate defender-en-gb-mobile-vehicle-menu — authored vehicle-menu-list, entering gate (2026-11-05)

- Archetype `mobile-vehicle-menu` (https://media.jlr.com/defender/en-gb/mobile-vehicle-menu): one module, vehicle-menu-list — "Current" (Defender 90/110/130) and "Past" (Defender (1990-2016)) group headings over a vertical list of entry cards (130px 3:2 thumbnail | title, 1px #e9ecec frame, 2px ink underline scaling in on hover).
- Generator `stardust/.work/defender-en-gb-mobile-vehicle-menu/{extract-content,build-page}.mjs` on the canon page template (read only); CSS lifted from main.css (vehicle-mobile-menu rules + tailwind utilities) into `css/defender-en-gb-mobile-vehicle-menu.css`; short-page header un-shrink JS copied from the person-detail archetype.
- measure --against: every main box Δ0 at 1440 and 360 (only the canon nav-height jitter offset at 1440). units.json += vehicle-menu-group (2), vehicle-menu-entry (4). No canon edits or requests.

## Recreate + gate — 9 of 12 archetypes approved; Phase 4 closed by user decision (2026-11-05)

- Recreated as clean generated prototypes on a shared canon (`stardust/prototypes/canon/`: tokens, chrome, modules, OFL substitute fonts with the brand family first). Fonts substituted by user decision.
- Approved (hands-off): brand-landing (canon), vehicle-detail, media-listing, media-pack-detail, grid-overview, content-detail, person-detail, contact-listing, contact-detail. legal-page and mobile-vehicle-menu are gated but stay `prototyped` (motion unfinished). main-landing is not built.
- Prototype tables `gates/prototypes-{1440,360}/`: pixel-only 9/11 PASS per width. The pixel/Δh failures are substitute-font wrap forks (canon 360, news 360, vehicle 1440 Δh, legal 360 Δh), logged as residuals after the 3-iteration cap. Structural 🔴 is 0 on every gated archetype.
- Canon: 3 of 4 requests applied with zero regression over 14 rounds; the upward-scroll un-shrink was reverted (capture loop).
- Environment: the service restarted every 5–22 min, killing `--full` rounds, so rounds were split into pixel-only gate.sh plus direct probes. Overlay dismissal stalls on hidden `[role=dialog]` cards (`GATE_STITCH_TIMEOUT=600`). unit-geometry cached live geometry across widths; the project copy was patched (`scriptAdaptations[]`).
- Open items: `stardust/replica/phase4-summary.md` (units criterion audit, finishing pass, reverted canon request, 3 unbuilt or unapproved types).

## source-fidelity-gate — prototype tables written, phase closed with open units audit (2026-11-05)

- `gate-all --stage prototype` at 1440 and 360 over the 11 prototyped pages (live captures with the market-dialog hook; contact hero masked as authored-volatile, dynamic-features #18). Pixel and Δh reproduce the per-archetype gated values exactly.
- Verdict: pixel-only 9/11 PASS per width; full four-criteria 2/11, failing on repeated-unit geometry (declaration errors plus a cross-width cache bug in unit-geometry, patched in the project copy). Audit carried in `stardust/replica/phase4-summary.md` § Open items.

## handoff — AEM content package built from 3 imported templates (2026-11-06)

- User: "finish what you've done and get it ready for deployment packages for AEM, we can review later", then "stop the checks and build the jcr install package for the pages and assets".
- Code: 23 xwalk blocks (22 from the catalog + quote-centered) with Universal Editor models, section styles light-grey / centered / dark, `paths.json` (`/content/jlr-xwalk/` → `/`); `npm run lint` clean (stardust/ and tools/jcr-package/ excluded as tooling).
- Content: excat template pipeline → brand-landing 7, content-detail 46, vehicle-detail 62 pages in content/ (all convert via md2jcr).
- Package: `tools/jcr-package/dist/jlr-xwalk-content-1.0.0.zip` (115 pages, 67 structural parents in merge mode, 720 DAM images), built by `tools/jcr-package/build-package.mjs`; nothing uploaded. Gaps: 51 `blob:` images, 6 templates not yet imported (see tools/jcr-package/README.md).
