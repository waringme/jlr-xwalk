/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-press-image variant. Base: columns.
 * Source: https://media.jlr.com/defender/en-gb/news/... (content-detail)
 * Selector: .page-news .field--item > .container:has(> .row.lightback)
 * Structure: one row, two cells in source order (image either side):
 *   media cell -> image, asset title heading (h5), download links (High-Res / Low-Res)
 *   text cell  -> article paragraphs from .panel-body
 * Columns blocks take no xwalk field hints.
 */
export default function parse(element, { document }) {
  const cleanHref = (a) => (a && a.getAttribute('href') ? a.getAttribute('href').trim() : '');
  const isRealHref = (href) => href && href !== '#' && !href.startsWith('/#') && !href.startsWith('javascript:');
  const labelOf = (a, fallback) => {
    const text = (a.textContent || '').replace(/\s+/g, ' ').trim();
    const cls = (a.getAttribute('class') || '').trim();
    if (!text || text === cls || text === 'link' || /jlr-download-btn|new-share__/.test(text)) return fallback;
    return text;
  };

  // Two layouts: `.row.lightback` (grey panel) and plain `.row.text-image`
  // (col-md-6 hover-prt-wrapper image + col-md-6 panel-body text).
  const row = element.querySelector(':scope > .row.lightback') || element.querySelector('.row.lightback')
    || element.querySelector(':scope > .row.text-image') || element;
  const columns = Array.from(row.children)
    .filter((col) => col.tagName === 'IMG' || col.textContent.trim() || col.querySelector('img'));

  const buildMediaCell = (col) => {
    const cell = [];
    const img = (col.tagName === 'IMG' ? [col] : Array.from(col.querySelectorAll('img')))
      .find((i) => (i.getAttribute('src') || '') && !(i.getAttribute('src') || '').startsWith('data:')
        && !i.closest('.a2a_kit, .new-share__wrapper, .hover-prt'));
    if (img) cell.push(img);

    const titleEl = col.querySelector('.hover-prt h1, .hover-prt h2, .hover-prt h3, .hover-prt h4, .hover-prt h5, .hover-prt h6, .hover-prt p');
    const title = titleEl ? titleEl.textContent.replace(/\s+/g, ' ').trim() : '';
    if (title) {
      const h = document.createElement('h5');
      h.textContent = title;
      cell.push(h);
    }

    const links = Array.from(col.querySelectorAll('.dropdown-menu a[href], .download-group a.jlr-download-btn[href]'))
      .filter((a, i, arr) => arr.indexOf(a) === i && isRealHref(cleanHref(a)));
    links.forEach((link, i) => {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', cleanHref(link));
      a.textContent = labelOf(link, links.length > 1 ? (i === 0 ? 'High-Res' : 'Low-Res') : 'Download');
      p.appendChild(a);
      cell.push(p);
    });
    return cell;
  };

  const buildTextCell = (col) => {
    const body = col.querySelector('.panel-body') || col;
    // Skip empty placeholders (e.g. `<h5 class="h1 light"></h5>`)
    const keep = (n) => (n.nodeType === 1 && (n.textContent.trim() || n.querySelector('img, picture')))
      || (n.nodeType === 3 && n.textContent.trim());
    let nodes = Array.from(body.childNodes).filter(keep);
    if (nodes.length === 1 && nodes[0].nodeType === 1 && nodes[0].tagName === 'DIV') {
      nodes = Array.from(nodes[0].childNodes).filter(keep);
    }
    return nodes;
  };

  // `.image-with-inset-text`: the <img> itself is a direct child next to the inset text box
  const cellsRow = columns.map((col) => (col.tagName === 'IMG' || col.tagName === 'PICTURE'
    || col.classList.contains('hover-prt-wrapper') || col.querySelector(':scope > img')
    ? buildMediaCell(col)
    : buildTextCell(col)));

  // Fixed two-column layout: pad if one side is missing
  while (cellsRow.length < 2) cellsRow.push('');

  const cells = [cellsRow];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-press-image', cells });
  element.replaceWith(block);
}
