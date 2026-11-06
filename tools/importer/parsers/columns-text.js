/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-text variant. Base: columns.
 * Source: https://media.jlr.com/defender/en-gb/news/... (content-detail footer copy)
 * Selector: .page-news > .wrapper.keyline
 * Structure: one row, two cells:
 *   cell 1 -> "Further information" heading + social link paragraphs
 *   cell 2 -> "Notes to Editors" heading + footnotes, intro, price table (kept as a
 *             table inside the cell — blocks cannot nest), About / Important Notice copy
 * Columns blocks take no xwalk field hints.
 */
export default function parse(element, { document }) {
  const container = element.querySelector('.additional-information') || element.querySelector('.container') || element;
  let columns = Array.from(container.querySelectorAll(':scope > .col-first, :scope > .notes-to-editors'));
  if (!columns.length) {
    columns = Array.from(container.children).filter((col) => col.textContent.trim());
  }

  const buildCell = (col) => {
    const cell = [];
    const heading = col.querySelector('.foot-titles, h1, h2, h3, h4');
    if (heading && heading.textContent.trim()) {
      const h = document.createElement(/^H[1-6]$/.test(heading.tagName) ? heading.tagName.toLowerCase() : 'h2');
      h.textContent = heading.textContent.replace(/\s+/g, ' ').trim();
      cell.push(h);
    }
    // Rich text body: Drupal .field wrapper holds the paragraphs / table
    const body = col.querySelector('.field--type-text-long') || col.querySelector('.field') || col;
    Array.from(body.childNodes).forEach((node) => {
      if (node === heading || (node.nodeType === 1 && node.contains(heading))) return;
      if (node.nodeType === 3) {
        if (node.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = node.textContent.trim();
          cell.push(p);
        }
        return;
      }
      if (node.nodeType !== 1) return;
      if (!node.textContent.trim() && !node.querySelector('img, table')) return;
      cell.push(node);
    });
    return cell;
  };

  const row = columns.map(buildCell);
  while (row.length < 2) row.push('');

  const cells = [row];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-text', cells });
  element.replaceWith(block);
}
