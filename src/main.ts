import { version } from '../package.json';
import { differenceCounts } from './math/difference';

function element<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing #${id}`);
  return el as T;
}

element('app-version').textContent = `v${version}`;

const set = [0, 1, 3];
const v = 7;
const pairs = set.flatMap((a) => set.filter((b) => b !== a).map((b) => `${a} − ${b} ≡ ${(((a - b) % v) + v) % v}`));
const counts = differenceCounts(set, v).slice(1);
element('demo').textContent = `${pairs.join(', ')} (mod 7) — counts for 1…6: ${counts.join(', ')}.`;
