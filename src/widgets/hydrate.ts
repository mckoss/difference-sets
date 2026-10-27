// Mounts every `<div data-widget="name" …>` on the page. Each widget module
// loads only on pages that use it.

export interface WidgetModule {
  mount(el: HTMLElement): void;
}

const registry: Record<string, () => Promise<WidgetModule>> = {
  'chord-diagram': () => import('./chordDiagramWidget'),
  'singer-classes': () => import('./singerClasses'),
  'clock-mod': () => import('./clock'),
  'clock-difference': () => import('./clock'),
  'difference-workbench': () => import('./differenceWorkbench'),
  translates: () => import('./translates'),
  'brute-force-count': () => import('./bruteForceCount'),
  'fano-plane': () => import('./fanoPlane'),
  // Part VI–VII: the frontier and applications.
  'higher-singer': () => import('./higherSinger'),
  'video-facade': () => import('./videoFacade'),
  'match-cards': () => import('./matchCards'),
  'deck-maker': () => import('./deckMaker'),
  'coded-aperture': () => import('./codedAperture'),
  'echo-finder': () => import('./echoFinder'),
  'majority-decoder': () => import('./majorityDecoder'),
  'wake-up': () => import('./wakeUp'),
  'golomb-ruler': () => import('./golombRuler'),
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
