/* eslint-disable */
/* global WebImporter */

/**
 * Parser for media-subnav variant (custom block).
 * Source: https://media.jlr.com/defender/en-gb/vehicle/defender-110 (vehicle-detail content-type tabs)
 * Selector: .vehicle-page .wrapper-search-nav ul.nav-search
 * Source structure: li.results > a[href="#"] "Label" + span.count "(n)" — client-side tabs.
 * Model (xwalk): container of media-subnav-item rows -> [link] (linkText collapsed into link)
 *
 * Tab links (template note, interim coordinator decision), brand = first path segment of the
 * vehicle URL, locale = second segment (en-gb):
 *   News         -> the vehicle page itself (renders as the active tab)
 *   Images       -> /<brand>/<locale>/images
 *   Image Packs  -> /<brand>/<locale>/image-packs
 *   Video(s)     -> /<brand>/<locale>/videos
 *   Video Packs  -> /<brand>/<locale>/video-packs
 *   Press Kit / Tech Specs -> /<brand>/<locale>/press-kit | tech-specs where the brand has that
 *                  listing, otherwise the vehicle page; any other tab -> the vehicle page.
 * Tab labels and counts are kept verbatim ("News (19)"), every tab in source order.
 */
export default function parse(element, { document }) {
  // The importer passes { document, url, params }; the parser signature only names document.
  const ctx = arguments[1] || {};

  const pagePath = (() => {
    const candidates = [
      ctx.params && ctx.params.originalURL,
      ctx.url,
      document.querySelector('link[rel="canonical"]') && document.querySelector('link[rel="canonical"]').getAttribute('href'),
      document.location && document.location.href,
    ];
    for (const candidate of candidates) {
      if (!candidate) continue;
      try {
        const { pathname } = new URL(candidate, 'https://media.jlr.com');
        if (/\/vehicle\//.test(pathname)) return pathname.replace(/\.html$/, '').replace(/\/+$/, '');
      } catch (e) { /* try next */ }
    }
    return '';
  })();

  const segments = pagePath.split('/').filter(Boolean);
  const brand = segments[0] || '';
  const locale = segments[1] && /^[a-z]{2}(-[a-z]{2})?$/i.test(segments[1]) ? segments[1] : 'en-gb';
  const vehicleHref = pagePath || '#';
  const listing = (slug) => (brand ? `/${brand}/${locale}/${slug}` : vehicleHref);

  // Brands with press-kit / tech-specs listing pages in the site inventory.
  const BRANDS_WITH = {
    'press-kit': ['classic', 'defender', 'defenderrally', 'discovery', 'jaguar-tcs-racing', 'range-rover'],
    'tech-specs': ['classic', 'defender', 'defenderrally', 'discovery', 'jaguar-tcs-racing', 'range-rover'],
  };

  const hrefForTab = (label) => {
    const key = label.toLowerCase().replace(/\s+/g, ' ').trim();
    if (/^news\b/.test(key)) return vehicleHref;
    if (/^image packs?\b/.test(key)) return listing('image-packs');
    if (/^images?\b/.test(key)) return listing('images');
    if (/^video packs?\b/.test(key)) return listing('video-packs');
    if (/^videos?\b/.test(key)) return listing('videos');
    if (/^press kits?\b/.test(key)) return BRANDS_WITH['press-kit'].includes(brand) ? listing('press-kit') : vehicleHref;
    if (/^tech(nical)? spec/.test(key)) return BRANDS_WITH['tech-specs'].includes(brand) ? listing('tech-specs') : vehicleHref;
    return vehicleHref;
  };

  const cells = [];

  // media-listing: .new-grid__header nav > div[role=group] > a.btn-outline (Images / Image Packs,
  // Video / Video Packs / Broadcast Video). Real sibling-listing URLs; labels verbatim. The block
  // marks the link matching the current URL active, so the source .active class is not carried.
  const listingLinks = Array.from(element.querySelectorAll(':scope > a[href]'));
  if (!element.querySelector(':scope > li') && listingLinks.length) {
    listingLinks.forEach((src) => {
      const label = src.textContent.replace(/\s+/g, ' ').trim();
      const href = (src.getAttribute('href') || '').trim();
      if (!label || !href || href === '#' || href.startsWith('javascript:')) return;
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(' field:link '));
      const a = document.createElement('a');
      a.setAttribute('href', href);
      a.textContent = label;
      frag.appendChild(a);
      cells.push([frag]);
    });
    if (!cells.length) {
      element.remove();
      return;
    }
    const listingBlock = WebImporter.Blocks.createBlock(document, { name: 'media-subnav', cells });
    element.replaceWith(listingBlock);
    return;
  }

  const tabs = Array.from(element.querySelectorAll(':scope > li'));

  tabs.forEach((li) => {
    const src = li.querySelector('a') || li;
    const countEl = src.querySelector('.count');
    const countText = countEl ? countEl.textContent.replace(/\s+/g, ' ').trim() : '';
    const clone = src.cloneNode(true);
    clone.querySelectorAll('.count').forEach((c) => c.remove());
    const label = clone.textContent.replace(/\s+/g, ' ').trim();
    if (!label) return;

    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:link '));
    const a = document.createElement('a');
    a.setAttribute('href', hrefForTab(label));
    a.textContent = countText ? `${label} ${countText}` : label;
    frag.appendChild(a);
    cells.push([frag]);
  });

  // Vehicles with no media (source shows "0 Result" and an empty ul.nav-search): no block.
  if (!cells.length) {
    element.remove();
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'media-subnav', cells });
  element.replaceWith(block);
}
