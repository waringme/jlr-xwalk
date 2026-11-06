/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // tools/importer/import-brand-landing.js
  var import_brand_landing_exports = {};
  __export(import_brand_landing_exports, {
    default: () => import_brand_landing_default
  });

  // tools/importer/parsers/carousel-featured-news.js
  function parse(element, { document }) {
    const cleanHref = (a) => a && a.getAttribute("href") ? a.getAttribute("href").trim() : "";
    const slides = Array.from(element.querySelectorAll(".hero-component")).filter((slide) => !slide.classList.contains("slick-cloned"));
    if (!slides.length) {
      const existing = element.querySelector("table");
      if (existing) element.replaceWith(existing);
      return;
    }
    const cells = [];
    slides.forEach((slide) => {
      const titleEl = slide.querySelector(".hero-component__title, .bt-hero-title");
      const titleLink = titleEl ? titleEl.querySelector("a") : null;
      const ctaLink = slide.querySelector("a.hero-component__button, a.btn-find-out-more");
      const imageLink = slide.querySelector(".home-slider-responsive a");
      const href = cleanHref(titleLink) || cleanHref(ctaLink) || cleanHref(imageLink);
      const imageFrag = document.createDocumentFragment();
      const img = slide.querySelector(".home-slider-responsive img, .field--name-field-media-image img");
      if (img) {
        imageFrag.appendChild(document.createComment(" field:media_image "));
        imageFrag.appendChild(img);
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:content_text "));
      if (titleEl && titleEl.textContent.trim()) {
        const h = document.createElement(/^H[1-6]$/.test(titleEl.tagName) ? titleEl.tagName : "h2");
        if (href) {
          const a = document.createElement("a");
          a.setAttribute("href", href);
          a.textContent = titleEl.textContent.trim();
          h.appendChild(a);
        } else {
          h.textContent = titleEl.textContent.trim();
        }
        textFrag.appendChild(h);
      }
      const desc = slide.querySelector(".hero-component__text");
      if (desc && desc.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = desc.textContent.trim();
        textFrag.appendChild(p);
      }
      const dateEl = slide.querySelector(".hero-component__date, .bt-hero-date");
      if (dateEl && dateEl.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = dateEl.textContent.trim();
        textFrag.appendChild(p);
      }
      if (ctaLink && cleanHref(ctaLink)) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.setAttribute("href", cleanHref(ctaLink));
        a.textContent = ctaLink.textContent.trim() || "Find Out More";
        p.appendChild(a);
        textFrag.appendChild(p);
      }
      const downloadLink = slide.querySelector("a.jlr-download-btn, a.new-share__hero-download");
      if (downloadLink && cleanHref(downloadLink)) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.setAttribute("href", cleanHref(downloadLink));
        a.textContent = "Download";
        p.appendChild(a);
        textFrag.appendChild(p);
      }
      cells.push([imageFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-featured-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/social-links.js
  function parse2(element, { document }) {
    const NETWORKS = [
      { test: /instagram\.com/i, name: "Instagram" },
      { test: /(youtube\.com|youtu\.be)/i, name: "YouTube" },
      { test: /facebook\.com/i, name: "Facebook" },
      { test: /tiktok\.com/i, name: "TikTok" },
      { test: /linkedin\.com/i, name: "LinkedIn" },
      { test: /(\/\/|\.)(x|twitter)\.com/i, name: "X" },
      { test: /(feed|rss)/i, name: "RSS Feed" }
    ];
    const networkName = (href) => {
      const match = NETWORKS.find((n) => n.test.test(href));
      return match ? match.name : "";
    };
    const cells = [];
    const labelEl = element.querySelector(".media-links .bt-hero-text, .bt-hero-text");
    const labelText = labelEl ? labelEl.textContent.trim() : "";
    if (labelText) {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(" field:label "));
      frag.appendChild(document.createTextNode(labelText));
      cells.push([frag]);
    } else {
      cells.push([""]);
    }
    const links = Array.from(element.querySelectorAll(".homepage-social-icons a[href], .social-bar a[href]")).filter((a, i, arr) => arr.indexOf(a) === i);
    links.forEach((link) => {
      const href = link.getAttribute("href").trim();
      if (!href) return;
      const visible = link.textContent.trim();
      const name = networkName(href);
      const a = document.createElement("a");
      a.setAttribute("href", href);
      a.textContent = name ? `Link to ${name}` : visible || href;
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(" field:link "));
      frag.appendChild(a);
      cells.push([frag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "social-links", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-news.js
  function parse3(element, { document }) {
    const cleanHref = (a) => a && a.getAttribute("href") ? a.getAttribute("href").trim() : "";
    const items = Array.from(element.querySelectorAll(".modern-news__panel"));
    const cells = [];
    items.forEach((item) => {
      const titleEl = item.querySelector(".new-card__title, .bt-card-heading, h3");
      const readMoreLink = item.querySelector(".read-more a, .modern-news__link-wrap a");
      const imageLink = item.querySelector("a.modern-news__image-wrap");
      const titleLink = titleEl ? titleEl.closest("a") || titleEl.querySelector("a") : null;
      const href = cleanHref(titleLink) || cleanHref(readMoreLink) || cleanHref(imageLink);
      const imageFrag = document.createDocumentFragment();
      const img = item.querySelector(".modern-news__image img, .image img");
      if (img) {
        imageFrag.appendChild(document.createComment(" field:image "));
        imageFrag.appendChild(img);
      }
      const countFrag = document.createDocumentFragment();
      const countNum = item.querySelector(".bt-image-count");
      const countText = item.querySelector(".bt-image-count-text");
      if (countNum && countNum.textContent.trim()) {
        countFrag.appendChild(document.createComment(" field:count "));
        countFrag.appendChild(document.createTextNode(
          `${countNum.textContent.trim()} ${countText ? countText.textContent.trim() : ""}`.trim()
        ));
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      const dateEl = item.querySelector(".new-card__date, .bt-card-date time");
      const dateText = dateEl ? dateEl.textContent.trim() : "";
      if (dateText) {
        const p = document.createElement("p");
        p.textContent = dateText;
        textFrag.appendChild(p);
      }
      if (titleEl && titleEl.textContent.trim()) {
        const h = document.createElement(titleEl.tagName.toLowerCase().match(/^h[1-6]$/) ? titleEl.tagName : "h3");
        if (href) {
          const a = document.createElement("a");
          a.setAttribute("href", href);
          a.textContent = titleEl.textContent.trim();
          h.appendChild(a);
        } else {
          h.textContent = titleEl.textContent.trim();
        }
        textFrag.appendChild(h);
      }
      const teaser = item.querySelector(".new-card__teaser, .bt-card-description");
      if (teaser && teaser.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = teaser.textContent.trim();
        textFrag.appendChild(p);
      }
      const downloadLink = Array.from(item.querySelectorAll("a.new-share__btn")).find((a) => cleanHref(a) && cleanHref(a) !== "#");
      if (downloadLink) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.setAttribute("href", cleanHref(downloadLink));
        a.textContent = "Download";
        p.appendChild(a);
        textFrag.appendChild(p);
      }
      const readMoreHref = cleanHref(readMoreLink) || href;
      if (readMoreLink && readMoreHref) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.setAttribute("href", readMoreHref);
        a.textContent = readMoreLink.textContent.trim() || "Read more";
        p.appendChild(a);
        textFrag.appendChild(p);
      }
      cells.push([imageFrag, countFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse4(element, { document }) {
    const cleanHref = (a) => a && a.getAttribute("href") ? a.getAttribute("href").trim() : "";
    const items = Array.from(element.querySelectorAll(".modern-packs__panel"));
    const cells = [];
    items.forEach((item) => {
      const titleEl = item.querySelector(".new-card__title, .bt-card-heading");
      const titleLink = titleEl ? titleEl.closest("a") : null;
      const imageLink = item.querySelector("a.modern-packs__image-wrap");
      const href = cleanHref(titleLink) || cleanHref(imageLink);
      const imageFrag = document.createDocumentFragment();
      const img = item.querySelector(".modern-packs__image img");
      if (img) {
        imageFrag.appendChild(document.createComment(" field:image "));
        imageFrag.appendChild(img);
      }
      const countFrag = document.createDocumentFragment();
      const countNum = item.querySelector(".bt-image-count");
      const countText = item.querySelector(".bt-image-count-text");
      if (countNum && countNum.textContent.trim()) {
        countFrag.appendChild(document.createComment(" field:count "));
        countFrag.appendChild(document.createTextNode(
          `${countNum.textContent.trim()} ${countText ? countText.textContent.trim() : ""}`.trim()
        ));
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      const dateEl = item.querySelector(".new-card__date");
      const dateText = dateEl ? dateEl.textContent.trim() : "";
      if (dateText) {
        const p = document.createElement("p");
        p.textContent = dateText;
        textFrag.appendChild(p);
      }
      if (titleEl && titleEl.textContent.trim()) {
        const h = document.createElement(/^H[1-6]$/.test(titleEl.tagName) ? titleEl.tagName : "h3");
        if (href) {
          const a = document.createElement("a");
          a.setAttribute("href", href);
          a.textContent = titleEl.textContent.trim();
          h.appendChild(a);
        } else {
          h.textContent = titleEl.textContent.trim();
        }
        textFrag.appendChild(h);
      }
      const teaser = item.querySelector(".new-card__teaser, .bt-card-description");
      if (teaser && teaser.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = teaser.textContent.trim();
        textFrag.appendChild(p);
      }
      const downloadLink = Array.from(item.querySelectorAll(".download-group a.new-share__btn")).find((a) => cleanHref(a) && cleanHref(a) !== "#");
      if (downloadLink) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.setAttribute("href", cleanHref(downloadLink));
        a.textContent = "Download";
        p.appendChild(a);
        textFrag.appendChild(p);
      }
      cells.push([imageFrag, countFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/jlr-cleanup.js
  var MEDIA_SELECTOR = "img, picture, video, iframe, svg, object, embed";
  function isEmpty(el) {
    return !el.textContent.trim() && !el.querySelector(MEDIA_SELECTOR);
  }
  function removeIfEmpty(root, selectors) {
    root.querySelectorAll(selectors.join(",")).forEach((el) => {
      if (isEmpty(el)) el.remove();
    });
  }
  function transform(hookName, element, payload) {
    if (hookName === "beforeTransform") {
      WebImporter.DOMUtils.remove(element, [
        ".ui-dialog",
        "#drupal-modal",
        ".ui-widget-overlay"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#subscribemodel",
        ".modal",
        ".toasts",
        ".drp-cm-subscribe",
        ".ui-autocomplete",
        ".ui-helper-hidden-accessible",
        "#drupal-live-announce",
        "#fullscreen-nav-overlay"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#european-cookie-law",
        ".european-cookie-law",
        "#onetrust-consent-sdk",
        "#CybotCookiebotDialog",
        ".cookie-banner",
        ".eu-cookie-compliance-banner"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#addtoany",
        ".a2a_overlay",
        ".a2a_modal",
        ".a2a_menu",
        ".new-share__wrapper",
        ".a2a_kit",
        ".new-share__hero-cart"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link",
        "a#main-content:empty"
      ]);
    }
    if (hookName === "afterTransform") {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "nav#main-nav",
        "#main-nav",
        ".main-nav",
        ".mega-menu",
        "#market-switcher-list",
        ".navigation-tools__switcher",
        ".breadcrumb",
        'nav[aria-label="breadcrumb"]',
        "section.newsletter-band",
        ".newsletter-band",
        "footer",
        ".region-footer",
        ".region-communication-message-footer",
        ".block-emissions-block"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "script",
        "style",
        "noscript",
        "link",
        "iframe#a2a_sm_ifr",
        ".visually-hidden.focusable"
      ]);
      removeIfEmpty(element, [
        ".page > .container",
        ".page > .wrapper-background",
        ".wrapper-background > .container",
        ".container > .content",
        ".region"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        [...el.attributes].forEach(({ name }) => {
          if (name.startsWith("data-excat-")) return;
          if (name.startsWith("on") || name.startsWith("data-gtm") || name.startsWith("data-analytics") || name.startsWith("data-track") || name.startsWith("data-once") || name.startsWith("data-drupal") || name === "data-dismiss" || name === "data-toggle") {
            el.removeAttribute(name);
          }
        });
      });
    }
  }

  // tools/importer/transformers/jlr-sections.js
  var MARKER = "data-excat-section-id";
  function findSection(root, section) {
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
    for (const sel of selectors) {
      if (!sel) continue;
      try {
        const el = root.querySelector(sel);
        if (el) return el;
      } catch (e) {
      }
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const template = payload && payload.template;
    const sections = template && template.sections || [];
    if (sections.length < 2) return;
    const document = element.ownerDocument || payload.document;
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const el = findSection(element, section);
        if (!el) continue;
        if (i === 0 && !section.style) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(MARKER, section.id);
        el.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const block = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        const marker = element.querySelector(`hr[${MARKER}="${section.id}"]`);
        if (marker) {
          marker.after(block);
          if (i === 0) {
            marker.remove();
          } else {
            marker.removeAttribute(MARKER);
          }
        } else {
          const el = findSection(element, section);
          if (el) el.after(block);
        }
      }
    }
  }

  // tools/importer/import-brand-landing.js
  var PAGE_TEMPLATE = {
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
          '.home-page > div[class="wrapper-background"]'
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
  var parsers = {
    "carousel-featured-news": parse,
    "social-links": parse2,
    "cards-news": parse3,
    "cards-gallery": parse4
  };
  var transformers = [
    transform,
    transform2
  ];
  var ICON_ONLY_LINK_SELECTORS = [
    ".homepage-social-icons a",
    ".social-bar a",
    "a.new-share__btn",
    "a.jlr-download-btn",
    "a.new-share__hero-download"
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
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
  var import_brand_landing_default = {
    onLoad: (_0) => __async(null, [_0], function* ({ document }) {
      document.querySelectorAll(ICON_ONLY_LINK_SELECTORS.join(",")).forEach((link) => {
        if (link.textContent.trim() || link.querySelector("img, picture")) return;
        const label = (link.getAttribute("aria-label") || link.getAttribute("title") || link.className || "link").trim();
        link.textContent = label;
      });
    }),
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
      executeTransformers("afterTransform", main, payload);
      main.appendChild(document.createElement("hr"));
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_brand_landing_exports);
})();
