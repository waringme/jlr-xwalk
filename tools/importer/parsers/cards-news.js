/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-news variant. Base: cards.
 * Source: https://media.jlr.com/defender/en-gb (Latest News grid)
 * Selector: .view-display-id-latest_news
 * Also: https://media.jlr.com/defender/en-gb/vehicle/defender-110 (vehicle-detail News tab)
 * Selector: #my-tab-content .card-grid:has(> .news-box) — same .modern-news__panel items,
 * image nested in a.modern-news__image-wrap, no Read more link.
 * Model (xwalk): container of cards-news-item rows -> [image | count | text]
 *   image  (reference, imageAlt collapsed)
 *   count  (text, "8 Images" badge — not present on news cards, left empty)
 *   text   (richtext: date, linked title, teaser, Read more link)
 */
export default function parse(element, { document }) {
  const cleanHref = (a) => (a && a.getAttribute('href') ? a.getAttribute('href').trim() : '');

  const items = Array.from(element.querySelectorAll('.modern-news__panel'));
  const cells = [];

  items.forEach((item) => {
    // Card URL: title link, read-more link, then image overlay link
    const titleEl = item.querySelector('.new-card__title, .bt-card-heading, h3');
    const readMoreLink = item.querySelector('.read-more a, .modern-news__link-wrap a');
    const imageLink = item.querySelector('a.modern-news__image-wrap');
    const titleLink = titleEl ? titleEl.closest('a') || titleEl.querySelector('a') : null;
    const href = cleanHref(titleLink) || cleanHref(readMoreLink) || cleanHref(imageLink);

    // Column 1: image
    const imageFrag = document.createDocumentFragment();
    // brand-landing: .image > a > .modern-news__image > img
    // vehicle-detail: .news-box > a.modern-news__image-wrap > div > img
    const img = item.querySelector('.modern-news__image img, .image img, a.modern-news__image-wrap img');
    if (img) {
      imageFrag.appendChild(document.createComment(' field:image '));
      imageFrag.appendChild(img);
    }

    // Column 2: count badge (not used by news cards)
    const countFrag = document.createDocumentFragment();
    const countNum = item.querySelector('.bt-image-count');
    const countText = item.querySelector('.bt-image-count-text');
    if (countNum && countNum.textContent.trim()) {
      countFrag.appendChild(document.createComment(' field:count '));
      countFrag.appendChild(document.createTextNode(
        `${countNum.textContent.trim()} ${countText ? countText.textContent.trim() : ''}`.trim(),
      ));
    }

    // Column 3: text (date, title, teaser, read more)
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    const dateEl = item.querySelector('.new-card__date, .bt-card-date time');
    const dateText = dateEl ? dateEl.textContent.trim() : '';
    if (dateText) {
      const p = document.createElement('p');
      p.textContent = dateText;
      textFrag.appendChild(p);
    }

    if (titleEl && titleEl.textContent.trim()) {
      const h = document.createElement(titleEl.tagName.toLowerCase().match(/^h[1-6]$/) ? titleEl.tagName : 'h3');
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

    // Download link (only when the source provides a real archive URL)
    const downloadLink = Array.from(item.querySelectorAll('a.new-share__btn'))
      .find((a) => cleanHref(a) && cleanHref(a) !== '#');
    if (downloadLink) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', cleanHref(downloadLink));
      a.textContent = 'Download';
      p.appendChild(a);
      textFrag.appendChild(p);
    }

    const readMoreHref = cleanHref(readMoreLink) || href;
    if (readMoreLink && readMoreHref) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', readMoreHref);
      a.textContent = readMoreLink.textContent.trim() || 'Read more';
      p.appendChild(a);
      textFrag.appendChild(p);
    }

    cells.push([imageFrag, countFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-news', cells });
  element.replaceWith(block);
}
