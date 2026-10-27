import { primePowersUpTo } from '../math/numbers';
import { nonIsomorphicSingerSets, singerV } from '../math/singer';
import { diagramGallery } from '../viz/gallery';

const Q_VALUES = primePowersUpTo(32);

/**
 * `<div data-widget="singer-classes" data-q="3" data-url-state>`: a q selector
 * with a gallery of the distinct Singer classes. With `data-url-state`, q is
 * read from and written to the `?q=` query parameter.
 */
export function mount(el: HTMLElement): void {
  const useUrl = el.hasAttribute('data-url-state');
  const fromUrl = useUrl ? Number(new URLSearchParams(location.search).get('q')) : NaN;
  const initial = Q_VALUES.includes(fromUrl) ? fromUrl : Number(el.dataset.q ?? 3);

  const label = document.createElement('label');
  label.className = 'control';
  const select = document.createElement('select');
  select.id = 'q-select';
  for (const q of Q_VALUES) select.append(new Option(String(q), String(q)));
  label.append('q = ', select);

  const summary = document.createElement('p');
  summary.id = 'q-summary';
  summary.setAttribute('aria-live', 'polite');
  const output = document.createElement('div');
  output.id = 'q-gallery';

  const render = (q: number) => {
    const v = singerV(q);
    const classes = nonIsomorphicSingerSets(q);
    const noun = classes.length === 1 ? 'class' : 'classes';
    summary.textContent =
      `q = ${q}: (${v}, ${q + 1}, 1) difference sets mod ${v} — ` +
      `${classes.length} distinct ${noun} up to translation and negation.`;
    output.replaceChildren(diagramGallery(classes));
  };

  select.addEventListener('change', () => {
    const q = Number(select.value);
    render(q);
    if (useUrl) {
      const url = new URL(location.href);
      url.searchParams.set('q', String(q));
      history.replaceState(null, '', url);
    }
  });

  el.classList.add('widget');
  el.replaceChildren(label, summary, output);
  select.value = String(initial);
  render(initial);
}
