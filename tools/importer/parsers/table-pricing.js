/* eslint-disable */
/* global WebImporter */

/**
 * Parser for table-pricing variant (custom block, library "Table" convention).
 * Source: https://media.jlr.com/classic/en-gb/news/2025/07/defender-octa-black-tough-luxury-4x4-rock-star
 *   (content-detail, "Spec & Price Overview" data tables inside the article body WYSIWYG)
 * Selector: .page-news .field--item > .container.wysiwyg table
 * Structure: first row = block name only; every following row = one data row whose
 *   cells are the table cells (first data row is the header row, block default).
 *   All rows get the same number of cells (colspans padded with empty cells).
 * Model (xwalk, container): rows -> table-pricing-col-N items (column1text..columnNtext).
 * Without this parser the importer turns a bare <table> into a block named after its
 * first cell (e.g. "Body Style"), which does not exist.
 */
export default function parse(element, { document }) {
  const rows = Array.from(element.querySelectorAll(':scope > thead > tr, :scope > tbody > tr, :scope > tfoot > tr, :scope > tr'))
    .filter((tr) => tr.textContent.trim() || tr.querySelector('img'));
  if (!rows.length) {
    element.remove();
    return;
  }

  const spanOf = (cell) => Math.max(1, parseInt(cell.getAttribute('colspan') || '1', 10) || 1);
  const width = Math.max(...rows.map((tr) => Array.from(tr.children)
    .reduce((n, cell) => n + spanOf(cell), 0)));

  const cells = rows.map((tr) => {
    const row = [];
    Array.from(tr.children).forEach((cell) => {
      const frag = document.createDocumentFragment();
      Array.from(cell.childNodes).forEach((n) => frag.appendChild(n));
      row.push(frag);
      for (let i = 1; i < spanOf(cell); i += 1) row.push('');
    });
    while (row.length < width) row.push('');
    return row;
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'table-pricing', cells });
  element.replaceWith(block);
}
