import { moveInstrumentation } from '../../scripts/scripts.js';

const ARROW_LEFT = '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m10 3-5 5 5 5" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>';
const ARROW_RIGHT = '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>';

function pageUrl(page) {
  const url = new URL(window.location.href);
  if (page <= 1) url.searchParams.delete('page');
  else url.searchParams.set('page', page);
  return `${url.pathname}${url.search}${url.hash}`;
}

function readConfig(block) {
  let total = 0;
  let prevHref = '';
  let nextHref = '';
  [...block.querySelectorAll('a[href]')].forEach((a) => {
    const text = `${a.textContent} ${a.getAttribute('rel') || ''} ${a.title || ''}`.toLowerCase();
    if (/prev|back/.test(text)) prevHref = a.href;
    else nextHref = a.href;
  });
  const numbers = (block.textContent.match(/\d+/g) || []).map(Number);
  if (numbers.length) total = Math.max(...numbers);
  return { total, prevHref, nextHref };
}

function createButton(rel, label, icon, href) {
  const li = document.createElement('li');
  li.className = `pagination-item pagination-item-${rel}`;
  const a = document.createElement('a');
  a.className = 'pagination-btn';
  a.rel = rel;
  a.href = href;
  a.setAttribute('aria-label', label);
  a.innerHTML = icon;
  li.append(a);
  return li;
}

/**
 * pagination — "[ 1 ] of N  >" pager for a listing.
 * Contract: one row; a cell holding the total page count (number) and optional
 * Previous / Next links. Pages are addressed with the ?page= query parameter;
 * without a page count, only the authored Previous / Next links are rendered.
 * @param {Element} block
 */
export default function decorate(block) {
  const { total, prevHref, nextHref } = readConfig(block);
  const params = new URLSearchParams(window.location.search);
  const requested = parseInt(params.get('page'), 10) || 1;

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Pagination');
  if (block.firstElementChild) moveInstrumentation(block.firstElementChild, nav);
  const ul = document.createElement('ul');
  ul.className = 'pagination-items';

  if (total > 0) {
    const current = Math.min(Math.max(requested, 1), total);
    if (current > 1) ul.append(createButton('prev', 'Previous page', ARROW_LEFT, pageUrl(current - 1)));

    const inputItem = document.createElement('li');
    inputItem.className = 'pagination-item';
    const input = document.createElement('input');
    input.className = 'pagination-input';
    input.type = 'text';
    input.inputMode = 'numeric';
    input.size = 3;
    input.value = current;
    input.setAttribute('aria-label', `Page number, current page ${current} of ${total}`);
    const go = () => {
      const page = parseInt(input.value, 10);
      if (!page || page < 1 || page > total || page === current) {
        input.value = current;
        return;
      }
      window.location.href = pageUrl(page);
    };
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        go();
      }
    });
    input.addEventListener('change', go);
    inputItem.append(input);

    const text = document.createElement('li');
    text.className = 'pagination-item pagination-text';
    text.innerHTML = `<small>of</small> <span>${total}</span>`;

    ul.append(inputItem, text);
    if (current < total) ul.append(createButton('next', 'Next page', ARROW_RIGHT, pageUrl(current + 1)));
  } else {
    if (prevHref) ul.append(createButton('prev', 'Previous page', ARROW_LEFT, prevHref));
    if (nextHref) ul.append(createButton('next', 'Next page', ARROW_RIGHT, nextHref));
  }

  nav.append(ul);
  block.replaceChildren(nav);
}
