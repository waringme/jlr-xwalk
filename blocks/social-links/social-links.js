import { moveInstrumentation } from '../../scripts/scripts.js';

/* Simple 24x24 glyphs (path data drawn for this block; no icon font dependency). */
const ICONS = {
  rss: {
    label: 'RSS Feed',
    path: 'M5 3a16 16 0 0 1 16 16h-3A13 13 0 0 0 5 6zm0 6a10 10 0 0 1 10 10h-3a7 7 0 0 0-7-7zm2 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
  },
  instagram: {
    label: 'Instagram',
    path: 'M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3zm4 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm4.5-3.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z',
  },
  youtube: {
    label: 'YouTube',
    path: 'M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3z',
  },
  facebook: {
    label: 'Facebook',
    path: 'M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.5 1.6-1.5h1.7V4.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.3H7.6V14h2.7v8z',
  },
  tiktok: {
    label: 'TikTok',
    path: 'M16.5 3c.3 2.2 1.6 3.6 3.8 3.8v3a7.6 7.6 0 0 1-3.8-1.1v6.1a5.8 5.8 0 1 1-5.8-5.8h.6v3.1a2.7 2.7 0 1 0 2.1 2.7V3z',
  },
  linkedin: {
    label: 'LinkedIn',
    path: 'M4 9h3.6v11H4zm1.8-5.5a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2zM9.8 9h3.4v1.5h.1c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5V20h-3.6v-5.1c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V20H9.8z',
  },
  x: {
    label: 'X (Twitter)',
    path: 'M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z',
  },
};

function detectNetwork(href) {
  let host = '';
  let path = '';
  try {
    const url = new URL(href, window.location.href);
    host = url.hostname.replace(/^www\./, '');
    path = url.pathname;
  } catch {
    return null;
  }
  if (/instagram\.com$/.test(host)) return 'instagram';
  if (/(youtube\.com|youtu\.be)$/.test(host)) return 'youtube';
  if (/facebook\.com$/.test(host)) return 'facebook';
  if (/tiktok\.com$/.test(host)) return 'tiktok';
  if (/linkedin\.com$/.test(host)) return 'linkedin';
  if (/(^|\.)(x|twitter)\.com$/.test(host)) return 'x';
  if (/(feed|rss)/i.test(path)) return 'rss';
  return null;
}

function svgIcon(path) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const p = document.createElementNS(ns, 'path');
  p.setAttribute('d', path);
  p.setAttribute('fill', 'currentColor');
  svg.append(p);
  return svg;
}

/**
 * Social links: "Join the conversation" label with square social icon links.
 * Rows: an optional text-only row (the label), then one row per link
 * (a single cell holding the link; its text is the accessible name).
 * A single cell holding a list of links works too.
 * @param {Element} block
 */
export default function decorate(block) {
  const label = document.createElement('p');
  label.className = 'social-links-label';
  const list = document.createElement('ul');
  list.className = 'social-links-list';

  [...block.children].forEach((row) => {
    const links = [...row.querySelectorAll('a[href]')];
    if (!links.length) {
      const text = row.textContent.trim();
      if (text && !label.textContent) {
        label.textContent = text;
        moveInstrumentation(row, label);
      }
      return;
    }
    links.forEach((a, i) => {
      const li = document.createElement('li');
      if (i === 0) moveInstrumentation(row, li);
      const network = detectNetwork(a.getAttribute('href'));
      const link = document.createElement('a');
      link.href = a.href;
      if (a.title) link.title = a.title;
      link.className = `social-links-link${network ? ` social-links-${network}` : ''}`;
      const authored = a.textContent.trim();
      const name = network ? ICONS[network].label : authored || a.hostname;
      const sr = document.createElement('span');
      sr.className = 'social-links-sr';
      sr.textContent = authored && !/^https?:/.test(authored) ? authored : `Link to ${name}`;
      if (network) {
        link.append(svgIcon(ICONS[network].path), sr);
      } else {
        sr.className = 'social-links-text';
        link.append(sr);
      }
      if (/^https?:/.test(link.href) && new URL(link.href).origin !== window.location.origin) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      li.append(link);
      list.append(li);
    });
  });

  const nav = document.createElement('nav');
  nav.className = 'social-links-bar';
  nav.setAttribute('aria-label', label.textContent || 'Social media');
  nav.append(list);
  block.replaceChildren(...(label.textContent ? [label] : []), nav);
}
