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
  'race-chart': () => import('./raceChart'),
  // Lesson 17 and the search and explorer playgrounds.
  'planar-search': () => import('./planarSearch'),
  'large-q-explorer': () => import('./largeQExplorer'),
  'polynomial-identity': () => import('./polynomialIdentity'),
  'plane-orders': () => import('./planeOrders'),
  'bruck-ryser': () => import('./planeOrders'),
  // Part III: finite fields
  'zn-tables': () => import('./znTables'),
  'zn-clock': () => import('./znClock'),
  euclid: () => import('./euclid'),
  'scrambled-field': () => import('./scrambledField'),
  'gf-tables': () => import('./gfTables'),
  'poly-division': () => import('./polyDivision'),
  powers: () => import('./powers'),
  frobenius: () => import('./frobenius'),
  'field-isomorphism': () => import('./fieldIsomorphism'),
  'field-calculator': () => import('./fieldCalculator'),
  // Part IV: planes from fields
  'vector-grid': () => import('./vectorGrid'),
  'pg2-explorer': () => import('./pg2Explorer'),
  'field-points': () => import('./fieldPoints'),
  'singer-cycle': () => import('./singerCycle'),
  // Part V: Singer's algorithm
  'singer-stepper': () => import('./singerStepper'),
  'multiplier-explorer': () => import('./multiplierExplorer'),
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
