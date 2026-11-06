import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * loads and decorates the block
 * Authored rows: [image] [caption rich text]. Either may be missing.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const picture = block.querySelector('picture');
  const media = document.createElement('div');
  media.className = 'image-caption-media';
  if (picture) media.append(picture);

  const card = document.createElement('div');
  card.className = 'image-caption-card';
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture') || !cell.textContent.trim()) return;
      const body = document.createElement('div');
      body.className = 'image-caption-text';
      moveInstrumentation(cell, body);
      body.append(...cell.childNodes);
      card.append(body);
    });
  });

  media.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
    moveInstrumentation(img, optimized.querySelector('img'));
    img.closest('picture').replaceWith(optimized);
  });

  const figure = document.createElement('figure');
  figure.className = 'image-caption-figure';
  figure.append(media);
  if (card.children.length) figure.append(card);
  block.replaceChildren(figure);
}
