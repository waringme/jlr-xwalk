# Dynamic features — plan (media.jlr.com en-gb replica)

Static first, then wire. Every feature below degrades to a working static page first; the
static recreation (Phase 3) never waits on this plan. Delivery is local-only in this run, so
phases that need a published origin (index, search, parity checks) are authored and verified
locally and re-verified at rollout.

| phase | features | deliverable | authoring contract | verification | owner decision | effort |
|---|---|---|---|---|---|---|
| D1 chrome | #4 header-menu, #3 search UI, #11 basket UI (inert) | header block JS: burger menu, locale dropdown, vehicle menu, search overlay | header fragment (nav doc) | motion-observe live vs build; chrome-compare | — | M |
| D2 modals | #5 share-popup, #6 download-modal, #7 hero-carousel | block JS for share popover, download modal, carousel | per-item share/download links authored in the item row | motion-observe; interaction parity per archetype | — | M |
| D3 media | #8 vimeo, #9 asset-cdn | embed block (Vimeo id + vumbnail poster); images in EDS media, download links to CDN | video id authored as link | player renders at 1440/360 | #9 | S |
| D4 listings + search | #1 listings-facets, #2 brand-rails, #3 site-search | helix-query.yaml + listing/rail blocks reading /query-index.json; search results page | listings contract meta fields (dynamic-features.md) | count/title parity vs source per listing; search-query probes | — | L |
| D5 forms | #10 newsletter | subscribe UI with "no backend connected" message | form fields from capture | renders; submit blocked | #10 | S |
| D6 deferred | #12 sign-in, #13 market-recommend, #14 locale-variants, #17 martech | links to source origin; martech scaffolded off | — | link audit | #12 #13 #14 #17 | S |
