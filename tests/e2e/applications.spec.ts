import { expect, test } from './fixtures';

test.describe('lesson 16: higher-dimensional Singer sets', () => {
  test('parameters, flat tally, and shift register follow q and m', async ({ page }) => {
    await page.goto('lessons/16-beyond-the-plane/');
    const w = page.locator('[data-widget="higher-singer"]');
    await expect(w.locator('.singer-params')).toContainText('= 15 points');
    await expect(w.locator('.set-line')).toHaveText('D = {0, 1, 2, 4, 5, 8, 10} mod 15');
    await expect(w.locator('.register-bits .bit')).toHaveCount(15);
    await expect(w.locator('.register-bits .bit.zero')).toHaveCount(7);
    await expect(w.locator('.corr-note')).toContainText('= −1 at every other shift');
    await w.locator('.m-select').selectOption('5');
    await expect(w.locator('.singer-params')).toContainText('= 63 points');
    await expect(w.locator('.tally-note')).toContainText('exactly λ = 15 times');
    await w.locator('.q-select').selectOption('3');
    await w.locator('.m-select').selectOption('3');
    await expect(w.locator('.register-bits')).toHaveCount(0);
    await expect(w.locator('.singer-params')).toContainText('PG(3, 3)');
    await expect(w.locator('.tally-note')).toContainText('λ = 4');
  });
});

test.describe('lesson 18: a card game from a plane', () => {
  test('clicking two cards shows their one shared symbol', async ({ page }) => {
    await page.goto('lessons/18-a-card-game-from-a-plane/');
    const w = page.locator('[data-widget="match-cards"]').first();
    await expect(w.locator('.match-pick')).toHaveCount(7);
    await expect(w.locator('.match-card img').first()).toHaveAttribute('alt', /\w/);
    await w.locator('.match-pick[data-card="0"]').click();
    await w.locator('.match-pick[data-card="2"]').click();
    await expect(w.locator('.match-info')).toContainText('D + 0 = {0, 1, 3}');
    await expect(w.locator('.match-info')).toContainText('share one point, 3');
    await expect(w.locator('.sym.found')).toHaveCount(2);
    await w.locator('.numbers-toggle').check();
    await expect(w.locator('.point-tag').first()).toBeVisible();
  });

  test('the video loads only after a click', async ({ page }) => {
    const youtube: string[] = [];
    page.on('request', (r) => {
      if (/youtube|ytimg|googlevideo/.test(r.url())) youtube.push(r.url());
    });
    await page.route(/youtube-nocookie\.com/, (route) =>
      route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>stub</title>' }),
    );
    await page.goto('lessons/18-a-card-game-from-a-plane/');
    const v = page.locator('[data-widget="video-facade"]');
    await expect(v.locator('.video-play')).toBeVisible();
    await expect(page.locator('iframe')).toHaveCount(0);
    expect(youtube).toEqual([]);
    await v.locator('.video-play').click();
    await expect(v.locator('iframe')).toHaveAttribute('src', /youtube-nocookie\.com\/embed\/VTDKqW_GLkw/);
    await expect(v.locator('a[href*="youtube.com/watch"]')).toHaveCount(1);
  });
});

test.describe('match-one deck maker', () => {
  test('URL state picks q and theme, and controls write it back', async ({ page }) => {
    await page.goto('playgrounds/deck-maker/?q=3&theme=vehicles');
    const w = page.locator('[data-widget="deck-maker"]');
    await expect(w.locator('.q-select')).toHaveValue('3');
    await expect(w.locator('.theme-select')).toHaveValue('vehicles');
    await expect(w.locator('.deck-grid .match-card')).toHaveCount(13);
    await expect(w.locator('.deck-grid .match-card').first().locator('img')).toHaveCount(4);
    const first = await w.locator('.deck-grid .match-card').first().getAttribute('aria-label');
    await page.reload();
    await expect(w.locator('.deck-grid .match-card').first()).toHaveAttribute('aria-label', first!);

    await w.locator('.q-select').selectOption('11');
    await expect(w.locator('.deck-grid .match-card')).toHaveCount(133);
    await expect(page).toHaveURL(/q=11/);
    await expect(w.locator('.shuffle-button')).toHaveCount(0);
    await w.locator('.theme-select').selectOption('all');
    await expect(page).toHaveURL(/theme=all/);
  });

  test('the default deck is the same on every visit', async ({ page }) => {
    await page.goto('playgrounds/deck-maker/?seed=99');
    await expect(page).toHaveURL(/q=7&theme=all/);
    await expect(page).not.toHaveURL(/seed=/);
    const first = await page.locator('.deck-grid .match-card').first().getAttribute('aria-label');
    await page.goto('playgrounds/deck-maker/');
    await expect(page.locator('.deck-grid .match-card').first()).toHaveAttribute('aria-label', first!);
    await expect(page.locator('.deck-grid .match-card')).toHaveCount(57);
  });

  test('play mode: a wrong click flashes and counts a miss, the right one scores', async ({ page }) => {
    await page.goto('playgrounds/deck-maker/?q=4&theme=all');
    const w = page.locator('[data-widget="deck-maker"]');
    await w.locator('.mode-play').click();
    await expect(w.locator('.play-table .match-card')).toHaveCount(2);
    await expect(w.locator('.play-status')).toContainText('Score 0 · Misses 0');
    const points = async (n: number) =>
      w
        .locator('.play-table .match-card')
        .nth(n)
        .locator('.sym')
        .evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.point!));
    const a = await points(0);
    const b = await points(1);
    const match = a.filter((p) => b.includes(p));
    expect(match).toHaveLength(1);
    const wrong = a.find((p) => !b.includes(p))!;
    await w.locator(`.play-table .match-card >> nth=0 >> .sym[data-point="${wrong}"]`).click();
    await expect(w.locator('.play-status')).toContainText('Misses 1');
    await expect(w.locator('.play-message')).toContainText('only on one of the cards');
    await w.locator(`.play-table .match-card >> nth=1 >> .sym[data-point="${match[0]}"]`).click();
    await expect(w.locator('.play-status')).toContainText('Score 1');
    await expect(w.locator('.sym.found')).toHaveCount(2);
  });

  test('verify panel shows D and checks every pair', async ({ page }) => {
    await page.goto('playgrounds/deck-maker/?q=7&theme=all');
    const w = page.locator('[data-widget="deck-maker"]');
    await w.locator('.mode-verify').click();
    await expect(w.locator('.verify-set')).toContainText('mod 57, a (57, 8, 1) difference set');
    await expect(w.locator('.verify-result')).toHaveText(
      'Checked all 1,596 pairs of cards: every pair shares exactly one symbol. Every symbol is on 8 cards.',
    );
    await expect(w.locator('.verify-result')).toHaveClass(/ok/);
  });

  test('print size sets cards per page and is kept in the URL', async ({ page }) => {
    await page.goto('playgrounds/deck-maker/?q=3&theme=all');
    await page.evaluate(() => {
      window.print = () => undefined;
    });
    const w = page.locator('.deck-maker');
    await expect(w.locator('.size-select')).toHaveValue('medium');
    for (const [size, pages] of [['small', 2], ['large', 4], ['medium', 3]] as const) {
      await w.locator('.size-select').selectOption(size);
      await expect(page).toHaveURL(new RegExp(`size=${size}`));
      await w.locator('.print-button').click();
      await expect(page.locator('.deck-print .print-page')).toHaveCount(pages);
      await expect(page.locator('.deck-print .match-card')).toHaveCount(13);
    }
  });

  test('print deck lays out every card for printing', async ({ page }) => {
    await page.goto('playgrounds/deck-maker/?q=3&theme=all');
    await page.evaluate(() => {
      window.print = () => document.body.setAttribute('data-printed', '');
    });
    await page.locator('.print-button').click();
    await expect(page.locator('body')).toHaveAttribute('data-printed', '');
    await expect(page.locator('.deck-print .print-page')).toHaveCount(3);
    await expect(page.locator('.deck-print .match-card')).toHaveCount(13);
    await expect(page.locator('.deck-print .match-card .card-credit').first()).toHaveText('http://mckoss.com/difference-sets');
    await expect(page.locator('.deck-print .match-card .card-index').first()).toHaveText('1');
    await expect(page.locator('.deck-print .match-card .card-index').last()).toHaveText('13');
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('.deck-print')).toBeVisible();
    await expect(page.locator('.deck-grid')).toBeHidden();
    await expect(page.locator('.site-header')).toBeHidden();
  });
});

test.describe('applications on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const path of [
    'lessons/16-beyond-the-plane/',
    'lessons/17-every-planar-set-singer/',
    'lessons/18-a-card-game-from-a-plane/',
    'lessons/19-pictures-without-a-lens/',
    'lessons/20-finding-an-echo/',
    'lessons/21-majority-rules/',
    'lessons/22-always-meet/',
    'lessons/23-a-ruler-with-no-repeats/',
    'playgrounds/deck-maker/?q=11&theme=all',
  ]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await page.locator('h1').waitFor();
      await page.waitForLoadState('networkidle');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test('deck maker play mode fits two cards side by side', async ({ page }) => {
    await page.goto('playgrounds/deck-maker/?q=7&theme=all');
    await page.locator('.mode-play').click();
    const boxes = await page.locator('.play-table .match-card').evaluateAll((els) =>
      els.map((e) => e.getBoundingClientRect().toJSON() as DOMRect),
    );
    expect(boxes).toHaveLength(2);
    expect(boxes[0].y).toBeCloseTo(boxes[1].y, 0);
    expect(boxes[1].right).toBeLessThanOrEqual(390);
  });
});
