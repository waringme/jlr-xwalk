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
  function newsFolder(originalURL) {
    try {
      const segs = new URL(originalURL).pathname.split("/").filter(Boolean);
      const locale = segs.findIndex((s) => /^[a-z]{2}-[a-z]{2}$/.test(s));
      return locale >= 0 ? `/${segs.slice(0, locale + 1).join("/")}/news` : "";
    } catch (e) {
      return "";
    }
  }
  function fieldRow(document, name, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${name} `));
    if (content) frag.appendChild(content);
    return [frag];
  }
  function parse3(element, { document, params }) {
    var _a, _b;
    const cleanHref = (a) => a && a.getAttribute("href") ? a.getAttribute("href").trim() : "";
    const items = Array.from(element.querySelectorAll(".modern-news__panel"));
    const pageUrl = params && params.originalURL || ((_a = document.querySelector('link[rel="canonical"]')) == null ? void 0 : _a.getAttribute("href")) || ((_b = document.querySelector('meta[property="og:url"]')) == null ? void 0 : _b.getAttribute("content")) || document.location && document.location.href || "";
    const folder = element.matches(".view-display-id-latest_news") ? newsFolder(pageUrl) : "";
    if (folder) {
      const link = document.createElement("a");
      link.setAttribute("href", folder);
      link.textContent = folder;
      const folderP = document.createElement("p");
      folderP.appendChild(link);
      const countP = document.createElement("p");
      countP.textContent = String(items.length || 4);
      const block2 = WebImporter.Blocks.createBlock(document, {
        name: "cards-news",
        cells: [
          fieldRow(document, "folder", folderP),
          fieldRow(document, "count", countP),
          fieldRow(document, "category")
        ]
      });
      element.replaceWith(block2);
      return;
    }
    const cells = [];
    items.forEach((item) => {
      const titleEl = item.querySelector(".new-card__title, .bt-card-heading, h3");
      const readMoreLink = item.querySelector(".read-more a, .modern-news__link-wrap a");
      const imageLink = item.querySelector("a.modern-news__image-wrap");
      const titleLink = titleEl ? titleEl.closest("a") || titleEl.querySelector("a") : null;
      const href = cleanHref(titleLink) || cleanHref(readMoreLink) || cleanHref(imageLink);
      const imageFrag = document.createDocumentFragment();
      const img = item.querySelector(".modern-news__image img, .image img, a.modern-news__image-wrap img");
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
  function parseRelatedPacks(element, document, cleanHref) {
    const norm = (s) => (s || "").replace(/&nbsp;/g, " ").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
    const labelOf = (a, fallback) => {
      const text = norm(a.textContent);
      const cls = (a.getAttribute("class") || "").trim();
      if (!text || text === cls || text === "link" || /jlr-download-btn|new-share__/.test(text)) return fallback;
      return text;
    };
    const mobileLinks = [];
    element.querySelectorAll(".gallery-item:not(.gallery-box) li").forEach((li) => {
      const a = Array.from(li.querySelectorAll("a[href]")).find((l) => /image-packs|video-packs|\/packs?\//.test(cleanHref(l))) || li.querySelector("a[href]");
      if (!a) return;
      const titleEl = li.querySelector(".title, h3");
      mobileLinks.push({ href: cleanHref(a), title: norm(titleEl ? titleEl.textContent : "") });
    });
    const tiles = Array.from(element.querySelectorAll(".gallery-item.gallery-box"));
    const cells = [];
    tiles.forEach((tile, index) => {
      const titleEl = tile.querySelector(".content-head .bt-gallery-title, .content-head .title");
      const title = norm(titleEl ? titleEl.textContent : "");
      const match = mobileLinks.find((m) => m.title && m.title === title) || mobileLinks[index];
      const href = match ? match.href : "";
      const imageFrag = document.createDocumentFragment();
      const img = tile.querySelector(".gallery-contents .thumb2-ratio-stretch img, .gallery-contents img");
      if (img) {
        if (!img.getAttribute("alt") && title) img.setAttribute("alt", title);
        imageFrag.appendChild(document.createComment(" field:image "));
        imageFrag.appendChild(img);
      }
      const countFrag = document.createDocumentFragment();
      const countNum = tile.querySelector(".gallery-contents .bt-image-count");
      const countText = tile.querySelector(".gallery-contents .bt-image-count-text");
      if (countNum && countNum.textContent.trim()) {
        countFrag.appendChild(document.createComment(" field:count "));
        countFrag.appendChild(document.createTextNode(
          `${countNum.textContent.trim()} ${countText ? countText.textContent.trim() : ""}`.trim()
        ));
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      const dateEl = tile.querySelector(".content-head .bt-gallery-date, .content-head .date");
      if (dateEl && norm(dateEl.textContent)) {
        const p = document.createElement("p");
        p.textContent = norm(dateEl.textContent);
        textFrag.appendChild(p);
      }
      if (title) {
        const h = document.createElement("h3");
        if (href) {
          const a = document.createElement("a");
          a.setAttribute("href", href);
          a.textContent = title;
          h.appendChild(a);
        } else {
          h.textContent = title;
        }
        textFrag.appendChild(h);
      }
      const teaser = tile.querySelector(".content-head .bt-gallery-overlay-desc, .content-head p");
      if (teaser && norm(teaser.textContent)) {
        const p = document.createElement("p");
        p.textContent = norm(teaser.textContent);
        textFrag.appendChild(p);
      }
      const downloadLink = Array.from(tile.querySelectorAll(".content-foot a.jlr-download-btn, .content-foot .download-group a[href]")).find((a) => cleanHref(a) && cleanHref(a) !== "#");
      if (downloadLink) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.setAttribute("href", cleanHref(downloadLink));
        a.textContent = labelOf(downloadLink, "Download");
        p.appendChild(a);
        textFrag.appendChild(p);
      }
      cells.push([imageFrag, countFrag, textFrag]);
    });
    return cells;
  }
  function parseListingGrid(element, document, cleanHref) {
    const norm = (s) => (s || "").replace(/&nbsp;/g, " ").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
    const isRealHref = (href) => href && href !== "#" && !href.startsWith("/#") && !href.startsWith("javascript:");
    const cells = [];
    Array.from(element.querySelectorAll(":scope > .gallery-item")).forEach((tile) => {
      const contents = tile.querySelector(".gallery-contents") || tile;
      const titleEl = contents.querySelector(".content-head .bt-gallery-title, .content-head .title, h3");
      const title = norm(titleEl ? titleEl.textContent : "");
      const descEl = tile.querySelector(".image-description, .bt-modal-desc, .content-head .bt-gallery-overlay-desc, .content-head p");
      const desc = norm(descEl ? descEl.textContent : "");
      const linkEl = Array.from(contents.querySelectorAll("a[href]")).find((a) => isRealHref(cleanHref(a)) && !a.matches(".jlr-download-btn, .download") && !a.closest(".content-foot, .download-group, .new-share, .dropdown-menu"));
      const href = linkEl ? cleanHref(linkEl) : "";
      const imageFrag = document.createDocumentFragment();
      let img = contents.querySelector("img");
      const realSrc = (el) => {
        if (!el) return "";
        const src = (el.getAttribute("src") || "").trim();
        return src && !src.startsWith("data:") ? src : (el.getAttribute("data-original") || "").trim();
      };
      if (!realSrc(img)) img = tile.querySelector(".image-top img");
      if (img && realSrc(img)) {
        img.setAttribute("src", realSrc(img));
        if (!norm(img.getAttribute("alt"))) img.setAttribute("alt", title || desc);
        imageFrag.appendChild(document.createComment(" field:image "));
        imageFrag.appendChild(img);
      }
      const countFrag = document.createDocumentFragment();
      const countNum = contents.querySelector(".bt-image-count");
      const countText = contents.querySelector(".bt-image-count-text");
      if (countNum && countNum.textContent.trim()) {
        countFrag.appendChild(document.createComment(" field:count "));
        countFrag.appendChild(document.createTextNode(
          `${countNum.textContent.trim()} ${countText ? countText.textContent.trim() : ""}`.trim()
        ));
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      const dateEl = contents.querySelector(".content-head .bt-gallery-date, .content-head .date, .new-card__date");
      if (dateEl && norm(dateEl.textContent)) {
        const p = document.createElement("p");
        p.textContent = norm(dateEl.textContent);
        textFrag.appendChild(p);
      }
      const heading = title || desc;
      if (heading) {
        const h = document.createElement("h3");
        if (href) {
          const a = document.createElement("a");
          a.setAttribute("href", href);
          a.textContent = heading;
          h.appendChild(a);
        } else {
          h.textContent = heading;
        }
        textFrag.appendChild(h);
      }
      if (title && desc && desc !== title) {
        const p = document.createElement("p");
        p.textContent = desc;
        textFrag.appendChild(p);
      }
      const seen = /* @__PURE__ */ new Set();
      Array.from(contents.querySelectorAll(".content-foot .dropdown-menu a[href], .content-foot a.jlr-download-btn[href], .content-foot a.download[href]")).forEach((a) => {
        const dl = cleanHref(a);
        if (!isRealHref(dl) || seen.has(dl)) return;
        seen.add(dl);
        const text = norm(a.textContent);
        const p = document.createElement("p");
        const link = document.createElement("a");
        link.setAttribute("href", dl);
        link.textContent = text && !/jlr-download-btn|new-share__|^link$/.test(text) ? text : "Download";
        p.appendChild(link);
        textFrag.appendChild(p);
      });
      cells.push([imageFrag, countFrag, textFrag]);
    });
    return cells;
  }
  function parse4(element, { document }) {
    const cleanHref = (a) => a && a.getAttribute("href") ? a.getAttribute("href").trim() : "";
    if (element.matches(".card-grid") && element.querySelector(":scope > .gallery-item")) {
      const isVehicleTab = !!element.closest("#my-tab-content");
      const isPackGrid = !!element.querySelector(":scope > .gallery-item .bt-image-count");
      const gridBlock = WebImporter.Blocks.createBlock(document, __spreadProps(__spreadValues({
        name: "cards-gallery"
      }, !isVehicleTab && isPackGrid ? { variants: ["alt-2"] } : {}), {
        cells: parseListingGrid(element, document, cleanHref)
      }));
      element.replaceWith(gridBlock);
      return;
    }
    if (!element.querySelector(".modern-packs__panel") && element.querySelector(".gallery-item.gallery-box")) {
      const relatedCells = parseRelatedPacks(element, document, cleanHref);
      const relatedBlock = WebImporter.Blocks.createBlock(document, {
        name: "cards-gallery",
        variants: ["alt"],
        cells: relatedCells
      });
      element.replaceWith(relatedBlock);
      return;
    }
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
        ".new-grid__refine-btn",
        "#taxonomies",
        "#colPush",
        ".new-grid__sidebar-panel",
        "div.container.footer__racing"
      ]);
      element.querySelectorAll(".vehicle-page .container.search-page h1").forEach((h1) => {
        const h2 = element.ownerDocument.createElement("h2");
        h2.innerHTML = h1.innerHTML;
        h1.replaceWith(h2);
      });
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
