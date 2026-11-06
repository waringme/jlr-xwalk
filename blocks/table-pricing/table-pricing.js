/*
 * Table Pricing
 * Data table of body styles, powertrains, specs and prices. First row is the header row
 * unless the block carries the `no-header` option.
 */

import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  const header = !block.classList.contains('no-header');

  [...block.children].forEach((row, i) => {
    const tr = document.createElement('tr');
    moveInstrumentation(row, tr);
    const isHead = i === 0 && header;

    [...row.children].forEach((cell) => {
      const td = document.createElement(isHead ? 'th' : 'td');
      if (isHead) td.setAttribute('scope', 'col');
      td.innerHTML = cell.innerHTML;
      tr.append(td);
    });

    if (isHead) thead.append(tr);
    else tbody.append(tr);
  });

  if (thead.children.length) table.append(thead);
  table.append(tbody);
  block.replaceChildren(table);
}
