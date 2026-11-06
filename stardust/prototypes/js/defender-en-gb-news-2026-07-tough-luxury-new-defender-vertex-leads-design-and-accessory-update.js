/* defender-en-gb-news-2026-07-tough-luxury-new-defender-vertex-leads-design-and-accessory-update
   — content-detail page behaviour. Interaction parity: only what motion-observe saw fire on the
   live page (stardust/replica/motion/<slug>{,-360}.json). Pattern reused from the approved pack
   pages (js/defender-en-gb-image-packs.js card expander, js/defender-en-gb-image-packs-defender-
   110-namib-orange.js viewer open/close). Dead on live (not implemented): share-trigger click,
   mobile drp-slider prev/next (buttons display:none), single related tab (already active). */
(() => {
  /* related pack card: trigger click / Enter opens the pack expander (.gallery-item.active →
     fixed modal), the expander's close button shuts it */
  const items = [...document.querySelectorAll('.related-content-packs .gallery-item.gallery-box')];
  let opener = null;
  const closeItem = (item) => {
    item.classList.remove('active');
    if (opener) opener.focus();
  };
  items.forEach((item) => {
    const trigger = item.querySelector('.gallery-contents.gallery-trigger');
    if (!trigger) return;
    const open = () => {
      items.forEach((it) => { if (it !== item) it.classList.remove('active'); });
      opener = trigger;
      item.classList.add('active');
      const close = item.querySelector('.gallery-trigger-close');
      if (close) close.focus();
    };
    trigger.addEventListener('click', (e) => { if (!e.target.closest('a, button')) open(); });
    trigger.addEventListener('keydown', (e) => {
      if (e.target === trigger && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(); }
    });
    const close = item.querySelector('.gallery-trigger-close');
    if (close) close.addEventListener('click', () => closeItem(item));
  });

  /* 'View larger image' removes .hide from the expander's viewer and shows the clicked slide's
     head + image; the viewer's Back button adds .hide again */
  document.querySelectorAll('.related-content-packs .gallery-expander').forEach((exp) => {
    const viewer = exp.querySelector('.image-pack-slide');
    if (!viewer) return;
    const heads = [...viewer.querySelectorAll('.image-slide__head')];
    const imgs = [...viewer.querySelectorAll('.slider-image-pack > .image-expand')];
    let viewOpener = null;
    const show = (i) => {
      heads.forEach((h, n) => h.classList.toggle('hide', n !== i));
      imgs.forEach((li, n) => { li.style.display = n === i ? '' : 'none'; });
    };
    exp.querySelectorAll('.view-large-img').forEach((btn) => {
      const open = () => {
        viewOpener = btn;
        show(Number(btn.dataset.index) || 0);
        viewer.classList.remove('hide');
        viewer.querySelector('.image-pack-slide__close').focus();
      };
      btn.addEventListener('click', open);
      btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });
    viewer.querySelector('.image-pack-slide__close').addEventListener('click', () => {
      viewer.classList.add('hide');
      if (viewOpener) viewOpener.focus();
    });
  });

  /* figure hover-bar Download toggle: click → .dropdown.open (observed live,
     motion/<slug>-dropdown.json); a click elsewhere closes it (bootstrap dropdown) */
  const figDrops = [...document.querySelectorAll('.page-news .article-media .dropdown.download-group')];
  figDrops.forEach((dd) => {
    const btn = dd.querySelector('.dropdown-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const open = !dd.classList.contains('open');
      figDrops.forEach((d) => { d.classList.remove('open'); d.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false'); });
      dd.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      if (open) btn.focus();   /* bootstrap dropdown focuses the toggle → :focus styles + icon push */
    });
  });
  document.addEventListener('click', (e) => {
    figDrops.forEach((dd) => {
      if (!dd.contains(e.target)) { dd.classList.remove('open'); dd.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false'); }
    });
  });

  /* mobile related-packs slider (observed live 360): prev/next move the wrapper's left
     (transition .6s); the end buttons get --disabled (as js/defender-en-gb-image-packs-
     defender-110-namib-orange.js drp-slider) */
  document.querySelectorAll('.related-content-packs .related-slider').forEach((s) => {
    const track = s.querySelector('.related-slider__track');
    const n = track ? track.children.length : 0;
    const prev = s.querySelector('.related-slider__btn--prev');
    const next = s.querySelector('.related-slider__btn--next');
    let pos = 0;
    const go = (p) => {
      pos = Math.max(0, Math.min(n - 1, p));
      track.style.left = `${-100 * pos}%`;
      if (prev) prev.classList.toggle('related-slider__btn--disabled', pos === 0);
      if (next) next.classList.toggle('related-slider__btn--disabled', pos === n - 1);
    };
    if (prev) prev.addEventListener('click', () => go(pos - 1));
    if (next) next.addEventListener('click', () => go(pos + 1));
  });

  /* related tabs: item click re-activates the item and its block (live jlr-tabs; one tab) */
  const tabItems = [...document.querySelectorAll('.related-content-packs .jlr-tabs__item')];
  const tabBlocks = [...document.querySelectorAll('.related-content-packs .jlr-tabs__block')];
  tabItems.forEach((item, i) => item.addEventListener('click', () => {
    tabItems.forEach((it) => it.classList.remove('jlr-tabs__item--active'));
    tabBlocks.forEach((bl) => bl.classList.remove('jlr-tabs__block--active'));
    item.classList.add('jlr-tabs__item--active');
    if (tabBlocks[i]) tabBlocks[i].classList.add('jlr-tabs__block--active');
  }));

  /* Escape closes the innermost open layer (viewer first, then the expander) */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const item = items.find((it) => it.classList.contains('active'));
    if (!item) return;
    const viewer = item.querySelector('.image-pack-slide:not(.hide)');
    if (viewer) viewer.querySelector('.image-pack-slide__close').click();
    else closeItem(item);
  });
})();
