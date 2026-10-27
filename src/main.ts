import { version } from '../package.json';
import { primePowersUpTo } from './math/numbers';
import { nonIsomorphicSingerSets, singerV } from './math/singer';
import { diagramGallery } from './viz/gallery';

function element<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing #${id}`);
  return el as T;
}

element('app-version').textContent = `v${version}`;

const select = element<HTMLSelectElement>('q-select');
const summary = element('q-summary');
const output = element('q-gallery');

for (const q of primePowersUpTo(32)) select.append(new Option(String(q), String(q)));

function render(q: number): void {
  const v = singerV(q);
  const classes = nonIsomorphicSingerSets(q);
  const noun = classes.length === 1 ? 'class' : 'classes';
  summary.textContent =
    `q = ${q}: (${v}, ${q + 1}, 1) difference sets mod ${v} — ` +
    `${classes.length} distinct ${noun} up to multiplication, translation, and negation.`;
  output.replaceChildren(diagramGallery(classes));
}

select.addEventListener('change', () => render(Number(select.value)));
select.value = '3';
render(3);
