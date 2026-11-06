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

  // tools/importer/import-content-detail.js
  var import_content_detail_exports = {};
  __export(import_content_detail_exports, {
    default: () => import_content_detail_default
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
    const isHero = element.matches(".image-holder") || !!element.querySelector(".field--name-field-hero-image");
    const items = [];
    if (isHero) {
      const links = Array.from(element.querySelectorAll(".action-icons a.download, .action-icons a.new-share__hero-download, .action-icons a.jlr-download-btn")).filter((a, i, arr) => isRealHref(cleanHref(a)) && arr.indexOf(a) === i);
      items.push({
        img: firstContentImg(element.querySelector(".field--name-field-hero-image") || element),
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

  // tools/importer/parsers/media-actions.js
  function parse2(element, { document }) {
    const cleanHref = (a) => a && a.getAttribute("href") ? a.getAttribute("href").trim() : "";
    const isRealHref = (href) => href && href !== "#" && !href.startsWith("/#") && !href.startsWith("javascript:");
    const labelOf = (a, fallback) => {
      const text = (a.textContent || "").replace(/\s+/g, " ").trim();
      const cls = (a.getAttribute("class") || "").trim();
      if (!text || text === cls || text === "link" || /jlr-download-btn|new-share__/.test(text)) return fallback;
      return text;
    };
    const links = Array.from(element.querySelectorAll("a[href]")).filter((a) => !a.closest(".new-share__btn, .new-share__wrapper, .a2a_kit")).filter((a) => isRealHref(cleanHref(a)));
    const cells = [];
    cells.push([""]);
    const linksFrag = document.createDocumentFragment();
    if (links.length) {
      linksFrag.appendChild(document.createComment(" field:links "));
      links.forEach((link) => {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.setAttribute("href", cleanHref(link));
        a.textContent = labelOf(link, "Download");
        p.appendChild(a);
        linksFrag.appendChild(p);
      });
    }
    cells.push([linksFrag]);
    const block = WebImporter.Blocks.createBlock(document, { name: "media-actions", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/quote-centered.js
  function parse3(element, { document }) {
    const cells = [];
    const quoteFrag = document.createDocumentFragment();
    const blockquote = element.querySelector("blockquote");
    const quoteParas = blockquote ? Array.from(blockquote.querySelectorAll("p")).filter((p) => p.textContent.trim()) : [];
    if (quoteParas.length) {
      quoteFrag.appendChild(document.createComment(" field:quotation "));
      quoteParas.forEach((p) => {
        const para = document.createElement("p");
        para.innerHTML = p.innerHTML;
        quoteFrag.appendChild(para);
      });
    } else if (blockquote && blockquote.textContent.trim()) {
      quoteFrag.appendChild(document.createComment(" field:quotation "));
      const para = document.createElement("p");
      para.textContent = blockquote.textContent.trim();
      quoteFrag.appendChild(para);
    }
    cells.push([quoteFrag]);
    const attrFrag = document.createDocumentFragment();
    const lines = Array.from(element.querySelectorAll(".central-quote-titles, blockquote ~ h5, blockquote ~ p")).filter((el, i, arr) => arr.indexOf(el) === i && !el.closest("blockquote") && el.textContent.trim());
    if (lines.length) {
      attrFrag.appendChild(document.createComment(" field:attribution "));
      lines.forEach((line) => {
        const p = document.createElement("p");
        p.textContent = line.textContent.replace(/\s+/g, " ").trim();
        attrFrag.appendChild(p);
      });
    }
    cells.push([attrFrag]);
    const block = WebImporter.Blocks.createBlock(document, { name: "quote-centered", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-press-image.js
  function parse4(element, { document }) {
    const cleanHref = (a) => a && a.getAttribute("href") ? a.getAttribute("href").trim() : "";
    const isRealHref = (href) => href && href !== "#" && !href.startsWith("/#") && !href.startsWith("javascript:");
    const labelOf = (a, fallback) => {
      const text = (a.textContent || "").replace(/\s+/g, " ").trim();
      const cls = (a.getAttribute("class") || "").trim();
      if (!text || text === cls || text === "link" || /jlr-download-btn|new-share__/.test(text)) return fallback;
      return text;
    };
    const row = element.querySelector(":scope > .row.lightback") || element.querySelector(".row.lightback") || element.querySelector(":scope > .row.text-image") || element;
    const columns = Array.from(row.children).filter((col) => col.tagName === "IMG" || col.textContent.trim() || col.querySelector("img"));
    const buildMediaCell = (col) => {
      const cell = [];
      const img = (col.tagName === "IMG" ? [col] : Array.from(col.querySelectorAll("img"))).find((i) => (i.getAttribute("src") || "") && !(i.getAttribute("src") || "").startsWith("data:") && !i.closest(".a2a_kit, .new-share__wrapper, .hover-prt"));
      if (img) cell.push(img);
      const titleEl = col.querySelector(".hover-prt h1, .hover-prt h2, .hover-prt h3, .hover-prt h4, .hover-prt h5, .hover-prt h6, .hover-prt p");
      const title = titleEl ? titleEl.textContent.replace(/\s+/g, " ").trim() : "";
      if (title) {
        const h = document.createElement("h5");
        h.textContent = title;
        cell.push(h);
      }
      const links = Array.from(col.querySelectorAll(".dropdown-menu a[href], .download-group a.jlr-download-btn[href]")).filter((a, i, arr) => arr.indexOf(a) === i && isRealHref(cleanHref(a)));
      links.forEach((link, i) => {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.setAttribute("href", cleanHref(link));
        a.textContent = labelOf(link, links.length > 1 ? i === 0 ? "High-Res" : "Low-Res" : "Download");
        p.appendChild(a);
        cell.push(p);
      });
      return cell;
    };
    const buildTextCell = (col) => {
      const body = col.querySelector(".panel-body") || col;
      const keep = (n) => n.nodeType === 1 && (n.textContent.trim() || n.querySelector("img, picture")) || n.nodeType === 3 && n.textContent.trim();
      let nodes = Array.from(body.childNodes).filter(keep);
      if (nodes.length === 1 && nodes[0].nodeType === 1 && nodes[0].tagName === "DIV") {
        nodes = Array.from(nodes[0].childNodes).filter(keep);
      }
      return nodes;
    };
    const cellsRow = columns.map((col) => col.tagName === "IMG" || col.tagName === "PICTURE" || col.classList.contains("hover-prt-wrapper") || col.querySelector(":scope > img") ? buildMediaCell(col) : buildTextCell(col));
    while (cellsRow.length < 2) cellsRow.push("");
    const cells = [cellsRow];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-press-image", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-text.js
  function parse5(element, { document }) {
    const container = element.querySelector(".additional-information") || element.querySelector(".container") || element;
    let columns = Array.from(container.querySelectorAll(":scope > .col-first, :scope > .notes-to-editors"));
    if (!columns.length) {
      columns = Array.from(container.children).filter((col) => col.textContent.trim());
    }
    const buildCell = (col) => {
      const cell = [];
      const heading = col.querySelector(".foot-titles, h1, h2, h3, h4");
      if (heading && heading.textContent.trim()) {
        const h = document.createElement(/^H[1-6]$/.test(heading.tagName) ? heading.tagName.toLowerCase() : "h2");
        h.textContent = heading.textContent.replace(/\s+/g, " ").trim();
        cell.push(h);
      }
      const body = col.querySelector(".field--type-text-long") || col.querySelector(".field") || col;
      Array.from(body.childNodes).forEach((node) => {
        if (node === heading || node.nodeType === 1 && node.contains(heading)) return;
        if (node.nodeType === 3) {
          if (node.textContent.trim()) {
            const p = document.createElement("p");
            p.textContent = node.textContent.trim();
            cell.push(p);
          }
          return;
        }
        if (node.nodeType !== 1) return;
        if (!node.textContent.trim() && !node.querySelector("img, table")) return;
        cell.push(node);
      });
      return cell;
    };
    const row = columns.map(buildCell);
    while (row.length < 2) row.push("");
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-text", cells });
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
  function parse6(element, { document }) {
    const cleanHref = (a) => a && a.getAttribute("href") ? a.getAttribute("href").trim() : "";
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
  function parse7(element, { document }) {
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
    const cells = [
      [""],
      // pages (no page count on the article pager)
      [buildLink(prev, "link", "Previous")],
      [buildLink(next, "nextLink", "Next")]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "pagination", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/table-pricing.js
  function parse8(element, { document }) {
    const rows = Array.from(element.querySelectorAll(":scope > thead > tr, :scope > tbody > tr, :scope > tfoot > tr, :scope > tr")).filter((tr) => tr.textContent.trim() || tr.querySelector("img"));
    if (!rows.length) {
      element.remove();
      return;
    }
    const spanOf = (cell) => Math.max(1, parseInt(cell.getAttribute("colspan") || "1", 10) || 1);
    const width = Math.max(...rows.map((tr) => Array.from(tr.children).reduce((n, cell) => n + spanOf(cell), 0)));
    const cells = rows.map((tr) => {
      const row = [];
      Array.from(tr.children).forEach((cell) => {
        const frag = document.createDocumentFragment();
        Array.from(cell.childNodes).forEach((n) => frag.appendChild(n));
        row.push(frag);
        for (let i = 1; i < spanOf(cell); i += 1) row.push("");
      });
      while (row.length < width) row.push("");
      return row;
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "table-pricing", cells });
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

  // tools/importer/import-content-detail.js
  var PAGE_TEMPLATE = {
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
  var parsers = {
    "media-image": parse,
    "media-actions": parse2,
    "quote-centered": parse3,
    "columns-press-image": parse4,
    "columns-text": parse5,
    "cards-gallery": parse6,
    "pagination": parse7,
    "table-pricing": parse8
  };
  var transformers = [
    transform,
    transform2
  ];
  var ICON_ONLY_LINK_SELECTORS = [
    // download buttons (hero, info-box toolbar, press images, pack cards)
    "a.jlr-download-btn",
    "a.download",
    "a.new-share__hero-download",
    ".download-group a",
    ".action-icons a",
    // hi-res / low-res dropdown entries
    ".dropdown-menu a",
    // share / cart / favourite icon links
    "a.new-share__btn",
    "a.new-share__link",
    "a.cart",
    'a[class*="favourite"]',
    'a[class*="favorite"]',
    'a[class*="wishlist"]',
    // previous / next pager arrows
    ".pager-btn-group a",
    ".pager a",
    // related pack cards
    ".related-content-packs a"
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
  var import_content_detail_default = {
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
  return __toCommonJS(import_content_detail_exports);
})();
