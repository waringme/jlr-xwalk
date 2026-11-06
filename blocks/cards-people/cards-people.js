import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Cards (people): portrait cards linking to a person's bio page.
 * Each row = one person. Cells: [portrait image] [name heading, role, optional link].
 * @param {Element} block
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-people-card';
    moveInstrumentation(row, li);

    const cells = [...row.children];
    const imageCell = cells.find((c) => c.querySelector('picture'));
    const bodyCell = cells.find((c) => c !== imageCell) || document.createElement('div');

    // the person's bio link: first link in the card
    const link = row.querySelector('a[href]');
    const href = link ? link.getAttribute('href') : null;

    if (imageCell) {
      imageCell.className = 'cards-people-card-image';
      const picture = imageCell.querySelector('picture');
      const frame = document.createElement('div');
      frame.className = 'cards-people-portrait';
      if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.tabIndex = -1;
        a.setAttribute('aria-hidden', 'true');
        a.append(picture);
        frame.append(a);
      } else {
        frame.append(picture);
      }
      imageCell.replaceChildren(frame);
      li.append(imageCell);
    }

    bodyCell.className = 'cards-people-card-body';
    const heading = bodyCell.querySelector('h1, h2, h3, h4, h5, h6');
    const text = document.createElement('div');
    text.className = 'cards-people-text';

    // drop authored link-only paragraphs (re-rendered as "Read more" below)
    if (link && bodyCell.contains(link) && !heading?.contains(link)) {
      const p = link.closest('p');
      if (p && p.textContent.trim() === link.textContent.trim()) p.remove();
      else link.remove();
    }

    if (heading) {
      heading.classList.add('cards-people-name');
      if (href && !heading.querySelector('a')) {
        const a = document.createElement('a');
        a.href = href;
        a.append(...heading.childNodes);
        heading.append(a);
      }
    }
    // heading = name; everything else = role/title. Without a heading, the first line is the name.
    [...bodyCell.children].forEach((child, i) => {
      if (child !== heading) {
        child.classList.add(!heading && i === 0 ? 'cards-people-name' : 'cards-people-role');
      }
      text.append(child);
    });
    bodyCell.replaceChildren(text);

    if (href) {
      const more = document.createElement('a');
      more.className = 'cards-people-read-more';
      more.href = href;
      const label = link.textContent.trim();
      const name = heading ? heading.textContent.trim() : '';
      more.textContent = label && label.toLowerCase() !== name.toLowerCase() ? label : 'Read more';
      if (name) more.setAttribute('aria-label', `${more.textContent}: ${name}`);
      bodyCell.append(more);
    }
    li.append(bodyCell);
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '600' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.replaceChildren(ul);
}
