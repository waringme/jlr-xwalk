/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero (boilerplate block).
 * Source: https://media.jlr.com/defender/en-gb/news (media-listing, news listings only)
 * Selector: .region-content > .news-page .hero-component (featured article above the grid)
 * Source structure: .image-holder > img (hero_crop) + share/cart/download icons (not content),
 *   .info-box: h2.hero-component__title, p.hero-component__text (teaser),
 *   p.hero-component__date, a.hero-component__button "Find out more" (article URL).
 * Model (xwalk): hero -> rows [image] [text]
 *   image  (reference, imageAlt collapsed)
 *   text   (richtext: title heading, teaser, date, Find out more link)
 */
export default function parse(element, { document }) {
  const norm = (s) => (s || '').replace(/&nbsp;/g, ' ').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
  const cleanHref = (a) => (a && a.getAttribute('href') ? a.getAttribute('href').trim() : '');
  const isRealHref = (href) => href && href !== '#' && !href.startsWith('/#') && !href.startsWith('javascript:');

  const titleEl = element.querySelector('.hero-component__title, .bt-hero-title, .info-box h1, .info-box h2');
  const title = norm(titleEl ? titleEl.textContent : '');
  const ctaEl = Array.from(element.querySelectorAll('.info-box a[href], a.hero-component__button'))
    .find((a) => isRealHref(cleanHref(a)));

  // Row 1: image (lazy images may carry a data: placeholder in src)
  const imageFrag = document.createDocumentFragment();
  const img = element.querySelector('.image-holder img, img');
  if (img) {
    const src = (img.getAttribute('src') || '').trim();
    const realSrc = src && !src.startsWith('data:') ? src : (img.getAttribute('data-original') || '').trim();
    if (realSrc) {
      img.setAttribute('src', realSrc);
      if (!norm(img.getAttribute('alt')) && title) img.setAttribute('alt', title);
      imageFrag.appendChild(document.createComment(' field:image '));
      imageFrag.appendChild(img);
    }
  }

  // Row 2: text
  const textFrag = document.createDocumentFragment();
  textFrag.appendChild(document.createComment(' field:text '));
  if (title) {
    const h = document.createElement(titleEl && /^H[1-6]$/.test(titleEl.tagName) ? titleEl.tagName : 'h2');
    h.textContent = title;
    textFrag.appendChild(h);
  }
  const teaserEl = element.querySelector('.hero-component__text, .bt-hero-text');
  const teaser = norm(teaserEl ? teaserEl.textContent : '');
  if (teaser) {
    const p = document.createElement('p');
    p.textContent = teaser;
    textFrag.appendChild(p);
  }
  const dateEl = element.querySelector('.hero-component__date, .bt-hero-date');
  const date = norm(dateEl ? dateEl.textContent : '');
  if (date) {
    const p = document.createElement('p');
    p.textContent = date;
    textFrag.appendChild(p);
  }
  if (ctaEl) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.setAttribute('href', cleanHref(ctaEl));
    a.textContent = norm(ctaEl.textContent) || 'Find out more';
    p.appendChild(a);
    textFrag.appendChild(p);
  }

  const cells = [[imageFrag], [textFrag]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
