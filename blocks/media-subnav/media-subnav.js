import { moveInstrumentation } from '../../scripts/scripts.js';

function normalisePath(path) {
  return path.replace(/\.html$/, '').replace(/\/+$/, '') || '/';
}

/**
 * media-subnav — tab-style links switching between related media listing pages
 * (e.g. Video / Video Packs / Broadcast Video). One link per row (or several links in one cell).
 * The link pointing at the current page is marked active with aria-current="page".
 * @param {Element} block
 */
export default function decorate(block) {
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Media type');
  const group = document.createElement('div');
  group.className = 'media-subnav-toggle';
  group.setAttribute('role', 'group');

  const current = normalisePath(window.location.pathname);

  [...block.children].forEach((row) => {
    const links = [...row.querySelectorAll('a[href]')];
    links.forEach((a, i) => {
      const link = document.createElement('a');
      link.href = a.href;
      link.className = 'media-subnav-link';
      link.textContent = a.textContent.trim();
      if (a.title) link.title = a.title;
      if (i === 0) moveInstrumentation(row, link);
      const url = new URL(a.href, window.location.href);
      if (url.origin === window.location.origin && normalisePath(url.pathname) === current) {
        link.setAttribute('aria-current', 'page');
        link.classList.add('active');
      }
      group.append(link);
    });
  });

  nav.append(group);
  block.replaceChildren(nav);
}
