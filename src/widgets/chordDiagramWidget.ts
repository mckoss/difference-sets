import { chordDiagram } from '../viz/chordDiagram';

/** `<div data-widget="chord-diagram" data-set="0,1,3">`: a single static chord diagram. */
export function mount(el: HTMLElement): void {
  const set = (el.dataset.set ?? '').split(',').map(Number);
  el.classList.add('widget', 'widget-chord');
  el.replaceChildren(chordDiagram(set));
}
