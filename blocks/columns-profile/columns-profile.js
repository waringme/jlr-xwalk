import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const isLinkOnly = (el) => {
  const links = el.querySelectorAll('a[href]');
  return links.length > 0 && [...links].map((a) => a.textContent).join('').trim() === el.textContent.trim();
};

/**
 * Builds the text column: name + role title, scrolling bio box, action links.
 * @param {Element} col
 */
function decorateText(col) {
  const children = [...col.children];
  const heading = children.find((el) => /^H[1-6]$/.test(el.tagName));

  const title = document.createElement('div');
  title.className = 'columns-profile-title';
  const bio = document.createElement('div');
  bio.className = 'columns-profile-bio';
  const actions = document.createElement('div');
  actions.className = 'columns-profile-actions';

  let roleTaken = false;
  children.forEach((el) => {
    if (el === heading) {
      el.classList.add('columns-profile-name');
      title.append(el);
    } else if (heading && !roleTaken && children.indexOf(el) === children.indexOf(heading) + 1
      && !isLinkOnly(el) && (/^H[1-6]$/.test(el.tagName) || el.textContent.trim().length < 80)) {
      el.classList.add('columns-profile-role');
      title.append(el);
      roleTaken = true;
    } else if (isLinkOnly(el)) {
      el.querySelectorAll('a[href]').forEach((a) => a.classList.add('columns-profile-button'));
      actions.append(el);
    } else {
      bio.append(el);
    }
  });

  const info = document.createElement('div');
  info.className = 'columns-profile-info';
  if (bio.children.length) {
    bio.tabIndex = 0;
    bio.setAttribute('role', 'region');
    bio.setAttribute('aria-label', heading ? `${heading.textContent.trim()} biography` : 'Biography');
    info.append(bio);
  }
  if (actions.children.length) info.append(actions);

  col.replaceChildren(...[title, info].filter((el) => el.children.length));
}

/**
 * Columns (profile): portrait photo beside name, role, biography and download button.
 * One row, two cells: [portrait image] [name heading, role, bio paragraphs, download link].
 * @param {Element} block
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('columns-profile-row');
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic && col.textContent.trim() === '') {
        col.classList.add('columns-profile-image');
      } else {
        col.classList.add('columns-profile-text');
        decorateText(col);
      }
    });
  });

  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    const optimizedPic = createOptimizedPicture(img.src, img.alt, true, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
