/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselFeaturedNewsParser from './parsers/carousel-featured-news.js';
import socialLinksParser from './parsers/social-links.js';
import cardsNewsParser from './parsers/cards-news.js';
import cardsGalleryParser from './parsers/cards-gallery.js';

// TRANSFORMER IMPORTS
import jlrCleanupTransformer from './transformers/jlr-cleanup.js';
import jlrSectionsTransformer from './transformers/jlr-sections.js';

// PAGE TEMPLATE CONFIGURATION (embedded from page-templates.json)
const PAGE_TEMPLATE = {
  "name": "brand-landing",
  "description": "Brand sub-site home: featured-news hero carousel with action rail, social row, Latest News card grid, Images and Videos pack-card rows",
  "urls": [
    "https://media.jlr.com/defender/en-gb",
    "https://media.jlr.com/classic/en-gb",
    "https://media.jlr.com/defenderrally/en-gb",
    "https://media.jlr.com/discovery/en-gb",
    "https://media.jlr.com/jaguar/en-gb",
    "https://media.jlr.com/jaguar-tcs-racing/en-gb",
    "https://media.jlr.com/range-rover/en-gb"
  ],
  "blocks": [
    {
      "name": "carousel-featured-news",
      "instances": [
        ".slider-home-page",
        ".view-home-page-slider"
      ]
    },
    {
      "name": "social-links",
      "instances": [
        ".follow-component.social-bar__home",
        ".social-bar__home"
      ]
    },
    {
      "name": "cards-news",
      "instances": [
        ".view-display-id-latest_news"
      ]
    },
    {
      "name": "cards-gallery",
      "instances": [
        ".view-display-id-latest_image_packs",
        ".view-display-id-latest_video_packs"
      ]
    }
  ],
  "sections": [
    {
      "id": "section-1",
      "name": "Featured news carousel",
      "selector": [
        ".home-page > .container.stagger-init",
        ".container.stagger-init"
      ],
      "style": null,
      "blocks": [
        "carousel-featured-news"
      ],
      "defaultContent": []
    },
    {
      "id": "section-2",
      "name": "Social follow strip",
      "selector": [
        ".home-page > .wrapper-background:has(.social-bar__home)",
        ".home-page > div[class=\"wrapper-background\"]"
      ],
      "style": null,
      "blocks": [
        "social-links"
      ],
      "defaultContent": []
    },
    {
      "id": "section-3",
      "name": "Latest News",
      "selector": [
        ".home-page > .wrapper-background.modern-news.modern__wrapper-top",
        ".wrapper-background.modern-news:has(.view-display-id-latest_news)"
      ],
      "style": null,
      "blocks": [
        "cards-news"
      ],
      "defaultContent": [
        ".modern-news.modern__wrapper-top .modern-news__link-wrap > h2",
        ".modern-news.modern__wrapper-top .modern-news__see-all"
      ]
    },
    {
      "id": "section-4",
      "name": "Images",
      "selector": [
        ".home-page > .wrapper-background.modern-lightgrey.modern-news",
        ".wrapper-background.modern-news:has(.view-display-id-latest_image_packs)"
      ],
      "style": "light-grey",
      "blocks": [
        "cards-gallery"
      ],
      "defaultContent": [
        ".modern-lightgrey.modern-news .modern-news__link-wrap > h2",
        ".modern-lightgrey.modern-news .modern-news__see-all"
      ]
    },
    {
      "id": "section-5",
      "name": "Videos",
      "selector": [
        ".home-page > .wrapper-background.white.modern-news:not(.modern__wrapper-top)",
        ".wrapper-background.modern-news:has(.view-display-id-latest_video_packs)"
      ],
      "style": null,
      "blocks": [
        "cards-gallery"
      ],
      "defaultContent": [
        ".wrapper-background.white.modern-news:not(.modern__wrapper-top) .modern-news__link-wrap > h2",
        ".wrapper-background.white.modern-news:not(.modern__wrapper-top) .modern-news__see-all"
      ]
    }
  ]
};

// PARSER REGISTRY
const parsers = {
  'carousel-featured-news': carouselFeaturedNewsParser,
  'social-links': socialLinksParser,
  'cards-news': cardsNewsParser,
  'cards-gallery': cardsGalleryParser,
};

// TRANSFORMER REGISTRY (cleanup first, then sections)
const transformers = [
  jlrCleanupTransformer,
  jlrSectionsTransformer,
];

// Icon-only links the importer preprocessing would delete (it removes any <a>
// without text before transformers/parsers run). The parsers rewrite the final
// labels ("Link to Instagram", "Download"), so a placeholder text is enough.
const ICON_ONLY_LINK_SELECTORS = [
  '.homepage-social-icons a',
  '.social-bar a',
  'a.new-share__btn',
  'a.jlr-download-btn',
  'a.new-share__hero-download',
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
