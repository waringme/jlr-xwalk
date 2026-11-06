/* eslint-disable */
/* global WebImporter */

/**
 * Parser for media-actions variant (custom block).
 * Source: https://media.jlr.com/defender/en-gb/news/... (content-detail, toolbar under the article title)
 * Selector: .page-news .info-box .download-group
 * Model (xwalk, standalone): rows -> [title] [links]
 *   title  (text, asset title — not shown in the source toolbar, left empty)
 *   links  (richtext, download link(s); one link = direct download)
 * Cart / share controls are rendered by the block itself (no authored content).
 */
export default function parse(element, { document }) {
  const cleanHref = (a) => (a && a.getAttribute('href') ? a.getAttribute('href').trim() : '');
  const isRealHref = (href) => href && href !== '#' && !href.startsWith('/#') && !href.startsWith('javascript:');

  // Icon-only links get a placeholder text (aria-label / title / class) from the
  // import script's onLoad so they survive preprocessing; turn it into a final label.
  const labelOf = (a, fallback) => {
    const text = (a.textContent || '').replace(/\s+/g, ' ').trim();
    const cls = (a.getAttribute('class') || '').trim();
    if (!text || text === cls || text === 'link' || /jlr-download-btn|new-share__/.test(text)) return fallback;
    return text;
  };

  // Download links only: skip AddToAny share links and cart/share widgets.
  const links = Array.from(element.querySelectorAll('a[href]'))
    .filter((a) => !a.closest('.new-share__btn, .new-share__wrapper, .a2a_kit'))
    .filter((a) => isRealHref(cleanHref(a)));

  const cells = [];

  // Row 1: title (no visible asset title in the source toolbar)
  cells.push(['']);

  // Row 2: download links
  const linksFrag = document.createDocumentFragment();
  if (links.length) {
    linksFrag.appendChild(document.createComment(' field:links '));
    links.forEach((link) => {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', cleanHref(link));
      a.textContent = labelOf(link, 'Download');
      p.appendChild(a);
      linksFrag.appendChild(p);
    });
  }
  cells.push([linksFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'media-actions', cells });
  element.replaceWith(block);
}
