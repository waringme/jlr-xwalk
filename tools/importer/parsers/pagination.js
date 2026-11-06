/* eslint-disable */
/* global WebImporter */

/**
 * Parser for pagination variant (custom block).
 * Source: https://media.jlr.com/defender/en-gb/news/... (content-detail Previous / Next article pager)
 * Selector: .wrapper.strip .pager-btn-group
 * Model (xwalk, standalone): rows -> [pages] [link] [nextLink]
 *   pages        (text, total page count — not used by the article pager, left empty)
 *   link         (aem-content, Previous article; linkText collapsed)
 *   nextLink     (aem-content, Next article; nextLinkText collapsed)
 * The block renders Previous / Next arrow buttons when no page count is authored.
 */
export default function parse(element, { document }) {
  const cleanHref = (a) => (a && a.getAttribute('href') ? a.getAttribute('href').trim() : '');
  const isRealHref = (href) => href && href !== '#' && !href.startsWith('javascript:');

  const links = Array.from(element.querySelectorAll('a[href]')).filter((a) => isRealHref(cleanHref(a)));

  // Classify by visible text / arrow icon; icon-only links may carry placeholder text
  const isPrev = (a) => {
    const text = `${a.textContent} ${a.getAttribute('aria-label') || ''} ${a.getAttribute('title') || ''} ${a.getAttribute('rel') || ''}`.toLowerCase();
    const wrapper = a.closest('.btn') || a.parentElement;
    return /prev|back/.test(text) || !!(wrapper && wrapper.querySelector('.jlrnew-arrow_left'));
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
    const a = document.createElement('a');
    a.setAttribute('href', cleanHref(src));
    a.textContent = label;
    frag.appendChild(a);
    return frag;
  };

  // Listing pager (vehicle-detail .new-grid__pager): "[input] of N" with javascript: arrows.
  // Author the total page count; the block builds ?page= links itself.
  const totalEl = element.querySelector('.new-grid__pager-text');
  const totalMatch = totalEl ? totalEl.textContent.match(/\d+/) : null;
  const pagesFrag = document.createDocumentFragment();
  if (totalMatch) {
    pagesFrag.appendChild(document.createComment(' field:pages '));
    pagesFrag.appendChild(document.createTextNode(totalMatch[0]));
  }

  const cells = [
    [pagesFrag], // pages (listing pager only; empty on the article pager)
    [buildLink(prev, 'link', 'Previous')],
    [buildLink(next, 'nextLink', 'Next')],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'pagination', cells });
  element.replaceWith(block);
}
