/* defender-en-gb-mobile-vehicle-menu — mobile-vehicle-menu page behaviour (short page: copied from
   js/defender-en-gb-person-chris-thorp.js per the coordinator short-page rule).
   1. canon chrome.js samples --nav-height before the substitute faces settle (canon request already
      logged by defender-en-gb-image-packs); re-run its scroll handler once fonts are ready so
      .page-view lands where live does (same page-level resync as defender-en-gb-directors).
   2. live main.js sticky.c un-shrinks the header on ANY upward scroll (`i < o` branch) and re-samples
      --nav-height / --nav-height-top-bar after every scroll; canon only un-shrinks at <= 150 px
      (canon request). Page-level compensation: this listener is registered after canon's (deferred
      script order), so it runs last on each scroll event. Evidence: gate iter1 1440 hot band
      y500–1000 — stitched chunk 2 shows the full live header vs the shrunk build header. */
(() => {
  const root = document.documentElement;
  const header = document.getElementById('main-nav');
  // live reads scrollTop BEFORE it shrinks and re-samples; canon's handler forces the clamped layout
  // first, so the position is captured in a capture-phase listener (fires before canon's at target).
  let last = 0;
  let y = 0;
  document.addEventListener('scroll', () => { y = root.scrollTop; }, { capture: true, passive: true });
  const onScroll = () => {
    if (header && y > 150 && y < last) {
      header.classList.remove('shrink', 'bottom-shadow');
      const nav = header.querySelector('.js-nav-height');
      const bar = header.querySelector('.main-nav__mobile-brand');
      if (nav) root.style.setProperty('--nav-height', `${nav.offsetHeight}px`);
      if (bar) root.style.setProperty('--nav-height-top-bar', `${bar.offsetHeight}px`);
    }
    last = y;
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  const resync = () => document.dispatchEvent(new Event('scroll'));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(resync);
  window.addEventListener('load', resync);
})();
