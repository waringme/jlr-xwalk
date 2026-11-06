import { loadCSS } from '../../scripts/aem.js';

const ICONS = {
  download: '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.5" d="M8 2v8m-3.5-3.5L8 10l3.5-3.5M2 11v3h12v-3"/></svg>',
  favourite: '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8 1.5l1.9 4.1 4.5.5-3.3 3.1.9 4.4L8 11.4l-4 2.2.9-4.4-3.3-3.1 4.5-.5z"/></svg>',
  share: '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><circle cx="12" cy="3" r="1.8" fill="currentColor"/><circle cx="4" cy="8" r="1.8" fill="currentColor"/><circle cx="12" cy="13" r="1.8" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-width="1.2" d="M11 3.8 5 7.2m0 1.6 6 3.4"/></svg>',
};

const SHARE_TARGETS = [
  { id: 'facebook', label: 'Share on Facebook', url: (u) => `https://www.facebook.com/sharer/sharer.php?u=${u}` },
  { id: 'x', label: 'Share on X', url: (u, t) => `https://x.com/intent/post?url=${u}&text=${t}` },
  { id: 'linkedin', label: 'Share on LinkedIn', url: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
  { id: 'email', label: 'Share by email', url: (u, t) => `mailto:?subject=${t}&body=${u}` },
];

const SHARE_GLYPHS = {
  facebook: 'f',
  x: 'X',
  linkedin: 'in',
  email: '@',
};

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html) node.innerHTML = html;
  return node;
}

function buildDownload(links, title) {
  const wrap = el('div', 'media-actions-download');
  if (links.length === 1) {
    const [link] = links;
    const a = el('a', 'media-actions-download-button');
    a.href = link.href;
    a.setAttribute('download', '');
    a.setAttribute('aria-label', title ? `Download ${title}` : 'Download');
    a.innerHTML = `<span class="media-actions-label">Download</span>${ICONS.download}`;
    wrap.append(a);
    return wrap;
  }
  const toggle = el('button', 'media-actions-download-button');
  toggle.type = 'button';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-haspopup', 'true');
  toggle.innerHTML = `<span class="media-actions-label">Download</span>${ICONS.download}`;
  const menu = el('ul', 'media-actions-download-menu');
  links.forEach((link) => {
    const li = document.createElement('li');
    const a = el('a', 'media-actions-download-item');
    a.href = link.href;
    a.setAttribute('download', '');
    a.textContent = link.textContent.trim() || 'Download';
    li.append(a);
    menu.append(li);
  });
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    wrap.classList.toggle('is-open', open);
  });
  wrap.addEventListener('focusout', (e) => {
    if (!wrap.contains(e.relatedTarget)) {
      toggle.setAttribute('aria-expanded', 'false');
      wrap.classList.remove('is-open');
    }
  });
  wrap.append(toggle, menu);
  return wrap;
}

function buildFavourite(title) {
  const btn = el('button', 'media-actions-favourite', ICONS.favourite);
  btn.type = 'button';
  btn.setAttribute('aria-pressed', 'false');
  btn.setAttribute('aria-label', title ? `Add ${title} to cart` : 'Add to cart');
  btn.addEventListener('click', () => {
    btn.setAttribute('aria-pressed', String(btn.getAttribute('aria-pressed') !== 'true'));
  });
  return btn;
}

function buildShare(title) {
  const wrap = el('div', 'media-actions-share');
  const trigger = el('button', 'media-actions-share-trigger', ICONS.share);
  trigger.type = 'button';
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-label', 'Share');
  const list = el('ul', 'media-actions-share-list');
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(title || document.title);
  SHARE_TARGETS.forEach((target) => {
    const li = document.createElement('li');
    const a = el('a', `media-actions-share-link media-actions-share-${target.id}`);
    a.href = target.url(url, text);
    a.setAttribute('aria-label', target.label);
    if (target.id !== 'email') {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    a.innerHTML = `<span aria-hidden="true">${SHARE_GLYPHS[target.id]}</span>`;
    li.append(a);
    list.append(li);
  });
  trigger.addEventListener('click', () => {
    const open = trigger.getAttribute('aria-expanded') !== 'true';
    trigger.setAttribute('aria-expanded', String(open));
    wrap.classList.toggle('is-open', open);
  });
  wrap.addEventListener('focusout', (e) => {
    if (!wrap.contains(e.relatedTarget)) {
      trigger.setAttribute('aria-expanded', 'false');
      wrap.classList.remove('is-open');
    }
  });
  wrap.append(trigger, list);
  return wrap;
}

/**
 * Builds the download / favourite / share toolbar.
 * @param {Object} config
 * @param {string} [config.title] asset title (used for labels and the titled bar)
 * @param {HTMLAnchorElement[]} [config.links] download links (2+ render a format menu)
 * @param {boolean} [config.download] render the download control
 * @param {boolean} [config.favourite] render the favourite control
 * @param {boolean} [config.share] render the share control
 * @param {boolean} [config.showTitle] render the title in the bar
 * @returns {HTMLElement[]} toolbar nodes
 */
export function buildActionNodes({
  title = '', links = [], download = true, favourite = true, share = true, showTitle = false,
} = {}) {
  const nodes = [];
  if (showTitle && title) {
    const h = el('p', 'media-actions-title');
    h.textContent = title;
    nodes.push(h);
  }
  const group = el('div', 'media-actions-group');
  if (download && links.length) group.append(buildDownload(links, title));
  if (favourite) group.append(buildFavourite(title));
  if (share) group.append(buildShare(title));
  nodes.push(group);
  return nodes;
}

/**
 * Builds a standalone toolbar element for use inside other blocks.
 * Loads this block's CSS so the toolbar is styled wherever it is embedded.
 * @param {Object} config see buildActionNodes
 * @param {string[]} [modifiers] layout classes, e.g. ['rail'] or ['titled-bar']
 * @returns {HTMLElement}
 */
export function buildActions(config, modifiers = []) {
  loadCSS(`${window.hlx.codeBasePath}/blocks/media-actions/media-actions.css`);
  const wrap = el('div', ['media-actions', 'media-actions-embedded', ...modifiers].join(' '));
  wrap.append(...buildActionNodes({ ...config, showTitle: modifiers.includes('titled-bar') }));
  return wrap;
}

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const links = [...block.querySelectorAll('a[href]')];
  let title = '';
  [...block.querySelectorAll(':scope > div > div')].some((cell) => {
    if (cell.querySelector('a, picture')) return false;
    title = cell.textContent.trim();
    return !!title;
  });

  const favouriteOnly = block.classList.contains('alt');
  const shareOnly = block.classList.contains('light');
  const titled = block.classList.contains('titled-bar');

  const nodes = buildActionNodes({
    title,
    links,
    download: !favouriteOnly && !shareOnly,
    favourite: !shareOnly,
    share: !favouriteOnly,
    showTitle: titled,
  });
  block.replaceChildren(...nodes);
}
