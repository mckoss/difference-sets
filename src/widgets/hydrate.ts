// Mounts every `<div data-widget="name" …>` on the page. Each widget module
// loads only on pages that use it.

export interface WidgetModule {
  mount(el: HTMLElement): void;
}

const registry: Record<string, () => Promise<WidgetModule>> = {
  'chord-diagram': () => import('./chordDiagramWidget'),
  'singer-classes': () => import('./singerClasses'),
};

for (const el of document.querySelectorAll<HTMLElement>('[data-widget]')) {
  const name = el.dataset.widget ?? '';
  const load = registry[name];
  if (!load) {
    console.error(`Unknown widget "${name}"`);
    continue;
  }
  load().then((m) => m.mount(el));
}
