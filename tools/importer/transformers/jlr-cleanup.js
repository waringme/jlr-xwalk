/* eslint-disable */
/* global WebImporter */

/**
 * Cleanup transformer for media.jlr.com (Drupal).
 * Site-generic: applies to every template (brand-landing, content-detail, ...).
 */

const MEDIA_SELECTOR = 'img, picture, video, iframe, svg, object, embed';

function isEmpty(el) {
  return !el.textContent.trim() && !el.querySelector(MEDIA_SELECTOR);
}

function removeIfEmpty(root, selectors) {
  root.querySelectorAll(selectors.join(',')).forEach((el) => {
    if (isEmpty(el)) el.remove();
  });
}

export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    // Geo market-recommendation dialog (Drupal AJAX dialog "Location detected ... switch market?")
    WebImporter.DOMUtils.remove(element, [
      '.ui-dialog',
      '#drupal-modal',
      '.ui-widget-overlay',
    ]);

    // Other modals / overlays / widgets that are never content
    WebImporter.DOMUtils.remove(element, [
      '#subscribemodel',
      '.modal',
      '.toasts',
      '.drp-cm-subscribe',
      '.ui-autocomplete',
      '.ui-helper-hidden-accessible',
      '#drupal-live-announce',
      '#fullscreen-nav-overlay',
    ]);

    // Cookie / consent banners
    WebImporter.DOMUtils.remove(element, [
      '#european-cookie-law',
      '.european-cookie-law',
      '#onetrust-consent-sdk',
      '#CybotCookiebotDialog',
      '.cookie-banner',
      '.eu-cookie-compliance-banner',
    ]);

    // AddToAny share widgets (global overlay + per-card / per-hero share buttons + cart links)
    WebImporter.DOMUtils.remove(element, [
      '#addtoany',
      '.a2a_overlay',
      '.a2a_modal',
      '.a2a_menu',
      '.new-share__wrapper',
      '.a2a_kit',
      '.new-share__hero-cart',
    ]);

    // Listing facet UI (vehicle-detail / listings): Refine By button, active-tag bar, facet sidebar
    WebImporter.DOMUtils.remove(element, [
      '.new-grid__refine-btn',
      '#taxonomies',
      '#colPush',
      '.new-grid__sidebar-panel',
      'div.container.footer__racing',
    ]);

    // vehicle-detail: "<n> Results" heading is default content authored as H2
    // (the page H1 is the model name in columns-vehicle-intro)
    element.querySelectorAll('.vehicle-page .container.search-page h1').forEach((h1) => {
      const h2 = element.ownerDocument.createElement('h2');
      h2.innerHTML = h1.innerHTML;
      h1.replaceWith(h2);
    });

    // Skip links / skip-link targets
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      'a#main-content:empty',
    ]);
  }

  if (hookName === 'afterTransform') {
    // Global chrome: header / navigation, newsletter band, footer
    WebImporter.DOMUtils.remove(element, [
      'header',
      'nav#main-nav',
      '#main-nav',
      '.main-nav',
      '.mega-menu',
      '#market-switcher-list',
      '.navigation-tools__switcher',
      '.breadcrumb',
      'nav[aria-label="breadcrumb"]',
      'section.newsletter-band',
      '.newsletter-band',
      'footer',
      '.region-footer',
      '.region-communication-message-footer',
      '.block-emissions-block',
    ]);

    // Non-authorable elements
    WebImporter.DOMUtils.remove(element, [
      'script',
      'style',
      'noscript',
      'link',
      'iframe#a2a_sm_ifr',
      '.visually-hidden.focusable',
    ]);

    // Empty spacer containers (e.g. `.home-page > .container > .content:empty`,
    // trailing `.wrapper-background > .container` with no content)
    removeIfEmpty(element, [
      '.page > .container',
      '.page > .wrapper-background',
      '.wrapper-background > .container',
      '.container > .content',
      '.region',
    ]);

    // Tracking / behaviour attributes (keep temporary data-excat-* markers for other transformers)
    element.querySelectorAll('*').forEach((el) => {
      [...el.attributes].forEach(({ name }) => {
        if (name.startsWith('data-excat-')) return;
        if (
          name.startsWith('on')
          || name.startsWith('data-gtm')
          || name.startsWith('data-analytics')
          || name.startsWith('data-track')
          || name.startsWith('data-once')
          || name.startsWith('data-drupal')
          || name === 'data-dismiss'
          || name === 'data-toggle'
        ) {
          el.removeAttribute(name);
        }
      });
    });
  }
}
