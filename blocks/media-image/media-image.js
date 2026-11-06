import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import { buildActions } from '../media-actions/media-actions.js';

function optimizeImages(root, width) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width }]);
    moveInstrumentation(img, optimized.querySelector('img'));
    img.closest('picture').replaceWith(optimized);
  });
}

/**
 * Reads one authored item row: [image] [title] [download links].
 * Cells may be missing; content is located by type, not position.
 */
function readItem(row) {
  const picture = row.querySelector('picture');
  const links = [...row.querySelectorAll('a[href]')];
  let title = '';
  [...row.children].some((cell) => {
    if (cell.querySelector('picture, a')) return false;
    title = cell.textContent.trim();
    return !!title;
  });
  if (!title && picture) title = picture.querySelector('img')?.alt || '';
  return { picture, links, title };
}

function variantOf(block) {
  if (block.classList.contains('thumbnail')) return 'thumbnail';
  if (block.classList.contains('gallery')) return 'gallery';
  if (block.classList.contains('strip') || block.classList.contains('strip-2')) return 'strip';
  return 'hero';
}

function buildItem(row, variant) {
  const { picture, links, title } = readItem(row);
  const item = document.createElement(variant === 'thumbnail' ? 'div' : 'figure');
  item.className = 'media-image-item';
  moveInstrumentation(row, item);

  const frame = document.createElement('div');
  frame.className = 'media-image-frame';
  if (picture) frame.append(picture);
  item.append(frame);

  if (variant === 'thumbnail') {
    const [link] = links;
    if (link && picture) {
      const a = document.createElement('a');
      a.href = link.href;
      a.className = 'media-image-link';
      a.setAttribute('aria-label', title || link.textContent.trim() || 'View image');
      a.append(picture);
      frame.append(a);
    }
    return item;
  }

  if (variant === 'hero') {
    frame.append(buildActions({ title, links }, ['rail']));
    return item;
  }

  if (variant === 'gallery') {
    const overlay = document.createElement('div');
    overlay.className = 'media-image-overlay';
    overlay.append(buildActions({ title, links }));
    item.append(overlay);
    return item;
  }

  // strip: hover bar with title + actions (figcaption)
  const caption = document.createElement('figcaption');
  caption.className = 'media-image-caption';
  caption.append(buildActions({ title, links }, ['titled-bar']));
  item.append(caption);
  return item;
}

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const variant = variantOf(block);
  const list = document.createElement('div');
  list.className = 'media-image-list';
  [...block.children].forEach((row) => {
    list.append(buildItem(row, variant));
  });
  optimizeImages(list, variant === 'hero' ? '2000' : '750');
  block.replaceChildren(list);
}
