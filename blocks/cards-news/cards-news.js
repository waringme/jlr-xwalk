import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const ICONS = {
  download: '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 1v9m-4-4 4 4 4-4M2 11v3h12v-3" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
  star: '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m8 1.5 2 4.3 4.7.5-3.5 3.2 1 4.6L8 11.7l-4.2 2.4 1-4.6L1.3 6.3 6 5.8z" fill="currentColor"/></svg>',
  share: '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><circle cx="12" cy="3" r="2" fill="currentColor"/><circle cx="4" cy="8" r="2" fill="currentColor"/><circle cx="12" cy="13" r="2" fill="currentColor"/><path d="m12 3-8 5 8 5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
  arrow: '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m5 2 6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
};

const SHARE_TARGETS = [
  { name: 'Facebook', url: (u) => `https://www.facebook.com/sharer/sharer.php?u=${u}` },
  { name: 'X', url: (u, t) => `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
  { name: 'LinkedIn', url: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
];

function isDownload(a) {
  return /\.zip(\?|$)/i.test(a.href) || /download/i.test(a.textContent);
}

function isReadMore(a) {
  return /read more|find out more/i.test(a.textContent);
}

/** Classify the cells of one card row by their content. */
function classifyCell(cell) {
  const text = cell.textContent.trim();
  if (cell.querySelector('picture, img') && text === '') return 'image';
  if (!cell.querySelector('h1, h2, h3, h4, h5, h6, p + p, a') && /^\d+\s*\S*$/.test(text)) return 'count';
  if (text === '' && !cell.children.length) return 'empty';
  return 'body';
}

function buildShare(cardUrl, title) {
  const wrap = document.createElement('div');
  wrap.className = 'cards-news-share';
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'cards-news-action';
  trigger.setAttribute('aria-label', 'Share');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.innerHTML = ICONS.share;
  const list = document.createElement('ul');
  list.className = 'cards-news-share-list';
  const u = encodeURIComponent(cardUrl || window.location.href);
  const t = encodeURIComponent(title || document.title);
  SHARE_TARGETS.forEach((target) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = target.url(u, t);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'cards-news-share-link';
    a.textContent = target.name;
    a.setAttribute('aria-label', `Share on ${target.name}`);
    li.append(a);
    list.append(li);
  });
  trigger.addEventListener('click', () => {
    const open = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', String(!open));
  });
  wrap.append(trigger, list);
  return wrap;
}

function buildActions(downloadLink, cardUrl, title) {
  const actions = document.createElement('div');
  actions.className = 'cards-news-actions';
  if (downloadLink) {
    downloadLink.className = 'cards-news-action cards-news-download';
    const label = downloadLink.textContent.trim() || 'Download';
    downloadLink.setAttribute('aria-label', `${label} ${title}`.trim());
    downloadLink.innerHTML = `<span class="cards-news-action-label">${label}</span>${ICONS.download}`;
    actions.append(downloadLink);
  }
  const fav = document.createElement('button');
  fav.type = 'button';
  fav.className = 'cards-news-action cards-news-favourite';
  fav.setAttribute('aria-label', 'Add to cart');
  fav.setAttribute('aria-pressed', 'false');
  fav.innerHTML = ICONS.star;
  fav.addEventListener('click', () => {
    fav.setAttribute('aria-pressed', String(fav.getAttribute('aria-pressed') !== 'true'));
  });
  actions.append(fav, buildShare(cardUrl, title));
  return actions;
}

function decorateCard(li) {
  const cells = [...li.children];
  let image;
  let count;
  let body;
  cells.forEach((cell) => {
    const kind = classifyCell(cell);
    if (kind === 'image' && !image) image = cell;
    else if (kind === 'count' && !count) count = cell;
    else if (kind === 'body' && !body) body = cell;
    else if (kind === 'empty') cell.remove();
    else if (body) body.append(...cell.childNodes);
  });

  const heading = body?.querySelector('h1, h2, h3, h4, h5, h6');
  const title = heading?.textContent.trim() || '';
  const links = body ? [...body.querySelectorAll('a')] : [];
  const downloadLink = links.find(isDownload);
  const readMore = links.find((a) => a !== downloadLink && isReadMore(a));
  const titleLink = links.find((a) => a !== downloadLink && a !== readMore);
  const cardUrl = readMore?.href || titleLink?.href || '';

  if (image) {
    image.className = 'cards-news-card-image';
    if (cardUrl && !image.querySelector('a')) {
      const a = document.createElement('a');
      a.className = 'cards-news-image-link';
      a.href = cardUrl;
      a.tabIndex = -1;
      a.setAttribute('aria-hidden', 'true');
      a.append(...image.childNodes);
      image.append(a);
    }
    if (count) {
      count.className = 'cards-news-count';
      const [num, ...rest] = count.textContent.trim().split(/\s+/);
      count.innerHTML = `<span class="cards-news-count-number">${num}</span><span class="cards-news-count-text">${rest.join(' ')}</span>`;
      image.append(count);
    }
  } else if (count) count.remove();

  if (body) {
    body.className = 'cards-news-card-body';
    // first short paragraph before the heading is the date
    const first = body.firstElementChild;
    if (first && heading && first !== heading && first.tagName === 'P' && !first.contains(heading)) {
      first.classList.add('cards-news-date');
    }
    if (heading) {
      heading.classList.add('cards-news-title');
      if (titleLink && !heading.querySelector('a') && titleLink.closest('h1, h2, h3, h4, h5, h6') !== heading) {
        const a = document.createElement('a');
        a.href = titleLink.href;
        a.append(...heading.childNodes);
        heading.append(a);
      }
    }
    body.querySelectorAll('p').forEach((p) => {
      if (!p.classList.contains('cards-news-date') && !p.querySelector('a') && p.textContent.trim()) {
        p.classList.add('cards-news-teaser');
      }
    });
    // detach action links from their paragraphs
    [downloadLink, readMore].forEach((a) => {
      const parent = a?.parentElement;
      if (a) a.remove();
      const emptyParent = parent && parent !== body
        && !parent.textContent.trim() && !parent.children.length;
      if (emptyParent) parent.remove();
    });
    if (titleLink && !titleLink.closest('.cards-news-title')) {
      const linkText = titleLink.textContent.trim();
      if (linkText && linkText !== title && linkText !== titleLink.href) {
        // e.g. a linked date: keep the text, drop the duplicate link
        titleLink.replaceWith(...titleLink.childNodes);
      } else {
        const parent = titleLink.parentElement;
        titleLink.remove();
        if (parent && parent !== body && !parent.textContent.trim()) parent.remove();
      }
    }
    const text = document.createElement('div');
    text.className = 'cards-news-text';
    text.append(...body.childNodes);
    const footer = document.createElement('div');
    footer.className = 'cards-news-footer';
    footer.append(buildActions(downloadLink, cardUrl, title));
    if (readMore) {
      readMore.className = 'cards-news-read-more';
      const label = readMore.textContent.trim();
      readMore.innerHTML = `${ICONS.arrow}<span>${label}</span>`;
      footer.append(readMore);
    }
    body.append(text, footer);
  }
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-news-card';
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    decorateCard(li);
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
