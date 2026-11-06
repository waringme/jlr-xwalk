/* defender-en-gb-image-packs — media-listing page behaviour.
   The live listing (Vue) renders a DIFFERENT card per viewport: below 992 px each pack is a
   stacked mobile card (.gallery-item.item.hidden-md.hidden-lg inside .mob-slider) and the
   desktop overlay card + pack expander are not in the DOM at all. The prototype ships the
   desktop state in the markup and the mobile card in a <template>; this swaps them at load
   and when the viewport crosses the breakpoint, so each width carries exactly the live DOM. */
(() => {
  const mq = window.matchMedia('(max-width: 991px)');
  const cards = [...document.querySelectorAll('.card-grid > .gallery-item[data-card]')];
  const store = new Map();

  const apply = () => {
    cards.forEach((card) => {
      if (!store.has(card)) {
        const tpl = card.querySelector('template.gallery-item__mobile');
        store.set(card, {
          desktop: [...card.children].filter((el) => el.tagName !== 'TEMPLATE'),
          mobile: tpl ? [...tpl.content.children] : [],
          tpl,
        });
      }
      const { desktop, mobile, tpl } = store.get(card);
      const [show, hide] = mq.matches ? [mobile, desktop] : [desktop, mobile];
      hide.forEach((el) => el.remove());
      show.forEach((el) => { if (!el.isConnected) card.insertBefore(el, tpl); });
      card.classList.toggle('mob-slider', mq.matches);
    });
  };

  apply();
  mq.addEventListener('change', apply);

  /* Interaction parity — only what motion-observe saw fire on the live page
     (stardust/replica/motion/defender-en-gb-image-packs{,-360}.json). */
  const panel = document.querySelector('.new-grid__sidebar-panel');
  const content = document.querySelector('.new-grid__content');
  const setRefine = (open) => {
    if (!panel) return;
    panel.classList.toggle('new-grid__sidebar-panel--open', open);
    panel.classList.toggle('new-grid__sidebar-panel--closed', !open);
    panel.inert = !open;
    if (content) content.classList.toggle('new-grid__content--with-sidebar', open);
  };
  document.querySelectorAll('.new-grid__refine-btn').forEach((btn) => btn.addEventListener('click', () => {
    setRefine(!panel.classList.contains('new-grid__sidebar-panel--open'));
  }));
  document.querySelectorAll('.new-grid__sidebar-close').forEach((btn) => btn.addEventListener('click', () => setRefine(false)));

  /* facet heading: .active-facet + sibling ul.collapse-me --trans (height .6s) → --open */
  document.querySelectorAll('.refine-item').forEach((link) => link.addEventListener('click', () => {
    const list = link.nextElementSibling;
    const open = !link.classList.contains('active-facet');
    link.classList.toggle('active-facet', open);
    if (!list || !list.classList.contains('collapse-me')) return;
    if (!open) { list.classList.remove('collapse-me--open', 'collapse-me--trans'); list.style.height = ''; return; }
    list.classList.add('collapse-me--trans');
    const h = list.scrollHeight;
    requestAnimationFrame(() => { list.style.height = `${h}px`; });
    list.addEventListener('transitionend', () => {
      list.classList.add('collapse-me--open');
      list.classList.remove('collapse-me--trans');
      list.style.height = '';
    }, { once: true });
  }));

  /* pack card: trigger opens the pack expander (.gallery-item.active), close button shuts it */
  document.querySelectorAll('.card-grid > .gallery-item[data-card]').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.gallery-trigger-close')) { card.classList.remove('active'); return; }
      if (!e.target.closest('.gallery-trigger') || e.target.closest('a, button')) return;
      document.querySelectorAll('.card-grid > .gallery-item.active').forEach((c) => { if (c !== card) c.classList.remove('active'); });
      card.classList.add('active');
    });
  });

  /* add-to-downloads toggle (cart state itself is a dynamic feature); observed on the desktop
     card only — the live mobile card's button does not toggle (motion 360: no mutation) */
  document.addEventListener('click', (e) => {
    if (mq.matches) return;
    const btn = e.target.closest('button.cart-btn.new-share__btn');
    if (btn) btn.classList.toggle('cart-btn--active');
  });
})();
