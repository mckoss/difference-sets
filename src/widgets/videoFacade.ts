/**
 * `<div data-widget="video-facade" data-video="ID" data-title="…">`: a click-to-load
 * YouTube player. Until the reader clicks, the page makes no request to
 * YouTube; then it inserts a youtube-nocookie.com embed.
 */
export function mount(el: HTMLElement): void {
  const id = el.dataset.video ?? '';
  const title = el.dataset.title ?? 'Video';
  const by = el.dataset.by ?? '';

  const play = document.createElement('button');
  play.type = 'button';
  play.className = 'video-play';
  play.setAttribute('aria-label', `Play video: ${title}`);
  const icon = document.createElement('span');
  icon.className = 'video-icon';
  icon.setAttribute('aria-hidden', 'true');
  const text = document.createElement('span');
  text.className = 'video-text';
  const t = document.createElement('strong');
  t.textContent = title;
  const b = document.createElement('span');
  b.textContent = by;
  const note = document.createElement('small');
  note.textContent = 'Click to load the video from YouTube.';
  text.append(t, b, note);
  play.append(icon, text);

  play.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1`;
    frame.title = title;
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    play.replaceWith(frame);
    frame.focus();
  });

  const fallback = el.querySelector('a');
  el.classList.add('widget', 'video-facade');
  el.replaceChildren(play);
  if (fallback) {
    const p = document.createElement('p');
    p.className = 'video-link';
    p.append(fallback);
    el.append(p);
  }
}
