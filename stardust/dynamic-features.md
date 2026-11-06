# Dynamic features — media.jlr.com (en-gb) replica

Curated from `stardust/dynamics/dynamic-features.generated-plan.{md,json}` (34 drafted rows,
detector over the 12 archetypes in `stardust/replica/archetypes.json` + reach from the
352-page `extract --dynamics` crawl). Duplicates merged; every row has a disposition.
Run mode: hands-off for owner decisions (interim tier ships, decision named; no row is
`decided-out` by assumption). Delivery in this run is LOCAL ONLY (user choice) — no target
origin exists yet, so no host-bound probe was run (`--target-origin` at rollout).

## Listings contract

Media listings (news, images, image packs, videos, video packs, people) and the brand-landing
"Latest News / Images / Videos" rails are server-rendered Drupal views with Refine-By facets and
pagination. Migrated pages must emit, per content item: `<meta name="title">`, `description`,
`image`, `publication-date` (dd Month yyyy as displayed), `brand` (sub-site), `content-type`
(news | image-pack | video-pack | person | vehicle), `vehicle` (when tagged), `image-count` /
`video-count` (pack badges). Listing blocks read `/query-index.json` (helix-query.yaml in the code
branch, authored at Phase 5); document-first — the static migration carries the captured items
as authored rows (listings.md § Block contract).

## Features

| # | id | feature | class | reach | disposition | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | listings-facets | Media listings: Refine-By facets + pagination + Images/Image-Packs toggle (Drupal views, `GET /<brand>/en-gb/api/facet-data`) | L | 42 listing + 68 vehicle pages | index-backed | self | pending | listing-index-backed | — | generated rows 5, 7; module `filterable-media-grid` |
| 2 | brand-rails | Brand-landing / vehicle "Latest News · Images · Videos" rails | L | 7 brand + 68 vehicle | index-backed | self | pending | listing-index-backed | — | modules `news-card`, `home-section-cards` |
| 3 | site-search | Header site search → `/<brand>/en-gb/search-submit` (+ header search overlay) | S | all pages (chrome) | index-backed | self | pending | search-index-backed | results page over the migrated corpus | generated rows 20, 21, 33 |
| 4 | header-menu | Header: JLR MEDIA burger menu, locale selector dropdown, brand vehicle menu (aria-haspopup / aria-controls dialogs) | M | all pages (chrome) | rebuild-native | self | pending | chrome-interaction | — | generated rows 13, 14, 17, 18, 32; stardust/chrome/ |
| 5 | share-popup | Share popover (data-social-popup-open / social-popup__row; AddToAny) on every media item | M | ~all media items | rebuild-native | self | pending | modal-loader | share targets kept as plain links | generated rows 15, 16, 23 |
| 6 | download-modal | Download modal (data-modal-download) for images / packs | M | 20 pages | rebuild-native | self | pending | modal-loader | asset download URLs stay on media.production.jlrms.com (row 9) | generated row 19 |
| 7 | hero-carousel | Featured-news hero carousel (dots, auto-advance) on landings | M | 9 landing pages | rebuild-native | self | pending | carousel | — | module `hero-carousel` |
| 8 | vimeo | Vimeo player embeds (videos, video packs) + vumbnail.com poster thumbnails | V | video pages | embed-passthrough | self | pending | player-embed | — | generated rows 25, 28 |
| 9 | asset-cdn | Image/asset CDN `media.production.jlrms.com` (press images, downloads) | T | all media pages | embed-passthrough | needs-business-decision | interim | off-origin-asset | Owner: keep hot-linking the JLR asset CDN vs import assets into EDS media bus. Interim: images imported to EDS media; download links point to the CDN | generated row 22 |
| 10 | newsletter | Newsletter SUBSCRIBE (Campaign Monitor form `drp-cm-subscribe-*`, js.createsend1.com) in the footer | F | all pages (footer) | rebuild-native | needs-backend | scaffolded-awaiting-owner | form-third-party | Owner: Campaign Monitor list id / endpoint on the new host. Interim: UI rebuilt, submission not wired ("no backend connected") | generated rows 6, 8, 27 |
| 11 | media-basket | "VIEW (0)" media basket / favourites (star) + `GET /api/cart/generate/uuid` | X | all pages (chrome) + 9 pages API | rebuild-native | needs-backend | scaffolded-awaiting-owner | session-feature | Owner: is the press-media basket kept (needs a session backend)? Interim: header counter + star UI rendered static, inert | generated rows 0, 29, 31 |
| 12 | sign-in | Sign-in / account links | X | chrome | static-snapshot | needs-business-decision | interim | — | Owner: journalist accounts on the new host? Interim: links kept pointing at the source origin. undecided — revisit at rollout | generated row 30 |
| 13 | market-recommend | Geo market-recommendation dialog (`POST /<locale>/recommend-market`) shown to non-UK visitors | A | 351 pages | static-snapshot | needs-business-decision | interim | — | Owner: keep geo market recommendation on the new host? Interim: not shown (UK-visitor state is the captured design; capture-state policy, stardust/.work/no-market-modal.mjs). undecided — revisit at rollout | generated rows 3, 4 |
| 14 | locale-variants | hreflang locale alternates (x-default, en, en-gb, en-us, zh-cn, de, fr, es, it …) + locale selector targets | I18N | all pages | rebuild-native | needs-business-decision | interim | locale-tree | Owner: only en-gb is in scope; other locales stay on the source. Interim: hreflang/selector links point at the source origin for non-en-gb locales | generated rows 9–12 |
| 15 | people-listing | Client-rendered people listing view (directors grid) | CR | 24 grid-overview pages | static-snapshot | self | pending | — | settled DOM ships as content (captured complete); unfreeze when the people index exists | generated row 7 |
| 16 | app-settings | drupalSettings / dataLayer objects | A | all pages | static-snapshot | self | done | — | not reproduced: CMS runtime config, no consumer after migration except martech (off) | generated rows 1, 2 |
| 17 | martech | Google Tag Manager + Google Analytics / Ads | T | all pages | embed-passthrough | needs-business-decision | scaffolded-awaiting-owner | martech-scaffold | Martech only on request — scaffolded OFF; owner decides container ids on the new host | generated rows 24, 26 |
| 18 | contact-hero-rotation | Contact-listing hero image chosen at random per request from a pool (3 different images seen across loads) | M | 8 contact-listing pages | rebuild-native | self | interim | random-from-authored-pool | Interim: the captured image ships fixed; block picks from an authored image list at render. Pool to be captured (load the page N times) at Phase 5 | notes/defender-en-gb-contact.md; gate masks 1440 262:500, 360 195:182 |

## Decision batch

One message to the owner (hands-off: each is a named assumption; the interim tier ships):

- **Backends / credentials:** newsletter Campaign Monitor endpoint (#10); media basket session backend (#11).
- **Business decisions:** asset CDN hot-link vs import (#9); journalist sign-in (#12); geo market
  recommendation (#13); non-en-gb locales stay on source (#14); martech container ids (#17).
- No regulated-PII forms found; no blank client-rendered captures (no human-capture batch).

## Register (decided-out)

| feature | reason | production statement |
|---|---|---|
| — | none: no owner statement yet; hands-off assumptions never write decided-out | — |
