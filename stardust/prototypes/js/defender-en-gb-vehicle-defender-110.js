/* defender-en-gb-vehicle-defender-110 — vehicle-detail page behaviour (only what fired on live,
   stardust/replica/motion/defender-en-gb-vehicle-defender-110.json):
   - Refine By toggles the refine sidebar (.new-grid__sidebar-panel --closed <-> --open, .5s) and
     narrows the results column (.new-grid__content--with-sidebar, width .5s).
   - A sidebar facet link toggles .active-facet (chevron rotates .2s) and slides its option list
     open/closed (.collapse-me--trans height .6s, then .collapse-me--open).
   - The mobile close button (X) closes the sidebar.
   - Card images not yet decoded fade/unblur in on load (.lazy-blur -> .lazy-loaded).
   The pager "next" fetches page 2 from the live API (dynamic feature, not replicated here). */
(() => {
  const panel = document.querySelector('.new-grid__sidebar-panel');
  const content = document.querySelector('.new-grid__content');
  const refine = document.querySelector('.new-grid__refine-btn');

  const setSidebar = (open) => {
    if (!panel) return;
    panel.classList.toggle('new-grid__sidebar-panel--open', open);
    panel.classList.toggle('new-grid__sidebar-panel--closed', !open);
    if (content) content.classList.toggle('new-grid__content--with-sidebar', open);
    if (refine) refine.setAttribute('aria-expanded', String(open));
  };

  if (refine && panel) {
    refine.setAttribute('aria-expanded', 'false');
    refine.addEventListener('click', (e) => {
      e.preventDefault();
      setSidebar(!panel.classList.contains('new-grid__sidebar-panel--open'));
    });
    const close = panel.querySelector('.new-grid__sidebar-close');
    if (close) close.addEventListener('click', () => setSidebar(false));
  }

  const DUR = 600;
  document.querySelectorAll('.new-grid__sidebar-link').forEach((link) => {
    const list = link.parentElement.querySelector('.collapse-me');
    link.setAttribute('aria-expanded', 'false');
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (!list || list.classList.contains('collapse-me--trans')) return;
      const opening = !list.classList.contains('collapse-me--open');
      link.classList.toggle('active-facet', opening);
      link.setAttribute('aria-expanded', String(opening));
      const full = () => `${list.scrollHeight}px`;
      list.classList.add('collapse-me--trans');
      if (opening) {
        list.style.height = '0px';
        requestAnimationFrame(() => { list.style.height = full(); });
      } else {
        list.style.height = full();
        list.classList.remove('collapse-me--open');
        requestAnimationFrame(() => { list.style.height = '0px'; });
      }
      setTimeout(() => {
        list.classList.remove('collapse-me--trans');
        list.style.height = '';
        list.classList.toggle('collapse-me--open', opening);
      }, DUR);
    });
  });

  /* live lazy-loader: a card image below the fold is blurred/hidden (.lazy-blur) until it scrolls
     into view and has loaded, then .lazy-loaded reveals it (opacity .25s, filter/transform .35s). */
  const imgs = [...document.querySelectorAll('.news-box__media img')]
    .filter((img) => img.getBoundingClientRect().top > window.innerHeight);
  const reveal = (img) => {
    const done = () => requestAnimationFrame(() => img.classList.add('lazy-loaded'));
    if (img.complete) done();
    else {
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    }
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        reveal(en.target);
      });
    }, { rootMargin: '200px 0px' });
    imgs.forEach((img) => { img.classList.add('lazy-blur'); io.observe(img); });
  }
})();
