/*
 * canon/chrome.js — media.jlr.com header behaviour (replica).
 * Scroll-state chrome is instrument-relevant state, lifted from the source's main.js
 * (jlr.navigation.sticky / navHeight / main-nav overflow): same class names, same 150 px
 * threshold, same custom properties (--nav-height, --nav-height-top-bar, --shrink-offset).
 */
(() => {
  const root = document.documentElement;
  const header = document.getElementById('main-nav');
  if (!header) return;
  const navHeightEl = header.querySelector('.js-nav-height');
  const topBar = header.querySelector('.main-nav__mobile-brand');
  const menuSearch = header.querySelector('.menu-search');

  const setVars = () => {
    if (navHeightEl) root.style.setProperty('--nav-height', `${navHeightEl.offsetHeight}px`);
    if (topBar) root.style.setProperty('--nav-height-top-bar', `${topBar.offsetHeight}px`);
  };
  const setShrinkOffset = () => {
    if (menuSearch) root.style.setProperty('--shrink-offset', `${menuSearch.offsetTop}px`);
  };

  /*
   * sticky: shrink above 150 px of scroll (main.js sticky.c). The live `i < o` branch (un-shrink on
   * any upward scroll) was applied as canon request (d) and REVERTED 2026-11-05: in the stitched
   * capture at max scroll the shrink -> doc-height clamp -> "upward" scroll loop shifted chunk 2 by
   * +15 px on defender-en-gb-image-packs-defender-110-namib-orange @360 (1.86 -> 3.20 %). The
   * un-shrink stays page-level in js/defender-en-gb-person-chris-thorp.js.
   */
  const onScroll = () => {
    const y = root.scrollTop;
    if (y <= 150) {
      header.classList.remove('shrink', 'bottom-shadow');
    } else {
      header.classList.add('shrink', 'bottom-shadow');
      const search = header.querySelector('.menu-search-expandable__input--open');
      if (search) {
        search.classList.remove('menu-search-expandable__input--open');
        const wrap = search.closest('.menu-search-expandable');
        if (wrap) {
          wrap.classList.remove('menu-search-expandable--open');
          const t = wrap.querySelector('.menu-search-expandable__button');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      }
    }
    setVars();
  };

  /* brand sub-nav overflow hints (main.js main-nav overflow) */
  const nav = header.querySelector('.main-nav');
  const scroller = nav && nav.querySelector('.nav-wrapper');
  let raf = null;
  const updateOverflow = () => {
    if (!nav || !scroller) return;
    const w = scroller.clientWidth;
    const overflow = w > 96 && scroller.scrollWidth > w + 1;
    const left = Math.abs(scroller.scrollLeft);
    nav.classList.toggle('main-nav--overflow', overflow);
    nav.classList.toggle('main-nav--at-start', left <= 1);
    nav.classList.toggle('main-nav--at-end', left + w >= scroller.scrollWidth - 1);
  };
  const queueOverflow = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = null; updateOverflow(); });
  };
  if (scroller) {
    scroller.addEventListener('scroll', queueOverflow, { passive: true });
    nav.querySelectorAll('.main-nav__scroll-hint').forEach((btn) => {
      btn.addEventListener('click', () => {
        const dir = btn.classList.contains('main-nav__scroll-hint--next') ? 1 : -1;
        scroller.scrollBy({ left: dir * scroller.clientWidth * 0.8, behavior: 'smooth' });
      });
    });
  }

  /*
   * Header widgets — only behaviours observed firing on live
   * (stardust/replica/motion/defender-en-gb.json): each poke added exactly these classes.
   */
  const toggle = (btn, target, cls, open) => {
    const next = open ?? !target.classList.contains(cls);
    target.classList.toggle(cls, next);
    if (btn) btn.setAttribute('aria-expanded', String(next));
    return next;
  };

  /* JLR MEDIA burger: overlay gets .is-open, page scroll locked (header contract scrollLock) */
  const burger = header.querySelector('.fullscreen-nav-trigger');
  const overlay = document.getElementById('fullscreen-nav-overlay');
  if (burger && overlay) {
    const setOverlay = (open) => {
      toggle(burger, overlay, 'is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) overlay.focus({ preventScroll: true });
    };
    overlay.tabIndex = -1;
    burger.addEventListener('click', () => setOverlay(!overlay.classList.contains('is-open')));
    const close = overlay.querySelector('.fullscreen-nav__close');
    if (close) close.addEventListener('click', () => { setOverlay(false); burger.focus(); });
  }

  /* market switcher: .navigation-tools__switcher--active (chevron-bounce runs via CSS) */
  const culture = header.querySelector('.navigation-tools__link--culture');
  const switcher = culture && culture.closest('.navigation-tools__switcher');
  if (switcher) culture.addEventListener('click', () => toggle(culture, switcher, 'navigation-tools__switcher--active'));

  /* Vehicles mega menu: .open on the panel and on the nav <li> (fadeIn .3s + slideDown .5s in CSS) */
  const megaLink = header.querySelector('.main-nav__item--desktop > .dropdown-toggle');
  const mega = document.getElementById('menu-vehicles');
  if (megaLink && mega) {
    megaLink.addEventListener('click', (e) => {
      e.preventDefault();
      const open = toggle(megaLink, mega, 'open');
      megaLink.parentElement.classList.toggle('open', open);
    });
  }

  /* Search Defender: --open on the wrapper and on the input panel (closed again by the shrink rule above) */
  const searchBtn = header.querySelector('.menu-search-expandable__button');
  const searchWrap = searchBtn && searchBtn.closest('.menu-search-expandable');
  const searchPanel = searchWrap && searchWrap.querySelector('.menu-search-expandable__input');
  if (searchPanel) {
    searchBtn.addEventListener('click', () => {
      const open = toggle(searchBtn, searchWrap, 'menu-search-expandable--open');
      searchPanel.classList.toggle('menu-search-expandable__input--open', open);
      const input = searchPanel.querySelector('input[type="text"]');
      if (open && input) input.focus({ preventScroll: true });
    });
  }

  setShrinkOffset();
  onScroll();
  updateOverflow();
  window.addEventListener('resize', () => { setShrinkOffset(); onScroll(); updateOverflow(); });
  document.addEventListener('scroll', onScroll, { passive: true });

  /* --nav-height must be sampled after the webfonts settle (the first sample is taken with
     fallback metrics): re-sync on fonts.ready, load, and whenever the nav box resizes. */
  const resync = () => { setShrinkOffset(); setVars(); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(resync);
  window.addEventListener('load', resync);
  if (navHeightEl && window.ResizeObserver) new ResizeObserver(resync).observe(navHeightEl);
})();

/*
 * Hero carousel (.slider-home-page — slick fade). Observed on live: autoplay advances the slide with
 * no interaction (timer media; frozen at slide 1 by the capture instruments → captureState
 * restoreAtDelivery) and a dot click switches slide. Same state classes as slick on slides and dots;
 * the 500 ms linear opacity fade is in canon/modules.css.
 */
(() => {
  document.querySelectorAll('.slider-home-page').forEach((slider) => {
    const slides = [...slider.querySelectorAll('.hero-component')];
    const dots = [...slider.querySelectorAll('.slick-dots li')];
    if (slides.length < 2) return;
    let index = Math.max(0, slides.findIndex((s) => s.classList.contains('is-active')));
    const go = (n) => {
      index = (n + slides.length) % slides.length;
      slides.forEach((s, i) => {
        const on = i === index;
        s.classList.toggle('is-active', on);
        s.classList.toggle('slick-current', on);
        s.classList.toggle('slick-active', on);
        s.setAttribute('aria-hidden', String(!on));
      });
      dots.forEach((d, i) => {
        d.classList.toggle('slick-active', i === index);
        const b = d.querySelector('button');
        if (b) b.setAttribute('aria-selected', String(i === index));
      });
    };
    const delay = Number(slider.dataset.autoplay) || 0;
    let timer = null;
    const restart = () => {
      if (!delay) return;
      clearInterval(timer);
      timer = setInterval(() => go(index + 1), delay);
    };
    dots.forEach((d, i) => {
      const b = d.querySelector('button');
      if (b) b.addEventListener('click', () => { go(i); restart(); });
    });
    restart();
  });
})();
