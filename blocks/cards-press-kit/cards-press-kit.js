/*
 * Cards Press Kit
 * Press-kit list items: thumbnail beside a grey panel with the kit title, a Download control
 * (one link = direct download, several links = format menu) and a favourite star.
 * Row contract: [image] | [title + download link(s)].
 */

import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const CHEVRON = '<svg aria-hidden="true" focusable="false" viewBox="0 0 16 10" width="16" height="10"><path d="M1 1l7 7 7-7" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';
const STAR = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="14" height="14"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.5 1.3 6.6L12 17.2l-5.9 3.3 1.3-6.6-4.9-4.5 6.6-.8z" fill="currentColor"/></svg>';

let menuId = 0;

function buildDownload(links) {
  const wrap = document.createElement('div');
  wrap.className = 'cards-press-kit-download';

  if (links.length === 1) {
    const [link] = links;
    link.className = 'cards-press-kit-download-toggle';
    link.setAttribute('download', '');
    const label = document.createElement('span');
    label.textContent = link.textContent.trim() || 'Download';
    link.closest('p')?.remove();
    link.replaceChildren(label);
    link.insertAdjacentHTML('beforeend', CHEVRON);
    wrap.append(link);
    return wrap;
  }

  menuId += 1;
  const id = `cards-press-kit-menu-${menuId}`;
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'cards-press-kit-download-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', id);
  toggle.innerHTML = `<span>Download</span>${CHEVRON}`;

  const menu = document.createElement('ul');
  menu.className = 'cards-press-kit-download-menu';
  menu.id = id;
  menu.hidden = true;
  links.forEach((link) => {
    const li = document.createElement('li');
    const parent = link.closest('p');
    link.className = '';
    li.append(link);
    menu.append(li);
    if (parent && !parent.textContent.trim()) parent.remove();
  });

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
  });
  wrap.addEventListener('focusout', (e) => {
    if (!wrap.contains(e.relatedTarget)) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
    }
  });

  wrap.append(toggle, menu);
  return wrap;
}

function buildFavourite() {
  const fav = document.createElement('button');
  fav.type = 'button';
  fav.className = 'cards-press-kit-favourite';
  fav.setAttribute('aria-pressed', 'false');
  fav.setAttribute('aria-label', 'Add to favourites');
  fav.innerHTML = STAR;
  fav.addEventListener('click', () => {
    const pressed = fav.getAttribute('aria-pressed') !== 'true';
    fav.setAttribute('aria-pressed', String(pressed));
    fav.setAttribute('aria-label', pressed ? 'Remove from favourites' : 'Add to favourites');
  });
  return fav;
}

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);

    let body = null;
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-press-kit-card-image';
      } else if (!body) {
        div.className = 'cards-press-kit-card-body';
        body = div;
      } else {
        // fold any extra cells into the body
        body.append(...div.childNodes);
        div.remove();
      }
    });

    if (body) {
      const links = [...body.querySelectorAll('a[href]')];
      const text = document.createElement('div');
      text.className = 'cards-press-kit-card-text';
      const actions = document.createElement('div');
      actions.className = 'cards-press-kit-card-actions';
      if (links.length) actions.append(buildDownload(links));
      actions.append(buildFavourite());
      text.append(...body.childNodes);
      [...text.querySelectorAll('p')].forEach((p) => {
        if (!p.textContent.trim() && !p.querySelector('picture')) p.remove();
      });
      body.append(text, actions);
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.replaceChildren(ul);
}
