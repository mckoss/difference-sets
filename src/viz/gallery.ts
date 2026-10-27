import { chordDiagram } from './chordDiagram';

/**
 * A wrapping row of chord diagrams, one per difference set. Ported from the
 * notebook's `display_multiple_difference_sets`.
 */
export function diagramGallery(sets: readonly (readonly number[])[]): HTMLElement {
  const gallery = document.createElement('div');
  gallery.className = 'gallery';
  for (const ds of sets) {
    const figure = document.createElement('figure');
    const caption = document.createElement('figcaption');
    caption.textContent = `{${ds.join(', ')}}`;
    figure.append(chordDiagram(ds), caption);
    gallery.append(figure);
  }
  return gallery;
}
