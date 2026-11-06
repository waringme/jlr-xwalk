/*
 * Embed Video Block
 * Embedded video player (YouTube, Vimeo, direct video files, other iframes).
 * Based on the block-collection embed block (hlx.live developer docs).
 */

const iframeHTML = (src, title, allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media') => `<div class="embed-video-frame">
    <iframe src="${src}" allow="${allow}" allowfullscreen="" title="${title}" loading="lazy"></iframe>
  </div>`;

const embedYoutube = (url, autoplay) => {
  const usp = new URLSearchParams(url.search);
  const suffix = autoplay ? '&muted=1&autoplay=1' : '';
  let vid = usp.get('v') ? encodeURIComponent(usp.get('v')) : '';
  const embed = url.pathname;
  if (url.origin.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }
  const src = `https://www.youtube.com${vid ? `/embed/${vid}?rel=0&v=${vid}${suffix}` : embed}`;
  return iframeHTML(src, 'Content from YouTube');
};

const embedVimeo = (url, autoplay) => {
  const [, video] = url.pathname.split('/');
  const suffix = autoplay ? '?muted=1&autoplay=1' : '';
  return iframeHTML(`https://player.vimeo.com/video/${video}${suffix}`, 'Content from Vimeo');
};

const embedFile = (url, autoplay) => `<div class="embed-video-frame">
    <video controls playsinline preload="metadata"${autoplay ? ' autoplay muted' : ''}>
      <source src="${url.href}">
    </video>
  </div>`;

const embedDefault = (url) => iframeHTML(url.href, `Content from ${url.hostname}`);

const EMBEDS_CONFIG = [
  { match: ['youtube', 'youtu.be'], id: 'youtube', render: embedYoutube },
  { match: ['vimeo'], id: 'vimeo', render: embedVimeo },
];

const loadEmbed = (block, link, autoplay) => {
  if (block.classList.contains('embed-video-is-loaded')) return;
  const url = new URL(link, window.location.href);
  const config = EMBEDS_CONFIG.find((e) => e.match.some((m) => url.hostname.includes(m)));
  if (config) {
    block.innerHTML = config.render(url, autoplay);
    block.classList.add(`embed-video-${config.id}`);
  } else if (/\.(mp4|webm|ogg|mov)$/i.test(url.pathname)) {
    block.innerHTML = embedFile(url, autoplay);
    block.classList.add('embed-video-file');
  } else {
    block.innerHTML = embedDefault(url);
  }
  block.classList.add('embed-video-is-loaded');
};

/**
 * loads and decorates the block
 * Authored: optional placeholder image and the video URL (link or plain text).
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const placeholder = block.querySelector('picture');
  const anchor = block.querySelector('a[href]');
  const link = anchor?.href || block.textContent.trim().split(/\s+/).find((t) => /^https?:\/\//.test(t));
  if (!link) return;
  block.textContent = '';

  if (placeholder) {
    const wrapper = document.createElement('div');
    wrapper.className = 'embed-video-placeholder';
    wrapper.innerHTML = '<div class="embed-video-placeholder-play"><button type="button" aria-label="Play video"></button></div>';
    wrapper.prepend(placeholder);
    wrapper.addEventListener('click', () => loadEmbed(block, link, true));
    block.append(wrapper);
  } else {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        loadEmbed(block, link);
      }
    });
    observer.observe(block);
  }
}
