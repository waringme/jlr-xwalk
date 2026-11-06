/**
 * quote-centered — centred pull quote with a two-line attribution.
 * Authored rows: 1) quotation (one or more paragraphs), 2) attribution (name, role).
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const [quotation, attribution] = [...block.children]
    .map((row) => row.firstElementChild)
    .filter(Boolean);
  if (!quotation) return;

  const figure = document.createElement('figure');
  const blockquote = document.createElement('blockquote');
  quotation.className = 'quote-centered-quotation';
  blockquote.append(quotation);
  figure.append(blockquote);

  if (attribution && attribution.textContent.trim()) {
    const caption = document.createElement('figcaption');
    caption.className = 'quote-centered-attribution';
    const lines = [...attribution.querySelectorAll(':scope > p')];
    if (lines.length) {
      lines.forEach((line, i) => {
        const el = document.createElement(i === 0 ? 'cite' : 'span');
        el.className = i === 0 ? 'quote-centered-name' : 'quote-centered-role';
        el.innerHTML = line.innerHTML;
        caption.append(el);
      });
    } else {
      const cite = document.createElement('cite');
      cite.className = 'quote-centered-name';
      cite.innerHTML = attribution.innerHTML;
      caption.append(cite);
    }
    figure.append(caption);
  }

  block.replaceChildren(figure);
}
