/* defender-en-gb-image-packs-defender-110-namib-orange — media-pack-detail page behaviour.
   The live drp-slider positions its slides absolutely and writes the slider height from the
   first slide's height (inline style) on load and resize; mirrored here so the mobile slider
   (< 991 px) occupies the same box. */
(() => {
  const sliders = [...document.querySelectorAll('.mobile-slider-image-packs .drp-slider')];
  const size = () => sliders.forEach((s) => {
    const first = s.querySelector('.drp-slider__wrapper > li');
    s.style.height = `${first ? first.offsetHeight : 0}px`;
  });
  size();
  window.addEventListener('resize', size);
  window.addEventListener('load', size);

  /* motion (observed live 1440): 'View larger image' removes .hide from the viewer dialog,
     its close button adds it back; the slide head + image for the clicked tile are shown. */
  const viewer = document.querySelector('.image-pack-slide--modal');
  if (viewer) {
    const heads = [...viewer.querySelectorAll('.image-slide__head')];
    const imgs = [...viewer.querySelectorAll('.slider-image-pack > .image-expand')];
    let opener = null;
    const show = (i) => {
      heads.forEach((h, n) => h.classList.toggle('hide', n !== i));
      imgs.forEach((li, n) => { li.style.display = n === i ? '' : 'none'; });
    };
    const close = () => {
      viewer.classList.add('hide');
      if (opener) opener.focus();
    };
    document.querySelectorAll('.view-large-img').forEach((btn) => {
      const open = () => {
        opener = btn;
        show(Number(btn.dataset.index) || 0);
        viewer.classList.remove('hide');
        viewer.querySelector('.image-pack-slide__close').focus();
      };
      btn.addEventListener('click', open);
      btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });
    viewer.querySelector('.image-pack-slide__close').addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !viewer.classList.contains('hide')) close(); });
  }

  /* motion (observed live 360): drp-slider prev/next move the wrapper's left (transition .6s,
     .drp-slider__wrapper--trans); the end buttons get --disabled. */
  sliders.forEach((s) => {
    const wrap = s.querySelector('.drp-slider__wrapper');
    const n = wrap ? wrap.children.length : 0;
    const prev = s.querySelector('.drp-slider__btn--prev');
    const next = s.querySelector('.drp-slider__btn--next');
    const go = (pos) => {
      const p = Math.max(0, Math.min(n - 1, pos));
      s.dataset.pos = String(p);
      wrap.style.left = `${-100 * p}%`;
      if (prev) prev.classList.toggle('drp-slider__btn--disabled', p === 0);
      if (next) next.classList.toggle('drp-slider__btn--disabled', p === n - 1);
    };
    if (prev) prev.addEventListener('click', () => go(Number(s.dataset.pos) - 1));
    if (next) next.addEventListener('click', () => go(Number(s.dataset.pos) + 1));
  });
})();
