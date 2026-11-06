<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-11-05T16:35:55.707Z · input stardust/current/_dynamics.json (12 pages, 34 findings) -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-first-party-api-get-api-cart-generate-uuid | A | first-party API GET /api/cart/generate/uuid | 12/12 (reach 9/352) | decided-out | needs-backend | pending | decided-out | none (session-bound off-origin) |  |
| 2 | a-cms-app-settings-object-drupalsettings | A | CMS / app settings object drupalSettings | 12/12 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 3 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 12/12 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 4 | a-first-party-api-post-defender-en-gb-recommend-market | A | first-party API POST /defender/en-gb/recommend-market | 11/12 (reach 54/352) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? |  |
| 5 | a-first-party-api-post-en-gb-recommend-market | A | first-party API POST /en-gb/recommend-market | 1/12 (reach 351/352) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? |  |
| 6 | a-first-party-api-get-defender-en-gb-api-facet-data | A | first-party API GET /defender/en-gb/api/facet-data | 1/12 (reach 5/352) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? |  |
| 7 | cr-client-rendered-slot-js-cm-form-drp-cm-subscribe-form | CR | client-rendered slot js-cm-form drp-cm-subscribe__form | 11/12 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 8 | cr-client-rendered-slot-people-listing-page-view-view-people | CR | client-rendered slot people-listing-page view view-peoples | 1/12 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 9 | f-form-drp-cm-subscribe-defender-third-party-www-createsend- | F | form "drp-cm-subscribe-defender" → third-party www.createsend.com (4 fields) | 11/12 | rebuild-native | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 10 | i18n-locale-variants-x-default-en-en-gb-en-us-zh-cn-de-de-fr | I18N | locale variants x-default,en,en-gb,en-us,zh-cn,de-de,fr-fr,es-es,it-it,en-au,en-in,en-lacro,es-lacro,es-mx,pt-br,zh-tw,ko-kr,nl-nl,nl-be,fr-be,en-mena,fr-mena,de-at,cs-cz,sk-sk,ar-mena,en-apac | 7/12 | rebuild-native | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 11 | i18n-locale-variants-en-en-gb-en-us-zh-hans-de-fr-es-it-x-de | I18N | locale variants en,en-gb,en-us,zh-hans,de,fr,es,it,x-default,en,en-gb,en-us,zh-cn,de-de,fr-fr,es-es,it-it,en-au,en-in,en-lacro,es-lacro,es-mx,pt-br,zh-tw,ko-kr,nl-nl,nl-be,fr-be,en-mena,fr-mena,de-at,cs-cz,sk-sk,ar-mena,en-apac | 3/12 | rebuild-native | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 12 | i18n-locale-variants-en-en-gb-de-x-default-en-en-gb-en-us-zh | I18N | locale variants en,en-gb,de,x-default,en,en-gb,en-us,zh-cn,de-de,fr-fr,es-es,it-it,en-au,en-in,en-lacro,es-lacro,es-mx,pt-br,zh-tw,ko-kr,nl-nl,nl-be,fr-be,en-mena,fr-mena,de-at,cs-cz,sk-sk,ar-mena,en-apac | 1/12 | rebuild-native | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 13 | i18n-locale-variants-en-en-gb-de-it-x-default-en-en-gb-en-us | I18N | locale variants en,en-gb,de,it,x-default,en,en-gb,en-us,zh-cn,de-de,fr-fr,es-es,it-it,en-au,en-in,en-lacro,es-lacro,es-mx,pt-br,zh-tw,ko-kr,nl-nl,nl-be,fr-be,en-mena,fr-mena,de-at,cs-cz,sk-sk,ar-mena,en-apac | 1/12 | rebuild-native | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 14 | m-modal-trigger-aria-controls-dialog-chrome-only-dialog-vide | M | modal trigger aria-controls→dialog (chrome only) → dialog:video | 12/12 | rebuild-native | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 15 | m-modal-trigger-aria-haspopup-chrome-only-div-form | M | modal trigger aria-haspopup (chrome only) → div:form | 9/12 (reach 2532/352) | rebuild-native | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 16 | m-modal-trigger-data-social-popup-open-chrome-only-dialog-co | M | modal trigger data-social-popup-open (chrome only) → dialog:content | 1/12 (reach 395/352) | rebuild-native | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 17 | m-modal-trigger-social-popup-row-chrome-only-target-outside- | M | modal trigger social-popup__row (chrome only) → target outside DOM at capture | 1/12 (reach 2140/352) | rebuild-native | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 18 | m-modal-trigger-aria-haspopup-button-content | M | modal trigger aria-haspopup → button:content | 1/12 (reach 2532/352) | rebuild-native | self | pending | modal-loader | none |  |
| 19 | m-modal-trigger-aria-haspopup-button-content-div-form | M | modal trigger aria-haspopup → button:content/div:form | 1/12 (reach 2532/352) | rebuild-native | self | pending | modal-loader | none |  |
| 20 | m-modal-trigger-data-modal-download-target-outside-dom-at-ca | M | modal trigger data-modal-download → target outside DOM at capture | 1/12 (reach 20/352) | rebuild-native | self | pending | modal-loader | none |  |
| 21 | s-site-search-form-defender-en-gb-search-submit | S | site search form → /defender/en-gb/search-submit | 11/12 (reach 0/352) | index-backed | self | pending | search-index-backed | none (corpus = the migrated pages; second corpora stay out) |  |
| 22 | s-site-search-form-en-gb-search-submit | S | site search form → /en-gb/search-submit | 1/12 (reach 0/352) | index-backed | self | pending | search-index-backed | none (corpus = the migrated pages; second corpora stay out) |  |
| 23 | t-unknown-third-party-host-media-production-jlrms-com | T | unknown third-party host media.production.jlrms.com | 12/12 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 24 | t-unknown-third-party-host-static-addtoany-com | T | unknown third-party host static.addtoany.com | 12/12 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 25 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 12/12 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 26 | t-unknown-third-party-host-vumbnail-com | T | unknown third-party host vumbnail.com | 12/12 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 27 | t-analytics-google-analytics-ads | T | analytics: Google Analytics / Ads | 12/12 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 28 | t-unknown-third-party-host-js-createsend1-com | T | unknown third-party host js.createsend1.com | 11/12 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 29 | v-video-vimeo | V | video: Vimeo | 12/12 | embed-passthrough | self | pending | media-as-url | none (player ids are public) |  |
| 30 | x-commerce-signals-cart-true-prices-0 | X | commerce signals (cart: true, prices: 0) | 11/12 | decided-out | needs-backend | pending | decided-out | auth / commerce on the new host? |  |
| 31 | x-sign-in-account-links | X | sign-in / account links | 4/12 | decided-out | needs-backend | pending | decided-out | auth / commerce on the new host? |  |
| 32 | x-commerce-signals-cart-true-prices-27 | X | commerce signals (cart: true, prices: 27) | 1/12 | decided-out | needs-backend | pending | decided-out | auth / commerce on the new host? |  |
| 33 | chrome-menu | M | header menu: JLR MEDIA, EN-GB, United Kingdom (English) (chrome only) | 1/1 | rebuild-native | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 34 | chrome-search | S | header search: Search button, press enter to open search field, Search All Brands (chrome only) | 1/1 | index-backed | self | pending | search-index-backed | none (results from the query index; overlay and typeahead per the contract) |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 16 row(s) — read-settings, settled-dom-snapshot, chrome-interaction, modal-loader, search-index-backed, media-as-url.
- **One owner decision batch:** 14 row(s) — which tier for the target host; consumer on the migrated pages? · production endpoint; interim capture ships now · scope of the locale trees · which tags run on the new host; property ids.
- **Already delivered by the capture pipeline:** 0 row(s) — no work.
- **Host-bound on the target:** 0 of 0 probed API paths — the off-origin data work.

## Phases

- **interactive** — 9
- **tags** — 6
- **register** — 4
- **locale wave** — 4
- **off-origin data** — 3
- **detect** — 2
- **capture** — 2
- **search** — 2
- **forms** — 1
- **media** — 1
