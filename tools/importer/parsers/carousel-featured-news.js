/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-featured-news variant. Base: carousel.
 * Source: https://media.jlr.com/defender/en-gb (home hero slider)
 * Selectors: .slider-home-page, .view-home-page-slider
 * Repeating unit: .hero-component (slick slide; .slick-cloned duplicates skipped)
 * Model (xwalk): container of carousel-featured-news-item rows -> [media_image | content_text]
 *   media_image  (reference, media_imageAlt collapsed)
 *   content_text (richtext: linked title, description, date, Find Out More CTA, Download link)
 */
export default function parse(element, { document }) {
  const cleanHref = (a) => (a && a.getAttribute('href') ? a.getAttribute('href').trim() : '');

  const slides = Array.from(element.querySelectorAll('.hero-component'))
    .filter((slide) => !slide.classList.contains('slick-cloned'));

  // Both mapped selectors (.view-home-page-slider wraps .slider-home-page) can
  // match the same carousel. If the inner one was already parsed, keep that
  // block instead of replacing it with an empty one.
  if (!slides.length) {
    const existing = element.querySelector('table');
    if (existing) element.replaceWith(existing);
    return;
  }

  const cells = [];

  slides.forEach((slide) => {
    const titleEl = slide.querySelector('.hero-component__title, .bt-hero-title');
    const titleLink = titleEl ? titleEl.querySelector('a') : null;
    const ctaLink = slide.querySelector('a.hero-component__button, a.btn-find-out-more');
    const imageLink = slide.querySelector('.home-slider-responsive a');
    const href = cleanHref(titleLink) || cleanHref(ctaLink) || cleanHref(imageLink);

    // Column 1: background image
    const imageFrag = document.createDocumentFragment();
    const img = slide.querySelector('.home-slider-responsive img, .field--name-field-media-image img');
    if (img) {
      imageFrag.appendChild(document.createComment(' field:media_image '));
      imageFrag.appendChild(img);
    }

    // Column 2: text content
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:content_text '));

    if (titleEl && titleEl.textContent.trim()) {
      const h = document.createElement(/^H[1-6]$/.test(titleEl.tagName) ? titleEl.tagName : 'h2');
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

    const desc = slide.querySelector('.hero-component__text');
    if (desc && desc.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      textFrag.appendChild(p);
    }

    const dateEl = slide.querySelector('.hero-component__date, .bt-hero-date');
    if (dateEl && dateEl.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = dateEl.textContent.trim();
      textFrag.appendChild(p);
    }

    if (ctaLink && cleanHref(ctaLink)) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', cleanHref(ctaLink));
      a.textContent = ctaLink.textContent.trim() || 'Find Out More';
      p.appendChild(a);
      textFrag.appendChild(p);
    }

    const downloadLink = slide.querySelector('a.jlr-download-btn, a.new-share__hero-download');
    if (downloadLink && cleanHref(downloadLink)) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', cleanHref(downloadLink));
      a.textContent = 'Download';
      p.appendChild(a);
      textFrag.appendChild(p);
    }

    cells.push([imageFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-featured-news', cells });
  element.replaceWith(block);
}
