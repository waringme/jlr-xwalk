/*
 * Columns Vehicle Intro
 * Fixed pair: model-name heading (left) beside the model-year links (right), keyline under.
 * Row contract: [heading] | [year links as a list or paragraphs]. An image-only cell is kept
 * as a media column.
 */

export default function decorate(block) {
  const firstRow = block.firstElementChild;
  const cols = firstRow ? [...firstRow.children] : [];
  block.classList.add(`columns-vehicle-intro-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    row.classList.add('columns-vehicle-intro-row');
    [...row.children].forEach((col, idx) => {
      // image-only cell (one or more pictures, e.g. the two vehicle thumbnails)
      const pic = col.querySelector('picture');
      if (pic && !col.textContent.trim() && !col.querySelector('a[href]')) {
        col.classList.add('columns-vehicle-intro-img-col');
        return;
      }

      const links = [...col.querySelectorAll('a[href]')];
      const hasHeading = col.querySelector('h1, h2, h3, h4, h5, h6');
      if (idx === 0 || hasHeading || !links.length) {
        col.classList.add('columns-vehicle-intro-title');
        return;
      }

      col.classList.add('columns-vehicle-intro-links');
      if (!col.querySelector('ul, ol')) {
        const ul = document.createElement('ul');
        links.forEach((link) => {
          const li = document.createElement('li');
          li.append(link);
          ul.append(li);
        });
        col.replaceChildren(ul);
      }
    });
  });
}
