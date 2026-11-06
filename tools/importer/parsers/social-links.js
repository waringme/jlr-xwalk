/* eslint-disable */
/* global WebImporter */

/**
 * Parser for social-links variant (custom block).
 * Source: https://media.jlr.com/defender/en-gb ("Join the conversation" social bar)
 * Selectors: .follow-component.social-bar__home, .social-bar__home
 * Model (xwalk):
 *   social-links (block): label (text)            -> first row
 *   social-link (item):   link (aem-content), linkText collapsed into the link text -> one row per link
 */
export default function parse(element, { document }) {
  const NETWORKS = [
    { test: /instagram\.com/i, name: 'Instagram' },
    { test: /(youtube\.com|youtu\.be)/i, name: 'YouTube' },
    { test: /facebook\.com/i, name: 'Facebook' },
    { test: /tiktok\.com/i, name: 'TikTok' },
    { test: /linkedin\.com/i, name: 'LinkedIn' },
    { test: /(\/\/|\.)(x|twitter)\.com/i, name: 'X' },
    { test: /(feed|rss)/i, name: 'RSS Feed' },
  ];
  const networkName = (href) => {
    const match = NETWORKS.find((n) => n.test.test(href));
    return match ? match.name : '';
  };

  const cells = [];

  // Row 1: label
  const labelEl = element.querySelector('.media-links .bt-hero-text, .bt-hero-text');
  const labelText = labelEl ? labelEl.textContent.trim() : '';
  if (labelText) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:label '));
    frag.appendChild(document.createTextNode(labelText));
    cells.push([frag]);
  } else {
    cells.push(['']);
  }

  // Rows 2..n: one social link each
  const links = Array.from(element.querySelectorAll('.homepage-social-icons a[href], .social-bar a[href]'))
    .filter((a, i, arr) => arr.indexOf(a) === i);
  links.forEach((link) => {
    const href = link.getAttribute('href').trim();
    if (!href) return;
    // Source links are icon-only. Accessible name (linkText) is "Link to <Network>";
    // any text an import onLoad hook injected (e.g. the network name) is normalised
    // to the same value so direct and html2md runs author identical content.
    const visible = link.textContent.trim();
    const name = networkName(href);
    const a = document.createElement('a');
    a.setAttribute('href', href);
    a.textContent = name ? `Link to ${name}` : (visible || href);
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:link '));
    frag.appendChild(a);
    cells.push([frag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'social-links', cells });
  element.replaceWith(block);
}
