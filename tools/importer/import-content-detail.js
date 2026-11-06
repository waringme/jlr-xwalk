/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import mediaImageParser from './parsers/media-image.js';
import mediaActionsParser from './parsers/media-actions.js';
import quoteCenteredParser from './parsers/quote-centered.js';
import columnsPressImageParser from './parsers/columns-press-image.js';
import columnsTextParser from './parsers/columns-text.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import paginationParser from './parsers/pagination.js';
import tablePricingParser from './parsers/table-pricing.js';

// TRANSFORMER IMPORTS
import jlrCleanupTransformer from './transformers/jlr-cleanup.js';
import jlrSectionsTransformer from './transformers/jlr-sections.js';

// PAGE TEMPLATE CONFIGURATION (embedded from page-templates.json)
const PAGE_TEMPLATE = {
  "name": "content-detail",
  "description": "News article: title/date, hero press image with action toolbar, info box, long body with media figures, footnotes table, related image packs, previous/next",
  "urls": [
    "https://media.jlr.com/defender/en-gb/news/2026/07/tough-luxury-new-defender-vertex-leads-design-and-accessory-update",
    "https://media.jlr.com/classic/en-gb/news/2024/07/discovery-celebrates-35-years-ingenious-versatility-35th-edition-new-engine-and-summer",
    "https://media.jlr.com/classic/en-gb/news/2024/08/defender-marks-70-years-its-landmark-humanitarian-charity-partnership-british-red",
    "https://media.jlr.com/classic/en-gb/news/2024/08/introducing-classic-defender-v8-works-bespoke",
    "https://media.jlr.com/classic/en-gb/news/2025/01/jaguar-land-rover-classic-appoints-new-director-dominic-elms",
    "https://media.jlr.com/classic/en-gb/news/2025/05/return-icon-land-rover-classic-launches-classic-defender-v8-soft-top",
    "https://media.jlr.com/classic/en-gb/news/2025/07/defender-octa-black-tough-luxury-4x4-rock-star",
    "https://media.jlr.com/classic/en-gb/news/2025/12/classic-defender-v8-defender-octa-colours",
    "https://media.jlr.com/classic/en-gb/news/2026/06/colour-changing-classic-defender-v8-family-introduces-new-double-cab-option",
    "https://media.jlr.com/classic/en-gb/news/2026/09/defenders-classic-division-launches-new-upgrade-programme-crowned-works-v8-conversion",
    "https://media.jlr.com/defender/en-gb/news/2026/07/defender-powers-goodwood-festival-speed-dakar-winning-d7x-r",
    "https://media.jlr.com/defender/en-gb/news/2026/07/range-rover-electric-make-public-debut-goodwood-festival-speed-2026",
    "https://media.jlr.com/defender/en-gb/news/2026/08/defender-octa-launches-jcb-hydromax-land-speed-record-glory",
    "https://media.jlr.com/defender/en-gb/news/2026/09/defender-reveals-next-generation-military-vehicle-modern-era-introducing-defender-wolf",
    "https://media.jlr.com/defender/en-gb/news/2026/09/defender-unveils-three-new-wolf-series-ii-variants-defence-show",
    "https://media.jlr.com/defender/en-gb/news/2026/09/defenders-classic-division-launches-new-upgrade-programme-crowned-works-v8-conversion",
    "https://media.jlr.com/defenderrally/en-gb/news/2026/01/defender-rally-make-history-debut-dakar-victory",
    "https://media.jlr.com/defenderrally/en-gb/news/2026/01/defender-ready-debut-dakar-rally-2026-world-rally-raid-championship-begins",
    "https://media.jlr.com/defenderrally/en-gb/news/2026/08/defender-dakar-road-legal-evolution-dakar-rally-winner",
    "https://media.jlr.com/defenderrally/en-gb/news/2026/10/rokas-baciuska-and-oriol-vidal-crowned-2026-fia-rally-raid-stock-drivers-and-co",
    "https://media.jlr.com/discovery/en-gb/news/2024/07/discovery-celebrates-35-years-ingenious-versatility-35th-edition-new-engine-and-summer",
    "https://media.jlr.com/discovery/en-gb/news/2025/05/discovery-automotive-top-dog-goodwoof-2025",
    "https://media.jlr.com/discovery/en-gb/news/2025/05/discovery-gears-luxurious-road-trips-new-tempest-and-gemini-editions",
    "https://media.jlr.com/discovery/en-gb/news/2025/06/discovery-sport-gets-more-dynamic-luxurious-and-individual-new-metropolitan-and",
    "https://media.jlr.com/discovery/en-gb/news/2026/07/discovery-creates-new-landmark-seven-seat-family-suv",
    "https://media.jlr.com/en-gb/news/2025/12/jaguar-celebrates-90th-anniversary",
    "https://media.jlr.com/en-gb/news/2026/07/discovery-creates-new-landmark-seven-seat-family-suv",
    "https://media.jlr.com/en-gb/news/2026/09/defender-unveils-three-new-wolf-series-ii-variants-defence-show",
    "https://media.jlr.com/en-gb/news/2026/09/defenders-classic-division-launches-new-upgrade-programme-crowned-works-v8-conversion",
    "https://media.jlr.com/en-gb/news/2026/09/range-rover-sport-electric-tuned-visceral-dynamism",
    "https://media.jlr.com/jaguar/en-gb/news/2026/07/championing-originality-jaguar-and-royal-college-art-announce-jaguar-awards-winners",
    "https://media.jlr.com/jaguar/en-gb/news/2026/07/jaguar-type-01-prototype-lines-dynamic-uk-premiere-goodwood-festival-speed",
    "https://media.jlr.com/jaguar/en-gb/news/2026/10/jaguar-debuts-exclusive-chromatic-moments-programme-british-museum-ball",
    "https://media.jlr.com/jaguar/en-gb/news/2026/10/jaguar-knightsbridge-permanent-expression-new-era",
    "https://media.jlr.com/jaguar/en-gb/news/2026/10/jaguar-type-01-new-era-begins",
    "https://media.jlr.com/jaguar-tcs-racing/en-gb/news/2019/02/new-range-rover-evoque-named-gqs-best-compact-suv",
    "https://media.jlr.com/jaguar-tcs-racing/en-gb/news/2019/02/new-range-rover-velar-svautobiography-dynamic-edition-refined-power",
    "https://media.jlr.com/jaguar-tcs-racing/en-gb/news/2024/07/jaguar-tcs-racing-are-2024-abb-fia-formula-e-teams-world-champions",
    "https://media.jlr.com/jaguar-tcs-racing/en-gb/news/2024/10/jaguar-tcs-racing-unveil-prototype-jaguar-i-type-7-ahead-202425-abb-fia-formula-e-pre",
    "https://media.jlr.com/jaguar-tcs-racing/en-gb/news/2024/10/jamie-chadwick-and-lilou-wadoux-drive-jaguar-tcs-racing-womens-test",
    "https://media.jlr.com/jaguar-tcs-racing/en-gb/news/2024/12/jaguar-tcs-racing-launch-all-new-jaguar-i-type-7-sao-paulo-begin-202425-abb-fia",
    "https://media.jlr.com/range-rover/en-gb/news/2026/07/introducing-range-rover-sport-electric-pinnacle-sporting-luxury",
    "https://media.jlr.com/range-rover/en-gb/news/2026/07/range-rover-previews-fifth-member-family-introducing-range-rover-gt",
    "https://media.jlr.com/range-rover/en-gb/news/2026/09/range-rover-electric-new-era-original-luxury-suv",
    "https://media.jlr.com/range-rover/en-gb/news/2026/09/range-rover-sport-electric-tuned-visceral-dynamism",
    "https://media.jlr.com/range-rover/en-gb/node/29462"
  ],
  "blocks": [
    {
      "name": "media-image",
      "instances": [
        ".page-news > .container.news-type .image-holder:has(.field--name-field-hero-image)",
        ".page-news .field--item > .container.full-image-video",
        ".page-news .field--item > .container.three-flush",
        ".page-news .field--item > .container.hero-image-strip",
        ".page-news .field--item > .container:has(> .image-gallery-comp)",
        ".page-feature-page > .container.campaign-page-type .image-holder:has(.field--name-field-hero-image)",
        ".page-feature-page .field--item > .container.full-image-video",
        ".page-feature-page .field--item > .container.three-flush",
        ".page-feature-page .field--item > .container.hero-image-strip"
      ]
    },
    {
      "name": "media-actions",
      "instances": [
        ".page-news .info-box .download-group"
      ]
    },
    {
      "name": "quote-centered",
      "instances": [
        ".page-news .field--item > .container.blockquote-template",
        ".page-feature-page .field--item > .container.blockquote-template"
      ]
    },
    {
      "name": "columns-press-image",
      "instances": [
        ".page-news .field--item > .container:has(> .row.lightback)",
        ".page-news .field--item > .container:not(.hero-image-strip):not(.full-image-video):has(> .row.text-image > .col-md-6)",
        ".page-news .field--item > .container.image-with-inset-text",
        ".page-feature-page .field--item > .container:has(> .row.lightback)",
        ".page-feature-page .field--item > .container:not(.hero-image-strip):not(.full-image-video):has(> .row.text-image > .col-md-6)"
      ]
    },
    {
      "name": "columns-text",
      "instances": [
        ".page-news > .wrapper.keyline"
      ]
    },
    {
      "name": "cards-gallery",
      "instances": [
        ".related-content-packs section.jlr-tabs__block-wrapper"
      ]
    },
    {
      "name": "pagination",
      "instances": [
        ".wrapper.strip .pager-btn-group"
      ]
    },
    {
      "name": "table-pricing",
      "instances": [
        ".page-news .field--item > .container.wysiwyg table",
        ".page-feature-page .field--item .container.wysiwyg table"
      ]
    }
  ],
  "sections": [
    {
      "id": "section-1",
      "name": "Hero image and article info",
      "selector": [
        ".page-news > .container.news-type:has(.image-holder)",
        ".page-news > .container.news-type",
        ".page-feature-page > .container.campaign-page-type"
      ],
      "style": "centered",
      "blocks": [
        "media-image",
        "media-actions"
      ],
      "defaultContent": [
        ".page-news .info-box .title-holder",
        ".page-news .info-box .upper-title-description"
      ]
    },
    {
      "id": "section-2",
      "name": "Article body: highlights, quote, Defender Vertex",
      "selector": [
        ".page-news > .content",
        ".page-news .field--name-field-content",
        ".page-feature-page > .content.feature-page-content"
      ],
      "style": null,
      "blocks": [
        "quote-centered",
        "columns-press-image",
        "table-pricing",
        "media-image"
      ],
      "defaultContent": [
        ".page-news .field--item > .container.wysiwyg",
        ".page-news .field--item > .subheading-template"
      ]
    },
    {
      "id": "section-3",
      "name": "Callout: Extended Exterior Pack",
      "selector": [
        ".page-news .field--name-field-content > .field--item:has(> .title-block-template)"
      ],
      "style": "light-grey, centered",
      "blocks": [],
      "defaultContent": [
        ".page-news .field--item > .title-block-template"
      ]
    },
    {
      "id": "section-4",
      "name": "Article body: Trophy Edition, OCTA, colours, six-seat, accessories, connectivity",
      "selector": [
        ".page-news .field--name-field-content > .field--item:has(> .title-block-template) ~ .field--item:not(:has(> .title-block-template)):not(:has(> .background-wrapper))",
        ".page-news .field--name-field-content > .field--item:has(> .title-block-template) + .field--item"
      ],
      "style": null,
      "blocks": [
        "columns-press-image",
        "media-image",
        "table-pricing"
      ],
      "defaultContent": [
        ".page-news .field--item > .container.wysiwyg",
        ".page-news .field--item > .subheading-template"
      ]
    },
    {
      "id": "section-5",
      "name": "Callout: Hey Land Rover",
      "selector": [
        ".page-news .field--name-field-content > .field--item:has(> .title-block-template) ~ .field--item:has(> .title-block-template)"
      ],
      "style": "light-grey, centered",
      "blocks": [],
      "defaultContent": [
        ".page-news .field--item > .title-block-template"
      ]
    },
    {
      "id": "section-6",
      "name": "Article body: Technology Pack and updated powertrains",
      "selector": [
        ".page-news .field--name-field-content > .field--item:has(> .title-block-template) ~ .field--item:has(> .title-block-template) ~ .field--item:not(:has(> .title-block-template)):not(:has(> .background-wrapper))",
        ".page-news .field--name-field-content > .field--item:has(> .title-block-template) ~ .field--item:has(> .title-block-template) + .field--item"
      ],
      "style": null,
      "blocks": [
        "columns-press-image",
        "table-pricing",
        "media-image"
      ],
      "defaultContent": [
        ".page-news .field--item > .container.wysiwyg",
        ".page-news .field--item > .subheading-template"
      ]
    },
    {
      "id": "section-7",
      "name": "Further information and Notes to Editors",
      "selector": [
        ".page-news > .wrapper.keyline",
        ".wrapper.keyline"
      ],
      "style": null,
      "blocks": [
        "columns-text"
      ],
      "defaultContent": []
    },
    {
      "id": "section-8",
      "name": "Related image packs",
      "selector": [
        ".region-content > .wrapper-background.related-content-packs",
        ".wrapper-background.related-content-packs"
      ],
      "style": "dark, centered",
      "blocks": [
        "cards-gallery"
      ],
      "defaultContent": [
        ".related-content-packs .jlr-tabs__list"
      ]
    },
    {
      "id": "section-9",
      "name": "Previous / Next article pager",
      "selector": [
        ".region-content > .wrapper.strip:has(.pager-btn-group)",
        ".wrapper.strip.rr-lightcoolgrey"
      ],
      "style": null,
      "blocks": [
        "pagination"
      ],
      "defaultContent": []
    }
  ]
};

// PARSER REGISTRY
const parsers = {
  'media-image': mediaImageParser,
  'media-actions': mediaActionsParser,
  'quote-centered': quoteCenteredParser,
  'columns-press-image': columnsPressImageParser,
  'columns-text': columnsTextParser,
  'cards-gallery': cardsGalleryParser,
  'pagination': paginationParser,
  'table-pricing': tablePricingParser,
};

// TRANSFORMER REGISTRY (cleanup first, then sections)
const transformers = [
  jlrCleanupTransformer,
  jlrSectionsTransformer,
];

// Icon-only links the importer preprocessing would delete (it removes any <a>
// without text before transformers/parsers run). The parsers rewrite the final
// labels ("Download", "High-Res" / "Low-Res", "Previous" / "Next"), so a
// placeholder text is enough. Share / cart / favourite widgets are removed later
// by jlr-cleanup or filtered out by the parsers.
const ICON_ONLY_LINK_SELECTORS = [
  // download buttons (hero, info-box toolbar, press images, pack cards)
  'a.jlr-download-btn',
  'a.download',
  'a.new-share__hero-download',
  '.download-group a',
  '.action-icons a',
  // hi-res / low-res dropdown entries
  '.dropdown-menu a',
  // share / cart / favourite icon links
  'a.new-share__btn',
  'a.new-share__link',
  'a.cart',
  'a[class*="favourite"]',
  'a[class*="favorite"]',
  'a[class*="wishlist"]',
  // previous / next pager arrows
  '.pager-btn-group a',
  '.pager a',
  // related pack cards
  '.related-content-packs a',
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
