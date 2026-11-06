# AEM content package — media.jlr.com en-gb (xwalk)

`dist/jlr-xwalk-content-1.0.0.zip` (≈ 260 MB) is a FileVault content package for AEM as a Cloud
Service (Universal Editor / xwalk), built from the imported pages in `content/**/*.plain.html`.

## What it contains

| | count | where |
|---|---|---|
| Pages | 115 (7 brand landings, 46 news articles, 62 vehicle pages) | `/content/jlr-xwalk/<brand>/en-gb/…` |
| Structural parent pages | 67 (e.g. `/content/jlr-xwalk/defender`, `…/en-gb/news/2026`) | installed in `merge` mode — never overwrite an existing page |
| Images | 720 | `/content/dam/jlr-xwalk/media/<date>/<id>/<rendition>-<file>` (`dam:Asset`, original rendition) |

- Page XML comes from the converters the AEM import uses (`html2md` → `md2jcr`) against this repo's
  block models (`component-*.json`), so every block maps to its Universal Editor component.
- Internal links to en-gb pages point at `/content/jlr-xwalk/…` and are mapped back to `/` by
  `paths.json` (added to the code repo with this package). Links to other locales and `/corporate`
  stay on `https://media.jlr.com`.
- `filter.xml`: each page replaces only itself and its `jcr:content`, never its child pages. Parents
  merge; `/content/dam/jlr-xwalk/media` updates. Re-installing a newer build is safe.

## Install (when ready — nothing has been uploaded)

1. Deploy the code branch first (blocks, `component-*.json`, `paths.json`), so the components exist.
2. AEM author → Tools → Deployment → Packages → Upload `jlr-xwalk-content-1.0.0.zip` → Install.
   DAM Update Asset processes the images after install (renditions, metadata).
3. Open a page in Universal Editor, e.g. `/content/jlr-xwalk/defender/en-gb`, then preview / publish.

## Known gaps (review)

- **51 images are `blob:` URLs.** These are lazy-loaded images the importer captured before they
  resolved, so they could not be downloaded. They are listed in `build-report.json`
  (`assets.blobImages`); re-import those pages, or fix the parser to read `data-src`.
- **Pages not yet imported:** media listings, image/video pack pages, directors/plc/press-kit grids,
  person, contact pages, legal pages, mobile vehicle menus and the main `/en-gb` landing. Links to
  them resolve once their templates are imported and the package is rebuilt.
- **Fonts:** the licensed brand fonts are not packaged. The blocks use open substitutes, with the
  brand family name listed first in each font stack.

## Rebuild

```bash
node tools/jcr-package/build-package.mjs --version 1.0.1   # downloads are cached in .cache/
```

`build-report.json` lists converted pages, structural parents, packaged/failed assets and the blob gaps.
