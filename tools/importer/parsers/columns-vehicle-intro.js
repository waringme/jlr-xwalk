/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-vehicle-intro variant. Base: columns.
 * Source: https://media.jlr.com/defender/en-gb/vehicle/defender-110 (vehicle-detail)
 * Selector: .vehicle-page > .container.vehicle .vehicle-name.caption-holder
 * Source structure:
 *   .caption-table .caption-cell h1.page-title     -> model name (page H1)
 *   .hero-thumbnail-one img / .hero-thumbnail-two img -> two thumbnails beside the name
 *   (model-year links, when a page has them, are any a[href] outside the heading)
 * Table: one row, two cells -> [heading] | [year links | thumbnail images]
 * Columns blocks (xwalk core columns component) take no field hints.
 */
export default function parse(element, { document }) {
  const cleanHref = (a) => (a && a.getAttribute('href') ? a.getAttribute('href').trim() : '');
  const isRealHref = (href) => href && href !== '#' && !href.startsWith('/#') && !href.startsWith('javascript:');

  // Column 1: model name heading (kept as H1 — it is the page title)
  const headingCell = [];
  const titleEl = element.querySelector('.caption-cell h1, .caption-cell h2, .caption-table .page-title, h1');
  if (titleEl && titleEl.textContent.trim()) {
    const level = /^H[1-6]$/.test(titleEl.tagName) ? titleEl.tagName : 'H1';
    const h = document.createElement(level);
    h.textContent = titleEl.textContent.replace(/\s+/g, ' ').trim();
    headingCell.push(h);
  }

  // Column 2: model-year links (if any), then the thumbnail images
  const sideCell = [];
  const links = Array.from(element.querySelectorAll('a[href]'))
    .filter((a) => !titleEl || !titleEl.contains(a))
    .filter((a) => isRealHref(cleanHref(a)) && a.textContent.trim());
  if (links.length) {
    const ul = document.createElement('ul');
    links.forEach((src) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.setAttribute('href', cleanHref(src));
      a.textContent = src.textContent.replace(/\s+/g, ' ').trim();
      li.appendChild(a);
      ul.appendChild(li);
    });
    sideCell.push(ul);
  }

  const modelName = headingCell.length ? headingCell[0].textContent : '';
  Array.from(element.querySelectorAll('img'))
    .filter((img) => {
      const src = img.getAttribute('src') || '';
      return src && !src.startsWith('data:');
    })
    .forEach((img) => {
      if (!img.getAttribute('alt') && modelName) img.setAttribute('alt', modelName);
      sideCell.push(img);
    });

  const cells = [[headingCell, sideCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-vehicle-intro', cells });
  element.replaceWith(block);
}
