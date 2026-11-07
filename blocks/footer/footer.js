/*
 * Footer block — built from two documents:
 * 1. Global document (/content/footer.plain.html, fallback /footer.plain.html):
 *    first section = newsletter band (heading, subscribe link, status text);
 *    every further section = a footer column (heading + link list and/or back-to-top link).
 *    Links starting with the default locale root (/en-gb/...) are rewritten to the current
 *    site root (/defender/en-gb/...).
 * 2. Site document (/content{root}/footer.plain.html, fallback {root}/footer.plain.html):
 *    - a section without heading holding an image = brand logo of the newsletter band
 *      (the band is only shown when the site provides a logo);
 *    - a section whose heading matches a global column heading supplies that column's list
 *      (social items: link, or label + nested list of links = popup; the network glyph is
 *      drawn inline, chosen from the link text or else the link hostname);
 *    - any other section with images = logo strip shown above the footer (e.g. partners).
 * All copy, links and images come from the fetched documents; UI glyphs are drawn inline.
 */

const LOCALE_SEGMENT = /^[a-z]{2}-[a-z]{2}$/;

const ICONS = {
  up: '<svg viewBox="0 0 1024 1024" aria-hidden="true" focusable="false"><path fill="currentColor" transform="matrix(1 0 0 -1 0 960)" d="M540.672 763.392c-4.096 4.096-8.192 6.144-14.336 8.192-4.096 2.048-8.192 4.096-14.336 4.096s-10.24-2.048-16.384-4.096c-4.096-2.048-10.24-4.096-14.336-8.192l-163.84-163.84c-16.384-16.384-16.384-40.96 0-57.344s40.96-16.384 57.344 0l94.208 94.208v-475.136c0-22.528 18.432-40.96 40.96-40.96s40.96 18.432 40.96 40.96v475.136l94.208-94.208c16.384-16.384 40.96-16.384 57.344 0s16.384 40.96 0 57.344l-161.792 163.84zM921.6 857.6v-819.2h-819.2v819.2h819.2zM1003.52 939.52h-983.040v-983.040h983.040v983.040z"/></svg>',
  arrow: '<svg viewBox="0 0 1024 1024" aria-hidden="true" focusable="false"><path fill="currentColor" transform="matrix(1 0 0 -1 0 960)" d="M606.208 220.672l391.168 423.936c6.144 8.192 10.24 18.432 10.24 28.672 0 22.528-18.432 40.96-40.96 40.96-12.288 0-22.528-4.096-30.72-12.288l-391.168-423.936c-8.192-8.192-18.432-12.288-30.72-12.288s-22.528 4.096-30.72 12.288l-387.072 423.936c-8.192 8.192-18.432 12.288-30.72 12.288-22.528 0-40.96-18.432-40.96-40.96 0-10.24 4.096-20.48 10.24-28.672l391.168-423.936c22.528-24.576 55.296-38.912 90.112-38.912s67.584 14.336 90.112 38.912z"/></svg>',
  close: '<svg viewBox="0 0 1024 1024" aria-hidden="true" focusable="false"><path fill="currentColor" transform="matrix(1 0 0 -1 0 960)" d="M32.768-31.232c8.192-8.192 18.432-12.288 28.672-12.288s20.48 4.096 28.672 12.288l421.888 421.888 421.888-421.888c8.192-8.192 18.432-12.288 28.672-12.288s20.48 4.096 28.672 12.288c16.384 16.384 16.384 40.96 0 57.344l-421.888 421.888 421.888 421.888c16.384 16.384 16.384 40.96 0 57.344s-40.96 16.384-57.344 0l-421.888-421.888-421.888 421.888c-16.384 16.384-40.96 16.384-57.344 0s-16.384-40.96 0-57.344l421.888-421.888-421.888-421.888c-16.384-16.384-16.384-40.96 0-57.344z"/></svg>',
};

/* social networks: label, glyph, hostname pattern, text pattern (link text wins over host) */
const SOCIAL = {
  instagram: {
    label: 'Instagram',
    host: /instagram\.com$/i,
    text: /instagram/i,
    svg: '<svg viewBox="0 0 1536 1792" width="20.571" height="24"><path fill="#fff" transform="matrix(1 0 0 -1 0 1536)" d="M1024 640q0 106 -75 181t-181 75t-181 -75t-75 -181t75 -181t181 -75t181 75t75 181zM1162 640q0 -164 -115 -279t-279 -115t-279 115t-115 279t115 279t279 115t279 -115t115 -279zM1270 1050q0 -38 -27 -65t-65 -27t-65 27t-27 65t27 65t65 27t65 -27t27 -65zM768 1270 q-7 0 -76.5 0.5t-105.5 0t-96.5 -3t-103 -10t-71.5 -18.5q-50 -20 -88 -58t-58 -88q-11 -29 -18.5 -71.5t-10 -103t-3 -96.5t0 -105.5t0.5 -76.5t-0.5 -76.5t0 -105.5t3 -96.5t10 -103t18.5 -71.5q20 -50 58 -88t88 -58q29 -11 71.5 -18.5t103 -10t96.5 -3t105.5 0t76.5 0.5 t76.5 -0.5t105.5 0t96.5 3t103 10t71.5 18.5q50 20 88 58t58 88q11 29 18.5 71.5t10 103t3 96.5t0 105.5t-0.5 76.5t0.5 76.5t0 105.5t-3 96.5t-10 103t-18.5 71.5q-20 50 -58 88t-88 58q-29 11 -71.5 18.5t-103 10t-96.5 3t-105.5 0t-76.5 -0.5zM1536 640q0 -229 -5 -317 q-10 -208 -124 -322t-322 -124q-88 -5 -317 -5t-317 5q-208 10 -322 124t-124 322q-5 88 -5 317t5 317q10 208 124 322t322 124q88 5 317 5t317 -5q208 -10 322 -124t124 -322q5 -88 5 -317z"/></svg>',
  },
  facebook: {
    label: 'Facebook',
    host: /(facebook|fb)\.com$/i,
    text: /facebook/i,
    svg: '<svg viewBox="0 0 1024 1024" width="24" height="24"><path fill="#fff" transform="matrix(1 0 0 -1 0 960)" d="M408 -44L408 405L256 405L256 579L408 579L408 708Q408 764 424.5 807Q441 850 470.5 879.5Q500 909 541.5 924.5Q583 940 633 940Q680 940 717.5 937.5Q755 935 766 933L766 776L674 776Q620 776 604 752Q588 728 588 690L588 579L760 579L737 405L588 405L588 -44L408 -44Z"/></svg>',
  },
  x: {
    label: 'X',
    host: /(^|\.)(x|twitter)\.com$/i,
    text: /twitter|\bx\b/i,
    svg: '<svg viewBox="0 0 512 512" width="24" height="24"><path stroke="#fff" fill="#fff" d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>',
  },
  youtube: {
    label: 'YouTube',
    host: /(youtube\.com|youtu\.be)$/i,
    text: /youtube/i,
    svg: '<svg viewBox="0 0 1024 1024" width="24" height="24"><path fill="#fff" transform="matrix(1 0 0 -1 0 960)" d="M987 679Q999 624 1001.5 564.5Q1004 505 1004 448Q1004 391 1001.5 331.5Q999 272 987 217Q978 178 948.5 151.5Q919 125 881 120Q835 115 788.5 111Q742 107 696 104Q650 101 604 99.5Q558 98 512 98Q466 98 420 99.5Q374 101 328 104Q282 107 235.5 111Q189 115 143 120Q105 125 75.5 151.5Q46 178 37 217Q25 272 22.5 331.5Q20 391 20 448Q20 505 22.5 564.5Q25 624 37 679Q46 718 75.5 744.5Q105 771 143 776Q189 781 235.5 785Q282 789 328 792Q374 795 420 796.5Q466 798 512 798Q558 798 604 796.5Q650 795 696 792Q742 789 788.5 785Q835 781 881 776Q919 771 948.5 744.5Q978 718 987 679ZM680 425Q697 435 697 448Q697 461 680 471L449 595Q439 601 431 601Q425 601 416.5 596Q408 591 408 571L408 325Q408 305 416.5 300Q425 295 431 295Q439 295 449 301L680 425Z"/></svg>',
  },
  tiktok: {
    label: 'TikTok',
    host: /tiktok\.com$/i,
    text: /tiktok/i,
    svg: '<svg viewBox="0 0 1024 1024" width="24" height="24"><path fill="#fff" transform="matrix(1 0 0 -1 0 960)" d="M926 728L926 563Q862 563 805 582Q748 601 700 636L700 302Q700 239 676.5 184Q653 129 612 88Q571 47 516.5 23.5Q462 0 400 0Q338 0 283 23.5Q228 47 187 88Q146 129 122.5 184Q99 239 99 302Q99 365 123 420Q147 475 188 516Q229 557 283.5 581Q338 605 400 605Q410 605 420 604.5Q430 604 440 603L440 434Q422 441 400 441Q371 441 346 430Q321 419 302 400.5Q283 382 272.5 356.5Q262 331 262 302Q262 274 273 248.5Q284 223 303 204Q322 185 347 174Q372 163 400 163Q427 163 451.5 173.5Q476 184 494.5 202.5Q513 221 524 245.5Q535 270 536 297L536 957L700 957Q700 910 717.5 868.5Q735 827 765.5 795.5Q796 764 837 746Q878 728 926 728Z"/></svg>',
  },
  linkedin: {
    label: 'LinkedIn',
    host: /linkedin\.com$/i,
    text: /linkedin/i,
    svg: '<svg viewBox="0 0 1024 1024" width="24" height="24"><path fill="#fff" transform="matrix(1 0 0 -1 0 960)" d="M137 702Q88 702 54 737Q20 772 20 821Q20 870 54 905Q88 940 137 940Q186 940 221 905Q256 870 256 821Q256 772 221 737Q186 702 137 702ZM369 -44L369 614L565 614L565 524L567 524Q587 562 636.5 596Q686 630 760 630Q837 630 885.5 606Q934 582 960.5 540Q987 498 996.5 441Q1006 384 1006 317L1006 -44L799 -44L799 276Q799 333 785 391.5Q771 450 692 450Q612 450 590.5 397.5Q569 345 569 282L569 -44L369 -44ZM240 -44L35 -44L35 614L240 614L240 -44Z"/></svg>',
  },
  rss: {
    label: 'RSS',
    host: /(^|\.)(rss|feeds?)\./i,
    text: /\brss\b|\bfeed\b/i,
    svg: '<svg viewBox="0 0 1024 1024" width="24" height="24"><path fill="#fff" d="M160 704a96 96 0 1 1 0 192 96 96 0 0 1 0-192zM64 384c318 0 576 258 576 576H480c0-230-186-416-416-416V384zm0-320c495 0 896 401 896 896H800c0-406-330-736-736-736V64z"/></svg>',
  },
};

/**
 * Creates an element with optional class name.
 * @param {string} tag tag name
 * @param {string} [className] class name
 * @returns {Element}
 */
function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

/**
 * Creates a span holding an inline decorative icon.
 * @param {string} name icon key
 * @param {string} className class name
 * @returns {Element}
 */
function icon(name, className) {
  const span = el('span', className);
  span.innerHTML = ICONS[name];
  return span;
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
 * Parses a plain.html response and resolves relative image paths against the document URL.
 * @param {Response} resp fetch response
 * @returns {Promise<Document>}
 */
async function parseDocument(resp) {
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
 * Fetches the first available document of a list of paths.
 * @param {string[]} paths candidate paths
 * @returns {Promise<Document|null>}
 */
async function fetchDocument(paths) {
  try {
    let resp = await fetch(paths[0]);
    if (!resp.ok && paths[1]) resp = await fetch(paths[1]);
    return resp.ok ? parseDocument(resp) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Normalises a heading text for matching (case and punctuation insensitive).
 * @param {string} text text
 * @returns {string}
 */
function key(text) {
  return (text || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Splits a document into its top-level sections.
 * @param {Document|null} doc document
 * @returns {{heading: Element|null, key: string, node: Element}[]}
 */
function readSections(doc) {
  if (!doc) return [];
  return [...doc.body.children]
    .filter((node) => node.tagName === 'DIV')
    .map((node) => {
      const heading = node.querySelector('h1, h2, h3, h4, h5, h6');
      return { heading, key: key(heading && heading.textContent), node };
    });
}

/**
 * Rewrites a link starting with a locale root (e.g. /en-gb/cookies) to the site root.
 * @param {Element} link anchor
 * @param {string} root site root
 */
function rewriteToRoot(link, root) {
  const href = link.getAttribute('href') || '';
  const match = href.match(/^\/([a-z]{2}-[a-z]{2})(\/.*)?$/);
  if (!root || !match) return;
  link.setAttribute('href', `${root}${match[2] || ''}`);
}

/**
 * Returns the trimmed own text of an element (text nodes only).
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

/**
 * Returns the social network key of a link hostname.
 * @param {string} href link href
 * @returns {string|null}
 */
function networkOfHost(href) {
  let url;
  try {
    url = new URL(href, window.location.href);
  } catch (e) {
    return null;
  }
  const host = url.hostname.replace(/^www\./, '');
  const found = Object.keys(SOCIAL).find((k) => SOCIAL[k].host.test(host))
    || (/\b(rss|feed)\b/i.test(url.pathname) ? 'rss' : null);
  return found || null;
}

/**
 * Returns the social network of a list item: named in its label / link text, otherwise
 * derived from the hostname of its (first) link.
 * @param {Element} item list item
 * @returns {string|null}
 */
function networkOf(item) {
  const label = item.querySelector(':scope > strong, :scope > b, :scope > p, :scope > a');
  const text = label ? label.textContent : ownText(item);
  const named = Object.keys(SOCIAL).find((k) => SOCIAL[k].text.test(text));
  const link = item.querySelector('a');
  return named || (link ? networkOfHost(link.getAttribute('href')) : null);
}

/**
 * Creates the decorative glyph of a social network.
 * @param {string} network network key
 * @returns {Element}
 */
function socialGlyph(network) {
  const tpl = document.createElement('template');
  tpl.innerHTML = SOCIAL[network].svg;
  const svg = tpl.content.firstElementChild;
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  return svg;
}

/**
 * Tells whether a list is a list of social network links (every item links to a network).
 * @param {Element} list ul
 * @returns {boolean}
 */
function isSocialList(list) {
  const items = [...list.querySelectorAll(':scope > li')];
  return items.length > 0 && items.every((li) => {
    const link = li.querySelector('a');
    return link && networkOfHost(link.getAttribute('href'));
  });
}

/**
 * Builds a modal list of links (opened by a social button).
 * @param {Element} item list item: label + nested list
 * @param {string} network social network key
 * @param {string} title popup title
 * @returns {Element} dialog
 */
function buildPopup(item, network, title) {
  const dialog = el('dialog', 'social-popup');
  const titleId = `footer-popup-${network}-${Math.random().toString(36).slice(2, 7)}`;
  dialog.setAttribute('aria-labelledby', titleId);

  const container = el('div', 'social-popup-inner');
  const header = el('div', 'social-popup-header');
  const eyebrow = el('p', 'social-popup-eyebrow');
  const eyebrowIcon = el('span', 'social-popup-eyebrow-icon');
  eyebrowIcon.append(socialGlyph(network));
  eyebrow.append(eyebrowIcon, SOCIAL[network].label);
  const close = el('button', 'social-popup-close');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close');
  close.append(icon('close', 'social-popup-close-icon'));
  close.addEventListener('click', () => dialog.close());
  header.append(eyebrow, close);

  const heading = el('h3', 'social-popup-title');
  heading.id = titleId;
  heading.textContent = title;

  const list = el('div', 'social-popup-list');
  item.querySelectorAll(':scope > ul > li').forEach((li) => {
    const link = li.querySelector('a');
    if (!link) return;
    const row = el('a', 'social-popup-row');
    row.href = link.getAttribute('href');
    const text = el('span', 'social-popup-text');
    const name = el('span', 'social-popup-name');
    name.textContent = link.textContent.trim();
    text.append(name);
    const sub = ownText(li);
    if (sub) {
      const subEl = el('span', 'social-popup-sub');
      subEl.textContent = sub;
      text.append(subEl);
    }
    row.append(text, icon('arrow', 'social-popup-arrow'));
    list.append(row);
  });

  container.append(header, heading, list);
  dialog.append(container);
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  return dialog;
}

/**
 * Builds the social bar from a list of icon items.
 * @param {Element} list ul of social items
 * @returns {Element}
 */
function buildSocialBar(list) {
  const bar = el('div', 'social-bar');
  list.querySelectorAll(':scope > li').forEach((item) => {
    const platform = networkOf(item);
    if (!platform) return;
    const nested = item.querySelector(':scope > ul');
    const directLink = item.querySelector(':scope > a');
    if (nested) {
      const label = item.querySelector(':scope > strong, :scope > b, :scope > p');
      const title = (label ? label.textContent : ownText(item)).trim();
      const button = el('button', `social-button social-${platform}`);
      button.type = 'button';
      button.setAttribute('aria-label', title);
      button.setAttribute('aria-haspopup', 'dialog');
      button.append(socialGlyph(platform));
      const dialog = buildPopup(item, platform, title);
      button.addEventListener('click', () => dialog.showModal());
      bar.append(button, dialog);
    } else if (directLink) {
      const link = el('a', `social-button social-${platform}`);
      link.href = directLink.getAttribute('href');
      link.setAttribute('aria-label', directLink.textContent.trim());
      link.append(socialGlyph(platform));
      bar.append(link);
    }
  });
  return bar;
}

/**
 * Builds a plain link list.
 * @param {Element} list ul of links
 * @param {string} root site root used to rewrite locale links
 * @returns {Element}
 */
function buildLinkList(list, root) {
  const ul = el('ul', 'footer-links');
  list.querySelectorAll(':scope > li').forEach((li) => {
    const link = li.querySelector('a');
    if (!link) return;
    const item = el('li');
    const a = link.cloneNode(true);
    rewriteToRoot(a, root);
    item.append(a);
    ul.append(item);
  });
  return ul;
}

/**
 * Builds the back-to-top button from a hash link.
 * @param {Element} link anchor with a hash href
 * @returns {Element}
 */
function buildBackToTop(link) {
  const button = el('button', 'back-to-top');
  button.type = 'button';
  button.setAttribute('aria-label', link.textContent.trim());
  button.append(icon('up', 'back-to-top-icon'));
  button.addEventListener('click', () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
  return button;
}

/**
 * Builds one footer column.
 * @param {object} section global section
 * @param {object|undefined} override site section with the same heading
 * @param {string} root site root
 * @returns {Element}
 */
function buildColumn(section, override, root) {
  const column = el('div', 'footer-column');
  if (section.heading) {
    const title = el('h2', 'footer-title');
    title.textContent = section.heading.textContent.trim();
    column.append(title);
  }
  const list = (override && override.node.querySelector(':scope > ul'))
    || section.node.querySelector(':scope > ul');
  if (list) {
    column.append(isSocialList(list) ? buildSocialBar(list) : buildLinkList(list, root));
  }
  section.node.querySelectorAll(':scope > p a[href^="#"]').forEach((link) => {
    column.append(buildBackToTop(link));
  });
  return column;
}

/**
 * Builds the newsletter band.
 * @param {object} section global newsletter section
 * @param {Element} logo brand logo image
 * @returns {Element}
 */
function buildNewsletter(section, logo) {
  const band = el('section', 'newsletter');
  const inner = el('div', 'footer-inner newsletter-inner');
  const logoCol = el('div', 'newsletter-logo');
  const img = logo.cloneNode();
  img.setAttribute('loading', 'lazy');
  const markShape = () => {
    if (img.naturalWidth && img.naturalWidth / img.naturalHeight < 1.5) img.classList.add('compact');
  };
  img.addEventListener('load', markShape, { once: true });
  logoCol.append(img);

  const content = el('div', 'newsletter-content');
  if (section.heading) {
    const title = el('h2', 'newsletter-title');
    title.textContent = section.heading.textContent.trim();
    content.append(title);
  }
  const link = section.node.querySelector('a');
  const status = [...section.node.querySelectorAll(':scope > p')].find((p) => !p.querySelector('a'));
  let statusEl;
  if (status) {
    statusEl = el('p', 'newsletter-status');
    statusEl.setAttribute('role', 'status');
    statusEl.dataset.message = status.textContent.trim();
  }
  if (link) {
    const button = el('a', 'newsletter-button');
    button.href = link.getAttribute('href');
    button.textContent = link.textContent.trim();
    if (statusEl && button.getAttribute('href').startsWith('#')) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        statusEl.textContent = statusEl.dataset.message;
      });
    }
    content.append(button);
  }
  if (statusEl) content.append(statusEl);
  inner.append(logoCol, content);
  band.append(inner);
  return band;
}

/**
 * Builds a strip of images (e.g. partner logos).
 * @param {object} section site section
 * @returns {Element}
 */
function buildStrip(section) {
  const strip = el('div', 'footer-inner footer-strip');
  if (section.heading) strip.setAttribute('aria-label', section.heading.textContent.trim());
  section.node.querySelectorAll('img').forEach((img) => {
    const clone = img.cloneNode();
    clone.setAttribute('loading', 'lazy');
    strip.append(clone);
  });
  return strip;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const root = getSiteRoot(window.location.pathname);
  const [globalDoc, siteDoc] = await Promise.all([
    fetchDocument(['/content/footer.plain.html', '/footer.plain.html']),
    root ? fetchDocument([`/content${root}/footer.plain.html`, `${root}/footer.plain.html`]) : null,
  ]);
  const globalSections = readSections(globalDoc);
  const siteSections = readSections(siteDoc);
  if (!globalSections.length) return;

  const [newsletterSection, ...columnSections] = globalSections;
  const columnKeys = columnSections.map((s) => s.key);
  const logoSection = siteSections.find((s) => !s.heading && s.node.querySelector('img'));
  const strips = siteSections.filter((s) => s.heading
    && !columnKeys.includes(s.key) && s.node.querySelector('img'));

  block.textContent = '';
  const brand = root.split('/').filter(Boolean);
  block.dataset.brand = brand.length > 1 ? brand[0] : 'jlr';

  strips.forEach((s) => block.append(buildStrip(s)));
  if (logoSection) block.append(buildNewsletter(newsletterSection, logoSection.node.querySelector('img')));

  const main = el('div', 'footer-main');
  const columns = el('div', 'footer-inner footer-columns');
  columnSections.forEach((section) => {
    const override = siteSections.find((s) => s.key && s.key === section.key);
    columns.append(buildColumn(section, override, root));
  });
  main.append(columns);
  block.append(main);
}
