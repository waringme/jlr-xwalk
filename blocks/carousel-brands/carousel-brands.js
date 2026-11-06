import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function createTile(row) {
  const li = document.createElement('li');
  li.className = 'carousel-brands-slide';
  moveInstrumentation(row, li);

  const cells = [...row.children];
  const pictures = cells.map((c) => c.querySelector('picture') || c.querySelector('img')).filter(Boolean);
  const [background, logo] = pictures;
  const link = row.querySelector('a[href]');
  const label = (link && link.textContent.trim() !== link.href ? link.textContent.trim() : '')
    || logo?.querySelector?.('img')?.alt || logo?.alt
    || cells.map((c) => c.textContent.trim()).find(Boolean) || '';

  const tile = document.createElement(link ? 'a' : 'div');
  tile.className = 'carousel-brands-tile';
  if (link) {
    tile.href = link.href;
    if (label) tile.setAttribute('aria-label', label);
  }

  if (background) {
    const bg = document.createElement('div');
    bg.className = 'carousel-brands-background';
    bg.append(background);
    tile.append(bg);
  }

  const brand = document.createElement('div');
  brand.className = 'carousel-brands-logo';
  if (logo) brand.append(logo);
  else if (label) {
    const name = document.createElement('span');
    name.className = 'carousel-brands-name';
    name.textContent = label;
    brand.append(name);
  }
  tile.append(brand);
  li.append(tile);
  return li;
}

function updateButtons(track, prev, next) {
  const max = track.scrollWidth - track.clientWidth - 1;
  prev.disabled = track.scrollLeft <= 0;
  next.disabled = track.scrollLeft >= max;
}

export default function decorate(block) {
  const track = document.createElement('ul');
  track.className = 'carousel-brands-slides';
  [...block.children].forEach((row) => {
    track.append(createTile(row));
    row.remove();
  });

  track.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '640' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Carousel');
  block.replaceChildren(track);

  if (track.children.length < 2) return;

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'carousel-brands-arrow carousel-brands-prev';
  prev.setAttribute('aria-label', 'Previous brands');
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'carousel-brands-arrow carousel-brands-next';
  next.setAttribute('aria-label', 'Next brands');
  block.append(prev, next);

  const step = () => {
    const slide = track.firstElementChild;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return slide ? slide.getBoundingClientRect().width + gap : track.clientWidth;
  };
  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  track.addEventListener('scroll', () => updateButtons(track, prev, next), { passive: true });
  window.addEventListener('resize', () => updateButtons(track, prev, next));
  requestAnimationFrame(() => updateButtons(track, prev, next));
}
