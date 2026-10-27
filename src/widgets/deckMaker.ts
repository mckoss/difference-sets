import { checkDeck, DECK_Q, type Deck, makeDeck, parseDeckParams, PRINT_SIZES, type PrintSize, shared } from '../math/deck';
import { mulberry32, newSeed, randomInt, type Rng } from '../math/random';
import { renderCard, symbolsFor } from './cards';
import { setText } from './format';

type Mode = 'cards' | 'play' | 'verify';
type Theme = 'all' | 'vehicles';

function button(text: string, cls: string): HTMLButtonElement {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = cls;
  b.textContent = text;
  return b;
}

function select(cls: string, options: [string, string][]): HTMLSelectElement {
  const s = document.createElement('select');
  s.className = cls;
  for (const [value, text] of options) s.append(new Option(text, value));
  return s;
}

const fmtTime = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

/**
 * `<div data-widget="deck-maker" data-url-state>`: build a match-one deck for
 * a chosen order q, browse its cards, play the matching game, verify the
 * deck, and print it. State lives in `?q=&theme=&seed=&size=`.
 */
export function mount(el: HTMLElement): void {
  const useUrl = el.hasAttribute('data-url-state');
  const params = useUrl ? parseDeckParams(location.search) : parseDeckParams('');
  let q = params.q;
  let theme: Theme = params.theme;
  let seed = params.seed ?? newSeed();
  let size: PrintSize = params.size;
  let mode: Mode = 'cards';
  let deck: Deck = makeDeck(q);
  let symbols = symbolsFor(deck.v, seed, theme);

  // Controls
  const controls = document.createElement('div');
  controls.className = 'controls';
  const qLabel = document.createElement('label');
  qLabel.className = 'control';
  const qSelect = select(
    'q-select',
    DECK_Q.map((n) => [String(n), `${n + 1} symbols per card (q = ${n}, ${n * n + n + 1} cards)`]),
  );
  qLabel.append(qSelect);
  const themeLabel = document.createElement('label');
  themeLabel.className = 'control';
  const themeSelect = select('theme-select', [
    ['all', 'Everything'],
    ['vehicles', 'Vehicles'],
  ]);
  themeLabel.append('Theme ', themeSelect);
  const shuffleBtn = button('Shuffle symbols', 'shuffle-button');
  const seedOut = document.createElement('span');
  seedOut.className = 'seed-out';
  controls.append(qLabel, themeLabel, shuffleBtn, seedOut);

  const themeNote = document.createElement('p');
  themeNote.className = 'hint theme-note';

  const modes = document.createElement('div');
  modes.className = 'controls mode-bar';
  modes.setAttribute('role', 'group');
  modes.setAttribute('aria-label', 'View');
  const modeButtons: Record<Mode, HTMLButtonElement> = {
    cards: button('Cards', 'mode-cards'),
    play: button('Play', 'mode-play'),
    verify: button('Verify', 'mode-verify'),
  };
  const printBtn = button('Print deck', 'print-button');
  const sizeLabel = document.createElement('label');
  sizeLabel.className = 'control';
  const sizeSelect = select(
    'size-select',
    Object.entries(PRINT_SIZES).map(([key, { label, mm, cols, rows }]) => [key, `${label} (${mm} mm, ${cols * rows} per page)`]),
  );
  sizeLabel.append('Print size ', sizeSelect);
  modes.append(modeButtons.cards, modeButtons.play, modeButtons.verify, printBtn, sizeLabel);

  const cardsPanel = document.createElement('div');
  cardsPanel.className = 'deck-grid';
  const playPanel = document.createElement('div');
  playPanel.className = 'deck-play';
  const verifyPanel = document.createElement('div');
  verifyPanel.className = 'deck-verify';
  const printSheet = document.createElement('div');
  printSheet.className = 'deck-print';
  printSheet.setAttribute('aria-hidden', 'true');

  // Play state
  const playRng: Rng = mulberry32(newSeed());
  let pair: [number, number] = [0, 1];
  let score = 0;
  let misses = 0;
  let started = 0;
  let timer: number | undefined;
  let locked = false;
  const status = document.createElement('p');
  status.className = 'play-status';
  const playMsg = document.createElement('p');
  playMsg.className = 'play-message';
  playMsg.setAttribute('aria-live', 'polite');
  const table = document.createElement('div');
  table.className = 'play-table';
  const restart = button('Restart', 'restart-button');
  const skip = button('New pair', 'skip-button');
  const playControls = document.createElement('div');
  playControls.className = 'controls';
  playControls.append(restart, skip);
  playPanel.append(status, table, playMsg, playControls);

  const writeUrl = () => {
    if (!useUrl) return;
    const url = new URL(location.href);
    url.searchParams.set('q', String(q));
    url.searchParams.set('theme', theme);
    url.searchParams.set('seed', String(seed));
    url.searchParams.set('size', size);
    history.replaceState(null, '', url);
  };

  const renderStatus = () => {
    status.textContent = `Score ${score} · Misses ${misses} · ${fmtTime(started ? Date.now() - started : 0)}`;
  };

  const deal = () => {
    const i = randomInt(playRng, deck.v);
    let j = randomInt(playRng, deck.v - 1);
    if (j >= i) j++;
    pair = [i, j];
    locked = false;
    table.replaceChildren(
      ...pair.map((c) => {
        const card = renderCard({
          points: deck.cards[c],
          symbols,
          interactive: true,
          index: c + 1,
          label: `Card ${c + 1}`,
        });
        card.dataset.card = String(c);
        return card;
      }),
    );
  };

  const startPlay = () => {
    score = 0;
    misses = 0;
    started = Date.now();
    playMsg.textContent = 'Find the one symbol on both cards and click it.';
    deal();
    renderStatus();
    window.clearInterval(timer);
    timer = window.setInterval(renderStatus, 1000);
  };

  table.addEventListener('click', (e) => {
    const sym = (e.target as Element).closest<HTMLElement>('.sym');
    if (!sym || locked) return;
    const p = Number(sym.dataset.point);
    const [match] = shared(deck.cards[pair[0]], deck.cards[pair[1]]);
    if (p === match) {
      score++;
      locked = true;
      for (const s of table.querySelectorAll<HTMLElement>(`.sym[data-point="${p}"]`)) s.classList.add('found');
      playMsg.textContent = `Yes: the ${symbols[p].name}.`;
      renderStatus();
      window.setTimeout(deal, 700);
    } else {
      misses++;
      sym.classList.remove('wrong');
      void sym.offsetWidth; // restart the flash animation
      sym.classList.add('wrong');
      playMsg.textContent = `The ${symbols[p].name} is only on one of the cards.`;
      renderStatus();
    }
  });
  table.addEventListener('animationend', (e) => (e.target as Element).classList.remove('wrong'));
  restart.addEventListener('click', startPlay);
  skip.addEventListener('click', deal);

  const renderCards = () => {
    cardsPanel.replaceChildren(
      ...deck.cards.map((points, j) => {
        const fig = document.createElement('figure');
        fig.className = 'deck-card';
        fig.append(renderCard({ points, symbols, index: j + 1, label: `Card ${j + 1}` }));
        const cap = document.createElement('figcaption');
        cap.textContent = `Card ${j + 1} = D + ${j}`;
        fig.append(cap);
        return fig;
      }),
    );
  };

  const renderVerify = () => {
    const check = checkDeck(deck.cards, deck.v);
    const ok = check.bad.length === 0;
    const k = q + 1;
    const rows = deck.cards.slice(0, Math.min(deck.v, 8)).map((pts, j) => {
      const li = document.createElement('li');
      li.textContent = `Card ${j + 1} = D + ${j} = ${setText([...pts].sort((a, b) => a - b))}: ${pts.map((p) => symbols[p].name).join(', ')}`;
      return li;
    });
    const set = document.createElement('p');
    set.className = 'verify-set';
    set.textContent = `D = ${setText(deck.set)} mod ${deck.v}, a (${deck.v}, ${k}, 1) difference set from Singer's construction with q = ${q}.`;
    const how = document.createElement('p');
    how.textContent = `Symbol number p goes on card j exactly when p is in the translate D + j. Each symbol was given a random picture.`;
    const list = document.createElement('ul');
    list.className = 'verify-cards';
    list.append(...rows);
    if (deck.v > rows.length) {
      const more = document.createElement('li');
      more.textContent = `… and so on, up to card ${deck.v - 1} = D + ${deck.v - 1}.`;
      list.append(more);
    }
    const result = document.createElement('p');
    result.className = `verdict verify-result ${ok ? 'ok' : 'bad'}`;
    result.textContent = ok
      ? `Checked all ${check.pairs.toLocaleString('en-US')} pairs of cards: every pair shares exactly one symbol. Every symbol is on ${k} cards.`
      : `${check.bad.length} of ${check.pairs} pairs do not share exactly one symbol.`;
    verifyPanel.replaceChildren(set, how, list, result);
  };

  const renderPrint = () => {
    printSheet.replaceChildren();
    const { mm, cols, rows } = PRINT_SIZES[size];
    printSheet.style.setProperty('--print-card', `${mm}mm`);
    printSheet.style.setProperty('--print-cols', String(cols));
    const perPage = cols * rows;
    for (let start = 0; start < deck.v; start += perPage) {
      const page = document.createElement('div');
      page.className = 'print-page';
      for (let j = start; j < Math.min(deck.v, start + perPage); j++) {
        page.append(
          renderCard({ points: deck.cards[j], symbols, eager: true, index: j + 1, label: `Card ${j + 1}` }),
        );
      }
      printSheet.append(page);
    }
  };

  const showMode = () => {
    for (const [m, b] of Object.entries(modeButtons)) b.setAttribute('aria-pressed', String(m === mode));
    cardsPanel.hidden = mode !== 'cards';
    playPanel.hidden = mode !== 'play';
    verifyPanel.hidden = mode !== 'verify';
    if (mode !== 'play') window.clearInterval(timer);
    if (mode === 'cards') renderCards();
    if (mode === 'play') startPlay();
    if (mode === 'verify') renderVerify();
  };

  const rebuild = () => {
    deck = makeDeck(q);
    symbols = symbolsFor(deck.v, seed, theme);
    qSelect.value = String(q);
    themeSelect.value = theme;
    sizeSelect.value = size;
    seedOut.textContent = `Seed ${seed}`;
    printSheet.replaceChildren();
    const vehicles = symbols.filter((s) => s.theme === 'vehicle').length;
    themeNote.textContent =
      theme === 'vehicles' && vehicles < deck.v
        ? `There are only ${vehicles} vehicle pictures, so ${deck.v - vehicles} other pictures fill out the ${deck.v} symbols.`
        : `${deck.v} cards with ${q + 1} symbols each, using ${deck.v} different symbols.`;
    writeUrl();
    showMode();
  };

  qSelect.addEventListener('change', () => {
    q = Number(qSelect.value);
    rebuild();
  });
  themeSelect.addEventListener('change', () => {
    theme = themeSelect.value === 'vehicles' ? 'vehicles' : 'all';
    rebuild();
  });
  shuffleBtn.addEventListener('click', () => {
    seed = newSeed();
    rebuild();
  });
  for (const [m, b] of Object.entries(modeButtons)) {
    b.addEventListener('click', () => {
      mode = m as Mode;
      showMode();
    });
  }
  sizeSelect.addEventListener('change', () => {
    size = sizeSelect.value as PrintSize;
    printSheet.replaceChildren();
    writeUrl();
  });
  printBtn.addEventListener('click', async () => {
    renderPrint();
    await Promise.all([...printSheet.querySelectorAll('img')].map((img) => img.decode().catch(() => undefined)));
    window.print();
  });
  window.addEventListener('beforeprint', () => {
    if (!printSheet.childElementCount) renderPrint();
  });

  el.classList.add('widget', 'deck-maker');
  el.replaceChildren(controls, themeNote, modes, cardsPanel, playPanel, verifyPanel, printSheet);
  rebuild();
}
