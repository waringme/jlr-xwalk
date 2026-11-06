/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-gallery variant. Base: cards.
 * Source: https://media.jlr.com/defender/en-gb (Latest Image Packs / Latest Video Packs)
 * Selectors: .view-display-id-latest_image_packs, .view-display-id-latest_video_packs
 * Repeating unit: .modern-packs__panel (image packs also carry .modern-news__container)
 * Model (xwalk): container of cards-gallery-item rows -> [image | count | text]
 *   image  (reference, imageAlt collapsed)
 *   count  (text, e.g. "8 Images" / "1 Video")
 *   text   (richtext: date, linked title, teaser, Download link)
 */
/**
 * Article related packs (content-detail).
 * Source: https://media.jlr.com/defender/en-gb/news/... (Related image packs, dark section)
 * Selector: .related-content-packs section.jlr-tabs__block-wrapper
 * Repeating unit: desktop tile .gallery-item.gallery-box (image, count, date, title,
 * teaser, Download ZIP). The tiles carry no pack link; the hidden mobile slider
 * (.gallery-item.hidden-md li) repeats the same packs WITH links, so pack URLs are
 * paired by title, then by document order. Emitted with the "alt" option.
 */
function parseRelatedPacks(element, document, cleanHref) {
  // Teasers carry double-escaped entities (literal "&nbsp;" text) and real NBSPs
  const norm = (s) => (s || '').replace(/&nbsp;/g, ' ').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
  const labelOf = (a, fallback) => {
    const text = norm(a.textContent);
    const cls = (a.getAttribute('class') || '').trim();
    if (!text || text === cls || text === 'link' || /jlr-download-btn|new-share__/.test(text)) return fallback;
    return text;
  };

  // Pack links from the mobile slider, in document order
  const mobileLinks = [];
  element.querySelectorAll('.gallery-item:not(.gallery-box) li').forEach((li) => {
    const a = Array.from(li.querySelectorAll('a[href]')).find((l) => /image-packs|video-packs|\/packs?\//.test(cleanHref(l)))
      || li.querySelector('a[href]');
    if (!a) return;
    const titleEl = li.querySelector('.title, h3');
    mobileLinks.push({ href: cleanHref(a), title: norm(titleEl ? titleEl.textContent : '') });
  });

  const tiles = Array.from(element.querySelectorAll('.gallery-item.gallery-box'));
  const cells = [];

  tiles.forEach((tile, index) => {
    const titleEl = tile.querySelector('.content-head .bt-gallery-title, .content-head .title');
    const title = norm(titleEl ? titleEl.textContent : '');
    const match = mobileLinks.find((m) => m.title && m.title === title) || mobileLinks[index];
    const href = match ? match.href : '';

    // Column 1: image (tile thumbnail, not the expander gallery images)
    const imageFrag = document.createDocumentFragment();
    const img = tile.querySelector('.gallery-contents .thumb2-ratio-stretch img, .gallery-contents img');
    if (img) {
      if (!img.getAttribute('alt') && title) img.setAttribute('alt', title);
      imageFrag.appendChild(document.createComment(' field:image '));
      imageFrag.appendChild(img);
    }

    // Column 2: count badge ("8 Images")
    const countFrag = document.createDocumentFragment();
    const countNum = tile.querySelector('.gallery-contents .bt-image-count');
    const countText = tile.querySelector('.gallery-contents .bt-image-count-text');
    if (countNum && countNum.textContent.trim()) {
      countFrag.appendChild(document.createComment(' field:count '));
      countFrag.appendChild(document.createTextNode(
        `${countNum.textContent.trim()} ${countText ? countText.textContent.trim() : ''}`.trim(),
      ));
    }

    // Column 3: text (date, linked title, teaser, download)
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    const dateEl = tile.querySelector('.content-head .bt-gallery-date, .content-head .date');
    if (dateEl && norm(dateEl.textContent)) {
      const p = document.createElement('p');
      p.textContent = norm(dateEl.textContent);
      textFrag.appendChild(p);
    }

    if (title) {
      const h = document.createElement('h3');
      if (href) {
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = title;
        h.appendChild(a);
      } else {
        h.textContent = title;
      }
      textFrag.appendChild(h);
    }

    const teaser = tile.querySelector('.content-head .bt-gallery-overlay-desc, .content-head p');
    if (teaser && norm(teaser.textContent)) {
      const p = document.createElement('p');
      p.textContent = norm(teaser.textContent);
      textFrag.appendChild(p);
    }

    const downloadLink = Array.from(tile.querySelectorAll('.content-foot a.jlr-download-btn, .content-foot .download-group a[href]'))
      .find((a) => cleanHref(a) && cleanHref(a) !== '#');
    if (downloadLink) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', cleanHref(downloadLink));
      a.textContent = labelOf(downloadLink, 'Download');
      p.appendChild(a);
      textFrag.appendChild(p);
    }

    cells.push([imageFrag, countFrag, textFrag]);
  });

  return cells;
}

/**
 * Vehicle media archive grid (vehicle-detail, active tab Images / Image Packs / Video ...).
 * Source: https://media.jlr.com/classic/en-gb/vehicle/e-type
 * Selector: #my-tab-content .card-grid:has(> .gallery-item)
 * Repeating unit: .gallery-item (image tile: widescreen image, date, often-blank title,
 * Download dropdown with High / Low Resolution links; description lives in the hidden
 * .gallery-expander). Pack / video tiles may also carry a count badge and a link.
 * Emitted with the default option (light-grey section).
 */
function parseListingGrid(element, document, cleanHref) {
  const norm = (s) => (s || '').replace(/&nbsp;/g, ' ').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
  const isRealHref = (href) => href && href !== '#' && !href.startsWith('/#') && !href.startsWith('javascript:');
  const cells = [];

  Array.from(element.querySelectorAll(':scope > .gallery-item')).forEach((tile) => {
    const contents = tile.querySelector('.gallery-contents') || tile;
    const titleEl = contents.querySelector('.content-head .bt-gallery-title, .content-head .title, h3');
    const title = norm(titleEl ? titleEl.textContent : '');
    const descEl = tile.querySelector('.image-description, .bt-modal-desc, .content-head .bt-gallery-overlay-desc, .content-head p');
    const desc = norm(descEl ? descEl.textContent : '');
    const linkEl = Array.from(contents.querySelectorAll('a[href]'))
      .find((a) => isRealHref(cleanHref(a)) && !a.matches('.jlr-download-btn, .download')
        && !a.closest('.content-foot, .download-group, .new-share, .dropdown-menu'));
    const href = linkEl ? cleanHref(linkEl) : '';

    // Column 1: image
    const imageFrag = document.createDocumentFragment();
    // Pack tiles lazy-load: src is a 1x1 data: placeholder, real URL in data-original;
    // the hidden mobile copy (.image-top img) carries the real src.
    let img = contents.querySelector('img');
    const realSrc = (el) => {
      if (!el) return '';
      const src = (el.getAttribute('src') || '').trim();
      return src && !src.startsWith('data:') ? src : (el.getAttribute('data-original') || '').trim();
    };
    if (!realSrc(img)) img = tile.querySelector('.image-top img');
    if (img && realSrc(img)) {
      img.setAttribute('src', realSrc(img));
      if (!norm(img.getAttribute('alt'))) img.setAttribute('alt', title || desc);
      imageFrag.appendChild(document.createComment(' field:image '));
      imageFrag.appendChild(img);
    }

    // Column 2: count badge (packs only)
    const countFrag = document.createDocumentFragment();
    const countNum = contents.querySelector('.bt-image-count');
    const countText = contents.querySelector('.bt-image-count-text');
    if (countNum && countNum.textContent.trim()) {
      countFrag.appendChild(document.createComment(' field:count '));
      countFrag.appendChild(document.createTextNode(
        `${countNum.textContent.trim()} ${countText ? countText.textContent.trim() : ''}`.trim(),
      ));
    }

    // Column 3: date, title (or description when the title is blank), download links
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    const dateEl = contents.querySelector('.content-head .bt-gallery-date, .content-head .date, .new-card__date');
    if (dateEl && norm(dateEl.textContent)) {
      const p = document.createElement('p');
      p.textContent = norm(dateEl.textContent);
      textFrag.appendChild(p);
    }
    const heading = title || desc;
    if (heading) {
      const h = document.createElement('h3');
      if (href) {
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = heading;
        h.appendChild(a);
      } else {
        h.textContent = heading;
      }
      textFrag.appendChild(h);
    }
    if (title && desc && desc !== title) {
      const p = document.createElement('p');
      p.textContent = desc;
      textFrag.appendChild(p);
    }
    const seen = new Set();
    Array.from(contents.querySelectorAll('.content-foot .dropdown-menu a[href], .content-foot a.jlr-download-btn[href], .content-foot a.download[href]'))
      .forEach((a) => {
        const dl = cleanHref(a);
        if (!isRealHref(dl) || seen.has(dl)) return;
        seen.add(dl);
        const text = norm(a.textContent);
        const p = document.createElement('p');
        const link = document.createElement('a');
        link.setAttribute('href', dl);
        link.textContent = text && !/jlr-download-btn|new-share__|^link$/.test(text) ? text : 'Download';
        p.appendChild(link);
        textFrag.appendChild(p);
      });

    cells.push([imageFrag, countFrag, textFrag]);
  });

  return cells;
}

export default function parse(element, { document }) {
  const cleanHref = (a) => (a && a.getAttribute('href') ? a.getAttribute('href').trim() : '');

  // vehicle-detail: media archive grid (tab other than News) -> default option
  // media-listing (/<brand>/<locale>/images | image-packs | video-packs): same .gallery-item
  // tiles; single-photo grids (no count badge) -> default, pack grids (count badge) -> alt-2.
  if (element.matches('.card-grid') && element.querySelector(':scope > .gallery-item')) {
    const isVehicleTab = !!element.closest('#my-tab-content');
    const isPackGrid = !!element.querySelector(':scope > .gallery-item .bt-image-count');
    const gridBlock = WebImporter.Blocks.createBlock(document, {
      name: 'cards-gallery',
      ...(!isVehicleTab && isPackGrid ? { variants: ['alt-2'] } : {}),
      cells: parseListingGrid(element, document, cleanHref),
    });
    element.replaceWith(gridBlock);
    return;
  }

  // content-detail: article related packs (no .modern-packs__panel markup)
  if (!element.querySelector('.modern-packs__panel') && element.querySelector('.gallery-item.gallery-box')) {
    const relatedCells = parseRelatedPacks(element, document, cleanHref);
    const relatedBlock = WebImporter.Blocks.createBlock(document, {
      name: 'cards-gallery',
      variants: ['alt'],
      cells: relatedCells,
    });
    element.replaceWith(relatedBlock);
    return;
  }

  // brand-landing: Latest Image Packs / Latest Video Packs
  const items = Array.from(element.querySelectorAll('.modern-packs__panel'));
  const cells = [];

  items.forEach((item) => {
    const titleEl = item.querySelector('.new-card__title, .bt-card-heading');
    const titleLink = titleEl ? titleEl.closest('a') : null;
    const imageLink = item.querySelector('a.modern-packs__image-wrap');
    const href = cleanHref(titleLink) || cleanHref(imageLink);

    // Column 1: image
    const imageFrag = document.createDocumentFragment();
    const img = item.querySelector('.modern-packs__image img');
    if (img) {
      imageFrag.appendChild(document.createComment(' field:image '));
      imageFrag.appendChild(img);
    }

    // Column 2: count badge ("8 Images")
    const countFrag = document.createDocumentFragment();
    const countNum = item.querySelector('.bt-image-count');
    const countText = item.querySelector('.bt-image-count-text');
    if (countNum && countNum.textContent.trim()) {
      countFrag.appendChild(document.createComment(' field:count '));
      countFrag.appendChild(document.createTextNode(
        `${countNum.textContent.trim()} ${countText ? countText.textContent.trim() : ''}`.trim(),
      ));
    }

    // Column 3: text (date, title, teaser, download)
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    const dateEl = item.querySelector('.new-card__date');
    const dateText = dateEl ? dateEl.textContent.trim() : '';
    if (dateText) {
      const p = document.createElement('p');
      p.textContent = dateText;
      textFrag.appendChild(p);
    }

    if (titleEl && titleEl.textContent.trim()) {
      const h = document.createElement(/^H[1-6]$/.test(titleEl.tagName) ? titleEl.tagName : 'h3');
      if (href) {
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = titleEl.textContent.trim();
        h.appendChild(a);
      } else {
        h.textContent = titleEl.textContent.trim();
      }
      textFrag.appendChild(h);
    }

    const teaser = item.querySelector('.new-card__teaser, .bt-card-description');
    if (teaser && teaser.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = teaser.textContent.trim();
      textFrag.appendChild(p);
    }

    const downloadLink = Array.from(item.querySelectorAll('.download-group a.new-share__btn'))
      .find((a) => cleanHref(a) && cleanHref(a) !== '#');
    if (downloadLink) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', cleanHref(downloadLink));
      a.textContent = 'Download';
      p.appendChild(a);
      textFrag.appendChild(p);
    }

    cells.push([imageFrag, countFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
