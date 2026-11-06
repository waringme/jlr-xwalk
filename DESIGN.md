<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-11-05T16:20:00Z
  readArtifacts:
    - stardust/current/_computed-styles.json (style-census, 344 of 352 pages at 1440)
    - stardust/current/_brand-extraction.json
    - stardust/.work/site-fonts.json (per-sub-site type, from the census)
    - stardust/.work/css/media.jlr.com_themes_custom_jlr_media_css_main.css (one main.css shared by all 8 sites)
    - stardust/current/pages/*.json (352)
  synthesizedInputs: []
  stardustVersion: 0.32.1
  note: descriptive snapshot of the live system (replica flow — this is the design to preserve, not a target)
-->
---
name: JLR Media Newsroom
description: JLR's press and media asset portal — one Drupal theme serving a main landing and seven brand newsrooms.
colors:
  ink: "#0c121c"
  white: "#ffffff"
  black: "#000000"
  graphite: "#333333"
  slate: "#555555"
  rule-grey: "#d1d5db"
  mist: "#e9ecec"
  footer-dark: "#1e1e1e"
typography:
  display:
    fontFamily: "JLREmeric-Regular, sans-serif"
    fontSize: "30px"
    fontWeight: 400
    lineHeight: "36px"
    letterSpacing: "normal"
  headline:
    fontFamily: "JLREmeric-Regular, sans-serif"
    fontSize: "28px"
    fontWeight: 400
    lineHeight: "33.6px"
    letterSpacing: "normal"
  title:
    fontFamily: "JLREmeric-Regular, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: "26px"
    letterSpacing: "normal"
  card-title:
    fontFamily: "JLREmeric-Regular, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "20.8px"
    letterSpacing: "1.41px"
  label:
    fontFamily: "JLREmeric-Regular, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "20.8px"
    letterSpacing: "1px"
  body:
    fontFamily: "JLREmeric-Regular, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "28.8px"
    letterSpacing: "normal"
  body-small:
    fontFamily: "jlr_emeric_extralight, sans-serif"
    fontSize: "14px"
    fontWeight: 300
    lineHeight: "22.4px"
    letterSpacing: "normal"
  utility:
    fontFamily: "HelveticaNowText-Regular, Helvetica, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "normal"
    letterSpacing: "0.35px"
rounded:
  none: "0px"
  sm: "4px"
  circle: "50%"
spacing:
  xs: "5px"
  sm: "10px"
  md: "15px"
  lg: "20px"
  xl: "30px"
  2xl: "40px"
  3xl: "60px"
components:
  button-solid:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
    padding: "6px 12px"
    typography: "{typography.body-small}"
  button-outline:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "6px 12px"
  button-outline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
  market-switcher-link:
    backgroundColor: "{colors.white}"
    textColor: "{colors.black}"
    padding: "0px 10px"
    typography: "{typography.utility}"
  footer:
    backgroundColor: "{colors.footer-dark}"
    textColor: "{colors.white}"
  filter-surface:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.ink}"
---

# Design System: JLR Media Newsroom

## Overview

**Creative North Star: "The Press Office Archive"**

A quiet, near-monochrome newsroom whose only colour is the photography. Every one of the eight sites (the `/en-gb` landing and the Range Rover, Defender, Defender Rally, Discovery, Jaguar, Jaguar TCS Racing and Classic newsrooms) runs on one Drupal theme and one `main.css`; a brand changes only its header mark, its typeface, its vehicle menu and its favicon. Layout is a Bootstrap 3 grid (15 px gutters, 30 px gaps) layered with Tailwind utilities (`tw-` prefix; `sm` 480, `md` 768, `2md` 991, `lg` 1024, `xl` 1200).

Density is editorial-to-archival: landings open with a full-width hero carousel (image, uppercase headline, date, "Find out more"), then three-column card rows (Latest News, Images, Videos) each with a "See All". Listings are working tools: a "Refine By" sidebar, a centred uppercase title, a format toggle, a numeric pager and a three-column card grid. Articles are single-column press releases with a date line, download group, body copy, "Further information" / "Notes to Editors" foot sections and an image/video pack gallery.

**Key Characteristics:**
- Ink (#0c121c) on white for all type and UI; the dark charcoal footer (#1e1e1e) closes every page.
- Uppercase, tracked labels and card titles (16 px, letter-spacing 1–1.5 px); headings in sentence case at 30 px.
- Square UI (0 px) for buttons and controls; a 4 px radius on cards/thumbnails; circles only for icon buttons.
- One soft shadow, under the sticky main nav: `rgba(0,0,0,0.1) 0 2px 6px`.
- Download, cart and share affordances on every content unit.

## Colors

A monochrome UI palette; colour enters only through photography and the brand logos.

### Primary
- **Ink** (#0c121c): all heading and body text, links, solid buttons and the hover fill of outline buttons; census roles text + primary + heading on 344 pages.

### Neutral
- **White** (#ffffff): page background (by far the largest painted area) and outline-button fill.
- **Black** (#000000): market-switcher text, icon buttons, some brand headings.
- **Graphite** (#333333): secondary body text (article copy, descriptions).
- **Slate** (#555555): muted text and metadata.
- **Rule Grey** (#d1d5db): hairline borders and dividers (border-only).
- **Mist** (#e9ecec): filter/toggle surfaces and the hover background of ghost buttons.
- **Footer Dark** (#1e1e1e): footer and dark bands.

Social brand fills (#0077b5, #1877f2, #e1306c, #4267b2) appear only as share/follow hover states; translucent black overlays (#00000099, #000000cc) sit on video posters and the fullscreen nav.

### Named Rules
**The Photography Carries Colour Rule.** No UI element is coloured; hue on a page comes from the press images and the brand logos.

## Typography

**Display / Body Font (main + Classic):** JLR Emeric Regular, with JLR Emeric ExtraLight for small descriptions (fallback `sans-serif`).
**Brand faces (same scale, swapped per sub-site):** Range Rover — Helvetica Now Text (Regular / Medium); Defender and Defender Rally — Neusa Neu (Regular / Medium; Rally headings Neusa Neu WideBold); Discovery — Avenir Next Regular with Land Rover Web (Medium / Bold) headings; Jaguar and Jaguar TCS Racing — Jaguar Exuberant (Regular / Bold).
**Utility Font:** Helvetica Now Text Regular 14 px for the top bar, market switcher and most controls on every site.

**Character:** a wide, engineered sans for the corporate voice; each brand brings its own proprietary face into an identical type scale.

### Hierarchy
- **Display** (400–700, 30 px / 36 px): page and section titles (h1/h2 "Executive Committee", "Latest News", hero titles). Weight follows the brand face (Emeric 400, Helvetica Now / Neusa 500, Jaguar Exuberant / Neusa WideBold 700).
- **Headline** (400, 28 px / 33.6 px, uppercase): hero-component titles on landings and listings.
- **Title** (400–700, 20 px / 26 px): h5 sub-heads, person names, pack titles.
- **Card title** (400, 16 px / 20.8 px, uppercase, 1–1.5 px tracking): card headings (h3.title) and dates (h4.date).
- **Body** (400, 18 px / 28.8 px on main/Classic articles; 16 px / 25.6 px on brand sites): release copy, max line around 75 ch inside a centred 8-of-12 column.
- **Body small** (300, 14 px / 22.4 px): teasers, contact descriptions, footer links.
- **Label** (400–700, 14 px / 18.2 px, uppercase): filter groups, image counts ("Images"), small headings.

Observed heading sizes 30 → 28 → 24 → 20 → 18 → 16 → 14 px; consecutive ratios are uneven, so the scale is **ad-hoc** (no modular ratio).

## Layout

- **Grid:** Bootstrap 3 `.container` + `.row`/`col-*` (15 px gutters) with Tailwind utilities on newer components; card grids are 3 columns at desktop (`md:tw-grid-cols-2 lg:tw-grid-cols-3` on the main landing), 2 at tablet, 1 on mobile.
- **Breakpoints (source CSS):** 480, 600, 768, 991/992, 1024, 1200 px; the dominant switches are `max-width: 991px` (143 rules) and `min-width: 768px`.
- **Container:** content caps at **1176 px** (cap-probe, probe width 2560; module-tier cap on every brand-site archetype); the shell is fluid (header/footer bands run edge to edge). Divergent caps for the inconsistency register: the main landing's explore-brands carousel caps at 1440 px, and the article gallery expander at 1212 px (`DESIGN.json.extensions.breakpoints.capRegister`).
- **Rhythm:** 5 px base (most frequent paddings/margins 10, 15, 30, 20, 5, 18, 8, 40, 60 px); sections separated by 40–60 px; cards by 30 px gaps.
- **Header:** a thin top bar ("JLR MEDIA" fullscreen-menu trigger, market switcher, "View n" cart, "Contact Us"), then the brand heading row (brand mark + external brand link), then the brand sub-nav (Vehicles, Brand, News, Images, Video, People, Press Kits, Tech Specs) with "Search <Brand>" at the right; the nav row is sticky with the single shadow.
- **Footer:** newsletter band (brand mark, "SUBSCRIBE TO OUR NEWSLETTER", Subscribe button), then three columns (Useful Links, Support, FOLLOW:) on the dark ground; Jaguar TCS Racing adds a partner-logo strip.

## Elevation & Depth

Flat by default. Depth is limited to the sticky navigation shadow and hairline rules; cards sit flat on white or mist.

### Shadow Vocabulary
- **Nav lift** (`box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 6px 0px`): the sticky main nav row (344 pages).
- **Hairline under** (`box-shadow: rgb(228, 232, 232) 0px 1px 0px 0px`): section header rules on listings.
- **Video poster** (`radial-gradient(rgb(119,119,119) 0, rgb(63,63,63) 66%, rgb(63,63,63) 100%)`): the only gradient, behind video placeholders.

## Shapes

Square controls (0 px) — buttons, inputs, pager, filter toggles. A 4 px radius is the one rounded value in volume (6,832 elements: thumbnails, cards, image wrappers). Circles (`50%` / `100%`) only on icon buttons and the scroll-to-top control.

## Components

### Buttons
- **Shape:** square (0 px).
- **Solid:** ink fill, white text, 6 px 12 px, 14 px text (footer social buttons, hero "Find out more", "Subscribe").
- **Outline / ghost:** white or transparent fill with ink text; hover inverts to ink fill + white text (285 observations) or to mist (#e9ecec) for ghost buttons (108).
- **Social / share:** ink square icon buttons; hover fills with the network colour (Instagram #e1306c, Facebook #4267b2).

### Cards
- **News / image / video card:** photo (4 px radius, lazy-loaded), date (uppercase label), uppercase title, optional teaser, then a share/download/cart row. Flat, no shadow, no border.
- **Pack tile:** square photo tile with a centred count ("7 IMAGES") overlay; download dropdown (Hi Res / Low Res) and "View larger image" on hover.
- **People card:** portrait (2:3), uppercase name, role, "Read more" chevron.
- **Contact region card:** country name, "View … press office contacts", arrow.

### Inputs / Filters
- **Refine By:** left sidebar of collapsible groups (Vehicles → Current / Past / Classic, Tags, People, Model Year, Format/View) with checkbox options; result count as an h1 ("659 Results").
- **Pager:** prev / numeric input / "of N" / next, square buttons.

### Navigation
- Top bar in Helvetica Now Text 14 px; brand sub-nav in the brand face; the "JLR MEDIA" trigger opens a fullscreen navigation overlay with a poster image and the brand list (Range Rover, Defender, Discovery, Jaguar, Classic, Corporate).
- Mobile: brand vehicle menu as its own page (`/mobile-vehicle-menu`: grouped vehicle cards — Current / Past / Classic).

### Signature: Hero carousel
Full-width slick carousel of press images; under each slide an info box with uppercase title, teaser, date and a "Find out more" button; dots below, share icons at the right.

## Do's and Don'ts

### Do:
- **Do** keep every UI element in ink, white and the neutral greys (#0c121c, #ffffff, #333333, #555555, #d1d5db, #e9ecec, #1e1e1e).
- **Do** swap only the typeface, header mark, vehicle menu and favicon per brand; keep the scale (30 / 28 / 20 / 16 / 14 px) identical.
- **Do** set card titles and labels uppercase with 1–1.5 px tracking.
- **Do** give every asset its download / share / cart affordances.

### Don't:
- **Don't** round buttons or inputs; the only radii are 4 px on imagery and circles on icon buttons.
- **Don't** add shadows beyond the sticky-nav lift.
- **Don't** introduce gradients other than the video-poster radial.
