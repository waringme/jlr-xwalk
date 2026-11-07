/*
 * Header block — two-layer navigation.
 * 1. Global document (/content/nav.plain.html, fallback /nav.plain.html): menu trigger
 *    (paragraphs: menu label, close label), full-screen overlay (title, brand list with
 *    video links, legal list), an image-only section with one cover image per brand (paired
 *    with the brand list by position) and tools (market list, cart, contact). Identical on
 *    every sub-site.
 * 2. Site document (/content{root}/nav.plain.html, fallback {root}/nav.plain.html), where
 *    {root} is the path up to and including the locale segment: brand bar (image paragraph =
 *    logo, the link paragraph right after it = logo link, other links = external link),
 *    sub-nav (first item with nested lists = mega menu with tabs of image cards) and
 *    search copy (placeholder + optional "all" checkbox label).
 * All copy, links and images come from the fetched documents; UI glyphs (menu, close,
 * chevrons...) are drawn inline.
 */

const isDesktop = window.matchMedia('(width >= 900px)');
const LOCALE_SEGMENT = /^[a-z]{2}-[a-z]{2}$/;
const SHRINK_THRESHOLD = 150;
const SEARCH_ORIGIN = 'https://media.jlr.com';
const SEARCH_PATH = '/search-submit';

const ICONS = {
  globe: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="8" cy="8" r="6.9"/><ellipse cx="8" cy="8" rx="3" ry="6.9"/><path d="M1.1 8h13.8M2.2 4.4h11.6M2.2 11.6h11.6"/></svg>',
  chevron: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M2 5.5l6 6 6-6"/></svg>',
  link: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><path d="M6.6 9.4a3 3 0 0 0 4.3 0l2.6-2.6a3 3 0 0 0-4.3-4.3L7.9 3.8"/><path d="M9.4 6.6a3 3 0 0 0-4.3 0L2.5 9.2a3 3 0 0 0 4.3 4.3l1.3-1.3"/></svg>',
  arrow: '<svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.1"><path d="M1.5 8.5l7-7M3 1.5h5.5V7"/></svg>',
  search: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="6.5" cy="6.5" r="5.3"/><path d="M10.4 10.4l4.8 4.8"/></svg>',
  plus: '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M6 0v12M0 6h12"/></svg>',
  minus: '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 6h12"/></svg>',
  menu: '<svg viewBox="0 0 18 14" width="18" height="14"><path d="M18 6.75C18 7.1642137 17.664213 7.5 17.25 7.5L0.75 7.5C0.33578643 7.5 0 7.1642137 0 6.75C0 6.3357863 0.33578643 6 0.75 6L17.25 6C17.664213 6 18 6.3357863 18 6.75ZM0.75 1.5L17.25 1.5C17.664213 1.5 18 1.1642135 18 0.75C18 0.33578643 17.664213 0 17.25 0L0.75 0C0.33578643 0 0 0.33578643 0 0.75C0 1.1642135 0.33578643 1.5 0.75 1.5ZM17.25 12L0.75 12C0.33578643 12 0 12.335787 0 12.75C0 13.164213 0.33578643 13.5 0.75 13.5L17.25 13.5C17.664213 13.5 18 13.164213 18 12.75C18 12.335787 17.664213 12 17.25 12Z"/></svg>',
  close: '<svg viewBox="0 0 17 17" width="17" height="17"><path d="M0.515625 15.484375Q0.609375 15.578125 0.7265625 15.632812Q0.84375 15.6875 0.953125 15.6875Q1.078125 15.6875 1.1953125 15.632812Q1.3125 15.578125 1.40625 15.484375L8 8.890625L14.59375 15.484375Q14.6875 15.578125 14.804688 15.632812Q14.921875 15.6875 15.046875 15.6875Q15.15625 15.6875 15.273438 15.632812Q15.390625 15.578125 15.484375 15.484375Q15.6875 15.296875 15.6875 15.039062Q15.6875 14.78125 15.484375 14.59375L8.890625 8L15.484375 1.40625Q15.6875 1.21875 15.6875 0.9609375Q15.6875 0.703125 15.484375 0.515625Q15.296875 0.3125 15.039062 0.3125Q14.78125 0.3125 14.59375 0.515625L8 7.109375L1.40625 0.515625Q1.21875 0.3125 0.9609375 0.3125Q0.703125 0.3125 0.515625 0.515625Q0.3125 0.703125 0.3125 0.9609375Q0.3125 1.21875 0.515625 1.40625L7.109375 8L0.515625 14.59375Q0.3125 14.78125 0.3125 15.039062Q0.3125 15.296875 0.515625 15.484375Z"/></svg>',
};

/**
 * Creates an element with optional class and attributes.
 * @param {string} tag tag name
 * @param {string} [className] class list
 * @param {Object} [attrs] attributes
 * @returns {Element}
 */
function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

/**
 * Creates a decorative inline icon.
 * @param {string} name icon key
 * @returns {Element}
 */
function icon(name) {
  const span = el('span', `header-icon header-icon-${name}`, { 'aria-hidden': 'true' });
  span.innerHTML = ICONS[name];
  return span;
}

/**
 * Creates a bare decorative inline SVG (no sizing wrapper).
 * @param {string} name icon key
 * @param {string} className class of the svg element
 * @returns {Element}
 */
function glyph(name, className) {
  const tpl = document.createElement('template');
  tpl.innerHTML = ICONS[name];
  const svg = tpl.content.firstElementChild;
  svg.setAttribute('class', className);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  return svg;
}

/**
 * Returns the images of a section that are authored as standalone image paragraphs.
 * @param {Element} section document section
 * @returns {Element[]} img elements
 */
function paragraphImages(section) {
  return [...section.querySelectorAll(':scope > p > img, :scope > p > picture > img')];
}

/**
 * Returns the site root (path up to and including the locale segment) of a pathname.
 * @param {string} pathname page path
 * @returns {string} e.g. /defender/en-gb, /en-gb or '' when no locale segment exists
 */
function getSiteRoot(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] === 'content') segments.shift();
  const index = segments.findIndex((s) => LOCALE_SEGMENT.test(s));
  if (index < 0) return '';
  return `/${segments.slice(0, index + 1).join('/')}`;
}

/**
 * Parses a plain.html response into a document and resolves relative image paths
 * against the fragment URL (the fragment lives in another folder than the page).
 * @param {Response} resp fetch response
 * @returns {Promise<Document>}
 */
async function parseFragment(resp) {
  const html = await resp.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const base = new URL(resp.url || window.location.href, window.location.href);
  doc.querySelectorAll('img[src], source[srcset]').forEach((media) => {
    const attr = media.hasAttribute('src') ? 'src' : 'srcset';
    const value = media.getAttribute(attr);
    if (!/^([a-z]+:|\/)/i.test(value)) media.setAttribute(attr, new URL(value, base).href);
  });
  return doc;
}

/**
 * Fetches the site-specific nav document for a site root.
 * @param {string} root site root
 * @returns {Promise<Document|null>}
 */
async function fetchSiteDocument(root) {
  if (!root) return null;
  try {
    let resp = await fetch(`/content${root}/nav.plain.html`);
    if (!resp.ok) resp = await fetch(`${root}/nav.plain.html`);
    return resp.ok ? parseFragment(resp) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Rewrites a link of the global document starting with the default locale root
 * (e.g. /en-gb/cart) to the current site root (e.g. /defender/en-gb/cart).
 * @param {Element} link anchor
 * @param {string} root current site root
 */
function rewriteToRoot(link, root) {
  const href = link.getAttribute('href') || '';
  const match = href.match(/^\/([a-z]{2}-[a-z]{2})(\/.*)$/);
  if (!root || !match) return;
  link.setAttribute('href', `${root}${match[2]}`);
}

/**
 * Rewrites a market link to the current site (prefixes the site path before the locale).
 * @param {Element} link anchor
 * @param {string} prefix site path without locale, e.g. /defender
 */
function rewriteMarketLink(link, prefix) {
  if (!prefix) return;
  const href = link.getAttribute('href') || '';
  const isRelative = href.startsWith('/');
  const url = new URL(href, window.location.origin);
  url.pathname = `${prefix}${url.pathname}`;
  link.setAttribute('href', isRelative ? `${url.pathname}${url.search}${url.hash}` : url.href);
}

/**
 * Returns the trimmed own text of an element (excluding nested lists).
 * @param {Element} node element
 * @returns {string}
 */
function ownText(node) {
  return [...node.childNodes]
    .filter((n) => n.nodeType === Node.TEXT_NODE)
    .map((n) => n.textContent)
    .join(' ')
    .trim();
}

/* ---------- builders ---------- */

/**
 * Builds the full-screen overlay from the overlay section.
 * @param {Element} section overlay section of the global document
 * @param {string} closeLabel accessible name of the close button
 * @param {Element[]} posters cover images, paired with the brand list by position
 * @returns {{overlay: Element, update: Function}}
 */
function buildOverlay(section, closeLabel, posters) {
  const overlay = el('div', 'header-overlay', {
    role: 'dialog', 'aria-modal': 'true', id: 'header-overlay', tabindex: '-1',
  });
  overlay.hidden = true;

  const close = el('button', 'header-overlay-close', { type: 'button' });
  close.setAttribute('aria-label', closeLabel || 'Close');
  close.append(glyph('close', 'header-overlay-close-icon'));

  const layout = el('div', 'header-overlay-layout');
  const menu = el('div', 'header-overlay-menu');
  const media = el('div', 'header-overlay-media');

  const title = section.querySelector('h1, h2, h3, h4, h5, h6');
  if (title) {
    const heading = el('h2', 'header-overlay-title', { id: 'header-overlay-title' });
    heading.append(...title.childNodes);
    overlay.setAttribute('aria-labelledby', heading.id);
    menu.append(heading);
  }

  const lists = [...section.querySelectorAll(':scope > ul')];
  const brandList = lists[0];
  const covers = [];
  if (brandList) {
    const brands = el('ul', 'header-overlay-brands');
    [...brandList.children].forEach((li, i) => {
      const links = [...li.querySelectorAll('a')];
      const [link, video] = links;
      const img = posters[i];
      if (!link) return;
      const item = el('li');
      link.textContent = link.textContent.trim();
      item.append(link);
      brands.append(item);

      const cover = el('div', 'header-overlay-cover');
      if (img) {
        img.className = 'header-overlay-poster';
        img.alt = '';
        img.loading = 'lazy';
        cover.append(img);
      }
      if (video) cover.dataset.video = video.getAttribute('href');
      covers.push(cover);
      media.append(cover);
      const activate = () => {
        covers.forEach((c, j) => c.classList.toggle('is-active', j === i));
        // eslint-disable-next-line no-use-before-define
        playCover(cover);
      };
      link.addEventListener('mouseenter', activate);
      link.addEventListener('focus', activate);
    });
    menu.append(brands);
  }

  // accordion: heading after the brand list + the following list
  const toggleLabel = [...section.querySelectorAll(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6')]
    .find((h) => h !== title);
  const subList = lists[1];
  if (toggleLabel && subList) {
    const utility = el('ul', 'header-overlay-utility');
    const item = el('li');
    const toggle = el('button', 'header-overlay-toggle', {
      type: 'button', 'aria-expanded': 'true', 'aria-controls': 'header-overlay-submenu',
    });
    toggle.append(toggleLabel.textContent.trim(), icon('plus'), icon('minus'));
    const submenu = el('ul', 'header-overlay-submenu', { id: 'header-overlay-submenu' });
    submenu.append(...subList.children);
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      submenu.hidden = expanded;
    });
    item.append(toggle, submenu);
    utility.append(item);
    menu.append(utility);
  }

  function playCover(cover) {
    if (!isDesktop.matches || overlay.hidden || !cover?.dataset.video) return;
    if (cover.querySelector('iframe')) return;
    const frame = el('iframe', 'header-overlay-video', {
      src: cover.dataset.video,
      title: '',
      allow: 'autoplay; fullscreen; picture-in-picture',
      loading: 'lazy',
      tabindex: '-1',
      'aria-hidden': 'true',
    });
    cover.append(frame);
  }

  if (covers[0]) covers[0].classList.add('is-active');
  layout.append(menu, media);
  overlay.append(close, layout);

  return {
    overlay,
    close,
    playActive: () => playCover(covers.find((c) => c.classList.contains('is-active'))),
  };
}

/**
 * Builds row 0 tools (market switcher, cart, contact) from the tools section.
 * @param {Element} section tools section of the global document
 * @param {string} root current site root
 * @returns {{tools: Element, marketToggle: Element|null, marketList: Element|null}}
 */
function buildTools(section, root) {
  const tools = el('div', 'header-tools');
  const prefix = root.replace(/\/[a-z]{2}-[a-z]{2}$/, '');
  let marketToggle = null;
  let marketList = null;

  const labelPara = [...section.querySelectorAll(':scope > p')].find((p) => !p.querySelector('a'));
  const list = section.querySelector(':scope > ul');
  if (list) {
    const market = el('div', 'header-tool header-market');
    marketToggle = el('button', 'header-market-toggle', {
      type: 'button', 'aria-expanded': 'false', 'aria-controls': 'header-market-list',
    });
    const label = el('span', 'header-tool-text');
    label.textContent = labelPara ? labelPara.textContent.trim() : '';
    marketToggle.append(icon('globe'));
    // small screens show the locale code of the current site (e.g. EN-GB) instead of the label
    const locale = root.match(/[a-z]{2}-[a-z]{2}$/);
    if (locale) {
      const code = el('span', 'header-tool-code', { 'aria-hidden': 'true' });
      code.textContent = locale[0].toUpperCase();
      marketToggle.append(code);
    }
    marketToggle.append(label, icon('chevron'));
    marketToggle.setAttribute('aria-label', label.textContent);
    marketList = el('ul', 'header-market-list', { id: 'header-market-list' });
    marketList.hidden = true;
    [...list.children].forEach((li) => {
      const a = li.querySelector('a');
      if (!a) return;
      rewriteMarketLink(a, prefix);
      a.textContent = a.textContent.trim();
      a.className = 'header-market-item';
      marketList.append(li);
    });
    market.append(marketToggle, marketList);
    tools.append(market);
  }

  section.querySelectorAll(':scope > p').forEach((p) => {
    const a = p.querySelector('a');
    if (!a) return;
    rewriteToRoot(a, root);
    const extra = [...p.childNodes]
      .filter((n) => n !== a)
      .map((n) => n.textContent)
      .join('')
      .trim();
    const item = el('div', 'header-tool');
    const link = el('a', 'header-tool-link', { href: a.getAttribute('href') });
    const text = el('span', 'header-tool-text');
    text.textContent = a.textContent.trim();
    if (extra) {
      const badge = el('span', 'header-tool-badge');
      badge.textContent = extra;
      link.append(text, badge);
      item.classList.add('header-tool-count');
    } else {
      link.append(icon('link'), text);
      item.classList.add('header-tool-plain');
    }
    item.append(link);
    tools.append(item);
  });

  return { tools, marketToggle, marketList };
}

/**
 * Builds the mega menu panel from a sub-nav item with nested tab lists.
 * @param {Element} li sub-nav item (label text + nested ul of tabs)
 * @returns {Element} panel
 */
function buildMegaPanel(li) {
  const panel = el('div', 'header-mega', { id: 'header-mega' });
  panel.hidden = true;
  const inner = el('div', 'header-container header-mega-inner');
  const tablist = el('div', 'header-mega-tabs', { role: 'tablist' });
  const panels = el('div', 'header-mega-panels');
  const tabs = [...li.querySelectorAll(':scope > ul > li')];

  tabs.forEach((tabItem, i) => {
    const tab = el('button', 'header-mega-tab', {
      type: 'button',
      role: 'tab',
      id: `header-mega-tab-${i}`,
      'aria-controls': `header-mega-panel-${i}`,
      'aria-selected': String(i === 0),
      tabindex: i === 0 ? '0' : '-1',
    });
    tab.textContent = ownText(tabItem);
    const grid = el('ul', 'header-mega-cards', {
      role: 'tabpanel', id: `header-mega-panel-${i}`, 'aria-labelledby': tab.id,
    });
    grid.hidden = i !== 0;
    tabItem.querySelectorAll(':scope > ul > li').forEach((cardItem) => {
      const a = cardItem.querySelector('a');
      if (!a) return;
      const img = cardItem.querySelector('img');
      const card = el('li', 'header-card');
      const link = el('a', 'header-card-link', { href: a.getAttribute('href') });
      if (img) {
        img.loading = 'lazy';
        img.className = 'header-card-image';
        const frame = el('span', 'header-card-media');
        frame.append(img);
        link.append(frame);
      }
      const name = el('span', 'header-card-name');
      name.textContent = a.textContent.trim();
      link.append(name);
      card.append(link);
      grid.append(card);
    });
    tab.addEventListener('click', () => {
      tablist.querySelectorAll('[role="tab"]').forEach((t) => {
        const selected = t === tab;
        t.setAttribute('aria-selected', String(selected));
        t.setAttribute('tabindex', selected ? '0' : '-1');
      });
      panels.querySelectorAll('[role="tabpanel"]').forEach((p) => {
        p.hidden = p !== grid;
      });
    });
    tablist.append(tab);
    panels.append(grid);
  });

  tablist.addEventListener('keydown', (e) => {
    if (e.code !== 'ArrowRight' && e.code !== 'ArrowLeft') return;
    const all = [...tablist.querySelectorAll('[role="tab"]')];
    const current = all.indexOf(document.activeElement);
    if (current < 0) return;
    const next = all[(current + (e.code === 'ArrowRight' ? 1 : -1) + all.length) % all.length];
    next.focus();
    next.click();
  });

  inner.append(tablist, panels);
  panel.append(inner);
  return panel;
}

/**
 * Wraps the sub-nav list in a horizontal scroller with previous / next hints
 * (small screens; the wrappers are layout-transparent on desktop).
 * @param {Element} list sub-nav list
 * @returns {Element} scroll wrapper
 */
function buildSubnavScroll(list) {
  const scroll = el('div', 'header-subnav-scroll');
  const scroller = el('div', 'header-subnav-scroller');
  scroller.append(list);
  const hints = ['prev', 'next'].map((dir) => {
    const hint = el('button', `header-subnav-hint header-subnav-hint-${dir}`, {
      type: 'button', tabindex: '-1', 'aria-hidden': 'true',
    });
    hint.append(icon('chevron'));
    hint.addEventListener('click', () => {
      const step = scroller.clientWidth * 0.8 * (dir === 'next' ? 1 : -1);
      scroller.scrollBy({ left: step, behavior: 'smooth' });
    });
    return hint;
  });
  scroll.append(hints[0], scroller, hints[1]);

  let frame = null;
  const update = () => {
    frame = null;
    const width = scroller.clientWidth;
    const left = Math.abs(scroller.scrollLeft);
    scroll.classList.toggle('is-overflow', width > 96 && scroller.scrollWidth > width + 1);
    scroll.classList.toggle('is-at-start', left <= 1);
    scroll.classList.toggle('is-at-end', left + width >= scroller.scrollWidth - 1);
  };
  const queue = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  scroller.addEventListener('scroll', queue, { passive: true });
  if (window.ResizeObserver) new ResizeObserver(queue).observe(scroller);
  queue();
  return scroll;
}

/**
 * Builds the expandable search (button + form) from the search section copy.
 * @param {Element} section search section of the site document
 * @param {string} root current site root
 * @returns {{search: Element, toggle: Element, form: Element}}
 */
function buildSearch(section, root) {
  const [placeholderPara, allPara] = [...section.querySelectorAll(':scope > p')];
  const placeholder = placeholderPara ? placeholderPara.textContent.trim() : '';
  const search = el('div', 'header-search');
  const toggle = el('button', 'header-search-toggle', {
    type: 'button', 'aria-expanded': 'false', 'aria-controls': 'header-search-form', 'aria-label': placeholder,
  });
  const label = el('span', 'header-search-label');
  label.textContent = placeholder;
  toggle.append(label, icon('search'));

  const form = el('form', 'header-search-form', {
    id: 'header-search-form',
    action: `${SEARCH_ORIGIN}${root}${SEARCH_PATH}`,
    method: 'post',
    role: 'search',
  });
  form.hidden = true;
  if (allPara) {
    const all = el('label', 'header-search-all');
    const checkbox = el('input', '', { type: 'checkbox', name: 'sitewide', value: '1' });
    all.append(checkbox, allPara.textContent.trim());
    form.append(all);
  }
  const input = el('input', 'header-search-input', {
    type: 'text', name: 'search', placeholder, 'aria-label': placeholder, autocomplete: 'off', maxlength: '255',
  });
  const formId = el('input', '', { type: 'hidden', name: 'form_id', value: 'search_form' });
  const submit = el('button', 'header-search-submit', { type: 'submit', 'aria-label': placeholder });
  submit.append(icon('search'));
  form.append(input, formId, submit);
  search.append(toggle, form);
  return { search, toggle, form };
}

/* ---------- decorate ---------- */

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  const globalDoc = resp.ok ? await parseFragment(resp) : document.implementation.createHTMLDocument('');
  const root = getSiteRoot(window.location.pathname);
  const siteDoc = await fetchSiteDocument(root);

  const globalSections = [...globalDoc.body.querySelectorAll(':scope > div')];
  // image-only section = overlay covers; the other sections keep their order
  const coverSection = globalSections.find((s) => paragraphImages(s).length
    && !s.querySelector('a, ul, h1, h2, h3, h4, h5, h6'));
  const [triggerSection, overlaySection, toolsSection] = globalSections
    .filter((s) => s !== coverSection);
  const covers = coverSection ? paragraphImages(coverSection) : [];

  block.textContent = '';
  const wrapper = el('div', 'nav-wrapper');
  const nav = el('nav', 'header-nav', { id: 'nav', 'aria-label': 'Main navigation' });

  /* row 0: menu trigger + tools */
  const top = el('div', 'header-top');
  const topInner = el('div', 'header-container header-top-inner');
  const [menuPara, closePara] = triggerSection ? [...triggerSection.querySelectorAll(':scope > p')] : [];
  const menuToggle = el('button', 'header-menu-toggle', {
    type: 'button', 'aria-expanded': 'false', 'aria-controls': 'header-overlay',
  });
  menuToggle.append(glyph('menu', 'header-menu-icon'));
  const menuLabel = el('span', 'header-menu-label');
  menuLabel.textContent = menuPara ? menuPara.textContent.trim() : '';
  menuToggle.append(menuLabel);
  topInner.append(menuToggle);

  const { tools, marketToggle, marketList } = toolsSection
    ? buildTools(toolsSection, root)
    : { tools: el('div', 'header-tools') };
  topInner.append(tools);
  top.append(topInner);
  nav.append(top);

  /* overlay */
  let overlayParts = null;
  if (overlaySection) {
    overlaySection.querySelectorAll('a').forEach((a) => rewriteToRoot(a, root));
    overlayParts = buildOverlay(overlaySection, closePara && closePara.textContent.trim(), covers);
  }

  /* site document: brand bar, sub-nav, search */
  let megaToggle = null;
  let megaPanel = null;
  let searchParts = null;
  let subnav = null;
  if (siteDoc) {
    const sections = [...siteDoc.body.querySelectorAll(':scope > div')];
    const brandSection = sections.find((s) => paragraphImages(s).length);
    const navSection = sections.find((s) => s.querySelector(':scope > ul'));
    const searchSection = sections.find((s) => s !== brandSection && s !== navSection
      && !s.querySelector('a, ul'));

    if (brandSection) {
      const brand = el('div', 'header-brand');
      const brandInner = el('div', 'header-container header-brand-inner');
      // logo image paragraph + the link paragraph right after it = logo link
      const [logoImg] = paragraphImages(brandSection);
      const next = logoImg.closest('p').nextElementSibling;
      const homeLink = next && next.matches('p') ? next.querySelector(':scope > a') : null;
      const logoLink = homeLink || el('span');
      if (!logoImg.getAttribute('alt') && homeLink) logoImg.alt = homeLink.textContent.trim();
      logoLink.className = 'header-brand-logo';
      logoImg.className = 'header-brand-logo-image';
      logoLink.replaceChildren(logoImg);
      brandInner.append(logoLink);
      const external = [...brandSection.querySelectorAll('a')].find((a) => a !== logoLink);
      if (external) {
        external.className = 'header-brand-link';
        const text = el('span');
        text.textContent = external.textContent.trim();
        external.textContent = '';
        external.append(text, icon('arrow'));
        brandInner.append(external);
      }
      brand.append(brandInner);
      nav.append(brand);
    }

    if (navSection || searchSection) {
      subnav = el('div', 'header-subnav');
      const subInner = el('div', 'header-container header-subnav-inner');
      if (navSection) {
        const list = el('ul', 'header-subnav-list');
        [...navSection.querySelector(':scope > ul').children].forEach((li) => {
          const item = el('li', 'header-subnav-item');
          if (li.querySelector(':scope > ul') && !megaPanel) {
            // small screens: the label links to a separate page listing the menu cards
            const pageLink = li.querySelector(':scope > a');
            const label = ownText(li) || (pageLink ? pageLink.textContent.trim() : '');
            if (pageLink) {
              const mobileItem = el('li', 'header-subnav-item header-subnav-mobile');
              const a = el('a', 'header-subnav-link', { href: pageLink.getAttribute('href') });
              a.textContent = label;
              mobileItem.append(a);
              list.append(mobileItem);
            }
            megaPanel = buildMegaPanel(li);
            megaToggle = el('button', 'header-subnav-link header-mega-toggle', {
              type: 'button', 'aria-expanded': 'false', 'aria-controls': 'header-mega',
            });
            megaToggle.append(label, icon('chevron'));
            item.classList.add('header-subnav-mega');
            item.append(megaToggle);
          } else {
            const a = li.querySelector('a');
            if (!a) return;
            a.className = 'header-subnav-link';
            a.textContent = a.textContent.trim();
            item.append(a);
          }
          list.append(item);
        });
        subInner.append(buildSubnavScroll(list));
      } else {
        nav.classList.add('header-no-subnav');
      }
      if (searchSection) {
        searchParts = buildSearch(searchSection, root);
        subInner.append(searchParts.search);
      }
      subnav.append(subInner);
      nav.append(subnav);
    }
    if (megaPanel) nav.append(megaPanel);
  }

  const dim = el('div', 'header-dim', { 'aria-hidden': 'true' });
  dim.hidden = true;

  wrapper.append(nav);
  if (overlayParts) wrapper.append(overlayParts.overlay);
  wrapper.append(dim);
  block.append(wrapper);

  // logos without intrinsic dimensions (viewBox-only SVG) collapse to 0 in the flex row
  const logo = nav.querySelector('.header-brand-logo-image');
  const sizeLogo = () => {
    if (logo.naturalWidth && !logo.getBoundingClientRect().width) logo.classList.add('header-brand-logo-sized');
  };
  if (logo) {
    if (logo.complete) sizeLogo();
    else logo.addEventListener('load', sizeLogo, { once: true });
  }

  /* ---------- state ---------- */
  const setPanelTop = () => {
    const bottom = Math.max(0, nav.getBoundingClientRect().bottom);
    wrapper.style.setProperty('--header-bottom', `${bottom}px`);
  };

  function setMarket(open) {
    if (!marketToggle) return;
    marketToggle.setAttribute('aria-expanded', String(open));
    marketToggle.parentElement.classList.toggle('is-open', open);
    marketList.hidden = !open;
  }

  function setMega(open) {
    if (!megaToggle) return;
    megaToggle.setAttribute('aria-expanded', String(open));
    megaToggle.parentElement.classList.toggle('is-open', open);
    megaPanel.hidden = !open;
    if (open) setPanelTop();
  }

  function setSearch(open) {
    if (!searchParts) return;
    searchParts.toggle.setAttribute('aria-expanded', String(open));
    searchParts.search.classList.toggle('is-open', open);
    searchParts.form.hidden = !open;
    dim.hidden = !open;
    if (open) {
      setPanelTop();
      searchParts.form.querySelector('.header-search-input').focus({ preventScroll: true });
    }
  }

  function setOverlay(open) {
    if (!overlayParts) return;
    overlayParts.overlay.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      overlayParts.playActive();
      overlayParts.overlay.focus({ preventScroll: true });
    }
  }

  function closeAll() {
    setMarket(false);
    setMega(false);
    setSearch(false);
    setOverlay(false);
  }

  /* ---------- events ---------- */
  menuToggle.addEventListener('click', () => {
    if (!overlayParts) return;
    setOverlay(overlayParts.overlay.hidden);
  });
  if (overlayParts) {
    overlayParts.close.addEventListener('click', () => {
      setOverlay(false);
      menuToggle.focus();
    });
  }
  if (marketToggle) {
    marketToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = marketList.hidden;
      setMarket(open);
      if (open) {
        setMega(false);
        setSearch(false);
      }
    });
    document.addEventListener('click', (e) => {
      if (!marketList.hidden && !marketToggle.parentElement.contains(e.target)) setMarket(false);
    });
  }
  if (megaToggle) {
    megaToggle.addEventListener('click', () => {
      const open = megaPanel.hidden;
      setMega(open);
      if (open) {
        setMarket(false);
        setSearch(false);
      }
    });
  }
  if (searchParts) {
    searchParts.toggle.addEventListener('click', () => {
      const open = searchParts.form.hidden;
      setSearch(open);
      if (open) {
        setMarket(false);
        setMega(false);
      }
    });
    dim.addEventListener('click', () => setSearch(false));
    // small screens have no dim layer: a tap outside the search closes it
    document.addEventListener('click', (e) => {
      if (!isDesktop.matches && !searchParts.form.hidden
        && !searchParts.search.contains(e.target)) setSearch(false);
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.code !== 'Escape') return;
    if (overlayParts && !overlayParts.overlay.hidden) {
      setOverlay(false);
      menuToggle.focus();
    } else if (megaPanel && !megaPanel.hidden) {
      setMega(false);
      megaToggle.focus();
    } else if (marketList && !marketList.hidden) {
      setMarket(false);
      marketToggle.focus();
    } else if (searchParts && !searchParts.form.hidden) {
      setSearch(false);
      searchParts.toggle.focus();
    }
  });

  isDesktop.addEventListener('change', closeAll);

  /* fixed header: keep page offset, shrink on scroll */
  const syncHeight = () => {
    if (wrapper.classList.contains('is-shrunk')) return;
    document.documentElement.style.setProperty('--nav-height', `${nav.offsetHeight}px`);
    if (subnav) wrapper.style.setProperty('--header-shrink-offset', `${subnav.offsetTop}px`);
  };
  const onScroll = () => {
    const shrunk = window.scrollY > SHRINK_THRESHOLD;
    if (shrunk && !wrapper.classList.contains('is-shrunk')) {
      syncHeight();
      setSearch(false);
    }
    wrapper.classList.toggle('is-shrunk', shrunk);
    if ((megaPanel && !megaPanel.hidden) || !dim.hidden) setPanelTop();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  nav.addEventListener('transitionend', () => {
    if ((megaPanel && !megaPanel.hidden) || !dim.hidden) setPanelTop();
  });
  if (window.ResizeObserver) new ResizeObserver(syncHeight).observe(nav);
  syncHeight();
  onScroll();
}
