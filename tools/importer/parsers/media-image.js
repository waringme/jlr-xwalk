/* eslint-disable */
/* global WebImporter */

/**
 * Parser for media-image variant (custom block).
 * Source: https://media.jlr.com/defender/en-gb/news/... (content-detail)
 * Instances:
 *   .image-holder:has(.field--name-field-hero-image)  -> hero (default option), one item
 *   .container.full-image-video                       -> strip option, one item
 *   .container.three-flush                            -> strip option, one item per .hover-prt-wrapper
 *   .vehicle-page .container.vehicle .image-top       -> hero (default option), one item (vehicle-detail;
 *                                                         desktop/mobile copies of one image, download has no href)
 * Model (xwalk): container of media-image-item rows -> [image | title | links]
 *   image  (reference, imageAlt collapsed)
 *   title  (text, asset title shown in the hover bar)
 *   links  (richtext, download links: High-Res / Low-Res or press-release ZIP)
 */
export default function parse(element, { document }) {
  const cleanHref = (a) => (a && a.getAttribute('href') ? a.getAttribute('href').trim() : '');
  const isRealHref = (href) => href && href !== '#' && !href.startsWith('/#') && !href.startsWith('javascript:');

  // Final label for a download link. Icon-only links get a placeholder text
  // (aria-label / title / class name) from the import script's onLoad; replace it.
  const labelOf = (a, fallback) => {
    const text = (a.textContent || '').replace(/\s+/g, ' ').trim();
    const cls = (a.getAttribute('class') || '').trim();
    if (!text || text === cls || text === 'link' || /jlr-download-btn|new-share__/.test(text)) return fallback;
    return text;
  };

  const firstContentImg = (root) => Array.from(root.querySelectorAll('img'))
    .find((img) => {
      const src = img.getAttribute('src') || '';
      return src && !src.startsWith('data:') && !img.closest('.a2a_kit, .new-share__wrapper, .a2a_svg');
    });

  // .image-top = vehicle-detail hero (first img is the desktop copy; the mobile copy is skipped)
  const isHero = element.matches('.image-holder, .image-top') || !!element.querySelector('.field--name-field-hero-image');

  const items = [];
  if (isHero) {
    const links = Array.from(element.querySelectorAll('.action-icons a.download, .action-icons a.new-share__hero-download, .action-icons a.jlr-download-btn'))
      .filter((a, i, arr) => isRealHref(cleanHref(a)) && arr.indexOf(a) === i);
    const heroImg = firstContentImg(element.querySelector('.field--name-field-hero-image') || element);
    // Vehicle hero images carry no alt; use the model name heading beside them.
    if (heroImg && !heroImg.getAttribute('alt') && element.matches('.image-top')) {
      const container = element.closest('.container.vehicle') || document;
      const modelName = container.querySelector('.caption-holder .page-title, .caption-holder h1');
      if (modelName && modelName.textContent.trim()) heroImg.setAttribute('alt', modelName.textContent.trim());
    }
    items.push({
      img: heroImg,
      title: '',
      links: links.map((a) => ({ href: cleanHref(a), label: labelOf(a, 'Download') })),
    });
  } else {
    const wrappers = Array.from(element.querySelectorAll('.hover-prt-wrapper'));
    (wrappers.length ? wrappers : [element]).forEach((wrap) => {
      const titleEl = wrap.querySelector('.hover-prt h1, .hover-prt h2, .hover-prt h3, .hover-prt h4, .hover-prt h5, .hover-prt h6, .hover-prt p');
      const links = Array.from(wrap.querySelectorAll('.dropdown-menu a[href], .download-group a.jlr-download-btn[href]'))
        .filter((a, i, arr) => isRealHref(cleanHref(a)) && arr.indexOf(a) === i);
      items.push({
        img: firstContentImg(wrap),
        title: titleEl ? titleEl.textContent.replace(/\s+/g, ' ').trim() : '',
        links: links.map((a, i) => ({
          href: cleanHref(a),
          label: labelOf(a, links.length > 1 ? (i === 0 ? 'High-Res' : 'Low-Res') : 'Download'),
        })),
      });
    });
  }

  const cells = [];
  items.forEach(({ img, title, links }) => {
    // Column 1: image
    const imageFrag = document.createDocumentFragment();
    if (img) {
      imageFrag.appendChild(document.createComment(' field:image '));
      imageFrag.appendChild(img);
    }

    // Column 2: asset title
    const titleFrag = document.createDocumentFragment();
    if (title) {
      titleFrag.appendChild(document.createComment(' field:title '));
      titleFrag.appendChild(document.createTextNode(title));
    }

    // Column 3: download links
    const linksFrag = document.createDocumentFragment();
    if (links.length) {
      linksFrag.appendChild(document.createComment(' field:links '));
      links.forEach(({ href, label }) => {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = label;
        p.appendChild(a);
        linksFrag.appendChild(p);
      });
    }

    cells.push([imageFrag, titleFrag, linksFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'media-image',
    variants: isHero ? [] : ['strip'],
    cells,
  });
  element.replaceWith(block);
}
