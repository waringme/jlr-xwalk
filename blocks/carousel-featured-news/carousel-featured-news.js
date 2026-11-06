import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const AUTOPLAY_MS = 5000;

const ICONS = {
  download: '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 1v9m-4-4 4 4 4-4M2 11v3h12v-3" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
  star: '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m8 1.5 2 4.3 4.7.5-3.5 3.2 1 4.6L8 11.7l-4.2 2.4 1-4.6L1.3 6.3 6 5.8z" fill="currentColor"/></svg>',
  share: '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><circle cx="12" cy="3" r="2" fill="currentColor"/><circle cx="4" cy="8" r="2" fill="currentColor"/><circle cx="12" cy="13" r="2" fill="currentColor"/><path d="m12 3-8 5 8 5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
};

const SHARE_TARGETS = [
  { name: 'Facebook', url: (u) => `https://www.facebook.com/sharer/sharer.php?u=${u}` },
  { name: 'X', url: (u, t) => `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
  { name: 'LinkedIn', url: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
];

const DATE_RE = /^\d{1,2}\s+[A-Za-z]+\s+\d{4}$/;

function isDownload(a) {
  return /\.zip(\?|$)/i.test(a.href) || /download/i.test(a.textContent);
}

function buildRail(downloadLink, url, title) {
  const rail = document.createElement('div');
  rail.className = 'carousel-featured-news-actions';

  if (downloadLink) {
    downloadLink.className = 'carousel-featured-news-action';
    downloadLink.setAttribute('aria-label', `Download ${title}`.trim());
    downloadLink.innerHTML = `<span class="carousel-featured-news-action-label">Download</span>${ICONS.download}`;
    rail.append(downloadLink);
  }

  const cart = document.createElement('button');
  cart.type = 'button';
  cart.className = 'carousel-featured-news-action';
  cart.setAttribute('aria-pressed', 'false');
  cart.innerHTML = `<span class="carousel-featured-news-action-label">Add to Cart</span>${ICONS.star}`;
  cart.addEventListener('click', () => {
    cart.setAttribute('aria-pressed', String(cart.getAttribute('aria-pressed') !== 'true'));
  });
  rail.append(cart);

  const share = document.createElement('div');
  share.className = 'carousel-featured-news-action carousel-featured-news-share';
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'carousel-featured-news-share-trigger';
  trigger.setAttribute('aria-label', 'Share');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.innerHTML = ICONS.share;
  trigger.addEventListener('click', () => {
    trigger.setAttribute('aria-expanded', String(trigger.getAttribute('aria-expanded') !== 'true'));
  });
  const list = document.createElement('ul');
  list.className = 'carousel-featured-news-share-list';
  const shareUrl = url ? new URL(url, window.location.href).href : window.location.href;
  const u = encodeURIComponent(shareUrl);
  const t = encodeURIComponent(title || document.title);
  SHARE_TARGETS.forEach((target) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = target.url(u, t);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = target.name;
    a.setAttribute('aria-label', `Share on ${target.name}`);
    li.append(a);
    list.append(li);
  });
  share.append(list, trigger);
  rail.append(share);
  return rail;
}

function createSlide(row, idx, carouselId) {
  const slide = document.createElement('li');
  slide.className = 'carousel-featured-news-slide';
  slide.id = `carousel-featured-news-${carouselId}-slide-${idx}`;
  slide.dataset.slideIndex = idx;
  moveInstrumentation(row, slide);

  const cells = [...row.children];
  const imageCell = cells.find((c) => c.querySelector('picture, img') && !c.querySelector('h1, h2, h3, h4, h5, h6'));
  const contentCell = cells.find((c) => c !== imageCell && c.textContent.trim());

  const heading = contentCell?.querySelector('h1, h2, h3, h4, h5, h6');
  const title = heading?.textContent.trim() || '';
  const links = contentCell ? [...contentCell.querySelectorAll('a')] : [];
  const downloadLink = links.find(isDownload);
  const ctaLink = links.find((a) => a !== downloadLink && !a.closest('h1, h2, h3, h4, h5, h6'));
  const titleLink = heading?.querySelector('a');
  const url = ctaLink?.href || titleLink?.href || '';

  // image area
  const media = document.createElement('div');
  media.className = 'carousel-featured-news-slide-image';
  const frame = document.createElement(url ? 'a' : 'div');
  frame.className = 'carousel-featured-news-frame';
  if (url) {
    frame.href = url;
    frame.tabIndex = -1;
    frame.setAttribute('aria-hidden', 'true');
  }
  const pic = imageCell?.querySelector('picture') || imageCell?.querySelector('img');
  if (pic) frame.append(pic);
  media.append(buildRail(downloadLink, url, title), frame);

  // info box
  const info = document.createElement('div');
  info.className = 'carousel-featured-news-slide-content';
  const main = document.createElement('div');
  main.className = 'carousel-featured-news-main';
  const aside = document.createElement('div');
  aside.className = 'carousel-featured-news-aside';

  if (heading) {
    heading.classList.add('carousel-featured-news-title');
    if (!titleLink && url) {
      const a = document.createElement('a');
      a.href = url;
      a.append(...heading.childNodes);
      heading.append(a);
    }
    main.append(heading);
  }

  let hasText = false;
  if (contentCell) {
    [...contentCell.querySelectorAll('p')].forEach((p) => {
      const text = p.textContent.trim();
      if (p.contains(downloadLink) || p.contains(ctaLink)) return;
      if (!text) return;
      if (p.querySelector('time') || DATE_RE.test(text)) {
        p.className = 'carousel-featured-news-date';
        aside.prepend(p);
      } else {
        p.className = 'carousel-featured-news-text';
        main.append(p);
        hasText = true;
      }
    });
  }
  if (heading && !hasText) heading.classList.add('no-description');

  if (ctaLink) {
    ctaLink.className = 'carousel-featured-news-cta';
    if (title) ctaLink.setAttribute('aria-label', `Link to full article ${title}`);
    aside.append(ctaLink);
  }

  info.append(main, aside);
  slide.append(media, info);
  return slide;
}

/** Eager-load only the first slide image (LCP candidate). */
function isFirstSlideImage(img, slides) {
  return slides[0]?.contains(img) || false;
}

let carouselCount = 0;

export default function decorate(block) {
  carouselCount += 1;
  const carouselId = carouselCount;
  const rows = [...block.children];
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Carousel');

  const track = document.createElement('ul');
  track.className = 'carousel-featured-news-slides';
  rows.forEach((row, idx) => {
    track.append(createSlide(row, idx, carouselId));
    row.remove();
  });
  const slides = [...track.children];

  track.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    const optimizedPic = createOptimizedPicture(img.src, img.alt, isFirstSlideImage(img, slides), [{ width: '1200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.replaceChildren(track);
  if (slides.length < 2) {
    slides.forEach((s) => s.classList.add('is-active'));
    return;
  }

  const nav = document.createElement('nav');
  nav.className = 'carousel-featured-news-navigation';
  nav.setAttribute('aria-label', 'Carousel slide controls');
  const dots = document.createElement('ol');
  dots.className = 'carousel-featured-news-dots';
  slides.forEach((slide, idx) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', `${idx + 1} of ${slides.length}`);
    btn.setAttribute('aria-controls', slide.id);
    btn.dataset.targetSlide = idx;
    li.append(btn);
    dots.append(li);
  });
  nav.append(dots);

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'carousel-featured-news-arrow carousel-featured-news-prev';
  prev.setAttribute('aria-label', 'Previous slide');
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'carousel-featured-news-arrow carousel-featured-news-next';
  next.setAttribute('aria-label', 'Next slide');
  block.append(prev, next, nav);

  let active = 0;
  const show = (index) => {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, idx) => {
      const on = idx === active;
      slide.classList.toggle('is-active', on);
      slide.setAttribute('aria-hidden', String(!on));
      slide.querySelectorAll('a, button').forEach((el) => {
        if (on) el.removeAttribute('tabindex');
        else el.setAttribute('tabindex', '-1');
      });
    });
    [...dots.children].forEach((li, idx) => {
      li.classList.toggle('is-active', idx === active);
      li.firstElementChild.setAttribute('aria-current', String(idx === active));
    });
  };

  dots.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (btn) show(parseInt(btn.dataset.targetSlide, 10));
  });
  prev.addEventListener('click', () => show(active - 1));
  next.addEventListener('click', () => show(active + 1));

  let timer;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stop = () => window.clearInterval(timer);
  const start = () => {
    stop();
    if (!reduced) timer = window.setInterval(() => show(active + 1), AUTOPLAY_MS);
  };
  block.addEventListener('mouseenter', stop);
  block.addEventListener('mouseleave', start);
  block.addEventListener('focusin', stop);
  block.addEventListener('focusout', start);

  show(0);
  start();
}
