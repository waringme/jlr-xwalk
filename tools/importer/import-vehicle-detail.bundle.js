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

  // tools/importer/import-vehicle-detail.js
  var import_vehicle_detail_exports = {};
  __export(import_vehicle_detail_exports, {
    default: () => import_vehicle_detail_default
  });

  // tools/importer/parsers/media-image.js
  function parse(element, { document }) {
    const cleanHref = (a) => a && a.getAttribute("href") ? a.getAttribute("href").trim() : "";
    const isRealHref = (href) => href && href !== "#" && !href.startsWith("/#") && !href.startsWith("javascript:");
    const labelOf = (a, fallback) => {
      const text = (a.textContent || "").replace(/\s+/g, " ").trim();
      const cls = (a.getAttribute("class") || "").trim();
      if (!text || text === cls || text === "link" || /jlr-download-btn|new-share__/.test(text)) return fallback;
      return text;
    };
    const firstContentImg = (root) => Array.from(root.querySelectorAll("img")).find((img) => {
      const src = img.getAttribute("src") || "";
      return src && !src.startsWith("data:") && !img.closest(".a2a_kit, .new-share__wrapper, .a2a_svg");
    });
    const isHero = element.matches(".image-holder, .image-top") || !!element.querySelector(".field--name-field-hero-image");
    const items = [];
    if (isHero) {
      const links = Array.from(element.querySelectorAll(".action-icons a.download, .action-icons a.new-share__hero-download, .action-icons a.jlr-download-btn")).filter((a, i, arr) => isRealHref(cleanHref(a)) && arr.indexOf(a) === i);
      const heroImg = firstContentImg(element.querySelector(".field--name-field-hero-image") || element);
      if (heroImg && !heroImg.getAttribute("alt") && element.matches(".image-top")) {
        const container = element.closest(".container.vehicle") || document;
        const modelName = container.querySelector(".caption-holder .page-title, .caption-holder h1");
        if (modelName && modelName.textContent.trim()) heroImg.setAttribute("alt", modelName.textContent.trim());
      }
      items.push({
        img: heroImg,
        title: "",
        links: links.map((a) => ({ href: cleanHref(a), label: labelOf(a, "Download") }))
      });
    } else {
      const wrappers = Array.from(element.querySelectorAll(".hover-prt-wrapper"));
      (wrappers.length ? wrappers : [element]).forEach((wrap) => {
        const titleEl = wrap.querySelector(".hover-prt h1, .hover-prt h2, .hover-prt h3, .hover-prt h4, .hover-prt h5, .hover-prt h6, .hover-prt p");
        const links = Array.from(wrap.querySelectorAll(".dropdown-menu a[href], .download-group a.jlr-download-btn[href]")).filter((a, i, arr) => isRealHref(cleanHref(a)) && arr.indexOf(a) === i);
        items.push({
          img: firstContentImg(wrap),
          title: titleEl ? titleEl.textContent.replace(/\s+/g, " ").trim() : "",
          links: links.map((a, i) => ({
            href: cleanHref(a),
            label: labelOf(a, links.length > 1 ? i === 0 ? "High-Res" : "Low-Res" : "Download")
          }))
        });
      });
    }
    const cells = [];
    items.forEach(({ img, title, links }) => {
      const imageFrag = document.createDocumentFragment();
      if (img) {
        imageFrag.appendChild(document.createComment(" field:image "));
        imageFrag.appendChild(img);
      }
      const titleFrag = document.createDocumentFragment();
      if (title) {
        titleFrag.appendChild(document.createComment(" field:title "));
        titleFrag.appendChild(document.createTextNode(title));
      }
      const linksFrag = document.createDocumentFragment();
      if (links.length) {
        linksFrag.appendChild(document.createComment(" field:links "));
        links.forEach(({ href, label }) => {
          const p = document.createElement("p");
          const a = document.createElement("a");
          a.setAttribute("href", href);
          a.textContent = label;
          p.appendChild(a);
          linksFrag.appendChild(p);
        });
      }
      cells.push([imageFrag, titleFrag, linksFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "media-image",
      variants: isHero ? [] : ["strip"],
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-vehicle-intro.js
  function parse2(element, { document }) {
    const cleanHref = (a) => a && a.getAttribute("href") ? a.getAttribute("href").trim() : "";
    const isRealHref = (href) => href && href !== "#" && !href.startsWith("/#") && !href.startsWith("javascript:");
    const headingCell = [];
    const titleEl = element.querySelector(".caption-cell h1, .caption-cell h2, .caption-table .page-title, h1");
    if (titleEl && titleEl.textContent.trim()) {
      const level = /^H[1-6]$/.test(titleEl.tagName) ? titleEl.tagName : "H1";
      const h = document.createElement(level);
      h.textContent = titleEl.textContent.replace(/\s+/g, " ").trim();
      headingCell.push(h);
    }
    const sideCell = [];
    const links = Array.from(element.querySelectorAll("a[href]")).filter((a) => !titleEl || !titleEl.contains(a)).filter((a) => isRealHref(cleanHref(a)) && a.textContent.trim());
    if (links.length) {
      const ul = document.createElement("ul");
      links.forEach((src) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.setAttribute("href", cleanHref(src));
        a.textContent = src.textContent.replace(/\s+/g, " ").trim();
        li.appendChild(a);
        ul.appendChild(li);
      });
      sideCell.push(ul);
    }
    const modelName = headingCell.length ? headingCell[0].textContent : "";
    Array.from(element.querySelectorAll("img")).filter((img) => {
      const src = img.getAttribute("src") || "";
      return src && !src.startsWith("data:");
    }).forEach((img) => {
      if (!img.getAttribute("alt") && modelName) img.setAttribute("alt", modelName);
      sideCell.push(img);
    });
    const cells = [[headingCell, sideCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-vehicle-intro", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/media-subnav.js
  function parse3(element, { document }) {
    const ctx = arguments[1] || {};
    const pagePath = (() => {
      const candidates = [
        ctx.params && ctx.params.originalURL,
        ctx.url,
        document.querySelector('link[rel="canonical"]') && document.querySelector('link[rel="canonical"]').getAttribute("href"),
        document.location && document.location.href
      ];
      for (const candidate of candidates) {
        if (!candidate) continue;
        try {
          const { pathname } = new URL(candidate, "https://media.jlr.com");
          if (/\/vehicle\//.test(pathname)) return pathname.replace(/\.html$/, "").replace(/\/+$/, "");
        } catch (e) {
        }
      }
      return "";
    })();
    const segments = pagePath.split("/").filter(Boolean);
    const brand = segments[0] || "";
    const locale = segments[1] && /^[a-z]{2}(-[a-z]{2})?$/i.test(segments[1]) ? segments[1] : "en-gb";
    const vehicleHref = pagePath || "#";
    const listing = (slug) => brand ? `/${brand}/${locale}/${slug}` : vehicleHref;
    const BRANDS_WITH = {
      "press-kit": ["classic", "defender", "defenderrally", "discovery", "jaguar-tcs-racing", "range-rover"],
      "tech-specs": ["classic", "defender", "defenderrally", "discovery", "jaguar-tcs-racing", "range-rover"]
    };
    const hrefForTab = (label) => {
      const key = label.toLowerCase().replace(/\s+/g, " ").trim();
      if (/^news\b/.test(key)) return vehicleHref;
      if (/^image packs?\b/.test(key)) return listing("image-packs");
      if (/^images?\b/.test(key)) return listing("images");
      if (/^video packs?\b/.test(key)) return listing("video-packs");
      if (/^videos?\b/.test(key)) return listing("videos");
      if (/^press kits?\b/.test(key)) return BRANDS_WITH["press-kit"].includes(brand) ? listing("press-kit") : vehicleHref;
      if (/^tech(nical)? spec/.test(key)) return BRANDS_WITH["tech-specs"].includes(brand) ? listing("tech-specs") : vehicleHref;
      return vehicleHref;
    };
    const cells = [];
    const listingLinks = Array.from(element.querySelectorAll(":scope > a[href]"));
    if (!element.querySelector(":scope > li") && listingLinks.length) {
      listingLinks.forEach((src) => {
        const label = src.textContent.replace(/\s+/g, " ").trim();
        const href = (src.getAttribute("href") || "").trim();
        if (!label || !href || href === "#" || href.startsWith("javascript:")) return;
        const frag = document.createDocumentFragment();
        frag.appendChild(document.createComment(" field:link "));
        const a = document.createElement("a");
        a.setAttribute("href", href);
        a.textContent = label;
        frag.appendChild(a);
        cells.push([frag]);
      });
      if (!cells.length) {
        element.remove();
        return;
      }
      const listingBlock = WebImporter.Blocks.createBlock(document, { name: "media-subnav", cells });
      element.replaceWith(listingBlock);
      return;
    }
    const tabs = Array.from(element.querySelectorAll(":scope > li"));
    tabs.forEach((li) => {
      const src = li.querySelector("a") || li;
      const countEl = src.querySelector(".count");
      const countText = countEl ? countEl.textContent.replace(/\s+/g, " ").trim() : "";
      const clone = src.cloneNode(true);
      clone.querySelectorAll(".count").forEach((c) => c.remove());
      const label = clone.textContent.replace(/\s+/g, " ").trim();
      if (!label) return;
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(" field:link "));
      const a = document.createElement("a");
      a.setAttribute("href", hrefForTab(label));
      a.textContent = countText ? `${label} ${countText}` : label;
      frag.appendChild(a);
      cells.push([frag]);
    });
    if (!cells.length) {
      element.remove();
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "media-subnav", cells });
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
  function parse4(element, { document, params }) {
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
  function parse5(element, { document }) {
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

  // tools/importer/parsers/pagination.js
  function parse6(element, { document }) {
    const cleanHref = (a) => a && a.getAttribute("href") ? a.getAttribute("href").trim() : "";
    const isRealHref = (href) => href && href !== "#" && !href.startsWith("javascript:");
    const links = Array.from(element.querySelectorAll("a[href]")).filter((a) => isRealHref(cleanHref(a)));
    const isPrev = (a) => {
      const text = `${a.textContent} ${a.getAttribute("aria-label") || ""} ${a.getAttribute("title") || ""} ${a.getAttribute("rel") || ""}`.toLowerCase();
      const wrapper = a.closest(".btn") || a.parentElement;
      return /prev|back/.test(text) || !!(wrapper && wrapper.querySelector(".jlrnew-arrow_left"));
    };
    let prev = null;
    let next = null;
    links.forEach((a) => {
      if (!prev && isPrev(a)) prev = a;
      else if (!next) next = a;
    });
    const buildLink = (src, field, label) => {
      const frag = document.createDocumentFragment();
      if (!src) return frag;
      frag.appendChild(document.createComment(` field:${field} `));
      const a = document.createElement("a");
      a.setAttribute("href", cleanHref(src));
      a.textContent = label;
      frag.appendChild(a);
      return frag;
    };
    const totalEl = element.querySelector(".new-grid__pager-text");
    const totalMatch = totalEl ? totalEl.textContent.match(/\d+/) : null;
    const pagesFrag = document.createDocumentFragment();
    if (totalMatch) {
      pagesFrag.appendChild(document.createComment(" field:pages "));
      pagesFrag.appendChild(document.createTextNode(totalMatch[0]));
    }
    const cells = [
      [pagesFrag],
      // pages (listing pager only; empty on the article pager)
      [buildLink(prev, "link", "Previous")],
      [buildLink(next, "nextLink", "Next")]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "pagination", cells });
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

  // tools/importer/import-vehicle-detail.js
  var PAGE_TEMPLATE = {
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
  var parsers = {
    "media-image": parse,
    "columns-vehicle-intro": parse2,
    "media-subnav": parse3,
    "cards-news": parse4,
    "cards-gallery": parse5,
    "pagination": parse6
  };
  var transformers = [
    transform,
    transform2
  ];
  var ICON_ONLY_LINK_SELECTORS = [
    // hero download button
    "a.jlr-download-btn",
    "a.download",
    "a.new-share__hero-download",
    ".action-icons a",
    ".dropdown-menu a",
    // share / cart / favourite icon links on hero and cards
    "a.new-share__btn",
    "a.new-share__link",
    "a.cart",
    'a[class*="favourite"]',
    'a[class*="favorite"]',
    'a[class*="wishlist"]',
    // media archive tile download dropdowns
    ".content-foot a",
    // listing pager arrows
    ".new-grid__pager a",
    ".pager a"
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
  var import_vehicle_detail_default = {
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
  return __toCommonJS(import_vehicle_detail_exports);
})();
