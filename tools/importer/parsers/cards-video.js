/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-video variant. Base: cards.
 * Source: https://media.jlr.com/defender/en-gb/videos (media-listing, videos listings)
 * Selector: .image-listing #colMain .card-grid:has(> .new-card--video)
 * Repeating unit: .card-grid > .gallery-item.new-card--video
 *   thumbnail img.new-card__desk-img (vimeo CDN), Vimeo player iframe (.new-card__mobile-video),
 *   .content-head: h5.date, h3.title; .content-foot: a.jlr-download-btn (mp4).
 *   The hidden .gallery-expander dialog repeats the same data and is ignored.
 * Model (xwalk): container of cards-video-item rows -> [image | text]
 *   image  (reference, imageAlt collapsed)
 *   text   (richtext: date, title linked to the video, Download link)
 */
export default function parse(element, { document }) {
  const norm = (s) => (s || '').replace(/&nbsp;/g, ' ').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
  const cleanHref = (a) => (a && a.getAttribute('href') ? a.getAttribute('href').trim() : '');
  const isRealHref = (href) => href && href !== '#' && !href.startsWith('/#') && !href.startsWith('javascript:');
  const realSrc = (el) => {
    if (!el) return '';
    const src = (el.getAttribute('src') || '').trim();
    return src && !src.startsWith('data:') ? src : (el.getAttribute('data-original') || '').trim();
  };

  const tiles = Array.from(element.querySelectorAll(':scope > .gallery-item'));
  const cells = [];

  tiles.forEach((tile) => {
    const contents = tile.querySelector(':scope > .gallery-contents') || tile.querySelector('.gallery-contents') || tile;
    const titleEl = contents.querySelector('.content-head .bt-gallery-title, .content-head .title, h3');
    const title = norm(titleEl ? titleEl.textContent : '');
    const dateEl = contents.querySelector('.content-head .bt-gallery-date, .content-head .date, .new-card__date');
    const date = norm(dateEl ? dateEl.textContent : '');
    const downloadEl = Array.from(contents.querySelectorAll('.content-foot a.jlr-download-btn[href], .content-foot a[href]'))
      .find((a) => isRealHref(cleanHref(a)) && !a.closest('.new-share'));
    const download = downloadEl ? cleanHref(downloadEl) : '';

    // Video URL: Vimeo player (strip player params), else the mp4 download
    const iframe = contents.querySelector('iframe[src*="vimeo"], iframe[src*="youtube"], iframe[src]');
    let videoHref = '';
    if (iframe) {
      const src = iframe.getAttribute('src').trim();
      const m = src.match(/player\.vimeo\.com\/video\/(\d+)/);
      videoHref = m ? `https://vimeo.com/${m[1]}` : src;
    }
    if (!videoHref) videoHref = download;

    // Column 1: thumbnail
    const imageFrag = document.createDocumentFragment();
    const img = contents.querySelector('img.new-card__desk-img, .new-card__video-ratio img, img');
    if (img && realSrc(img)) {
      img.setAttribute('src', realSrc(img));
      if (!norm(img.getAttribute('alt')) && title) img.setAttribute('alt', title);
      imageFrag.appendChild(document.createComment(' field:image '));
      imageFrag.appendChild(img);
    }

    // Column 2: date, linked title, download
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    if (date) {
      const p = document.createElement('p');
      p.textContent = date;
      textFrag.appendChild(p);
    }
    if (title) {
      const h = document.createElement('h3');
      if (videoHref) {
        const a = document.createElement('a');
        a.setAttribute('href', videoHref);
        a.textContent = title;
        h.appendChild(a);
      } else {
        h.textContent = title;
      }
      textFrag.appendChild(h);
    }
    if (download && download !== videoHref) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', download);
      a.textContent = 'Download';
      p.appendChild(a);
      textFrag.appendChild(p);
    }

    cells.push([imageFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-video', cells });
  element.replaceWith(block);
}
