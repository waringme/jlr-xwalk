/**
 * Columns (newsletter): brand logo beside a "Subscribe to our newsletter" label and button.
 * One row, two cells: [logo image] [heading/label + subscribe link].
 * The logo keeps the authored <picture> (logos are often SVG or off-origin).
 * @param {Element} block
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('columns-newsletter-row');
    [...row.children].forEach((col) => {
      if (col.querySelector('picture, img') && col.textContent.trim() === '') {
        col.classList.add('columns-newsletter-logo');
        return;
      }
      col.classList.add('columns-newsletter-content');
      const heading = col.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        heading.classList.add('columns-newsletter-title');
      } else {
        const first = col.firstElementChild;
        if (first && !first.querySelector('a')) first.classList.add('columns-newsletter-title');
      }
      col.querySelectorAll('a[href]').forEach((a) => {
        a.classList.add('columns-newsletter-button');
        a.classList.remove('button', 'primary', 'secondary');
      });
    });
  });
}
