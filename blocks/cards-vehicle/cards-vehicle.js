import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * cards-vehicle — vertical list of vehicle entries (cut-out thumbnail + model name),
 * each entry linking to the vehicle page.
 * Row contract: cell 1 = image, cell 2 = model name (linked, or text plus a link).
 * @param {Element} block
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'cards-vehicle-list';

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const cells = [...row.children];
    const imageCell = cells.find((c) => c.querySelector('picture'));
    const bodyCell = cells.find((c) => c !== imageCell);
    const link = row.querySelector('a[href]');

    const entry = document.createElement(link ? 'a' : 'div');
    entry.className = 'cards-vehicle-entry';
    if (link) {
      entry.href = link.href;
      if (link.title) entry.title = link.title;
    }

    if (imageCell) {
      const media = document.createElement('div');
      media.className = 'cards-vehicle-media';
      const picture = imageCell.querySelector('picture');
      if (picture) media.append(picture);
      entry.append(media);
    }

    const title = document.createElement('p');
    title.className = 'cards-vehicle-title';
    const label = (bodyCell || row).textContent.trim() || link?.textContent.trim() || '';
    title.textContent = label;
    entry.append(title);

    li.append(entry);
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '260' }]);
    moveInstrumentation(img, optimized.querySelector('img'));
    img.closest('picture').replaceWith(optimized);
  });

  block.replaceChildren(ul);
}
