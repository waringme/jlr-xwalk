/*
 * Accordion Press Kit
 * Expandable model headers (model name + model year) revealing the press kits for that model.
 * Row contract: [summary] | [year] | [body] — the year cell is optional ([summary] | [body]).
 */

import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;

    const labelCell = cells[0];
    const bodyCell = cells.length > 1 ? cells[cells.length - 1] : document.createElement('div');
    const yearCell = cells.length > 2 ? cells[1] : null;

    const summary = document.createElement('summary');
    summary.className = 'accordion-press-kit-item-label';

    const title = document.createElement('span');
    title.className = 'accordion-press-kit-item-title';
    const heading = labelCell.querySelector('h1, h2, h3, h4, h5, h6, p');
    const source = heading && labelCell.children.length === 1 ? heading : labelCell;
    title.append(...source.childNodes);
    summary.append(title);

    const yearText = yearCell ? yearCell.textContent.trim() : '';
    if (yearText) {
      const year = document.createElement('span');
      year.className = 'accordion-press-kit-item-year';
      year.textContent = yearText;
      summary.append(year);
    }

    bodyCell.className = 'accordion-press-kit-item-body';

    const details = document.createElement('details');
    moveInstrumentation(row, details);
    details.className = 'accordion-press-kit-item';
    details.append(summary, bodyCell);
    row.replaceWith(details);
  });
}
