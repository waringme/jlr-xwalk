/* eslint-disable */
/* global WebImporter */

/**
 * Parser for quote-centered variant. Base: quote.
 * Source: https://media.jlr.com/defender/en-gb/news/... (content-detail pull quote)
 * Selector: .page-news .field--item > .container.blockquote-template
 * Model (xwalk, standalone): rows -> [quotation] [attribution]
 *   quotation   (richtext, quote paragraph(s))
 *   attribution (richtext, one paragraph per line: name, role)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 1: quotation
  const quoteFrag = document.createDocumentFragment();
  const blockquote = element.querySelector('blockquote');
  const quoteParas = blockquote
    ? Array.from(blockquote.querySelectorAll('p')).filter((p) => p.textContent.trim())
    : [];
  if (quoteParas.length) {
    quoteFrag.appendChild(document.createComment(' field:quotation '));
    quoteParas.forEach((p) => {
      const para = document.createElement('p');
      para.innerHTML = p.innerHTML;
      quoteFrag.appendChild(para);
    });
  } else if (blockquote && blockquote.textContent.trim()) {
    quoteFrag.appendChild(document.createComment(' field:quotation '));
    const para = document.createElement('p');
    para.textContent = blockquote.textContent.trim();
    quoteFrag.appendChild(para);
  }
  cells.push([quoteFrag]);

  // Row 2: attribution (name, role) — source uses h5 lines; author them as paragraphs
  const attrFrag = document.createDocumentFragment();
  const lines = Array.from(element.querySelectorAll('.central-quote-titles, blockquote ~ h5, blockquote ~ p'))
    .filter((el, i, arr) => arr.indexOf(el) === i && !el.closest('blockquote') && el.textContent.trim());
  if (lines.length) {
    attrFrag.appendChild(document.createComment(' field:attribution '));
    lines.forEach((line) => {
      const p = document.createElement('p');
      p.textContent = line.textContent.replace(/\s+/g, ' ').trim();
      attrFrag.appendChild(p);
    });
  }
  cells.push([attrFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'quote-centered', cells });
  element.replaceWith(block);
}
