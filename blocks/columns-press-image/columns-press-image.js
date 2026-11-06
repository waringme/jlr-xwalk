import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import { buildActions } from '../media-actions/media-actions.js';

function buildMedia(cell) {
  const picture = cell.querySelector('picture');
  const heading = cell.querySelector('h1, h2, h3, h4, h5, h6');
  const links = [...cell.querySelectorAll('a[href]')];
  const title = heading?.textContent.trim() || picture.querySelector('img')?.alt || '';

  const figure = document.createElement('figure');
  figure.className = 'columns-press-image-media';
  moveInstrumentation(cell, figure);
  const frame = document.createElement('div');
  frame.className = 'columns-press-image-frame';
  frame.append(picture);
  figure.append(frame);

  const caption = document.createElement('figcaption');
  caption.className = 'columns-press-image-caption';
  caption.append(buildActions({ title, links }, ['titled-bar']));
  figure.append(caption);
  return figure;
}

/**
 * loads and decorates the block
 * Authored: one row, two cells: article text and a press image (image, optional
 * title heading, optional download links). Either order; the image cell is
 * detected by its picture.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('columns-press-image-row');
    const cells = [...row.children];
    if (cells[0]?.querySelector('picture')) row.classList.add('columns-press-image-media-first');
    cells.forEach((cell) => {
      if (cell.querySelector('picture')) {
        cell.replaceWith(buildMedia(cell));
      } else {
        cell.classList.add('columns-press-image-panel');
      }
    });
  });

  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '1200' }]);
    moveInstrumentation(img, optimized.querySelector('img'));
    img.closest('picture').replaceWith(optimized);
  });
}
