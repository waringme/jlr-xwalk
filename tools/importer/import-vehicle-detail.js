/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import mediaImageParser from './parsers/media-image.js';
import columnsVehicleIntroParser from './parsers/columns-vehicle-intro.js';
import mediaSubnavParser from './parsers/media-subnav.js';
import cardsNewsParser from './parsers/cards-news.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import paginationParser from './parsers/pagination.js';

// TRANSFORMER IMPORTS
import jlrCleanupTransformer from './transformers/jlr-cleanup.js';
import jlrSectionsTransformer from './transformers/jlr-sections.js';

// PAGE TEMPLATE CONFIGURATION (embedded from page-templates.json)
const PAGE_TEMPLATE = {
  "name": "vehicle-detail",
  "description": "Vehicle page: vehicle hero with thumbnails over a filterable media archive (content-type tabs, Refine By sidebar, media cards, pager)",
  "urls": [
    "https://media.jlr.com/defender/en-gb/vehicle/defender-110",
    "https://media.jlr.com/classic/en-gb/vehicle/1957-xkss",
    "https://media.jlr.com/classic/en-gb/vehicle/2016-xkss",
    "https://media.jlr.com/classic/en-gb/vehicle/c-type",
    "https://media.jlr.com/classic/en-gb/vehicle/d-type",
    "https://media.jlr.com/classic/en-gb/vehicle/discovery-1",
    "https://media.jlr.com/classic/en-gb/vehicle/discovery-2",
    "https://media.jlr.com/classic/en-gb/vehicle/discovery-3",
    "https://media.jlr.com/classic/en-gb/vehicle/e-type",
    "https://media.jlr.com/classic/en-gb/vehicle/freelander-2",
    "https://media.jlr.com/classic/en-gb/vehicle/freelander",
    "https://media.jlr.com/classic/en-gb/vehicle/jaguar-mk-vii",
    "https://media.jlr.com/classic/en-gb/vehicle/jaguar-mk-x",
    "https://media.jlr.com/classic/en-gb/vehicle/mk-ii",
    "https://media.jlr.com/classic/en-gb/vehicle/range-rover-%282001-2012%29",
    "https://media.jlr.com/classic/en-gb/vehicle/range-rover-classic",
    "https://media.jlr.com/classic/en-gb/vehicle/range-rover-p38a",
    "https://media.jlr.com/classic/en-gb/vehicle/range-rover-sport-%282004-2013%29",
    "https://media.jlr.com/classic/en-gb/vehicle/series-i",
    "https://media.jlr.com/classic/en-gb/vehicle/series-ii",
    "https://media.jlr.com/classic/en-gb/vehicle/series-iii",
    "https://media.jlr.com/classic/en-gb/vehicle/ss",
    "https://media.jlr.com/classic/en-gb/vehicle/ss100",
    "https://media.jlr.com/classic/en-gb/vehicle/xj13",
    "https://media.jlr.com/classic/en-gb/vehicle/xj220",
    "https://media.jlr.com/classic/en-gb/vehicle/xjr9",
    "https://media.jlr.com/classic/en-gb/vehicle/xk140",
    "https://media.jlr.com/defender/en-gb/vehicle/defender-130",
    "https://media.jlr.com/defender/en-gb/vehicle/defender-%281990-2016%29",
    "https://media.jlr.com/defender/en-gb/vehicle/defender-90",
    "https://media.jlr.com/defenderrally/en-gb/vehicle/defender-d7x-r",
    "https://media.jlr.com/discovery/en-gb/vehicle/discovery-4",
    "https://media.jlr.com/discovery/en-gb/vehicle/discovery-sport",
    "https://media.jlr.com/discovery/en-gb/vehicle/discovery-vision-concept",
    "https://media.jlr.com/discovery/en-gb/vehicle/discovery",
    "https://media.jlr.com/jaguar/en-gb/vehicle/type-01",
    "https://media.jlr.com/jaguar-tcs-racing/en-gb/vehicle/i-pace-etrophy",
    "https://media.jlr.com/jaguar-tcs-racing/en-gb/vehicle/i-type-2",
    "https://media.jlr.com/jaguar-tcs-racing/en-gb/vehicle/i-type-3",
    "https://media.jlr.com/jaguar-tcs-racing/en-gb/vehicle/i-type-4",
    "https://media.jlr.com/jaguar-tcs-racing/en-gb/vehicle/i-type-5",
    "https://media.jlr.com/jaguar-tcs-racing/en-gb/vehicle/i-type-6",
    "https://media.jlr.com/range-rover/en-gb/vehicle/range_e",
    "https://media.jlr.com/range-rover/en-gb/vehicle/range-rover-%282012-2021%29",
    "https://media.jlr.com/range-rover/en-gb/vehicle/range-rover-electric",
    "https://media.jlr.com/range-rover/en-gb/vehicle/range-rover-evoque-%282010-2018%29",
    "https://media.jlr.com/range-rover/en-gb/vehicle/range-rover-evoque",
    "https://media.jlr.com/range-rover/en-gb/vehicle/range-rover-gt",
    "https://media.jlr.com/range-rover/en-gb/vehicle/range-rover-lrx",
    "https://media.jlr.com/range-rover/en-gb/vehicle/range-rover-sentinel",
    "https://media.jlr.com/range-rover/en-gb/vehicle/range-rover-sport-%282013-2022%29",
    "https://media.jlr.com/range-rover/en-gb/vehicle/range-rover-sport-electric",
    "https://media.jlr.com/range-rover/en-gb/vehicle/range-rover-sport-sv",
    "https://media.jlr.com/range-rover/en-gb/vehicle/range-rover-sport-svr",
    "https://media.jlr.com/range-rover/en-gb/vehicle/range-rover-sport",
    "https://media.jlr.com/range-rover/en-gb/vehicle/range-rover-sv",
    "https://media.jlr.com/range-rover/en-gb/vehicle/range-rover-svautobiography-dynamic",
    "https://media.jlr.com/range-rover/en-gb/vehicle/range-rover-svautobiography",
    "https://media.jlr.com/range-rover/en-gb/vehicle/range-rover-velar-svautobiography-dynamic-edition",
    "https://media.jlr.com/range-rover/en-gb/vehicle/range-rover-velar",
    "https://media.jlr.com/range-rover/en-gb/vehicle/range-rover",
    "https://media.jlr.com/range-rover/en-gb/vehicle/range-stormer"
  ],
  "blocks": [
    {
      "name": "media-image",
      "instances": [
        ".region-content > .vehicle-page > .container.vehicle .vehicle-hero .image-top",
        ".vehicle-page > .container.vehicle .image-top"
      ]
    },
    {
      "name": "columns-vehicle-intro",
      "instances": [
        ".region-content > .vehicle-page > .container.vehicle .vehicle-hero .caption-holder",
        ".vehicle-page > .container.vehicle .vehicle-name.caption-holder"
      ]
    },
    {
      "name": "media-subnav",
      "instances": [
        ".vehicle-page .wrapper-search-nav ul.nav-search",
        ".search-menu ul.nav-search"
      ]
    },
    {
      "name": "cards-news",
      "instances": [
        ".nav-search-bg #my-tab-content .card-grid:has(> .news-box)",
        "#my-tab-content .card-grid:has(.modern-news__panel)"
      ]
    },
    {
      "name": "cards-gallery",
      "instances": [
        "#my-tab-content .card-grid:has(> .gallery-item)"
      ]
    },
    {
      "name": "pagination",
      "instances": [
        ".nav-search-bg #colMain .bottom-pager .new-grid__pager",
        "#colMain .search-pager.new-grid__pager"
      ]
    }
  ],
  "sections": [
    {
      "id": "section-1",
      "name": "Vehicle hero with thumbnails",
      "selector": [
        ".region-content > .vehicle-page > .container.vehicle",
        ".vehicle-page > .container.vehicle"
      ],
      "style": null,
      "blocks": [
        "media-image",
        "columns-vehicle-intro"
      ],
      "defaultContent": []
    },
    {
      "id": "section-2",
      "name": "Results count and content-type tabs",
      "selector": [
        ".region-content > .vehicle-page > div:has(> .wrapper-search-nav)",
        ".vehicle-page > div:not(.vehicle-page):not(.container):has(.nav-search)"
      ],
      "style": null,
      "blocks": [
        "media-subnav"
      ],
      "defaultContent": [
        ".vehicle-page > div:has(> .wrapper-search-nav) > .container.search-page:not(.search-menu) h1"
      ]
    },
    {
      "id": "section-3",
      "name": "Media archive grid and pager",
      "selector": [
        ".region-content > .vehicle-page > .vehicle-page",
        ".vehicle-page:has(> .wrapper.strip.nav-search-bg)"
      ],
      "style": "light-grey",
      "blocks": [
        "cards-news",
        "cards-gallery",
        "pagination"
      ],
      "defaultContent": []
    }
  ],
  "notes": [
    "media-subnav (content-type tabs): live tabs link to '#' (client-side). Interim coordinator decision: author each tab as a link (label + count, e.g. 'News (19)') to the SAME brand's listing page for that type, brand = first path segment of the vehicle URL: News -> the vehicle page itself (so it renders active); Images -> /<brand>/en-gb/images; Image Packs -> /<brand>/en-gb/image-packs; Video/Videos -> /<brand>/en-gb/videos; Video Packs -> /<brand>/en-gb/video-packs; other tabs (Press Kit, Tech Specs, ...) -> the closest brand listing (/<brand>/en-gb/press-kit, /<brand>/en-gb/tech-specs) else the vehicle page. Revisit with the listings feature.",
    "Tab count varies 1-7 across the 62 pages; keep every tab present in ul.nav-search, in source order.",
    "Not content: header, footer, newsletter band (section.newsletter-band), div.container.footer__racing, #addtoany share overlays, Refine By button / #taxonomies / #colPush facet sidebar, geo/market dialog (.ui-dialog, #drupal-modal), per-card favourite/share buttons.",
    "Section 2 H1 '<n> Results' is default content authored as H2 (page H1 is the model name in columns-vehicle-intro).",
    "8 of 62 pages (e.g. classic/d-type, jaguar-tcs-racing/i-pace-etrophy) have no .image-top/.caption-holder in visual trees; media-image/columns-vehicle-intro simply do not match there. cards-news selectors require .news-box items; if a page's active tab is not News the grid stays unmapped (flag in import validation).",
    "Import: when the first/active tab is not News (e.g. classic/e-type, discovery/discovery-vision-concept: Images) the grid holds .gallery-item tiles; mapped to cards-gallery (default option) via #my-tab-content .card-grid:has(> .gallery-item). Vehicles with no media ('0 Result', empty ul.nav-search) emit no media-subnav block."
  ]
};

// PARSER REGISTRY
const parsers = {
  'media-image': mediaImageParser,
  'columns-vehicle-intro': columnsVehicleIntroParser,
  'media-subnav': mediaSubnavParser,
  'cards-news': cardsNewsParser,
  'cards-gallery': cardsGalleryParser,
  'pagination': paginationParser,
};

// TRANSFORMER REGISTRY (cleanup first, then sections)
const transformers = [
  jlrCleanupTransformer,
  jlrSectionsTransformer,
];

// Icon-only links the importer preprocessing would delete (it removes any <a>
// without text before transformers/parsers run). Parsers rewrite final labels
// (hero "Download", listing pager arrows); share / favourite widgets are removed
// later by jlr-cleanup or filtered out by the parsers.
const ICON_ONLY_LINK_SELECTORS = [
  // hero download button
  'a.jlr-download-btn',
  'a.download',
  'a.new-share__hero-download',
  '.action-icons a',
  '.dropdown-menu a',
  // share / cart / favourite icon links on hero and cards
  'a.new-share__btn',
  'a.new-share__link',
  'a.cart',
  'a[class*="favourite"]',
  'a[class*="favorite"]',
  'a[class*="wishlist"]',
  // media archive tile download dropdowns
  '.content-foot a',
  // listing pager arrows
  '.new-grid__pager a',
  '.pager a',
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((fn) => {
    try {
      fn(hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    });
  });
  return pageBlocks;
}

export default {
  onLoad: async ({ document }) => {
    document.querySelectorAll(ICON_ONLY_LINK_SELECTORS.join(',')).forEach((link) => {
      if (link.textContent.trim() || link.querySelector('img, picture')) return;
      const label = (link.getAttribute('aria-label')
        || link.getAttribute('title')
        || link.className
        || 'link').trim();
      link.textContent = label;
    });
  },

  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (!parser) return;
      try {
        parser(block.element, { document, url, params });
      } catch (e) {
        console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
      }
    });

    executeTransformers('afterTransform', main, payload);

    main.appendChild(document.createElement('hr'));
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
