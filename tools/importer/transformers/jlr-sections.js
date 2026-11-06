/* eslint-disable */
/* global WebImporter */

/**
 * Sections transformer for media.jlr.com.
 * Uses payload.template.sections: inserts <hr> section breaks in beforeTransform
 * (while parser target elements still exist) and Section Metadata blocks for
 * styled sections in afterTransform.
 */

const MARKER = 'data-excat-section-id';

function findSection(root, section) {
  const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
  for (const sel of selectors) {
    if (!sel) continue;
    try {
      const el = root.querySelector(sel);
      if (el) return el;
    } catch (e) {
      // invalid selector in this DOM implementation; try the next one
    }
  }
  return null;
}

export default function transform(hookName, element, payload) {
  const template = payload && payload.template;
  const sections = (template && template.sections) || [];
  if (sections.length < 2) return;

  const document = element.ownerDocument || payload.document;

  if (hookName === 'beforeTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const el = findSection(element, section);
      if (!el) continue;
      if (i === 0 && !section.style) continue;
      const hr = document.createElement('hr');
      if (section.style) hr.setAttribute(MARKER, section.id);
      el.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;
      const block = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      const marker = element.querySelector(`hr[${MARKER}="${section.id}"]`);
      if (marker) {
        marker.after(block);
        if (i === 0) {
          marker.remove();
        } else {
          marker.removeAttribute(MARKER);
        }
      } else {
        const el = findSection(element, section);
        if (el) el.after(block);
      }
    }
  }
}
