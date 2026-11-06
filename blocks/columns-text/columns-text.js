import { moveInstrumentation } from '../../scripts/scripts.js';

const ICONS = {
  phone: '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M6.5 9.5a3 3 0 0 0 4.2 0l2.1-2.1a3 3 0 0 0-4.2-4.2l-.7.7m-.4 4.6a3 3 0 0 0-4.2 0L1.2 10.6a3 3 0 0 0 4.2 4.2l.7-.7" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  email: '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><rect x="1.5" y="3.5" width="13" height="9" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="m1.5 3.5 6.5 5 6.5-5" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>',
  chevron: '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>',
};

function linkKind(a) {
  const href = a.getAttribute('href') || '';
  if (href.startsWith('tel:')) return 'phone';
  if (href.startsWith('mailto:')) return 'email';
  return '';
}

function decorateContacts(block) {
  const cells = [...block.children].flatMap((row) => [...row.children]);
  const list = document.createElement('ul');
  list.className = 'columns-text-grid';
  cells.forEach((cell) => {
    if (!cell.textContent.trim() && !cell.querySelector('a, picture')) return;
    const li = document.createElement('li');
    li.className = 'columns-text-card';
    moveInstrumentation(cell, li);
    while (cell.firstChild) li.append(cell.firstChild);
    li.querySelectorAll('a').forEach((a) => {
      const kind = linkKind(a);
      if (!kind) return;
      a.classList.remove('button');
      a.closest('.button-container')?.classList.remove('button-container');
      a.classList.add('columns-text-contact', `columns-text-contact-${kind}`);
      a.insertAdjacentHTML('afterbegin', ICONS[kind]);
    });
    list.append(li);
  });
  block.replaceChildren(list);
}

function decorateHeadingRow(block) {
  const row = block.firstElementChild;
  if (!row) return;
  row.classList.add('columns-text-row');
  [...row.children].forEach((cell) => {
    if (cell.querySelector('h1, h2, h3, h4, h5, h6')) {
      cell.classList.add('columns-text-heading');
    } else if (cell.querySelector('a')) {
      cell.classList.add('columns-text-see-all');
      cell.querySelectorAll('a').forEach((a) => {
        a.classList.remove('button');
        a.closest('.button-container')?.classList.remove('button-container');
        a.insertAdjacentHTML('afterbegin', ICONS.chevron);
      });
    }
  });
}

/**
 * columns-text
 * Default: a grid of contact cards (name, role, phone and email links), one per cell.
 * alt: a section heading row with a "See all" link on the right.
 * @param {Element} block
 */
export default function decorate(block) {
  if (block.classList.contains('alt')) {
    decorateHeadingRow(block);
  } else {
    decorateContacts(block);
  }
}
