<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-11-05T15:20:00Z
  readArtifacts:
    - stardust/current/pages/*.json (352 live Playwright renders, en-gb scope)
    - stardust/current/_crawl-log.json
    - stardust/current/_brand-extraction.json
    - stardust/.work/analysis.json
  synthesizedInputs: []
  stardustVersion: 0.32.1
  note: descriptive current-state record of https://media.jlr.com/en-gb and its seven en-gb brand sub-sites; not an authored target
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

_provenance: inferred — basis: the site's own vocabulary ("Media Newsroom", "press office contacts", "Hi Res / Low Res" downloads, "Broadcast Video", "Press Kits", "Tech Specs", "Notes to Editors") and the absence of any consumer purchase path._

- **Journalists and editors** covering JLR and its brands, who need the latest press releases, quotable facts ("Further information", "Notes to Editors") and the press-office contact for their market.
- **Broadcasters and content producers** who need downloadable video (Vimeo-hosted video packs, broadcast b-roll) and high-resolution stills (image packs with Hi Res / Low Res variants, zipped download archives).
- **Partners, analysts and enthusiasts** who browse vehicle pages, executive biographies and model-year tech specs.

## Product Purpose

The JLR Media Newsroom is the official press and media asset portal for JLR (Jaguar Land Rover). One Drupal site serves a main landing (`/en-gb`, "Media Landing") and seven brand newsrooms — Range Rover, Defender, Defender Rally, Discovery, Jaguar, Jaguar TCS Racing (Formula E) and Classic — each with its own branded header, favicon and vehicle menu. Every brand newsroom publishes the same content system: news releases, images, image packs, videos, video packs, broadcast videos, vehicle pages (a filtered media archive per model), people (executive committee and biographies), press kits, tech specs, country press contacts and legal pages. Success, as the site frames it, is a journalist finding, filtering and downloading the right asset quickly.

## Positioning

The single authoritative source of JLR press material: first-party press releases with embargo-free dates, brand-approved imagery at print resolution, and the named press office for each market — something an aggregator or fan site cannot offer.

## Capabilities and Constraints

Observed on the live capture (2026-11-05):

- **Filterable media archive** on every listing and vehicle page: a "Refine By" sidebar (Vehicles → Current / Past / Classic, Tags, People, Model Year, Format / View for images, Video Format / Video View for video), a result count ("659 Results"), and a numeric pager ("n of N"); facets load from `<site>/en-gb/api/facet-data`.
- **Downloads everywhere**: per-asset dropdowns (Hi Res / Low Res), per-release zip archives (`media.production.jlrms.com/download_archives/…`), biography zips.
- **Media cart** ("View 0" in the top bar; `GET /api/cart/generate/uuid`) and **share** (AddToAny: Facebook, X, LinkedIn, copy link).
- **Video** via Vimeo players (`player.vimeo.com`, `vimeocdn.com`).
- **Newsletter** subscribe band in every footer (Campaign Monitor, `js.createsend1.com`, 310 of 352 pages).
- **Market / language selector** (China, France, Germany, International, Italy, North America, Spain, United Kingdom) and a **geo market-recommendation dialog** (`POST <site>/en-gb/recommend-market`) that non-UK visitors get on every page ("Location detected … Would you like to switch?"). The capture suppressed that dialog (it is not page content for a UK visitor).
- **Analytics**: Google Tag Manager on every page.
- Constraint: brand sub-sites share one template set but carry brand-specific header logo, vehicle menu, favicon and (for Jaguar and Jaguar TCS Racing) a different footer and partner-logo strip.
- Constraint: several URLs exist twice (literal vs percent-encoded parentheses in vehicle paths, 6 pairs), and `/jaguar-tcs-racing/en-gb/directors` redirects to the root landing.

## Brand Commitments

- **Register: brand** (editorial newsroom, marketing photography, no authentication). Ambiguity note: it behaves like a tool for its core users (filters, carts, downloads), so a `product` reading is defensible for the listing templates.
- **Personality (observed):** restrained, premium, editorial; uppercase headlines and labels, generous white space, photography-led, near-monochrome UI chrome with each brand's own logo and typeface carrying the identity.
- **Assets:** per-brand logos (`stardust/current/assets/logos/`), per-brand favicons (`assets/favicons/`), the JLR corporate mark (`assets/logo.svg`), a custom icon font (`jlr-media-site-new.woff`) plus Font Awesome, and private brand typefaces (see `_brand-extraction.json#type.files`).
- **Anti-references (observed):** no gradients-as-decoration, no rounded "app" cards, no playful colour; colour comes from photography, not UI.

## Evidence on Hand

- 352 live page captures with rendered DOM and full-page screenshots: `stardust/current/pages/<slug>.json|.html`, `stardust/current/assets/screenshots/<slug>.png`.
- Typed content slots per page (`pages/<slug>.json#slots`), page types in `stardust/state.json`.
- Computed-style census: `stardust/current/_computed-styles.json`; brand surface: `stardust/current/_brand-extraction.json`.
- Fonts: `stardust/current/assets/fonts/` (private brand cuts — verify licence before redeploying).
- Real press copy, dates, captions and download links live in the page records; nothing here may be paraphrased into new copy.
- Absent: no testimonials, pricing, or customer-facing commerce; no authenticated areas were captured; other locales and `/corporate` are out of scope.

## Product Principles

_provenance: inferred — basis: the consistent structure of all 352 pages._

1. **Asset first:** every content unit (release, image, pack, video) carries its own download and share affordance.
2. **Findability over storytelling:** listings lead with filters, counts and pagination; landings lead with the latest releases.
3. **One system, many brands:** a shared template set, re-skinned per brand through logo, typeface and vehicle menu.
4. **Dates and provenance visible:** every card and release shows its publication date.

## Accessibility & Inclusion

_provenance: inferred_ — observed: skip link ("Skip to main content"), ARIA labels on download dropdowns ("Download options for image 1"), but many listing tiles rely on background images without alt text and some headings are uppercase-only via text transform. No product-specific accessibility requirement was established.
