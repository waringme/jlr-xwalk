import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const PLAY_ICON = '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><circle cx="24" cy="24" r="22" fill="rgb(0 0 0 / 45%)" stroke="currentColor" stroke-width="2"/><path d="M19 15v18l14-9z" fill="currentColor"/></svg>';

function decorateTile(li) {
  const cells = [...li.children];
  const imageCell = cells.find((c) => c.querySelector('picture, img'));
  const bodyCell = cells.find((c) => c !== imageCell && c.textContent.trim());
  cells.forEach((c) => { if (c !== imageCell && c !== bodyCell) c.remove(); });

  const link = li.querySelector('a[href]');
  const heading = bodyCell?.querySelector('h1, h2, h3, h4, h5, h6');
  const titleText = (heading || bodyCell)?.textContent.trim()
    || (link && link.textContent.trim() !== link.href ? link.textContent.trim() : '');

  const tile = document.createElement(link ? 'a' : 'div');
  tile.className = 'cards-video-tile';
  if (link) {
    tile.href = link.href;
    if (titleText) tile.setAttribute('aria-label', `Play video: ${titleText}`);
  }

  const media = document.createElement('div');
  media.className = 'cards-video-media';
  if (imageCell) {
    const pic = imageCell.querySelector('picture') || imageCell.querySelector('img');
    media.append(pic);
  }
  const play = document.createElement('span');
  play.className = 'cards-video-play';
  play.innerHTML = PLAY_ICON;
  media.append(play);
  tile.append(media);

  if (titleText) {
    const title = document.createElement('p');
    title.className = 'cards-video-title';
    title.textContent = titleText;
    tile.append(title);
  }

  li.replaceChildren(tile);
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-video-card';
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    decorateTile(li);
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.replaceChildren(ul);
}
